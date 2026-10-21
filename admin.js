(() => {
  "use strict";

  const STORAGE_KEY = "hamad-town-school-content-v1";
  const config = window.SCHOOL_CONFIG || {};
  const hasBackend = Boolean(config.supabaseUrl && config.supabaseAnonKey &&
    /^https:\/\//.test(config.supabaseUrl) && !config.supabaseUrl.includes("YOUR_PROJECT"));
  const supabaseClient = hasBackend && window.supabase?.createClient
    ? window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey)
    : null;

  let items = [];
  let currentSession = null;
  let pendingImageFile = null;
  let pendingImageData = "";
  let previewUrl = "";
  let busy = false;

  const $ = id => document.getElementById(id);
  const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  const kinds = {
    about: "School identity", achievement: "Student achievement", award: "Award",
    activity: "Activity", story: "School story", teacher: "Teacher spotlight",
    student: "Student spotlight", event: "School event", gallery: "Gallery photo"
  };
  const sectionLabels = {
    "our-story": "Our story", achievements: "Achievements",
    "school-life": "School life", stories: "Stories", gallery: "Gallery"
  };
  const sectionKinds = {
    "our-story": ["about"],
    achievements: ["achievement", "award"],
    "school-life": ["activity", "event"],
    stories: ["story", "teacher", "student"],
    gallery: ["gallery"]
  };
  const kindSections = {
    about: "our-story", achievement: "achievements", award: "achievements",
    activity: "school-life", event: "school-life", story: "stories",
    teacher: "stories", student: "stories", gallery: "gallery"
  };

  function sectionForKind(kind) {
    return kindSections[kind] || "stories";
  }

  function sectionForItem(item) {
    const candidate = item.section || sectionForKind(item.kind || item.category || "story");
    return Object.prototype.hasOwnProperty.call(sectionKinds, candidate) ? candidate : sectionForKind(item.kind || item.category || "story");
  }

  function populateKindOptions(section, selectedKind) {
    const select = $("contentKind");
    if (!select) return;
    const allowed = sectionKinds[section] || sectionKinds.achievements;
    const current = selectedKind || select.value;
    select.innerHTML = allowed.map(kind =>
      '<option value="' + escapeHtml(kind) + '">' + escapeHtml(kinds[kind] || kind) + '</option>'
    ).join("");
    select.value = allowed.includes(current) ? current : allowed[0];
  }

  function syncLayoutControl(selectedLayout) {
    const field = $("contentLayoutField");
    const select = $("contentLayout");
    if (!field || !select) return;
    const supportsLayout = $("contentSection").value === "our-story";
    field.hidden = !supportsLayout;
    if (supportsLayout && selectedLayout) select.value = selectedLayout;
    if (!supportsLayout) select.value = "standard";
  }

  function syncAchievementFields() {
    const field = $("achievementDetailsFields");
    if (!field) return;
    field.hidden = !($("contentSection").value === "achievements" &&
      ["achievement", "award"].includes($("contentKind").value));
  }

  function readAchievementFields() {
    if ($("contentSection").value !== "achievements") {
      return {
        recipient_ar: "", recipient_en: "",
        achievement_event_ar: "", achievement_event_en: "",
        achievement_result_ar: "", achievement_result_en: "",
        achievement_organization_ar: "", achievement_organization_en: "",
        achievement_date: "", achievement_highlights_ar: "", achievement_highlights_en: ""
      };
    }
    return {
      recipient_ar: $("achievementRecipient").value.trim(),
      recipient_en: $("achievementRecipientEn").value.trim(),
      achievement_event_ar: $("achievementEvent").value.trim(),
      achievement_event_en: $("achievementEventEn").value.trim(),
      achievement_result_ar: $("achievementResult").value.trim(),
      achievement_result_en: $("achievementResultEn").value.trim(),
      achievement_organization_ar: $("achievementOrganization").value.trim(),
      achievement_organization_en: $("achievementOrganizationEn").value.trim(),
      achievement_date: $("achievementDate").value,
      achievement_highlights_ar: $("achievementHighlights").value.trim(),
      achievement_highlights_en: $("achievementHighlightsEn").value.trim()
    };
  }

  function syncActivityFields() {
    const field = $("activityDetailsFields");
    if (!field) return;
    field.hidden = !($("contentSection").value === "school-life" &&
      ["activity", "event"].includes($("contentKind").value));
  }

  function readActivityFields() {
    const keys = {
      activity_date: "activityDate",
      activity_time: "activityTime",
      activity_location_ar: "activityLocation",
      activity_location_en: "activityLocationEn",
      activity_organizer_ar: "activityOrganizer",
      activity_organizer_en: "activityOrganizerEn",
      activity_audience_ar: "activityAudience",
      activity_audience_en: "activityAudienceEn",
      activity_duration_ar: "activityDuration",
      activity_duration_en: "activityDurationEn",
      activity_goals_ar: "activityGoals",
      activity_goals_en: "activityGoalsEn",
      activity_outcomes_ar: "activityOutcomes",
      activity_outcomes_en: "activityOutcomesEn",
      activity_details_ar: "activityDetails",
      activity_details_en: "activityDetailsEn"
    };
    const isSchoolLife = $("contentSection").value === "school-life" &&
      ["activity", "event"].includes($("contentKind").value);
    return Object.fromEntries(Object.entries(keys).map(([column, id]) => [
      column, isSchoolLife ? ($(id)?.value.trim() || "") : ""
    ]));
  }

  function showToast(message) {
    const toast = $("adminToast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("visible"), 4500);
  }

  function setMessage(message, error = false, target = "formMessage") {
    const el = $(target);
    if (!el) return;
    el.textContent = message;
    el.classList.toggle("error", error);
  }

  function setBusy(value) {
    busy = value;
    $("saveContentBtn").disabled = value;
    $("saveContentBtn").style.opacity = value ? ".65" : "1";
    $("saveContentBtn").innerHTML = value ? "Saving…" : 'Save content <span>↗</span>';
  }

  function normalizeRecord(item) {
    const title = item.title || "";
    const description = item.description || "";
    const eyebrow = item.eyebrow || item.label || "";
    const toArabic = value => window.HamadI18n?.toArabic(value) || value;
    const toEnglish = value => window.HamadI18n?.toEnglish(value) || value;
    return {
      ...item,
      section: item.section || sectionForKind(item.kind || item.category || "story"),
      layout: item.layout === "feature" ? "feature" : "standard",
      title_ar: item.title_ar || toArabic(title),
      title_en: item.title_en || toEnglish(title),
      description_ar: item.description_ar || toArabic(description),
      description_en: item.description_en || toEnglish(description),
      eyebrow_ar: item.eyebrow_ar || toArabic(eyebrow),
      eyebrow_en: item.eyebrow_en || toEnglish(eyebrow)
    };
  }

  function displayText(item, field) {
    const arabic = item[field + "_ar"] || item[field] || "";
    const english = item[field + "_en"] || item[field] || arabic;
    return window.HamadI18n?.getLanguage() === "en" ? (english || arabic) : (arabic || english);
  }

  function readDemoItems() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const records = JSON.parse(stored);
        const migrationKey = "hamad-town-about-content-migrated-v1";
        if (!localStorage.getItem(migrationKey)) {
          const existingIds = new Set(records.map(item => String(item.id)));
          const defaults = (window.HAMAD_SEED_ITEMS || []).filter(item => item.section === "our-story");
          records.push(...defaults.filter(item => !existingIds.has(String(item.id))).map(item => ({ ...item })));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
          localStorage.setItem(migrationKey, "done");
        }
        return records.map(normalizeRecord);
      }
    } catch (error) {
      console.warn("Cannot read local school content.", error);
    }
    try { localStorage.setItem("hamad-town-about-content-migrated-v1", "done"); } catch (_) {}
    return (window.HAMAD_SEED_ITEMS || []).map(item => normalizeRecord({ ...item }));
  }

  function updateMetrics() {
    $("totalCount").textContent = String(items.length);
    $("publishedCount").textContent = String(items.filter(item => item.published !== false).length);
    $("draftCount").textContent = String(items.filter(item => item.published === false).length);
    $("libraryCount").textContent = String(items.length);
  }

  function safePreviewUrl(value) {
    const url = String(value || "").trim();
    return /^(https:\/\/|data:image\/|\.\/|\/)/i.test(url) ? url : "";
  }

  function renderImagePreview(src) {
    const preview = $("imagePreview");
    const safe = safePreviewUrl(src);
    if (!safe) {
      preview.innerHTML = '<span>▧</span><p>Image preview will appear here</p>';
      return;
    }
    preview.innerHTML = '<img src="' + escapeHtml(safe) + '" alt="Selected image preview">';
  }

  function renderRecords() {
    const container = $("recordList");
    const q = $("searchContent").value.trim().toLowerCase();
    const kind = $("filterKind").value;
    const section = $("filterSection").value;
    const filtered = items.filter(item => {
      const matchesKind = kind === "all" || (item.kind || item.category) === kind;
      const matchesSection = section === "all" || sectionForItem(item) === section;
      const haystack = [item.title, item.title_ar, item.title_en, item.description, item.description_ar, item.description_en, item.eyebrow, item.eyebrow_ar, item.eyebrow_en, item.year, item.kind, item.section, item.recipient_ar, item.recipient_en,
        item.achievement_event_ar, item.achievement_event_en, item.achievement_result_ar, item.achievement_result_en,
        item.achievement_organization_ar, item.achievement_organization_en, item.achievement_date,
        item.achievement_highlights_ar, item.achievement_highlights_en,
        item.activity_date, item.activity_time, item.activity_location_ar, item.activity_location_en,
        item.activity_organizer_ar, item.activity_organizer_en, item.activity_audience_ar, item.activity_audience_en,
        item.activity_duration_ar, item.activity_duration_en, item.activity_goals_ar, item.activity_goals_en,
        item.activity_outcomes_ar, item.activity_outcomes_en, item.activity_details_ar, item.activity_details_en].join(" ").toLowerCase();
      return matchesKind && matchesSection && haystack.includes(q);
    });

    if (!filtered.length) {
      container.innerHTML = '<div class="empty-state">No entries match this view yet. Add a story using the editor.</div>';
      updateMetrics();
      return;
    }

    container.innerHTML = filtered.map(item => {
      const img = safePreviewUrl(item.image_url || item.imageUrl);
      const kindKey = item.kind || item.category || "story";
      const status = item.published === false
        ? '<span class="record-status status-draft">Draft</span>'
        : '<span class="record-status">Published</span>';
      const image = img
        ? '<div class="record-thumb"><img src="' + escapeHtml(img) + '" alt="" loading="lazy"></div>'
        : '<div class="record-thumb">✦</div>';
      const description = String(displayText(item, "description") || "").slice(0, 125);
      const title = displayText(item, "title") || "Untitled entry";
      return '<article class="record-item">' + image +
        '<div class="record-copy"><span class="record-type">' + escapeHtml(sectionLabels[sectionForItem(item)] || "Stories") + ' · ' + escapeHtml(kinds[kindKey] || kindKey) + '</span>' +
        '<h3>' + escapeHtml(title) + '</h3><p>' + escapeHtml(description) + '</p>' + status + '</div>' +
        '<div class="record-actions"><button type="button" data-action="edit" data-id="' + escapeHtml(item.id) + '">Edit</button>' +
        '<button type="button" class="delete-record" data-action="delete" data-id="' + escapeHtml(item.id) + '">Delete</button></div></article>';
    }).join("");
    updateMetrics();
  }

  function resetForm() {
    $("contentForm").reset();
    $("contentId").value = "";
    $("contentSection").value = "achievements";
    populateKindOptions("achievements", "achievement");
    syncLayoutControl("standard");
    ["achievementRecipient", "achievementRecipientEn", "achievementEvent", "achievementEventEn",
      "achievementResult", "achievementResultEn", "achievementOrganization", "achievementOrganizationEn",
      "achievementDate", "achievementHighlights", "achievementHighlightsEn",
      "activityDate", "activityTime", "activityLocation", "activityLocationEn",
      "activityOrganizer", "activityOrganizerEn", "activityAudience", "activityAudienceEn",
      "activityDuration", "activityDurationEn", "activityGoals", "activityGoalsEn",
      "activityOutcomes", "activityOutcomesEn", "activityDetails", "activityDetailsEn"
    ].forEach(id => { if ($(id)) $(id).value = ""; });
    syncAchievementFields();
    syncActivityFields();
    $("contentFeatured").checked = true;
    $("contentPublished").checked = true;
    $("editorTitle").textContent = "Add a new story";
    $("contentImageFile").value = "";
    $("contentImageUrl").value = "";
    pendingImageFile = null;
    pendingImageData = "";
    previewUrl = "";
    renderImagePreview("");
    setMessage("");
  }

  function editRecord(id) {
    const record = items.find(item => String(item.id) === String(id));
    if (!record) return;
    $("contentId").value = record.id || "";
    const recordKind = record.kind || record.category || "story";
    const recordSection = sectionForItem(record);
    $("contentSection").value = recordSection;
    populateKindOptions(recordSection, recordKind);
    syncLayoutControl(record.layout || "standard");
    syncAchievementFields();
    $("achievementRecipient").value = record.recipient_ar || "";
    $("achievementRecipientEn").value = record.recipient_en || "";
    $("achievementEvent").value = record.achievement_event_ar || "";
    $("achievementEventEn").value = record.achievement_event_en || "";
    $("achievementResult").value = record.achievement_result_ar || "";
    $("achievementResultEn").value = record.achievement_result_en || "";
    $("achievementOrganization").value = record.achievement_organization_ar || "";
    $("achievementOrganizationEn").value = record.achievement_organization_en || "";
    $("achievementDate").value = record.achievement_date || "";
    $("achievementHighlights").value = record.achievement_highlights_ar || "";
    $("achievementHighlightsEn").value = record.achievement_highlights_en || "";
    $("activityDate").value = record.activity_date || "";
    $("activityTime").value = record.activity_time || "";
    $("activityLocation").value = record.activity_location_ar || "";
    $("activityLocationEn").value = record.activity_location_en || "";
    $("activityOrganizer").value = record.activity_organizer_ar || "";
    $("activityOrganizerEn").value = record.activity_organizer_en || "";
    $("activityAudience").value = record.activity_audience_ar || "";
    $("activityAudienceEn").value = record.activity_audience_en || "";
    $("activityDuration").value = record.activity_duration_ar || "";
    $("activityDurationEn").value = record.activity_duration_en || "";
    $("activityGoals").value = record.activity_goals_ar || "";
    $("activityGoalsEn").value = record.activity_goals_en || "";
    $("activityOutcomes").value = record.activity_outcomes_ar || "";
    $("activityOutcomesEn").value = record.activity_outcomes_en || "";
    $("activityDetails").value = record.activity_details_ar || "";
    $("activityDetailsEn").value = record.activity_details_en || "";
    syncActivityFields();
    $("contentYear").value = record.year || "";
    $("contentTitle").value = record.title_ar || record.title || "";
    $("contentTitleEn").value = record.title_en || record.title || "";
    $("contentEyebrow").value = record.eyebrow_ar || record.eyebrow || "";
    $("contentEyebrowEn").value = record.eyebrow_en || record.eyebrow || "";
    $("contentDescription").value = record.description_ar || record.description || "";
    $("contentDescriptionEn").value = record.description_en || record.description || "";
    $("contentImageUrl").value = record.image_url || record.imageUrl || "";
    $("contentFeatured").checked = record.featured !== false;
    $("contentPublished").checked = record.published !== false;
    $("editorTitle").textContent = "Edit school content";
    pendingImageFile = null;
    pendingImageData = "";
    previewUrl = record.image_url || "";
    renderImagePreview(previewUrl);
    setMessage("Editing: " + (displayText(record, "title") || "Untitled entry"));
    $("contentForm").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function uploadImageIfNeeded() {
    if (!pendingImageFile) return $("contentImageUrl").value.trim();
    if (!supabaseClient) return pendingImageData;

    if (!currentSession?.user?.id) throw new Error("Please sign in before uploading a photo.");
    const file = pendingImageFile;
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "school-photo";
    const path = currentSession.user.id + "/" + Date.now() + "-" + safeName;
    const { error } = await supabaseClient.storage.from("school-media").upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false
    });
    if (error) throw error;
    const { data } = supabaseClient.storage.from("school-media").getPublicUrl(path);
    return data.publicUrl;
  }

  async function persistRecord(record) {
    if (!supabaseClient) {
      const index = items.findIndex(item => String(item.id) === String(record.id));
      const updated = [...items];
      if (index >= 0) updated[index] = record;
      else updated.unshift(record);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        if (error?.name === "QuotaExceededError") {
          throw new Error("Browser storage is full. Try a smaller image (under 1 MB) or connect Supabase.");
        }
        throw error;
      }
      items = updated;
      return;
    }

    const { id, ...payload } = record;
    let result;
    if (id && !String(id).startsWith("demo-") && !String(id).startsWith("seed-")) {
      result = await supabaseClient.from("school_content").update(payload).eq("id", id).select().single();
    } else {
      result = await supabaseClient.from("school_content").insert(payload).select().single();
    }
    if (result.error) throw result.error;
    const saved = result.data;
    const index = items.findIndex(item => String(item.id) === String(id));
    if (index >= 0) items[index] = saved;
    else items.unshift(saved);
  }

  async function deleteRecord(id) {
    const record = items.find(item => String(item.id) === String(id));
    const isArabic = window.HamadI18n?.getLanguage() === "ar";
    const entryLabel = (record && displayText(record, "title")) || (isArabic ? "هذا المحتوى" : "this entry");
    const confirmText = isArabic
      ? 'هل تريد حذف "' + entryLabel + '"؟ لا يمكن التراجع عن هذا الإجراء.'
      : 'Delete "' + entryLabel + '"? This cannot be undone.';
    if (!record || !window.confirm(confirmText)) return;
    try {
      if (supabaseClient) {
        if (!currentSession) throw new Error("Please sign in before deleting content.");
        const { error } = await supabaseClient.from("school_content").delete().eq("id", id);
        if (error) throw error;
      } else {
        const updated = items.filter(item => String(item.id) !== String(id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      items = items.filter(item => String(item.id) !== String(id));
      if ($("contentId").value === String(id)) resetForm();
      renderRecords();
      showToast("Content deleted.");
    } catch (error) {
      showToast(error.message || "Could not delete this entry.");
    }
  }

  async function loadBackendItems() {
    const { data, error } = await supabaseClient.from("school_content").select("*").order("order_index", { ascending: true });
    if (error) {
      setMessage("Could not read the shared content library. " + error.message, true);
      items = [];
    } else {
      items = (data || []).map(normalizeRecord);
    }
    renderRecords();
  }

  function showWorkspace() {
    $("backendLogin").hidden = true;
    $("adminWorkspace").hidden = false;
    $("demoBanner").hidden = true;
    $("signOutBtn").hidden = false;
  }

  function showLogin(message = "", error = false) {
    $("adminWorkspace").hidden = true;
    $("backendLogin").hidden = false;
    $("demoBanner").hidden = true;
    $("signOutBtn").hidden = true;
    if (message) setMessage(message, error, "loginMessage");
  }

  async function activateAdminSession(session) {
    if (!session || !supabaseClient) {
      currentSession = null;
      showLogin();
      return false;
    }

    const { data: isAdmin, error } = await supabaseClient.rpc("is_school_admin");
    if (error) throw error;
    if (isAdmin !== true) {
      await supabaseClient.auth.signOut();
      currentSession = null;
      items = [];
      showLogin("هذا الحساب غير مخوّل لإدارة محتوى المدرسة.", true);
      return false;
    }

    currentSession = session;
    showWorkspace();
    await loadBackendItems();
    return true;
  }

  function setupImageInputs() {
    $("contentImageUrl").addEventListener("input", event => {
      pendingImageFile = null;
      pendingImageData = "";
      previewUrl = event.target.value.trim();
      renderImagePreview(previewUrl);
    });
    $("contentImageFile").addEventListener("change", () => {
      const file = $("contentImageFile").files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setMessage("Please select a supported image file.", true);
        return;
      }
      const max = supabaseClient ? 8 * 1024 * 1024 : 1024 * 1024;
      if (file.size > max) {
        setMessage(supabaseClient ? "Please choose an image smaller than 8 MB." : "Demo mode supports images up to 1 MB. Connect Supabase for larger uploads.", true);
        $("contentImageFile").value = "";
        return;
      }
      pendingImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        pendingImageData = String(reader.result || "");
        previewUrl = pendingImageData;
        renderImagePreview(previewUrl);
      };
      reader.onerror = () => setMessage("The selected image could not be read.", true);
      reader.readAsDataURL(file);
    });
  }

  function setupForm() {
    $("contentForm").addEventListener("submit", async event => {
      event.preventDefault();
      if (busy) return;
      const titleAr = $("contentTitle").value.trim();
      const titleEn = $("contentTitleEn").value.trim();
      const descriptionAr = $("contentDescription").value.trim();
      const descriptionEn = $("contentDescriptionEn").value.trim();
      const layout = $("contentSection").value === "our-story" ? $("contentLayout").value : "standard";
      const hasImage = Boolean($("contentImageUrl").value.trim() || pendingImageFile);
      if (layout === "feature" && !hasImage) {
        setMessage("Please add a photo for the large image-and-text card.", true);
        return;
      }
      if (!titleAr || !titleEn || !descriptionAr || !descriptionEn) {
        setMessage("Please complete both Arabic and English titles and descriptions.", true);
        return;
      }
      if (supabaseClient && !currentSession) {
        setMessage("Please sign in before publishing.", true);
        return;
      }
      setBusy(true);
      setMessage("Saving your entry…");
      try {
        const imageUrl = await uploadImageIfNeeded();
        const id = $("contentId").value || "demo-" + Date.now();
        const existing = items.find(item => String(item.id) === String(id));
        const kind = $("contentKind").value;
        const achievementFields = readAchievementFields();
        const activityFields = readActivityFields();
        const defaultTypeEnglish = kinds[kind] || "School story";
        const defaultTypeArabic = window.HamadI18n?.toArabic(defaultTypeEnglish) || defaultTypeEnglish;
        const eyebrowAr = $("contentEyebrow").value.trim() || defaultTypeArabic;
        const eyebrowEn = $("contentEyebrowEn").value.trim() || defaultTypeEnglish;
        const record = {
          id,
          section: $("contentSection").value,
          layout,
          kind,
          ...achievementFields,
          ...activityFields,
          title: titleAr,
          title_ar: titleAr,
          title_en: titleEn,
          eyebrow: eyebrowAr,
          eyebrow_ar: eyebrowAr,
          eyebrow_en: eyebrowEn,
          year: $("contentYear").value.trim(),
          description: descriptionAr,
          description_ar: descriptionAr,
          description_en: descriptionEn,
          image_url: imageUrl,
          featured: $("contentFeatured").checked,
          published: $("contentPublished").checked,
          order_index: existing?.order_index ?? (items.reduce((max, item) => Math.max(max, Number(item.order_index) || 0), 0) + 1)
        };
        await persistRecord(record);
        renderRecords();
        resetForm();
        setMessage("Saved successfully.");
        $("saveStatus").textContent = "Saved just now";
        showToast(supabaseClient ? "Content saved to the shared school website." : "Saved in this browser. Connect Supabase to publish to everyone.");
      } catch (error) {
        console.error("Content save failed.", error);
        setMessage(error.message || "The content could not be saved.", true);
      } finally {
        setBusy(false);
      }
    });

    $("contentSection").addEventListener("change", () => {
      populateKindOptions($("contentSection").value);
      syncLayoutControl("standard");
      syncAchievementFields();
      syncActivityFields();
    });
    $("contentKind").addEventListener("change", () => {
      syncAchievementFields();
      syncActivityFields();
    });
    $("resetFormBtn").addEventListener("click", resetForm);
    $("searchContent").addEventListener("input", renderRecords);
    $("filterSection").addEventListener("change", renderRecords);
    $("filterKind").addEventListener("change", renderRecords);
    $("recordList").addEventListener("click", event => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const id = button.getAttribute("data-id");
      if (button.dataset.action === "edit") editRecord(id);
      if (button.dataset.action === "delete") deleteRecord(id);
    });
    $("exportBtn").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hamad-town-school-content.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("Content export downloaded.");
    });
  }

  function setupAuth() {
    const loginForm = $("loginForm");
    const submit = loginForm.querySelector('button[type="submit"]');

    if (!supabaseClient) {
      loginForm.querySelectorAll("input, button").forEach(control => { control.disabled = true; });
      showLogin("يلزم إعداد Supabase أولًا لإتاحة تسجيل الدخول الآمن. أضف Project URL و anon/public key في config.js ثم طبّق supabase/schema.sql.");
      return;
    }

    loginForm.addEventListener("submit", async event => {
      event.preventDefault();
      setMessage("", false, "loginMessage");
      const email = $("loginEmail").value.trim();
      const password = $("loginPassword").value;
      submit.disabled = true;
      submit.textContent = "جارٍ التحقق…";
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const authorized = await activateAdminSession(data.session);
        if (authorized) showToast("تم تسجيل الدخول إلى بوابة إدارة المدرسة.");
      } catch (error) {
        currentSession = null;
        showLogin("تعذّر تسجيل الدخول أو التحقق من صلاحيات الإدارة. تحقق من بيانات الحساب وإضافته إلى قائمة مديري المدرسة.", true);
      } finally {
        submit.disabled = false;
        submit.innerHTML = 'تسجيل الدخول بأمان <span>→</span>';
      }
    });

    $("signOutBtn").addEventListener("click", async () => {
      try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        currentSession = null;
        items = [];
        showLogin("تم تسجيل الخروج.");
      } catch (error) {
        showToast("تعذّر تسجيل الخروج. حاول مرة أخرى.");
      }
    });

    supabaseClient.auth.onAuthStateChange(event => {
      if (event === "SIGNED_OUT") {
        currentSession = null;
        items = [];
        showLogin();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    setupImageInputs();
    populateKindOptions($("contentSection").value || "achievements", "achievement");
    syncLayoutControl("standard");
    syncAchievementFields();
    syncActivityFields();
    setupForm();
    setupAuth();
    window.addEventListener("hamad-language-change", renderRecords);

    if (!supabaseClient) return;

    showLogin();
    try {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) throw error;
      if (data.session) await activateAdminSession(data.session);
    } catch (error) {
      currentSession = null;
      showLogin("تعذّر التحقق من جلسة الدخول. حدّث الصفحة وحاول مرة أخرى.", true);
    }
  });
})();

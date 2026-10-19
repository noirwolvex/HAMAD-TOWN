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
    achievement: "Achievement", award: "Award", activity: "Activity",
    story: "School story", teacher: "Teacher spotlight", student: "Student spotlight",
    event: "School event", gallery: "Gallery photo"
  };

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

  function readDemoItems() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) return JSON.parse(stored);
    } catch (error) {
      console.warn("Cannot read local school content.", error);
    }
    return (window.HAMAD_SEED_ITEMS || []).map(item => ({ ...item }));
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
    const filtered = items.filter(item => {
      const matchesKind = kind === "all" || (item.kind || item.category) === kind;
      const haystack = [item.title, item.description, item.eyebrow, item.year, item.kind].join(" ").toLowerCase();
      return matchesKind && haystack.includes(q);
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
      const description = String(item.description || "").slice(0, 125);
      return '<article class="record-item">' + image +
        '<div class="record-copy"><span class="record-type">' + escapeHtml(kinds[kindKey] || kindKey) + '</span>' +
        '<h3>' + escapeHtml(item.title || "Untitled entry") + '</h3><p>' + escapeHtml(description) + '</p>' + status + '</div>' +
        '<div class="record-actions"><button type="button" data-action="edit" data-id="' + escapeHtml(item.id) + '">Edit</button>' +
        '<button type="button" class="delete-record" data-action="delete" data-id="' + escapeHtml(item.id) + '">Delete</button></div></article>';
    }).join("");
    updateMetrics();
  }

  function resetForm() {
    $("contentForm").reset();
    $("contentId").value = "";
    $("contentKind").value = "achievement";
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
    $("contentKind").value = record.kind || record.category || "story";
    $("contentYear").value = record.year || "";
    $("contentTitle").value = record.title || "";
    $("contentEyebrow").value = record.eyebrow || "";
    $("contentDescription").value = record.description || "";
    $("contentImageUrl").value = record.image_url || record.imageUrl || "";
    $("contentFeatured").checked = record.featured !== false;
    $("contentPublished").checked = record.published !== false;
    $("editorTitle").textContent = "Edit school content";
    pendingImageFile = null;
    pendingImageData = "";
    previewUrl = record.image_url || "";
    renderImagePreview(previewUrl);
    setMessage("Editing: " + (record.title || "Untitled entry"));
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
    const entryLabel = record?.title || (isArabic ? "هذا المحتوى" : "this entry");
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
      items = data || [];
    }
    renderRecords();
  }

  function showWorkspace(isDemo) {
    $("backendLogin").hidden = true;
    $("adminWorkspace").hidden = false;
    $("demoBanner").hidden = !isDemo;
    $("signOutBtn").hidden = isDemo;
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
      const title = $("contentTitle").value.trim();
      const description = $("contentDescription").value.trim();
      if (!title || !description) {
        setMessage("Please add both a title and a description.", true);
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
        const record = {
          id,
          kind: $("contentKind").value,
          title,
          eyebrow: $("contentEyebrow").value.trim() || kinds[$("contentKind").value].toUpperCase(),
          year: $("contentYear").value.trim(),
          description,
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

    $("resetFormBtn").addEventListener("click", resetForm);
    $("searchContent").addEventListener("input", renderRecords);
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
    $("loginForm").addEventListener("submit", async event => {
      event.preventDefault();
      setMessage("", false, "loginMessage");
      if (!supabaseClient) return;
      const email = $("loginEmail").value.trim();
      const password = $("loginPassword").value;
      const submit = $("loginForm").querySelector('button[type="submit"]');
      submit.disabled = true;
      submit.textContent = "Signing in…";
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        currentSession = data.session;
        showWorkspace(false);
        await loadBackendItems();
        showToast("Signed in. Database permissions control what you can publish.");
      } catch (error) {
        setMessage(error.message || "Sign-in failed.", true, "loginMessage");
      } finally {
        submit.disabled = false;
        submit.innerHTML = 'Sign in securely <span>→</span>';
      }
    });

    $("signOutBtn").addEventListener("click", async () => {
      if (!supabaseClient) return;
      await supabaseClient.auth.signOut();
      currentSession = null;
      items = [];
      $("adminWorkspace").hidden = true;
      $("backendLogin").hidden = false;
      $("signOutBtn").hidden = true;
      setMessage("You have been signed out.", false, "loginMessage");
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    setupImageInputs();
    setupForm();
    setupAuth();

    if (!supabaseClient) {
      showWorkspace(true);
      items = readDemoItems();
      renderRecords();
      return;
    }

    $("backendLogin").hidden = false;
    $("adminWorkspace").hidden = true;
    $("demoBanner").hidden = true;
    try {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) throw error;
      currentSession = data.session;
      if (currentSession) {
        showWorkspace(false);
        await loadBackendItems();
      }
    } catch (error) {
      setMessage("Could not verify the current session: " + error.message, true, "loginMessage");
    }
  });
})();

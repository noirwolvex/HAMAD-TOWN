(() => {
  "use strict";

  const STORAGE_KEY = "hamad-town-school-content-v1";
  const config = window.SCHOOL_CONFIG || {};
  const hasSupabaseConfig = Boolean(config.supabaseUrl && config.supabaseAnonKey &&
    /^https:\/\//.test(config.supabaseUrl) && !config.supabaseUrl.includes("YOUR_PROJECT"));
  let supabaseClient = null;

  if (hasSupabaseConfig && window.supabase?.createClient) {
    supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
  }

  const seedItems = [
    {
      id: "seed-achievement-1", kind: "achievement", title: "A proud moment for our learners",
      eyebrow: "STUDENT ACHIEVEMENT", year: "A MOMENT TO CELEBRATE",
      description: "Recognising the effort, resilience and curiosity our students bring to every challenge.",
      image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=85",
      featured: true, published: true, order_index: 1
    },
    {
      id: "seed-award-1", kind: "award", title: "Celebrating excellence, together",
      eyebrow: "AWARDS & RECOGNITION", year: "EVERY STEP COUNTS",
      description: "Every milestone is a reminder of what can happen when talent meets dedication and support.",
      image_url: "https://images.unsplash.com/photo-1560785496-3c9d27877182?auto=format&fit=crop&w=900&q=85",
      featured: true, published: true, order_index: 2
    },
    {
      id: "seed-achievement-2", kind: "achievement", title: "Ideas that make a difference",
      eyebrow: "CREATIVITY & INNOVATION", year: "THINK BIG",
      description: "Our school encourages students to share ideas, experiment boldly and learn by doing.",
      image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
      featured: true, published: true, order_index: 3
    },
    {
      id: "seed-activity-1", kind: "activity", title: "Clubs & creative projects",
      eyebrow: "CREATE", description: "A space to imagine, make, experiment and discover a new talent.",
      image_url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
      featured: true, published: true, order_index: 4
    },
    {
      id: "seed-activity-2", kind: "activity", title: "Teamwork & sports",
      eyebrow: "PLAY", description: "Building confidence, friendships and the spirit of fair play.",
      image_url: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=600&q=80",
      featured: true, published: true, order_index: 5
    },
    {
      id: "seed-activity-3", kind: "activity", title: "School celebrations",
      eyebrow: "CONNECT", description: "Sharing cultures, celebrating progress and making memories as one community.",
      image_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
      featured: true, published: true, order_index: 6
    },
    {
      id: "seed-story-1", kind: "story", title: "A community where everyone can shine",
      eyebrow: "OUR SCHOOL STORY", description: "Every day, students and teachers bring their own talents and ideas to a shared journey of learning and growth.",
      image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=85",
      featured: true, published: true, order_index: 7
    },
    {
      id: "seed-story-2", kind: "story", title: "The people behind every achievement",
      eyebrow: "PEOPLE & PURPOSE", description: "Progress grows from encouragement, teamwork and the belief that every learner has potential.",
      image_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=85",
      featured: true, published: true, order_index: 8
    },
    {
      id: "seed-gallery-1", kind: "gallery", title: "Learning side by side",
      eyebrow: "CLASSROOM MOMENTS", description: "Little moments from a big learning journey.",
      image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=85",
      featured: true, published: true, order_index: 9
    },
    {
      id: "seed-gallery-2", kind: "gallery", title: "Ideas in action",
      eyebrow: "CREATIVE THINKING", description: "Making, trying and discovering together.",
      image_url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=900&q=85",
      featured: true, published: true, order_index: 10
    },
    {
      id: "seed-gallery-3", kind: "gallery", title: "Growing together",
      eyebrow: "SCHOOL COMMUNITY", description: "A community built on connection.",
      image_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85",
      featured: true, published: true, order_index: 11
    },
    {
      id: "seed-gallery-4", kind: "gallery", section: "gallery", title: "Curiosity in action",
      eyebrow: "DISCOVERY & TEAMWORK", description: "Every project brings a new possibility.",
      image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
      featured: true, published: true, order_index: 12
    },
    {
      id: "seed-about-vision", kind: "about", section: "our-story",
      title: "Our vision", title_ar: "رؤيتنا", title_en: "Our vision",
      eyebrow: "OUR VISION", eyebrow_ar: "رؤيتنا", eyebrow_en: "OUR VISION",
      description_ar: "نطمح إلى بيئة تعليمية تشجّع التفكير والإبداع، وتساعد كل طالب على اكتشاف إمكاناته وبناء ثقته بنفسه.",
      description_en: "We aspire to create a learning environment that encourages thinking and creativity, helping every student discover their potential and build confidence.",
      image_url: "", featured: true, published: true, order_index: 1
    },
    {
      id: "seed-about-mission", kind: "about", section: "our-story",
      title: "Our mission", title_ar: "رسالتنا", title_en: "Our mission",
      eyebrow: "OUR MISSION", eyebrow_ar: "رسالتنا", eyebrow_en: "OUR MISSION",
      description_ar: "نعزّز التعاون بين الطلاب والمعلمين والأسر، ونحتفي بالاجتهاد والسلوك الإيجابي وكل خطوة نحو التقدّم.",
      description_en: "We encourage collaboration among students, teachers and families, celebrating effort, positive character and every step forward.",
      image_url: "", featured: true, published: true, order_index: 2
    },
    {
      id: "seed-about-values", kind: "about", section: "our-story",
      title: "Our values", title_ar: "قيمنا", title_en: "Our values",
      eyebrow: "CURIOSITY · RESPECT · GROWTH", eyebrow_ar: "فضول · احترام · نمو", eyebrow_en: "CURIOSITY · RESPECT · GROWTH",
      description_ar: "نؤمن بأن الأسئلة بداية الاكتشاف، وأن اللطف والاحترام يجعلان مجتمعنا أقوى، وأن كل تجربة فرصة للتعلّم.",
      description_en: "We believe questions begin discovery, kindness and respect make our community stronger, and every experience is an opportunity to learn.",
      image_url: "", featured: true, published: true, order_index: 3
    },
    {
      id: "seed-about-journey", kind: "about", section: "our-story",
      title: "Our journey continues", title_ar: "رحلتنا مستمرة", title_en: "Our journey continues",
      eyebrow: "EVERY STUDENT IS PART OF THE STORY", eyebrow_ar: "كل طالب جزء من الحكاية", eyebrow_en: "EVERY STUDENT IS PART OF THE STORY",
      description_ar: "مدرسة مدينة حمد مجتمع يجمع بين المعرفة والفضول والاحترام، ويؤمن بأن لكل طالب قدرة على النمو وصناعة مستقبل مشرق.",
      description_en: "Hamad Town School is a community built around knowledge, curiosity and respect. We believe every student can grow and help shape a bright future.",
      image_url: "", featured: true, published: true, order_index: 4
    }
  ];
  window.HAMAD_SEED_ITEMS = seedItems;

  const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  const iconMarkup = (name, className = "ui-icon") =>
    '<svg class="' + className + '" aria-hidden="true" focusable="false"><use href="icons.svg#i-' + name + '"></use></svg>';

  // Cards show short previews only; the detail modal always reads the original record.
  // Limit both words and characters so very long Arabic words / labels cannot fill tiny cards.
  function previewText(value, maxWords = 14, maxChars = 110) {
    const fullText = String(value || "").replace(/\s+/g, " ").trim();
    if (!fullText) return "";

    let preview = fullText;
    const words = fullText.split(" ");
    if (words.length > maxWords) preview = words.slice(0, maxWords).join(" ");

    if (preview.length > maxChars) {
      const boundary = preview.lastIndexOf(" ", maxChars);
      const cutAt = boundary >= Math.floor(maxChars * 0.65) ? boundary : maxChars;
      preview = preview.slice(0, cutAt).trim();
    }

    return preview.length < fullText.length
      ? preview.replace(/[\s.,،;؛:!?؟…-]+$/g, "") + "…"
      : fullText;
  }

  const contentById = new Map();
  let detailModal = null;
  let lastOpenedCard = null;
  let previousBodyOverflow = "";

  const safeImage = value => {
    const url = String(value || "").trim();
    return /^(https:\/\/|data:image\/|\.\/|\/)/i.test(url) ? url : "";
  };

  const inferSection = kind => ({
    about: "our-story", achievement: "achievements", award: "achievements",
    activity: "school-life", event: "school-life", story: "stories",
    teacher: "stories", student: "stories", gallery: "gallery"
  }[kind] || "");

  const normalize = row => {
    const kind = row.kind || row.category || "story";
    const title = row.title || "";
    const description = row.description || "";
    const eyebrow = row.eyebrow || row.label || kind.replace(/[-_]/g, " ");
    return {
      ...row,
      kind,
      section: row.section || inferSection(kind),
      layout: row.layout === "feature" ? "feature" : "standard",
      title_ar: row.title_ar || window.HamadI18n?.toArabic(title) || title,
      title_en: row.title_en || window.HamadI18n?.toEnglish(title) || title,
      description_ar: row.description_ar || window.HamadI18n?.toArabic(description) || description,
      description_en: row.description_en || window.HamadI18n?.toEnglish(description) || description,
      eyebrow_ar: row.eyebrow_ar || window.HamadI18n?.toArabic(eyebrow) || eyebrow,
      eyebrow_en: row.eyebrow_en || window.HamadI18n?.toEnglish(eyebrow) || eyebrow,
      description,
      image_url: row.image_url || row.imageUrl || "",
      eyebrow,
      year: row.year || "",
      published: row.published !== false
    };
  };

  const displayText = (item, field) => {
    const isEnglish = window.HamadI18n?.getLanguage() === "en";
    const arabic = item[field + "_ar"] || item[field] || "";
    const english = item[field + "_en"] || item[field] || arabic;
    return isEnglish ? (english || arabic) : (arabic || english);
  };

  function readLocalItems() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) return JSON.parse(saved).map(normalize);
    } catch (error) {
      console.warn("Could not read saved school content.", error);
    }
    return seedItems.map(normalize);
  }

  async function loadItems() {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from("school_content")
        .select("*")
        .eq("published", true)
        .order("order_index", { ascending: true });
      if (!error && Array.isArray(data)) return data.map(normalize);
      console.warn("Shared school content could not be loaded. Showing demo content.", error);
      showToast("Shared publishing is configured but not ready yet. Showing demo content for now.");
    }
    return readLocalItems().filter(item => item.published !== false);
  }

  function showToast(message) {
    const toast = document.getElementById("siteToast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("visible"), 4300);
  }

  const kindLabel = kind => ({
    about: "School identity", achievement: "Achievement", award: "Award",
    activity: "School life", story: "Our story", teacher: "Teacher spotlight",
    student: "Student spotlight", event: "School event", gallery: "School gallery"
  }[kind] || "School highlight");

  const kindIcon = kind => iconMarkup(({
    about: "book-marked", activity: "calendar-days", event: "calendar-check",
    student: "user-round", teacher: "graduation-cap", achievement: "trophy",
    award: "award", story: "book-open", gallery: "images"
  }[kind] || "sparkles"));

  function isAchievementItem(item) {
    return item.section === "achievements" || ["achievement", "award"].includes(item.kind);
  }

  function formatAchievementDate(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    const date = new Date(raw + "T00:00:00");
    if (Number.isNaN(date.getTime())) return raw;
    return new Intl.DateTimeFormat(window.HamadI18n?.getLanguage() === "en" ? "en" : "ar", {
      year: "numeric", month: "short", day: "numeric"
    }).format(date);
  }

  function achievementDetails(item) {
    const isEnglish = window.HamadI18n?.getLanguage() === "en";
    return [
      { label: isEnglish ? "Student / team" : "الطالب / الفريق", value: displayText(item, "recipient") },
      { label: isEnglish ? "Competition / project" : "المسابقة / المشروع", value: displayText(item, "achievement_event") },
      { label: isEnglish ? "Result / rank" : "النتيجة / المركز", value: displayText(item, "achievement_result") },
      { label: isEnglish ? "Organizer" : "الجهة المنظمة", value: displayText(item, "achievement_organization") },
      { label: isEnglish ? "Achievement date" : "تاريخ الإنجاز", value: formatAchievementDate(item.achievement_date) }
    ].filter(field => String(field.value || "").trim());
  }

  function isSchoolLifeItem(item) {
    return item.section === "school-life" || ["activity", "event"].includes(item.kind);
  }

  function formatSchoolLifeDate(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    const date = new Date(raw + "T00:00:00");
    if (Number.isNaN(date.getTime())) return raw;
    return new Intl.DateTimeFormat(window.HamadI18n?.getLanguage() === "en" ? "en" : "ar", {
      year: "numeric", month: "long", day: "numeric"
    }).format(date);
  }

  function activityDetails(item) {
    const isEnglish = window.HamadI18n?.getLanguage() === "en";
    return [
      { label: isEnglish ? "Activity date" : "تاريخ النشاط", value: formatSchoolLifeDate(item.activity_date) },
      { label: isEnglish ? "Time / schedule" : "الوقت / الجدول", value: item.activity_time },
      { label: isEnglish ? "Location" : "الموقع", value: displayText(item, "activity_location") },
      { label: isEnglish ? "Organizer" : "الجهة المنظمة", value: displayText(item, "activity_organizer") },
      { label: isEnglish ? "Intended audience" : "الفئة المستهدفة", value: displayText(item, "activity_audience") },
      { label: isEnglish ? "Duration" : "المدة", value: displayText(item, "activity_duration") }
    ].filter(field => String(field.value || "").trim());
  }

  function activityCardSummary(item) {
    const isEnglish = window.HamadI18n?.getLanguage() === "en";
    const fields = [
      { icon: "calendar-days", label: isEnglish ? "Date" : "التاريخ", value: formatSchoolLifeDate(item.activity_date) },
      { icon: "map-pin", label: isEnglish ? "Location" : "الموقع", value: displayText(item, "activity_location") },
      { icon: "users", label: isEnglish ? "For" : "للفئة", value: displayText(item, "activity_audience") },
      { icon: "clock-3", label: isEnglish ? "Time" : "الوقت", value: item.activity_time }
    ].filter(field => String(field.value || "").trim()).slice(0, 3);
    if (!fields.length) return "";
    return '<div class="activity-row-meta">' + fields.map(field =>
      '<span class="activity-meta-chip"><i aria-hidden="true">' + iconMarkup(field.icon, "ui-icon activity-meta-icon") + '</i><small>' +
      escapeHtml(field.label) + ':</small><b>' + escapeHtml(previewText(field.value, 3, 26)) + '</b></span>'
    ).join("") + '</div>';
  }

  function cardMarkup(item) {
    const title = displayText(item, "title");
    const description = displayText(item, "description");
    const titlePreview = previewText(title, 6, 42);
    const descriptionPreview = previewText(description, 18, 100);
    const eyebrow = previewText(displayText(item, "eyebrow") || kindLabel(item.kind), 5, 32);
    const image = safeImage(item.image_url);
    const imageHtml = image
      ? `<div class="content-card-media"><img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy"><span class="card-tag">${escapeHtml(kindLabel(item.kind))}</span></div>`
      : `<div class="content-card-media content-card-placeholder"><span>${kindIcon(item.kind)}</span><span class="card-tag">${escapeHtml(kindLabel(item.kind))}</span></div>`;
    const factsLimit = document.body.dataset.page === "home" ? 2 : 3;
    const facts = isAchievementItem(item) ? achievementDetails(item).slice(0, factsLimit) : [];
    const factsHtml = facts.length ? `<div class="achievement-card-facts">${facts.map(fact => `<span><small>${escapeHtml(fact.label)}</small><b>${escapeHtml(previewText(fact.value, 3, 26))}</b></span>`).join("")}</div>` : "";
    return `<article class="content-card is-openable-card" role="button" tabindex="0" data-open-content data-content-id="${escapeHtml(item.id)}" aria-haspopup="dialog" aria-label="${escapeHtml(title)}"><div class="content-card-link">${imageHtml}<div class="content-card-body"><div class="card-meta"><span>${escapeHtml(eyebrow)}</span><span class="gold-dot">${iconMarkup("sparkles")}</span></div><h3>${escapeHtml(titlePreview)}</h3><p>${escapeHtml(descriptionPreview)}</p>${factsHtml}<span class="content-open-hint" aria-hidden="true">${window.HamadI18n?.getLanguage() === "en" ? "Open details " + iconMarkup("arrow-up-right") : "افتح التفاصيل " + iconMarkup("arrow-up-right")}</span></div></div></article>`;
  }

  function renderAboutContent(items) {
    const container = document.getElementById("storyContentGrid");
    if (!container) return;
    const entries = items.filter(item => item.section === "our-story" || (!item.section && item.kind === "about"));
    if (!entries.length) return;

    const fallbackNote = document.getElementById("storyNoteFallback");
    if (fallbackNote) fallbackNote.hidden = true;
    const classes = ["principle-blue", "principle-gold", "principle-lilac"];
    const featuredEntries = entries.filter(item => item.layout === "feature");
    const standardEntries = entries.filter(item => item.layout !== "feature");
    const featuredMarkup = featuredEntries.map(item => {
      const image = safeImage(item.image_url);
      const title = displayText(item, "title");
      const eyebrow = displayText(item, "eyebrow") || "OUR SCHOOL";
      return `<article class="story-feature-card reveal is-visible is-openable-card" role="button" tabindex="0" data-open-content data-content-id="${escapeHtml(item.id)}" aria-haspopup="dialog" aria-label="${escapeHtml(title)}">
        <div class="story-feature-media">${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy">` : `<div class="story-feature-placeholder" aria-hidden="true">${iconMarkup("sparkles")}</div>`}
          <span class="story-feature-media-tag">${escapeHtml(previewText(eyebrow, 5, 32))}</span>
        </div>
        <div class="story-feature-copy">
          <span class="story-feature-kicker">${escapeHtml(previewText(eyebrow, 5, 32))}</span>
          <h2>${escapeHtml(previewText(title, 7, 46))}</h2>
          <p>${escapeHtml(previewText(displayText(item, "description"), 18, 105))}</p>
          ${item.year ? `<span class="story-feature-year">${escapeHtml(item.year)}</span>` : ""}
          <span class="story-feature-accent" aria-hidden="true">${iconMarkup("sparkles")}</span>
        </div>
      </article>`;
    }).join("");
    const standardMarkup = standardEntries.map((item, index) => {
      const image = safeImage(item.image_url);
      const iconName = ["lightbulb", "users", "compass", "house"][index % 4];
      return `<article class="story-principle ${classes[index % classes.length]} reveal is-visible is-openable-card" role="button" tabindex="0" data-open-content data-content-id="${escapeHtml(item.id)}" aria-haspopup="dialog" aria-label="${escapeHtml(displayText(item, "title"))}">${image ? `<img class="about-principle-image" src="${escapeHtml(image)}" alt="${escapeHtml(displayText(item, "title"))}" loading="lazy">` : ""}<span class="principle-icon">${iconMarkup(iconName)}</span><span class="mini-label">${escapeHtml(displayText(item, "eyebrow") || "OUR SCHOOL")}</span><h2>${escapeHtml(previewText(displayText(item, "title"), 7, 46))}</h2><p>${escapeHtml(previewText(displayText(item, "description"), 18, 100))}</p></article>`;
    }).join("");
    container.innerHTML = featuredMarkup + standardMarkup;
  }

  function renderAchievements(items) {
    const container = document.getElementById("achievementGrid");
    if (!container) return;
    const all = items.filter(item => item.section === "achievements" || (!item.section && ["achievement", "award"].includes(item.kind)));
    const selected = document.body.dataset.page === "achievements" ? all : all.slice(0, 3);
    container.innerHTML = selected.length ? selected.map(cardMarkup).join("") :
      '<div class="empty-state">Our next highlight could be here. Check back soon.</div>';
  }

  function renderActivities(items) {
    const container = document.getElementById("activityList");
    if (!container) return;
    const all = items.filter(item => item.section === "school-life" || (!item.section && ["activity", "event"].includes(item.kind)));
    const activities = document.body.dataset.page === "school-life" ? all : all.slice(0, 4);
    container.innerHTML = activities.length ? activities.map(item => {
      const image = safeImage(item.image_url);
      const icon = image
        ? `<span class="activity-icon"><img src="${escapeHtml(image)}" alt="" loading="lazy"></span>`
        : `<span class="activity-icon">${kindIcon(item.kind)}</span>`;
      const title = displayText(item, "title");
      const titlePreview = previewText(title, 7, 46);
      const descriptionPreview = previewText(displayText(item, "description"), 18, 100);
      const summary = activityCardSummary(item);
      const openHint = window.HamadI18n?.getLanguage() === "en" ? "View details" : "عرض التفاصيل";
      return `<article class="activity-row is-openable-card" role="button" tabindex="0" data-open-content data-content-id="${escapeHtml(item.id)}" aria-haspopup="dialog" aria-label="${escapeHtml(title)}">${icon}<div class="activity-row-copy"><h3>${escapeHtml(titlePreview)}</h3><p>${escapeHtml(descriptionPreview)}</p>${summary}<span class="content-open-hint">${openHint} ${iconMarkup("arrow-up-right")}</span></div><span class="activity-arrow" aria-hidden="true">${iconMarkup("arrow-up-right")}</span></article>`;
    }).join("") : '<div class="empty-state">School activities and events will appear here.</div>';
  }

  function renderStories(items) {
    const container = document.getElementById("storyGrid");
    if (!container) return;
    const all = items.filter(item => item.section === "stories" || (!item.section && ["story", "student", "teacher"].includes(item.kind)));
    const stories = document.body.dataset.page === "stories" ? all : all.slice(0, 2);
    container.innerHTML = stories.length ? stories.map(item => {
      const image = safeImage(item.image_url) || "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80";
      const title = displayText(item, "title");
      const titlePreview = previewText(title, 7, 46);
      const descriptionPreview = previewText(displayText(item, "description"), 18, 100);
      return `<article class="story-card is-openable-card" role="button" tabindex="0" data-open-content data-content-id="${escapeHtml(item.id)}" aria-haspopup="dialog" aria-label="${escapeHtml(title)}"><img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy"><div class="story-card-copy"><span class="mini-label">${escapeHtml(displayText(item, "eyebrow") || kindLabel(item.kind))}</span><h3>${escapeHtml(titlePreview)}</h3><p>${escapeHtml(descriptionPreview)}</p><span class="content-open-hint" aria-hidden="true">${window.HamadI18n?.getLanguage() === "en" ? "Read story " + iconMarkup("arrow-up-right") : "اقرأ القصة " + iconMarkup("arrow-up-right")}</span></div></article>`;
    }).join("") : '<div class="empty-state">New stories from our community will be shared here.</div>';
  }

  function renderGallery(items) {
    const container = document.getElementById("galleryGrid");
    if (!container) return;
    const all = items.filter(item => item.section === "gallery" || (!item.section && item.kind === "gallery"));
    const entries = document.body.dataset.page === "gallery" ? all : all.slice(0, 4);
    if (!entries.length) {
      container.innerHTML = '<div class="empty-state">No gallery photos have been published yet.</div>';
      return;
    }
    const classes = ["gallery-tile-tall", "", "gallery-tile-blue", ""];
    container.innerHTML = entries.map((item, index) => {
      const image = safeImage(item.image_url);
      if (index === 2 && !image) {
        const title = displayText(item, "title");
        return `<figure class="gallery-tile gallery-tile-blue is-openable-card" role="button" tabindex="0" data-open-content data-content-id="${escapeHtml(item.id)}" aria-haspopup="dialog" aria-label="${escapeHtml(title)}"><div class="gallery-note"><span>${iconMarkup("images")}</span><b>${escapeHtml(previewText(title, 5, 36))}</b><small>${escapeHtml(previewText(displayText(item, "eyebrow") || "HAMAD TOWN SCHOOL", 5, 30))}</small></div><figcaption><span class="gallery-title-preview">${escapeHtml(previewText(title, 5, 36))}</span>${iconMarkup("arrow-up-right")}</figcaption></figure>`;
      }
      const title = displayText(item, "title");
      return `<figure class="gallery-tile ${classes[index % classes.length] || ""} is-openable-card" role="button" tabindex="0" data-open-content data-content-id="${escapeHtml(item.id)}" aria-haspopup="dialog" aria-label="${escapeHtml(title)}">${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy">` : `<div class="gallery-note"><span>${iconMarkup("images")}</span><b>${escapeHtml(previewText(title, 5, 36))}</b></div>`}<figcaption><span class="gallery-title-preview">${escapeHtml(previewText(title, 5, 36))}</span>${iconMarkup("arrow-up-right")}</figcaption></figure>`;
    }).join("");
  }

  function ensureDetailModal() {
    if (detailModal) return detailModal;
    const modal = document.createElement("div");
    modal.className = "content-detail-modal";
    modal.id = "contentDetailModal";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="content-detail-backdrop" data-detail-close></div>
      <section class="content-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="contentDetailTitle" aria-describedby="contentDetailDescription" tabindex="-1">
        <button class="content-detail-close" type="button" data-detail-close aria-label="Close details" title="Close details">×</button>
        <div class="content-detail-media" id="contentDetailMedia"></div>
        <div class="content-detail-copy">
          <span class="content-detail-kicker" id="contentDetailKicker"></span>
          <h2 id="contentDetailTitle"></h2>
          <p id="contentDetailDescription"></p>
          <div class="content-detail-extra" id="contentDetailExtra" hidden></div>
          <div class="content-detail-meta" id="contentDetailMeta"></div>
        </div>
      </section>`;
    document.body.appendChild(modal);
    detailModal = modal;

    modal.addEventListener("click", event => {
      if (event.target.matches("[data-detail-close]")) closeContentDetails();
    });
    document.addEventListener("keydown", event => {
      if (detailModal?.hidden) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeContentDetails();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...detailModal.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')]
        .filter(element => !element.hidden && element.getAttribute("aria-hidden") !== "true");
      if (!focusable.length) {
        event.preventDefault();
        detailModal.querySelector(".content-detail-dialog")?.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    return detailModal;
  }

  function openContentDetails(item, sourceCard) {
    if (!item) return;
    const modal = ensureDetailModal();
    const image = safeImage(item.image_url);
    const title = displayText(item, "title") || (window.HamadI18n?.getLanguage() === "en" ? "School story" : "قصة المدرسة");
    const eyebrow = displayText(item, "eyebrow") || kindLabel(item.kind);
    const description = displayText(item, "description") || "";
    const isEnglish = window.HamadI18n?.getLanguage() === "en";
    modal.querySelector("#contentDetailKicker").textContent = eyebrow;
    modal.querySelector("#contentDetailTitle").textContent = title;
    modal.querySelector("#contentDetailDescription").textContent = description;

    const media = modal.querySelector("#contentDetailMedia");
    media.innerHTML = image
      ? '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(title) + '">'
      : '<div class="content-detail-placeholder" aria-hidden="true">' + kindIcon(item.kind) + '</div>';

    const meta = [];
    const sectionLabels = isEnglish ? {
      "our-story": "Our story", achievements: "Achievements", "school-life": "School life",
      stories: "Stories", gallery: "Photo gallery"
    } : {
      "our-story": "قصتنا", achievements: "الإنجازات", "school-life": "الحياة المدرسية",
      stories: "القصص", gallery: "معرض الصور"
    };
    if (item.section) meta.push({ label: isEnglish ? "Section" : "القسم", value: sectionLabels[item.section] || item.section });
    if (item.kind) meta.push({ label: isEnglish ? "Content type" : "نوع المحتوى", value: isEnglish ? kindLabel(item.kind) : ({
      about: "محتوى تعريفي", achievement: "إنجاز", award: "جائزة", activity: "نشاط مدرسي",
      story: "قصة", teacher: "تكريم معلم", student: "تكريم طالب", event: "فعالية مدرسية", gallery: "صورة من المعرض"
    }[item.kind] || "محتوى مدرسي") });
    if (item.year) meta.push({ label: isEnglish ? "School year" : "العام الدراسي", value: item.year });
    if (isAchievementItem(item)) meta.push(...achievementDetails(item));
    if (isSchoolLifeItem(item)) meta.push(...activityDetails(item));
    if (item.created_at) {
      const createdAt = new Date(item.created_at);
      if (!Number.isNaN(createdAt.getTime())) {
        meta.push({
          label: isEnglish ? "Date added" : "تاريخ الإضافة",
          value: new Intl.DateTimeFormat(isEnglish ? "en" : "ar", {
            year: "numeric", month: "long", day: "numeric"
          }).format(createdAt)
        });
      }
    }
    if (item.featured === true) meta.push({ label: isEnglish ? "Highlight" : "ضمن أبرز المحتويات", value: isEnglish ? "Featured" : "محتوى مميّز" });
    modal.querySelector("#contentDetailMeta").innerHTML = meta
      .map(entry => '<span class="content-detail-meta-item"><small>' + escapeHtml(entry.label) + '</small><b>' + escapeHtml(entry.value) + '</b></span>')
      .join("");

    const extra = modal.querySelector("#contentDetailExtra");
    const extraSections = [];
    const highlights = displayText(item, "achievement_highlights");
    if (highlights) {
      extraSections.push({
        title: isAchievementItem(item)
          ? (isEnglish ? "Achievement details" : "تفاصيل الإنجاز")
          : (isEnglish ? "Additional information" : "معلومات إضافية"),
        value: highlights
      });
    }
    if (isSchoolLifeItem(item)) {
      [
        { title: isEnglish ? "Activity overview" : "تفاصيل النشاط", value: displayText(item, "activity_details") },
        { title: isEnglish ? "Learning goals" : "أهداف النشاط", value: displayText(item, "activity_goals") },
        { title: isEnglish ? "Outcomes & highlights" : "النتائج وأبرز اللحظات", value: displayText(item, "activity_outcomes") }
      ].filter(section => String(section.value || "").trim()).forEach(section => extraSections.push(section));
    }
    extra.hidden = !extraSections.length;
    extra.innerHTML = extra.hidden ? "" : extraSections.map(section =>
      '<section class="content-detail-extra-section"><h3>' + escapeHtml(section.title) +
      '</h3><p>' + escapeHtml(section.value) + '</p></section>'
    ).join("");

    const closeButton = modal.querySelector(".content-detail-close");
    const closeLabel = isEnglish ? "Close details" : "إغلاق التفاصيل";
    closeButton.setAttribute("aria-label", closeLabel);
    closeButton.title = closeLabel;
    lastOpenedCard = sourceCard || document.activeElement;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.querySelector(".content-detail-copy").scrollTop = 0;
    modal.querySelector(".content-detail-dialog").scrollTop = 0;
    modal.hidden = false;
    document.documentElement.classList.add("content-detail-open");
    closeButton.focus();
  }

  function closeContentDetails() {
    if (!detailModal || detailModal.hidden) return;
    detailModal.hidden = true;
    document.body.style.overflow = previousBodyOverflow;
    document.documentElement.classList.remove("content-detail-open");
    if (lastOpenedCard?.isConnected) lastOpenedCard.focus();
    lastOpenedCard = null;
  }

  function setupContentDetails() {
    ensureDetailModal();
    document.addEventListener("click", event => {
      const close = event.target.closest("[data-detail-close]");
      if (close) {
        closeContentDetails();
        return;
      }
      const card = event.target.closest("[data-open-content]");
      if (!card) return;
      const item = contentById.get(String(card.dataset.contentId || ""));
      if (!item) return;
      openContentDetails(item, card);
    });
    document.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest?.("[data-open-content]");
      if (!card || detailModal && !detailModal.hidden) return;
      event.preventDefault();
      const item = contentById.get(String(card.dataset.contentId || ""));
      if (item) openContentDetails(item, card);
    });
  }

  function setupReveal() {
    const elements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      elements.forEach(element => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach(element => observer.observe(element));
  }

  function setupMenu() {
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("mainNav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", window.HamadI18n?.t(open ? "Close navigation" : "Open navigation") || (open ? "Close navigation" : "Open navigation"));
    });
    const pageHref = ({
      home: "index.html",
      story: "story.html",
      achievements: "achievements.html",
      "school-life": "school-life.html",
      stories: "stories.html",
      gallery: "gallery.html"
    })[document.body.dataset.page || "home"];
    nav.querySelectorAll("a").forEach(link => {
      if (link.getAttribute("href") === pageHref) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", window.HamadI18n?.t("Open navigation") || "Open navigation");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const year = document.getElementById("yearNow");
    if (year) year.textContent = new Date().getFullYear();
    setupMenu();
    setupReveal();
    setupContentDetails();
    const hasContentContainer = ["storyContentGrid", "achievementGrid", "activityList", "storyGrid", "galleryGrid"]
      .some(id => document.getElementById(id));
    if (!hasContentContainer) return;
    let currentItems = [];
    let itemsLoaded = false;
    window.addEventListener("hamad-language-change", () => {
      if (!itemsLoaded) return;
      renderAboutContent(currentItems);
      renderAchievements(currentItems);
      renderActivities(currentItems);
      renderStories(currentItems);
      renderGallery(currentItems);
    });
    try {
      const items = await loadItems();
      currentItems = items;
      contentById.clear();
      items.forEach(item => {
        if (item.id !== undefined && item.id !== null) contentById.set(String(item.id), item);
      });
      itemsLoaded = true;
      renderAboutContent(items);
      renderAchievements(items);
      renderActivities(items);
      renderStories(items);
      renderGallery(items);
    } catch (error) {
      console.error("School content could not be rendered.", error);
      showToast("Some school content could not be loaded. Please refresh the page.");
    }
  });
})();

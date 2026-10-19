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
      id: "seed-gallery-4", kind: "gallery", title: "Curiosity in action",
      eyebrow: "DISCOVERY & TEAMWORK", description: "Every project brings a new possibility.",
      image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
      featured: true, published: true, order_index: 12
    }
  ];
  window.HAMAD_SEED_ITEMS = seedItems;

  const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  const safeImage = value => {
    const url = String(value || "").trim();
    return /^(https:\/\/|data:image\/|\.\/|\/)/i.test(url) ? url : "";
  };

  const normalize = row => {
    const kind = row.kind || row.category || "story";
    const title = row.title || "";
    const description = row.description || "";
    const eyebrow = row.eyebrow || row.label || kind.replace(/[-_]/g, " ");
    return {
      ...row,
      kind,
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
    achievement: "Achievement", award: "Award", activity: "School life",
    story: "Our story", teacher: "Teacher spotlight", student: "Student spotlight",
    event: "School event", gallery: "School gallery"
  }[kind] || "School highlight");

  const kindSymbol = kind => ({
    activity: "✳", event: "◷", student: "✦", teacher: "✧",
    achievement: "↗", award: "✦", story: "◎", gallery: "▧"
  }[kind] || "✦");

  function cardMarkup(item) {
    const kind = escapeHtml(item.kind);
    const title = displayText(item, "title");
    const description = displayText(item, "description");
    const image = safeImage(item.image_url);
    const imageHtml = image
      ? `<div class="content-card-media"><img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy"><span class="card-tag">${escapeHtml(kindLabel(item.kind))}</span></div>`
      : `<div class="content-card-media content-card-placeholder"><span>${kindSymbol(item.kind)}</span><span class="card-tag">${escapeHtml(kindLabel(item.kind))}</span></div>`;
    return `<article class="content-card"><div class="content-card-link">${imageHtml}<div class="content-card-body"><div class="card-meta"><span>${escapeHtml(displayText(item, "eyebrow") || kindLabel(item.kind))}</span><span class="gold-dot">✦</span></div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p></div></div></article>`;
  }

  function renderAchievements(items) {
    const container = document.getElementById("achievementGrid");
    if (!container) return;
    const all = items.filter(item => ["achievement", "award"].includes(item.kind));
    const selected = document.body.dataset.page === "achievements" ? all : all.slice(0, 3);
    container.innerHTML = selected.length ? selected.map(cardMarkup).join("") :
      '<div class="empty-state">Our next highlight could be here. Check back soon.</div>';
  }

  function renderActivities(items) {
    const container = document.getElementById("activityList");
    if (!container) return;
    const all = items.filter(item => ["activity", "event"].includes(item.kind));
    const activities = document.body.dataset.page === "school-life" ? all : all.slice(0, 4);
    container.innerHTML = activities.length ? activities.map(item => {
      const image = safeImage(item.image_url);
      const icon = image
        ? `<span class="activity-icon"><img src="${escapeHtml(image)}" alt="" loading="lazy"></span>`
        : `<span class="activity-icon">${kindSymbol(item.kind)}</span>`;
      return `<article class="activity-row">${icon}<div><h3>${escapeHtml(displayText(item, "title"))}</h3><p>${escapeHtml(displayText(item, "description"))}</p></div><span class="activity-arrow" aria-hidden="true">↗</span></article>`;
    }).join("") : '<div class="empty-state">School activities and events will appear here.</div>';
  }

  function renderStories(items) {
    const container = document.getElementById("storyGrid");
    if (!container) return;
    const all = items.filter(item => ["story", "student", "teacher"].includes(item.kind));
    const stories = document.body.dataset.page === "stories" ? all : all.slice(0, 2);
    container.innerHTML = stories.length ? stories.map(item => {
      const image = safeImage(item.image_url) || "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80";
      return `<article class="story-card"><img src="${escapeHtml(image)}" alt="${escapeHtml(displayText(item, "title"))}" loading="lazy"><div class="story-card-copy"><span class="mini-label">${escapeHtml(displayText(item, "eyebrow") || kindLabel(item.kind))}</span><h3>${escapeHtml(displayText(item, "title"))}</h3><p>${escapeHtml(displayText(item, "description"))}</p></div></article>`;
    }).join("") : '<div class="empty-state">New stories from our community will be shared here.</div>';
  }

  function renderGallery(items) {
    const container = document.getElementById("galleryGrid");
    if (!container) return;
    const all = items.filter(item => item.kind === "gallery");
    const entries = document.body.dataset.page === "gallery" ? all : all.slice(0, 4);
    if (!entries.length) {
      container.innerHTML = '<div class="empty-state">No gallery photos have been published yet.</div>';
      return;
    }
    const classes = ["gallery-tile-tall", "", "gallery-tile-blue", ""];
    container.innerHTML = entries.map((item, index) => {
      const image = safeImage(item.image_url);
      if (index === 2 && !image) {
        return `<figure class="gallery-tile gallery-tile-blue"><div class="gallery-note"><span>✳</span><b>${escapeHtml(displayText(item, "title"))}</b><small>${escapeHtml(displayText(item, "eyebrow") || "HAMAD TOWN SCHOOL")}</small></div></figure>`;
      }
      const title = displayText(item, "title");
      return `<figure class="gallery-tile ${classes[index % classes.length] || ""}">${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy">` : `<div class="gallery-note"><span>✦</span><b>${escapeHtml(title)}</b></div>`}<figcaption>${escapeHtml(title)} <span>↗</span></figcaption></figure>`;
    }).join("");
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
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", window.HamadI18n?.t("Open navigation") || "Open navigation");
    }));
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const year = document.getElementById("yearNow");
    if (year) year.textContent = new Date().getFullYear();
    setupMenu();
    setupReveal();
    const hasContentContainer = ["achievementGrid", "activityList", "storyGrid", "galleryGrid"]
      .some(id => document.getElementById(id));
    if (!hasContentContainer) return;
    let currentItems = [];
    let itemsLoaded = false;
    window.addEventListener("hamad-language-change", () => {
      if (!itemsLoaded) return;
      renderAchievements(currentItems);
      renderActivities(currentItems);
      renderStories(currentItems);
      renderGallery(currentItems);
    });
    try {
      const items = await loadItems();
      currentItems = items;
      itemsLoaded = true;
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

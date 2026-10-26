(() => {
  "use strict";
  const icons = {
    home: '<path d="m3 10 9-7 9 7"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
    school: '<path d="m3 10 9-7 9 7"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
    trophy: '<path d="M8 21h8M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 6h3v3a4 4 0 0 1-4 4M7 6H4v3a4 4 0 0 0 4 4"/>',
    medal: '<circle cx="12" cy="8" r="5"/><path d="m8.5 12-1.5 9 5-3 5 3-1.5-9"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    "calendar-days": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/>',
    "calendar-clock": '<rect x="3" y="5" width="14" height="16" rx="2"/><path d="M8 3v4M12 3v4M3 10h14"/><circle cx="18" cy="17" r="3"/><path d="M18 15.5V17l1 0.7"/>',
    "book-open": '<path d="M12 7v14"/><path d="M3 18V5a1 1 0 0 1 1-1h3a5 5 0 0 1 5 5 5 5 0 0 1 5-5h3a1 1 0 0 1 1 1v13h-4a5 5 0 0 0-5 3 5 5 0 0 0-5-3H3Z"/>',
    images: '<rect x="3" y="4" width="15" height="15" rx="2"/><path d="m3 15 4-4 3 3 3-4 5 5"/><circle cx="8" cy="8" r="1"/><path d="M8 20h11a2 2 0 0 0 2-2V8"/>',
    "arrow-up-right": '<path d="M7 17 17 7M8 7h9v9"/>',
    "arrow-down-right": '<path d="m7 7 10 10M8 17h9V8"/>',
    "arrow-right": '<path d="M5 12h14M12 5l7 7-7 7"/>',
    "arrow-left": '<path d="M19 12H5m7 7-7-7 7-7"/>',
    sparkles: '<path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/><path d="m5 2 .6 1.7L7.5 4l-1.9.6L5 6.5l-.6-1.9L2.5 4l1.9-.3L5 2Z"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "lock-keyhole": '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/><circle cx="12" cy="15" r="1"/><path d="M12 16v2"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5"/><path d="M5 17v4h14v-4"/>',
    upload: '<path d="M12 16V4m-5 5 5-5 5 5"/><path d="M5 16v5h14v-5"/>',
    x: '<path d="m18 6-12 12M6 6l12 12"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7h.01"/>',
    lightbulb: '<path d="M9 18h6M10 22h4"/><path d="M8.5 14.5a7 7 0 1 1 7 0c-.8.6-1.2 1.4-1.3 2.5H9.8c-.1-1.1-.5-1.9-1.3-2.5Z"/>',
    heart: '<path d="M20.8 8.8c0 5.1-8.8 10.3-8.8 10.3S3.2 13.9 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z"/>',
    "graduation-cap": '<path d="m2 10 10-5 10 5-10 5-10-5Z"/><path d="M6 12v5c3.5 2.7 8.5 2.7 12 0v-5M22 10v6"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.2a4 4 0 0 1 0 7.6"/>',
    "refresh-cw": '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9A7 7 0 0 1 17 5l3 2M4 17l3 2a7 7 0 0 0 11.4-4"/>',
    pencil: '<path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15l0 5Z"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
    "log-out": '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>',
    filter: '<path d="M4 5h16M7 12h10M10 19h4"/>',
    "badge-check": '<path d="M12 3 14.5 5l3.2-.2.8 3.1 2.5 2-1.3 3 .3 3.2-3.1.8-2 2.5-3-1.3-3.2.3-.8-3.1-2.5-2 1.3-3-.3-3.2 3.1-.8L12 3Z"/><path d="m9 12 2 2 4-4"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    camera: '<path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="4"/>'
  };
  function iconMarkup(name) {
    const paths = icons[name] || icons.sparkles;
    return '<svg class="school-icon-svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + paths + '</svg>';
  }
  function renderOne(node) {
    const name = node.getAttribute("data-icon") || "sparkles";
    if (node.getAttribute("data-icon-rendered") === name && node.querySelector("svg.school-icon-svg")) return;
    node.innerHTML = iconMarkup(name);
    node.setAttribute("data-icon-rendered", name);
  }
  function renderSchoolIcons(root) {
    const start = root || document;
    if (start.nodeType === 1 && start.matches && start.matches("[data-icon]")) renderOne(start);
    if (start.querySelectorAll) start.querySelectorAll("[data-icon]").forEach(renderOne);
  }
  window.schoolIconMarkup = (name, className) => '<span class="' + (className || "ui-icon-inline") + '" data-icon="' + (icons[name] ? name : "sparkles") + '" aria-hidden="true"></span>';
  window.renderSchoolIcons = renderSchoolIcons;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => renderSchoolIcons(), { once: true });
  else renderSchoolIcons();
  if ("MutationObserver" in window && document.documentElement) {
    const observer = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType === 1) renderSchoolIcons(node);
    })));
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
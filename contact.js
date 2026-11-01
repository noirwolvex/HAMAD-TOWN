(() => {
  "use strict";

  const config = window.SCHOOL_CONFIG || {};
  const hasSupabaseConfig = Boolean(
    config.supabaseUrl &&
    config.supabaseAnonKey &&
    /^https:\/\//.test(config.supabaseUrl) &&
    !config.supabaseUrl.includes("YOUR_PROJECT")
  );
  const supabaseClient = hasSupabaseConfig && window.supabase?.createClient
    ? window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey)
    : null;

  const $ = id => document.getElementById(id);
  const currentLanguage = () => window.HamadI18n?.getLanguage() === "en" ? "en" : "ar";
  let submitting = false;
  let lastStatus = null;

  function setStatus(english, arabic, kind = "") {
    lastStatus = { english, arabic, kind };
    const status = $("contactFormStatus");
    if (!status) return;
    status.textContent = currentLanguage() === "ar" ? arabic : english;
    status.className = "contact-status" + (kind ? " is-" + kind : "");
  }

  function setSubmitting(value) {
    submitting = value;
    const button = $("contactSubmitBtn");
    if (!button) return;
    button.disabled = value;
    button.setAttribute("aria-busy", value ? "true" : "false");
    button.innerHTML = value
      ? (currentLanguage() === "ar" ? "جارٍ الإرسال…" : "Sending…")
      : '<span class="ui-icon-inline" data-icon="send" aria-hidden="true"></span>' +
        (currentLanguage() === "ar" ? "إرسال الرسالة" : "Send message") +
        '<span class="ui-icon-inline contact-submit-arrow" data-icon="arrow-up-right" aria-hidden="true"></span>';
    window.renderSchoolIcons?.(button);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = $("visitorMessageForm");
    if (!form) return;

    if (!supabaseClient) {
      $("contactSubmitBtn").disabled = true;
      setStatus(
        "The message service is not connected yet. Please try again later.",
        "خدمة إرسال الرسائل غير متصلة حاليًا. يرجى المحاولة لاحقًا.",
        "error"
      );
      return;
    }

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (submitting) return;

      const honeypot = $("contactWebsite");
      if (honeypot?.value.trim()) {
        form.reset();
        setStatus(
          "Thank you. Your message has been received.",
          "شكرًا لك، تم استلام رسالتك.",
          "success"
        );
        return;
      }

      const email = $("visitorEmail").value.trim();
      const payload = {
        visitor_name: $("visitorName").value.trim(),
        visitor_email: email,
        visitor_phone: $("visitorPhone").value.trim(),
        message: $("visitorMessage").value.trim()
      };

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus(
          "Please enter a valid email address, or leave the field blank.",
          "يرجى إدخال بريد إلكتروني صحيح أو ترك الخانة فارغة.",
          "error"
        );
        $("visitorEmail").focus();
        return;
      }

      setSubmitting(true);
      setStatus("Sending your message…", "جارٍ إرسال رسالتك…");
      try {
        const { error } = await supabaseClient
          .from("school_messages")
          .insert(payload);
        if (error) throw error;
        form.reset();
        setStatus(
          "Your message has been sent to the school administration. Thank you for sharing your thoughts.",
          "وصلت رسالتك إلى إدارة المدرسة. شكرًا لمشاركتنا رأيك.",
          "success"
        );
      } catch (error) {
        console.error("Visitor message submission failed.", error);
        setStatus(
          "We couldn't send your message right now. Please try again in a moment.",
          "تعذّر إرسال رسالتك حاليًا. يرجى المحاولة مرة أخرى بعد قليل.",
          "error"
        );
      } finally {
        setSubmitting(false);
      }
    });

    window.addEventListener("hamad-language-change", () => {
      if (lastStatus) setStatus(lastStatus.english, lastStatus.arabic, lastStatus.kind);
      if (submitting) setSubmitting(true);
    });
  });
})();

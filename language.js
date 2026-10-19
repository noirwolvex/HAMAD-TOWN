(() => {
  "use strict";

  const STORAGE_KEY = "hamad-town-language";
  const translations = {
    "HAMAD TOWN": "مدينة حمد",
    "SCHOOL · GROW TOGETHER": "المدرسة · ننمو معًا",
    "Hamad Town School — A Place to Shine": "مدرسة مدينة حمد — حيث يتألّق الجميع",
    "School Portal — Hamad Town School": "بوابة المدرسة — مدرسة مدينة حمد",
    "Hamad Town School content publishing portal.": "بوابة نشر محتوى مدرسة مدينة حمد.",
    "Sign out": "تسجيل الخروج",
    "HAMAD TOWN SCHOOL · CONTENT PORTAL": "مدرسة مدينة حمد · بوابة المحتوى",
    "Switch language to English": "تغيير اللغة إلى الإنجليزية",
    "تغيير اللغة إلى العربية": "تغيير اللغة إلى العربية",
    "Discover the stories, achievements, activities and bright future of Hamad Town School.": "اكتشف قصص مدرسة مدينة حمد وإنجازاتها وأنشطتها ومستقبلها المشرق.",
    "Hamad Town School home": "الصفحة الرئيسية لمدرسة مدينة حمد",
    "Open navigation": "فتح القائمة",
    "Close navigation": "إغلاق القائمة",
    "Main navigation": "القائمة الرئيسية",
    "Our story": "قصتنا",
    "Achievements": "الإنجازات",
    "School life": "الحياة المدرسية",
    "Stories": "قصصنا",
    "Gallery": "معرض الصور",
    "School portal": "بوابة المدرسة",
    "LEARN · LEAD · SHINE": "نتعلّم · نقود · نتألّق",
    "Big dreams.": "أحلام كبيرة.",
    "Bright futures.": "ومستقبل مشرق.",
    "Every student has a story worth celebrating. Discover the people, moments and achievements that make Hamad Town School special.": "لكل طالب قصة تستحق الاحتفاء. تعرّف على الأشخاص واللحظات والإنجازات التي تجعل مدرسة مدينة حمد مكانًا مميزًا.",
    "Explore our highlights": "اكتشف أبرز إنجازاتنا",
    "Meet our school": "تعرّف على مدرستنا",
    "A community that believes in you.": "مجتمع يؤمن بقدراتك.",
    "Curiosity, character and achievement.": "الفضول العلمي، والأخلاق، والإنجاز.",
    "Students learning together in a bright classroom": "طلاب يتعلّمون معًا في صف دراسي مشرق",
    "Made to make a difference": "نصنع فرقًا حقيقيًا",
    "One student, one possibility at a time.": "نفتح بابًا جديدًا من الفرص لكل طالب.",
    "Every win matters": "كل نجاح يستحق الاحتفاء",
    "Big and small achievements": "إنجازات كبيرة وصغيرة",
    "Curious minds": "عقول فضولية",
    "kind hearts": "وقلوب طيبة",
    "01 / A SCHOOL FULL OF POSSIBILITIES": "٠١ / مدرسة تزخر بالفرص",
    "SCROLL TO DISCOVER": "مرّر لاكتشاف المزيد",
    "Our values": "قيمنا",
    "LEARN WITH PURPOSE": "نتعلّم بهدف",
    "CELEBRATE EVERY VOICE": "نحتفي بكل صوت",
    "GROW THROUGH CURIOSITY": "ننمو بالفضول والمعرفة",
    "BUILD A BRIGHTER TOMORROW": "نبني غدًا أكثر إشراقًا",
    "A LITTLE ABOUT US": "نبذة عن مدرستنا",
    "A school is more than": "المدرسة أكثر من مجرد",
    "four walls.": "جدران أربعة.",
    "It is where confidence grows, friendships begin, questions lead to discoveries, and tomorrow's possibilities start to feel real.": "هنا تنمو الثقة، وتبدأ الصداقات، وتقود الأسئلة إلى الاكتشافات، وتصبح فرص الغد أقرب إلى الواقع.",
    "Hamad Town School is a community of students, teachers and families working together to learn, create and achieve. This space celebrates our shared journey and the wonderful things happening every day.": "مدرسة مدينة حمد مجتمع يجمع الطلاب والمعلمين والأسر للتعلّم والإبداع وتحقيق الإنجازات. نحتفي هنا برحلتنا المشتركة وباللحظات الجميلة التي نصنعها كل يوم.",
    "Discover our school story": "اكتشف قصة مدرستنا",
    "Curiosity": "حب الاستطلاع",
    "We ask questions and keep discovering.": "نطرح الأسئلة ونواصل الاكتشاف.",
    "Character": "الأخلاق",
    "We lead with kindness, respect and courage.": "نتميّز باللطف والاحترام والشجاعة.",
    "Growth": "التطوّر",
    "We celebrate progress at every step.": "نحتفي بكل خطوة نحو التقدّم.",
    "02": "٠٢",
    "MOMENTS THAT MATTER": "لحظات تصنع الفرق",
    "Look what we've": "انظروا إلى ما",
    "achieved.": "حققناه.",
    "From proud milestones to the little wins that make a big difference, every achievement has a place here.": "من المحطات التي نفخر بها إلى النجاحات الصغيرة ذات الأثر الكبير، لكل إنجاز مكان هنا.",
    "Bringing our highlights together…": "نجمع أبرز إنجازاتنا…",
    "Share an achievement": "أضف إنجازًا",
    "03": "٠٣",
    "BEYOND THE CLASSROOM": "ما وراء الصفوف الدراسية",
    "Learning is an": "التعلّم",
    "adventure.": "مغامرة.",
    "Clubs, creative projects, sports and school events give every student a chance to find their thing.": "تمنح الأندية والمشروعات الإبداعية والرياضة والفعاليات المدرسية كل طالب فرصة لاكتشاف شغفه.",
    "Students taking part in a team activity": "طلاب يشاركون في نشاط جماعي",
    "A PLACE TO BELONG": "مكان نشعر فيه بالانتماء",
    "Find your people.": "اكتشف من يشبهك.",
    "Try something new.": "وجرّب شيئًا جديدًا.",
    "Every activity is a chance to build skills, friendships and memories.": "كل نشاط فرصة لاكتساب المهارات وبناء الصداقات وصنع الذكريات.",
    "WHAT'S HAPPENING": "ما الذي يحدث؟",
    "Little moments make school life unforgettable.": "لحظات صغيرة تجعل الحياة المدرسية لا تُنسى.",
    "Loading school life…": "جارٍ تحميل الأنشطة المدرسية…",
    "04": "٠٤",
    "STORIES FROM OUR COMMUNITY": "قصص من مجتمعنا",
    "Every story starts": "كل قصة تبدأ",
    "somewhere.": "من مكان ما.",
    "Meet the people, ideas and moments that make our school a community to be proud of.": "تعرّف على الأشخاص والأفكار واللحظات التي تجعل مدرستنا مجتمعًا نفخر به.",
    "Gathering our stories…": "نجمع قصصنا…",
    "05": "٠٥",
    "OUR SCHOOL, IN MOMENTS": "مدرستنا في صور",
    "A thousand words.": "صورة تغني عن ألف كلمة.",
    "A few snapshots.": "ولحظات لا تُنسى.",
    "Look back at the creativity, teamwork and smiles that fill our school days.": "استرجع لحظات الإبداع والعمل الجماعي والابتسامات التي تملأ أيامنا المدرسية.",
    "Students working together at school": "طلاب يتعاونون في المدرسة",
    "Learning together": "نتعلّم معًا",
    "A classroom full of learners": "صف دراسي مليء بالمتعلمين",
    "Small moments.": "لحظات صغيرة.",
    "Big memories.": "وذكريات كبيرة.",
    "Hamad Town School": "مدرسة مدينة حمد",
    "Students celebrating a project together": "طلاب يحتفلون بإنجاز مشروع معًا",
    "Made as a team": "أنجزناه كفريق",
    "HAVE A MOMENT TO CELEBRATE?": "هل لديك إنجاز يستحق الاحتفاء؟",
    "Our next great story": "قد تكون قصتنا الرائعة القادمة",
    "could be": "هي",
    "yours.": "قصتك أنت.",
    "Help us celebrate a student, teacher, activity or achievement. Every member of our school community can help tell the story.": "ساهم في الاحتفاء بطالب أو معلم أو نشاط أو إنجاز. لكل فرد في مجتمع مدرستنا دور في سرد قصتنا.",
    "Visit the school portal": "انتقل إلى بوابة المدرسة",
    "Celebrating our community.": "نحتفي بمجتمعنا.",
    "Inspiring what comes next.": "ونلهم خطواتنا القادمة.",
    "Return to the public website": "العودة إلى الموقع الرئيسي",
    "Made with pride, for our school community": "صُنع بفخر من أجل مجتمع مدرستنا",
    "Achievement": "إنجاز",
    "Award": "جائزة",
    "School highlight": "أبرز أخبار المدرسة",
    "School event": "فعالية مدرسية",
    "School gallery": "معرض المدرسة",
    "Student spotlight": "طالب متميّز",
    "Teacher spotlight": "معلم متميّز",
    "Our story": "قصتنا",
    "STUDENT ACHIEVEMENT": "إنجاز طلابي",
    "A MOMENT TO CELEBRATE": "لحظة تستحق الاحتفاء",
    "A proud moment for our learners": "لحظة فخر لطلابنا",
    "Recognising the effort, resilience and curiosity our students bring to every challenge.": "نقدّر الجهد والمثابرة وحب الاستطلاع الذي يبديه طلابنا في مواجهة كل تحدٍ.",
    "AWARDS & RECOGNITION": "الجوائز والتكريم",
    "EVERY STEP COUNTS": "كل خطوة مهمة",
    "Celebrating excellence, together": "نحتفي بالتميّز معًا",
    "Every milestone is a reminder of what can happen when talent meets dedication and support.": "كل محطة تذكّرنا بما يمكن تحقيقه حين تلتقي الموهبة بالإخلاص والدعم.",
    "CREATIVITY & INNOVATION": "الإبداع والابتكار",
    "THINK BIG": "فكّر بطموح",
    "Ideas that make a difference": "أفكار تصنع فرقًا",
    "Our school encourages students to share ideas, experiment boldly and learn by doing.": "نشجّع طلابنا على مشاركة أفكارهم والتجربة بثقة والتعلّم بالممارسة.",
    "CREATE": "أبدع",
    "Clubs & creative projects": "الأندية والمشروعات الإبداعية",
    "A space to imagine, make, experiment and discover a new talent.": "مساحة للتخيّل والصناعة والتجربة واكتشاف مواهب جديدة.",
    "PLAY": "العب",
    "Teamwork & sports": "الرياضة والعمل الجماعي",
    "Building confidence, friendships and the spirit of fair play.": "نعزّز الثقة والصداقات وروح اللعب النزيه.",
    "CONNECT": "تواصل",
    "School celebrations": "احتفالات المدرسة",
    "Sharing cultures, celebrating progress and making memories as one community.": "نتشارك الثقافات ونحتفي بالتقدّم ونصنع الذكريات كمجتمع واحد.",
    "OUR SCHOOL STORY": "قصة مدرستنا",
    "A community where everyone can shine": "مجتمع يتيح للجميع التألّق",
    "Every day, students and teachers bring their own talents and ideas to a shared journey of learning and growth.": "يضيف الطلاب والمعلمون كل يوم مواهبهم وأفكارهم إلى رحلة مشتركة من التعلّم والنمو.",
    "PEOPLE & PURPOSE": "الأشخاص والهدف",
    "The people behind every achievement": "الأشخاص وراء كل إنجاز",
    "Progress grows from encouragement, teamwork and the belief that every learner has potential.": "ينمو التقدّم بالتشجيع والعمل الجماعي والإيمان بقدرات كل متعلّم.",
    "CLASSROOM MOMENTS": "لحظات من الصف",
    "Little moments from a big learning journey.": "لحظات صغيرة من رحلة تعلّم كبيرة.",
    "CREATIVE THINKING": "تفكير إبداعي",
    "Making, trying and discovering together.": "نبتكر ونجرب ونكتشف معًا.",
    "SCHOOL COMMUNITY": "مجتمع المدرسة",
    "A community built on connection.": "مجتمع يجمعنا التواصل.",
    "DISCOVERY & TEAMWORK": "الاكتشاف والعمل الجماعي",
    "Every project brings a new possibility.": "كل مشروع يفتح بابًا جديدًا.",
    "SCHOOL PORTAL": "بوابة المدرسة",
    "View website": "عرض الموقع",
    "CMS": "إدارة المحتوى",
    "CONTENT MANAGEMENT": "إدارة المحتوى",
    "Make the good news": "اجعل أخبارنا الجميلة",
    "visible.": "مرئية للجميع.",
    "Add the moments, people and achievements that tell the story of Hamad Town School.": "أضف اللحظات والأشخاص والإنجازات التي تروي قصة مدرسة مدينة حمد.",
    "Sign in to publish": "سجّل الدخول للنشر",
    "Use your authorised school administrator account. Public visitors cannot manage school content.": "استخدم حساب إدارة المدرسة المعتمد. لا يستطيع زوّار الموقع إدارة محتوى المدرسة.",
    "Email address": "البريد الإلكتروني",
    "Password": "كلمة المرور",
    "Your password": "كلمة المرور",
    "Sign in securely": "تسجيل الدخول بأمان",
    "Demo mode — changes stay in this browser.": "الوضع التجريبي — تُحفَظ التغييرات في هذا المتصفح فقط.",
    "This preview saves content and uploaded images in this browser only. To publish content for every visitor, connect Supabase and apply": "تحفظ هذه النسخة التجريبية المحتوى والصور المرفوعة في هذا المتصفح فقط. لنشر المحتوى لجميع الزوار، اربط Supabase وطبّق",
    "Setup guide": "دليل الإعداد",
    "Total entries": "إجمالي المحتوى",
    "Published": "منشور",
    "Drafts": "مسودات",
    "CONTENT EDITOR": "محرر المحتوى",
    "Add a new story": "إضافة قصة جديدة",
    "Content type": "نوع المحتوى",
    "Student achievement": "إنجاز طالب",
    "Award / recognition": "جائزة / تكريم",
    "Activity / club": "نشاط / نادٍ",
    "School story": "قصة المدرسة",
    "Teacher spotlight": "تسليط الضوء على معلم",
    "Student spotlight": "تسليط الضوء على طالب",
    "School event": "فعالية مدرسية",
    "Gallery photo": "صورة للمعرض",
    "Year / date label": "السنة / التاريخ",
    "e.g. Academic year 2026": "مثال: العام الدراسي ٢٠٢٦",
    "Title": "العنوان",
    "Give this moment a title": "اكتب عنوانًا لهذه اللحظة",
    "Short label": "تصنيف قصير",
    "e.g. STUDENT ACHIEVEMENT": "مثال: إنجاز طلابي",
    "Story / description": "القصة / الوصف",
    "Share what happened and why it matters…": "اكتب ما حدث ولماذا يستحق الاحتفاء…",
    "Keep it warm, clear and respectful of student privacy.": "اكتب بوضوح وودّ، واحرص على خصوصية الطلاب.",
    "Photo or image": "صورة",
    "Paste an image URL (optional)": "ألصق رابط الصورة (اختياري)",
    "Image URL": "رابط الصورة",
    "＋ Upload photo": "＋ رفع صورة",
    "Image preview will appear here": "ستظهر معاينة الصورة هنا",
    "JPG, PNG, WEBP or GIF. Use school-approved photos and confirm permission before publishing.": "الصيغ المدعومة: JPG وPNG وWEBP وGIF. استخدم صورًا معتمدة من المدرسة وتأكد من الإذن قبل النشر.",
    "Featured highlight": "إبراز المحتوى",
    "Prioritise this entry in the content list.": "امنح هذا المحتوى أولوية في القائمة.",
    "Publish to website": "النشر على الموقع",
    "Drafts stay hidden from visitors.": "تبقى المسودات مخفية عن الزوار.",
    "Save content": "حفظ المحتوى",
    "Clear form": "مسح النموذج",
    "YOUR SCHOOL'S STORY": "قصة مدرستك",
    "Content library": "مكتبة المحتوى",
    "Export all content as JSON": "تصدير المحتوى بصيغة JSON",
    "Find a story…": "ابحث عن قصة…",
    "All content": "كل المحتوى",
    "Achievements": "الإنجازات",
    "Awards": "الجوائز",
    "Activities": "الأنشطة",
    "Stories": "القصص",
    "Teachers": "المعلمون",
    "Students": "الطلاب",
    "Events": "الفعاليات",
    "No entries match this view yet. Add a story using the editor.": "لا توجد عناصر مطابقة. أضف قصة باستخدام المحرر.",
    "Edit": "تعديل",
    "Delete": "حذف",
    "Content saved in current mode": "حُفِظ المحتوى في الوضع الحالي",
    "Ready": "جاهز",
    "A thoughtful school story.": "قصة مدرسية بمسؤولية.",
    "Please publish only approved photos and information. Avoid private contact details, student addresses, sensitive personal information, and unapproved identifying details about children.": "يرجى نشر الصور والمعلومات المعتمدة فقط. تجنّب معلومات الاتصال الخاصة وعناوين الطلاب والمعلومات الحساسة وأي تفاصيل تعريفية عن الأطفال دون موافقة.",
    "Return to the public website ↗": "العودة إلى الموقع الرئيسي ↗",
    "School portal ↗": "بوابة المدرسة ↗",
    "Setup guide ↗": "دليل الإعداد ↗",
    "Loading the content library…": "جارٍ تحميل مكتبة المحتوى…",
    "Editing:": "قيد التعديل:",
    "Untitled entry": "عنصر بلا عنوان",
    "Please add both a title and a description.": "يرجى إدخال العنوان والوصف.",
    "Please sign in before publishing.": "يرجى تسجيل الدخول قبل النشر.",
    "Saving your entry…": "جارٍ حفظ المحتوى…",
    "Saved successfully.": "تم الحفظ بنجاح.",
    "Saved just now": "حُفِظ للتو",
    "Saved in this browser. Connect Supabase to publish to everyone.": "حُفِظ في هذا المتصفح. اربط Supabase للنشر للجميع.",
    "Content saved to the shared school website.": "تم حفظ المحتوى على موقع المدرسة المشترك.",
    "Content deleted.": "تم حذف المحتوى.",
    "Saving…": "جارٍ الحفظ…",
    "No entries match this view yet. Add a story using the editor.": "لا توجد عناصر مطابقة بعد. أضف قصة باستخدام المحرر.",
    "Add a new story": "إضافة قصة جديدة",
    "Edit school content": "تعديل محتوى المدرسة",
    "this entry": "هذا المحتوى",
    "This cannot be undone.": "لا يمكن التراجع عن هذا الإجراء.",
    "Could not read the shared content library. Check the database setup and admin permissions.": "تعذّرت قراءة مكتبة المحتوى المشتركة. تحقّق من إعداد قاعدة البيانات وصلاحيات الإدارة.",
    "Please choose an image smaller than 8 MB.": "يرجى اختيار صورة يقل حجمها عن ٨ ميغابايت.",
    "Demo mode supports images up to 1 MB. Connect Supabase for larger uploads.": "يسمح الوضع التجريبي بصور تصل إلى ١ ميغابايت. اربط Supabase لرفع صور أكبر.",
    "The selected image could not be read.": "تعذّرت قراءة الصورة المحددة.",
    "Content export downloaded.": "تم تنزيل نسخة تصدير المحتوى.",
    "Shared publishing is configured but not ready yet. Showing demo content for now.": "تم إعداد النشر المشترك لكنه غير جاهز بعد. يتم عرض محتوى تجريبي مؤقتًا.",
    "Our next highlight could be here. Check back soon.": "قد يظهر إنجازنا القادم هنا. تابعنا قريبًا.",
    "School activities and events will appear here.": "ستظهر الأنشطة والفعاليات المدرسية هنا.",
    "New stories from our community will be shared here.": "ستُنشر هنا قصص جديدة من مجتمع مدرستنا.",
    "A moment to remember": "لحظة تستحق الذكرى",
    "Some school content could not be loaded. Please refresh the page.": "تعذّر تحميل بعض محتوى المدرسة. يرجى تحديث الصفحة.",
    "Signing in…": "جارٍ تسجيل الدخول…",
    "Signed in. Database permissions control what you can publish.": "تم تسجيل الدخول. تحدد صلاحيات قاعدة البيانات ما يمكنك نشره.",
    "You have been signed out.": "تم تسجيل الخروج.",
    "Could not verify the current session:": "تعذّر التحقق من الجلسة الحالية:",
    "Could not read the shared content library.": "تعذّرت قراءة مكتبة المحتوى المشتركة.",
    "English": "English",
    "Could not delete this entry.": "تعذّر حذف هذا المحتوى.",
    "Please select a supported image file.": "يرجى اختيار ملف صورة مدعوم.",
    "Could not read the selected image.": "تعذّرت قراءة الصورة المحددة.",
    "Draft": "مسودة",
    "Featured": "مميّز",
    "English": "English",
    "العربية": "العربية",
    "Switch language": "تغيير اللغة"
  };

  const attributeTranslations = {
    "aria-label": {
      "Hamad Town School home": "الصفحة الرئيسية لمدرسة مدينة حمد",
      "Open navigation": "فتح القائمة",
      "Close navigation": "إغلاق القائمة",
      "Main navigation": "القائمة الرئيسية",
      "Image URL": "رابط الصورة",
      "Export content as JSON": "تصدير المحتوى بصيغة JSON",
      "Search content": "البحث في المحتوى",
      "Filter by content type": "تصفية حسب نوع المحتوى",
      "Selected image preview": "معاينة الصورة المحددة",
      "Return to the public website": "العودة إلى الموقع الرئيسي",
      "Switch language": "تغيير اللغة"
    },
    "placeholder": {
      "e.g. Academic year 2026": "مثال: العام الدراسي ٢٠٢٦",
      "Give this moment a title": "اكتب عنوانًا لهذه اللحظة",
      "e.g. STUDENT ACHIEVEMENT": "مثال: إنجاز طلابي",
      "Share what happened and why it matters…": "اكتب ما حدث ولماذا يستحق الاحتفاء…",
      "Paste an image URL (optional)": "ألصق رابط الصورة (اختياري)",
      "admin@school.example": "admin@school.example",
      "Your password": "كلمة المرور",
      "Find a story…": "ابحث عن قصة…"
    },
    "alt": {
      "Students learning together in a bright classroom": "طلاب يتعلّمون معًا في صف دراسي مشرق",
      "Students taking part in a team activity": "طلاب يشاركون في نشاط جماعي",
      "Students working together at school": "طلاب يتعاونون في المدرسة",
      "A classroom full of learners": "صف دراسي مليء بالمتعلمين",
      "Students celebrating a project together": "طلاب يحتفلون بإنجاز مشروع معًا"
    },
    "title": {
      "Hamad Town School — A Place to Shine": "مدرسة مدينة حمد — حيث يتألّق الجميع",
      "Export all content as JSON": "تصدير المحتوى بصيغة JSON"
    }
  };

  const originalText = new WeakMap();
  const originalAttrs = new WeakMap();
  let currentLanguage = "ar";
  let observer = null;

  function getSavedLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "ar";
    } catch (_) {
      return "ar";
    }
  }

  function setTextNode(node) {
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    if (node.parentElement?.closest("#languageToggle")) return;
    const original = originalText.get(node);
    const trimmed = original.trim();
    if (!trimmed) return;
    let translated = currentLanguage === "ar" ? translations[trimmed] : null;
    if (currentLanguage === "ar" && !translated && trimmed.startsWith("Editing: ")) {
      translated = "قيد التعديل: " + trimmed.slice("Editing: ".length);
    }
    if (currentLanguage === "ar" && !translated && trimmed.startsWith("Could not read the shared content library. ")) {
      translated = "تعذّرت قراءة مكتبة المحتوى المشتركة. " + trimmed.slice("Could not read the shared content library. ".length);
    }
    const leading = (original.match(/^\s*/) || [""])[0];
    const trailing = (original.match(/\s*$/) || [""])[0];
    const next = translated ? leading + translated + trailing : original;
    if (node.nodeValue !== next) node.nodeValue = next;
  }

  function translateAttribute(el, name) {
    if (!originalAttrs.has(el)) originalAttrs.set(el, {});
    const attrs = originalAttrs.get(el);
    if (!(name in attrs)) attrs[name] = el.getAttribute(name);
    const original = attrs[name];
    if (original === null) return;
    const dictionary = attributeTranslations[name] || {};
    const next = currentLanguage === "ar" ? (dictionary[original] || translations[original] || original) : original;
    if (el.getAttribute(name) !== next) el.setAttribute(name, next);
  }

  function translateTree(root = document) {
    const start = root.nodeType === Node.DOCUMENT_NODE ? root.body : root;
    if (!start) return;
    if (start.nodeType === Node.ELEMENT_NODE) {
      ["placeholder", "aria-label", "alt", "title"].forEach(name => {
        if (start.hasAttribute(name)) translateAttribute(start, name);
      });
    }
    const walker = document.createTreeWalker(start, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest("script, style, noscript, textarea, input, select option, #languageToggle")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) setTextNode(node);
    if (start.querySelectorAll) {
      start.querySelectorAll("[placeholder], [aria-label], [alt], [title]").forEach(el => {
        ["placeholder", "aria-label", "alt", "title"].forEach(name => {
          if (el.hasAttribute(name)) translateAttribute(el, name);
        });
      });
    }
  }

  function applyLanguage(language) {
    currentLanguage = language === "en" ? "en" : "ar";
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
    try { localStorage.setItem(STORAGE_KEY, currentLanguage); } catch (_) {}
    const title = document.querySelector("title");
    if (title) {
      const enTitle = title.dataset.englishTitle || title.textContent.trim();
      title.dataset.englishTitle = enTitle;
      title.textContent = currentLanguage === "ar"
        ? (translations[enTitle] || enTitle)
        : enTitle;
    }
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      if (!description.dataset.englishContent) description.dataset.englishContent = description.content;
      description.content = currentLanguage === "ar"
        ? (translations[description.dataset.englishContent] || description.dataset.englishContent)
        : description.dataset.englishContent;
    }
    translateTree(document);
    const toggle = document.getElementById("languageToggle");
    if (toggle) {
      toggle.textContent = currentLanguage === "ar" ? "English" : "العربية";
      toggle.setAttribute("aria-label", currentLanguage === "ar" ? "Switch language to English" : "تغيير اللغة إلى العربية");
      toggle.setAttribute("lang", currentLanguage === "ar" ? "en" : "ar");
    }
    document.documentElement.classList.toggle("language-ar", currentLanguage === "ar");
    document.documentElement.classList.toggle("language-en", currentLanguage === "en");
    window.dispatchEvent(new CustomEvent("hamad-language-change", { detail: { language: currentLanguage } }));
  }

  function start() {
    applyLanguage(getSavedLanguage());
    const toggle = document.getElementById("languageToggle");
    if (toggle) toggle.addEventListener("click", () => applyLanguage(currentLanguage === "ar" ? "en" : "ar"));
    if ("MutationObserver" in window) {
      observer = new MutationObserver(records => {
        for (const record of records) {
          if (record.type === "childList") record.addedNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) setTextNode(node);
            else if (node.nodeType === Node.ELEMENT_NODE) translateTree(node);
          });
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
    window.HamadI18n = {
      getLanguage: () => currentLanguage,
      setLanguage: applyLanguage,
      t: key => currentLanguage === "ar" ? (translations[key] || key) : key
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();

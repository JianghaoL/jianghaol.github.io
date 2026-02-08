/**
 * Translations Configuration
 * 
 * Central repository for all translatable text on the site.
 * 
 * Structure:
 *   translations.{lang}.{key}
 * 
 * Conventions:
 *   - EN keys contain the actual English text.
 *   - ZH keys use "[ZH] ..." placeholders — replace with real Chinese translations.
 *   - Keys are namespaced by page/section: nav.*, footer.*, home.*, about.*, etc.
 *   - To add a new language, create a new top-level object (e.g. translations.ja).
 *
 * Usage in HTML:
 *   <span data-i18n="nav.home">Home</span>
 *   <p data-i18n="home.hero.role">Game Developer & Audio Engineer</p>
 *
 * The i18n.js module reads these at page load and applies the correct language
 * based on the URL path (/en/... or /zh/...).
 */

window.__translations = {

  // =========================================================================
  // ENGLISH
  // =========================================================================
  en: {

    // ----- Navigation (shared across all pages) -----
    'nav.home':        'Home',
    'nav.workGallery': 'Work Gallery',
    'nav.blog':        'Blog',
    'nav.about':       'About',
    'lang.toggle':     '中文',

    // ----- Footer (shared) -----
    'footer.copyright': '© 2026 Jianghao Li. All rights reserved.',

    // =================================================================
    // HOME PAGE
    // =================================================================

    // Hero
    'home.hero.name':     'JIANGHAO LI',
    'home.hero.role':     'Game Developer & Audio Engineer',
    'home.hero.subtitle': 'Interactive experiences • Immersive soundscapes',

    // Intro
    'home.intro.heading': "Hello — I'm Jianghao",
    'home.intro.lead':    'I build interactive experiences and design immersive soundscapes. I work across game development, audio engineering, and interactive media.',
    'home.intro.type':    'I make playful systems, believable audio, and clean code.',

    // Skills
    'home.skill.1': 'Unity / C#',
    'home.skill.2': 'FMOD / Wwise',
    'home.skill.3': 'DSP & Synthesis',
    'home.skill.4': 'Interactive Sound',
    'home.skill.5': 'JUCE & C++',
    'home.skill.6': 'Python & ML',

    // Selected Work
    'home.work.heading':  'Selected Work',
    'home.work.subtitle': 'Hover over a card to see details',

    // Work Gallery Section
    'home.gallery.heading': 'My Work Gallery',
    'home.gallery.text':    'Explore my projects and designs.',
    'home.gallery.btn':     'View Gallery',

    // Contact Section
    'home.contact.heading':   'Contact',
    'home.contact.text':      "Let's build together — reach out!",
    'home.contact.myContact': 'My Contact',
    'home.contact.resume':    'Resume',
    'home.contact.linkedin':  'LinkedIn',
    'home.contact.github':    'GitHub',

    // ----- Contact Modal -----
    'contact.phone.label':    'Phone',
    'contact.phone.value':    '+1 (213) 994-2364',
    'contact.email.label':    'Email',
    'contact.location.label': 'Location',
    'contact.location.value': 'Los Angeles, CA',

    // ----- Resume Modal -----
    'resume.title':       'Resume',
    'resume.name':        'Jianghao Li',
    'resume.role':        'Game Designer & Developer',
    'resume.location':    'Los Angeles, CA',
    'resume.email':       'jianghaoli800@gmail.com',
    'resume.download':    'Download Resume (PDF)',

    'resume.education.heading': 'Education',
    'resume.education.school':  'University of Southern California',
    'resume.education.date':    'Expected Graduation: 2028',
    'resume.education.item1':   'BFA in Game Development and Interactive Design',
    'resume.education.item2':   'Minor in Video Game Programming',
    'resume.education.item3':   'Minor in Music Recording',

    'resume.skills.heading': 'Skills & Proficiency',
    'resume.skills.cat1':    'Game Development',
    'resume.skills.cat2':    'Programming',
    'resume.skills.cat3':    'Audio',
    'resume.skills.cat4':    'Tools & Other',

    'resume.focus.heading':  'Focus Areas',
    'resume.focus.title1':   'Game Design & Development',
    'resume.focus.desc1':    'Specializing in creating games that are educationally significant and impactful, with a focus on meaningful player experiences.',
    'resume.focus.title2':   'Sound Design & Audio Implementation',
    'resume.focus.desc2':    'Expertise in sound design and audio engineering for games and theater, utilizing middleware solutions like FMOD and Wwise.',
    'resume.focus.title3':   'Audio Engineering',
    'resume.focus.desc3':    'Professional experience in studio recording, mixing, and audio production for various media.',

    // =================================================================
    // ABOUT PAGE
    // =================================================================
    'about.vision.heading': 'Change the world with games',
    'about.vision.text':    'Making constant effort to create games that are educationally significant and impactful.',
    'about.viewResume':     'View Resume',

    'about.intro.heading': 'Introduction',
    'about.intro.p1':      'Hi! I am Jianghao Li.',
    'about.intro.p2':      'Born in China, I currently live in Los Angeles.',
    'about.intro.p3':      'I am a game designer focusing on program development, sound design and implementation, and audio engineering for games and theater.',

    'about.skills.heading': 'Skills and Proficiency',
    'about.skills.1': 'Unity',
    'about.skills.2': 'C#, C++, Python, Java',
    'about.skills.3': 'FMOD, Wwise',
    'about.skills.4': 'Version Control Systems(Git, Perforce)',
    'about.skills.5': 'Audio Engineering',
    'about.skills.6': 'Studio One, Logic Pro',
    'about.skills.7': 'Procreate',
    'about.skills.8': 'Bilingual(Mandarin & English)',

    'about.education.heading': 'Education',
    'about.education.school':  'University of Southern California',
    'about.education.degree':  'BFA Game Development and Interactive Design',
    'about.education.minor1':  'Minor in Video Game Programming',
    'about.education.minor2':  'Minor in Music Recording',

    // =================================================================
    // WORK GALLERY PAGE
    // =================================================================
    'gallery.hero.title':    'Work Gallery',
    'gallery.hero.subtitle': 'Explore my projects and creative works',
    'gallery.sort.category': 'By Category',
    'gallery.sort.date':     'By Date',
    'gallery.sort.alpha':    'A – Z',

    // =================================================================
    // BLOG PAGE
    // =================================================================
    'blog.hero.title':    'Blog',
    'blog.hero.subtitle': 'Geek musings, tech insights, and creative experiments',
    'blog.toc.heading':   'Quick Jump',

    // =================================================================
    // PROJECT PAGES — Common UI
    // =================================================================
    'project.techStack':    'Tech Stack',
    'project.myRole':       'My Role',
    'project.team':         'Team',
    'project.cta.heading':  'Explore the Project',
    'project.nav.all':      'All Projects',
    'project.downloadNow':  'Download Now',
    'project.playGame':     'Play Game',
    'project.viewSource':   'View Source',

    // =================================================================
    // PROJECT PAGES — Per-project content
    // Add keys here for each project. The pattern is:
    //   project.{slug}.title        - Project name
    //   project.{slug}.shortDesc    - Brief tagline (for carousel card front)
    //   project.{slug}.summary      - Full description (for carousel card back & project pages)
    //   project.{slug}.section.{n}  - Section headings
    //   project.{slug}.p.{n}        - Paragraph text
    //
    // The HTML elements carry matching data-i18n attributes.
    // For carousel use: add to workData in work-carousel.js
    // =================================================================

    // -- CrossfadER --
    'project.crossfader.title':   'CrossfadER',
    'project.crossfader.summary': 'An audio tool automating the looping sound production workflow.',

    // -- Forest Fears --
    'project.forestFears.title':   'Forest Fears',
    'project.forestFears.summary': 'An educational game that aims to help players gain awareness of nature and its connection with humans.',

    // -- Mantle --
    'project.mantle.title':     'Mantle',
    'project.mantle.shortDesc': 'A narrative-driven game experience',
    'project.mantle.summary':   'A game that focuses on narrative, seeking ways to guide players into believing different design ideas.',

    // -- Dough it Yourself --
    'project.doughItYourself.title':     'Dough it Yourself',
    'project.doughItYourself.shortDesc': 'GMTK 2025 game jam puzzle game',
    'project.doughItYourself.summary':   'A donut making puzzle game made for GMTK 2025.',

    // -- SpongeBob Musical --
    'project.spongebobMusical.title':     'SpongeBob Musical',
    'project.spongebobMusical.shortDesc': 'Broadway musical sound design',
    'project.spongebobMusical.summary':   'Juvenile version of the Broadway musical: SpongeBob.',

    // -- SpongeBob Soundtrack --
    'project.spongebobSoundtrack.title':   'SpongeBob Soundtrack',
    'project.spongebobSoundtrack.summary': 'Post-show soundtrack production.',

    // -- Theme for Carnival --
    'project.themeCarnival.title':   'Theme for Carnival',
    'project.themeCarnival.summary': 'Instrumental music piece produced for an annual carnival.',

    // -- Blender-Unity Communicator --
    'project.blenderUnity.title':   'Blender-Unity Communicator',
    'project.blenderUnity.summary': 'A tool to streamline the workflow of transferring 3D models from Blender to Unity.',

    // -- Sisyphus's Worst Day --
    'project.sisyphus.title':   "Sisyphus's Worst Day",
    'project.sisyphus.summary': 'An innovative puzzle game that reimagines the myth of Sisyphus in a modern context.',

    // -- Whiteout --
    'project.whiteout.title':   'Whiteout',
    'project.whiteout.summary': 'An innovative puzzle game that reimagines the myth of Sisyphus in a modern context.',

    // =================================================================
    // WORK CAROUSEL — Generic labels (project-specific content uses project.* keys)
    // =================================================================
    'carousel.techStack':    'Tech Stack',
    'carousel.viewProject':  'View Project',

    // =================================================================
    // WORK GALLERY — Category labels and UI
    // =================================================================
    'category.gameDevelopment':  'Game Development',
    'category.gameAudio':        'Game Audio',
    'category.developmentTool':  'Development Tool',
    'category.audioTool':        'Audio Tool',
    'category.audioProduction':  'Audio Production',
    'category.theater':          'Theater',
    'gallery.viewProject':       'View Project',
  },

  // =========================================================================
  // CHINESE  —  Replace [ZH] placeholders with real translations
  // =========================================================================
  zh: {

    // ----- Navigation -----
    'nav.home':        '首页',
    'nav.workGallery': '作品展廊',
    'nav.blog':        '博客',
    'nav.about':       '关于',
    'lang.toggle':     'EN',

    // ----- Footer -----
    'footer.copyright': '© 2026 李江浩 版权所有',

    // =================================================================
    // HOME PAGE
    // =================================================================
    'home.hero.name':     '李江浩',
    'home.hero.role':     '游戏开发者 & 音频工程师',
    'home.hero.subtitle': '交互体验 • 沉浸式音景',

    'home.intro.heading': '你好 — 我是李江浩',
    'home.intro.lead':    '我构建交互体验并设计沉浸式音景。我在游戏开发、音频工程和交互媒体领域工作。',
    'home.intro.type':    '我制作有趣的系统、设计可信的音频和编写简洁的代码。',

    'home.skill.1': 'Unity / C#',
    'home.skill.2': 'FMOD / Wwise',
    'home.skill.3': '数字信号处理 & 合成',
    'home.skill.4': '交互式声音',
    'home.skill.5': 'JUCE & C++',
    'home.skill.6': 'Python & 机器学习',

    'home.work.heading':  '精选作品',
    'home.work.subtitle': '将鼠标悬停在卡片上查看详情',

    'home.gallery.heading': '我的作品展廊',
    'home.gallery.text':    '探索我的项目和设计。',
    'home.gallery.btn':     '查看展廊',

    'home.contact.heading':   '联系',
    'home.contact.text':      '让我们一起创造新世界 — 联系我！',
    'home.contact.myContact': '联系方式',
    'home.contact.resume':    '简历',
    'home.contact.linkedin':  '领英',
    'home.contact.github':    'GitHub',

    // ----- Contact Modal -----
    'contact.phone.label':    '电话',
    'contact.phone.value':    '+1 (213) 994-2364',
    'contact.email.label':    '电子邮件',
    'contact.location.label': '地点',
    'contact.location.value': '洛杉矶，加利福尼亚州',

    // ----- Resume Modal -----
    'resume.title':       '简历',
    'resume.name':        '李江浩',
    'resume.role':        '游戏设计师 & 开发者',
    'resume.location':    '洛杉矶，加利福尼亚州',
    'resume.email':       'jianghaoli800@gmail.com',
    'resume.download':    '下载简历 (PDF)',

    'resume.education.heading': '教育背景',
    'resume.education.school':  '南加州大学',
    'resume.education.date':    '预计毕业时间：2028年',
    'resume.education.item1':   '游戏开发与交互设计学士学位',
    'resume.education.item2':   '视频游戏编程辅修',
    'resume.education.item3':   '音乐录音辅修',

    'resume.skills.heading': '技术与能力',
    'resume.skills.cat1':    '游戏开发',
    'resume.skills.cat2':    '编程',
    'resume.skills.cat3':    '音频',
    'resume.skills.cat4':    '工具与其他',

    'resume.focus.heading':  '重点领域',
    'resume.focus.title1':   '游戏设计与开发',
    'resume.focus.desc1':    '专注于创建具有教育意义和影响力的游戏，注重有意义的玩家体验。',
    'resume.focus.title2':   '声音设计与音频实现',
    'resume.focus.desc2':    '在游戏和戏剧的声音设计与音频工程方面具有专业知识，使用FMOD和Wwise等中间件解决方案。',
    'resume.focus.title3':   '音频工程',
    'resume.focus.desc3':    '在录音棚录音、混音和各种媒体的音频制作方面具有专业经验。',

    // =================================================================
    // ABOUT PAGE
    // =================================================================
    'about.vision.heading': '用游戏改变世界',
    'about.vision.text':    '不断努力创造具有教育意义和影响力的游戏。',
    'about.viewResume':     '查看简历',

    'about.intro.heading': '简介',
    'about.intro.p1':      '你好！我是李江浩。',
    'about.intro.p2':      '我出生在中国，目前居住在洛杉矶。',
    'about.intro.p3':      '我是一名游戏设计师，专注于程序开发、声音设计与实现，以及游戏和戏剧的音频工程。',

    'about.skills.heading': '技术与能力',
    'about.skills.1': 'Unity',
    'about.skills.2': 'C#, C++, Python, Java',
    'about.skills.3': 'FMOD, Wwise',
    'about.skills.4': '版本控制系统（Git，Perforce）',
    'about.skills.5': '音频工程',
    'about.skills.6': 'Studio One, Logic Pro',
    'about.skills.7': 'Procreate',
    'about.skills.8': '双语（普通话和英语）',

    'about.education.heading': '教育背景',
    'about.education.school':  '南加州大学',
    'about.education.degree':  '游戏开发与交互设计学士学位',
    'about.education.minor1':  '视频游戏编程辅修',
    'about.education.minor2':  '音乐录音辅修',

    // =================================================================
    // WORK GALLERY PAGE
    // =================================================================
    'gallery.hero.title':    '作品展廊',
    'gallery.hero.subtitle': '浏览我的项目和创意作品',
    'gallery.sort.category': '按类别',
    'gallery.sort.date':     '按日期',
    'gallery.sort.alpha':    'A – Z',

    // =================================================================
    // BLOG PAGE
    // =================================================================
    'blog.hero.title':    '博客',
    'blog.hero.subtitle': '极客随笔、技术见解和创意实验',
    'blog.toc.heading':   '快速跳转',

    // =================================================================
    // PROJECT PAGES — Common UI
    // =================================================================
    'project.techStack':    '技术栈',
    'project.myRole':       '我的角色',
    'project.team':         '团队',
    'project.cta.heading':  '探索项目',
    'project.nav.all':      '所有项目',
    'project.downloadNow':  '立即下载',
    'project.playGame':     '开始游戏',
    'project.viewSource':   '查看源码',

    // =================================================================
    // PROJECT PAGES — Per-project content
    // Add keys here for each project. The pattern is:
    //   project.{slug}.title        - Project name
    //   project.{slug}.shortDesc    - Brief tagline (for carousel card front)
    //   project.{slug}.summary      - Full description (for carousel card back & project pages)
    //   project.{slug}.section.{n}  - Section headings
    //   project.{slug}.p.{n}        - Paragraph text
    //
    // The HTML elements carry matching data-i18n attributes.
    // For carousel use: add to workData in work-carousel.js
    // =================================================================

    'project.crossfader.title':   'CrossfadER',
    'project.crossfader.summary': '一个自动化循环声音制作流程的音频工具。',

    'project.forestFears.title':   'Forest Fears',
    'project.forestFears.summary': '一款教育游戏，旨在帮助玩家了解自然及其与人类的联系。',

    'project.mantle.title':     'Mantle',
    'project.mantle.shortDesc': '叙事驱动的游戏体验',
    'project.mantle.summary':   '一款注重叙事的游戏，探索引导玩家相信不同设计理念的方法。',

    'project.doughItYourself.title':     'Dough it Yourself',
    'project.doughItYourself.shortDesc': 'GMTK 2025 游戏制作挑战解谜游戏',
    'project.doughItYourself.summary':   '一款为GMTK 2025制作的甜甜圈制作的解密游戏。',

    'project.spongebobMusical.title':     '海绵宝宝音乐剧',
    'project.spongebobMusical.shortDesc': '百老汇音乐剧声音设计',
    'project.spongebobMusical.summary':   '百老汇音乐剧《海绵宝宝》的青少年版。',

    'project.spongebobSoundtrack.title':   '海绵宝宝原声带',
    'project.spongebobSoundtrack.summary': '演出后的原声带制作。',

    'project.themeCarnival.title':   '嘉年华主题曲',
    'project.themeCarnival.summary': '为年度嘉年华制作的器乐曲。',

    'project.blenderUnity.title':   'Blender-Unity 通信工具',
    'project.blenderUnity.summary': '一个简化从 Blender 到 Unity 传输 3D 模型工作流程的工具。',

    'project.sisyphus.title':   'Sisyphus\'s Worst Day',
    'project.sisyphus.summary': '一款创新性的解密游戏，将西西弗斯的神话重新构想于现代背景。',

    'project.whiteout.title':   'Whiteout',
    'project.whiteout.summary': 'Game Jam作品，探索人类在社会压力下的心理状态。',

    // =================================================================
    // WORK CAROUSEL — Generic labels (project-specific content uses project.* keys)
    // =================================================================
    'carousel.techStack':    '技术栈',
    'carousel.viewProject':  '查看项目',

    // =================================================================
    // WORK GALLERY — Category labels and UI
    // =================================================================
    'category.gameDevelopment':  '游戏开发',
    'category.gameAudio':        '游戏音频',
    'category.developmentTool':  '开发工具',
    'category.audioTool':        '音频工具',
    'category.audioProduction':  '音频制作',
    'category.theater':          '戏剧',
    'gallery.viewProject':       '查看项目',
  }
};

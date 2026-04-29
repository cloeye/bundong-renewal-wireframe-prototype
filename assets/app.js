const data = window.BUNDONG_WIREFRAME_DATA;
const app = document.getElementById('app');
let heroIndex = 0;
let heroTimer = null;
let pendingScrollTarget = null;
let lastRenderedRoute = null;

function routeKey() {
  const key = window.location.hash.replace(/^#\/?/, '').trim();
  return key || 'home';
}

function routeHref(key) {
  return `#/${key}`;
}

const SUBPAGE_META = {
  church: {
    group: '번동제일교회는',
    hero: '교회 외관 / 공동체 대표 이미지',
    items: ['우리교회는', '걸어온 길', '시설안내', '교회조직', '섬기는 사람들', '오시는 길'],
  },
  news: {
    news: 'section-news-board',
    'news/bulletin': 'section-news-bulletin',
    'news/family-worship': 'section-news-family',
    'news/album': 'section-news-album',
    'news/resources': 'section-news-resources',
  },
  newcomers: {
    group: '처음오셨나요',
    hero: '새가족 환영 / 안내 대표 이미지',
    items: ['담임목사 인사말', '새가족 등록안내', '새가족 교육', '새가족 섬김이', '새가족환영회', '금주의 새가족'],
  },
  worship: {
    group: '예배안내',
    hero: '예배 대표 이미지',
    items: ['예배시간/장소', '차량운행안내'],
  },
  media: {
    group: '말씀&찬양',
    hero: '설교 영상 / 예배 장면',
    items: ['주일예배', '수요예배', '오후찬양예배', '청년예배', '금요저녁예배'],
  },
  news: {
    group: '교회소식',
    hero: '공지 / 주보 대표 이미지',
    items: ['교회소식', '주보', '가정예배 순서지', '교회앨범', '기타 자료실'],
  },
  album: {
    group: '교회앨범',
    hero: '앨범 대표 이미지',
    items: ['최근 앨범', '행사 사진', '교육/친교 사진', '영상 아카이브'],
  },
  anniversary: {
    group: '창립 60주년',
    hero: '60주년 대표 비주얼',
    items: ['메인', '대표 연혁', '영상', '행사 자료'],
  },
  memorial: {
    group: '故 백낙기목사 기념관',
    hero: '기념관 대표 이미지',
    items: ['소개', '약력', '가족', '갤러리'],
  },
  policy: {
    group: '정책 및 신뢰 요소',
    hero: '정책 / 보안 안내',
    items: ['개인정보', '이용안내', '이메일수집거부', 'SSL/SEO'],
  },
};

const NAV_STRUCTURE = [
  {
    key: 'church',
    label: '번동제일교회는',
    items: [
      { route: 'church', label: '우리교회는', summary: '번동제일교회의 정체성과 공동체 소개를 먼저 확인하는 화면입니다.' },
      { route: 'church/history', label: '걸어온 길', summary: '1964년 천막 예배에서 창립 60주년까지 이어진 교회의 걸음을 확인하는 화면입니다.' },
      { route: 'church/facility', label: '시설안내', summary: '본관과 선교교육관의 주요 공간과 예배 동선을 안내하는 화면입니다.' },
      { route: 'church/organization', label: '교회조직', summary: '부서소개와 교구소개를 한 화면에서 찾을 수 있도록 정리한 안내 화면입니다.' },
      { route: 'church/staff', label: '섬기는 사람들', summary: '담임목사와 교역자, 부서 담당자 정보를 표 형태로 정리한 화면입니다.' },
      { route: 'church/directions', label: '오시는 길', summary: '주소, 교통, 주차와 지도 영역을 중심으로 방문 정보를 제공하는 화면입니다.' },
    ],
  },
  {
    key: 'newcomers',
    label: '처음오셨나요',
    items: [
      { route: 'newcomers', label: '어서오세요', summary: '처음 방문한 분들을 환영하고 교회의 방향을 소개하는 첫 안내 화면입니다.' },
      { route: 'newcomers/greeting', label: '담임목사 인사말', summary: '처음 방문한 분들에게 교회의 분위기와 환영 메시지를 전하는 인사말 화면입니다.' },
      { route: 'newcomers/registration', label: '새가족 등록안내', summary: '처음 방문부터 등록카드 작성, 안내 연결까지 한눈에 보여주는 화면입니다.' },
      { route: 'newcomers/education', label: '새가족 교육', summary: '새가족 교육 과정과 정착 흐름을 안내하는 화면입니다.' },
      { route: 'newcomers/helper', label: '새가족 섬김이', summary: '새가족을 돕는 섬김이 역할과 연결 구조를 소개하는 화면입니다.' },
      { route: 'newcomers/welcome-party', label: '새가족환영회', summary: '환영회 사진과 게시판 연결을 제공하는 화면입니다.' },
      { route: 'newcomers/weekly-family', label: '금주의 새가족', summary: '해시태그와 최근 게시물 형식으로 금주의 새가족을 소개하는 화면입니다.' },
    ],
  },
  {
    key: 'worship',
    label: '예배안내',
    items: [
      { route: 'worship', label: '예배시간/장소', summary: '주일예배와 교회학교 예배 시간, 장소를 표로 확인하는 화면입니다.' },
      { route: 'worship/school', label: '교회학교 예배', summary: '각 부서별 예배 시간과 장소를 확인하는 화면입니다.' },
      { route: 'worship/shuttle', label: '차량운행안내', summary: '주일 차량 코스와 운행 시간표를 중심으로 구성한 안내형 화면입니다.' },
    ],
  },
  {
    key: 'media',
    label: '말씀&찬양',
    items: [
      { route: 'media', label: '주일예배', summary: '주일예배 영상과 설교 요약을 중심으로 한 대표 미디어 화면입니다.' },
      { route: 'media/youth', label: '청년예배', summary: '청년예배 영상, 모임 안내, 관련 콘텐츠를 묶어 보여주는 화면입니다.' },
      { route: 'media/praise', label: '찬양예배', summary: '찬양으로 함께 드리는 주일 오후 예배 영상 화면입니다.' },
      { route: 'media/prayer', label: '기도회', summary: '수요기도회, 금요기도회, 새벽기도회 영상을 묶어 보여주는 화면입니다.' },
      { route: 'media/choir', label: '찬양대', summary: '찬양대의 찬양 영상을 모아 보여주는 화면입니다.' },
      { route: 'media/events', label: '집회 및 행사', summary: '집회와 행사 영상 콘텐츠를 모아 보여주는 화면입니다.' },
    ],
  },
  {
    key: 'news',
    label: '교회소식',
    items: [
      { route: 'news', label: '교회소식', summary: '공지사항과 주간 소식을 최신순으로 정리한 게시판형 화면입니다.' },
      { route: 'news/bulletin', label: '주보', summary: '최신 주보를 미리보기와 목록으로 확인할 수 있는 화면입니다.' },
      { route: 'news/family-worship', label: '가정예배 순서지', summary: '가정예배 순서지를 모아 확인하는 자료실형 화면입니다.' },
      { route: 'news/album', label: '교회앨범', summary: '카테고리별 교회 앨범을 카드형 게시판으로 확인하는 화면입니다.' },
      { route: 'news/resources', label: '기타 자료실', summary: '공고와 행정 자료 등 기타 자료형 게시물을 모아두는 화면입니다.' },
    ],
  },
];


const LANDING_SCROLL_TARGETS = {
  worship: {
    worship: 'section-worship-times',
    'worship/school': 'section-worship-school',
    'worship/shuttle': 'section-worship-shuttle',
  },
  media: {
    media: 'section-media-sunday',
    'media/youth': 'section-media-youth',
    'media/praise': 'section-media-praise',
    'media/prayer': 'section-media-prayer',
    'media/choir': 'section-media-choir',
    'media/events': 'section-media-events',
  },
  newcomers: {
    'newcomers/greeting': 'section-newcomers-greeting',
    'newcomers/registration': 'section-newcomers-registration',
    'newcomers/education': 'section-newcomers-education',
    'newcomers/helper': 'section-newcomers-helper',
    'newcomers/welcome-party': 'section-newcomers-welcome-party',
    'newcomers/weekly-family': 'section-newcomers-weekly-family',
  },
};

function getLandingScrollTarget(route) {
  const groupKey = getGroupKey(route);
  return (LANDING_SCROLL_TARGETS[groupKey] || {})[route] || '';
}

function getLandingBaseRoute(route) {
  const groupKey = getGroupKey(route);
  return LANDING_SCROLL_TARGETS[groupKey] ? groupKey : route;
}

function renderSubpageSecondMenuItem(item, activeKey, options = {}) {
  const target = getLandingScrollTarget(item.route);
  const hrefRoute = options.landingBaseRoute || item.route;
  const scrollAttr = target ? ` data-scroll-target="${escapeHtml(target)}"` : '';
  const scrollClass = target ? ' is-scroll-link' : '';
  return `
                  <a class="${item.route === activeKey ? 'is-current' : ''}${scrollClass}" href="${routeHref(hrefRoute)}"${scrollAttr}>
                    ${escapeHtml(item.label)}
                  </a>
                `;
}

function renderSubpageTopTabs(groupLabel, subNavItems, activeKey, options = {}) {
  if (!subNavItems || subNavItems.length < 2) return '';
  return `
      <nav class="subpage-line-tabs" aria-label="${escapeHtml(groupLabel)} 하위 메뉴">
        <div class="subpage-line-tabs__inner">
          ${subNavItems.map((item) => renderSubpageSecondMenuItem(item, activeKey, options)).join('')}
        </div>
      </nav>
  `;
}

const FOOTER_SHORTCUTS = [
  { label: '교회소개', route: 'church' },
  { label: '예배안내', route: 'worship' },
  { label: '교회앨범', route: 'album' },
  { label: '유튜브 채널', route: 'media' },
];

const ALBUM_CATEGORIES = ['전체', '세례예식', '행사/집회', '예배찬양', '교회학교', '국내선교', '해외선교', '사회봉사', '기타사진'];
const ALBUM_CATEGORY_SLUGS = {
  '전체': 'all',
  '세례예식': 'baptism',
  '행사/집회': 'events',
  '예배찬양': 'worship-praise',
  '교회학교': 'church-school',
  '국내선교': 'domestic-mission',
  '해외선교': 'overseas-mission',
  '사회봉사': 'service',
  '기타사진': 'etc',
};
const ALBUM_CATEGORY_LABELS = Object.fromEntries(Object.entries(ALBUM_CATEGORY_SLUGS).map(([label, slug]) => [slug, label]));

function albumCategoryRoute(label, baseRoute = 'news/album') {
  const slug = ALBUM_CATEGORY_SLUGS[label] || 'all';
  return slug === 'all' ? baseRoute : `${baseRoute}/category/${slug}`;
}

function albumCategoryFromRoute(routeKey) {
  const slug = String(routeKey || '').split('/category/')[1] || 'all';
  return ALBUM_CATEGORY_LABELS[slug] || '전체';
}

const ROUTE_ACTIVE_PARENT = {
  'news/board': 'news',
  'media/archive/sunday': 'media',
  'media/archive/youth': 'media/youth',
  'media/archive/praise': 'media/praise',
  'media/archive/prayer': 'media/prayer',
  'media/archive/prayer/wednesday': 'media/prayer',
  'media/archive/prayer/friday': 'media/prayer',
  'media/archive/prayer/dawn': 'media/prayer',
  'media/archive/choir': 'media/choir',
  'media/archive/choir/peniel': 'media/choir',
  'media/archive/choir/hosanna': 'media/choir',
  'media/archive/choir/zion': 'media/choir',
  'media/archive/events': 'media/events',
  'media/archive/events/gathering': 'media/events',
  'media/archive/events/event': 'media/events',
  'media/archive/events/etc': 'media/events',
};

function getActiveNavKey(key) {
  if (String(key || '').startsWith('news/album/category/')) {
    return 'news/album';
  }
  if (String(key || '').startsWith('album/category/')) {
    return 'album';
  }
  return ROUTE_ACTIVE_PARENT[key] || key;
}

function getGroupKey(key) {
  return String(getActiveNavKey(key) || '').split('/')[0] || '';
}

function getNavGroup(key) {
  const route = String(getActiveNavKey(key) || '');
  const directGroup = NAV_STRUCTURE.find((group) => (group.items || []).some((item) => item.route === route));
  if (directGroup) {
    return directGroup;
  }
  const groupKey = getGroupKey(key);
  return NAV_STRUCTURE.find((group) => group.key === groupKey) || null;
}

function getNavItem(key) {
  const group = getNavGroup(key);
  if (!group) {
    return null;
  }
  const route = getActiveNavKey(key);
  return group.items.find((item) => item.route === route) || group.items[0] || null;
}

function sectionIdForRoute(route) {
  return "section-" + String(route || "home").replaceAll("/", "-");
}

function getPageTitle(key) {
  const navItem = getNavItem(key);
  if (navItem) {
    return navItem.label;
  }
  return (data.pages[key] || {}).title || '프로토타입';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderUtilityMenu() {
  return data.utilityMenu
    .map((item) => {
      if (item.disabled) {
        return `<span class="utility-chip is-disabled" title="${escapeHtml(item.note)}">${escapeHtml(item.label)}</span>`;
      }
      return `<a class="utility-chip" href="${routeHref(item.route)}">${escapeHtml(item.label)}</a>`;
    })
    .join('');
}

function renderMainNav(activeKey) {
  return NAV_STRUCTURE
    .map((item) => {
      const activeClass = item.key === activeKey ? 'is-active' : '';
      return `
        <a
          class="main-nav__link ${activeClass}"
          href="${routeHref(item.items[0].route)}"
          data-nav-key="${escapeHtml(item.key)}"
        >
          <span>${escapeHtml(item.label)}</span>
          <small>▾</small>
        </a>
      `;
    })
    .join('');
}

function renderMegaMenu() {
  return `
    <div class="mega-menu">
      <div class="inner mega-menu__inner">
        ${NAV_STRUCTURE
          .map(
            (group) => `
              <section class="mega-menu__col" data-nav-key="${escapeHtml(group.key)}">
                <h3>${escapeHtml(group.label)}</h3>
                <ul>
                  ${(group.items || [])
                    .map(
                      (item) => `
                        <li>
                          <a class="mega-menu__item" href="${routeHref(item.route)}">${escapeHtml(item.label)}</a>
                        </li>
                      `
                    )
                    .join('')}
                </ul>
              </section>
            `
          )
          .join('')}
      </div>
    </div>
  `;
}

function renderMobileDrawer(activeKey) {
  return `
    <div class="mobile-nav-overlay" data-mobile-close hidden></div>
    <aside id="mobile-nav-drawer" class="mobile-nav-drawer" aria-label="모바일 전체 메뉴" aria-hidden="true">
      <div class="mobile-nav-drawer__head">
        <div>
          <strong>전체 메뉴</strong>
          <span>번동제일교회</span>
        </div>
        <button class="mobile-nav-close" type="button" data-mobile-close aria-label="메뉴 닫기">닫기</button>
      </div>
      <div class="mobile-nav-drawer__body">
        ${NAV_STRUCTURE.map((group) => `
          <section class="mobile-nav-group ${group.key === activeKey ? 'is-current' : ''}">
            <h3>${escapeHtml(group.label)}</h3>
            <div class="mobile-nav-links">
              ${(group.items || []).map((item) => `
                <a class="${getActiveNavKey(routeKey()) === item.route ? 'is-current' : ''}" href="${routeHref(item.route)}">
                  ${escapeHtml(item.label)}
                </a>
              `).join('')}
            </div>
          </section>
        `).join('')}
      </div>
      <div class="mobile-nav-drawer__foot">
        ${renderUtilityMenu()}
      </div>
    </aside>
  `;
}

function renderHeader(activeKey) {
  return `
    <header class="site-header">
      <div class="utility-bar">
        <div class="inner">
          <div class="utility-menu">${renderUtilityMenu()}</div>
        </div>
      </div>
      <div class="inner header-main">
        <a class="brand" href="${routeHref('home')}">
          <span class="brand-mark">✝</span>
          <span>
            <strong>번동제일교회</strong>
            <small>since 1964.7.3.</small>
          </span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav-drawer">
          <span class="menu-toggle__bars" aria-hidden="true"></span>
          <span>메뉴</span>
        </button>
        <nav id="main-nav" class="main-nav">
          ${renderMainNav(activeKey)}
        </nav>
      </div>
      ${renderMegaMenu()}
    </header>
    <button class="mobile-menu-fab" type="button" aria-expanded="false" aria-controls="mobile-nav-drawer">
      <span class="menu-toggle__bars" aria-hidden="true"></span>
      <span>메뉴</span>
    </button>
    ${renderMobileDrawer(activeKey)}
  `;
}

function renderFooterLegacy() {
  const footer = data.footer;
  return `
    <footer class="site-footer">
      <div class="inner footer-grid footer-grid-main">
        <div class="footer-block">
          <h3>✝ 번동제일교회</h3>
          <p>${escapeHtml(footer.address)}</p>
          <p>Tel. ${escapeHtml(footer.phone)} · ${escapeHtml(footer.email)}</p>
        </div>
        <div class="footer-block">
          <h3>예배시간</h3>
          ${footer.worshipTimes.map((item) => `<a href="${routeHref('worship')}">${escapeHtml(item)}</a>`).join('')}
        </div>
        <div class="footer-block">
          <h3>바로가기</h3>
          ${footer.quickMenu.map((item) => `<a href="${routeHref(item.route)}">${escapeHtml(item.label)}</a>`).join('')}
        </div>
      </div>
      <div class="inner footer-bottom">
        <span>${escapeHtml(footer.copyright)}</span>
        <div class="footer-policy-links">
          ${footer.policies.map((item) => `<a href="${routeHref('policy')}">${escapeHtml(item)}</a>`).join('')}
        </div>
      </div>
    </footer>
  `;
}

function sectionTitle(eyebrow, title, summary, action) {
  return `
    <div class="section-head">
      <div>
        <span class="eyebrow">${escapeHtml(eyebrow)}</span>
        <h2>${escapeHtml(title)}</h2>
        ${summary ? `<p>${escapeHtml(summary)}</p>` : ''}
      </div>
      ${action || ''}
    </div>
  `;
}

function sectionNavigator(eyebrow, items, activeTarget, route = 'church', label = '섹션 이동') {
  return `
    <div class="section-navigator" aria-label="${escapeHtml(label)}">
      ${eyebrow ? `<span class="eyebrow">${escapeHtml(eyebrow)}</span>` : ''}
      <nav>
        ${items.map(([target, title], index) => `
          <a class="${index === 0 ? 'is-parent ' : ''}${target === activeTarget ? 'is-current' : ''}" href="${routeHref(route)}" data-scroll-target="${escapeHtml(target)}">
            ${escapeHtml(title)}
          </a>
        `).join('')}
      </nav>
    </div>
  `;
}

function renderSubpageScaffoldLegacy(key, page, content) {
  const meta = SUBPAGE_META[key] || {
    group: page.title,
    hero: '대표 이미지',
    items: [page.title],
  };

  return `
    <main class="inner page-shell">
      <section class="subpage-hero panel">
        <div class="subpage-hero__copy">
          <div class="breadcrumb">
            <a href="${routeHref('home')}">홈</a>
            <span>/</span>
            <span>${escapeHtml(meta.group)}</span>
          </div>
          <h1>${escapeHtml(page.title)}</h1>
          <p>${escapeHtml(page.summary)}</p>
        </div>
        <div class="placeholder-box subpage-hero__media">${escapeHtml(meta.hero)}</div>
      </section>
      <div class="subpage-layout">
        <aside class="lnb">
          <h2>${escapeHtml(meta.group)}</h2>
          <div class="lnb-links">
            ${meta.items
              .map(
                (item, index) => `
                  <button class="lnb-link ${index === 0 ? 'is-current' : ''}" type="button">
                    ${escapeHtml(item)}
                  </button>
                `
              )
              .join('')}
          </div>
        </aside>
        <div class="subpage-content">
          ${content}
        </div>
      </div>
    </main>
  `;
}

function renderLegacySnapshot() {
  return `
    <section class="panel">
      ${sectionTitle('IA Snapshot', '기존 사이트맵 분석과 리뉴얼 매핑', '현재 bundong.com의 메뉴를 01 통합 요구사항 정의서 5장 구조로 다시 묶은 결과입니다.')}
      <div class="grid grid-2">
        <article class="card">
          <h3>현재 사이트 주요 그룹</h3>
          <div class="stack">
            ${data.currentSitemap
              .map(
                (group) => `
                  <div class="mini-block">
                    <strong>${escapeHtml(group.title)}</strong>
                    <p>${escapeHtml(group.items.join(' · '))}</p>
                  </div>
                `
              )
              .join('')}
          </div>
        </article>
        <article class="card">
          <h3>리뉴얼 IA 매핑</h3>
          <ul class="bullet-list">
            ${data.mapping.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </article>
      </div>
      <div class="note-box">
        <strong>구현 가정</strong>
        <ul class="bullet-list">
          ${data.project.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}
        </ul>
      </div>
    </section>
  `;
}

function renderHomeSectionLabel(code, title) {
  return `<div class="home-sec-label">SEC-${escapeHtml(code)} ${escapeHtml(title)}</div>`;
}

function renderHomeSectionHead(title, summary) {
  return `
    <div class="home-section-head">
      <h2>${escapeHtml(title)}</h2>
      ${summary ? `<p>${escapeHtml(summary)}</p>` : ''}
    </div>
  `;
}

function renderNewcomerSteps() {
  return data.home.newcomerSteps
    .map(
      (item, index) => `
        ${index > 0 ? '<span class="home-step-arrow" aria-hidden="true">→</span>' : ''}
        <div class="home-step">
          <span class="home-step__number">${index + 1}</span>
          <span class="home-step__label">${escapeHtml(item)}</span>
        </div>
      `
    )
    .join('');
}

function renderHero() {
  const slides = data.home.heroSlides;
  const slide = slides[heroIndex % slides.length];
  return `
    <section class="home-hero home-hero--immersive">
      <div class="inner">
        ${renderHomeSectionLabel('02', '메인 비주얼 히어로')}
        <div class="home-hero__grid">
          <div class="home-hero__copy">
            <h1>${escapeHtml(slide.title)}</h1>
            <p class="home-hero__lead">${escapeHtml(slide.lead)}</p>
            <p class="home-hero__desc">${escapeHtml(slide.body)}</p>
          </div>
          <div class="home-hero__media" aria-hidden="true"></div>
        </div>
        <div class="home-hero__dots" aria-label="메인 카피 슬라이드">
          ${slides
            .map(
              (_, index) => `
                <button class="dot ${index === heroIndex ? 'is-active' : ''}" type="button" data-hero-index="${index}" aria-label="슬라이드 ${index + 1}"></button>
              `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function renderQuickLinks() {
  return `
    <section class="home-quick">
      <div class="inner">
        ${renderHomeSectionLabel('03', '핵심 퀵메뉴')}
        <div class="home-quick__grid">
          ${data.quickLinks
            .map(
              (item) => `
                <a class="home-quick__item" href="${routeHref(item.route)}">
                  <span class="home-quick__icon">icon</span>
                  <span>${escapeHtml(item.label)}</span>
                </a>
              `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function renderIntro() {
  return `
    <section class="home-intro home-feature-panel home-feature-panel--community">
      <div class="inner">
        ${renderHomeSectionLabel('04', '교회 소개 숏 브랜딩')}
        <div class="home-intro__grid">
          <div class="home-intro__media" aria-hidden="true"></div>
          <div class="home-intro__copy">
            <h2>${escapeHtml(data.home.intro.headline)}</h2>
            <p>번동제일교회는 오랜 시간 지역과 함께 걸어온 공동체입니다. 보여주기보다 진심으로, 크기보다 온기로 사람을 품어왔습니다. 믿음과 사랑, 섬김의 기쁨이 일상이 되는 교회를 소개합니다.</p>
            <a class="button button-secondary" href="${routeHref('church')}" data-scroll-target="section-core">번동제일교회는 더 보기</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderWorshipSummary() {
  const worshipCardTargets = {
    '주일예배': 'worship',
    '청년예배': 'worship',
    '수요예배': 'worship',
    '금요예배': 'worship',
  };
  return `
    <section class="home-worship home-feature-panel home-feature-panel--worship">
      <div class="inner">
        ${renderHomeSectionLabel('05', '예배안내')}
        ${renderHomeSectionHead('예배안내', '모이기를 힘쓰는 행복한 교회입니다.')}
        <div class="home-worship__grid">
          ${data.home.worshipCards
            .map(
              (item) => `
                <a class="card home-worship__card" href="${routeHref(worshipCardTargets[item.title] || 'worship')}" data-scroll-target="section-worship-times">
                  <div class="home-worship__media" aria-hidden="true">
                    <span>예배 사진 영역</span>
                  </div>
                  <h3>${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.detail)}</p>
                  <span class="meta">${escapeHtml(item.place)}</span>
                </a>
              `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function renderNewcomerSummary() {
  return `
    <section class="home-visitor">
      <div class="inner">
        ${renderHomeSectionLabel('06', '처음 오셨나요')}
        ${renderHomeSectionHead('처음 오셨나요?', '우리 교회에서 행복하셨으면 좋겠습니다.')}
        <div class="home-visitor__steps">
          ${renderNewcomerSteps()}
        </div>
      </div>
    </section>
  `;
}

function renderAlbumSummary() {
  return `
    <section class="home-album">
      <div class="inner">
        ${renderHomeSectionLabel('07', '교회 앨범')}
        ${renderHomeSectionHead('예배와 사랑, 일상이 되는 순간들', '살아 있는 우리 교회의 모습')}
        <div class="home-album__categories" aria-label="교회 앨범 카테고리">
          ${ALBUM_CATEGORIES
            .map(
              (item, index) => `
                <a class="home-album__category ${index === 0 ? 'is-active' : ''}" href="${routeHref(albumCategoryRoute(item))}">
                  ${index === 0 ? '<span class="home-album__check">✓</span>' : ''}
                  ${escapeHtml(item)}
                </a>
              `
            )
            .join('')}
        </div>
        <div class="home-album__layout">
          <div class="home-album__grid">
            ${data.home.albumItems
              .map(
                (item) => `
                  <article class="card home-album__card">
                    <div class="placeholder-box small">사진</div>
                    <h3>${escapeHtml(item.title)}</h3>
                    <span class="meta">${escapeHtml(item.date)}</span>
                  </article>
                `
              )
              .join('')}
          </div>
        </div>
        <div class="home-center">
          <a class="button button-secondary" href="${routeHref('album')}">교회앨범 더 보기</a>
        </div>
      </div>
    </section>
  `;
}

function renderMediaSummary() {
  const sermon = data.home.featuredSermon;
  const subVideoRoutes = {
    '오후 찬양예배': 'media/archive/praise',
    '수요 기도회': 'media/archive/prayer/wednesday',
    '금요 기도회': 'media/archive/prayer/friday',
  };
  return `
    <section class="home-sermons">
      <div class="inner">
        ${renderHomeSectionLabel('08', '말씀과 찬양')}
        ${renderHomeSectionHead('주일의 말씀, 삶으로 이어지도록', '한 주간의 생명의 말씀들')}
        <div class="home-sermons__main">
          <a class="placeholder-box video home-sermons__video" href="${routeHref('media/archive/sunday')}">주일예배 영상 플레이어</a>
          <a class="card home-sermons__info" href="${routeHref('media/archive/sunday')}">
            <h3>지난주 말씀</h3>
            <h4>${escapeHtml(sermon.title)}</h4>
            <p>성경본문: ${escapeHtml(sermon.bible)}<br>설교자: ${escapeHtml(sermon.preacher)}<br>날짜: ${escapeHtml(sermon.date)}</p>
            <div class="callout">
              <p>${escapeHtml(sermon.quote)}</p>
            </div>
          </a>
        </div>
        <div class="home-sermons__subgrid">
          ${data.home.mediaSubVideos
            .map(
              (item) => `
                <a class="card home-sermons__subitem" href="${routeHref(subVideoRoutes[item] || 'media')}">
                  <div class="placeholder-box small">보조 예배 영상</div>
                  <h3>${escapeHtml(item)}</h3>
                </a>
              `
            )
            .join('')}
        </div>
        <div class="home-center">
          <a class="button" href="${routeHref('media')}">번동제일교회 유튜브 채널 바로가기</a>
        </div>
      </div>
    </section>
  `;
}

function renderNewsSummary() {
  const bulletin = data.home.bulletinItems[0];
  const familyOrderTitle = '2026년 4월 가정예배 순서지';
  return `
    <section class="home-news">
      <div class="inner">
        ${renderHomeSectionLabel('09', '교회소식 / 최신 주보')}
        <div class="home-news__grid">
          <article class="card home-news__panel">
            <h2>교회 소식</h2>
            <p>여러가지 중요한 교회 소식들</p>
            <ul class="feed-list large">
              ${data.home.newsItems
                .map((item) => `<li><span>${escapeHtml(item.title)}</span><time>${escapeHtml(item.date)}</time></li>`)
                .join('')}
            </ul>
            <a class="button button-secondary" href="${routeHref('news')}">교회소식 더 보기</a>
          </article>
          <article class="card home-news__panel">
            <h2>최신 주보</h2>
            <p>최근 게시물의 첨부 이미지를 한눈에 확인하세요.</p>
            <a class="home-news__bulletin-link" href="${routeHref('news/bulletin')}">
              <div class="home-news__bulletin-previews" aria-label="최신 주보 첨부 이미지 미리보기">
                <span>주보 첨부 이미지 1</span>
                <span>주보 첨부 이미지 2</span>
              </div>
              <div class="home-news__bulletin-title">${bulletin ? escapeHtml(bulletin.title) : '최신 주보'}</div>
            </a>
            <div class="home-news__order-download">
              <div>
                <strong>순서지 다운로드</strong>
                <span>${escapeHtml(familyOrderTitle)}</span>
              </div>
              <a class="button button-secondary" href="${routeHref('news/family-worship')}">다운로드</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  `;
}

function renderFacilitySummary() {
  return `
    <section class="home-facility">
      <div class="inner">
        ${renderHomeSectionLabel('10', '시설 안내')}
        ${renderHomeSectionHead('첫 걸음이, 낯설지 않도록', '교회의 구석구석')}
        <div class="home-facility__grid">
          ${data.home.facilities
            .map(
              (item) => `
                <article class="card home-facility__card">
                  <div class="placeholder-box medium">${escapeHtml(item.title)} 사진 / 조감도</div>
                  <h3>${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.detail)}</p>
                </article>
              `
            )
            .join('')}
        </div>
        <div class="home-center">
          <a class="button button-secondary" href="${routeHref('church/facility')}">상세 시설안내 보기</a>
        </div>
      </div>
    </section>
  `;
}

function renderHistoryBanner() {
  return `
    <section class="home-anniversary">
      <div class="inner home-anniversary__grid">
        <a class="home-anniversary__card" href="${routeHref('anniversary')}">
          <h3>창립 60주년</h3>
          <p>기념 콘텐츠 보기</p>
        </a>
        <a class="home-anniversary__card" href="${routeHref('memorial')}">
          <h3>故 백낙기목사 기념관</h3>
          <p>기념관 보기</p>
        </a>
      </div>
    </section>
  `;
}

function renderDirectionsSummary() {
  return `
    <section class="home-directions">
      <div class="inner">
        ${renderHomeSectionLabel('12', '오시는 길')}
        <div class="home-directions__grid">
          <div class="placeholder-box tall home-directions__map">지도 영역</div>
          <article class="home-directions__info">
            <h2>오시는 길</h2>
            <dl>
              <dt>주소</dt>
              <dd>${escapeHtml(data.home.directions.address)}</dd>
              <dt>전화</dt>
              <dd>${escapeHtml(data.home.directions.phone)}</dd>
            </dl>
            <ul class="bullet-list">
              ${data.home.directions.transit.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
            <a class="button button-secondary" href="${routeHref('church/directions')}">오시는 길 보기</a>
          </article>
        </div>
      </div>
    </section>
  `;
}

function renderHome() {
  return `
    <main class="home-shell">
      ${renderHero()}
      ${renderQuickLinks()}
      ${renderIntro()}
      ${renderWorshipSummary()}
      ${renderNewcomerSummary()}
      ${renderAlbumSummary()}
      ${renderMediaSummary()}
      ${renderNewsSummary()}
      ${renderFacilitySummary()}
      ${renderHistoryBanner()}
      ${renderDirectionsSummary()}
    </main>
  `;
}

function renderChurch() {
  const page = data.pages.church;
  const content = `
      <section class="panel">
        ${sectionTitle('Church', '교회를 소개합니다', '60년의 은혜를 담아, 당신과 함께 더 행복한 내일을 그리는 교회')}
        <div class="grid grid-2">
          <article class="card">
            <div class="placeholder-box tall">교회 외관 / 공동체 대표 사진</div>
          </article>
          <article class="card">
            <h3>브랜드 메시지</h3>
            <p>보이지 않는 따뜻함을 보이는 감동으로, 오랜 시간 지역과 함께 걸어온 공동체의 현재성을 담아냅니다.</p>
            <div class="mini-grid">
              <div class="mini-card">
                <strong>표어 / 소개</strong>
                <p>교회의 정체성과 첫인상을 짧고 분명하게 전달하는 소개 영역</p>
              </div>
              <div class="mini-card">
                <strong>심벌 & 로고</strong>
                <p>기존 심벌마크와 시그니처를 정리해 브랜드 섹션으로 노출</p>
              </div>
            </div>
          </article>
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Staff', '섬기는 사람들')}
        <div class="data-table">
          <div class="table-head"><span>구분</span><span>이름</span><span>담당</span></div>
          ${page.staff
            .map(
              (item) => `
                <div class="table-row">
                  <span>${escapeHtml(item.role)}</span>
                  <span>${escapeHtml(item.name)}</span>
                  <span>${escapeHtml(item.detail)}</span>
                </div>
              `
            )
            .join('')}
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('History', '교회연혁')}
        <div class="timeline">
          ${page.milestones
            .map(
              (item) => `
                <article class="timeline-item">
                  <span class="timeline-year">${escapeHtml(item.year)}</span>
                  <p>${escapeHtml(item.text)}</p>
                </article>
              `
            )
            .join('')}
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Facility', '시설 안내')}
        <div class="grid grid-2">
          ${page.facilities
            .map(
              (item) => `
                <article class="card">
                  <div class="placeholder-box medium">${escapeHtml(item.title)} 조감도 / 실사 사진</div>
                  <h3>${escapeHtml(item.title)}</h3>
                  <ul class="bullet-list">
                    ${item.floors.map((floor) => `<li>${escapeHtml(floor)}</li>`).join('')}
                  </ul>
                </article>
              `
            )
            .join('')}
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Organization', '교회조직 / 부서조직')}
        <div class="grid grid-2">
          <article class="card">
            <h3>부서 및 기관</h3>
            <ul class="bullet-list">
              ${page.departments.map((item) => `<li><strong>${escapeHtml(item.title)}</strong> · ${escapeHtml(item.detail)}</li>`).join('')}
            </ul>
          </article>
          <article class="card">
            <h3>교구 편성</h3>
            <ul class="bullet-list">
              ${page.parishes.map((item) => `<li><strong>${escapeHtml(item.title)}</strong> · ${escapeHtml(item.detail)}</li>`).join('')}
            </ul>
          </article>
        </div>
      </section>
  `;
  return renderSubpageScaffold('church', page, content);
}

function renderNewcomers() {
  const page = data.pages.newcomers;
  const content = `
      <section class="panel">
        ${sectionTitle('Welcome', '담임목사 인사말')}
        <div class="grid grid-2">
          <article class="card">
            <div class="placeholder-box tall">담임목사 사진</div>
          </article>
          <article class="card">
            <h3>처음 방문하신 분들을 환영합니다</h3>
            <p>교회를 처음 찾는 분이 안심할 수 있도록 목회 철학과 공동체의 분위기를 짧게 소개하는 영역입니다.</p>
            <p class="meta">실제 인사말 원고 확정 후 교체</p>
          </article>
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Flow', '등록 + 교육 + 환영 흐름')}
        <div class="step-list">
          ${page.steps
            .map(
              (item, index) => `
                <div class="step-card">
                  <span class="step-number">${index + 1}</span>
                  <strong>${escapeHtml(item)}</strong>
                </div>
              `
            )
            .join('')}
        </div>
        <div class="grid grid-2">
          <article class="card">
            <h3>새가족 등록 안내</h3>
            <p>방문 후 등록카드 작성, 담당자 안내, 교구 연결까지의 기본 동선을 정리합니다.</p>
          </article>
          <article class="card">
            <h3>새가족 교육</h3>
            <p>교육 일정, 장소, 과정 설명을 카드형 또는 간단한 표형으로 안내합니다.</p>
          </article>
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Weekly', '금주 새가족 / 환영회')}
        <div class="grid grid-2">
          <article class="card">
            <h3>금주 새가족</h3>
            <ul class="bullet-list">
              ${page.weeklyNewFamily.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
          </article>
          <article class="card">
            <h3>새가족 환영회</h3>
            <div class="placeholder-box medium">환영회 사진 / 일정 / 담당 안내</div>
            <p>기존 bbs_nfwp 게시판을 새 랜딩의 환영 행사 섹션으로 재배치</p>
          </article>
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Directions', '오시는 길')}
        <div class="grid grid-2">
          <div class="placeholder-box tall">네이버/카카오 지도 임베드 영역</div>
          <article class="card">
            <h3>주소 / 연락처</h3>
            <p>${escapeHtml(page.directions.address)}</p>
            <p>${escapeHtml(page.directions.phone)}</p>
            <ul class="bullet-list">
              ${page.directions.transport.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
          </article>
        </div>
      </section>
  `;
  return renderSubpageScaffold('newcomers', page, content);
}

function renderWorship() {
  const page = data.pages.worship;
  const content = `
      <section class="panel">
        ${sectionTitle('Highlight', '대표 예배 안내')}
        <div class="grid grid-3">
          <article class="card">
            <div class="placeholder-box medium">주일예배 이미지</div>
            <h3>주일예배</h3>
            <p>1부 07:30 / 2부 09:30 / 3부 11:30</p>
          </article>
          <article class="card">
            <div class="placeholder-box medium">청년예배 이미지</div>
            <h3>청년예배</h3>
            <p>주일 오후 1:30 / 중예배실</p>
          </article>
          <article class="card">
            <div class="placeholder-box medium">수요·금요예배 이미지</div>
            <h3>수요 / 금요</h3>
            <p>수요 10:30 / 19:30 · 금요 20:00</p>
          </article>
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Times', '예배시간 / 장소')}
        <div class="data-table">
          <div class="table-head"><span>예배</span><span>시간</span><span>장소</span></div>
          ${page.worshipTimes
            .map(
              (row) => `
                <div class="table-row">
                  <span>${escapeHtml(row[0])}</span>
                  <span>${escapeHtml(row[1])}</span>
                  <span>${escapeHtml(row[2])}</span>
                </div>
              `
            )
            .join('')}
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('School', '교회학교 예배')}
        <div class="data-table">
          <div class="table-head"><span>부서</span><span>대상</span><span>시간</span><span>장소</span></div>
          ${page.schoolTimes
            .map(
              (row) => `
                <div class="table-row table-row-4">
                  <span>${escapeHtml(row[0])}</span>
                  <span>${escapeHtml(row[1])}</span>
                  <span>${escapeHtml(row[2])}</span>
                  <span>${escapeHtml(row[3])}</span>
                </div>
              `
            )
            .join('')}
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Shuttle', '차량운행 안내')}
        <div class="grid grid-3">
          ${page.shuttles
            .map(
              (item) => `
                <article class="card">
                  <h3>${escapeHtml(item.route)}</h3>
                  <p>${escapeHtml(item.detail)}</p>
                </article>
              `
            )
            .join('')}
        </div>
      </section>
  `;
  return renderSubpageScaffold('worship', page, content);
}

function renderMedia() {
  const page = data.pages.media;
  const content = `
      <section class="panel">
        ${sectionTitle('Featured', '주일의 말씀')}
        <div class="grid grid-media">
          <article class="card card-dark">
            <div class="placeholder-box video">유튜브 플레이어</div>
            <h3>${escapeHtml(page.featured.title)}</h3>
            <p>${escapeHtml(page.featured.bible)}</p>
            <span class="meta">${escapeHtml(page.featured.preacher)} · ${escapeHtml(page.featured.date)}</span>
          </article>
          <article class="card">
            <h3>지난주 말씀 요약</h3>
            <p>본문, 설교 제목, 설교자, 핵심 문장을 텍스트 카드로 정리</p>
            <div class="placeholder-box small">본문 요약 / 적용 포인트</div>
          </article>
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Categories', '예배 영상 카테고리')}
        <div class="grid grid-3">
          ${page.sermonCategories
            .map(
              (item) => `
                <article class="card">
                  <div class="placeholder-box small">${escapeHtml(item)} 썸네일</div>
                  <h3>${escapeHtml(item)}</h3>
                </article>
              `
            )
            .join('')}
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Channel', '유튜브 채널 연결')}
        <div class="grid grid-2">
          <article class="card">
            <div class="placeholder-box medium">채널 배너 / 대표 썸네일</div>
          </article>
          <article class="card">
            <h3>최근 설교와 예배 영상을 유튜브에서 이어서 확인</h3>
            <ul class="bullet-list">
              ${page.extras.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
            <div class="button-row">
              <a class="button" href="${routeHref('home')}">유튜브 채널 바로가기</a>
            </div>
          </article>
        </div>
      </section>
  `;
  return renderSubpageScaffold('media', page, content);
}

function renderNews() {
  return renderNewsLandingPage('news');
}

function renderAlbum(routeKey = 'album') {
  const page = data.pages.album;
  const activeCategory = albumCategoryFromRoute(routeKey);
  const baseRoute = String(routeKey).startsWith('news/') ? 'news/album' : 'album';
  const visibleItems = activeCategory === '전체'
    ? page.items
    : page.items.filter((item) => (item[2] || '기타사진') === activeCategory);
  const renderBoardSearch = () => `
    <form class="board-search" role="search" aria-label="교회앨범 검색">
      <select aria-label="검색 범위">
        <option>제목</option>
        <option>제목 + 본문</option>
      </select>
      <label>
        <span class="sr-only">교회앨범 검색어</span>
        <input type="search" placeholder="검색어를 입력하세요">
      </label>
      <button type="button">검색</button>
    </form>
  `;
  const content = `
      <section class="church-landing-hero panel album-hero-panel">
        <div class="church-landing-hero__media">교회앨범 대표 이미지 영역</div>
        <div class="church-landing-hero__copy">
          <span class="eyebrow">SEC-01</span>
          <span class="album-parent-label">교회소식</span>
          <h2>교회앨범</h2>
          <div class="church-landing-hero__intro">
            <p>번동제일교회의 소중한 순간들을 함께 나눕니다.</p>
          </div>
        </div>
      </section>
      <section id="section-album-board" class="panel news-section-panel album-board-panel album-board-panel--direct">
        <div class="media-line-menu news-album-menu" aria-label="교회앨범 카테고리">
          ${ALBUM_CATEGORIES.map((item) => `<a class="${item === activeCategory ? 'is-active' : ''}" href="${routeHref(albumCategoryRoute(item, baseRoute))}">${escapeHtml(item)}</a>`).join('')}
        </div>
        <div class="news-album-grid album-board-grid">
          ${visibleItems
            .map(
              (item) => `
                <article class="news-album-card">
                  <div class="placeholder-box small">사진</div>
                  <span class="news-album-card__category">${escapeHtml(item[2] || '기타사진')}</span>
                  <h3>${escapeHtml(item[0])}</h3>
                  <span class="meta">${escapeHtml(item[1])}</span>
                </article>
              `
            )
            .join('')}
        </div>
        ${renderBoardSearch()}
        <div class="news-pagination" aria-label="교회앨범 페이지 이동">
          <span class="is-current">1</span>
          <a href="${routeHref('album')}">2</a>
          <a href="${routeHref('album')}">3</a>
          <a href="${routeHref('album')}">4</a>
          <a href="${routeHref('album')}">다음</a>
        </div>
      </section>
  `;
  return renderSubpageScaffold(routeKey, page, content);
}

function renderSimplePage(key) {
  const page = data.pages[key];
  const content = `
      <section class="panel">
        ${sectionTitle('Outline', page.title)}
        <div class="grid grid-2">
          ${page.sections
            .map(
              (item) => `
                <article class="card">
                  <div class="placeholder-box small">콘텐츠 블록</div>
                  <h3>${escapeHtml(item)}</h3>
                  <p>실제 운영 콘텐츠 확정 후 상세 텍스트와 이미지가 반영되는 영역입니다.</p>
                </article>
              `
            )
            .join('')}
        </div>
      </section>
  `;
  return renderSubpageScaffold(key, page, content);
}

function renderAnniversaryPage() {
  const page = data.pages.anniversary;
  const timeline = [
    {
      label: '시작',
      years: '1964-1974',
      title: '천막 안의 작은 예배에서 시작되었습니다',
      media: '1964년 천막 예배 / 초기 교회 사진 영역',
      body: [
        ['1964', '번동 땅, 천막 안에서 첫 예배 소리가 울렸습니다.'],
        ['', '전쟁의 흔적이 남아 있던 1964년, 강북구 번동에 한 천막이 세워졌습니다. 그 안에서 하나님을 향한 예배가 시작되었고, 백낙기 목사가 초대 담임으로 함께했습니다.'],
        ['', '“어려운 이웃이 생기면 낮이든 새벽이든 찾아가 기도해주셨습니다.”'],
        ['1974', '창립 10주년. 번동이 조금씩 믿음의 땅이 되어가다.'],
      ],
    },
    {
      label: '헌신',
      years: '1975-1996',
      title: '더 많은 사람이 함께 예배드릴 공간을 세웠습니다',
      media: '성전 건축 / 선교교육관 사진 영역',
      body: [
        ['1975', '더 많은 사람이 함께 예배드릴 공간을 세웠습니다.'],
        ['1986-1988', '성전을 짓기로 했습니다. 특별한 후원자가 있었던 것이 아닙니다. 전 성도가 어려운 형편 속에서도 한 마음으로 헌금을 모았습니다. 1986년 기공예배, 1987년 입당, 1988년 헌당. 그렇게 지금의 번동제일교회 건물이 세워졌습니다.'],
        ['1995', '선교교육관을 구입했습니다. 은퇴를 2년 앞두고 내린 결정이었습니다. “이 건물을 인수하지 못하면 교회의 미래가 없다고 생각했습니다.” 같은 해 미스바 기도원도 건축되었습니다.'],
        ['1996', '백낙기 원로목사 추대. 김정호 목사, 2대 담임으로 부임.'],
      ],
    },
    {
      label: '나눔',
      years: '1998-2014',
      title: '받은 것을 나누기로 했습니다',
      media: '지교회 설립 / 희년 감사 사진 영역',
      body: [
        ['1998', '남양주 새사랑교회 설립 지원'],
        ['2000', '수원 예안교회 설립 지원'],
        ['', '직접 지교회를 세우는 것. 그것이 번동제일교회가 선택한 나눔의 방식이었습니다.'],
        ['2001', '백낙기 원로목사 소천'],
        ['2014', '창립 50주년, 희년 선포'],
      ],
    },
    {
      label: '지금',
      years: '2020-2024',
      title: '예배의 불꽃을 이어가며 새로운 60년을 시작합니다',
      media: '현장 예배 / 60주년 감사예배 사진 영역',
      body: [
        ['2020', '온 세계가 멈추었습니다. 번동제일교회도 예외가 아니었습니다. 그러나 예배는 멈추지 않았습니다. 현장과 온라인을 오가며 예배의 불꽃을 이어갔습니다.'],
        ['2022', '주차장 정비 준공예배'],
        ['2024', '창립 60주년. 황대석 목사, 3대 담임으로 부임. 새로운 60년이 시작됩니다.'],
      ],
    },
  ];
  const navItems = [
    ['section-anniversary-hero', '오프닝'],
    ['section-anniversary-timeline', '60년 이야기'],
    ['section-anniversary-video', '기념 영상'],
    ['section-anniversary-vision', '다음 60년'],
  ];
  const content = `
      <nav class="anniversary-dot-nav" aria-label="창립 60주년 섹션 메뉴">
        ${navItems.map(([target, label]) => `<a href="${routeHref('anniversary')}" data-scroll-target="${target}">${escapeHtml(label)}</a>`).join('')}
      </nav>
      <section id="section-anniversary-hero" class="panel anniversary-hero-section">
        <div class="anniversary-hero-visual">풀스크린 영상 자동재생 또는 교회 전경 사진 영역</div>
        <div class="anniversary-hero-copy">
          <strong>60</strong>
          <h2>번동제일교회가<br>이 자리를 지킨 시간입니다.</h2>
          <span>1964 - 2024</span>
          <p>세상은 빠르게 변해왔습니다. 그 사이, 번동제일교회는 같은 자리에서 같은 이유로 예배를 드려왔습니다.</p>
          <div class="button-row">
            <a class="button" href="${routeHref('anniversary')}" data-scroll-target="section-anniversary-video">60주년 기념 영상 보기</a>
            <a class="button button-secondary" href="${routeHref('anniversary')}" data-scroll-target="section-anniversary-timeline">60년의 이야기 보기 ↓</a>
          </div>
        </div>
      </section>
      <section class="panel anniversary-statement-section">
        <div class="anniversary-centered-copy">
          <span class="eyebrow">Identity</span>
          <h2>번동제일교회가 60년 동안<br>바라온 교회의 모습입니다</h2>
          <div class="anniversary-line-confession">
            <p>하나님을 진심으로 예배하는 교회.</p>
            <p>어려울 때 곁에 있는 교회.</p>
            <p>누구든 처음 와도 어색하지 않은 교회.</p>
            <p>아이들이 즐겁고, 어른들이 편한 교회.</p>
            <p>예수님이 중심인 교회.</p>
          </div>
          <p class="anniversary-closing-copy">이 고백들이 60년 동안 쌓여 지금의 번동제일교회가 되었습니다.</p>
        </div>
      </section>
      <section id="section-anniversary-timeline" class="panel anniversary-timeline-section">
        ${sectionTitle('Timeline', '한 걸음씩, 60년', '천막 안의 작은 예배에서 시작된 이야기입니다.')}
        <div class="anniversary-timeline">
          ${timeline.map((era, index) => `
            <article class="anniversary-era ${index % 2 ? 'is-reverse' : ''}">
              <div class="anniversary-era__media">${escapeHtml(era.media)}</div>
              <div class="anniversary-era__body">
                <div class="anniversary-era__label">
                  <span>${escapeHtml(era.label)}</span>
                  <em>${escapeHtml(era.years)}</em>
                </div>
                <h3>${escapeHtml(era.title)}</h3>
                <div class="anniversary-era__items">
                  ${era.body.map(([year, text]) => `
                    <div class="anniversary-era__item">
                      <strong>${escapeHtml(year)}</strong>
                      <p>${escapeHtml(text)}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
      <section class="panel anniversary-facts-section">
        <div class="anniversary-facts-copy">
          <p>60년 동안 담임목사가 세 명이었습니다.</p>
          <p>교단을 바꾼 적이 없습니다.</p>
          <p>번동을 떠난 적이 없습니다.</p>
          <strong>지난 60년은 전적인 하나님의 은혜였습니다.</strong>
        </div>
      </section>
      <section class="panel anniversary-voices-section">
        ${sectionTitle('Voices', '이 교회에서 살아온 사람들의 이야기입니다')}
        <div class="anniversary-voice-grid">
          ${[
            ['“60주년이 전적인 하나님의 은혜입니다. 이 자리까지 온 것 자체가 놀라운 기적입니다.”', '원로 성도'],
            ['“몇몇이 이룬 교회가 아닙니다. 전 성도가 한마음으로 어려운 상황에서도 헌신했기 때문에 교회가 여기까지 왔습니다.”', '오랜 집사'],
            ['“60년 이후에도 상상할 수 없는 놀라운 역사가 반드시 일어날 것을 믿습니다.”', '장로'],
          ].map(([quote, by]) => `
            <article class="anniversary-voice-card">
              <p>${escapeHtml(quote)}</p>
              <span>— ${escapeHtml(by)}</span>
            </article>
          `).join('')}
        </div>
      </section>
      <section id="section-anniversary-video" class="panel anniversary-video-section">
        ${sectionTitle('Video', '60년의 이야기를 영상으로 담았습니다', '번동제일교회 창립 60주년 기념 영상 (2024)')}
        <div class="anniversary-video-frame">
          <span>창립 60주년 기념 영상 YouTube Embed</span>
        </div>
      </section>
      <section class="panel anniversary-numbers-section">
        <div class="anniversary-number-grid">
          ${[
            ['1964', '첫 예배'],
            ['60년', '같은 자리'],
            ['3명', '담임목사'],
            ['2개', '직접 세운 지교회'],
          ].map(([number, label]) => `
            <article class="anniversary-number-card">
              <strong>${escapeHtml(number)}</strong>
              <span>${escapeHtml(label)}</span>
            </article>
          `).join('')}
        </div>
      </section>
      <section id="section-anniversary-vision" class="panel anniversary-vision-section">
        <div class="anniversary-vision-card">
          <h2>60주년의 감사가<br>100주년의 감사로 이어지도록</h2>
          <p>오늘도 번동제일교회는 하나님과 함께 걸어갑니다.</p>
          <div class="button-row centered">
            <a class="button" href="${routeHref('worship')}">예배 시간 확인하기</a>
            <a class="button button-secondary" href="${routeHref('newcomers')}">처음 오시는 분께</a>
          </div>
        </div>
      </section>
      <section class="panel anniversary-memorial-banner-section">
        <a class="anniversary-memorial-banner" href="${routeHref('memorial')}">
          <span class="eyebrow">Memorial</span>
          <h2>번동제일교회의 첫 걸음을 함께한 분</h2>
          <p>초대 담임목사 故 백낙기 목사. 그분의 이야기를 기념관에서 만나보실 수 있습니다.</p>
          <strong>기념관 보기</strong>
        </a>
      </section>
  `;
  return renderSubpageScaffold('anniversary', page, content);
}

function renderMemorialPage() {
  const page = data.pages.memorial;
  const lifeGroups = [
    {
      title: '출생',
      items: [
        '1928년 1월 28일',
        '평북 홍천군 와하면 탄방리에서 태어나다',
        '부친 백익동 씨와 김일덕 여사의 4남',
      ],
    },
    {
      title: '학력',
      items: [
        '경희대학교 국문과 졸업',
        '부산신학교 문과 졸업 / 총회신학교 문과 3년 수료',
        '전국대학교 대학원 철학과 졸업',
        '장로회 신학대학원 졸업',
        '아세아 연합신학대학 목회학 박사과정 수료',
        '배교막 신학대학교 대학원 목회학박사',
      ],
    },
    {
      title: '경력',
      items: [
        '영락 중고등학교 교편 / 교무주임 역임',
        '해방교회·동심교회 전도사',
        '경남노회 목사 안수',
        '동래제일교회 담임목사',
        '충전노회 노회장',
        '대한예수교 장로회 총회 회계서기',
        '이북노회 업무회 회장',
        '서울문부지구 기독교 연합회 5대 회장',
        '총회 부흥전도단 9대 단장 / 총회 신학교육부장',
        '총회 기관위원회 위원장',
        '서울 장신대학교 이사 / 대전 신학교 이사',
        '충전노회 공로목사 (1994년)',
        '번동제일교회 원로목사 추대 (1996년)',
      ],
    },
    {
      title: '번동제일교회 사역',
      items: [
        '1차 성전 건축 (1967년)',
        '성전 증축 봉헌 (1975년)',
        '연 간명 700명의 새성전 신축 봉헌 (1988년)',
        '교육관 봉헌 (1995년)',
        '경기도 양평군 미스바 기도원 건축 봉헌 (1989년)',
        '전 재산 헌납',
        '번동제일교회 창립 36주년 기념교회 개척 지원 (경기도 남양주시 새사랑교회)',
      ],
    },
    {
      title: '소천',
      items: [
        '경기도 의정부시 선전교회 한양대배 인도 후 뇌졸중으로 쓰러짐 (4월 4일)',
        '2차에 걸친 뇌수술 후 2001년 4월 16일 월요일 오전 3시 30분 하나님의 부르심을 받아 소천함',
      ],
    },
  ];
  const gallery = [
    '1972년 교회 정문 앞',
    '헌당식 예배',
    '원로목사 추대 및 위임식',
    '미스바 기도원 기공식',
    '번동제일교회 준공 오픈식',
    '1974년 어린이 성가',
    '1970년 노회 주최 연합수련회',
    '성탄절 예배 말씀',
    '김정호 목사 위임예배',
    '제1기 전도학교 수료식',
  ];
  const content = `
      <nav class="memorial-dot-nav" aria-label="故 백낙기 목사 기념관 섹션 메뉴">
        ${[
          ['section-memorial-hero', '소개'],
          ['section-memorial-life', '생애'],
          ['section-memorial-voices', '고백'],
          ['section-memorial-gallery', '갤러리'],
        ].map(([target, label]) => `<a href="${routeHref('memorial')}" data-scroll-target="${target}">${escapeHtml(label)}</a>`).join('')}
      </nav>
      <section id="section-memorial-hero" class="panel memorial-hero-section">
        <div class="memorial-hero-photo">故 백낙기 목사 흑백 인물 사진 영역</div>
        <div class="memorial-hero-copy">
          <span class="eyebrow">Memorial Archive</span>
          <h2>세상을 기독교 복음으로 채우시기 위해<br>평생을 살아오신 여정.</h2>
          <p>故 백낙기 목사<br><strong>1928 — 2001</strong></p>
          <blockquote>
            내 죄를 씻어주시고 영원한 생명의 길로 인도해 주신 주님!
            <cite>— 백낙기 목사 설교 중</cite>
          </blockquote>
        </div>
      </section>
      <section class="panel memorial-intro-section">
        <div class="memorial-centered-copy">
          <span class="eyebrow">Founder</span>
          <h2>천막으로 시작한 교회</h2>
          <p>1964년, 백낙기 목사는 번동 땅에 천막 하나를 세웠습니다. 그 안에서 드린 예배가 오늘의 번동제일교회가 되었습니다.</p>
          <p>초대 담임목사로 32년을 섬겼고, 1996년 원로목사로 추대된 뒤 2001년 4월 16일 하나님의 부르심을 받았습니다.</p>
          <p>배우자 김연실 사모와 세 아들을 두셨습니다. 세 아들 모두 목사와 장로의 길을 걸으며 아버지의 신앙을 이어가고 있습니다.</p>
        </div>
      </section>
      <section id="section-memorial-life" class="panel memorial-life-section">
        ${sectionTitle('Life', '목사님을 기억합니다')}
        <div class="memorial-life-grid">
          <aside class="memorial-life-aside">
            <div class="memorial-life-photo">생애 대표 사진 영역</div>
            <div class="memorial-life-years">
              <strong>1928</strong>
              <span>출생</span>
              <strong>1964</strong>
              <span>번동제일교회 첫 예배</span>
              <strong>1996</strong>
              <span>원로목사 추대</span>
              <strong>2001</strong>
              <span>소천</span>
            </div>
          </aside>
          <div class="memorial-life-list">
            ${lifeGroups.map((group) => `
              <article class="memorial-life-card">
                <h3>${escapeHtml(group.title)}</h3>
                <ul>
                  ${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
                </ul>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
      <section id="section-memorial-voices" class="panel memorial-voices-section">
        ${sectionTitle('Voices', '기억하는 이들의 고백')}
        <div class="memorial-voice-grid">
          ${[
            ['“이름도 없이, 빛도 없이 겸손하게 헌신하신 목사님을 닮고 싶습니다. 머리털 하나만큼이라도.”', '김경희'],
            ['“가시 같은 신자도 사랑으로 안으시고 겸손과 온유하신 목사님, 행복했습니다.”', '성도 일동'],
            ['“목사님이시라면 어떻게 하셨을까 생각해봅니다. 그리고 답이 늘 있습니다.”', '이효민'],
            ['“아버님이 걸어가신 길이 무척 그립고 자랑스럽습니다.”', '백인범'],
          ].map(([quote, by]) => `
            <article class="memorial-voice-card">
              <p>${escapeHtml(quote)}</p>
              <span>— ${escapeHtml(by)}</span>
            </article>
          `).join('')}
        </div>
      </section>
      <section id="section-memorial-gallery" class="panel memorial-gallery-section">
        ${sectionTitle('Gallery', '사진으로 보는 발자취', '번동제일교회와 함께한 시간들')}
        <div class="memorial-gallery-tabs">
          ${['전체', '교회 창립·건축', '예배·집회', '사역·행사', '원로목사 추대'].map((tab, index) => `<span class="${index === 0 ? 'is-active' : ''}">${escapeHtml(tab)}</span>`).join('')}
        </div>
        <div class="memorial-gallery-grid">
          ${gallery.map((item, index) => `
            <article class="memorial-gallery-card">
              <div class="memorial-gallery-photo">흑백 사진 ${index + 1}</div>
              <h3>${escapeHtml(item)}</h3>
              <p>고화질 원본 보기 / 관리자 추가 업로드 가능 구조</p>
            </article>
          `).join('')}
        </div>
      </section>
      <section class="panel memorial-closing-section">
        <div class="memorial-closing-card">
          <h2>목사님이 심은 씨앗이<br>60년의 열매가 되었습니다.</h2>
          <p>번동제일교회는 오늘도 그 뿌리 위에 서 있습니다.</p>
          <div class="button-row centered">
            <a class="button" href="${routeHref('home')}">번동제일교회 홈으로</a>
            <a class="button button-secondary" href="${routeHref('anniversary')}">창립 60주년 특별 페이지</a>
          </div>
        </div>
      </section>
  `;
  return renderSubpageScaffold('memorial', page, content);
}

function renderSubpageScaffold(key, page, content) {
  const groupKey = key === 'album' ? 'news' : getGroupKey(key);
  const navGroup = key === 'album' ? getNavGroup('news') : getNavGroup(key);
  const navItem = key === 'album' ? getNavItem('news/album') : getNavItem(key);
  const pageTitle = page.title || page.label;
  const pageSummary = page.summary || '';
  const meta = SUBPAGE_META[groupKey] || SUBPAGE_META[key] || {
    group: pageTitle,
    hero: '대표 이미지',
  };
  const currentGroupLabel = navGroup ? navGroup.label : meta.group;
  const currentItemLabel = navItem ? navItem.label : pageTitle;
  const subNavItems = navGroup ? navGroup.items : [{ route: key, label: pageTitle }];
  const activeNavKey = getActiveNavKey(key);
  const subNavOptions = {
    landingBaseRoute: groupKey === 'news' && key !== 'news' ? 'news' : '',
  };
  const compactSubHeaderClass = ['church', 'newcomers', 'worship', 'media', 'news'].includes(groupKey) ? ' page-shell--flat-sub-header' : '';

  return `
    <main class="inner page-shell${compactSubHeaderClass}">
      <section class="subpage-hero panel subpage-hero--integrated">
        <div class="subpage-hero__copy">
          <h1>${escapeHtml(currentGroupLabel)}</h1>
          <div class="subpage-category-path ${subNavItems.length > 1 ? 'subpage-category-path--simple' : ''}" aria-label="현재 위치">
            <a class="subpage-category-home" href="${routeHref('home')}">홈</a>
            <span class="subpage-category-separator">&gt;</span>
            ${groupKey === 'church' ? `
              <span class="subpage-category-current">${escapeHtml(currentGroupLabel)}</span>
              <span class="subpage-category-separator">&gt;</span>
              <span class="subpage-category-current is-leaf">${escapeHtml(currentItemLabel)}</span>
            ` : `
              <details class="subpage-category-dropdown">
                <summary>${escapeHtml(currentGroupLabel)}</summary>
                <div class="subpage-category-menu">
                  ${NAV_STRUCTURE.map((group) => `
                    <a class="${group.key === groupKey ? 'is-current' : ''}" href="${routeHref(group.items[0].route)}">
                      ${escapeHtml(group.label)}
                    </a>
                  `).join('')}
                </div>
              </details>
              <span class="subpage-category-separator">&gt;</span>
              <details class="subpage-category-dropdown">
                <summary>${escapeHtml(currentItemLabel)}</summary>
                <div class="subpage-category-menu">
                  ${subNavItems.map((item) => renderSubpageSecondMenuItem(item, activeNavKey, subNavOptions)).join('')}
                </div>
              </details>
            `}
          </div>
          <p>${escapeHtml(pageSummary)}</p>
        </div>
        <div class="placeholder-box subpage-hero__media">${escapeHtml(meta.hero)}</div>
      </section>
      ${renderSubpageTopTabs(currentGroupLabel, subNavItems, activeNavKey, subNavOptions)}
      <div class="subpage-content">
        ${content}
      </div>
    </main>
  `;
}
function renderFooter() {
  const footer = data.footer;
  return `
    <footer class="site-footer">
      <div class="inner site-footer__grid">
        <div class="site-footer__brand">
          <div class="site-footer__title">번동제일교회</div>
          <p>${escapeHtml(footer.address)}<br>Tel. ${escapeHtml(footer.phone)} · ${escapeHtml(footer.email)}</p>
        </div>
        <div class="site-footer__col">
          <h4>예배시간</h4>
          <ul>
            ${footer.worshipTimes.map((item) => `<li><a href="${routeHref('worship')}">${escapeHtml(item)}</a></li>`).join('')}
          </ul>
        </div>
        <div class="site-footer__col">
          <h4>바로가기</h4>
          <ul>
            ${FOOTER_SHORTCUTS.map((item) => `<li><a href="${routeHref(item.route)}">${escapeHtml(item.label)}</a></li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="inner site-footer__bottom">
        <span>${escapeHtml(footer.copyright)}</span>
        <div class="site-footer__policies">
          ${footer.policies.map((item) => `<a href="${routeHref('policy')}">${escapeHtml(item)}</a>`).join('')}
        </div>
      </div>
    </footer>
  `;
}

function renderChurchIdentityPage() {
  const page = getNavItem('church');
  const coreValues = [
    ['01', '말씀 중심의 공동체', '매일의 삶 속에서 하나님의 말씀을 붙들고 그 안에서 형통함을 누리는 성도들의 모임입니다.'],
    ['02', '시냇가에 심은 나무와 같은 공동체', '어떤 상황에서도 하나님을 의지하며, 철을 따라 열매를 맺고 이웃에게 쉼과 그늘을 제공하는 넉넉한 공동체를 꿈꿉니다.'],
    ['03', '행복의 공동체', '세상적인 기준으로 서로를 평가하거나 비참해지지 않고, 각자 하나님 안에 심겨진 존재로서 서로를 축복하고 섬기는 행복한 교회를 만들어갑니다.'],
  ];
  const identityNavItems = [
    ['section-church', '우리교회는'],
    ['section-core', '핵심가치'],
    ['section-greeting', '환영의 말씀'],
    ['section-invitation', '초대합니다'],
  ];
  const content = `
      <section id="section-church" class="church-landing-hero panel church-about-hero">
        <div class="church-landing-hero__media">교회 외관 또는 예배 사진 영역</div>
        <div class="church-landing-hero__copy">
          <span class="eyebrow">SEC-01</span>
          <h2>함께 행복을 만들어가는 번동제일교회</h2>
          <div class="church-landing-hero__intro">
            <p class="church-landing-hero__lead">대한예수교장로회(통합) 소속으로, 하나님께서 주시는 참된 행복을 함께 나누는 공동체입니다.</p>
          </div>
        </div>
      </section>
      <section id="section-core" class="panel church-core-section church-slogan-section">
        ${sectionNavigator('SEC-02', identityNavItems, 'section-core', 'church', '우리교회는 섹션 이동')}
        <div class="church-core-slogan">
          <span class="church-identity-statement__caption">2026 번동제일교회 표어</span>
          <strong>오직 주님 안에서 행복한 교회</strong>
          <cite>(시편 1:1~6)</cite>
          <div class="church-scripture-text">
            <p><sup>1</sup> 복 있는 사람은 악인들의 꾀를 따르지 아니하며 죄인들의 길에 서지 아니하며 오만한 자들의 자리에 앉지 아니하고</p>
            <p><sup>2</sup> 오직 여호와의 율법을 즐거워하여 그의 율법을 주야로 묵상하는도다</p>
            <p><sup>3</sup> 그는 시냇가에 심은 나무가 철을 따라 열매를 맺으며 그 잎사귀가 마르지 아니함 같으니 그가 하는 모든 일이 다 형통하리로다</p>
            <p><sup>4</sup> 악인들은 그렇지 아니함이여 오직 바람에 나는 겨와 같도다</p>
            <p><sup>5</sup> 그러므로 악인들은 심판을 견디지 못하며 죄인들이 의인들의 모임에 들지 못하리로다</p>
            <p><sup>6</sup> 무릇 의인들의 길은 여호와께서 인정하시나 악인들의 길은 망하리로다</p>
          </div>
        </div>
        <div class="church-core-grid">
          ${coreValues.map(([number, title, body]) => `
            <article class="church-core-card">
              <span>${escapeHtml(number)}</span>
              <h3>${escapeHtml(title)}</h3>
              <p>${escapeHtml(body)}</p>
            </article>
          `).join('')}
        </div>
      </section>
      <section id="section-greeting" class="panel church-pastoral-note-section">
        ${sectionNavigator('SEC-03', identityNavItems, 'section-greeting', 'church', '우리교회는 섹션 이동')}
        <div class="church-pastoral-note">
          <div class="placeholder-box medium">담임목사 사진 영역</div>
          <blockquote>
            <p>할렐루야!</p>
            <p>지난 한 해 동안 우리를 은혜로 이끄신 하나님께 감사드리며, 새해에도 하나님과 동행하며 은혜 안에 거하시길 축복합니다.</p>
            <p>2026년 표어를 ‘오직 주님 안에 거하며, 함께 행복한 교회’로 정하였습니다.</p>
            <p>오직 주님 안에 거하며, 함께 행복한 교회를 만들어 나가는 2026년이 되기를 기대합니다.</p>
            <p>우리 교회의 2026년 주제 말씀은 시편 1편입니다.</p>
            <p>악인들의 꾀를 따르지 아니하며, 죄인들의 길에 서지 아니하며, 오만한 자들의 자리에 앉지 아니하는 ‘복 있는 사람’, ‘행복한 사람’이 되시기 바랍니다.</p>
            <p>오직 여호와의 율법을 즐거워하며 그의 율법을 주야로 묵상하는, ‘말씀 중심’의 신앙인이 되시기 바랍니다. 그리하여 철을 따라 열매를 맺으며 그 잎사귀가 마르지 아니하는, 시냇가에 심은 나무 같은 성도가 되시기 바랍니다.</p>
            <p>시냇가에 심은 나무가 시냇가에 연결되어 있듯이, 오직 주님 안에서 복과 행복을 가득 누리는 2026년이 되기를 축복합니다. 그 하나님 안에서 우리 서로 이어져 주가 거하실 성전이 되며, 모퉁잇돌 되신 예수와 하나 되게 하신 성령 안에서 함께 지어져 가는 번동제일교회 성도님들의 모든 걸음을 응원합니다.</p>
            <cite>2026년 새해 아침<br>담임목사 황대석</cite>
          </blockquote>
        </div>
      </section>
      <section id="section-invitation" class="panel church-invitation-section">
        ${sectionNavigator('SEC-04', identityNavItems, 'section-invitation', 'church', '우리교회는 섹션 이동')}
        <div class="church-invitation-card">
          <h3>하나님의 자녀로 살아가는 기쁨을 누리고 싶으신 모든 분들을 번동제일교회로 초대합니다.</h3>
          <p>우리 함께 지금보다 더 행복한 신앙 생활을 시작해 봅시다!</p>
        </div>
      </section>
  `;
  return renderSubpageScaffold('church', page, content);
}


function renderChurchStaffPage() {
  const page = getNavItem('church/staff');
  const groups = {
    emeritusPastor: [{ role: '원로목사', name: '김정호', detail: '원로목사' }],
    seniorPastor: [{ role: '담임목사', name: '황대석', detail: '담임목사' }],
    associatePastors: [
      { role: '부목사', name: '강신일', detail: '믿음교구 / 070-4267-7435' },
      { role: '부목사', name: '김명호', detail: '소망교구 / 070-4267-7432' },
      { role: '부목사', name: '김동휘', detail: '사랑교구 / 070-4267-7432' },
      { role: '부목사', name: '권경선', detail: '교육부 총괄, 청소년부 / 070-4267-7434' },
    ],
    fullEvangelist: [{ role: '전임 전도사', name: '김성림', detail: '청년부' }],
    partPastor: [{ role: '준전임 목사', name: '박온유', detail: '영아부' }],
    partEvangelist: [{ role: '준전임 전도사', name: '이요한', detail: '초등부' }],
    educationPastorA: [{ role: '교육목사', name: '이은선', detail: '유아부' }],
    educationPastorB: [{ role: '교육목사', name: '이나미', detail: '유치부' }],
    educationEvangelist: [{ role: '교육전도사', name: '박성찬', detail: '유년부' }],
  };
  const elderGroups = [
    { title: '원로장로', names: ['김영안', '김용무', '하충열'] },
    { title: '은퇴장로', names: ['권승훈', '송택주', '이상돈', '홍권일', '안한철', '서장석', '이준윤', '조성극', '전영신', '오해춘', '김경환', '노병호', '김원조', '정선용', '서용선', '박영국', '박병호', '강순옥', '권오범', '고영택', '정재순', '이진원', '김진생', '민경훈', '이강호'] },
    { title: '협동장로', names: ['임헌명', '이명재', '송기순', '우정옥', '황덕근'] },
  ];
  const activeElders = ['이선규A', '이선규B', '최병욱', '이현우', '안동찬', '홍도희', '이호철', '조계완', '서현철', '김희진', '최상균'];
  const officeStaff = [
    { name: '권종성', role: '관리팀장', detail: '070-4267-7416' },
    { name: '황은화', role: '서무', detail: '070-4267-7411' },
    { name: '장귀애', role: '미화', detail: '연락처 별도 안내' },
    { name: '서용선', role: '기도원 관리', detail: '031-774-0675' },
    { name: '최봉금', role: '조리', detail: '연락처 별도 안내' },
    { name: '김기현', role: '비품 영상 관리자', detail: '070-4267-7439' },
  ];
  const staffNavItems = [
    ['staff-section-intro', '섬기는 사람들'],
    ['staff-section-pastors', '교역자'],
    ['staff-section-elders', '원로, 은퇴장로'],
    ['staff-section-serving-elders', '시무장로'],
    ['staff-section-office', '교회직원'],
  ];
  const person = (item) => `
    <article class="staff-clean-card">
      <div class="staff-clean-card__photo">사진</div>
      <div class="staff-clean-card__text">
        <strong>${escapeHtml(item.name)}</strong>
        ${item.groupTitle === item.role ? '' : `<span>${escapeHtml(item.role)}</span>`}
        ${item.detail && item.detail !== item.role ? `<p>${escapeHtml(item.detail)}</p>` : ''}
      </div>
    </article>
  `;
  const personFromName = (name, role) => person({ name, role, detail: '' });
  const roleBlock = (title, items, mod = '') => `
    <div class="staff-clean-role ${mod}">
      <h3>${escapeHtml(title)}</h3>
      <div class="staff-clean-grid">
        ${items.map((item) => person({ ...item, groupTitle: title })).join('')}
      </div>
    </div>
  `;
  const staffSectionNavigator = (label, activeTarget) => `
    <div class="staff-section-navigator" aria-label="섬기는 사람들 섹션 이동">
      <span class="eyebrow">${escapeHtml(label)}</span>
      <nav>
        ${staffNavItems.map(([target, title], index) => `
          <a class="${index === 0 ? 'is-parent ' : ''}${target === activeTarget ? 'is-current' : ''}" href="#/church/staff" data-scroll-target="${escapeHtml(target)}">
            ${escapeHtml(title)}
          </a>
        `).join('')}
      </nav>
    </div>
  `;
  const content = `
      <section id="staff-section-intro" class="panel staff-clean-hero staff-clean-hero--photo">
        <div class="staff-clean-hero__overlay">
          <span class="eyebrow">SEC-01</span>
          <h2>함께 교회를 섬기는 사람들입니다</h2>
          <p>담임목사님을 비롯해 번동제일교회를 함께 섬기는 교역자와 직분자를 소개합니다.</p>
        </div>
      </section>
      <section id="staff-section-pastors" class="panel staff-clean-section">
        ${staffSectionNavigator('SEC-02', 'staff-section-pastors')}
        <div class="staff-clean-leaders">
          ${roleBlock('원로목사', groups.emeritusPastor, 'is-leader')}
          ${roleBlock('담임목사', groups.seniorPastor, 'is-leader')}
        </div>
        ${roleBlock('부목사', groups.associatePastors, 'is-four')}
        <div class="staff-clean-row is-three">
          ${roleBlock('전임 전도사', groups.fullEvangelist)}
          ${roleBlock('준전임 목사', groups.partPastor)}
          ${roleBlock('준전임 전도사', groups.partEvangelist)}
        </div>
        <div class="staff-clean-row is-three">
          ${roleBlock('교육목사', groups.educationPastorA)}
          ${roleBlock('교육목사', groups.educationPastorB)}
          ${roleBlock('교육전도사', groups.educationEvangelist)}
        </div>
      </section>
      <section id="staff-section-elders" class="panel staff-clean-section">
        ${staffSectionNavigator('SEC-03', 'staff-section-elders')}
        <div class="staff-clean-role-stack">
          ${elderGroups.map((group) => `
            <div class="staff-clean-role">
              <h3>${escapeHtml(group.title)}</h3>
              <div class="staff-clean-grid is-many">
                ${group.names.map((name) => personFromName(name, group.title)).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
      <section id="staff-section-serving-elders" class="panel staff-clean-section">
        ${staffSectionNavigator('SEC-04', 'staff-section-serving-elders')}
        <div class="staff-clean-grid is-many">
          ${activeElders.map((name) => personFromName(name, '시무장로')).join('')}
        </div>
      </section>
      <section id="staff-section-office" class="panel staff-clean-section">
        ${staffSectionNavigator('SEC-05', 'staff-section-office')}
        <div class="staff-clean-grid is-office">
          ${officeStaff.map((item) => person(item)).join('')}
        </div>
      </section>
  `;
  return renderSubpageScaffold('church/staff', page, content);
}

function renderChurchFacilityPage() {
  const source = data.pages.church;
  const page = getNavItem('church/facility');
  const facilityNavItems = [
    ['facility-section-intro', '시설안내'],
    ['facility-section-spaces', '공간 안내'],
    ['facility-section-cafe', '카페헤븐'],
    ['facility-section-visit', '방문 동선'],
  ];
  const content = `
      <section id="facility-section-intro" class="church-landing-hero panel facility-intro-panel">
        <div class="church-landing-hero__media">본관 또는 교회 전경 사진 영역</div>
        <div class="church-landing-hero__copy">
          <span class="eyebrow">SEC-01</span>
          <h2>예배와 모임이 이루어지는 공간입니다</h2>
          <div class="church-landing-hero__intro">
            <p>예배와 모임이 이루어지는 주요 공간은 본관과 (선교)교육관으로 나누어져 있습니다.</p>
          </div>
        </div>
      </section>
      <section id="facility-section-spaces" class="panel facility-space-panel">
        ${sectionNavigator('SEC-02', facilityNavItems, 'facility-section-spaces', 'church/facility', '시설안내 섹션 이동')}
        <div class="facility-stack">
          ${source.facilities.map((item, index) => `
            <article class="facility-overview">
              <div class="facility-overview__media">${escapeHtml(item.title)} 사진 / 조감도 영역</div>
              <div class="facility-overview__body">
                <h3>${escapeHtml(item.title)}</h3>
                <p>${index === 0 ? '주일예배, 행정, 교제와 본당 중심의 교회 메인 공간입니다.' : '교회학교와 교육, 새가족 과정, 소그룹 모임을 위한 교육 중심 공간입니다.'}</p>
                <div class="facility-floor-list">
                  ${item.floors.map((floor) => {
                    const [level, ...rest] = floor.split(' ');
                    const floorText = index === 0 && level === '4F' ? '본당 · 새가족 등록 데스크' : rest.join(' ');
                    const isWorship = index === 0 && (level === '3F' || level === '4F');
                    return `
                      <div class="facility-floor-item ${isWorship ? 'is-worship' : ''}">
                        <strong>${escapeHtml(level)}</strong>
                        <span>${escapeHtml(floorText)}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
                ${index === 0 ? '<p class="facility-floor-note">* 예배가 드려지는 주요 예배실입니다.</p>' : ''}
              </div>
            </article>
          `).join('')}
        </div>
      </section>
      <section id="facility-section-cafe" class="panel facility-cafe-panel">
        ${sectionNavigator('SEC-03', facilityNavItems, 'facility-section-cafe', 'church/facility', '시설안내 섹션 이동')}
        <div class="facility-cafe-grid">
          <div class="facility-cafe-photo">카페헤븐 사진 영역</div>
          <div class="facility-cafe-copy">
            <h3>카페헤븐</h3>
            <p>본관 2층에 위치한 카페헤븐은 예배 전후 성도들이 자연스럽게 머물고 교제하는 공간입니다. 새가족 만남, 소그룹 모임, 주일의 쉼이 이어지는 열린 공간으로 안내합니다.</p>
            <div class="facility-cafe-points">
              <span>본관 2층</span>
              <span>교제 공간</span>
              <span>새가족 만남</span>
            </div>
            <div class="facility-info-list">
              <div><span>운영시간</span><strong>주일 예배 전후</strong></div>
              <div><span>위치</span><strong>본관 2층</strong></div>
            </div>
          </div>
        </div>
      </section>
      <section id="facility-section-visit" class="panel facility-visit-panel">
        ${sectionNavigator('SEC-04', facilityNavItems, 'facility-section-visit', 'church/facility', '시설안내 섹션 이동')}
        <div class="facility-visit-grid">
          <article class="facility-visit-card">
            <div class="facility-visit-icon">01</div>
            <h3>문의와 안내</h3>
            <p>방문 전 궁금한 내용은 교회 사무실로 문의하실 수 있습니다.</p>
            <div class="facility-info-list">
              <div><span>전화</span><strong>02-000-0000</strong></div>
              <div><span>운영시간</span><strong>화-금 09:00-17:00</strong></div>
              <div><span>주일 안내</span><strong>예배 전후 안내 데스크</strong></div>
            </div>
          </article>
          <article class="facility-visit-card">
            <div class="facility-visit-icon">02</div>
            <h3>차량운행안내</h3>
            <p>예배 전후 운행되는 차량 노선과 시간을 확인합니다.</p>
            <a href="${routeHref('worship/shuttle')}">자세히 보기</a>
          </article>
          <article class="facility-visit-card">
            <div class="facility-visit-icon">03</div>
            <h3>오시는 길</h3>
            <p>주소, 지도, 대중교통, 주차 정보를 한 화면에서 확인합니다.</p>
            <a href="${routeHref('church/directions')}">자세히 보기</a>
          </article>
        </div>
      </section>
  `;
  return renderSubpageScaffold('church/facility', page, content);
}

function renderChurchHistoryPage() {
  const page = getNavItem('church/history');
  const historyGroups = [
    {
      number: '01',
      title: '시작의 시간',
      lead: '번동 땅에 첫 예배가 울려 퍼지고, 교회의 뿌리가 내려지기 시작했습니다.',
      items: [
        ['1964', '번동 땅, 천막 안에서 첫 예배가 울려 퍼지다'],
        ['1964', '백낙기 목사, 초대 담임으로 위임받다', '혼자서도 열심히 전도하셨던 분'],
        ['1974', '창립 10주년, 번동을 믿음의 땅으로 바꿔가기 시작하다'],
      ],
    },
    {
      number: '02',
      title: '함께 세운 교회',
      lead: '성도들의 기도와 헌신으로 예배의 자리가 세워지고 넓어졌습니다.',
      items: [
        ['1975', '더 많은 성도가 함께 예배드릴 공간을 짓다'],
        ['1986', '전 성도가 한마음으로 성전 건축을 시작하다'],
        ['1987', '입당예배'],
        ['1988', '성전 헌당예배', '몇몇이 아닌 전 성도가 함께 이룬 교회'],
        ['1995', '선교교육관 구입, 미스바 기도원 건축'],
      ],
    },
    {
      number: '03',
      title: '이어진 사명',
      lead: '다음 세대와 지역, 선교를 향한 교회의 걸음이 이어졌습니다.',
      items: [
        ['1996', '백낙기 원로목사 추대, 김정호 목사 2대 담임으로 부임', '시대가 요구하는 일을 할 수 있도록 하나님이 보내신 분'],
        ['1998', '남양주 새사랑교회 설립'],
        ['2000', '수원 예안교회 설립'],
        ['2001', '백낙기 원로목사 소천'],
        ['2014', '창립 50주년, 희년 선포'],
      ],
    },
    {
      number: '04',
      title: '새로운 출발',
      lead: '60주년의 감사 위에서 번동제일교회는 다음 걸음을 준비합니다.',
      items: [
        ['2020', '코로나 속에서도 예배의 불꽃을 이어가다'],
        ['2022', '주차장 정비 완료, 준공예배'],
        ['2024', '창립 60주년, 황대석 목사 3대 담임으로 부임', '60주년의 감사가 100주년의 감사로 이어지도록'],
      ],
    },
  ];
  const historyNavItems = [
    ['history-section-intro', '걸어온 길'],
    ['history-section-story', '걸어온 시간'],
    ['history-section-anniversary', '60주년의 감사'],
    ['history-section-archive', '기억의 자리'],
  ];
  const content = `
      <section id="history-section-intro" class="church-landing-hero panel history-hero-panel">
        <div class="church-landing-hero__media">역사 대표 사진 영역</div>
        <div class="church-landing-hero__copy">
          <span class="eyebrow">SEC-01</span>
          <h2>한 천막에서 시작된 예배가 오늘의 교회가 되기까지</h2>
          <div class="church-landing-hero__intro">
            <p>1964년부터 오늘까지, 번동제일교회가 같은 자리에서 걸어온 믿음의 시간입니다.</p>
          </div>
        </div>
      </section>
      <section id="history-section-story" class="panel history-story-panel">
        ${sectionNavigator('SEC-02', historyNavItems, 'history-section-story', 'church/history', '걸어온 길 섹션 이동')}
        <div class="history-era-list">
          ${historyGroups.map((group) => `
            <article class="history-era-card">
              <div class="history-era-card__head">
                <span>${escapeHtml(group.number)}</span>
                <h3>${escapeHtml(group.title)}</h3>
                <p>${escapeHtml(group.lead)}</p>
              </div>
              <div class="history-era-card__events">
                ${group.items.map(([year, body, quote]) => `
                  <div class="history-era-row">
                    <strong>${escapeHtml(year)}</strong>
                    <p>${escapeHtml(body)}${quote ? `<em>“${escapeHtml(quote)}”</em>` : ''}</p>
                  </div>
                `).join('')}
              </div>
            </article>
          `).join('')}
        </div>
      </section>
      <section id="history-section-anniversary" class="panel church-vision-section history-vision-section">
        ${sectionNavigator('SEC-03', historyNavItems, 'history-section-anniversary', 'church/history', '걸어온 길 섹션 이동')}
        <div class="church-vision-section__inner">
          <div class="church-vision-section__copy">
            <h2>60주년의 감사가<br>100주년의 감사로 이어지도록</h2>
            <p>번동제일교회는 오늘도 하나님과 함께 걸어갑니다.</p>
          </div>
          <div class="church-vision-video" aria-label="창립 60주년 영상 플레이어">
            <div class="church-vision-video__frame">
              <span>창립 60주년 영상 YouTube Embed</span>
            </div>
          </div>
          <div class="church-vision-section__action">
            <a class="button button-secondary" href="${routeHref('anniversary')}">창립 60주년 더 보기</a>
          </div>
        </div>
      </section>
      <section id="history-section-archive" class="panel history-archive-panel">
        ${sectionNavigator('SEC-04', historyNavItems, 'history-section-archive', 'church/history', '걸어온 길 섹션 이동')}
        <div class="grid grid-2">
          <a class="church-organization-banner" href="${routeHref('anniversary')}">
            <h3>창립 60주년</h3>
            <p>창립 60주년 영상과 기념 콘텐츠로 이어지는 연결 영역입니다.</p>
          </a>
          <a class="church-organization-banner" href="${routeHref('memorial')}">
            <h3>故 백낙기목사 기념관</h3>
            <p>교회의 시작과 헌신의 발자취를 기념관 콘텐츠로 확장합니다.</p>
          </a>
        </div>
      </section>
  `;
  return renderSubpageScaffold('church/history', page, content);
}

function renderChurchOrganizationPage() {
  const page = getNavItem('church/organization');
  const units = [
    ['예배부', '예배와 성례, 안내', '부장 이현우 장로', true],
    ['찬양부', '찬양대와 찬양 사역', '부장 이현우 장로', true],
    ['서무부', '교직원, 문서, 기록', '부장 홍도희 장로'],
    ['총무부', '행사와 운영 지원', '부장 홍도희 장로'],
    ['재정부', '수입, 지출, 예결산', '부장 이호철 장로'],
    ['관리부', '시설, 비품, 안전', '부장 김희진 장로'],
    ['봉사부', '급식, 행사, 환경', '부장 이호철 장로'],
    ['미화부', '청소와 환경관리', '부장 최병욱 장로'],
    ['감사부', '재정과 운영 감사', '부장 서현철 장로'],
    ['새가족부', '등록과 정착 안내', '부장 조계완 장로', true],
    ['교육부', '교회학교와 양육', '부장 안동찬 장로', true],
    ['전도부', '전도와 교구 협력', '부장 이선규A 장로'],
    ['세계선교부', '국내외 선교 지원', '부장 홍도희 장로'],
    ['체육부', '체육과 친교 활동', '부장 최상균 장로'],
    ['차량부', '차량 운행과 주차', '부장 김희진 장로'],
    ['홍보영상부', '영상, 사진, 기록', '부장 이선규A 장로'],
    ['문화선교부', '카페, 문화, 지역', '부장 최상균 장로'],
    ['경조부', '장례와 경조 지원', '부장 이선규A 장로'],
    ['사회부', '구제와 지역 섬김', '부장 조계완 장로'],
  ];
  const departmentNames = [
    ['예배부', '부장 이현우 장로 / 안수집사 구형모 류희석 송기춘 이재호 최강산 / 권사 강효순 유호복 황혜선'],
    ['찬양부', '부장 이현우 장로 / 안수집사 노승구(시온) 강환범(호산나) / 권사 김길례(브니엘) 조문순(아가페)'],
    ['서무부', '부장 홍도희 장로 / 안수집사 김정훈 서진모 정영권 / 권사 김영의 김은경C 유은주 윤미자 이정열 최정례'],
    ['총무부', '부장 홍도희 장로 / 안수집사 김승식 서정수 서춘석 우일균 최재훈 / 권사 김미경 김선희A 김정이 유효순 육복임 이성희 장은영 조국상'],
    ['재정부', '부장 이호철 장로 / 안수집사 김용현 안태석 정윤화 / 권사 민성순 고은경 박옥순 이혜영 최영복B'],
    ['관리부', '부장 김희진 장로 / 안수집사 강정학 김원석 서진모 안태석 윤승호 이효민 최재훈 / 권사 김영이 김해욱 박연숙 오금자 옥동녀 이혜영 장귀애 차태숙 최윤숙 황정희 한희'],
    ['봉사부', '부장 이호철 장로 / 안수집사 김승식 박성종 서정근 이성규A 이시형 임형진 / 권사 김정옥B 김해욱 박미영 양경미 옥형미'],
    ['미화부', '부장 최병욱 장로 / 권사 민혜경 박종림 한희 / 협권 류명곤 / 집사 김성금 이순오 함수정 최윤영 최은하 황윤영'],
    ['감사부', '부장 서현철 장로 / 안수집사 강정학 노승구 지승근 주정식 / 권사 양경숙 오미숙 / 집사 김기은 김현정 안해란'],
    ['새가족부', '부장 조계완 장로 / 안수집사 김경호 김영석 노성래 윤승호 임형진 / 권사 강효순 김명숙C 김정섭 김태경 박금희 조숙연 최영희 황정희 / 집사 전미라'],
    ['교육부', '부장 안동찬 장로 / 안수집사 김대일 김영태 윤승호 최강산 최대성 / 권사 김명숙C 김명옥 김정섭 정수현 조숙연'],
    ['전도부', '부장 이선규A 장로 / 안수집사 김양호 박성종 서정근 윤승호 임동섭 임형진 / 권사 김길례 나승초 박갑순 박경화 양경미 이명애 이정열 정수현 조국상 최윤숙 최태정 허해경 / 교구·구역회장'],
    ['세계선교부', '부장 홍도희 장로 / 안수집사 강환범 서진모 윤승호 주정식 / 권사 김순례 남주애 박종림 박향덕 유정순 이미정 이옥란 조숙연 허해경'],
    ['체육부', '부장 최상균 장로 / 안수집사 김영찬 김용현 김원석 박성종 송기춘 유동훈 유효경 이효민 정영권 정윤화 최대성 최순신 / 집사 김원민 김재엽 박용욱 손보명 김인숙D 임미경 안해란 진소희 / 권사 김경희 박향덕 양경숙 오선숙 노흥미 채수남 / 교구·구역회장'],
    ['차량부', '부장 김희진 장로 / 안수집사 서춘석 이성규A 박성종'],
    ['홍보영상부', '부장 이선규A 장로 / 안수집사 서진모 이효민 임형진 정윤화 / 권사 나승초 박영애 오미숙 함광숙'],
    ['문화선교부', '부장 최상균 장로 / 안수집사 유효경 김원석 유동훈 / 권사 김정이 양경미 양경숙 조문순 / 집사 김인숙D 손보명'],
    ['경조부', '부장 이선규A 장로 / 안수집사 김석은 김양호 노승구 이성규A 이효민 임동섭 / 권사 김명희 김성미 김순례 박미영 / 각 교구 구역회장, 교구경조위원, 남선교회연합회장, 여전도회연합회장, 안수집사회장, 권사회장'],
    ['사회부', '부장 조계완 장로 / 안수집사 김경호 김승식 노성래 박성종 서정근 서춘석 이성규A 임형진 정영권 최재훈 / 권사 김성미 김선희A 박향덕 양경미 오선숙 이동순 장경숙 조국상 조현숙 채수남 최영희 / 집사 강세미 권희옥 안해란 전미라 함수정'],
  ];
  const education = [
    ['영아부', '0세-3세 / 주일 09:30 / 본관 영아부실', 'worship/school'],
    ['유아부', '4세-5세 / 주일 09:30 / 교육관 유아부실', 'worship/school'],
    ['유치부', '6세-7세 / 주일 09:30 / 교육관 유치부실'],
    ['유년부', '초등 1-3학년 / 주일 09:30 / 유년부실'],
    ['초등부', '초등 4-6학년 / 주일 09:30 / 초등부실'],
    ['청소년부', '중학생-고등학생 / 주일 09:30 / 본관 중예배실'],
  ];
  const choirs = [
    ['시온 찬양대', '대장 노승구 안수집사 / 지휘 김안국 안수집사'],
    ['호산나 찬양대', '대장 강환범 안수집사 / 지휘 조미라 선생'],
    ['브니엘 찬양대', '대장 김길례 권사 / 지휘 오정근 선생'],
    ['아가페 찬양대', '대장 조문순 권사 / 지휘 이광옥 권사'],
  ];
  const choirNames = [
    ['시온 찬양대', '대장 노승구 안수집사 / 부대장 홍태봉 권사, 박용욱 집사 / 지휘 김안국 안수집사 / 반주 변시온 권사, 신예은 선생'],
    ['호산나 찬양대', '대장 강환범 안수집사 / 부대장 최재훈 안수집사, 소완식 권사 / 지휘 조미라 선생 / 반주 이준연 선생, 안희정 선생'],
    ['브니엘 찬양대', '대장 김길례 권사 / 부대장 김영찬 안수집사, 김수현 집사 / 지휘 오정근 선생 / 반주 전익덕 집사, 심지현 선생'],
    ['아가페 찬양대', '대장 조문순 권사 / 부대장 류명곤 협권, 차태숙 권사 / 지휘 이광옥 권사 / 반주 이은진 선생, 이성진 선생'],
    ['삼마 중창단', '단장 김양호 안수집사 / 지도 김안국 안수집사 / 리더 서현철 장로 / 반장 신예은 선생'],
    ['임마누엘 중창단', '단장 마경선 권사 / 지도·반주 오지현 집사'],
    ['미리암찬양단', '단장 김영의 권사 / 지도 김성미 권사 / 반주 민혜경 권사'],
    ['프레이즈 찬양단', '단장 노소은 권사 / 부단장 옥동녀 권사 / 지도 남주애 권사'],
    ['쉐마찬양단', '단장 김성미 권사 / 부단장 박갑순 권사'],
    ['쉐카이나찬양단', '단장 최강산 안수집사 / 리더 김성림 전도사'],
    ['프레이즈 앙상블', '단장 김대일 안수집사 / 부단장 한희 권사, 이건희 집사 / 지도 김안국 안수집사 / 악장 심예슬 선생'],
    ['프레이즈 율동단', '단장·지도 강순옥 은퇴장로'],
    ['두나미스찬양단', '단장 강신일 목사'],
  ];
  const parishes = [
    ['1교구', '교구장 김형덕 목사', '번동 · 월계 · 중계', '번동 주공 1-5단지, 현대홈타운, 금호, 솔그린, 한양, 월계초안, 월계극동, 상계주공, 중계주공, 시영, 강남, 서초, 분당, 용인', ['번동 주공', '월계', '중계', '분당·용인']],
    ['2교구', '교구장 강신일 목사', '미아 · 성북 · 잠실', '진숙빌라, 요진, 미아현대, 신일고, 성신여대, 수유시장, 미아동, 송천동, 삼양동, 장위동, 잠실, 일산, 파주', ['미아동', '삼양동', '성북', '일산·파주']],
    ['3교구', '교구장 김명호 목사', '우이천 · 창동 · 쌍문', '한천로, 우이천 방면, 한전병원, 금용아파트, 창동, 번동래미안, 건영, 창동주공, 인수동, 우이동, 쌍문동, 방학동, 남양주, 양주', ['우이천', '창동', '쌍문·방학', '남양주·양주']],
    ['4교구', '교구장 최정철 목사', '오동공원 · 북부시장 · 하계', '교회 앞 세븐일레븐, 오동공원, 진주빌라, 한천로, 북부경찰서, 북부시장, 번동 두산위브, 번3동 기산, 하계동, 의정부', ['오동공원', '북부시장', '하계', '의정부']],
    ['젊은교구', '교구장 박온유 전도사', '신혼부부와 젊은 부부', '신혼부부부터 만 40세 미만 젊은 부부가 함께하는 생애 단계 기준의 교구입니다.', ['신혼부부', '젊은 부부', '만 40세 미만']],
  ];
  const parishLeaders = [
    ['1교구', '1-1 조현숙 권사 / 김영순 권사, 김성림 집사 · 1-10 고형숙 권사 / 노분옥 명권 · 1-14 조문순 권사 / 최성애 집사 · 1-19 육복임 권사 / 이미현 집사 · 1-28 이효숙 권사 / 백정애 은권 · 1-35 한영자 집사 / 이영자 은권'],
    ['2교구', '2-1 전영미 집사 / 최병숙 명권 · 2-2 조숙연 권사 / 권영자 은권 · 2-10 김성금 집사 / 신지영 집사 · 2-16 김연옥 권사 / 윤춘자 집사 · 2-25 김인숙B 집사 / 한혜림 집사 · 2-30 박미소 집사 / 주순옥 명권'],
    ['3교구', '3-1 강세미 집사 / 최영숙 명권, 양갑순 명권 · 3-10 유호복 권사 / 박미영 권사 · 3-18 이명애 권사 / 은민아 권사, 이숙희 집사 · 3-24 이춘하 권사 / 김춘실 명권, 곽애녀 명권 · 3-30 유미화 집사 / 권기출 은권, 오금자 권사'],
    ['4교구', '4-1 김은경B 집사 / 이정순A 명권 · 4-10 김명옥A 권사 / 이은혜 집사 · 4-19 조혜윤 집사 / 박종림 권사, 김수정 집사 · 4-28 이정자 권사 / 최영희 권사, 김덕희 권사 · 4-35 오선숙 권사 / 장윤순 명권, 김현아 집사'],
    ['젊은교구', '1구역 김수영 집사 · 2구역 백경아 집사 · 3구역 연수림 집사'],
  ];
  const institutionMeetings = [
    ['첫째주', [
      ['정기제직회(분기별)', '주일 오후 예배 후(1, 4, 7, 10월)', '본당 / 본관 3층'],
      ['장로회', '주일 Ⅲ부 예배 후', '은퇴장로회실 / 본관 4층'],
      ['제1여전도회', '주일 Ⅲ부 예배 후(낮 12:30)', '호산나찬양대실 / 본관 3층'],
      ['제2여전도회', '주일 Ⅲ부 예배 후', '유치부실 / 교육관 1층'],
      ['제3여전도회', '주일 Ⅲ부 예배 후(낮 12:50)', '유아부실 / 교육관 1층'],
      ['제5여전도회', '주일 Ⅲ부 예배 후(오후 1시)', '초등1부실 / 교육관 2층'],
    ]],
    ['둘째주', [
      ['아브라함회', '주일 Ⅲ부 예배 후(오후 1시)', '유치부실 / 본관 2층'],
      ['제2남선교회', '주일 Ⅲ부 예배 후', '헤븐 작은모둠방 / 본관 2층'],
      ['제3남선교회', '주일 Ⅲ부 예배 후', '헤븐 탑뉴스 / 본관 2층'],
      ['제4남선교회', '주일 Ⅲ부 예배 후', '헤븐 작은모둠방 / 본관 2층'],
      ['제5남선교회', '주일 Ⅲ부 예배 후', '헤븐 쉴만한창가 / 본관 2층'],
      ['제4여전도회', '주일 Ⅲ부 예배 후(오후 1:20)', '초등1부실 / 교육관 2층'],
      ['제6여전도회', '주일 Ⅲ부 예배 후(오후 12:50)', '꿈꾸는방 / 본관 3층'],
    ]],
    ['셋째주', [
      ['제1남선교회', '주일 Ⅲ부 예배 후', '헤븐 큰모둠방 / 본관 2층'],
      ['제6남선교회', '주일 Ⅲ부 예배 후', '헤븐 작은모둠방 / 본관 2층'],
      ['명예권사회', '주일 Ⅲ부 예배', '시온찬양대실 / 본관 3층'],
      ['제7여전도회', '주일 Ⅲ부 예배 후(오후 1:30)', '꿈꾸는방 / 교육관 3층'],
      ['제8여전도회', '주일 Ⅲ부 예배 후(오후 1:30)', '헤븐 큰모둠방 / 본관 2층'],
      ['제9여전도회', '주일 Ⅲ부 예배 후(오후 1시)', '유치부실 / 교육관 1층'],
    ]],
    ['넷째주', [
      ['당회', '주일 오후 찬양예배 후', '당회실 / 본관 4층'],
      ['안수집사회', '주일 Ⅲ부 예배 후', '헤븐 큰모둠방 / 본관 2층'],
      ['제7남선교회', '주일 Ⅲ부 예배 후', '방송실 / 본관 5층'],
      ['권사회', '주일 Ⅲ부 예배 후', '본당 / 본관 4층'],
      ['유니게회', '주일 Ⅲ부 예배 후(낮 12:50)', '유치부실 / 교육관 1층'],
      ['제10여전도회', '주일 Ⅲ부 예배 후', '영아부실 / 본관 1층'],
    ]],
  ];
  const organizationNavItems = [
    ['organization-section-intro', '교회조직'],
    ['organization-section-governance', '교회 운영 구조'],
    ['organization-section-education', '교육부'],
    ['organization-section-youth', '청년부'],
    ['organization-section-choir', '찬양대'],
    ['section-departments', '부서소개'],
    ['section-parishes', '교구소개'],
  ];
  const organizationSectionHead = (eyebrow, title, summary) => `
    <div class="newcomer-section-head organization-section-head">
      <span class="eyebrow">${escapeHtml(eyebrow)}</span>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(summary)}</p>
    </div>
  `;
  const content = `
      <section id="organization-section-intro" class="church-landing-hero panel organization-hero-panel">
        <div class="church-landing-hero__media">조직 흐름 요약 영역</div>
        <div class="church-landing-hero__copy">
          <span class="eyebrow">SEC-01</span>
          <h2>교회의 구조와 공동체를 한눈에</h2>
          <div class="church-landing-hero__intro">
            <p>예배, 교육, 찬양, 교구까지 번동제일교회를 이루는 공동체를 소개합니다.</p>
          </div>
        </div>
      </section>
      <section id="organization-section-governance" class="panel organization-rhythm">
        ${organizationSectionHead('SEC-02', '교회 운영 구조', '교회를 이끄는 기관입니다.')}
        ${sectionNavigator('', organizationNavItems, 'organization-section-governance', 'church/organization', '교회조직 섹션 이동')}
        <div class="organization-governance-grid">
          <article class="organization-card">
            <small>01</small>
            <h3>공동의회</h3>
            <p>교회의 중요한 결정을 모든 교인이 함께 의논하고 결정하는 모임입니다.</p>
            <div class="organization-governance-list">
              <div><strong>의장</strong><span>황대석 목사</span></div>
              <div><strong>서기</strong><span>최병욱 장로</span></div>
              <div><strong>회원</strong><span>무흠 입교인</span></div>
            </div>
            <p class="organization-definition">무흠 입교인은 교회 공동체 안에서 책벌 중이 아니며 공동의회 회원 자격을 가진 입교인을 뜻합니다.</p>
          </article>
          <article class="organization-card">
            <small>02</small>
            <h3>당회</h3>
            <p>담임목사와 장로들이 교회의 신앙과 방향을 함께 이끌어가는 기관입니다.</p>
            <div class="organization-governance-list">
              <div><strong>담임</strong><span>황대석 목사</span></div>
              <div><strong>시무</strong><span>이선규A, 이선규B, 최병욱, 이현우, 안동찬, 홍도희, 이호철, 조계완, 서현철, 김희진, 최상균 장로</span></div>
            </div>
          </article>
          <article class="organization-card">
            <small>03</small>
            <h3>제직회</h3>
            <p>각 직분자들이 교회 운영과 봉사를 함께 논의하고 실행하는 모임입니다.</p>
            <div class="organization-governance-list">
              <div><strong>구성</strong><span>목사, 장로, 안수집사, 권사, 집사 등 제직</span></div>
              <div><strong>실행</strong><span>예배부, 찬양부, 서무부, 총무부, 재정부, 관리부, 봉사부, 교육부, 전도부 등</span></div>
            </div>
          </article>
        </div>
        <details class="organization-list-details organization-meeting-details">
          <summary>각 기관 집회안내</summary>
          <div class="organization-meeting-list">
            ${institutionMeetings.map(([week, meetings]) => `
              <article class="organization-meeting-group">
                <h3>${escapeHtml(week)}</h3>
                <div class="organization-meeting-rows">
                  ${meetings.map(([name, time, place]) => `
                    <div class="organization-meeting-row">
                      <strong>${escapeHtml(name)}</strong>
                      <span>${escapeHtml(time)}</span>
                      <em>${escapeHtml(place)}</em>
                    </div>
                  `).join('')}
                </div>
              </article>
            `).join('')}
          </div>
        </details>
      </section>
      <section id="organization-section-education" class="panel organization-rhythm">
        ${organizationSectionHead('SEC-03', '교육부 소개', '다음 세대를 말씀으로 세웁니다.')}
        ${sectionNavigator('', organizationNavItems, 'organization-section-education', 'church/organization', '교회조직 섹션 이동')}
        <div class="organization-age-grid">
          ${education.map(([title, detail, href]) => `
            <article class="organization-age-card">
              <div class="organization-photo is-small">${escapeHtml(title)} 사진 영역</div>
              <strong>${escapeHtml(title)}</strong>
              <span>${escapeHtml(detail)}</span>
              ${href ? `<a class="organization-cafe-link" href="${routeHref(href)}">교회학교 와이어프레임 보기</a>` : ''}
            </article>
          `).join('')}
        </div>
      </section>
      <section id="organization-section-youth" class="panel organization-rhythm">
        ${organizationSectionHead('SEC-04', '청년부 소개', '청년들이 함께 예배하고 교제합니다.')}
        ${sectionNavigator('', organizationNavItems, 'organization-section-youth', 'church/organization', '교회조직 섹션 이동')}
        <div class="organization-youth-feature">
          <div class="organization-photo is-wide">청년부 예배 사진 영역</div>
          <div class="organization-youth-grid">
            <article class="organization-name-panel"><small>예배</small><h3>주일4부 청년예배</h3><p>예배와 삶의 온전함이 회복되는 공동체를 지향합니다.</p></article>
            <article class="organization-name-panel"><small>말씀</small><h3>로마서 12:1-2</h3><p>기존 청년부 소개의 핵심 말씀을 별도 섹션으로 살립니다.</p></article>
            <article class="organization-name-panel"><small>안내</small><h3>예배시간과 장소</h3><p>주일 오후 1:30, 본관 중예배실에서 청년예배로 모입니다.</p></article>
          </div>
        </div>
      </section>
      <section id="organization-section-choir" class="panel organization-rhythm">
        ${organizationSectionHead('SEC-05', '찬양대 소개', '예배를 섬기는 찬양의 공동체입니다.')}
        ${sectionNavigator('', organizationNavItems, 'organization-section-choir', 'church/organization', '교회조직 섹션 이동')}
        <div class="organization-choir-grid">
          ${choirs.map(([title, detail]) => `
            <article class="organization-name-panel">
              <div class="organization-photo is-small">${escapeHtml(title)} 사진 영역</div>
              <small>찬양대</small>
              <h3>${escapeHtml(title)}</h3>
              <p>${escapeHtml(detail)}</p>
            </article>
          `).join('')}
        </div>
        <details class="organization-list-details">
          <summary>찬양대와 찬양단 명단 확인</summary>
          <div class="organization-name-list">
            ${choirNames.map(([title, body]) => `<div class="organization-name-row"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></div>`).join('')}
          </div>
        </details>
      </section>
      <section id="section-departments" class="panel organization-rhythm">
        ${organizationSectionHead('SEC-06', '부서 소개', '각 부서가 하나의 교회를 이룹니다.')}
        ${sectionNavigator('', organizationNavItems, 'section-departments', 'church/organization', '교회조직 섹션 이동')}
        <div class="organization-unit-grid">
          ${units.map(([title, body, leader, featured]) => `
            <article class="organization-unit-card ${featured ? 'is-featured' : ''}">
              <strong>${escapeHtml(title)}</strong>
              <small>${escapeHtml(body)}</small>
              <em>${escapeHtml(leader)}</em>
            </article>
          `).join('')}
        </div>
        <details class="organization-list-details">
          <summary>부서별 명단 확인</summary>
          <div class="organization-name-list">
            ${departmentNames.map(([title, body]) => `<div class="organization-name-row"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></div>`).join('')}
          </div>
        </details>
      </section>
      <section id="section-parishes" class="panel organization-rhythm">
        ${organizationSectionHead('SEC-07', '교구 소개', '가까운 이웃과 함께하는 신앙 공동체입니다.')}
        ${sectionNavigator('', organizationNavItems, 'section-parishes', 'church/organization', '교회조직 섹션 이동')}
        <div class="organization-parish-list">
          ${parishes.map(([title, leader, area, body, tags]) => `
            <article class="organization-parish-card">
              <strong>${escapeHtml(title)}</strong>
              <div>
                <span class="organization-parish-region">${escapeHtml(leader)}</span>
                <h3>${escapeHtml(area)}</h3>
                <p>${escapeHtml(body)}</p>
                <ul>${tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('')}</ul>
              </div>
            </article>
          `).join('')}
        </div>
        <details class="organization-list-details">
          <summary>인도자 중심 교구편성표 보기</summary>
          <div class="organization-name-list">
            ${parishLeaders.map(([title, body]) => `<div class="organization-name-row"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></div>`).join('')}
          </div>
        </details>
      </section>
  `;
  return renderSubpageScaffold('church/organization', page, content);
}

function renderNewcomerGreetingPage(activeRoute = 'newcomers') {
  const source = data.pages.newcomers;
  const page = getNavItem(activeRoute) || getNavItem('newcomers');
  const helperPeople = [
    { role: '새가족 담당 교역자', name: '담당 교역자', detail: '등록 상담과 교육 연결을 안내합니다.' },
    { role: '새가족부 섬김이', name: '새가족 섬김이', detail: '첫 방문부터 정착까지 곁에서 돕습니다.' },
    { role: '교구 연결 담당', name: '교구 섬김이', detail: '교구와 소그룹 공동체로 자연스럽게 연결합니다.' },
  ];
  const galleryItems = [
    ['2026 새가족 환영회', '2026.03', '환영회'],
    ['새가족 만남의 시간', '2026.02', '교제'],
    ['공동체 소개와 기도', '2026.01', '정착'],
  ];
  const weeklyItems = [
    ['한덕희 성도', '#믿음교구 #새가족'],
    ['이진희 성도', '#소망교구 #첫방문'],
    ['이상훈 성도', '#청년부 #새가족'],
  ];
  const newcomerNavItems = [
    ['section-newcomers-welcome', '어서오세요'],
    ['section-newcomers-greeting', '담임목사 인사말'],
    ['section-newcomers-registration', '새가족 등록안내'],
    ['section-newcomers-education', '새가족 교육'],
    ['section-newcomers-helper', '새가족 섬김이'],
    ['section-newcomers-welcome-party', '새가족환영회'],
    ['section-newcomers-weekly-family', '금주의 새가족'],
  ];
  const newcomerSectionHead = (eyebrow, title, summary) => `
    <div class="newcomer-section-head">
      <span class="eyebrow">${escapeHtml(eyebrow)}</span>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(summary)}</p>
    </div>
  `;
  const content = `
      <section id="section-newcomers-welcome" class="church-landing-hero panel newcomers-welcome-hero">
        <div class="church-landing-hero__media">새가족 환영 대표 이미지 영역</div>
        <div class="church-landing-hero__copy">
          <span class="eyebrow">SEC-01</span>
          <h2>어서오세요<br>환영하고 축복합니다</h2>
          <div class="church-landing-hero__intro">
            <p>번동제일교회는 오직 주님 안에 거하며, 함께 행복한 교회를 만들어 나가는 공동체입니다.</p>
          </div>
        </div>
      </section>
      <section id="section-newcomers-greeting" class="panel newcomers-greeting-panel">
        ${newcomerSectionHead('SEC-02', '담임목사 인사말', '먼저 인사드립니다')}
        ${sectionNavigator('', newcomerNavItems, 'section-newcomers-greeting', 'newcomers', '처음오셨나요 섹션 이동')}
        <div class="newcomer-visual-copy">
          <div class="placeholder-box tall">담임목사 인사말 이미지 영역<br>aboutA_01_2026 참고</div>
          <article class="card">
            <span class="eyebrow">담임목사 인사말</span>
            <h3>샬롬! 함께 행복을 만들어가는 번동제일교회에 오신 것을 환영하고 축복합니다.</h3>
            <p>여러분들이 언제든 찾아와 기댈 수 있는 시냇가 나무와 같은 교회 되기를 소망합니다. 성도님들의 삶의 고민을 함께 나누고, 말씀으로 위로하며, 매주 선포되는 설교를 통해 참된 행복을 발견하는 행복한 교회의 여정에 사랑하는 당신을 초청합니다.</p>
            <p class="meta">황대석 담임목사</p>
          </article>
        </div>
      </section>
      <section id="section-newcomers-registration" class="panel newcomers-registration-panel">
        ${newcomerSectionHead('SEC-03', '새가족 등록안내', '등록부터 환영회까지, 한 단계씩 함께합니다')}
        ${sectionNavigator('', newcomerNavItems, 'section-newcomers-registration', 'newcomers', '처음오셨나요 섹션 이동')}
        <div class="newcomer-flow-line">
          ${['새가족등록', '예배시간중 환영인사', '사진촬영', '면담 및 기도', '새가족환영회'].map((item, index) => `
            <article class="newcomer-flow-step">
              <span>${String(index + 1).padStart(2, '0')}</span>
              <h3>${escapeHtml(item)}</h3>
            </article>
          `).join('')}
        </div>
      </section>
      <section id="section-newcomers-education" class="panel newcomers-education-panel">
        ${newcomerSectionHead('SEC-04', '새가족 교육', '4주간 신앙의 기초와 교회 공동체를 함께 배워갑니다')}
        ${sectionNavigator('', newcomerNavItems, 'section-newcomers-education', 'newcomers', '처음오셨나요 섹션 이동')}
        <div class="newcomer-week-grid">
          ${['1주 성경은 무엇인가?', '2주 구원이란 무엇인가?', '3주 죄사함과 승리는 무엇인가?', '4주 교회는 무엇인가'].map((item) => `
            <article class="newcomer-week-card">
              <h3>${escapeHtml(item)}</h3>
            </article>
          `).join('')}
        </div>
        <div class="newcomer-photo-grid-8">
          ${Array.from({ length: 8 }).map((_, index) => `<div class="placeholder-box small">교육 사진 ${index + 1}</div>`).join('')}
        </div>
        <dl class="newcomer-education-meta">
          <div><dt>과정</dt><dd>4주 양육과정</dd></div>
          <div><dt>시간</dt><dd>매주 주일</dd></div>
          <div><dt>장소</dt><dd>교회 2층 카페헤슨 큰 모듬방</dd></div>
        </dl>
      </section>
      <section id="section-newcomers-helper" class="panel newcomers-helper-panel">
        ${newcomerSectionHead('SEC-05', '새가족 섬김이', '처음 오신 날부터 곁에서 함께하는 섬김이가 있습니다')}
        ${sectionNavigator('', newcomerNavItems, 'section-newcomers-helper', 'newcomers', '처음오셨나요 섹션 이동')}
        <div class="newcomer-helper-layout">
          <div class="newcomer-helper-row is-two">
            <article class="newcomer-helper-team-card">
              <div class="newcomer-helper-team-card__media">
                <div class="staff-clean-card__photo">사진</div>
              </div>
              <div class="newcomer-helper-team-card__text"><strong>교역자</strong><span>1인 고정</span><p>새가족 등록과 신앙 상담을 담당합니다.</p></div>
            </article>
            <article class="newcomer-helper-team-card">
              <div class="newcomer-helper-team-card__media">
                <div class="staff-clean-card__photo">사진</div>
              </div>
              <div class="newcomer-helper-team-card__text"><strong>장로</strong><span>1인 고정</span><p>교회 공동체 연결과 정착을 돕습니다.</p></div>
            </article>
          </div>
          <div class="newcomer-helper-row is-three">
            <article class="newcomer-helper-team-card has-photo-nav">
              <div class="newcomer-helper-team-card__media">
                <button type="button" aria-label="이전 행정팀">&lt;</button>
                <div class="staff-clean-card__photo">사진</div>
                <button type="button" aria-label="다음 행정팀">&gt;</button>
              </div>
              <div class="newcomer-helper-team-card__text"><strong>행정팀</strong><span>1인 표시 + 2인 추가</span><p>등록 정보와 행정 안내를 담당합니다.</p></div>
            </article>
            <article class="newcomer-helper-team-card has-photo-nav">
              <div class="newcomer-helper-team-card__media">
                <button type="button" aria-label="이전 안내팀">&lt;</button>
                <div class="staff-clean-card__photo">사진</div>
                <button type="button" aria-label="다음 안내팀">&gt;</button>
              </div>
              <div class="newcomer-helper-team-card__text"><strong>안내팀</strong><span>3인 롤링</span><p>예배 전후 새가족 안내와 동선을 돕습니다.</p></div>
            </article>
            <article class="newcomer-helper-team-card has-photo-nav">
              <div class="newcomer-helper-team-card__media">
                <button type="button" aria-label="이전 양육팀">&lt;</button>
                <div class="staff-clean-card__photo">사진</div>
                <button type="button" aria-label="다음 양육팀">&gt;</button>
              </div>
              <div class="newcomer-helper-team-card__text"><strong>양육팀</strong><span>3인 표시 + 8인 추가</span><p>4주 양육과정과 공동체 정착을 돕습니다.</p></div>
            </article>
          </div>
        </div>
      </section>
      <section id="section-newcomers-welcome-party" class="panel newcomers-gallery-panel">
        ${newcomerSectionHead('SEC-06', '새가족 환영회', '새 가족을 맞이했던 반가운 순간들입니다')}
        ${sectionNavigator('', newcomerNavItems, 'section-newcomers-welcome-party', 'newcomers', '처음오셨나요 섹션 이동')}
        <div class="newcomer-year-filter">
          <strong>연도별 보기</strong>
          ${['전체', '2026', '2025', '2024', '2023'].map((year, index) => `<span class="${index === 0 ? 'is-active' : ''}">${escapeHtml(year)}</span>`).join('')}
        </div>
        <div class="grid grid-3">
          ${galleryItems.map((item) => `
            <article class="card">
              <div class="placeholder-box medium">환영회 사진</div>
              <h3>${escapeHtml(item[0])}</h3>
              <p>${escapeHtml(item[1])} · ${escapeHtml(item[2])}</p>
            </article>
          `).join('')}
        </div>
        <div class="button-row centered">
          <a class="button button-secondary" href="${routeHref('newcomers/welcome-party')}">새가족환영회 게시판 더보기</a>
        </div>
      </section>
      <section id="section-newcomers-weekly-family" class="panel newcomers-weekly-panel">
        ${newcomerSectionHead('SEC-07', '금주의 새가족', '이번 주 우리 가족이 된 분들을 함께 반겨주세요')}
        ${sectionNavigator('', newcomerNavItems, 'section-newcomers-weekly-family', 'newcomers', '처음오셨나요 섹션 이동')}
        <div class="newcomer-tag-row">
          <strong>분류별 보기</strong>
          ${['#전체', '#믿음교구', '#소망교구', '#청년부', '#첫방문', '#새가족교육'].map((tag, index) => `<span class="${index === 0 ? 'is-active' : ''}">${escapeHtml(tag)}</span>`).join('')}
        </div>
        <div class="grid grid-3">
          ${weeklyItems.map((item) => `
            <article class="card">
              <div class="placeholder-box medium">새가족 사진</div>
              <h3>${escapeHtml(item[0])}</h3>
              <p>${escapeHtml(item[1])}</p>
            </article>
          `).join('')}
        </div>
        <div class="button-row centered">
          <a class="button button-secondary" href="${routeHref('newcomers/weekly-family')}">금주의 새가족 게시판 더보기</a>
        </div>
      </section>
  `;
  return renderSubpageScaffold(activeRoute, page, content);
}

function renderNewcomerRegistrationPage() {
  const source = data.pages.newcomers;
  const page = getNavItem('newcomers/registration');
  const content = `
      <section class="panel">
        ${sectionTitle('Flow', '등록 + 교육')}
        <div class="step-list">
          ${source.steps.map((item, index) => `
            <div class="step-card">
              <span class="step-number">${index + 1}</span>
              <strong>${escapeHtml(item)}</strong>
            </div>
          `).join('')}
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Detail', '등록 및 교육 상세')}
        <div class="grid grid-2">
          <article class="card">
            <h3>등록 과정</h3>
            <ul class="bullet-list">
              ${source.education.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
          </article>
          <article class="card">
            <div class="placeholder-box medium">등록카드 / 교육안내 시안</div>
            <p>등록카드, 새가족 교육 일정, 담당 교역자 연결 구조를 함께 배치합니다.</p>
          </article>
        </div>
      </section>
  `;
  return renderSubpageScaffold('newcomers/registration', page, content);
}

function renderNewcomerWeeklyPage() {
  const source = data.pages.newcomers;
  const page = getNavItem('newcomers/weekly-family');
  const content = `
      <section class="panel">
        ${sectionTitle('Weekly', '금주 새가족')}
        <div class="grid grid-2">
          <article class="card">
            <h3>이번 주 등록</h3>
            <ul class="bullet-list">
              ${source.weeklyNewFamily.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
          </article>
          <article class="card">
            <div class="placeholder-box medium">새가족 소개 이미지 / 명단 영역</div>
            <p>주보형 게시물이 아닌 새가족 안내 성격에 맞춰 간단한 소개 블록으로 재구성합니다.</p>
          </article>
        </div>
      </section>
  `;
  return renderSubpageScaffold('newcomers/weekly-family', page, content);
}

function renderNewcomerWelcomePartyPage() {
  const source = data.pages.newcomers;
  const page = getNavItem('newcomers/welcome-party');
  const content = `
      <section class="panel">
        ${sectionTitle('Party', '새가족 환영회')}
        <div class="grid grid-2">
          <article class="card">
            <div class="placeholder-box tall">환영회 사진 / 일정 배너</div>
          </article>
          <article class="card">
            <h3>행사 안내</h3>
            <ul class="bullet-list">
              <li>새가족 환영회 일정 및 장소</li>
              <li>담당 교역자와 섬김이 소개</li>
              <li>행사 스케치와 후기 사진 배치</li>
            </ul>
            <p>기존 환영회 게시판 성격을 와이어프레임 기준으로 한 화면에 정리합니다.</p>
          </article>
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Process', '환영 이후 연결')}
        <div class="grid grid-3">
          ${source.steps.slice(2, 5).map((item) => `
            <article class="card">
              <h3>${escapeHtml(item)}</h3>
              <p>환영회 이후 자연스럽게 공동체에 연결되는 후속 단계를 보여주는 블록입니다.</p>
            </article>
          `).join('')}
        </div>
      </section>
  `;
  return renderSubpageScaffold('newcomers/welcome-party', page, content);
}

function renderChurchDirectionsPage() {
  const source = data.pages.newcomers;
  const page = getNavItem('church/directions');
  const routeGroups = [
    ['버스', '간선 101, 106, 107, 108, 120, 130, 140, 141, 142, 150, 160, 161, 170 / 지선 1018, 1148, 1151'],
    ['지하철', '4호선 수유역 2번 출구에서 강북경찰서 방향으로 이동 후 오패산 터널 사거리에서 좌회전'],
    ['자가용', '네비게이션에서 번동제일교회 또는 덕릉로 40다길 13을 검색합니다. 주일에는 현장 안내에 따라 주차합니다.'],
  ];
  const directionsNavItems = [
    ['directions-section-intro', '오시는 길'],
    ['directions-section-map', '지도와 방문 정보'],
    ['directions-section-route', '교통 안내'],
  ];
  const content = `
      <section id="directions-section-intro" class="panel directions-intro-panel">
        <div class="section-head section-head-center">
          <div>
            <span class="eyebrow">SEC-01</span>
            <h2>언제든지 오세요, 기다리고 있습니다</h2>
            <p>대중교통과 자가용 이용 방법, 주차 안내까지 찾아오시는 길을 안내합니다.</p>
          </div>
        </div>
      </section>
      <section id="directions-section-map" class="panel directions-map-panel">
        ${sectionNavigator('SEC-02', directionsNavItems, 'directions-section-map', 'church/directions', '오시는 길 섹션 이동')}
        <div class="directions-reference-layout">
          <div class="directions-map-placeholder is-reference">카카오맵 / 네이버지도 연동 영역</div>
          <div class="directions-contact-strip">
            <div>
              <span>주소</span>
              <strong>${escapeHtml(source.directions.address)}</strong>
            </div>
            <div>
              <span>문의</span>
              <strong>${escapeHtml(source.directions.phone)}</strong>
            </div>
          </div>
        </div>
      </section>
      <section id="directions-section-route" class="panel directions-map-panel directions-route-panel">
        ${sectionNavigator('SEC-03', directionsNavItems, 'directions-section-route', 'church/directions', '오시는 길 섹션 이동')}
        <div class="directions-reference-routes">
          ${routeGroups.map(([title, body]) => `
            <article>
              <span>${escapeHtml(title)}</span>
              <div>
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(body)}</p>
              </div>
            </article>
          `).join('')}
          <article>
            <span>안내</span>
            <div>
              <h3>처음 오셨다면</h3>
              <p>본관 입구 또는 안내 데스크에서 새가족 안내를 받을 수 있습니다.</p>
            </div>
          </article>
        </div>
      </section>
  `;
  return renderSubpageScaffold('church/directions', page, content);
}

function renderWorshipTimesPage(activeRoute = 'worship') {
  const source = data.pages.worship;
  const page = getNavItem(activeRoute) || getNavItem('worship');
  const worshipNavItems = [
    ['section-worship-intro', '예배안내'],
    ['section-worship-times', '예배시간/장소'],
    ['section-worship-school', '교회학교 예배'],
    ['section-worship-shuttle', '차량운행안내'],
  ];
  const weekdayWorship = [
    ['찬양예배', '주일 오후 2:50', '본당'],
    ['수요 1부 예배', '수요일 오전 10:30', '본당'],
    ['수요 2부 예배', '수요일 오후 7:30', '본당'],
    ['새벽예배', '월~토 새벽 05:30', '본당 / 중예배실'],
    ['구역예배', '금요일 오전 10:00', '본당'],
    ['심야예배', '금요일 저녁 8:00', '본당'],
  ];
  const content = `
      <section id="section-worship-intro" class="church-landing-hero panel worship-hero-panel">
        <div class="church-landing-hero__media">예배 대표 이미지 영역</div>
        <div class="church-landing-hero__copy">
          <span class="eyebrow">SEC-01</span>
          <h2>예배가 삶의 중심이 되는 교회입니다</h2>
          <div class="church-landing-hero__intro">
            <p>하나님께 드리는 예배가 날마다 이어지는 공동체입니다.</p>
          </div>
        </div>
      </section>
      <section id="section-worship-times" class="panel worship-info-panel">
        ${sectionTitle('SEC-02', '예배 시간과 장소 안내', '모든 예배 일정을 확인하세요.')}
        ${sectionNavigator('', worshipNavItems, 'section-worship-times', 'worship', '예배안내 섹션 이동')}
        <div class="worship-table-card">
          <div class="worship-table-card__head">
            <strong>주일예배</strong>
            <span>본당 중심 / 청년예배는 중예배실</span>
          </div>
          <div class="worship-readable-table">
            ${source.worshipTimes.slice(0, 4).map((row) => `
              <div class="worship-readable-row">
                <strong>${escapeHtml(row[0])}</strong>
                <span>${escapeHtml(row[1])}</span>
                <em>${escapeHtml(row[2])}</em>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="worship-sub-grid">
          ${weekdayWorship.map((row) => `
            <article class="worship-mini-card">
              <strong>${escapeHtml(row[0])}</strong>
              <span>${escapeHtml(row[1])}</span>
              <em>${escapeHtml(row[2])}</em>
            </article>
          `).join('')}
        </div>
      </section>
      <section id="section-worship-school" class="panel worship-school-panel">
        ${sectionTitle('SEC-03', '교회학교 예배 안내', '각 부서별 예배 시간을 확인하세요.')}
        ${sectionNavigator('', worshipNavItems, 'section-worship-school', 'worship', '예배안내 섹션 이동')}
        <div class="worship-school-grid">
          ${source.schoolTimes.map((row) => `
            <article class="worship-school-card">
              <div>
                <strong>${escapeHtml(row[0])}</strong>
                <span>${escapeHtml(row[1])}</span>
              </div>
              <p>${escapeHtml(row[2])}</p>
              <em>${escapeHtml(row[3])}</em>
            </article>
          `).join('')}
        </div>
      </section>
      ${renderWorshipShuttleContent()}
  `;
  return renderSubpageScaffold(activeRoute, page, content);
}

function renderWorshipShuttleContent() {
  const shuttleRoutes = [
    {
      route: '3부 예배 1코스',
      direction: '교육촌 주공4,5단지 방향',
      note: '3부 예배 후 10분 뒤 교회에서 출발',
      stops: [
        ['교회 출발', '10:40'],
        ['오패산', '10:45'],
        ['미아교회 앞', '10:47'],
        ['한영교회 앞', '10:50'],
        ['교육촌', '10:52'],
        ['주공4단지', '10:54'],
        ['주공5단지', '10:56'],
        ['교회 도착', '11:00'],
      ],
    },
    {
      route: '3부 예배 2코스',
      direction: '공릉동·시영·초안아파트 방향',
      note: '3부 예배 후 10분 뒤 교회에서 출발',
      stops: [
        ['대동아파트', '10:20'],
        ['노원문화원시영아파트', '10:22'],
        ['사슴아파트', '10:25'],
        ['대우·청백아파트', '10:30'],
        ['극동·초안아파트 202동', '10:35'],
        ['동서울카센터 앞', '10:40'],
        ['교회 도착', '10:50'],
      ],
    },
    {
      route: '3부 예배 3코스',
      direction: '녹천역·창동지구대·대우푸르지오 방향',
      note: '3부 예배 후 10분 뒤 교회에서 출발',
      stops: [
        ['녹천역', '10:40'],
        ['주공3단지 정문', '10:43'],
        ['창동 지구대', '10:50'],
        ['대우푸르지오 정문', '10:53'],
        ['우영마트', '10:55'],
        ['건영아파트', '10:58'],
        ['금용아파트', '11:00'],
        ['교회 도착', '11:10'],
      ],
    },
    {
      route: '3부 예배 4코스',
      direction: '중계4단지·상계보람아파트·중계역 방향',
      note: '3부 예배 후 10분 뒤 교회에서 출발',
      stops: [
        ['중계4단지', '10:20'],
        ['상계 벽산아파트', '10:30'],
        ['상계 보람8단지', '10:35'],
        ['노일초교 앞', '10:40'],
        ['중계역 6번출구', '10:50'],
        ['미도아파트', '10:52'],
        ['19단지', '11:00'],
        ['교회 도착', '11:07'],
      ],
    },
    {
      route: '3부 예배 5코스',
      direction: '창동상아아파트·쌍문동·4.19탑·화계사·수유역 방향',
      note: '3부 예배 후 10분 뒤 교회에서 출발',
      stops: [
        ['창동상아아파트', '10:30'],
        ['쌍문동 하이마트 앞', '10:33'],
        ['쌍문1동 주민센터', '10:36'],
        ['(구)광산슈퍼 사거리', '10:40'],
        ['기아자동차 서비스센터', '10:42'],
        ['4.19탑 신용랙산 앞', '10:45'],
        ['극동아파트', '10:48'],
        ['우이초교 후문', '10:50'],
        ['화계사 사거리', '10:54'],
        ['수유역 1번출구', '11:00'],
        ['교회 도착', '11:05'],
      ],
    },
  ];
  const content = `
      <section id="section-worship-shuttle" class="panel shuttle-route-panel">
        ${sectionTitle('SEC-04', '차량 운행 안내', '주일 운행 노선과 시간표를 확인하세요.')}
        ${sectionNavigator('', [
          ['section-worship-intro', '예배안내'],
          ['section-worship-times', '예배시간/장소'],
          ['section-worship-school', '교회학교 예배'],
          ['section-worship-shuttle', '차량운행안내'],
        ], 'section-worship-shuttle', 'worship', '예배안내 섹션 이동')}
        <div class="shuttle-route-grid">
          ${shuttleRoutes.map((item) => `
            <article class="shuttle-route-card">
              <div class="shuttle-route-card__head">
                <span>${escapeHtml(item.route)}</span>
                <strong>${escapeHtml(item.direction)}</strong>
                <p>${escapeHtml(item.note)}</p>
              </div>
              <div class="shuttle-stop-list">
                ${item.stops.map((stop) => `
                  <div class="shuttle-stop">
                    <span>${escapeHtml(stop[1])}</span>
                    <strong>${escapeHtml(stop[0])}</strong>
                  </div>
                `).join('')}
              </div>
            </article>
          `).join('')}
        </div>
      </section>
  `;
  return content;
}

function renderWorshipShuttlePage() {
  return renderWorshipTimesPage('worship/shuttle');
}

const MEDIA_ARCHIVE_CATEGORY_ROUTES = {
  prayer: {
    '전체': 'media/archive/prayer',
    '수요기도회': 'media/archive/prayer/wednesday',
    '금요기도회': 'media/archive/prayer/friday',
    '새벽기도회': 'media/archive/prayer/dawn',
  },
  choir: {
    '전체': 'media/archive/choir',
    '1부 브니엘': 'media/archive/choir/peniel',
    '2부 호산나': 'media/archive/choir/hosanna',
    '3부 시온': 'media/archive/choir/zion',
  },
  events: {
    '전체': 'media/archive/events',
    '집회': 'media/archive/events/gathering',
    '행사': 'media/archive/events/event',
    '기타': 'media/archive/events/etc',
  },
};

function renderMediaLineMenu(items, options = {}) {
  const { activeLabel = items[0] || '', routeMap = null, ariaLabel = '분류별 보기' } = options;
  return `
        <div class="media-line-menu" aria-label="${escapeHtml(ariaLabel)}">
          ${items.map((item) => {
            const isActive = item === activeLabel;
            const className = isActive ? 'is-active' : '';
            if (routeMap && routeMap[item]) {
              return `<a class="${className}" href="${routeHref(routeMap[item])}">${escapeHtml(item)}</a>`;
            }
            return `<span class="${className}">${escapeHtml(item)}</span>`;
          }).join('')}
        </div>
  `;
}

function renderMediaCategoryPage(routeKey) {
  const source = data.pages.media;
  const page = getNavItem(routeKey) || getNavItem('media');
  const mediaNavItems = [
    ['section-media-intro', '말씀&찬양'],
    ['section-media-sunday', '주일예배'],
    ['section-media-youth', '청년예배'],
    ['section-media-praise', '찬양예배'],
    ['section-media-prayer', '기도회'],
    ['section-media-choir', '찬양대'],
    ['section-media-events', '집회 및 행사'],
  ];
  const recentVideos = (label, categories = []) => [1, 2, 3].map((index) => {
    const category = categories[index - 1] || '';
    const cardLabel = category || label;
    return `
            <article class="media-video-card">
              <div class="placeholder-box small">${escapeHtml(cardLabel)} 썸네일</div>
              ${category ? `<span class="media-video-category">${escapeHtml(category)}</span>` : ''}
              <h3>${escapeHtml(cardLabel)} 최근 영상</h3>
              <p>영상 제목 / 날짜 / 짧은 설명이 들어가는 카드형 목록</p>
            </article>
          `;
  }).join('');
  const mediaSection = ({ id, eyebrow, title, summary, active, menu, categories = [], archiveRoute, categoryRoutes, featured = false }) => `
      <section id="${escapeHtml(id)}" class="panel media-section-panel">
        ${sectionTitle(eyebrow, title, summary)}
        ${sectionNavigator('', mediaNavItems, active, 'media', '말씀&찬양 섹션 이동')}
        ${menu ? renderMediaLineMenu(menu, { activeLabel: menu[0], routeMap: categoryRoutes }) : ''}
        ${featured ? `
          <div class="media-feature-layout media-feature-layout--single">
            <article class="media-feature-card">
              <div class="placeholder-box video">주일예배 영상 플레이어</div>
              <h3>${escapeHtml(source.featured.title)}</h3>
              <p>${escapeHtml(source.featured.bible)}</p>
              <span class="meta">${escapeHtml(source.featured.preacher)} · ${escapeHtml(source.featured.date)}</span>
            </article>
          </div>
          <div class="media-video-row">
            ${recentVideos('주일예배')}
          </div>
          <div class="button-row centered media-more-row">
            <a class="button button-secondary" href="${routeHref(archiveRoute)}">전체보기</a>
          </div>
        ` : `
          <div class="media-video-row">
            ${recentVideos(title.replace(' 최근 영상', ''), categories)}
          </div>
          <div class="button-row centered media-more-row">
            <a class="button button-secondary" href="${routeHref(archiveRoute)}">전체보기</a>
          </div>
        `}
      </section>
  `;
  const content = `
      <section id="section-media-intro" class="church-landing-hero panel media-hero-panel">
        <div class="church-landing-hero__media">말씀과 찬양 대표 이미지 영역</div>
        <div class="church-landing-hero__copy">
          <span class="eyebrow">SEC-01</span>
          <h2>말씀과 찬양으로 하나님을 만나는 시간입니다</h2>
          <div class="church-landing-hero__intro">
            <p>번동제일교회는 선포되는 말씀과<br>드려지는 찬양 안에서 하나님의 임재를 경험하는 공동체입니다.</p>
          </div>
        </div>
      </section>
      ${mediaSection({
        id: 'section-media-sunday',
        eyebrow: 'SEC-02',
        title: '주일예배',
        summary: '한 주간을 붙들고 살 말씀을 만나보세요.',
        active: 'section-media-sunday',
        archiveRoute: 'media/archive/sunday',
        featured: true,
      })}
      ${mediaSection({
        id: 'section-media-youth',
        eyebrow: 'SEC-03',
        title: '청년예배',
        summary: '청년들이 함께 드리는 주일 예배입니다.',
        active: 'section-media-youth',
        archiveRoute: 'media/archive/youth',
      })}
      ${mediaSection({
        id: 'section-media-praise',
        eyebrow: 'SEC-04',
        title: '찬양예배',
        summary: '찬양으로 함께 드리는 주일 오후 예배입니다.',
        active: 'section-media-praise',
        archiveRoute: 'media/archive/praise',
      })}
      ${mediaSection({
        id: 'section-media-prayer',
        eyebrow: 'SEC-05',
        title: '기도회',
        summary: '말씀과 기도로 한 주간을 준비하는 시간입니다.',
        active: 'section-media-prayer',
        menu: ['전체', '수요기도회', '금요기도회', '새벽기도회'],
        categories: ['수요기도회', '금요기도회', '새벽기도회'],
        archiveRoute: 'media/archive/prayer',
        categoryRoutes: MEDIA_ARCHIVE_CATEGORY_ROUTES.prayer,
      })}
      ${mediaSection({
        id: 'section-media-choir',
        eyebrow: 'SEC-06',
        title: '찬양대',
        summary: '하나님께 영광 돌리는 찬양대의 찬양입니다.',
        active: 'section-media-choir',
        menu: ['전체', '1부 브니엘', '2부 호산나', '3부 시온'],
        categories: ['1부 브니엘', '2부 호산나', '3부 시온'],
        archiveRoute: 'media/archive/choir',
        categoryRoutes: MEDIA_ARCHIVE_CATEGORY_ROUTES.choir,
      })}
      ${mediaSection({
        id: 'section-media-events',
        eyebrow: 'SEC-07',
        title: '집회 및 행사',
        summary: '특별한 은혜와 기쁨의 시간들입니다.',
        active: 'section-media-events',
        menu: ['전체', '집회', '행사', '기타'],
        categories: ['집회', '행사', '기타'],
        archiveRoute: 'media/archive/events',
        categoryRoutes: MEDIA_ARCHIVE_CATEGORY_ROUTES.events,
      })}
  `;
  return renderSubpageScaffold(routeKey, page, content);
}

function renderMediaArchivePage(routeKey) {
  const archiveMap = {
    'media/archive/sunday': {
      title: '주일예배',
      summary: '한 주간을 붙들고 살 말씀을 다시 확인하세요.',
      parent: 'media',
      categories: [],
    },
    'media/archive/youth': {
      title: '청년예배',
      summary: '청년들이 함께 드리는 예배 영상을 모았습니다.',
      parent: 'media/youth',
      categories: [],
    },
    'media/archive/praise': {
      title: '찬양예배',
      summary: '찬양으로 함께 드리는 주일 오후 예배를 확인하세요.',
      parent: 'media/praise',
      categories: [],
    },
    'media/archive/prayer': {
      title: '기도회',
      summary: '말씀과 기도로 한 주간을 준비하는 시간을 모았습니다.',
      parent: 'media/prayer',
      categories: ['전체', '수요기도회', '금요기도회', '새벽기도회'],
      routeMap: MEDIA_ARCHIVE_CATEGORY_ROUTES.prayer,
      activeCategory: '전체',
    },
    'media/archive/prayer/wednesday': {
      title: '기도회',
      summary: '수요기도회 영상을 모았습니다.',
      parent: 'media/prayer',
      categories: ['전체', '수요기도회', '금요기도회', '새벽기도회'],
      routeMap: MEDIA_ARCHIVE_CATEGORY_ROUTES.prayer,
      activeCategory: '수요기도회',
    },
    'media/archive/prayer/friday': {
      title: '기도회',
      summary: '금요기도회 영상을 모았습니다.',
      parent: 'media/prayer',
      categories: ['전체', '수요기도회', '금요기도회', '새벽기도회'],
      routeMap: MEDIA_ARCHIVE_CATEGORY_ROUTES.prayer,
      activeCategory: '금요기도회',
    },
    'media/archive/prayer/dawn': {
      title: '기도회',
      summary: '새벽기도회 영상을 모았습니다.',
      parent: 'media/prayer',
      categories: ['전체', '수요기도회', '금요기도회', '새벽기도회'],
      routeMap: MEDIA_ARCHIVE_CATEGORY_ROUTES.prayer,
      activeCategory: '새벽기도회',
    },
    'media/archive/choir': {
      title: '찬양대',
      summary: '하나님께 영광 돌리는 찬양대의 찬양입니다.',
      parent: 'media/choir',
      categories: ['전체', '1부 브니엘', '2부 호산나', '3부 시온'],
      routeMap: MEDIA_ARCHIVE_CATEGORY_ROUTES.choir,
      activeCategory: '전체',
    },
    'media/archive/choir/peniel': {
      title: '찬양대',
      summary: '1부 브니엘 찬양 영상을 모았습니다.',
      parent: 'media/choir',
      categories: ['전체', '1부 브니엘', '2부 호산나', '3부 시온'],
      routeMap: MEDIA_ARCHIVE_CATEGORY_ROUTES.choir,
      activeCategory: '1부 브니엘',
    },
    'media/archive/choir/hosanna': {
      title: '찬양대',
      summary: '2부 호산나 찬양 영상을 모았습니다.',
      parent: 'media/choir',
      categories: ['전체', '1부 브니엘', '2부 호산나', '3부 시온'],
      routeMap: MEDIA_ARCHIVE_CATEGORY_ROUTES.choir,
      activeCategory: '2부 호산나',
    },
    'media/archive/choir/zion': {
      title: '찬양대',
      summary: '3부 시온 찬양 영상을 모았습니다.',
      parent: 'media/choir',
      categories: ['전체', '1부 브니엘', '2부 호산나', '3부 시온'],
      routeMap: MEDIA_ARCHIVE_CATEGORY_ROUTES.choir,
      activeCategory: '3부 시온',
    },
    'media/archive/events': {
      title: '집회 및 행사',
      summary: '특별한 은혜와 기쁨의 시간들을 모았습니다.',
      parent: 'media/events',
      categories: ['전체', '집회', '행사', '기타'],
      routeMap: MEDIA_ARCHIVE_CATEGORY_ROUTES.events,
      activeCategory: '전체',
    },
    'media/archive/events/gathering': {
      title: '집회 및 행사',
      summary: '집회 영상을 모았습니다.',
      parent: 'media/events',
      categories: ['전체', '집회', '행사', '기타'],
      routeMap: MEDIA_ARCHIVE_CATEGORY_ROUTES.events,
      activeCategory: '집회',
    },
    'media/archive/events/event': {
      title: '집회 및 행사',
      summary: '행사 영상을 모았습니다.',
      parent: 'media/events',
      categories: ['전체', '집회', '행사', '기타'],
      routeMap: MEDIA_ARCHIVE_CATEGORY_ROUTES.events,
      activeCategory: '행사',
    },
    'media/archive/events/etc': {
      title: '집회 및 행사',
      summary: '기타 영상을 모았습니다.',
      parent: 'media/events',
      categories: ['전체', '집회', '행사', '기타'],
      routeMap: MEDIA_ARCHIVE_CATEGORY_ROUTES.events,
      activeCategory: '기타',
    },
  };
  const config = archiveMap[routeKey] || archiveMap['media/archive/sunday'];
  const page = {
    title: config.title,
    label: config.title,
    summary: config.summary,
  };
  const renderBoardSearch = () => `
    <form class="board-search" role="search" aria-label="${escapeHtml(config.title)} 검색">
      <select aria-label="검색 범위">
        <option>제목</option>
        <option>제목 + 본문</option>
      </select>
      <label>
        <span class="sr-only">${escapeHtml(config.title)} 검색어</span>
        <input type="search" placeholder="검색어를 입력하세요">
      </label>
      <button type="button">검색</button>
    </form>
  `;
  const renderPagination = () => `
    <div class="news-pagination" aria-label="${escapeHtml(config.title)} 페이지 이동">
      <span class="is-current">1</span>
      <a href="${routeHref(routeKey)}">2</a>
      <a href="${routeHref(routeKey)}">3</a>
      <a href="${routeHref(routeKey)}">4</a>
      <a href="${routeHref(routeKey)}">다음</a>
    </div>
  `;
  const categoryPool = config.categories.length
    ? (config.activeCategory && config.activeCategory !== '전체' ? [config.activeCategory] : config.categories.slice(1))
    : [config.title];
  const items = Array.from({ length: 12 }, (_, index) => {
    const category = categoryPool[index % categoryPool.length] || config.title;
    return {
      category,
      title: `${category} 영상 ${index + 1}`,
      date: `2026.${String(4 - Math.floor(index / 4)).padStart(2, '0')}.${String(20 - index).padStart(2, '0')}`,
    };
  });
  const content = `
      <section class="church-landing-hero panel media-hero-panel">
        <div class="church-landing-hero__media">${escapeHtml(config.title)} 대표 이미지 영역</div>
        <div class="church-landing-hero__copy">
          <span class="eyebrow">SEC-01</span>
          <span class="album-parent-label">말씀&찬양</span>
          <h2>${escapeHtml(config.title)}</h2>
          <div class="church-landing-hero__intro">
            <p>${escapeHtml(config.summary)}</p>
          </div>
        </div>
      </section>
      <section class="panel media-archive-panel album-board-panel--direct">
        ${config.categories.length ? `
          ${renderMediaLineMenu(config.categories, {
            activeLabel: config.activeCategory || config.categories[0],
            routeMap: config.routeMap,
            ariaLabel: `${config.title} 카테고리`,
          })}
        ` : ''}
        <div class="media-archive-grid">
          ${items.map((item) => `
            <article class="media-video-card media-archive-card">
              <div class="placeholder-box small">${escapeHtml(item.category)} 썸네일</div>
              ${config.categories.length ? `<span class="media-video-category">${escapeHtml(item.category)}</span>` : ''}
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.date)} / 영상 제목과 본문 요약이 들어가는 게시판 카드</p>
            </article>
          `).join('')}
        </div>
        ${renderBoardSearch()}
        ${renderPagination()}
      </section>
  `;
  return renderSubpageScaffold(routeKey, page, content);
}

function renderNewsLandingPage(activeRoute = 'news') {
  const source = data.pages.news;
  const page = getNavItem(activeRoute) || getNavItem('news');
  const bulletinItems = data.home.bulletinItems || [];
  const familyResources = source.resources.filter(([title]) => title.includes('가정예배'));
  const otherResources = source.resources.filter(([title]) => !title.includes('가정예배'));
  const renderBoardSearch = (label) => `
    <form class="board-search" role="search" aria-label="${escapeHtml(label)} 검색">
      <select aria-label="검색 범위">
        <option>제목</option>
        <option>제목 + 본문</option>
      </select>
      <label>
        <span class="sr-only">${escapeHtml(label)} 검색어</span>
        <input type="search" placeholder="검색어를 입력하세요">
      </label>
      <button type="button">검색</button>
    </form>
  `;
  const renderPagination = (label) => `
    <div class="news-pagination" aria-label="${escapeHtml(label)} 페이지 이동">
      <span class="is-current">1</span>
      <a href="${routeHref(activeRoute)}">2</a>
      <a href="${routeHref(activeRoute)}">3</a>
      <a href="${routeHref(activeRoute)}">4</a>
      <a href="${routeHref(activeRoute)}">다음</a>
    </div>
  `;
  const renderBoardRows = (items, options = {}) => `
    <ul class="news-board-list ${options.compact ? 'is-compact' : ''}">
      ${items.map((item) => {
        const title = Array.isArray(item) ? item[0] : item.title;
        const date = Array.isArray(item) ? item[1] : item.date;
        const thumb = options.thumbnail ? `
          <span class="news-board-thumb" aria-hidden="true">
            <span>1면</span>
            <span>2면</span>
          </span>
        ` : '';
        return `
          <li>
            <a class="${options.thumbnail ? 'has-thumb' : ''}" href="${routeHref(activeRoute)}">
              ${thumb}
              <span class="news-board-title">${escapeHtml(title)}</span>
              <time>${escapeHtml(date)}</time>
            </a>
          </li>
        `;
      }).join('')}
    </ul>
  `;
  const renderHero = (title, summary) => `
      <section class="church-landing-hero panel news-hero-panel">
        <div class="church-landing-hero__media">${escapeHtml(title)} 대표 이미지 영역</div>
        <div class="church-landing-hero__copy">
          <span class="eyebrow">SEC-01</span>
          <span class="album-parent-label">교회소식</span>
          <h2>${escapeHtml(title)}</h2>
          <div class="church-landing-hero__intro">
            <p>${escapeHtml(summary)}</p>
          </div>
        </div>
      </section>
  `;
  const renderBoardPage = (title, summary, items, label) => `
      ${renderHero(title, summary)}
      <section class="panel news-section-panel album-board-panel album-board-panel--direct">
        <article class="news-board-card">
          ${renderBoardRows(items)}
          ${renderBoardSearch(label)}
          ${renderPagination(label)}
        </article>
      </section>
  `;
  let content = '';
  if (activeRoute === 'news/bulletin') {
    content = `
      ${renderHero('주보', '금주 주보를 편하게 바로 확인하세요.')}
      <section class="panel news-section-panel album-board-panel album-board-panel--direct">
        <article class="news-board-card">
          ${renderBoardRows(bulletinItems, { thumbnail: true })}
          ${renderBoardSearch('주보')}
          ${renderPagination('주보')}
        </article>
      </section>
    `;
  } else if (activeRoute === 'news/family-worship') {
    content = renderBoardPage('가정예배 순서지', '가정에서 드리는 예배 순서지 입니다.', familyResources, '가정예배 순서지');
  } else if (activeRoute === 'news/resources') {
    content = renderBoardPage('자료실', '기타 교회 각종 자료들을 보실수 있습니다.', otherResources.length ? otherResources : source.resources, '자료실');
  } else {
    content = renderBoardPage('교회소식', '이번 주 일정과 안내를 확인하세요.', source.churchNews, '교회소식');
  }
  return renderSubpageScaffold(activeRoute, page, content);
}

function renderNewsSubMainPage(activeRoute = 'news') {
  const source = data.pages.news;
  const page = getNavItem(activeRoute) || getNavItem('news');
  const bulletinItems = data.home.bulletinItems || [];
  const albumItems = data.home.albumItems || [];
  const familyResources = source.resources.filter(([title]) => title.includes('가정예배'));
  const otherResources = source.resources.filter(([title]) => !title.includes('가정예배'));
  const newsNavItems = [
    ['section-news-board', '교회소식'],
    ['section-news-bulletin', '주보'],
    ['section-news-family', '가정예배 순서지'],
    ['section-news-album', '교회앨범'],
    ['section-news-resources', '기타 자료실'],
  ];
  const renderRows = (items, options = {}) => `
    <ul class="news-board-list ${options.compact ? 'is-compact' : ''}">
      ${items.map((item) => {
        const title = Array.isArray(item) ? item[0] : item.title;
        const date = Array.isArray(item) ? item[1] : item.date;
        const thumb = options.thumbnail ? `
          <span class="news-board-thumb" aria-hidden="true">
            <span>1면</span>
            <span>2면</span>
          </span>
        ` : '';
        return `
          <li>
            <a class="${options.thumbnail ? 'has-thumb' : ''}" href="${routeHref(options.href || 'news')}">
              ${thumb}
              <span class="news-board-title">${escapeHtml(title)}</span>
              <time>${escapeHtml(date)}</time>
            </a>
          </li>
        `;
      }).join('')}
    </ul>
  `;
  const content = `
      <section id="section-news-intro" class="church-landing-hero panel news-hero-panel">
        <div class="church-landing-hero__media">교회소식 대표 이미지 영역</div>
        <div class="church-landing-hero__copy">
          <span class="eyebrow">SEC-01</span>
          <h2>교회 소식</h2>
          <div class="church-landing-hero__intro">
            <p>이번 주 꼭 확인하실 소식을 모았습니다.</p>
          </div>
        </div>
      </section>
      <section id="section-news-board" class="panel news-section-panel">
        ${sectionTitle('SEC-02', '교회소식', '이번 주 일정과 안내를 확인하세요.')}
        ${sectionNavigator('', newsNavItems, 'section-news-board', 'news', '교회소식 섹션 이동')}
        <article class="news-board-card">
          ${renderRows(source.churchNews)}
          <div class="button-row centered news-more-row">
            <a class="button button-secondary" href="${routeHref('news/board')}">전체보기</a>
          </div>
        </article>
      </section>
      <section id="section-news-bulletin" class="panel news-section-panel">
        ${sectionTitle('SEC-03', '주보', '금주 주보를 편하게 바로 확인하세요.')}
        ${sectionNavigator('', newsNavItems, 'section-news-bulletin', 'news', '교회소식 섹션 이동')}
        <article class="news-board-card">
          ${renderRows(bulletinItems, { thumbnail: true, href: 'news/bulletin' })}
          <div class="button-row centered news-more-row">
            <a class="button button-secondary" href="${routeHref('news/bulletin')}">전체보기</a>
          </div>
        </article>
      </section>
      <section id="section-news-family" class="panel news-section-panel">
        ${sectionTitle('SEC-04', '가정예배 순서지', '가정에서 드리는 예배 순서지 입니다.')}
        ${sectionNavigator('', newsNavItems, 'section-news-family', 'news', '교회소식 섹션 이동')}
        <article class="news-board-card">
          ${renderRows(familyResources)}
          <div class="button-row centered news-more-row">
            <a class="button button-secondary" href="${routeHref('news/family-worship')}">전체보기</a>
          </div>
        </article>
      </section>
      <section id="section-news-album" class="panel news-section-panel">
        ${sectionTitle('SEC-05', '교회앨범', '번동제일교회의 소중한 순간들을 함께 나눕니다.')}
        ${sectionNavigator('', newsNavItems, 'section-news-album', 'news', '교회소식 섹션 이동')}
        <div class="media-line-menu news-album-menu" aria-label="교회앨범 카테고리">
          ${ALBUM_CATEGORIES.map((item, index) => `<a class="${index === 0 ? 'is-active' : ''}" href="${routeHref(albumCategoryRoute(item))}">${escapeHtml(item)}</a>`).join('')}
        </div>
        <div class="news-album-grid">
          ${albumItems.slice(0, 6).map((item) => `
            <article class="news-album-card">
              <div class="placeholder-box small">사진</div>
              <h3>${escapeHtml(item.title)}</h3>
              <span class="meta">${escapeHtml(item.date)}</span>
            </article>
          `).join('')}
        </div>
        <div class="button-row centered news-more-row">
          <a class="button button-secondary" href="${routeHref('news/album')}">전체보기</a>
        </div>
      </section>
      <section id="section-news-resources" class="panel news-section-panel">
        ${sectionTitle('SEC-06', '자료실', '기타 교회 각종 자료들을 보실수 있습니다.')}
        ${sectionNavigator('', newsNavItems, 'section-news-resources', 'news', '교회소식 섹션 이동')}
        <article class="news-board-card">
          ${renderRows(otherResources.length ? otherResources : source.resources)}
          <div class="button-row centered news-more-row">
            <a class="button button-secondary" href="${routeHref('news/resources')}">전체보기</a>
          </div>
        </article>
      </section>
  `;
  return renderSubpageScaffold(activeRoute, page, content);
}

function renderNewsBoardPage() {
  return renderNewsSubMainPage('news');
}

function renderNewsBoardArchivePage() {
  return renderNewsLandingPage('news/board');
}

function renderBulletinPage() {
  return renderNewsLandingPage('news/bulletin');
}

function renderFamilyWorshipPage() {
  return renderNewsLandingPage('news/family-worship');
}

function renderResourcesPage() {
  return renderNewsLandingPage('news/resources');
}

function renderRouteDraft(key) {
  if (String(key || '').startsWith('news/album/category/') || String(key || '').startsWith('album/category/')) {
    return renderAlbum(key);
  }
  switch (key) {
    case 'home':
      return renderHome();
    case 'church':
      return renderChurchIdentityPage();
    case 'church/history':
      return renderChurchHistoryPage();
    case 'church/facility':
      return renderChurchFacilityPage();
    case 'church/organization':
      return renderChurchOrganizationPage();
    case 'church/staff':
      return renderChurchStaffPage();
    case 'church/directions':
      return renderChurchDirectionsPage();
    case 'newcomers':
      return renderNewcomerGreetingPage(key);
    case 'newcomers/greeting':
    case 'newcomers/registration':
    case 'newcomers/education':
    case 'newcomers/helper':
    case 'newcomers/welcome-party':
    case 'newcomers/weekly-family':
      pendingScrollTarget = getLandingScrollTarget(key);
      return renderNewcomerGreetingPage(key);
    case 'worship':
      return renderWorshipTimesPage();
    case 'worship/school':
      pendingScrollTarget = getLandingScrollTarget(key);
      return renderWorshipTimesPage('worship/school');
    case 'worship/shuttle':
      pendingScrollTarget = getLandingScrollTarget(key);
      return renderWorshipShuttlePage();
    case 'media/archive/sunday':
    case 'media/archive/youth':
    case 'media/archive/praise':
    case 'media/archive/prayer':
    case 'media/archive/prayer/wednesday':
    case 'media/archive/prayer/friday':
    case 'media/archive/prayer/dawn':
    case 'media/archive/choir':
    case 'media/archive/choir/peniel':
    case 'media/archive/choir/hosanna':
    case 'media/archive/choir/zion':
    case 'media/archive/events':
    case 'media/archive/events/gathering':
    case 'media/archive/events/event':
    case 'media/archive/events/etc':
      return renderMediaArchivePage(key);
    case 'media':
    case 'media/youth':
    case 'media/praise':
    case 'media/prayer':
    case 'media/choir':
    case 'media/events':
      pendingScrollTarget = getLandingScrollTarget(key);
      return renderMediaCategoryPage(key);
    case 'media/wednesday':
    case 'media/friday':
      pendingScrollTarget = 'section-media-prayer';
      return renderMediaCategoryPage(key);
    case 'news':
      return renderNewsBoardPage();
    case 'news/board':
      return renderNewsBoardArchivePage();
    case 'news/bulletin':
      return renderBulletinPage();
    case 'news/family-worship':
      return renderFamilyWorshipPage();
    case 'news/album':
      return renderAlbum('news/album');
    case 'news/resources':
      return renderResourcesPage();
    case 'album':
      return renderAlbum();
    case 'anniversary':
      return renderAnniversaryPage();
    case 'memorial':
      return renderMemorialPage();
    case 'policy':
      return renderSimplePage(key);
    default:
      return renderNotFound();
  }
}

function renderNotFound() {
  return `
    <main class="inner page-shell">
      <section class="panel page-hero">
        <span class="eyebrow">404</span>
        <h1>해당 프로토타입 페이지를 찾을 수 없습니다.</h1>
        <p>메인 페이지로 돌아가 새 IA 기준의 전체 구조를 확인해주세요.</p>
        <a class="button" href="${routeHref('home')}">메인으로 이동</a>
      </section>
    </main>
  `;
}

function renderRouteLegacy(key) {
  switch (key) {
    case 'home':
      return renderHome();
    case 'church':
      return renderChurch();
    case 'newcomers':
      return renderNewcomers();
    case 'worship':
      return renderWorship();
    case 'media':
      return renderMedia();
    case 'news':
      return renderNews();
    case 'album':
      return renderAlbum();
    case 'anniversary':
      return renderAnniversaryPage();
    case 'memorial':
      return renderMemorialPage();
    case 'policy':
      return renderSimplePage(key);
    default:
      return renderNotFound();
  }
}

function bindUi() {
  const menuToggles = [...document.querySelectorAll('.menu-toggle, .mobile-menu-fab')];
  const menuToggle = menuToggles[0];
  const nav = document.getElementById('main-nav');
  const header = document.querySelector('.site-header');
  const mega = document.querySelector('.mega-menu');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileCloseTriggers = document.querySelectorAll('[data-mobile-close]');
  const setMobileMenu = (open) => {
    if (!menuToggle || !mobileDrawer || !mobileOverlay) {
      return;
    }
    menuToggles.forEach((toggle) => {
      toggle.setAttribute('aria-expanded', String(open));
    });
    mobileDrawer.setAttribute('aria-hidden', String(!open));
    mobileDrawer.classList.toggle('is-open', open);
    mobileOverlay.hidden = !open;
    mobileOverlay.classList.toggle('is-open', open);
    document.body.classList.toggle('is-mobile-menu-open', open);
  };

  if (menuToggles.length && mobileDrawer) {
    menuToggles.forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        setMobileMenu(!expanded);
      });
    });
    mobileCloseTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => setMobileMenu(false));
    });
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMobileMenu(false));
    });
  }

  if (header && nav && mega) {
    const navLinks = [...document.querySelectorAll('.main-nav__link[data-nav-key]')];
    const menuCols = [...document.querySelectorAll('.mega-menu__col[data-nav-key]')];

    const setActiveMega = (key) => {
      menuCols.forEach((col) => {
        col.classList.toggle('is-emphasis', col.dataset.navKey === key);
        col.classList.toggle('is-dimmed', key && col.dataset.navKey !== key);
      });
      navLinks.forEach((link) => {
        link.classList.toggle('is-hovered', link.dataset.navKey === key);
      });
    };

    const openMega = (key) => {
      header.classList.add('is-mega-open');
      if (key) {
        setActiveMega(key);
      }
    };

    const closeMega = () => {
      header.classList.remove('is-mega-open');
      setActiveMega('');
    };

    navLinks.forEach((link) => {
      const key = link.dataset.navKey || '';
      link.addEventListener('mouseenter', () => openMega(key));
      link.addEventListener('focus', () => openMega(key));
    });

    mega.addEventListener('mouseenter', () => {
      header.classList.add('is-mega-open');
    });

    header.addEventListener('mouseleave', closeMega);

    header.addEventListener('focusout', () => {
      window.setTimeout(() => {
        if (!header.contains(document.activeElement)) {
          closeMega();
        }
      }, 0);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMega();
        setMobileMenu(false);
      }
    });
  }

  document.querySelectorAll('[data-hero-index]').forEach((button) => {
    button.addEventListener('click', () => {
      heroIndex = Number(button.dataset.heroIndex) || 0;
      render();
    });
  });

  document.querySelectorAll('[data-scroll-target]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.dataset.scrollTarget;
      if (!targetId) {
        return;
      }
      event.preventDefault();
      const target = document.getElementById(targetId);
      const nextHash = link.getAttribute('href') || '';
      if (!target) {
        pendingScrollTarget = targetId;
        if (nextHash && nextHash !== window.location.hash) {
          window.location.hash = nextHash.replace(/^#/, '');
        } else {
          window.setTimeout(scrollToPendingTarget, 0);
        }
        return;
      }
      if (nextHash && nextHash !== window.location.hash) {
        window.history.pushState(null, '', nextHash);
        document.querySelectorAll(`a[href="${nextHash}"]`).forEach((currentLink) => currentLink.classList.add('is-current'));
        document.querySelectorAll('.subpage-line-tabs a.is-current').forEach((currentLink) => {
          if (currentLink.getAttribute('href') !== nextHash) {
            currentLink.classList.remove('is-current');
          }
        });
      }
      if (target) {
        pendingScrollTarget = targetId;
        window.setTimeout(scrollToPendingTarget, 0);
        return;
      }
    });
  });
}

function scrollToTargetId(targetId, behavior = 'smooth') {
  if (!targetId) {
    return;
  }
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }
  const headerOffset = (document.querySelector('.site-header')?.offsetHeight || 0) + 14;
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top, behavior });
}

function scrollToPendingTarget(behavior = 'smooth') {
  if (!pendingScrollTarget) {
    return;
  }
  const targetId = pendingScrollTarget;
  pendingScrollTarget = null;
  scrollToTargetId(targetId, behavior);
}

function schedulePendingScroll(behavior = 'smooth') {
  if (!pendingScrollTarget) {
    return;
  }
  const targetId = pendingScrollTarget;
  pendingScrollTarget = null;
  const run = () => scrollToTargetId(targetId, behavior);
  window.requestAnimationFrame(run);
  window.setTimeout(run, 120);
  window.setTimeout(run, 360);
}


function startHeroTimer(activeKey) {
  window.clearInterval(heroTimer);
  if (activeKey !== 'home') {
    return;
  }
  heroTimer = window.setInterval(() => {
    heroIndex = (heroIndex + 1) % data.home.heroSlides.length;
    render();
  }, 5000);
}

function renderLegacy() {
  const key = routeKey();
  const activeKey = data.mainNav.some((item) => item.key === key) ? key : 'home';
  app.innerHTML = `
    ${renderHeader(activeKey)}
    ${renderRoute(key)}
    ${renderFooter()}
  `;
  document.title = key === 'home' ? data.project.title : `${(data.pages[key] || {}).title || '프로토타입'} | ${data.project.title}`;
  bindUi();
  startHeroTimer(key);
  const directTarget = getLandingScrollTarget(key);
  if (!pendingScrollTarget && directTarget && key !== getLandingBaseRoute(key)) {
    pendingScrollTarget = directTarget;
  }
  window.setTimeout(scrollToPendingTarget, 0);
}

function renderRoute(key) {
  if (String(key || '').startsWith('news/album/category/') || String(key || '').startsWith('album/category/')) {
    return renderAlbum(key);
  }
  switch (key) {
    case 'home':
      return renderHome();
    case 'church':
      return renderChurchIdentityPage();
    case 'church/history':
      return renderChurchHistoryPage();
    case 'church/facility':
      return renderChurchFacilityPage();
    case 'church/organization':
      return renderChurchOrganizationPage();
    case 'church/staff':
      return renderChurchStaffPage();
    case 'church/directions':
      return renderChurchDirectionsPage();
    case 'newcomers':
      return renderNewcomerGreetingPage(key);
    case 'newcomers/greeting':
    case 'newcomers/registration':
    case 'newcomers/education':
    case 'newcomers/helper':
    case 'newcomers/welcome-party':
    case 'newcomers/weekly-family':
      pendingScrollTarget = getLandingScrollTarget(key);
      return renderNewcomerGreetingPage(key);
    case 'worship':
      return renderWorshipTimesPage();
    case 'worship/school':
      pendingScrollTarget = getLandingScrollTarget(key);
      return renderWorshipTimesPage('worship/school');
    case 'worship/shuttle':
      pendingScrollTarget = getLandingScrollTarget(key);
      return renderWorshipShuttlePage();
    case 'media/archive/sunday':
    case 'media/archive/youth':
    case 'media/archive/praise':
    case 'media/archive/prayer':
    case 'media/archive/prayer/wednesday':
    case 'media/archive/prayer/friday':
    case 'media/archive/prayer/dawn':
    case 'media/archive/choir':
    case 'media/archive/choir/peniel':
    case 'media/archive/choir/hosanna':
    case 'media/archive/choir/zion':
    case 'media/archive/events':
    case 'media/archive/events/gathering':
    case 'media/archive/events/event':
    case 'media/archive/events/etc':
      return renderMediaArchivePage(key);
    case 'media':
    case 'media/youth':
    case 'media/praise':
    case 'media/prayer':
    case 'media/choir':
    case 'media/events':
      pendingScrollTarget = getLandingScrollTarget(key);
      return renderMediaCategoryPage(key);
    case 'media/wednesday':
    case 'media/friday':
      pendingScrollTarget = 'section-media-prayer';
      return renderMediaCategoryPage(key);
    case 'news':
      return renderNewsBoardPage();
    case 'news/board':
      return renderNewsBoardArchivePage();
    case 'news/bulletin':
      return renderBulletinPage();
    case 'news/family-worship':
      return renderFamilyWorshipPage();
    case 'news/album':
      return renderAlbum('news/album');
    case 'news/resources':
      return renderResourcesPage();
    case 'album':
      return renderAlbum();
    case 'anniversary':
      return renderAnniversaryPage();
    case 'memorial':
      return renderMemorialPage();
    case 'policy':
      return renderSimplePage(key);
    default:
      return renderNotFound();
  }
}

function render() {
  const key = routeKey();
  const previousKey = lastRenderedRoute;
  const activeKey = getNavGroup(key)?.key || 'home';
  app.innerHTML = `
    ${renderHeader(activeKey)}
    ${renderRoute(key)}
    ${renderFooter()}
  `;
  document.title = key === 'home' ? data.project.title : `${getPageTitle(key)} | ${data.project.title}`;
  bindUi();
  startHeroTimer(key);
  const directTarget = getLandingScrollTarget(key);
  if (!pendingScrollTarget && directTarget && key !== getLandingBaseRoute(key)) {
    pendingScrollTarget = directTarget;
  }
  if (pendingScrollTarget) {
    schedulePendingScroll('auto');
  } else if (previousKey && previousKey !== key) {
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 0);
  }
  lastRenderedRoute = key;
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);

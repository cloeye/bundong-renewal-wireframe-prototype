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
    items: ['우리교회는', '걸어온길', '시설안내', '교구조직', '섬기는 사람들', '오시는 길'],
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
    items: ['교회소식', '주보', '자료실'],
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
      { route: 'church/history', label: '걸어온길', summary: '1964년 천막 예배에서 창립 60주년까지 이어진 교회의 걸음을 확인하는 화면입니다.' },
      { route: 'church/facility', label: '시설안내', summary: '본관과 선교교육관의 주요 공간과 예배 동선을 안내하는 화면입니다.' },
      { route: 'church/organization', label: '교구조직', summary: '교회 조직과 교구 편성, 사역 연결 구조를 안내하는 화면입니다.' },
      { route: 'church/staff', label: '섬기는 사람들', summary: '담임목사와 교역자, 부서 담당자 정보를 표 형태로 정리한 화면입니다.' },
      { route: 'church/directions', label: '오시는 길', summary: '주소, 교통, 주차와 지도 영역을 중심으로 방문 정보를 제공하는 화면입니다.' },
    ],
  },
  {
    key: 'newcomers',
    label: '처음오셨나요',
    items: [
      { route: 'newcomers', label: '담임목사 인사말', summary: '처음 방문한 분들에게 교회의 분위기와 환영 메시지를 전하는 인사말 화면입니다.' },
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
      { route: 'worship/shuttle', label: '차량운행안내', summary: '차량 코스와 탑승 안내를 중심으로 구성한 안내형 화면입니다.' },
    ],
  },
  {
    key: 'media',
    label: '말씀&찬양',
    items: [
      { route: 'media', label: '주일예배', summary: '주일예배 영상과 설교 요약을 중심으로 한 대표 미디어 화면입니다.' },
      { route: 'media/wednesday', label: '수요예배', summary: '수요예배 영상과 최근 말씀 목록을 보여주는 화면입니다.' },
      { route: 'media/praise', label: '오후찬양예배', summary: '오후찬양예배 영상과 찬양 중심 콘텐츠를 배치한 화면입니다.' },
      { route: 'media/youth', label: '청년예배', summary: '청년예배 영상, 모임 안내, 관련 콘텐츠를 묶어 보여주는 화면입니다.' },
      { route: 'media/friday', label: '금요저녁예배', summary: '금요저녁예배 영상 아카이브와 최근 업로드를 정리한 화면입니다.' },
    ],
  },
  {
    key: 'news',
    label: '교회소식',
    items: [
      { route: 'news', label: '교회소식', summary: '공지사항과 주간 소식을 최신순으로 정리한 게시판형 화면입니다.' },
      { route: 'news/bulletin', label: '주보', summary: '최신 주보를 미리보기와 목록으로 확인할 수 있는 화면입니다.' },
      { route: 'news/resources', label: '자료실', summary: '가정예배 순서지와 공고 자료 등 자료형 게시물을 모아두는 화면입니다.' },
    ],
  },
];


const LANDING_SCROLL_TARGETS = {
  worship: {
    worship: 'section-worship-times',
    'worship/shuttle': 'section-worship-shuttle',
  },
  newcomers: {
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

function renderSubpageSecondMenuItem(item, activeKey) {
  const target = getLandingScrollTarget(item.route);
  const scrollAttr = target ? ` data-scroll-target="${escapeHtml(target)}"` : '';
  const scrollClass = target ? ' is-scroll-link' : '';
  return `
                  <a class="${item.route === activeKey ? 'is-current' : ''}${scrollClass}" href="${routeHref(item.route)}"${scrollAttr}>
                    ${escapeHtml(item.label)}
                  </a>
                `;
}

function renderSubpageTopTabs(groupLabel, subNavItems, activeKey) {
  if (!subNavItems || subNavItems.length < 2) return '';
  return `
      <nav class="subpage-line-tabs" aria-label="${escapeHtml(groupLabel)} 하위 메뉴">
        <div class="subpage-line-tabs__inner">
          ${subNavItems.map((item) => renderSubpageSecondMenuItem(item, activeKey)).join('')}
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

function getGroupKey(key) {
  return String(key || '').split('/')[0] || '';
}

function getNavGroup(key) {
  const route = String(key || '');
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
  return group.items.find((item) => item.route === key) || group.items[0] || null;
}

function sectionIdForRoute(route) {
  return ;
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
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav">메뉴</button>
        <nav id="main-nav" class="main-nav">
          ${renderMainNav(activeKey)}
        </nav>
      </div>
      ${renderMegaMenu()}
    </header>
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
            <a class="button button-secondary" href="${routeHref('church')}">번동제일교회는 더 보기</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderWorshipSummary() {
  return `
    <section class="home-worship home-feature-panel home-feature-panel--worship">
      <div class="inner">
        ${renderHomeSectionLabel('05', '예배안내')}
        ${renderHomeSectionHead('예배안내', '모이기를 힘쓰는 행복한 교회입니다.')}
        <div class="home-worship__grid">
          ${data.home.worshipCards
            .map(
              (item) => `
                <article class="card home-worship__card">
                  <div class="home-worship__media" aria-hidden="true">
                    <span>예배 사진 영역</span>
                  </div>
                  <h3>${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.detail)}</p>
                  <span class="meta">${escapeHtml(item.place)}</span>
                </article>
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
  const albumCategories = ['전체', '세례예식', '행사/집회', '예배찬양', '교회학교', '국내선교', '해외선교', '사회봉사', '기타사진'];

  return `
    <section class="home-album">
      <div class="inner">
        ${renderHomeSectionLabel('07', '교회 앨범')}
        ${renderHomeSectionHead('예배와 사랑, 일상이 되는 순간들', '살아 있는 우리 교회의 모습')}
        <div class="home-album__categories" aria-label="교회 앨범 카테고리">
          ${albumCategories
            .map(
              (item, index) => `
                <span class="home-album__category ${index === 0 ? 'is-active' : ''}">
                  ${index === 0 ? '<span class="home-album__check">✓</span>' : ''}
                  ${escapeHtml(item)}
                </span>
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
  return `
    <section class="home-sermons">
      <div class="inner">
        ${renderHomeSectionLabel('08', '말씀과 찬양')}
        ${renderHomeSectionHead('주일의 말씀, 삶으로 이어지도록', '한 주간의 생명의 말씀들')}
        <div class="home-sermons__main">
          <div class="placeholder-box video home-sermons__video">주일예배 영상 플레이어</div>
          <article class="card home-sermons__info">
            <h3>지난주 말씀</h3>
            <h4>${escapeHtml(sermon.title)}</h4>
            <p>성경본문: ${escapeHtml(sermon.bible)}<br>설교자: ${escapeHtml(sermon.preacher)}<br>날짜: ${escapeHtml(sermon.date)}</p>
            <div class="callout">
              <p>${escapeHtml(sermon.quote)}</p>
            </div>
          </article>
        </div>
        <div class="home-sermons__subgrid">
          ${data.home.mediaSubVideos
            .map(
              (item) => `
                <article class="card home-sermons__subitem">
                  <div class="placeholder-box small">보조 예배 영상</div>
                  <h3>${escapeHtml(item)}</h3>
                </article>
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
            <h2>주보와 순서지</h2>
            <p>금주 주보와 가정예배 순서지</p>
            <div class="placeholder-box medium home-news__bulletin">주보 PDF 미리보기</div>
            <div class="home-news__bulletin-title">${bulletin ? escapeHtml(bulletin.title) : '최신 주보'}</div>
            <div class="home-center">
              <a class="button button-secondary" href="${routeHref('news')}">주보 / 자료실 보기</a>
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
          <a class="button button-secondary" href="${routeHref('church')}">상세 시설안내 보기</a>
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
        ${sectionTitle('Organization', '교구조직 / 부서조직')}
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
  const page = data.pages.news;
  const content = `
      <section class="panel">
        ${sectionTitle('News Board', '교회소식')}
        <ul class="feed-list large">
          ${page.churchNews
            .map((item) => `<li><span>${escapeHtml(item[0])}</span><time>${escapeHtml(item[1])}</time></li>`)
            .join('')}
        </ul>
      </section>
      <section class="panel">
        ${sectionTitle('Resources', '주보 / 자료실')}
        <div class="grid grid-2">
          <article class="card">
            <div class="placeholder-box tall">최신 주보 PDF 미리보기</div>
            <p>최신 주보를 메인과 서브에서 바로 열 수 있도록 뷰어형 카드 배치</p>
          </article>
          <article class="card">
            <h3>최근 자료</h3>
            <ul class="feed-list">
              ${page.resources
                .map((item) => `<li><span>${escapeHtml(item[0])}</span><time>${escapeHtml(item[1])}</time></li>`)
                .join('')}
            </ul>
          </article>
        </div>
      </section>
  `;
  return renderSubpageScaffold('news', page, content);
}

function renderAlbum() {
  const page = data.pages.album;
  const content = `
      <section class="panel">
        ${sectionTitle('Gallery', '최근 앨범')}
        <div class="grid grid-4">
          ${page.items
            .map(
              (item) => `
                <article class="card">
                  <div class="placeholder-box small">대표 이미지</div>
                  <h3>${escapeHtml(item[0])}</h3>
                  <span class="meta">${escapeHtml(item[1])}</span>
                </article>
              `
            )
            .join('')}
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Archive', '영상 / 추가 아카이브')}
        <div class="grid grid-2">
          <article class="card">
            <div class="placeholder-box medium">행사 사진 모음</div>
            <p>절기, 행사, 친교, 교육 사진을 카테고리별로 탐색</p>
          </article>
          <article class="card">
            <div class="placeholder-box medium">동영상 게시판 / 영상 아카이브</div>
            <p>필요 시 동영상게시판을 앨범 보조 탭으로 연결</p>
          </article>
        </div>
      </section>
  `;
  return renderSubpageScaffold('album', page, content);
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
  const groupKey = getGroupKey(key);
  const navGroup = getNavGroup(key);
  const navItem = getNavItem(key);
  const pageTitle = page.title || page.label;
  const pageSummary = page.summary || '';
  const meta = SUBPAGE_META[groupKey] || SUBPAGE_META[key] || {
    group: pageTitle,
    hero: '대표 이미지',
  };
  const currentGroupLabel = navGroup ? navGroup.label : meta.group;
  const currentItemLabel = navItem ? navItem.label : pageTitle;
  const subNavItems = navGroup ? navGroup.items : [{ route: key, label: pageTitle }];

  return `
    <main class="inner page-shell">
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
                  ${subNavItems.map((item) => renderSubpageSecondMenuItem(item, key)).join('')}
                </div>
              </details>
            `}
          </div>
          <p>${escapeHtml(pageSummary)}</p>
        </div>
        <div class="placeholder-box subpage-hero__media">${escapeHtml(meta.hero)}</div>
      </section>
      ${renderSubpageTopTabs(currentGroupLabel, subNavItems, key)}
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
  const content = `
      <section id="section-church" class="church-landing-hero panel church-about-hero">
        <div class="church-landing-hero__media">교회 외관 또는 예배 사진 영역</div>
        <div class="church-landing-hero__copy">
          <span class="eyebrow">SEC-01 우리교회 소개</span>
          <h2>함께 행복을 만들어가는<br>번동제일교회</h2>
          <div class="church-landing-hero__intro">
            <p class="church-landing-hero__lead">번동제일교회는 대한예수교장로회(통합)에 속한 하나님께서 주시는 참된 복과 행복을 나누는 공동체입니다.</p>
            <p>우리는 세상의 명예나 부요함이 아닌, 오직 하나님의 말씀을 즐거워하며 주야로 묵상하는 삶 속에서 진정한 행복을 찾습니다.</p>
          </div>
        </div>
      </section>
      <section class="panel church-core-section church-slogan-section">
        ${sectionTitle('SEC-02 우리교회 핵심가치', '우리교회 핵심가치')}
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
      <section class="panel church-pastoral-note-section">
        ${sectionTitle('SEC-03 환영의 말씀', '환영의 말씀')}
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
      <section class="panel church-invitation-section">
        ${sectionTitle('SEC-04 초대합니다', '초대합니다')}
        <div class="church-invitation-card">
          <h3>하나님의 자녀로 살아가는 기쁨을 누리고 싶으신 모든 분들을 번동제일교회로 초대합니다.</h3>
          <p>우리 함께 지금보다 더 행복한 신앙 생활을 시작해 봅시다!</p>
        </div>
      </section>
      <section class="panel church-logo-section">
        ${sectionTitle('SEC-05 번동제일교회 로고', '번동제일교회 로고')}
        <div class="church-logo-grid">
          <article class="church-logo-card">
            <div class="placeholder-box medium">심벌 / 로고 이미지 영역</div>
            <h3>심벌 의미</h3>
            <p>추후 확정될 심벌 설명 문구가 들어가는 blank 영역입니다.</p>
          </article>
          <article class="church-logo-card">
            <div class="placeholder-box medium">시그니처 / 조합형 영역</div>
            <h3>로고 사용 안내</h3>
            <p>국문, 영문, 약식 로고와 사용 규칙을 정리하는 blank 영역입니다.</p>
          </article>
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
  const content = `
      <section class="panel staff-clean-hero">
        ${sectionTitle('Leadership', '섬기는 사람들', '번동제일교회를 섬기는 교역자, 장로, 직원의 위계를 한눈에 확인할 수 있도록 정리했습니다.')}
        <nav class="staff-clean-tabs" aria-label="섬기는 사람들 섹션 이동">
          <a href="#/church/staff" data-scroll-target="staff-section-pastors">교역자</a>
          <a href="#/church/staff" data-scroll-target="staff-section-elders">원로, 은퇴장로</a>
          <a href="#/church/staff" data-scroll-target="staff-section-serving-elders">시무장로</a>
          <a href="#/church/staff" data-scroll-target="staff-section-office">교회직원</a>
        </nav>
      </section>
      <section id="staff-section-pastors" class="panel staff-clean-section">
        ${sectionTitle('Pastors', '교역자')}
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
        ${sectionTitle('Elders', '원로, 은퇴장로')}
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
        ${sectionTitle('Serving Elders', '시무장로')}
        <div class="staff-clean-grid is-many">
          ${activeElders.map((name) => personFromName(name, '시무장로')).join('')}
        </div>
      </section>
      <section id="staff-section-office" class="panel staff-clean-section">
        ${sectionTitle('Office', '교회직원')}
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
  const content = `
      <section class="panel facility-intro-panel">
        ${sectionTitle('Facility', '시설안내', '처음 방문하시는 분도 예배와 모임 공간을 쉽게 찾을 수 있도록 주요 공간을 정리합니다.')}
        <div class="facility-hero-grid">
          <div class="placeholder-box tall">본관 외관 대표 사진</div>
          <div class="placeholder-box tall">선교교육관 대표 사진</div>
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Buildings', '공간별 안내')}
        <div class="facility-stack">
          ${source.facilities.map((item, index) => `
            <article class="card facility-overview">
              <div class="placeholder-box facility-overview__media">${escapeHtml(item.title)} 사진 / 조감도</div>
              <div class="facility-overview__body">
                <span class="eyebrow">${index === 0 ? 'Main Building' : 'Education Center'}</span>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${index === 0 ? '주일예배, 행정, 교제와 본당 중심의 교회 메인 공간입니다.' : '교회학교와 교육, 새가족 과정, 소그룹 모임을 위한 교육 중심 공간입니다.'}</p>
                <div class="facility-floor-list">
                  ${item.floors.map((floor) => {
                    const [level, ...rest] = floor.split(' ');
                    return `
                      <div class="facility-floor-item">
                        <strong>${escapeHtml(level)}</strong>
                        <span>${escapeHtml(rest.join(' '))}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Guide', '처음 방문자를 위한 동선')}
        <div class="grid grid-3">
          <article class="card">
            <div class="placeholder-box small">예배 동선 사진</div>
            <h3>예배실 찾기</h3>
            <p>본당, 교육부서 예배실, 청년예배 공간을 목적별로 빠르게 확인합니다.</p>
          </article>
          <article class="card">
            <div class="placeholder-box small">안내 데스크 사진</div>
            <h3>문의와 안내</h3>
            <p>새가족 안내, 사무실, 카페 등 처음 방문자가 찾는 공간을 묶어 안내합니다.</p>
          </article>
          <article class="card">
            <div class="placeholder-box small">주차 / 출입구 사진</div>
            <h3>주차와 출입</h3>
            <p>주차장, 출입구, 엘리베이터 동선을 오시는 길 페이지와 연결합니다.</p>
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
  const content = `
      <section class="church-landing-hero panel history-hero-panel">
        <div class="church-landing-hero__media">역사 대표 사진 영역</div>
        <div class="church-landing-hero__copy">
          <span class="eyebrow">SEC-01 60년의 걸음</span>
          <h2>한 천막에서 시작된 예배가 오늘의 교회가 되기까지</h2>
          <div class="church-landing-hero__intro">
            <p>1964년부터 오늘까지, 번동제일교회가 같은 자리에서 걸어온 믿음의 시간입니다.</p>
          </div>
        </div>
      </section>
      <section class="panel history-story-panel">
        <div class="section-head section-head-center">
          <div>
            <span class="eyebrow">SEC-02 걸어온 시간</span>
            <h2>하나님이 이끄신 시간</h2>
          </div>
        </div>
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
      <section class="panel church-vision-section history-vision-section">
        <div class="section-head section-head-center">
          <div>
            <span class="eyebrow">SEC-03 60주년의 감사</span>
            <h2>60주년의 감사</h2>
          </div>
        </div>
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
      <section class="panel history-archive-panel">
        <div class="section-head section-head-center">
          <div>
            <span class="eyebrow">SEC-04 기억의 자리</span>
            <h2>기억의 자리</h2>
          </div>
        </div>
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
  const source = data.pages.church;
  const page = getNavItem('church/organization');
  const content = `
      <section class="panel organization-intro-panel">
        ${sectionTitle('Organization', '교구조직', '성도들이 예배와 사역, 돌봄 안에서 자연스럽게 연결되도록 조직과 교구 구조를 안내합니다.')}
        <div class="organization-summary-grid">
          <article class="card organization-summary-card">
            <span class="eyebrow">Ministry</span>
            <h3>교회조직안내</h3>
            <p>예배, 교육, 찬양, 봉사, 선교 등 교회 사역의 주요 조직을 한눈에 정리합니다.</p>
          </article>
          <article class="card organization-summary-card">
            <span class="eyebrow">Parish</span>
            <h3>교구편성안내</h3>
            <p>성도 돌봄과 공동체 연결을 위한 교구 편성 구조를 안내합니다.</p>
          </article>
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Departments', '부서 및 기관')}
        <div class="organization-card-grid">
          ${source.departments.map((item) => `
            <article class="card organization-detail-card">
              <div class="placeholder-box small">${escapeHtml(item.title)} 사역 이미지</div>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.detail)}</p>
            </article>
          `).join('')}
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Parish', '교구 편성')}
        <div class="grid grid-2">
          ${source.parishes.map((item) => `
            <article class="card parish-card">
              <span class="eyebrow">Care Group</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.detail)}</p>
            </article>
          `).join('')}
        </div>
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
  const content = `
      <section id="section-newcomers" class="panel newcomers-greeting-panel">
        ${sectionTitle('Greeting', '담임목사 인사말', '처음 방문한 분들이 교회의 환영과 방향을 먼저 느낄 수 있도록 구성합니다.')}
        <div class="newcomer-visual-copy">
          <div class="placeholder-box tall">담임목사 인사말 이미지 영역<br>aboutA_01_2026 참고</div>
          <article class="card">
            <span class="eyebrow">Welcome</span>
            <h3>샬롬! 함께 행복을 만들어가는 번동제일교회에 오신것을 환영하고 축복합니다.</h3>
            <p>여러분들이 언제든 찾아와 기댈 수 있는 시냇가 나무와 같은 교회 되기를 소망합니다. 성도님들의 삶의 고민을 함께 나누고, 말씀으로 위로하며, 매주 선포되는 설교를 통해 참된 행복을 발견하는 행복한 교회의 여정에 사랑하는 당신을 초청합니다.</p>
            <p class="meta">황대석 담임목사</p>
          </article>
        </div>
      </section>
      <section id="section-newcomers-registration" class="panel newcomers-registration-panel">
        ${sectionTitle('Registration', '새가족 등록안내', '새가족 등록부터 환영회까지의 흐름을 단계별로 안내합니다.')}
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
        ${sectionTitle('Education', '새가족 교육', '4주 양육과정을 통해 신앙의 기본과 교회 공동체를 알아갑니다.')}
        <div class="newcomer-education-meta">
          <span>4주 양육과정</span>
          <span>매주 주일</span>
          <span>교회 2층 카페헤슨 큰 모듬방</span>
        </div>
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
      </section>
      <section id="section-newcomers-helper" class="panel newcomers-helper-panel">
        ${sectionTitle('Helper', '새가족 섬김이', '처음 오신 분들이 혼자 남지 않도록 팀별 섬김이가 함께합니다.')}
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
        ${sectionTitle('Gallery', '새가족환영회', '환영회 사진을 최근 게시물과 연도별 카테고리로 확인할 수 있는 갤러리형 영역입니다.')}
        <div class="newcomer-year-filter">
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
          <a class="button button-secondary" href="http://www.bundong.com/iboard/board.html?code=bbs_nfwp">새가족환영회 게시판 더보기</a>
        </div>
      </section>
      <section id="section-newcomers-weekly-family" class="panel newcomers-weekly-panel">
        ${sectionTitle('Weekly', '금주의 새가족', '이번 주 등록한 새가족을 해시태그와 최근 게시물 형식으로 소개합니다.')}
        <div class="newcomer-tag-row">
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
          <a class="button button-secondary" href="http://www.bundong.com/iboard/board.html?code=bbs_nf">금주의 새가족 게시판 더보기</a>
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
  const content = `
      <section class="panel">
        ${sectionTitle('Directions', '오시는 길')}
        <div class="grid grid-2">
          <div class="placeholder-box tall">카카오맵 / 네이버지도 연동 영역</div>
          <article class="card">
            <h3>주소 / 연락처</h3>
            <p>${escapeHtml(source.directions.address)}</p>
            <p>${escapeHtml(source.directions.phone)}</p>
            <ul class="bullet-list">
              ${source.directions.transport.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
          </article>
        </div>
      </section>
  `;
  return renderSubpageScaffold('church/directions', page, content);
}

function renderWorshipTimesPage(activeRoute = 'worship') {
  const source = data.pages.worship;
  const page = getNavItem(activeRoute) || getNavItem('worship');
  const weekdayWorship = [
    ['찬양예배', '주일 오후 2:50', '본당'],
    ['수요 1부 예배', '수요일 오전 10:30', '본당'],
    ['수요 2부 예배', '수요일 오후 7:30', '본당'],
    ['새벽예배', '월~토 새벽 05:30', '본당 / 중예배실'],
    ['구역예배', '금요일 오전 10:00', '본당'],
    ['심야예배', '금요일 저녁 8:00', '본당'],
  ];
  const content = `
      <section id="section-worship-times" class="panel worship-info-panel">
        ${sectionTitle('Worship', '예배시간과 장소', '처음 오신 분도 예배 시간과 장소를 바로 확인할 수 있도록 정리합니다.')}
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
        ${sectionTitle('School', '교회학교 예배', '자녀 연령에 맞는 부서와 예배 장소를 한눈에 확인합니다.')}
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
        ${sectionTitle('Shuttle', '차량운행안내', '예배 전 탑승 시간과 정차 지점을 코스별로 빠르게 확인합니다.')}
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
      <section class="panel shuttle-notice-panel">
        ${sectionTitle('Boarding', '탑승 안내')}
        <article class="shuttle-notice-card">
          <strong>방문 전 확인하면 좋은 정보</strong>
          <p>차량 운행은 교통 상황과 교회 사정에 따라 조정될 수 있으므로, 처음 이용하시는 분은 교회 사무실 또는 안내팀에 한 번 더 확인할 수 있도록 안내 영역을 둡니다.</p>
          <div class="shuttle-notice-tags">
            <span>정차 지점</span>
            <span>탑승 시간</span>
            <span>귀가 운행</span>
            <span>문의 안내</span>
          </div>
        </article>
      </section>
  `;
  return content;
}

function renderWorshipShuttlePage() {
  return renderWorshipTimesPage('worship/shuttle');
}

function renderMediaCategoryPage(routeKey) {
  const source = data.pages.media;
  const page = getNavItem(routeKey);
  const content = `
      <section class="panel">
        ${sectionTitle('Featured', page.label)}
        <div class="grid grid-media">
          <article class="card card-dark">
            <div class="placeholder-box video">${escapeHtml(page.label)} 영상 플레이어</div>
            <h3>${escapeHtml(source.featured.title)}</h3>
            <p>${escapeHtml(source.featured.bible)}</p>
            <span class="meta">${escapeHtml(source.featured.preacher)} · ${escapeHtml(source.featured.date)}</span>
          </article>
          <article class="card">
            <h3>최근 말씀 요약</h3>
            <p>${escapeHtml(page.summary)}</p>
            <div class="callout">
              <p>본문, 설교 제목, 설교자, 요약문, 적용 포인트를 카드형으로 정리합니다.</p>
            </div>
          </article>
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Archive', `${page.label} 최근 영상`)}
        <div class="grid grid-3">
          ${[1, 2, 3].map((index) => `
            <article class="card">
              <div class="placeholder-box small">${escapeHtml(page.label)} 썸네일 ${index}</div>
              <h3>${escapeHtml(page.label)} 최근 영상 ${index}</h3>
              <p>영상 제목 / 날짜 / 짧은 설명이 들어가는 카드형 목록</p>
            </article>
          `).join('')}
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Channel', '유튜브 채널 연결')}
        <article class="card">
          <ul class="bullet-list">
            ${source.extras.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
          <div class="button-row">
            <a class="button" href="${routeHref('media')}">유튜브 채널 바로가기</a>
          </div>
        </article>
      </section>
  `;
  return renderSubpageScaffold(routeKey, page, content);
}

function renderNewsBoardPage() {
  const source = data.pages.news;
  const page = getNavItem('news');
  const content = `
      <section class="panel">
        ${sectionTitle('News Board', '교회소식')}
        <ul class="feed-list large">
          ${source.churchNews.map((item) => `<li><span>${escapeHtml(item[0])}</span><time>${escapeHtml(item[1])}</time></li>`).join('')}
        </ul>
      </section>
  `;
  return renderSubpageScaffold('news', page, content);
}

function renderBulletinPage() {
  const page = getNavItem('news/bulletin');
  const content = `
      <section class="panel">
        ${sectionTitle('Bulletin', '주보')}
        <div class="grid grid-2">
          <article class="card">
            <div class="placeholder-box tall">최신 주보 PDF 미리보기</div>
            <p>주보를 썸네일과 함께 바로 열어볼 수 있는 메인 프리뷰 블록</p>
          </article>
          <article class="card">
            <h3>최신 주보 목록</h3>
            <ul class="feed-list">
              ${data.home.bulletinItems.map((item) => `<li><span>${escapeHtml(item.title)}</span><time>${escapeHtml(item.date)}</time></li>`).join('')}
            </ul>
          </article>
        </div>
      </section>
  `;
  return renderSubpageScaffold('news/bulletin', page, content);
}

function renderResourcesPage() {
  const source = data.pages.news;
  const page = getNavItem('news/resources');
  const content = `
      <section class="panel">
        ${sectionTitle('Resources', '자료실')}
        <ul class="feed-list large">
          ${source.resources.map((item) => `<li><span>${escapeHtml(item[0])}</span><time>${escapeHtml(item[1])}</time></li>`).join('')}
        </ul>
      </section>
      <section class="panel">
        ${sectionTitle('Note', '자료실 구성 메모')}
        <article class="card">
          <p>${escapeHtml(source.bulletinNote)}</p>
        </article>
      </section>
  `;
  return renderSubpageScaffold('news/resources', page, content);
}

function renderRouteDraft(key) {
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
    case 'newcomers/registration':
    case 'newcomers/education':
    case 'newcomers/helper':
    case 'newcomers/welcome-party':
    case 'newcomers/weekly-family':
      pendingScrollTarget = getLandingScrollTarget(key);
      return renderNewcomerGreetingPage(key);
    case 'worship':
      return renderWorshipTimesPage();
    case 'worship/shuttle':
      return renderWorshipShuttlePage();
    case 'media':
    case 'media/wednesday':
    case 'media/praise':
    case 'media/youth':
    case 'media/friday':
      return renderMediaCategoryPage(key);
    case 'news':
      return renderNewsBoardPage();
    case 'news/bulletin':
      return renderBulletinPage();
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
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  const header = document.querySelector('.site-header');
  const mega = document.querySelector('.mega-menu');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open', !expanded);
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
      pendingScrollTarget = targetId;
      if (nextHash) {
        window.location.hash = nextHash.replace(/^#/, '');
      }
    });
  });
}

function scrollToPendingTarget() {
  if (!pendingScrollTarget) {
    return;
  }
  const target = document.getElementById(pendingScrollTarget);
  if (!target) {
    return;
  }
  const headerOffset = (document.querySelector('.site-header')?.offsetHeight || 0) + 14;
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  pendingScrollTarget = null;
  window.scrollTo({ top, behavior: 'smooth' });
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
    case 'newcomers/registration':
    case 'newcomers/education':
    case 'newcomers/helper':
    case 'newcomers/welcome-party':
    case 'newcomers/weekly-family':
      pendingScrollTarget = getLandingScrollTarget(key);
      return renderNewcomerGreetingPage(key);
    case 'worship':
      return renderWorshipTimesPage();
    case 'worship/shuttle':
      return renderWorshipShuttlePage();
    case 'media':
    case 'media/wednesday':
    case 'media/praise':
    case 'media/youth':
    case 'media/friday':
      return renderMediaCategoryPage(key);
    case 'news':
      return renderNewsBoardPage();
    case 'news/bulletin':
      return renderBulletinPage();
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
    window.setTimeout(scrollToPendingTarget, 0);
  } else if (previousKey && previousKey !== key) {
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 0);
  }
  lastRenderedRoute = key;
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);

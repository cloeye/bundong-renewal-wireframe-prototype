const data = window.BUNDONG_WIREFRAME_DATA;
const app = document.getElementById('app');
let heroIndex = 0;
let heroTimer = null;
let pendingScrollTarget = null;

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
    items: ['우리교회는', '시설안내', '교회연혁', '교구조직'],
  },
  newcomers: {
    group: '처음오셨나요',
    hero: '새가족 환영 / 안내 대표 이미지',
    items: ['담임목사 인사말', '등록+교육', '금주새가족', '환영회', '오시는길'],
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
      { route: 'church/facility', label: '시설안내', summary: '본관과 교육관의 주요 공간과 층별 구성을 와이어프레임으로 보여주는 화면입니다.' },
      { route: 'church/history', label: '교회연혁', summary: '설립부터 최근까지의 주요 이력을 연표 중심으로 구성한 화면입니다.' },
      { route: 'church/organization', label: '교구조직', summary: '부서 조직과 교구 편성을 구분해 확인할 수 있는 구조의 화면입니다.' },
    ],
  },
  {
    key: 'staff',
    label: '섬기는 사람들',
    items: [
      { route: 'church/staff', label: '섬기는 사람들', summary: '담임목사와 교역자, 부서 담당자 정보를 표 형태로 정리한 화면입니다.' },
    ],
  },
  {
    key: 'newcomers',
    label: '처음오셨나요',
    items: [
      { route: 'newcomers', label: '담임목사 인사말', summary: '처음 방문한 분들에게 교회의 분위기와 환영 메시지를 전하는 인사말 화면입니다.' },
      { route: 'newcomers/registration', label: '등록+교육', summary: '새가족 등록과 교육 과정을 단계별로 이해할 수 있도록 정리한 화면입니다.' },
      { route: 'newcomers/weekly-family', label: '금주새가족', summary: '이번 주 새가족 현황과 등록 흐름을 확인할 수 있는 게시형 화면입니다.' },
      { route: 'newcomers/welcome-party', label: '환영회', summary: '새가족 환영회 안내와 행사 스케치를 담는 화면입니다.' },
      { route: 'newcomers/directions', label: '오시는길', summary: '주소, 교통, 지도 영역을 중심으로 방문 정보를 제공하는 화면입니다.' },
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
  church: {
    church: 'section-church',
    'church/facility': 'section-church-facility',
    'church/history': 'section-church-history',
    'church/organization': 'section-church-organization',
  },
  newcomers: {
    newcomers: 'section-newcomers',
    'newcomers/registration': 'section-newcomers-registration',
    'newcomers/weekly-family': 'section-newcomers-weekly-family',
    'newcomers/welcome-party': 'section-newcomers-welcome-party',
    'newcomers/directions': 'section-newcomers-directions',
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
  return `
                  <a class="${item.route === activeKey ? 'is-current' : ''}" href="${routeHref(item.route)}"${scrollAttr}>
                    ${escapeHtml(item.label)}
                  </a>
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
        ${renderHomeSectionHead('예배와 사랑이 일상이 되는 순간들', '살아 있는 우리 교회를 소개합니다.')}
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
        ${renderHomeSectionHead('주일의 말씀, 삶으로 이어지도록', '최근 설교와 예배 영상을 편하게 확인하실 수 있습니다.')}
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
            <h2>이번 주 교회 소식을 확인하세요</h2>
            <p>예배와 일정, 주요 공지사항을 한눈에 확인하실 수 있습니다.</p>
            <ul class="feed-list large">
              ${data.home.newsItems
                .map((item) => `<li><span>${escapeHtml(item.title)}</span><time>${escapeHtml(item.date)}</time></li>`)
                .join('')}
            </ul>
            <a class="button button-secondary" href="${routeHref('news')}">교회소식 더 보기</a>
          </article>
          <article class="card home-news__panel">
            <h2>주보를 바로 확인하실 수 있습니다</h2>
            <p>최신 주보와 자료실 콘텐츠를 간편하게 확인해 보세요.</p>
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
        ${renderHomeSectionHead('처음 오셔도 낯설지 않으실 거예요', '예배당부터 교육관까지 한눈에 안내드려요.')}
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
            <h2>찾아오시는 길을 안내합니다</h2>
            <dl>
              <dt>주소</dt>
              <dd>${escapeHtml(data.home.directions.address)}</dd>
              <dt>전화</dt>
              <dd>${escapeHtml(data.home.directions.phone)}</dd>
            </dl>
            <ul class="bullet-list">
              ${data.home.directions.transit.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
            <a class="button button-secondary" href="${routeHref('newcomers')}">오시는 길 보기</a>
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
          <div class="subpage-category-path" aria-label="현재 위치">
            <a class="subpage-category-home" href="${routeHref('home')}">홈</a>
            <span class="subpage-category-separator">&gt;</span>
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
          </div>
          <p>${escapeHtml(pageSummary)}</p>
        </div>
        <div class="placeholder-box subpage-hero__media">${escapeHtml(meta.hero)}</div>
      </section>
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

function renderChurchIdentityPage(activeRoute = 'church') {
  const page = getNavItem(activeRoute) || getNavItem('church');
  const historyGroups = [
    {
      label: '묶음 1',
      title: '시작',
      period: '1964~1974',
      items: [
        ['1964', '번동 땅, 천막 안에서 첫 예배가 울려 퍼지다'],
        ['1964', '백낙기 목사, 초대 담임으로 위임받다', '혼자서도 열심히 전도하셨던 분'],
        ['1974', '창립 10주년, 번동을 믿음의 땅으로 바꿔가기 시작하다'],
      ],
    },
    {
      label: '묶음 2',
      title: '성장',
      period: '1975~1995',
      items: [
        ['1975', '더 많은 성도가 함께 예배드릴 공간을 짓다'],
        ['1986', '전 성도가 한마음으로 성전 건축을 시작하다'],
        ['1987', '입당예배'],
        ['1988', '성전 헌당예배', '몇몇이 아닌 전 성도가 함께 이룬 교회'],
        ['1995', '선교교육관 구입, 미스바 기도원 건축'],
      ],
    },
    {
      label: '묶음 3',
      title: '전환',
      period: '1996~2014',
      items: [
        ['1996', '백낙기 원로목사 추대'],
        ['1996', '김정호 목사, 2대 담임으로 부임', '시대가 요구하는 일을 할 수 있도록 하나님이 보내신 분'],
        ['1998', '남양주 새사랑교회 설립'],
        ['2000', '수원 예안교회 설립'],
        ['2001', '백낙기 원로목사 소천'],
        ['2004', '창립 42주년'],
        ['2014', '창립 50주년, 희년 선포'],
      ],
    },
    {
      label: '묶음 4',
      title: '현재',
      period: '2020~2024',
      items: [
        ['2020', '코로나 속에서도 예배의 불꽃을 이어가다'],
        ['2022', '주차장 정비 완료, 준공예배'],
        ['2024', '창립 60주년'],
        ['2024', '황대석 목사, 3대 담임으로 부임', '60주년의 감사가 100주년의 감사로 이어지도록'],
      ],
    },
  ];
  const ministryCards = [
    ['예배', '매주 드리는 예배', '주일 3부, 청년부, 수요·금요 예배까지'],
    ['양육', '새가족과 함께 자라는 교육', '등록부터 양육까지 단계별로 함께합니다'],
    ['지역', '이웃을 섬기는 교회', '가난하고 소외된 이웃을 향한 사랑을 멈추지 않습니다'],
    ['선교', '세계로 나가는 복음', '국내외 선교사 파송과 기도·물질로 열방을 섬깁니다'],
  ];
  const statCards = [
    ['60년', '이 자리에서'],
    ['7개 예배', '매주 드립니다'],
    ['2개 지교회', '직접 설립'],
    ['3대 담임목사', '이어온 사람들'],
  ];
  const quotes = [
    ['60년 동안 하나님 은혜 안에서 쉼 없이 달려온 교회입니다.', '원로 성도'],
    ['전 성도가 한마음으로 어려운 상황에서도 헌신했기 때문에 교회가 부흥했습니다.', '오랜 집사'],
    ['지금보다 더 좋아지는 놀라운 역사가 반드시 일어날 것입니다.', '장로'],
  ];
  const content = `
      <section id="section-church" class="church-landing-hero panel">
        <div class="church-landing-hero__media">교회 외관 또는 예배 사진 영역</div>
        <div class="church-landing-hero__copy">
          <span class="eyebrow">Our Church</span>
          <h2>복음의 가치로 세상을 품는 교회</h2>
          <div class="church-landing-hero__intro">
            <p class="church-landing-hero__lead">번동제일교회는 복음의 가치로 세상을 품는 대한예수교장로회(통합측) 교회입니다.</p>
            <p>본 교회는 1964년부터 지금까지 성경의 절대 권위를 믿으며 개혁주의 신앙 전통 위에 세워진 공동체입니다. 하나님을 경외하는 예배와 성도 간의 진실한 사랑을 통해 예수 그리스도의 복음을 증거하며, 이 땅에 하나님 나라를 세워가는 일에 전념하고 있습니다.</p>
          </div>
        </div>
      </section>
      <section class="panel church-identity-statement">
        <blockquote>
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
        </blockquote>
      </section>
      <section id="section-church-history" class="panel">
        ${sectionTitle('History', '60년의 걸음', '한 천막에서 시작된 예배가 오늘의 번동제일교회가 되기까지.')}
        <div class="church-history-groups">
          ${historyGroups.map((group) => `
            <article class="church-history-group">
              <div class="church-history-group__head">
                <h3>${escapeHtml(group.title)}</h3>
                <p>${escapeHtml(group.period)}</p>
              </div>
              <div class="church-history-group__list">
                ${group.items.map(([year, body, quote]) => `
                  <div class="church-history-row">
                    <strong>${escapeHtml(year)}</strong>
                    <p>${escapeHtml(body)}${quote ? `<em>“${escapeHtml(quote)}”</em>` : ''}</p>
                  </div>
                `).join('')}
              </div>
            </article>
          `).join('')}
        </div>
      </section>
      <section id="section-church-facility" class="panel">
        ${sectionTitle('Facility', '시설안내', '처음 오셔도 낯설지 않도록 본당과 교육관의 주요 공간을 안내합니다.')}
        <div class="grid grid-2">
          <article class="card">
            <div class="placeholder-box medium">본관 사진 / 조감도</div>
            <h3>본관</h3>
            <p>B1 식당·주방부터 4F 본당, 방송실까지 예배와 행정의 중심 공간입니다.</p>
          </article>
          <article class="card">
            <div class="placeholder-box medium">선교교육관 사진 / 조감도</div>
            <h3>선교교육관</h3>
            <p>유아·유치, 초등부, 청소년부, 새가족부가 함께 사용하는 교육 중심 공간입니다.</p>
          </article>
        </div>
      </section>
      <section id="section-church-organization" class="panel">
        ${sectionTitle('Organization', '교회조직')}
        <div class="church-organization-banners">
          <a class="church-organization-banner" href="${routeHref('church/organization')}">
            <h3>교회조직안내</h3>
            <p>부서조직, 찬양대, 교육부, 청년부 등 교회 사역 구조를 안내합니다.</p>
          </a>
          <a class="church-organization-banner" href="${routeHref('church/organization')}">
            <h3>교구편성안내</h3>
            <p>교구 편성과 담당 교역자, 공동체 연결 구조를 확인합니다.</p>
          </a>
        </div>
      </section>
      <section class="panel church-vision-section">
        <div class="church-vision-section__copy">
          <span class="eyebrow">Vision</span>
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
      </section>
  `;
  return renderSubpageScaffold('church', page, content);
}


function renderChurchStaffPage() {
  const source = data.pages.church;
  const page = getNavItem('church/staff');
  const content = `
      <section class="panel">
        ${sectionTitle('Leadership', '섬기는 사람들')}
        <div class="grid grid-4">
          ${source.staff.slice(0, 4).map((item) => `
            <article class="card">
              <div class="placeholder-box small">인물 이미지</div>
              <h3>${escapeHtml(item.name)}</h3>
              <p>${escapeHtml(item.role)}</p>
              <span class="meta">${escapeHtml(item.detail)}</span>
            </article>
          `).join('')}
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Directory', '교역자 및 담당 사역')}
        <div class="data-table">
          <div class="table-head"><span>구분</span><span>이름</span><span>담당</span></div>
          ${source.staff.map((item) => `
            <div class="table-row">
              <span>${escapeHtml(item.role)}</span>
              <span>${escapeHtml(item.name)}</span>
              <span>${escapeHtml(item.detail)}</span>
            </div>
          `).join('')}
        </div>
      </section>
  `;
  return renderSubpageScaffold('church/staff', page, content);
}

function renderChurchFacilityPage() {
  const source = data.pages.church;
  const page = getNavItem('church/facility');
  const content = `
      <section class="panel">
        ${sectionTitle('Facility', '교회시설안내', '기존 시설안내 페이지의 본관 / 교육관 구성을 바탕으로 공간 정보를 더 읽기 쉽게 재정리한 화면입니다.')}
        <div class="facility-stack">
          ${source.facilities.map((item, index) => `
            <article class="card facility-overview">
              <div class="placeholder-box facility-overview__media">${escapeHtml(item.title)} 전경 / 외관 사진</div>
              <div class="facility-overview__body">
                <h3>${escapeHtml(item.title)}</h3>
                <p>${index === 0 ? '주일예배와 행정, 카페, 본당이 모여 있는 메인 건물입니다.' : '교회학교와 교육, 모임 공간 중심의 교육관 영역입니다.'}</p>
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
        ${sectionTitle('Guide', '공간 이용 안내')}
        <div class="grid grid-2">
          <div class="placeholder-box tall">층별 도면 / 주일 동선 / 안내 사인 위치</div>
          <article class="card">
            <h3>처음 방문자를 위한 포인트</h3>
            <ul class="bullet-list">
              <li>본관과 교육관을 구분해 찾기 쉽게 배치</li>
              <li>주일예배, 교회학교, 청년예배 동선을 따로 안내</li>
              <li>엘리베이터, 계단, 사무실, 카페 위치를 한 번에 확인 가능하게 구성</li>
              <li>주차 및 외부 진입 방향은 오시는 길 화면과 연계</li>
            </ul>
          </article>
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Highlight', '주요 공간 하이라이트')}
        <div class="grid grid-3">
          <article class="card">
            <h3>본당</h3>
            <p>주일예배와 주요 집회가 이루어지는 핵심 공간으로, 대표 사진과 예배 정보를 함께 배치합니다.</p>
          </article>
          <article class="card">
            <h3>교육관</h3>
            <p>영유아부부터 청소년부, 청년부까지 교육과 모임 공간을 층별로 정리해 안내합니다.</p>
          </article>
          <article class="card">
            <h3>카페 및 사무실</h3>
            <p>성도 교제와 행정 문의가 집중되는 공간은 별도 안내 블록으로 분리해 접근성을 높입니다.</p>
          </article>
        </div>
      </section>
  `;
  return renderSubpageScaffold('church/facility', page, content);
}

function renderChurchHistoryPage() {
  const source = data.pages.church;
  const page = getNavItem('church/history');
  const content = `
      <section class="panel">
        ${sectionTitle('History', '교회연혁')}
        <div class="timeline">
          ${source.milestones.map((item) => `
            <article class="timeline-item">
              <span class="timeline-year">${escapeHtml(item.year)}</span>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `).join('')}
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Archive', '기념 아카이브 연결')}
        <div class="grid grid-2">
          <article class="card">
            <h3>창립 60주년</h3>
            <p>연혁 페이지에서 자연스럽게 60주년 기록 화면으로 연결되는 배너 구조를 둡니다.</p>
          </article>
          <article class="card">
            <h3>故 백낙기목사 기념관</h3>
            <p>기념관 페이지와의 연계 링크를 두어 역사 맥락을 이어서 볼 수 있도록 구성합니다.</p>
          </article>
        </div>
      </section>
  `;
  return renderSubpageScaffold('church/history', page, content);
}

function renderChurchOrganizationPage() {
  const source = data.pages.church;
  const page = getNavItem('church/organization');
  const content = `
      <section class="panel">
        ${sectionTitle('Departments', '부서 및 조직')}
        <div class="grid grid-2">
          <article class="card">
            <h3>부서 조직</h3>
            <ul class="bullet-list">
              ${source.departments.map((item) => `<li><strong>${escapeHtml(item.title)}</strong> · ${escapeHtml(item.detail)}</li>`).join('')}
            </ul>
          </article>
          <article class="card">
            <h3>교구 편성</h3>
            <ul class="bullet-list">
              ${source.parishes.map((item) => `<li><strong>${escapeHtml(item.title)}</strong> · ${escapeHtml(item.detail)}</li>`).join('')}
            </ul>
          </article>
        </div>
      </section>
  `;
  return renderSubpageScaffold('church/organization', page, content);
}

function renderNewcomerGreetingPage(activeRoute = 'newcomers') {
  const source = data.pages.newcomers;
  const page = getNavItem(activeRoute) || getNavItem('newcomers');
  const content = `
      <section id="section-newcomers" class="panel">
        ${sectionTitle('Greeting', '담임목사 인사말')}
        <div class="grid grid-2">
          <article class="card">
            <div class="placeholder-box tall">담임목사 사진</div>
          </article>
          <article class="card">
            <h3>처음 방문하신 분들을 환영합니다</h3>
            <p>${escapeHtml(source.greeting.body)}</p>
            <span class="status-chip">${escapeHtml(source.greeting.status)}</span>
          </article>
        </div>
      </section>
      <section id="section-newcomers-registration" class="panel">
        ${sectionTitle('Flow', '등록 + 교육')}
        <div class="step-list">
          ${source.steps.map((item, index) => `
            <div class="step-card">
              <span class="step-number">${index + 1}</span>
              <strong>${escapeHtml(item)}</strong>
            </div>
          `).join('')}
        </div>
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
      <section id="section-newcomers-weekly-family" class="panel">
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
      <section id="section-newcomers-welcome-party" class="panel">
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
      <section id="section-newcomers-directions" class="panel">
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

function renderNewcomerDirectionsPage() {
  const source = data.pages.newcomers;
  const page = getNavItem('newcomers/directions');
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
  return renderSubpageScaffold('newcomers/directions', page, content);
}

function renderWorshipTimesPage() {
  const source = data.pages.worship;
  const page = getNavItem('worship');
  const content = `
      <section class="panel">
        ${sectionTitle('Highlight', '주요 예배 안내')}
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
            <h3>수요 / 금요예배</h3>
            <p>수요 10:30 / 19:30 · 금요 20:00</p>
          </article>
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Times', '예배시간 / 장소')}
        <div class="data-table">
          <div class="table-head"><span>예배</span><span>시간</span><span>장소</span></div>
          ${source.worshipTimes.map((row) => `
            <div class="table-row">
              <span>${escapeHtml(row[0])}</span>
              <span>${escapeHtml(row[1])}</span>
              <span>${escapeHtml(row[2])}</span>
            </div>
          `).join('')}
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('School', '교회학교 예배')}
        <div class="data-table">
          <div class="table-head"><span>부서</span><span>대상</span><span>시간</span><span>장소</span></div>
          ${source.schoolTimes.map((row) => `
            <div class="table-row table-row-4">
              <span>${escapeHtml(row[0])}</span>
              <span>${escapeHtml(row[1])}</span>
              <span>${escapeHtml(row[2])}</span>
              <span>${escapeHtml(row[3])}</span>
            </div>
          `).join('')}
        </div>
      </section>
  `;
  return renderSubpageScaffold('worship', page, content);
}

function renderWorshipShuttlePage() {
  const source = data.pages.worship;
  const page = getNavItem('worship/shuttle');
  const content = `
      <section class="panel">
        ${sectionTitle('Shuttle', '차량운행안내')}
        <div class="grid grid-3">
          ${source.shuttles.map((item) => `
            <article class="card">
              <h3>${escapeHtml(item.route)}</h3>
              <p>${escapeHtml(item.detail)}</p>
            </article>
          `).join('')}
        </div>
      </section>
      <section class="panel">
        ${sectionTitle('Boarding', '탑승 안내')}
        <article class="card">
          <ul class="bullet-list">
            <li>예배별 코스를 구분해 탑승 위치를 직관적으로 정리합니다.</li>
            <li>지도 썸네일과 함께 주요 정차 지점을 카드 형태로 배치합니다.</li>
            <li>노선 변경 시 공지 영역을 상단에 고정할 수 있도록 구성합니다.</li>
          </ul>
        </article>
      </section>
  `;
  return renderSubpageScaffold('worship/shuttle', page, content);
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
    case 'church/facility':
    case 'church/history':
    case 'church/organization':
      pendingScrollTarget = getLandingScrollTarget(key);
      return renderChurchIdentityPage(key);
    case 'church/staff':
      return renderChurchStaffPage();
    case 'newcomers':
    case 'newcomers/registration':
    case 'newcomers/weekly-family':
    case 'newcomers/welcome-party':
    case 'newcomers/directions':
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
    case 'memorial':
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
    case 'memorial':
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
      pendingScrollTarget = targetId;
      const nextHash = link.getAttribute('href') || '';
      if (nextHash && nextHash !== window.location.hash) {
        return;
      }
      event.preventDefault();
      scrollToPendingTarget();
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
  window.setTimeout(scrollToPendingTarget, 0);
}

function renderRoute(key) {
  switch (key) {
    case 'home':
      return renderHome();
    case 'church':
    case 'church/facility':
    case 'church/history':
    case 'church/organization':
      pendingScrollTarget = getLandingScrollTarget(key);
      return renderChurchIdentityPage(key);
    case 'church/staff':
      return renderChurchStaffPage();
    case 'newcomers':
    case 'newcomers/registration':
    case 'newcomers/weekly-family':
    case 'newcomers/welcome-party':
    case 'newcomers/directions':
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
    case 'memorial':
    case 'policy':
      return renderSimplePage(key);
    default:
      return renderNotFound();
  }
}

function render() {
  const key = routeKey();
  const activeKey = getNavGroup(key)?.key || 'home';
  app.innerHTML = `
    ${renderHeader(activeKey)}
    ${renderRoute(key)}
    ${renderFooter()}
  `;
  document.title = key === 'home' ? data.project.title : `${getPageTitle(key)} | ${data.project.title}`;
  bindUi();
  startHeroTimer(key);
  window.setTimeout(scrollToPendingTarget, 0);
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);

/* ==========================================================================
   PACELAB × ENGINE BIRD — Bilingual Interactive Pitch Demo Engine (ZH / EN)
   ========================================================================== */

(function () {
  // Detect initial language from ?lang= query param or page default
  function detectInitialLang() {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("lang");
      if (q === "en" || q === "zh") return q;
    } catch (_) {}
    return window.__INITIAL_LANG__ === "en" ? "en" : "zh";
  }

  const USD_RATE = 7.2;

  // Global Reactive State (language-independent live state!)
  const state = {
    lang: detectInitialLang(),
    chapter: 0,
    phoneOnly: false,
    mobileView: "phone", // 'phone' | 'pitch'
    phoneTab: "match", // 'match' | 'clubs' | 'pk' | 'perks'

    // Interactive Pitch controls
    selectedTier: "t1",
    algoMode: "fair", // 'fair' | 'raw'
    telemetryMode: "cheat", // 'cheat' | 'normal'
    eepInput: { sport: "bike", km: 36 },

    // Interactive ROI Calculator (EngineBird, stored in RMB)
    roi: {
      clubs: 30,
      activePerClub: 45,
      aov: 420,
      convRate: 22,
      grossMargin: 48,
      cpsRate: 12
    },

    // Live User State inside Phone Prototype
    user: {
      monthlyKm: 26.4, // Starts just under 30km so one sync unlocks EngineBird perks!
      targetKm: 30.0,
      syncCount: 0
    },

    // Persistent selections across language switches
    selectedRaceId: "gzm",
    paceFilter: "all",
    clubDivision: "elite",
    pkScope: "province",
    jerseyVariant: "gd", // 'gd' | 'js'
    joinedSquadIds: new Set(["sq2"]),
    acceptedQuestIds: new Set(["q1"])
  };

  // Helper accessors for active language dataset & UI strings
  const D = () => (state.lang === "en" ? window.PITCH_DATA_EN : window.PITCH_DATA);
  const T = () => window.UI_STRINGS[state.lang];
  const isEN = () => state.lang === "en";

  // DOM References
  const el = {
    brandCnText: document.getElementById("brandCnText"),
    partnerCnText: document.getElementById("partnerCnText"),
    pitchContent: document.getElementById("pitchContent"),
    pitchScroll: document.getElementById("pitchScroll"),
    chapterNav: document.getElementById("chapterNav"),
    chapterDots: document.getElementById("chapterDots"),
    prevChapterBtn: document.getElementById("prevChapterBtn"),
    nextChapterBtn: document.getElementById("nextChapterBtn"),
    togglePhoneOnlyBtn: document.getElementById("togglePhoneOnlyBtn"),
    togglePhoneOnlyText: document.getElementById("togglePhoneOnlyText"),
    langSwitchDesktop: document.getElementById("langSwitchDesktop"),
    mobileModeBar: document.getElementById("mobileModeBar"),
    mobileBtnPhone: document.getElementById("mobileBtnPhone"),
    mobileBtnPitch: document.getElementById("mobileBtnPitch"),
    mobileLangBtn: document.getElementById("mobileLangBtn"),
    liveBadgeText: document.getElementById("liveBadgeText"),
    deviceSyncHint: document.getElementById("deviceSyncHint"),
    wxNavTitle: document.getElementById("wxNavTitle"),
    wxCityPill: document.getElementById("wxCityPill"),
    porLabelText: document.getElementById("porLabelText"),
    porUnitText: document.getElementById("porUnitText"),
    porSyncBtnText: document.getElementById("porSyncBtnText"),
    porMileageText: document.getElementById("porMileageText"),
    porProgressFill: document.getElementById("porProgressFill"),
    openSyncModalBtn: document.getElementById("openSyncModalBtn"),
    phoneBody: document.getElementById("phoneBody"),
    phoneTabbar: document.getElementById("phoneTabbar"),
    perksTabBadge: document.getElementById("perksTabBadge"),
    phoneSheetBackdrop: document.getElementById("phoneSheetBackdrop"),
    phoneSheet: document.getElementById("phoneSheet"),
    phoneToast: document.getElementById("phoneToast")
  };

  let toastTimer = null;
  function showToast(msg) {
    el.phoneToast.textContent = msg;
    el.phoneToast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.phoneToast.classList.remove("show");
    }, 2800);
  }

  // Currency Formatters
  function fmtMoney(rmb) {
    if (isEN()) {
      const usd = rmb / USD_RATE;
      if (usd >= 1000) return "$" + (usd / 1000).toFixed(1) + "K";
      return "$" + Math.round(usd).toLocaleString("en-US");
    }
    return rmb >= 10000
      ? "¥" + (rmb / 10000).toFixed(1) + "万"
      : "¥" + Math.round(rmb).toLocaleString("zh-CN");
  }

  function fmtRmbShort(rmb) {
    if (isEN()) {
      return rmb >= 1000 ? "¥" + Math.round(rmb / 1000) + "K" : "¥" + Math.round(rmb);
    }
    return fmtMoney(rmb);
  }

  // Dynamic boosted metrics (preserves live sync bumps cleanly across languages)
  function getCityList() {
    const boost = Number((state.user.syncCount * 0.4).toFixed(1));
    return D().guangdongCities.map((c) =>
      c.id === "gz"
        ? { ...c, total: Number((c.total + boost).toFixed(1)), participants: c.participants + state.user.syncCount }
        : { ...c }
    );
  }

  function getFinalsData() {
    const f = D().provinceFinals;
    const boost = Number((state.user.syncCount * 0.4).toFixed(1));
    return {
      ...f,
      left: { ...f.left, score: Number((f.left.score + boost).toFixed(1)) }
    };
  }

  function getClubList(division) {
    const boost = Number((state.user.syncCount * 0.3).toFixed(1));
    return (D().clubsByDivision[division] || []).map((c) =>
      c.isUserClub ? { ...c, score: Number((c.score + boost).toFixed(1)) } : { ...c }
    );
  }

  // =========================================================================
  // Language Switching & Shell Chrome Sync
  // =========================================================================
  function syncStaticChrome() {
    const t = T();
    document.documentElement.lang = isEN() ? "en" : "zh-CN";
    document.title = t.docTitle;

    if (el.brandCnText) el.brandCnText.textContent = t.brandCn;
    if (el.partnerCnText) el.partnerCnText.textContent = t.partnerCn;
    if (el.togglePhoneOnlyText) {
      el.togglePhoneOnlyText.textContent = state.phoneOnly ? t.showPitch : t.focusProto;
    }
    if (el.mobileBtnPhone) el.mobileBtnPhone.textContent = t.mobilePhone;
    if (el.mobileBtnPitch) el.mobileBtnPitch.textContent = t.mobilePitch;
    if (el.mobileLangBtn) el.mobileLangBtn.textContent = isEN() ? "中文" : "EN";
    if (el.liveBadgeText) el.liveBadgeText.textContent = t.liveBadge;
    if (el.wxCityPill) el.wxCityPill.textContent = t.cityLabel;
    if (el.porLabelText) el.porLabelText.textContent = t.porLabel;
    if (el.porUnitText) el.porUnitText.textContent = t.porUnit;
    if (el.porSyncBtnText) el.porSyncBtnText.textContent = t.syncBtn;
    if (el.perksTabBadge) el.perksTabBadge.textContent = t.unlockedBadge;

    // Chapter pills
    el.chapterNav.querySelectorAll(".chapter-pill").forEach((btn, idx) => {
      const label = btn.querySelector(".pill-label");
      if (label && t.chapterNav[idx]) label.textContent = t.chapterNav[idx];
    });

    // Desktop language toggle active state
    if (el.langSwitchDesktop) {
      el.langSwitchDesktop.querySelectorAll(".lang-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.lang === state.lang);
      });
    }

    // Phone tabbar labels
    el.phoneTabbar.querySelectorAll(".tab-item").forEach((btn) => {
      const tabKey = btn.dataset.tab;
      const span = btn.querySelector("span:not(.tab-badge)");
      if (span && t.tabs[tabKey]) span.textContent = t.tabs[tabKey];
    });

    // Footer buttons
    const prevSpan = el.prevChapterBtn.querySelector("span");
    if (prevSpan) prevSpan.textContent = t.prevChapter;
  }

  function setLanguage(lang) {
    if (lang !== "zh" && lang !== "en") return;
    state.lang = lang;
    closeSheet();
    syncStaticChrome();
    setChapter(state.chapter, false);
    renderPhone();
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      window.history.replaceState({}, "", url.toString());
    } catch (_) {}
  }

  // =========================================================================
  // Chapter Navigation & Bidirectional Sync
  // =========================================================================
  function setChapter(idx, syncPhone = true) {
    const chapters = D().chapters;
    state.chapter = Math.max(0, Math.min(chapters.length - 1, idx));
    const ch = chapters[state.chapter];
    const t = T();

    el.chapterNav.querySelectorAll(".chapter-pill").forEach((btn) => {
      btn.classList.toggle("active", Number(btn.dataset.chapter) === state.chapter);
    });

    el.prevChapterBtn.disabled = state.chapter === 0;
    el.nextChapterBtn.disabled = state.chapter === chapters.length - 1;
    el.nextChapterBtn.querySelector("span").textContent =
      state.chapter === chapters.length - 1 ? t.doneChapter : t.nextChapter;

    el.chapterDots.innerHTML = chapters
      .map(
        (_, i) =>
          `<button class="chapter-dot ${i === state.chapter ? "active" : ""}" data-dot="${i}" aria-label="Chapter ${i + 1}"></button>`
      )
      .join("");

    el.deviceSyncHint.textContent = ch.hint;

    if (syncPhone) {
      state.phoneTab = ch.tab;
      if (state.chapter === 3) state.pkScope = "province";
      renderPhone();
    }

    renderPitch();
    el.pitchScroll.scrollTop = 0;
  }

  function setPhoneTab(tab) {
    state.phoneTab = tab;
    renderPhone();
  }

  // =========================================================================
  // Render Left Pane: Interactive Pitch Storyboard
  // =========================================================================
  function renderPitch() {
    const ch = D().chapters[state.chapter];
    let bodyHtml = "";

    if (state.chapter === 0) bodyHtml = renderChapter1();
    else if (state.chapter === 1) bodyHtml = renderChapter2();
    else if (state.chapter === 2) bodyHtml = renderChapter3();
    else if (state.chapter === 3) bodyHtml = renderChapter4();
    else if (state.chapter === 4) bodyHtml = renderChapter5();

    el.pitchContent.innerHTML = `
      <div class="pitch-kicker">
        <span class="pitch-kicker-tag">PITCH DEMO</span>
        <span>${ch.kicker}</span>
      </div>
      <h1 class="pitch-title">${ch.title}</h1>
      <p class="pitch-lead">${ch.lead}</p>
      ${bodyHtml}
    `;

    bindPitchEvents();
  }

  // Chapter 1
  function renderChapter1() {
    if (isEN()) {
      const tiers = {
        t3: {
          title: "T3 Zero-Friction Entry · AI Screenshot OCR (VLM)",
          detail:
            "Chinese legacy apps (Codoon, Keep, Joyrun) don't expose public APIs. Runners already screenshot runs to share on WeChat — dropping a screenshot into PACELAB parses pace, distance & watermark in 1s for matching & citizen buffs."
        },
        t2: {
          title: "T2 Standard File Layer · FIT / GPX Import",
          detail:
            "Supports raw .fit / .gpx exports from Garmin, COROS, Suunto & cycling head units (Xingzhe/Blackbird), preserving full heart rate, cadence, power & elevation telemetry."
        },
        t1: {
          title: "T1 Race-Grade Trust · Native Watch & HealthKit Sync",
          detail:
            "WeChat Mini Program at launch + lightweight native companion app for Apple HealthKit, Huawei Health Kit & Garmin/COROS Partner APIs. Required for all Engine Bird VIP discount & prize rankings."
        }
      };
      const activeTier = tiers[state.selectedTier];

      return `
        <div class="kpi-grid">
          <div class="kpi-box">
            <div class="kpi-label">China Annual Road Race Entries</div>
            <div class="kpi-num tabular">~7.0M</div>
            <div class="kpi-note">600–750 marathons &amp; road races / yr</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">Sub-3:30 Marathon Runners</div>
            <div class="kpi-num accent tabular">100K+</div>
            <div class="kpi-note">High-LTV core performance gear buyers</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">Structural Market Gap</div>
            <div class="kpi-num trust">Watch Silos</div>
            <div class="kpi-note">Serious runners track on watches, lack social/PK layer</div>
          </div>
        </div>

        <div class="pitch-card">
          <div class="pitch-card-head">
            <div class="pitch-card-title">3-Tier Data Ingestion Architecture (Click to inspect)</div>
            <span class="pitch-card-sub">Works with Codoon / Keep / Garmin / COROS / Apple</span>
          </div>

          <div class="tier-list">
            <div class="tier-item ${state.selectedTier === "t3" ? "active" : ""}" data-tier="t3">
              <span class="tier-badge t3">T3 · Frictionless</span>
              <div class="tier-name">AI Screenshot OCR</div>
              <div class="tier-desc">Upload Codoon / Keep / Joyrun screenshots in 1 sec</div>
            </div>
            <div class="tier-item ${state.selectedTier === "t2" ? "active" : ""}" data-tier="t2">
              <span class="tier-badge t2">T2 · Telemetry</span>
              <div class="tier-name">FIT / GPX Import</div>
              <div class="tier-desc">Full HR, cadence &amp; watt data for watches &amp; bike computers</div>
            </div>
            <div class="tier-item ${state.selectedTier === "t1" ? "active" : ""}" data-tier="t1">
              <span class="tier-badge t1">T1 · Race-Grade</span>
              <div class="tier-name">Direct Watch Sync</div>
              <div class="tier-desc">Garmin / COROS / Apple / Huawei direct API for VIP perks</div>
            </div>
          </div>

          <div style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:11px;padding:12px 14px;font-size:12.5px;color:var(--ink-secondary);line-height:1.55;">
            <strong style="color:var(--ink-primary);display:block;margin-bottom:3px;">${activeTier.title}</strong>
            ${activeTier.detail}
          </div>

          <div class="pitch-callout">
            <div class="callout-copy">
              <strong>Try it live:</strong> The demo runner is currently at <span class="mono">${state.user.monthlyKm.toFixed(1)} / 30.0 km</span> this month. Sync a Garmin run, Codoon screenshot, or cycling ride to unlock Engine Bird VIP perks in real time!
            </div>
            <button class="action-cta orange" id="pitchOpenSyncBtn">Test Sync Now →</button>
          </div>
        </div>

        <div class="pitch-card">
          <div class="pitch-card-head">
            <div class="pitch-card-title">Why Launch as a WeChat Mini Program First?</div>
          </div>
          <div class="pitch-bullets">
            <div class="bullet-card">
              <h4>Zero App-Download Friction</h4>
              <p>99% of Chinese run clubs already live in WeChat groups. Sharing a Pace Train card directly in chat converts 5–10× better than an App Store download.</p>
            </div>
            <div class="bullet-card">
              <h4>1-Tap Brand Commerce Checkout</h4>
              <p>Unlocked Engine Bird VIP codes jump straight into Engine Bird's private WeChat store (Youzan) for instant closed-loop conversion.</p>
            </div>
          </div>
        </div>
      `;
    }

    // Chinese Chapter 1
    const tiers = {
      t3: {
        title: "T3 零摩擦入坑层 · 截图 AI 极速识别（VLM/OCR）",
        detail:
          "咕咚、Keep、悦跑圈均不开放第三方 API。跑者跑完本就要截图发朋友圈，直接扔进小程序 1 秒提取里程/配速/日期水印。用于个人跑力建档、备赛匹配与大众助威 Buff，冷启动零阻力。"
      },
      t2: {
        title: "T2 标准文件层 · FIT / GPX 轨迹导入",
        detail:
          "支持佳明、高驰、行者、黑鸟码表及各类专业手表导出 .fit / .gpx 原始文件，保留完整心率、步频与海拔数据，直接通过跑力与防作弊核验。"
      },
      t1: {
        title: "T1 赛级可信层 · 官方手表/系统健康直连",
        detail:
          "小程序启动 + Phase 2 轻量 App 接入 Apple HealthKit、华为 Health Kit 及佳明/高驰官方 Partner API。凡涉及引擎鸟折扣券、跑团排位奖品的赛事，强制要求 T1/T2 可信数据入账。"
      }
    };
    const activeTier = tiers[state.selectedTier];

    return `
      <div class="kpi-grid">
        <div class="kpi-box">
          <div class="kpi-label">中国路跑年参赛规模</div>
          <div class="kpi-num tabular">~700万<span style="font-size:13px;font-weight:600">人次</span></div>
          <div class="kpi-note">年举办 600–750 场路跑赛事</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">全马 330 以内精英跑者</div>
          <div class="kpi-num accent tabular">10万+</div>
          <div class="kpi-note">高复购专业装备核心买单群体</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">核心行业结构性缺口</div>
          <div class="kpi-num trust">手表孤岛</div>
          <div class="kpi-note">严肃跑者用手表记录，缺本土社交竞技层</div>
        </div>
      </div>

      <div class="pitch-card">
        <div class="pitch-card-head">
          <div class="pitch-card-title">三层数据接入架构（点击切换查看细节）</div>
          <span class="pitch-card-sub">兼容咕咚 / Keep / 悦跑圈 / 佳明 / 高驰 / 华为</span>
        </div>

        <div class="tier-list">
          <div class="tier-item ${state.selectedTier === "t3" ? "active" : ""}" data-tier="t3">
            <span class="tier-badge t3">T3 · 零门槛</span>
            <div class="tier-name">截图 AI 秒传</div>
            <div class="tier-desc">通吃咕咚 / Keep / 悦跑圈截图，1秒建档</div>
          </div>
          <div class="tier-item ${state.selectedTier === "t2" ? "active" : ""}" data-tier="t2">
            <span class="tier-badge t2">T2 · 进阶核验</span>
            <div class="tier-name">FIT / GPX 导入</div>
            <div class="tier-desc">保留心率/步频/功率，兼容跑表与骑行码表</div>
          </div>
          <div class="tier-item ${state.selectedTier === "t1" ? "active" : ""}" data-tier="t1">
            <span class="tier-badge t1">T1 · 赛级可信</span>
            <div class="tier-name">手表官方直连</div>
            <div class="tier-desc">佳明 / 高驰 / Apple / 华为直连解锁折扣</div>
          </div>
        </div>

        <div style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:11px;padding:12px 14px;font-size:12.5px;color:var(--ink-secondary);line-height:1.55;">
          <strong style="color:var(--ink-primary);display:block;margin-bottom:3px;">${activeTier.title}</strong>
          ${activeTier.detail}
        </div>

        <div class="pitch-callout">
          <div class="callout-copy">
            <strong>现场交互演示：</strong>当前用户本月认证跑量为 <span class="mono">${state.user.monthlyKm.toFixed(1)} / 30.0 km</span>。点击右侧体验上传一条「佳明 T1 跑步」或「咕咚 AI 截图」，即可实时解锁引擎鸟内购权限！
          </div>
          <button class="action-cta orange" id="pitchOpenSyncBtn">立即演示同步 →</button>
        </div>
      </div>

      <div class="pitch-card">
        <div class="pitch-card-head">
          <div class="pitch-card-title">为什么 Phase 1 优先以「微信小程序」冷启动？</div>
        </div>
        <div class="pitch-bullets">
          <div class="bullet-card">
            <h4>零下载摩擦 · 寄生微信跑团群</h4>
            <p>中国 99% 跑团日常沟通在微信群。转发卡片一键入团、组周末配速列车，转化率比独立 App 高 5–10 倍。</p>
          </div>
          <div class="bullet-card">
            <h4>一键跳转引擎鸟有赞微商城</h4>
            <p>达标后小程序内直接弹出专属核销码并跳引擎鸟微信私域商城成交，最短路径闭环转化。</p>
          </div>
        </div>
      </div>
    `;
  }

  // Chapter 2
  function renderChapter2() {
    if (isEN()) {
      return `
        <div class="pitch-card">
          <div class="pitch-card-head">
            <div class="pitch-card-title">Why Past "Running Buddy" Apps Died — And How We Fix It</div>
            <span class="pitch-card-sub">Race-anchored social trust</span>
          </div>
          <div class="compare-grid">
            <div class="compare-col">
              <div class="compare-head">Legacy 1-on-1 Run-Dating Apps</div>
              <ul class="compare-list">
                <li>Aimless matching quickly turns into casual dating, driving serious runners away</li>
                <li>Meeting a stranger 1-on-1 outdoors creates major safety anxiety for women</li>
                <li>Even a 30s/km pace gap or busy week kills the buddy bond ("7-day churn")</li>
                <li>Solo streaks lack sustained social pull after initial motivation fades</li>
              </ul>
            </div>
            <div class="compare-col ours">
              <div class="compare-head" style="color:var(--trust)">PACELAB · Race-Anchored Trains</div>
              <ul class="compare-list">
                <li><strong>Target Race Lock-In</strong>: Pick Guangzhou / Shenzhen / Wuxi Marathon + goal pace first</li>
                <li><strong>3–6 Runner Pace Buses + Women-Only Pods</strong>: Group safety + auto 500m home privacy blur</li>
                <li><strong>Async Micro-Quests</strong>: Complete duo 42.2km relays or park "crossed paths" even on different schedules</li>
                <li><strong>Natural Funnel to Clubs</strong>: Training squads seamlessly convert into loyal club teams</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="pitch-card">
          <div class="pitch-card-head">
            <div class="pitch-card-title">Privacy Zones &amp; Verified Pace Credibility</div>
            <span class="pitch-card-sub">Strava-grade safety</span>
          </div>
          <div style="display:grid;grid-template-columns:1.1fr 0.9fr;gap:14px;align-items:center;">
            <div style="font-size:12.5px;color:var(--ink-secondary);line-height:1.6;">
              <p style="margin-bottom:8px;"><strong style="color:var(--ink-primary);">1. Default 500m Start/End Blur:</strong> Automatically hides home and office endpoints on every shared route.</p>
              <p style="margin-bottom:8px;"><strong style="color:var(--ink-primary);">2. Verified Watch Paces:</strong> Every Pace Bus captain displays T1 watch-verified pace &amp; marathon PB history.</p>
              <p><strong style="color:var(--ink-primary);">3. Vibe &amp; Hobby Tags:</strong> Layer <code>#CoffeeRun</code>, <code>#PostRunDimSum</code>, and <code>#EarlyBirds</code> so runners click socially too.</p>
            </div>
            <div style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:12px;padding:12px;">
              <svg viewBox="0 0 240 130" style="display:block;width:100%;height:auto;" aria-label="500m privacy zone diagram">
                <rect width="240" height="130" rx="8" fill="#FAFBFD"/>
                <path d="M22 102 C55 95, 65 40, 112 45 C158 50, 165 88, 214 34" fill="none" stroke="#FC4C02" stroke-width="3" stroke-linecap="round"/>
                <circle cx="28" cy="100" r="22" fill="rgba(11,158,110,0.12)" stroke="#0B9E6E" stroke-dasharray="4 3" stroke-width="1.4"/>
                <circle cx="210" cy="38" r="22" fill="rgba(11,158,110,0.12)" stroke="#0B9E6E" stroke-dasharray="4 3" stroke-width="1.4"/>
                <text x="8" y="122" font-size="8.5" fill="#0B9E6E" font-weight="700">Start 500m hidden</text>
                <text x="148" y="16" font-size="8.5" fill="#0B9E6E" font-weight="700">End 500m hidden</text>
                <text x="80" y="34" font-size="9" fill="#0F1419" font-weight="700">Public Park Segment</text>
              </svg>
            </div>
          </div>

          <div class="pitch-callout trust">
            <div class="callout-copy">
              <strong>Try the phone prototype:</strong> Switch marathons (Guangzhou / Shenzhen / Wuxi), filter by <strong>Women-Only</strong>, or tap <strong>Join Bus</strong> on the Canton Tower 5:00 pace train.
            </div>
            <button class="action-cta" id="pitchDemoFilterBtn">Filter Women-Only →</button>
          </div>
        </div>
      `;
    }

    // Chinese Chapter 2
    return `
      <div class="pitch-card">
        <div class="pitch-card-head">
          <div class="pitch-card-title">为什么过往「约跑 / 跑步搭子」App 很难长久？</div>
          <span class="pitch-card-sub">以赛带练重构社交信任</span>
        </div>
        <div class="compare-grid">
          <div class="compare-col">
            <div class="compare-head">传统陌生人约跑 App</div>
            <ul class="compare-list">
              <li>无目标漫无目的约跑，极易沦为相亲/擦边，赶走严肃跑者</li>
              <li>陌生人 1v1 线下见面，女性跑者安全焦虑极高</li>
              <li>工作时间、地点、配速差 30 秒即解散（「周抛型搭子」）</li>
              <li>纯个人打卡缺乏持续外部反馈，3 周后留存断崖下跌</li>
            </ul>
          </div>
          <div class="compare-col ours">
            <div class="compare-head" style="color:var(--trust)">领跑局 · 以赛带练模式</div>
            <ul class="compare-list">
              <li><strong>目标赛事锚定</strong>：先选广马/深马/锡马 + 目标完赛配速，天然筛选同频跑友</li>
              <li><strong>3–6人配速列车 + 女性专属局</strong>：多人公开拉练 + 起终点 500m 隐私模糊圈</li>
              <li><strong>异步跑步小任务</strong>：即使时间错开，也能共同完成双人全马接力 / 公园错峰击掌</li>
              <li><strong>个人自然沉淀入跑团</strong>：配速小队顺滑转化为跑团战队，拉满长周期留存</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="pitch-card">
        <div class="pitch-card-head">
          <div class="pitch-card-title">安全隐私与跑力背书设计</div>
          <span class="pitch-card-sub">Strava 级隐私标准</span>
        </div>
        <div style="display:grid;grid-template-columns:1.1fr 0.9fr;gap:14px;align-items:center;">
          <div style="font-size:12.5px;color:var(--ink-secondary);line-height:1.6;">
            <p style="margin-bottom:8px;"><strong style="color:var(--ink-primary);">1. 起终点 500m 隐私模糊圈：</strong>系统默认裁剪展示轨迹的起终点，绝不暴露跑者家庭住址或公司位置。</p>
            <p style="margin-bottom:8px;"><strong style="color:var(--ink-primary);">2. 真实跑力标签防「吹牛」：</strong>所有配速列车队长均展示 T1 手表历史平均配速与完赛成绩认证。</p>
            <p><strong style="color:var(--ink-primary);">3. 兴趣破冰而非纯卷速度：</strong>叠加 <code>#咖啡跑</code> <code>#早八打工人</code> <code>#跑后早茶局</code>，兼顾高阶破三与大众 400 完赛群体。</p>
          </div>
          <div style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:12px;padding:12px;">
            <svg viewBox="0 0 240 130" style="display:block;width:100%;height:auto;" aria-label="轨迹隐私模糊圈示意">
              <rect width="240" height="130" rx="8" fill="#FAFBFD"/>
              <path d="M22 102 C55 95, 65 40, 112 45 C158 50, 165 88, 214 34" fill="none" stroke="#FC4C02" stroke-width="3" stroke-linecap="round"/>
              <circle cx="28" cy="100" r="22" fill="rgba(11,158,110,0.12)" stroke="#0B9E6E" stroke-dasharray="4 3" stroke-width="1.4"/>
              <circle cx="210" cy="38" r="22" fill="rgba(11,158,110,0.12)" stroke="#0B9E6E" stroke-dasharray="4 3" stroke-width="1.4"/>
              <text x="12" y="122" font-size="9" fill="#0B9E6E" font-weight="700">起点500m自动隐藏</text>
              <text x="148" y="16" font-size="9" fill="#0B9E6E" font-weight="700">终点500m自动隐藏</text>
              <text x="86" y="34" font-size="9.5" fill="#0F1419" font-weight="700">海心沙公开赛段</text>
            </svg>
          </div>
        </div>

        <div class="pitch-callout trust">
          <div class="callout-copy">
            <strong>去右侧手机试试：</strong>切换「广马 / 深马 / 锡马」，点击筛选「仅限女性局」或点击「申请上车」加入海心沙 500 配速列车。
          </div>
          <button class="action-cta" id="pitchDemoFilterBtn">高亮女性友好局 →</button>
        </div>
      </div>
    `;
  }

  // Chapter 3
  function renderChapter3() {
    const sorted = [...D().algoCompare].sort((a, b) =>
      state.algoMode === "fair" ? b.fairScore - a.fairScore : b.rawKm - a.rawKm
    );
    const maxVal = state.algoMode === "fair" ? 100 : 12500;
    const isCheat = state.telemetryMode === "cheat";

    const telemetrySvg = isCheat
      ? `
        <svg viewBox="0 0 360 95" width="100%" height="95">
          <line x1="0" y1="75" x2="360" y2="75" stroke="#E5E7EB" stroke-width="1"/>
          <line x1="0" y1="40" x2="360" y2="40" stroke="#E5E7EB" stroke-dasharray="3 3" stroke-width="1"/>
          <path d="M10 22 L70 20 L140 21 L220 19 L290 21 L350 20" fill="none" stroke="#DC2626" stroke-width="2.6"/>
          <path d="M10 74 L350 74" fill="none" stroke="#9CA3AF" stroke-width="2.2" stroke-dasharray="5 3"/>
          <text x="12" y="14" font-size="9.5" fill="#DC2626" font-weight="700">${
            isEN() ? "Flat high speed: 16.5 km/h (3'38\"/km — bike-like)" : "异常高速平滑曲线: 16.5 km/h (配速 3'38\")"
          }</text>
          <text x="12" y="68" font-size="9.5" fill="#6B7280" font-weight="700">${
            isEN() ? "IMU Cadence sensor: 0 spm (zero vertical running bounce)" : "手机/手表步频传感器读数: 0 spm（无跑步垂直振幅）"
          }</text>
        </svg>
      `
      : `
        <svg viewBox="0 0 360 95" width="100%" height="95">
          <line x1="0" y1="75" x2="360" y2="75" stroke="#E5E7EB" stroke-width="1"/>
          <line x1="0" y1="40" x2="360" y2="40" stroke="#E5E7EB" stroke-dasharray="3 3" stroke-width="1"/>
          <path d="M10 48 Q45 42 80 45 T150 41 T220 44 T290 38 T350 34" fill="none" stroke="#FC4C02" stroke-width="2.4"/>
          <path d="M10 30 Q45 27 80 29 T150 26 T220 28 T290 25 T350 23" fill="none" stroke="#0B9E6E" stroke-width="2.2"/>
          <text x="12" y="16" font-size="9.5" fill="#0B9E6E" font-weight="700">${
            isEN() ? "Steady cadence: 178–182 spm (correlated with stride)" : "步频稳定律动: 178–182 spm（与速度强正相关）"
          }</text>
          <text x="12" y="66" font-size="9.5" fill="#FC4C02" font-weight="700">${
            isEN() ? "Natural pace: 4'56\"/km · HR climbing smoothly to 154 bpm" : "自然配速曲线: 4'56\"/km · 心率同步上升至 154 bpm"
          }</text>
        </svg>
      `;

    return `
      <div class="pitch-card">
        <div class="pitch-card-head">
          <div class="pitch-card-title">${isEN() ? "Fair Scoring Simulator (Toggle to compare)" : "公平算法实验器（点击切换对比）"}</div>
          <div class="seg-group">
            <button class="seg-btn ${state.algoMode === "fair" ? "active" : ""}" data-algo="fair">${isEN() ? "Our Fair Score" : "我们的公平算法"}</button>
            <button class="seg-btn ${state.algoMode === "raw" ? "active" : ""}" data-algo="raw">${isEN() ? "Naive Total km" : "传统比总里程"}</button>
          </div>
        </div>

        <div class="algo-formula">
          <span>${
            isEN()
              ? "Club Score = 10% Trimmed Avg × Active Rate × Size Smooth × (1 + Group-Run Buff)"
              : "跑团战力 = 10%截尾人均分 × 有效活跃率 × 规模平滑系数 × (1 + 合跑加成)"
          }</span>
          <span style="color:var(--accent);font-weight:700;white-space:nowrap;">${isEN() ? "25km / day cap" : "单人日封顶 25km"}</span>
        </div>

        <div>
          ${sorted
            .map((item, idx) => {
              const val = state.algoMode === "fair" ? item.fairScore : item.rawKm;
              const pct = Math.min(100, Math.round((val / maxVal) * 100));
              const isHighlight = item.name.includes("广州天河") || item.name.includes("Tianhe");
              return `
                <div class="sim-row">
                  <div class="sim-row-top">
                    <div class="sim-club-meta">
                      <span class="sim-rank ${idx === 0 ? "top1" : ""}">${idx + 1}</span>
                      <strong>${item.name}</strong>
                      <span class="sim-tag">${item.meta}</span>
                    </div>
                    <strong class="mono">${
                      state.algoMode === "fair"
                        ? item.fairScore.toFixed(1) + (isEN() ? " pts" : " 分")
                        : item.rawKm.toLocaleString() + " km"
                    }</strong>
                  </div>
                  <div class="sim-bar-track">
                    <div class="sim-bar-fill ${isHighlight ? "accent" : idx === 0 ? "" : "muted"}" style="width:${pct}%"></div>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
        <div style="font-size:12px;color:var(--ink-secondary);margin-top:8px;">
          ${
            state.algoMode === "fair"
              ? isEN()
                ? "✓ <strong>Fair outcome</strong>: High-engagement clubs beat lurker-heavy 320-member groups AND 3-person alt-account farms. Plus weight-class divisions (10–30 / 31–100 / 100+)."
                : "✓ <strong>结果公正</strong>：小而精、活跃率 91% 的真跑团稳居第一；僵尸粉大群和 3 人刷榜小号均被压制，且按「尖兵 / 劲旅 / 巨无霸」分重量级发奖。"
              : isEN()
                ? "⚠ <strong>Naive mileage flaw</strong>: Total km lets any sleepy 320-person mega-group steamroll tight, active clubs — killing motivation in week 1."
                : "⚠ <strong>传统弊端</strong>：纯拼总里程会被 320 人僵尸大群绝对碾压，中小精英团毫无胜算，迅速丧失参赛意愿。"
          }
        </div>
      </div>

      <div class="pitch-card">
        <div class="pitch-card-head">
          <div class="pitch-card-title">${isEN() ? "4-Layer Anti-Cheat Telemetry (Protecting Brand Perks)" : "四道防作弊风控透视（保护引擎鸟折扣池）"}</div>
          <div class="seg-group">
            <button class="seg-btn ${isCheat ? "active" : ""}" data-tm="cheat">${isEN() ? "Bike Spoof Caught" : "拦截骑车代跑"}</button>
            <button class="seg-btn ${!isCheat ? "active" : ""}" data-tm="normal">${isEN() ? "Valid Run Pass" : "正常跑步绿灯"}</button>
          </div>
        </div>

        <div class="telemetry-box">
          ${telemetrySvg}
          <div class="telemetry-metrics">
            <div class="tm-cell">
              <div class="tm-k">${isEN() ? "Avg Pace" : "平均配速"}</div>
              <div class="tm-v ${isCheat ? "bad" : "good"}">${isCheat ? "3'38\"" : "4'56\""}</div>
            </div>
            <div class="tm-cell">
              <div class="tm-k">${isEN() ? "IMU Cadence" : "传感器步频"}</div>
              <div class="tm-v ${isCheat ? "bad" : "good"}">${isCheat ? "0 spm" : "180 spm"}</div>
            </div>
            <div class="tm-cell">
              <div class="tm-k">${isEN() ? "Avg HR" : "平均心率"}</div>
              <div class="tm-v ${isCheat ? "bad" : "good"}">${isCheat ? "91 bpm" : "154 bpm"}</div>
            </div>
            <div class="tm-cell">
              <div class="tm-k">${isEN() ? "Verdict" : "风控判定"}</div>
              <div class="tm-v ${isCheat ? "bad" : "good"}">${
                isCheat ? (isEN() ? "Blocked" : "拦截+连坐") : isEN() ? "T1 Pass" : "T1 通过"
              }</div>
            </div>
          </div>
        </div>

        <div class="pitch-callout">
          <div class="callout-copy">
            ${
              isEN()
                ? "<strong>Club Accountability:</strong> 48h public audit window. Confirmed bike-cheating triggers a 3× point deduction &amp; freezes the club's monthly discount — peer pressure polices the league."
                : "<strong>跑团连坐机制：</strong>月榜设 48 小时公示举报期，若查实成员骑车刷榜，扣除 3 倍积分并冻结全团当月折扣——用熟人社会压力实现极低成本自治。"
            }
          </div>
          <button class="action-cta" id="pitchTestCheatBtn">${isEN() ? "Trigger Block in Phone →" : "在手机端触发拦截 →"}</button>
        </div>
      </div>
    `;
  }

  // Chapter 4
  function renderChapter4() {
    const { sport, km } = state.eepInput;
    const eqRun = sport === "swim" ? km * 4 : sport === "bike" ? km / 3 : km;
    const eep = Math.round(eqRun * 10);

    return `
      <div class="pitch-card">
        <div class="pitch-card-head">
          <div class="pitch-card-title">${
            isEN() ? "'Run Super' Dual-Track Format: Stopping Megacity Domination" : "「跑超」双轨赛制：破除大城市人口碾压"
          }</div>
          <span class="pitch-card-sub">${isEN() ? "21 Cities → Top 3 Represent Province" : "广东 21 城海选 → Top 3 出线战全国"}</span>
        </div>

        <div class="kpi-grid" style="margin-bottom:12px;">
          <div class="kpi-box">
            <div class="kpi-label">${isEN() ? "City Core Squad (75%)" : "城市主力分（权重 75%）"}</div>
            <div class="kpi-num accent">Top 100</div>
            <div class="kpi-note">${isEN() ? "Top 100 runners / 5 clubs per city — Zhuhai can upset Guangzhou" : "取每城前 100 名主力/前5团，珠海佛山可掀翻广深"}</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">${isEN() ? "Citizen Home Buff (25%)" : "全民助威分（权重 25%）"}</div>
            <div class="kpi-num trust">+Buff</div>
            <div class="kpi-note">${isEN() ? "Any casual 3km jog adds energy to your hometown bar" : "普通市民跑 3km 即可为家乡点亮助威能量条"}</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">${isEN() ? "Inter-Province Finals" : "省际巅峰对决"}</div>
            <div class="kpi-num">${isEN() ? "GD vs JS" : "粤 vs 苏"}</div>
            <div class="kpi-note">${isEN() ? "Guangdong vs Jiangsu fuels viral hometown memes &amp; pride" : "广东(广深佛) 对决 江苏(宁苏锡) 引爆地域玩梗"}</div>
          </div>
        </div>

        <div class="week-grid">
          <div class="week-card">
            <div class="week-num">WEEK 1</div>
            <div class="week-name">${isEN() ? "City Roll-Call" : "全城起跑周"}</div>
            <div class="week-desc">${isEN() ? "Recruit friends &amp; charge up your hometown buff" : "拉人组队、点亮城市全民助威能量条"}</div>
          </div>
          <div class="week-card">
            <div class="week-num">WEEK 2</div>
            <div class="week-name">${isEN() ? "Dawn Raid" : "黎明突袭周"}</div>
            <div class="week-desc">${isEN() ? "1.3× bonus points for 5:00–7:30 AM morning runs" : "清晨 5:00–7:30 打卡享 1.3 倍积分加成"}</div>
          </div>
          <div class="week-card">
            <div class="week-num">WEEK 3</div>
            <div class="week-name">${isEN() ? "Rival Derby" : "宿敌德比周"}</div>
            <div class="week-desc">${isEN() ? "GZ vs SZ / Nanjing vs Suzhou 1v1 — winner steals 5%" : "广深/宁苏捉对单挑，胜者夺取 5% 积分"}</div>
          </div>
          <div class="week-card">
            <div class="week-num">WEEK 4</div>
            <div class="week-name">${isEN() ? "Final Sprint" : "百团决战日"}</div>
            <div class="week-desc">${isEN() ? "2× weekend group runs + offline coffee/dim-sum parties" : "周末公园合跑双倍分 + 线下早茶/咖啡狂欢"}</div>
          </div>
        </div>
      </div>

      <div class="pitch-card">
        <div class="pitch-card-head">
          <div class="pitch-card-title">${
            isEN() ? "Multi-Sport Expansion: Cycling & Swimming Teams Join via EEP" : "未来耐力三项扩展：骑行车队 & 游泳团「等效换算」入赛"
          }</div>
          <span class="pitch-card-sub">${isEN() ? "Unified EEP Engine · 3× TAM" : "统一 EEP 积分 · 市场天花板 ×3"}</span>
        </div>

        <div style="font-size:12.5px;color:var(--ink-secondary);margin-bottom:10px;">
          ${
            isEN()
              ? "Built on triathlon metabolic equivalency (EEP) from Day 1 — <strong>road cycling pelotons &amp; swim clubs convert distance straight into city league points</strong>, tapping China's highest-spending endurance middle class:"
              : "底层采用国际铁人三项能量负荷基准换算，未来无需另起炉灶，<strong>公路车队、游泳俱乐部可直接转化积分加入城市 PK 榜</strong>，直接切入高净值中产装备人群："
          }
        </div>

        <div class="eep-bar" style="margin-bottom:12px;">
          <div class="eep-pill">
            <span class="eep-sport">🏊 ${isEN() ? "Swim 1 km" : "游泳 1 km"}</span>
            <span class="eep-val">= 40 EEP (${isEN() ? "4km run" : "4km跑"})</span>
          </div>
          <div class="eep-pill">
            <span class="eep-sport">🏃 ${isEN() ? "Run 4 km" : "跑步 4 km"}</span>
            <span class="eep-val">= 40 EEP (${isEN() ? "base" : "基准"})</span>
          </div>
          <div class="eep-pill">
            <span class="eep-sport">🚴 ${isEN() ? "Bike 12 km" : "骑行 12 km"}</span>
            <span class="eep-val">= 40 EEP (3:1)</span>
          </div>
        </div>

        <div style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:12px;padding:12px 14px;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;flex-wrap:wrap;">
            <span style="font-size:12px;font-weight:700;">${
              isEN() ? "Live EEP Converter (Test a cycling/swim session):" : "实时换算模拟（试算车队/泳队单次贡献）："
            }</span>
            <div class="seg-group">
              <button class="seg-btn ${sport === "bike" ? "active" : ""}" data-eep-sport="bike">🚴 ${isEN() ? "Cycling" : "骑行车队"}</button>
              <button class="seg-btn ${sport === "swim" ? "active" : ""}" data-eep-sport="swim">🏊 ${isEN() ? "Swimming" : "游泳团队"}</button>
              <button class="seg-btn ${sport === "run" ? "active" : ""}" data-eep-sport="run">🏃 ${isEN() ? "Running" : "跑步团"}</button>
            </div>
          </div>

          <div class="slider-field" style="margin-bottom:10px;">
            <label>
              <span>${
                isEN()
                  ? `Session distance (${sport === "bike" ? "Road cycling" : sport === "swim" ? "Pool / open water" : "Road run"})`
                  : `单次有效距离（${sport === "bike" ? "公路骑行" : sport === "swim" ? "泳池/公开水域" : "路跑"}）`
              }</span>
              <strong id="eepKmLabel">${km} km</strong>
            </label>
            <input type="range" id="eepKmSlider"
              min="${sport === "swim" ? 0.5 : sport === "bike" ? 6 : 2}"
              max="${sport === "swim" ? 10 : sport === "bike" ? 120 : 42}"
              step="${sport === "swim" ? 0.5 : sport === "bike" ? 3 : 1}"
              value="${km}" />
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;font-size:12.5px;flex-wrap:wrap;gap:6px;">
            <span style="color:var(--ink-secondary);">${isEN() ? "Run-equivalent distance:" : "换算为城市赛等效跑量："} <strong class="mono" style="color:var(--ink-primary);font-size:14px;">${eqRun.toFixed(1)} km</strong></span>
            <span style="color:var(--ink-secondary);">${isEN() ? "City league points earned:" : "为所在城市战队贡献："} <strong class="mono" style="color:var(--accent);font-size:15px;">+${eep} EEP</strong></span>
          </div>
        </div>

        <div class="pitch-callout">
          <div class="callout-copy">
            ${
              isEN()
                ? "<strong>Try it on the right:</strong> Switch to <strong>GD vs JS Finals</strong> in City PK, or tap below to preview our <strong>Multi-Sport Fusion Leaderboard</strong> (Run + Bike + Swim clubs together)!"
                : "<strong>右侧实时切换：</strong>去手机里切到「全国省际巅峰」看粤苏对决，或点击下方按钮在跑团榜里一键开启<strong>「耐力三项融合榜（含骑行车队与泳队）」</strong>！"
            }
          </div>
          <button class="action-cta orange" id="pitchShowMultiSportBtn">${isEN() ? "View Multi-Sport League →" : "看三项融合榜 →"}</button>
        </div>
      </div>
    `;
  }

  // Chapter 5
  function renderChapter5() {
    const r = state.roi;
    const qualifiedRunners = r.clubs * r.activePerClub;
    const buyers = Math.round(qualifiedRunners * (r.convRate / 100));
    const monthlyGMV = buyers * r.aov;
    const brandGrossProfit = monthlyGMV * (r.grossMargin / 100);
    const platformCps = monthlyGMV * (r.cpsRate / 100);
    const brandNetProfit = brandGrossProfit - platformCps;
    const adCostSaved = buyers * 115;

    return `
      <div class="pitch-card">
        <div class="pitch-card-head">
          <div class="pitch-card-title">${
            isEN() ? "Win-Win Brand Architecture for Engine Bird" : "引擎鸟专属共赢机制（专为鸟叔打消 2 大顾虑）"
          }</div>
          <span class="pitch-card-sub">${isEN() ? "$0 Upfront · Positive Cashflow" : "零现金预付 · 跑通正现金流"}</span>
        </div>
        <div class="pitch-bullets">
          <div class="bullet-card">
            <h4>${isEN() ? "1. Protect Public Pricing (Private Store Only)" : "1. 严守公域控价，只走有赞私域"}</h4>
            <p>${
              isEN()
                ? "Never discount publicly on Tmall/JD. Personal single-use VIP codes redeem inside Engine Bird's private WeChat store."
                : "绝不在天猫/京东公开低价，所有团购内购码均为单人加密券，小程序一键跳转引擎鸟有赞微商城核销。"
            }</p>
          </div>
          <div class="bullet-card">
            <h4>${isEN() ? "2. Proof-of-Run Filters Freeloaders" : "2. Proof-of-Run 彻底过滤羊毛党"}</h4>
            <p>${
              isEN()
                ? "Only T1 watch-verified runners logging ≥30km/month unlock VIP codes — every discounted short lands on a real club KOL."
                : "必须当月实跑 ≥30km 的 T1 认证跑者才解锁内购资格，确保每一件折扣装备都穿在跑团核心 KOL 身上。"
            }</p>
          </div>
          <div class="bullet-card">
            <h4>${isEN() ? "3. Champion Jerseys Turn Discounts into Merch" : "3. 「冠军省战袍」从打折变爆品"}</h4>
            <p>${
              isEN()
                ? "Limited 'GD CHAMPS · GUANGZHOU' singlets give runners city pride to buy & wear at marathons — free walking billboards."
                : "粤跑冠军·广州等定制印字版龙鳞速干 T，兼具高情绪价值与赛道活广告效应，跑者愿意抢单分享。"
            }</p>
          </div>
          <div class="bullet-card">
            <h4>${isEN() ? "4. Founder's R&D Beta Testing Lab" : "4. 鸟叔新品众测实验室"}</h4>
            <p>${
              isEN()
                ? "Top 50 high-mileage runners each month test unreleased prototypes, feeding real wear-test data & reviews back to Engine Bird."
                : "把月榜 Top 50 硬核跑者变成引擎鸟未上市短裤/越野鞋套/运动内衣的路测官，反哺研发与小红书口碑。"
            }</p>
          </div>
        </div>
      </div>

      <div class="pitch-card">
        <div class="pitch-card-head">
          <div class="pitch-card-title">${isEN() ? "Live Interactive Monthly Partner ROI Calculator" : "实时交互式 · 引擎鸟合作单月 ROI 测算器"}</div>
          <span class="pitch-card-sub">${isEN() ? "Drag sliders · USD (1 USD ≈ ¥7.2)" : "拖动滑块当场算账"}</span>
        </div>

        <div class="roi-sliders">
          <div class="slider-field">
            <label>
              <span>${isEN() ? "Partner Run Clubs (Pilot → Multi-Province)" : "合作活跃跑团数（广东试点 → 多省）"}</span>
              <strong id="vClubs">${r.clubs}${isEN() ? " clubs" : " 团"}</strong>
            </label>
            <input type="range" data-roi="clubs" min="10" max="150" step="5" value="${r.clubs}" />
          </div>
          <div class="slider-field">
            <label>
              <span>${isEN() ? "Verified ≥30km Runners / Club" : "单团月跑 ≥30km 达标人数"}</span>
              <strong id="vActive">${r.activePerClub}${isEN() ? " / club" : " 人/团"}</strong>
            </label>
            <input type="range" data-roi="activePerClub" min="20" max="100" step="5" value="${r.activePerClub}" />
          </div>
          <div class="slider-field">
            <label>
              <span>${isEN() ? "VIP Store Conversion Rate" : "达标跑者私域下单转化率"}</span>
              <strong id="vConv">${r.convRate}%</strong>
            </label>
            <input type="range" data-roi="convRate" min="10" max="40" step="1" value="${r.convRate}" />
          </div>
          <div class="slider-field">
            <label>
              <span>${isEN() ? "Avg Order Value (Engine Bird)" : "引擎鸟私域内购平均客单价"}</span>
              <strong id="vAov">${isEN() ? `$${Math.round(r.aov / USD_RATE)} (¥${r.aov})` : `¥${r.aov}`}</strong>
            </label>
            <input type="range" data-roi="aov" min="220" max="800" step="20" value="${r.aov}" />
          </div>
        </div>

        <div class="roi-outputs">
          <div class="roi-out-box">
            <div class="roi-out-k">${isEN() ? "Qualified Runners" : "精准达标跑者"}</div>
            <div class="roi-out-v" id="outRunners">${qualifiedRunners.toLocaleString()}${isEN() ? "" : "人"}</div>
          </div>
          <div class="roi-out-box highlight">
            <div class="roi-out-k">${isEN() ? "Monthly Private GMV" : "月增量私域 GMV"}</div>
            <div class="roi-out-v" id="outGmv">${fmtMoney(monthlyGMV)}</div>
          </div>
          <div class="roi-out-box">
            <div class="roi-out-k">${isEN() ? "Brand Net Margin" : "引擎鸟预估净毛利"}</div>
            <div class="roi-out-v" style="color:var(--trust)" id="outProfit">${fmtMoney(brandNetProfit)}</div>
          </div>
          <div class="roi-out-box">
            <div class="roi-out-k">${isEN() ? "Paid-Ad CAC Saved" : "省下投流获客费"}</div>
            <div class="roi-out-v" id="outSaved">${fmtMoney(adCostSaved)}</div>
          </div>
        </div>

        <div style="font-size:11.5px;color:var(--ink-muted);margin-top:10px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;">
          <span>${
            isEN()
              ? `Assumptions: ${r.grossMargin}% gross margin · ${r.cpsRate}% platform CPS (<strong class="mono" id="outCps" style="color:var(--ink-primary)">${fmtMoney(platformCps)}</strong>/mo · GMV <strong class="mono" id="outGmvRmb" style="color:var(--ink-primary)">${fmtRmbShort(monthlyGMV)}</strong>)`
              : `测算口径：折后毛利率 ${r.grossMargin}% ｜ 平台 CPS 分佣 ${r.cpsRate}%（月佣金约 <strong class="mono" id="outCps" style="color:var(--ink-primary)">${fmtMoney(platformCps)}</strong>）`
          }</span>
          <span>${isEN() ? "Monthly orders:" : "月成交单量："} <strong class="mono" id="outBuyers" style="color:var(--ink-primary)">${buyers.toLocaleString()}${isEN() ? "" : " 单"}</strong></span>
        </div>

        <div class="pitch-callout trust">
          <div class="callout-copy">
            ${
              isEN()
                ? "<strong>90-Day Pilot Ask:</strong> Zero cash sponsorship from Engine Bird — just <strong>30 MVP gear prizes + private VIP quota</strong> while we onboard 20 Guangdong seed clubs to prove conversion!"
                : "<strong>首期 90 天试点建议：</strong>引擎鸟零现金赞助，仅提供 <strong>30 件 MVP 实物奖品 + 有赞私域内购配额</strong>，我们用 20 个广东种子跑团跑通真实转化数据！"
            }
          </div>
          <button class="action-cta orange" id="pitchUnlockNowBtn">${
            state.user.monthlyKm >= state.user.targetKm
              ? isEN()
                ? "Open VIP Code →"
                : "查看已解锁券 →"
              : isEN()
                ? "Simulate 30km Unlock →"
                : "一键达标解锁 →"
          }</button>
        </div>
      </div>
    `;
  }

  function bindPitchEvents() {
    el.pitchContent.querySelectorAll("[data-tier]").forEach((node) => {
      node.addEventListener("click", () => {
        state.selectedTier = node.dataset.tier;
        renderPitch();
      });
    });

    const openSyncBtn = document.getElementById("pitchOpenSyncBtn");
    if (openSyncBtn) openSyncBtn.addEventListener("click", openSyncModal);

    const demoFilterBtn = document.getElementById("pitchDemoFilterBtn");
    if (demoFilterBtn) {
      demoFilterBtn.addEventListener("click", () => {
        state.phoneTab = "match";
        state.paceFilter = "female";
        renderPhone();
        showToast(isEN() ? "Filtered: Verified Women-Only Pace Squads" : "已筛选：女性实名认证专属配速小队");
      });
    }

    el.pitchContent.querySelectorAll("[data-algo]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.algoMode = btn.dataset.algo;
        renderPitch();
      });
    });

    el.pitchContent.querySelectorAll("[data-tm]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.telemetryMode = btn.dataset.tm;
        renderPitch();
      });
    });

    const testCheatBtn = document.getElementById("pitchTestCheatBtn");
    if (testCheatBtn) {
      testCheatBtn.addEventListener("click", () => {
        openSyncModal();
        setTimeout(() => runSyncSample("sync_cheat"), 180);
      });
    }

    el.pitchContent.querySelectorAll("[data-eep-sport]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sp = btn.dataset.eepSport;
        state.eepInput.sport = sp;
        state.eepInput.km = sp === "swim" ? 2.5 : sp === "bike" ? 36 : 10;
        renderPitch();
      });
    });

    const eepSlider = document.getElementById("eepKmSlider");
    if (eepSlider) {
      eepSlider.addEventListener("input", (e) => {
        state.eepInput.km = Number(e.target.value);
        renderPitch();
      });
    }

    const showMsBtn = document.getElementById("pitchShowMultiSportBtn");
    if (showMsBtn) {
      showMsBtn.addEventListener("click", () => {
        state.phoneTab = "clubs";
        state.clubDivision = "multisport";
        renderPhone();
        showToast(
          isEN()
            ? "Multi-Sport Fusion On: Run + Cycling + Swim Clubs"
            : "已开启：跑步 + 骑行车队 + 游泳团融合排位榜"
        );
      });
    }

    el.pitchContent.querySelectorAll("input[data-roi]").forEach((slider) => {
      slider.addEventListener("input", (e) => {
        state.roi[e.target.dataset.roi] = Number(e.target.value);
        updateRoiReadouts();
      });
    });

    const unlockNowBtn = document.getElementById("pitchUnlockNowBtn");
    if (unlockNowBtn) {
      unlockNowBtn.addEventListener("click", () => {
        state.phoneTab = "perks";
        if (state.user.monthlyKm < state.user.targetKm) {
          applyValidActivity(D().syncSamples[0]);
        } else {
          renderPhone();
          openCouponSheet(D().engineBirdPerks[0]);
        }
      });
    }
  }

  function updateRoiReadouts() {
    const r = state.roi;
    const qualifiedRunners = r.clubs * r.activePerClub;
    const buyers = Math.round(qualifiedRunners * (r.convRate / 100));
    const monthlyGMV = buyers * r.aov;
    const brandGrossProfit = monthlyGMV * (r.grossMargin / 100);
    const platformCps = monthlyGMV * (r.cpsRate / 100);
    const brandNetProfit = brandGrossProfit - platformCps;
    const adCostSaved = buyers * 115;

    const set = (id, text) => {
      const node = document.getElementById(id);
      if (node) node.textContent = text;
    };
    set("vClubs", r.clubs + (isEN() ? " clubs" : " 团"));
    set("vActive", r.activePerClub + (isEN() ? " / club" : " 人/团"));
    set("vConv", r.convRate + "%");
    set("vAov", isEN() ? `$${Math.round(r.aov / USD_RATE)} (¥${r.aov})` : `¥${r.aov}`);
    set("outRunners", qualifiedRunners.toLocaleString() + (isEN() ? "" : "人"));
    set("outGmv", fmtMoney(monthlyGMV));
    set("outProfit", fmtMoney(brandNetProfit));
    set("outSaved", fmtMoney(adCostSaved));
    set("outCps", fmtMoney(platformCps));
    set("outGmvRmb", fmtRmbShort(monthlyGMV));
    set("outBuyers", buyers.toLocaleString() + (isEN() ? "" : " 单"));
  }

  // =========================================================================
  // Render Right Pane: Live Phone Prototype
  // =========================================================================
  function updatePorBar() {
    const km = state.user.monthlyKm;
    const pct = Math.min(100, Math.round((km / state.user.targetKm) * 100));
    const unlocked = km >= state.user.targetKm;

    el.porMileageText.textContent = km.toFixed(1);
    el.porMileageText.classList.toggle("unlocked", unlocked);
    el.porProgressFill.style.width = pct + "%";
    el.porProgressFill.classList.toggle("unlocked", unlocked);
    el.perksTabBadge.style.display = unlocked ? "inline-block" : "none";
  }

  function renderPhone() {
    updatePorBar();
    const t = T();

    el.phoneTabbar.querySelectorAll(".tab-item").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === state.phoneTab);
    });

    el.wxNavTitle.textContent = t.tabTitles[state.phoneTab] || "PACELAB";

    if (state.phoneTab === "match") renderPhoneMatch();
    else if (state.phoneTab === "clubs") renderPhoneClubs();
    else if (state.phoneTab === "pk") renderPhonePk();
    else if (state.phoneTab === "perks") renderPhonePerks();

    el.phoneBody.scrollTop = 0;
  }

  // Tab 1: Match
  function renderPhoneMatch() {
    const allSquads = D().squads;
    const filteredSquads = allSquads.filter((sq) => {
      if (sq.raceId !== state.selectedRaceId) return false;
      if (state.paceFilter === "female") return sq.femaleOnly;
      if (state.paceFilter !== "all") return sq.paceBucket === state.paceFilter;
      return true;
    });
    const displaySquads = filteredSquads.length
      ? filteredSquads
      : allSquads.filter((sq) => sq.raceId === state.selectedRaceId);

    el.phoneBody.innerHTML = `
      <div class="m-section-head">
        <span class="m-section-title">${isEN() ? "Pick Your Next Marathon" : "选择你的下一场马拉松"}</span>
        <span class="m-section-sub">${isEN() ? "600+ China Races" : "聚合全国 600+ 赛事"}</span>
      </div>

      <div class="race-scroller">
        ${D()
          .races.map(
            (r) => `
          <button class="race-chip ${r.id === state.selectedRaceId ? "active" : ""}" data-race="${r.id}">
            <div class="race-chip-top">
              <span>${r.date}</span>
              <span class="race-countdown">${r.countdown}</span>
            </div>
            <div class="race-chip-name">${r.name}</div>
            <div class="race-chip-meta">${r.runners}</div>
          </button>
        `
          )
          .join("")}
      </div>

      <div class="m-section-head">
        <span class="m-section-title">${isEN() ? "Pace Trains & Training Pods" : "目标配速列车 & 备赛小队"}</span>
        <span class="m-section-sub">${isEN() ? "Pace + Vibe Match" : "按配速/兴趣精准匹配"}</span>
      </div>

      <div class="pill-row">
        <button class="m-pill ${state.paceFilter === "all" ? "active" : ""}" data-pf="all">${isEN() ? "All Paces" : "全部配速"}</button>
        <button class="m-pill ${state.paceFilter === "sub300" ? "active" : ""}" data-pf="sub300">${isEN() ? "Sub-3:00 (4'15\")" : "破300 (4'15\")"}</button>
        <button class="m-pill ${state.paceFilter === "sub330" ? "active" : ""}" data-pf="sub330">${isEN() ? "Sub-3:30 (5'00\")" : "破330 (5'00\")"}</button>
        <button class="m-pill ${state.paceFilter === "sub400" ? "active" : ""}" data-pf="sub400">${isEN() ? "Sub-4:00 (5'40\")" : "破400 (5'40\")"}</button>
        <button class="m-pill ${state.paceFilter === "female" ? "active" : ""}" data-pf="female">${isEN() ? "Women Only" : "女性认证局"}</button>
      </div>

      ${displaySquads
        .map((sq) => {
          const isJoined = state.joinedSquadIds.has(sq.id);
          const members = isJoined && !sq.joined ? [...sq.members, T().meChar] : sq.members;
          const displayCount = isJoined ? Math.min(sq.capacity, members.length) : sq.joined ? Math.max(1, sq.members.length - 1) : sq.members.length;
          return `
        <div class="m-card">
          <div class="squad-top">
            <div class="squad-title">${sq.title}</div>
            <span class="pace-tag">${sq.pace}</span>
          </div>
          <div class="squad-meta">
            <span>📍 ${sq.spot}</span>
            <span>🕒 ${sq.time}</span>
          </div>
          <div class="tag-row">
            ${sq.tags
              .map(
                (tag) =>
                  `<span class="mini-tag ${
                    tag.includes("女性") || tag.includes("Women")
                      ? "female"
                      : tag.includes("T1") || tag.includes("脱敏") || tag.includes("Privacy")
                        ? "trust"
                        : ""
                  }">${tag}</span>`
              )
              .join("")}
          </div>
          <div class="squad-foot">
            <div class="avatar-stack">
              ${members.slice(0, 5).map((m) => `<span class="avatar-dot">${m}</span>`).join("")}
              <span class="avatar-count">${displayCount}/${sq.capacity} · ${sq.leader}</span>
            </div>
            <button class="join-btn ${isJoined ? "joined" : ""}" data-join-squad="${sq.id}">
              ${isJoined ? (isEN() ? "Joined ✓" : "已上车 ✓") : isEN() ? "Join Bus" : "申请上车"}
            </button>
          </div>
        </div>
      `;
        })
        .join("")}

      <div class="m-section-head">
        <span class="m-section-title">${isEN() ? "Weekly Async Micro-Quests" : "本周异步跑步小任务"}</span>
        <span class="m-section-sub">${isEN() ? "Run anytime together" : "错峰也能和搭子互动"}</span>
      </div>

      ${D()
        .quests.map((q) => {
          const accepted = state.acceptedQuestIds.has(q.id);
          return `
        <div class="m-card">
          <div class="quest-row">
            <div class="quest-info">
              <h4>${q.title}</h4>
              <p>${q.desc} · <strong style="color:var(--accent)">${q.reward}</strong></p>
            </div>
            <button class="quest-btn ${accepted ? "active" : ""}" data-quest="${q.id}">
              ${accepted ? (isEN() ? "Active" : "进行中") : isEN() ? "Accept" : "领取任务"}
            </button>
          </div>
        </div>
      `;
        })
        .join("")}
    `;

    el.phoneBody.querySelectorAll("[data-race]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.selectedRaceId = btn.dataset.race;
        state.paceFilter = "all";
        renderPhoneMatch();
      });
    });

    el.phoneBody.querySelectorAll("[data-pf]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.paceFilter = btn.dataset.pf;
        renderPhoneMatch();
      });
    });

    el.phoneBody.querySelectorAll("[data-join-squad]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.joinSquad;
        if (state.joinedSquadIds.has(id)) {
          state.joinedSquadIds.delete(id);
          showToast(isEN() ? "Left this Pace Train" : "已退出该配速列车");
        } else {
          state.joinedSquadIds.add(id);
          showToast(isEN() ? "Joined Pace Train! WeChat squad invite ready" : "已加入配速列车！微信群卡片已生成");
        }
        renderPhoneMatch();
      });
    });

    el.phoneBody.querySelectorAll("[data-quest]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.quest;
        if (state.acceptedQuestIds.has(id)) {
          state.acceptedQuestIds.delete(id);
          showToast(isEN() ? "Quest paused" : "已取消任务");
        } else {
          state.acceptedQuestIds.add(id);
          showToast(isEN() ? "Quest accepted! Log runs to progress" : "已领取本周跑步小任务");
        }
        renderPhoneMatch();
      });
    });
  }

  // Tab 2: Clubs (with Multi-Sport Fusion Mode)
  function renderPhoneClubs() {
    const list = getClubList(state.clubDivision);
    const isMulti = state.clubDivision === "multisport";

    el.phoneBody.innerHTML = `
      <div class="league-banner">
        <div class="lb-kicker">PACELAB × ENGINE BIRD</div>
        <div class="lb-title">${
          isMulti
            ? isEN()
              ? "Greater Bay Multi-Sport Fusion League"
              : "大湾区「全耐力三项」战队融合榜"
            : isEN()
              ? "Guangdong Fall Run-Club League"
              : "广东秋季跑团公平排位赛"
        }</div>
        <div class="lb-sub">${
          isMulti
            ? isEN()
              ? "Cycling 3:1 · Swim 1:4 auto-converted to run-eq. points"
              : "骑行 3:1 · 游泳 1:4 自动折算等效跑量，车队与泳队同台竞技"
            : isEN()
              ? "Trimmed avg × Active rate × Group buff · Top 3 unlock VIP"
              : "截尾人均 × 活跃率 × 合跑加成 · Top 3 解锁引擎鸟私域内购码"
        }</div>
      </div>

      <div class="pill-row">
        <button class="m-pill ${state.clubDivision === "elite" ? "active" : ""}" data-div="elite">${isEN() ? "Small (10–30)" : "尖兵组 (10-30人)"}</button>
        <button class="m-pill ${state.clubDivision === "mid" ? "active" : ""}" data-div="mid">${isEN() ? "Mid (31–100)" : "劲旅组 (31-100人)"}</button>
        <button class="m-pill ${state.clubDivision === "mega" ? "active" : ""}" data-div="mega">${isEN() ? "Mega (100+)" : "巨无霸 (100+人)"}</button>
        <button class="m-pill ${state.clubDivision === "multisport" ? "active" : ""}" data-div="multisport">${isEN() ? "Bike & Swim Fusion ✨" : "骑行/游泳融合赛 ✨"}</button>
      </div>

      <div class="m-section-head">
        <span class="m-section-title">${isEN() ? "Live Standings (Tap to inspect math)" : "实时战力榜（点击查看公平算法拆解）"}</span>
        <span class="m-section-sub">${isEN() ? "48h Audit" : "48h 公示防作弊"}</span>
      </div>

      ${list
        .map(
          (c, i) => `
        <div class="m-card club-row" data-club-id="${c.id}">
          <div class="club-rank-box ${i === 0 ? "r1" : i === 1 ? "r2" : i === 2 ? "r3" : ""}">${i + 1}</div>
          <div class="club-main">
            <div class="club-name-line">
              <span class="club-name">${c.name}</span>
              <span class="club-city-tag">${c.city}</span>
              ${c.isUserClub ? `<span class="mini-tag trust">${isEN() ? "My Club" : "我的团"}</span>` : ""}
            </div>
            <div class="club-stats">
              ${
                c.sportBadge
                  ? `<strong style="color:var(--accent)">${c.sportBadge}</strong> · ${c.rawMetric}`
                  : isEN()
                    ? `${c.members} members · ${c.activeRate}% active · +${c.socialBonus}% group buff`
                    : `${c.members}人 · 活跃率 ${c.activeRate}% · 合跑加成 +${c.socialBonus}%`
              }
            </div>
          </div>
          <div class="club-score-col">
            <div class="club-score">${c.score.toFixed(1)}</div>
            <div class="club-perk-pill">${i < 3 ? (isEN() ? "VIP Unlocked" : "解锁内购") : isEN() ? "Beta Pool" : "众测池"}</div>
          </div>
        </div>
      `
        )
        .join("")}

      <div class="m-card" style="background:var(--bg-elevated);font-size:11.5px;color:var(--ink-secondary);line-height:1.55;">
        <strong style="color:var(--ink-primary);">${isEN() ? "Anti-Cheat Audit:" : "防作弊公示机制："}</strong> ${
          isEN()
            ? "Only T1 watch & T2 FIT telemetry count toward prizes. Any club can flag suspicious tracks during the 48h window — confirmed bike-cheating triggers a 3× penalty."
            : "本榜单仅计入 T1 手表直连与 T2 FIT 原始轨迹数据。如发现成员骑车/开车代跑，可点进战队详情一键举报，核实后触发 3 倍连坐扣分。"
        }
      </div>
    `;

    el.phoneBody.querySelectorAll("[data-div]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.clubDivision = btn.dataset.div;
        renderPhoneClubs();
      });
    });

    const activeDivPill = el.phoneBody.querySelector(".pill-row .m-pill.active");
    if (activeDivPill && activeDivPill.scrollIntoView) {
      activeDivPill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }

    el.phoneBody.querySelectorAll("[data-club-id]").forEach((card) => {
      card.addEventListener("click", () => {
        const club = list.find((c) => c.id === card.dataset.clubId);
        if (club) openClubDetailSheet(club);
      });
    });
  }

  // Tab 3: RunSuper PK
  function renderPhonePk() {
    const isProv = state.pkScope === "province";
    const cities = getCityList();
    const gz = cities[0];
    const sz = cities[1];
    const derbyLeftPct = Math.round((gz.total / (gz.total + sz.total)) * 100);

    const fn = getFinalsData();
    const natLeftPct = Math.round((fn.left.score / (fn.left.score + fn.right.score)) * 100);

    el.phoneBody.innerHTML = `
      <div class="pk-switch">
        <button class="pk-switch-btn ${isProv ? "active" : ""}" data-pk="province">${isEN() ? "Guangdong (21 Cities)" : "广东省内战 (21城)"}</button>
        <button class="pk-switch-btn ${!isProv ? "active" : ""}" data-pk="national">${isEN() ? "Finals (GD vs JS)" : "省际巅峰 (粤 vs 苏)"}</button>
      </div>

      ${
        isProv
          ? `
        <div class="derby-card">
          <div class="derby-badge">🔥 ${isEN() ? "WEEK 3 · RIVAL DERBY · WINNER STEALS 5% PTS" : "WEEK 3 · 广东宿敌德比战 · 胜者夺取 5% 积分"}</div>
          <div class="derby-vs-row">
            <div class="derby-side">
              <span class="derby-city">${gz.city}</span>
              <span class="derby-nick">${gz.nickname}</span>
              <span class="derby-score" style="color:var(--accent)">${gz.total.toFixed(1)}</span>
            </div>
            <span class="derby-vs">VS</span>
            <div class="derby-side right">
              <span class="derby-city">${sz.city}</span>
              <span class="derby-nick">${sz.nickname}</span>
              <span class="derby-score" style="color:var(--rival-blue)">${sz.total.toFixed(1)}</span>
            </div>
          </div>
          <div class="tug-bar">
            <div class="tug-left" style="width:${derbyLeftPct}%"></div>
          </div>
          <div class="derby-meme">
            💬 ${
              isEN()
                ? "Live Feed: 'Guangzhou surged +0.9 pts after a massive dawn run at Canton Tower! Shenzhen runners are panic-logging miles along Shenzhen Bay…'"
                : "实时战报：「广州靠海心沙早茶跑团清晨反超 0.9 分！深圳南山跑友正在深圳湾疯狂加班补跑中…」"
            }
          </div>
        </div>

        <div class="m-section-head">
          <span class="m-section-title">${isEN() ? "Guangdong City Standings" : "广东城市战力榜"}</span>
          <span class="m-section-sub">${isEN() ? "Top 3 advance to Nationals" : "前 3 城代表广东出战全国"}</span>
        </div>

        <div class="m-card" style="padding:4px 13px;">
          ${cities
            .map(
              (c, idx) => `
            <div class="city-row">
              <div class="club-rank-box ${idx === 0 ? "r1" : idx === 1 ? "r2" : idx === 2 ? "r3" : ""}">${idx + 1}</div>
              <div class="club-main">
                <div class="club-name-line">
                  <span class="club-name">${c.city} · ${c.nickname}</span>
                  ${c.qualified ? `<span class="city-qual-tag">${isEN() ? "Qualified" : "省队出线区"}</span>` : ""}
                </div>
                <div class="club-stats">${
                  isEN()
                    ? `Core 75%: ${c.squadScore} + Buff 25%: ${c.citizenBuff} · ${c.participants.toLocaleString()} runners`
                    : `主力75%: ${c.squadScore} + 助威25%: ${c.citizenBuff} · ${c.participants.toLocaleString()}人出战`
                }</div>
              </div>
              <div class="club-score-col">
                <div class="club-score">${c.total.toFixed(1)}</div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <button class="full-cta-btn orange" id="openPosterBtn">${isEN() ? "Generate My 'Team Guangzhou' Share Poster" : "生成我的「广州出战」炫耀海报"}</button>
      `
          : `
        <div class="derby-card">
          <div class="derby-badge">🏆 ${fn.matchTitle}</div>
          <div class="derby-vs-row">
            <div class="derby-side">
              <span class="derby-city">${fn.left.province}</span>
              <span class="derby-nick">${fn.left.cities}</span>
              <span class="derby-score" style="color:var(--accent)">${fn.left.score.toFixed(1)}</span>
            </div>
            <span class="derby-vs">VS</span>
            <div class="derby-side right">
              <span class="derby-city">${fn.right.province}</span>
              <span class="derby-nick">${fn.right.cities}</span>
              <span class="derby-score" style="color:var(--rival-blue)">${fn.right.score.toFixed(1)}</span>
            </div>
          </div>
          <div class="tug-bar">
            <div class="tug-left" style="width:${natLeftPct}%"></div>
          </div>
          <div class="derby-meme">
            🔥 ${isEN() ? "GD Trash Talk:" : "粤方放话："}「${fn.left.slogan}」<br/>
            🔥 ${isEN() ? "JS Clapback:" : "苏方回怼："}「${fn.right.slogan}」
          </div>
        </div>

        <div class="m-card">
          <div class="m-section-head" style="margin-top:0;">
            <span class="m-section-title">${isEN() ? "National Province Table" : "全国省际联合排名"}</span>
            <span class="m-section-sub">${isEN() ? "Includes Bike & Swim EEP" : "含骑行/游泳等效积分"}</span>
          </div>
          <div class="city-row">
            <div class="club-rank-box r1">1</div>
            <div class="club-main">
              <div class="club-name-line"><span class="club-name">${fn.left.province}</span><span class="city-qual-tag">${isEN() ? "Leading" : "当前领跑"}</span></div>
              <div class="club-stats">${fn.left.cities} · ${fn.left.activeRunners.toLocaleString()} ${isEN() ? "verified athletes" : "名认证选手"}</div>
            </div>
            <div class="club-score">${fn.left.score.toFixed(1)}</div>
          </div>
          <div class="city-row">
            <div class="club-rank-box r2">2</div>
            <div class="club-main">
              <div class="club-name-line"><span class="club-name">${fn.right.province}</span></div>
              <div class="club-stats">${fn.right.cities} · ${fn.right.activeRunners.toLocaleString()} ${isEN() ? "verified athletes" : "名认证选手"}</div>
            </div>
            <div class="club-score">${fn.right.score.toFixed(1)}</div>
          </div>
          ${fn.others
            .map(
              (o) => `
            <div class="city-row">
              <div class="club-rank-box">${o.rank}</div>
              <div class="club-main">
                <div class="club-name">${o.province}</div>
                <div class="club-stats">${o.cities}</div>
              </div>
              <div class="club-score">${o.score.toFixed(1)}</div>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="m-card" style="background:var(--accent-soft);border-color:var(--accent-border);">
          <div style="font-size:12px;font-weight:800;color:var(--accent);margin-bottom:4px;">${
            isEN() ? "Winning Province Grand Prize (Engine Bird)" : "冠军省终极荣耀权益（引擎鸟赞助）"
          }</div>
          <div style="font-size:11.5px;color:var(--ink-primary);line-height:1.5;">
            ${
              isEN()
                ? "Every athlete in the winning province who logged ≥30km automatically unlocks a <strong>25% Off Engine Bird VIP Code</strong> + exclusive access to the <strong>Champion Province Custom Singlet</strong>!"
                : "获胜省内所有当月实跑 ≥30km 的出战跑者，全员解锁 <strong>「引擎鸟冠军省 7.5 折私域内购券」</strong> + 限量抢购 <strong>「粤跑/苏跑冠军限定印字战袍」</strong>！"
            }
          </div>
        </div>

        <button class="full-cta-btn" id="openPosterBtn">${isEN() ? "Share 'GD vs JS Finals' Rally Poster" : "生成「粤苏巅峰」助威战报"}</button>
      `
      }
    `;

    el.phoneBody.querySelectorAll("[data-pk]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.pkScope = btn.dataset.pk;
        renderPhonePk();
      });
    });

    const posterBtn = document.getElementById("openPosterBtn");
    if (posterBtn) posterBtn.addEventListener("click", openPosterSheet);
  }

  // Tab 4: EngineBird Perks
  function renderPhonePerks() {
    const unlocked = state.user.monthlyKm >= state.user.targetKm;
    const remain = Math.max(0, state.user.targetKm - state.user.monthlyKm);
    const jerseyTitle =
      state.jerseyVariant === "gd"
        ? isEN()
          ? "GD CHAMPS · GUANGZHOU"
          : "粤跑冠军 · 广州"
        : isEN()
          ? "JS #1 · NANJING"
          : "苏跑第一 · 南京";

    el.phoneBody.innerHTML = `
      <div class="por-hero ${unlocked ? "unlocked" : ""}">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
          <span class="mini-tag ${unlocked ? "trust" : ""}" style="${!unlocked ? "background:var(--accent-soft);color:var(--accent);" : ""}">
            ${
              unlocked
                ? isEN()
                  ? "✓ Proof-of-Run Unlocked"
                  : "✓ Proof-of-Run 已达标"
                : isEN()
                  ? "Locked · Anti-Freeloader Gate"
                  : "待解锁 · 防止羊毛党机制"
            }
          </span>
          <span class="mono" style="font-size:12px;font-weight:800;color:${unlocked ? "var(--trust)" : "var(--accent)"}">
            ${state.user.monthlyKm.toFixed(1)} / 30.0 km
          </span>
        </div>
        <div style="font-size:14.5px;font-weight:800;margin-bottom:4px;">
          ${
            unlocked
              ? isEN()
                ? "Congrats! Engine Bird VIP & Champion Merch Unlocked"
                : "恭喜！已解锁引擎鸟私域内购与冠军战袍资格"
              : isEN()
                ? `Log ${remain.toFixed(1)} km more to unlock Engine Bird VIP`
                : `再跑 ${remain.toFixed(1)} km 解锁引擎鸟跑团专属权益`
          }
        </div>
        <div style="font-size:11.5px;color:var(--ink-secondary);line-height:1.5;">
          ${
            unlocked
              ? isEN()
                ? `Your T1 mileage qualifies, and ${T().userClub} ranks #1 in Small Division. Tap any perk below to issue a personal VIP checkout code.`
                : "你的 T1 认证跑量已达标，且所属「广州天河高能尖兵团」位居尖兵组 Top 1。点击下方生成加密内购码直达引擎鸟有赞微商城。"
              : isEN()
                ? "Only verified athletes logging ≥30km/month unlock codes. Tap '+ Sync Run' above to test a Garmin run or cycling EEP conversion!"
                : "只有当月实跑 ≥30km 的认证跑者才可领券，点击顶部「+ 同步运动」立即模拟上传一次跑步或骑行换算即可解锁！"
          }
        </div>
        ${
          !unlocked
            ? `<button class="full-cta-btn orange" id="perksQuickSyncBtn">${isEN() ? "+ Sync 1 Run Now to Unlock VIP" : "+ 立即同步 1 次跑步解锁权益"}</button>`
            : ""
        }
      </div>

      <div class="m-section-head">
        <span class="m-section-title">${isEN() ? "Engine Bird × PACELAB Private Perks" : "引擎鸟 × 领跑局 私域专属权益"}</span>
        <span class="m-section-sub">${isEN() ? "Protected Pricing" : "不破公域控价"}</span>
      </div>

      ${D()
        .engineBirdPerks.map((p) => {
          const canClaim = state.user.monthlyKm >= p.minKm;
          const priceStr =
            p.salePrice === 0
              ? isEN()
                ? "Free Beta"
                : "免费众测"
              : isEN()
                ? `$${Math.round(p.salePrice / USD_RATE)}`
                : `¥${p.salePrice}`;
          const origStr = isEN() ? `$${Math.round(p.origPrice / USD_RATE)}` : `¥${p.origPrice}`;
          return `
            <div class="m-card">
              <div class="perk-card">
                <div class="perk-art ${p.isJersey ? "jersey" : ""}">
                  <span style="font-size:18px;">${p.isJersey ? "👕" : p.salePrice === 0 ? "🧪" : "🩳"}</span>
                  <span style="font-size:8.5px;font-weight:700;margin-top:2px;opacity:0.8;">${p.isJersey ? "CHAMP" : "EB PRO"}</span>
                </div>
                <div class="perk-info">
                  <div class="perk-title">${p.name}</div>
                  <div class="perk-desc">${p.desc}</div>
                  <div class="perk-price-row">
                    <div>
                      <span class="perk-price">${priceStr}</span>
                      <span class="perk-orig">${origStr}</span>
                    </div>
                    <button class="join-btn ${canClaim ? "" : "joined"}" style="${
                      !canClaim ? "background:var(--bg-subtle);color:var(--ink-muted);border:none;" : ""
                    }" data-claim-perk="${p.id}">
                      ${canClaim ? (isEN() ? "Get Code" : "生成内购码") : isEN() ? `Need ${p.minKm}km` : `需 ${p.minKm}km`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
        })
        .join("")}

      <div class="m-card">
        <div class="m-section-head" style="margin-top:0;">
          <span class="m-section-title">${isEN() ? "Champion Singlet Print Preview" : "冠军省联名战袍印字预览"}</span>
          <span class="m-section-sub">${isEN() ? "Custom Merch" : "鸟叔工业设计定制"}</span>
        </div>
        <div style="display:flex;gap:6px;margin-bottom:9px;">
          <button class="m-pill ${state.jerseyVariant === "gd" ? "active" : ""}" data-jersey="gd">${isEN() ? "GD Champs · GZ" : "粤跑冠军·广州"}</button>
          <button class="m-pill ${state.jerseyVariant === "js" ? "active" : ""}" data-jersey="js">${isEN() ? "JS #1 · Nanjing" : "苏跑第一·南京"}</button>
        </div>
        <div style="background:linear-gradient(135deg,#13171E,#263040);color:#fff;border-radius:12px;padding:14px;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-size:9.5px;letter-spacing:0.12em;color:#FF8A57;font-weight:700;">ENGINE BIRD × PACELAB</div>
            <div style="font-size:15.5px;font-weight:800;margin:3px 0;">${jerseyTitle}</div>
            <div style="font-size:10.5px;color:rgba(255,255,255,0.72);">${
              isEN() ? "2026 Run Super Champion Ed. · Featherweight Dry-Fit" : "2026 跑超冠军省限定版 · 轻量化龙鳞速干面料"
            }</div>
          </div>
          <div style="width:48px;height:48px;border-radius:12px;border:1.5px solid rgba(252,76,2,0.7);display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:11px;font-weight:800;color:#FF8A57;">
            NO.1
          </div>
        </div>
      </div>
    `;

    const qSync = document.getElementById("perksQuickSyncBtn");
    if (qSync) qSync.addEventListener("click", openSyncModal);

    el.phoneBody.querySelectorAll("[data-claim-perk]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const perk = D().engineBirdPerks.find((p) => p.id === btn.dataset.claimPerk);
        if (!perk) return;
        if (state.user.monthlyKm < perk.minKm) {
          showToast(
            isEN()
              ? `At ${state.user.monthlyKm.toFixed(1)}km — need ${(perk.minKm - state.user.monthlyKm).toFixed(1)}km more`
              : `当前跑量 ${state.user.monthlyKm.toFixed(1)}km，还差 ${(perk.minKm - state.user.monthlyKm).toFixed(1)}km 解锁`
          );
          openSyncModal();
          return;
        }
        openCouponSheet(perk);
      });
    });

    el.phoneBody.querySelectorAll("[data-jersey]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.jerseyVariant = btn.dataset.jersey;
        renderPhonePerks();
      });
    });
  }

  // =========================================================================
  // Phone Bottom Sheet Modals
  // =========================================================================
  function openSheet(html) {
    el.phoneSheet.innerHTML = `<div class="sheet-handle"></div>${html}`;
    el.phoneSheetBackdrop.classList.add("open");
    const closeBtn = el.phoneSheet.querySelector("[data-close-sheet]");
    if (closeBtn) closeBtn.addEventListener("click", closeSheet);
  }

  function closeSheet() {
    el.phoneSheetBackdrop.classList.remove("open");
  }

  function openSyncModal() {
    openSheet(`
      <div class="sheet-head">
        <div class="sheet-title">${isEN() ? "Sync Activity (Multi-App + Multi-Sport)" : "同步运动记录（多平台 + 铁三换算）"}</div>
        <button class="sheet-close" data-close-sheet>×</button>
      </div>
      <p style="font-size:11.5px;color:var(--ink-secondary);margin-bottom:10px;">
        ${
          isEN()
            ? "Tap any sample below to test T1 watch sync, Codoon screenshot AI OCR, cycling/swim EEP conversion, or bike anti-cheat blocking:"
            : "点击任意模拟样例，体验 AI 截图秒识、手表直连、骑行/游泳等效换算，或测试骑车作弊拦截："
        }
      </p>
      <div id="syncOptionsContainer">
        ${D()
          .syncSamples.map(
            (s) => `
          <div class="sync-option ${!s.valid ? "cheat" : ""}" data-sync-sample="${s.id}">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;">
              <span class="tier-badge ${s.tier === "T1" ? "t1" : s.tier === "T3" ? "t3" : ""}" style="${
                s.tier === "ALERT" ? "background:#FEE2E2;color:#DC2626;" : ""
              }margin-bottom:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:72%;">${s.source}</span>
              <span class="mono" style="font-size:11.5px;font-weight:800;white-space:nowrap;flex-shrink:0;color:${s.valid ? "var(--ink-primary)" : "var(--danger)"}">${s.pace}</span>
            </div>
            <div style="font-size:12.5px;font-weight:700;margin-bottom:2px;">${s.title}</div>
            <div style="font-size:10.5px;color:var(--ink-secondary);line-height:1.4;">${s.desc}</div>
          </div>
        `
          )
          .join("")}
      </div>
    `);

    el.phoneSheet.querySelectorAll("[data-sync-sample]").forEach((node) => {
      node.addEventListener("click", () => runSyncSample(node.dataset.syncSample));
    });
  }

  function runSyncSample(sampleId) {
    const sample = D().syncSamples.find((s) => s.id === sampleId);
    if (!sample) return;

    const container = document.getElementById("syncOptionsContainer");
    if (!container) return;

    container.innerHTML = `
      <div class="scan-box">
        <div style="font-size:22px;margin-bottom:6px;">${sample.valid ? "📡" : "🛡️"}</div>
        <div style="font-size:13.5px;font-weight:800;margin-bottom:4px;">${
          isEN() ? "Running GPS & sensor telemetry verification…" : "正在进行多维轨迹与传感器校验…"
        }</div>
        <div style="font-size:11.5px;color:var(--ink-secondary);">${isEN() ? "Source:" : "核验来源："} ${sample.source}</div>
      </div>
    `;

    setTimeout(() => {
      if (!sample.valid) {
        container.innerHTML = `
          <div class="scan-box" style="background:var(--danger-soft);border-color:rgba(220,38,38,0.28);text-align:left;">
            <div style="font-size:14px;font-weight:800;color:var(--danger);margin-bottom:6px;">🚨 ${
              isEN() ? "Anti-Cheat Alert: Bike Spoofing Blocked!" : "风控拦截：疑似骑行代跑，拒绝入账！"
            }</div>
            <div style="font-size:11.5px;color:var(--ink-primary);line-height:1.55;">
              ${
                isEN()
                  ? "• Pace <strong>3'38\"/km</strong> (16.5 km/h) but IMU cadence = <strong>0 spm</strong><br/>• Heart rate only <strong>91 bpm</strong> — physiologically mismatched<br/>• Quarantined automatically: <strong>excluded from club ranking &amp; Engine Bird VIP</strong>, club captain alerted."
                  : "• 配速 <strong>3'38\"/km</strong>（均速 16.5km/h）但加速度计步频为 <strong>0 spm</strong><br/>• 心率仅 <strong>91 bpm</strong>，与配速严重背离<br/>• 已自动隔离该轨迹，<strong>不计入跑团排位与引擎鸟折扣资格</strong>，并向团长发送预警。"
              }
            </div>
          </div>
          <button class="full-cta-btn" id="retrySyncBtn">${isEN() ? "Back to Valid Sync Options" : "返回选择正常记录测试"}</button>
        `;
        document.getElementById("retrySyncBtn").addEventListener("click", openSyncModal);
        showToast(isEN() ? "Blocked suspected bike-spoofed track!" : "已拦截疑似骑车作弊轨迹！");
        return;
      }

      applyValidActivity(sample);
      container.innerHTML = `
        <div class="scan-box" style="background:var(--trust-soft);border-color:var(--trust-border);text-align:left;">
          <div style="font-size:14px;font-weight:800;color:var(--trust);margin-bottom:6px;">✓ ${
            isEN() ? "Verified & Credited Live!" : "校验通过，已实时计入战绩！"
          }</div>
          <div style="font-size:12px;color:var(--ink-primary);line-height:1.6;">
            <strong>${sample.title}</strong><br/>
            ${sample.rawDisplay ? `${isEN() ? "Raw telemetry:" : "原始记录："} ${sample.rawDisplay}<br/>` : ""}
            • ${isEN() ? "Monthly verified total:" : "本月有效跑量更新至："} <strong class="mono">${state.user.monthlyKm.toFixed(1)} km</strong><br/>
            • ${isEN() ? `Added points to ${T().userClub} &amp; Team Guangzhou!` : `已为「${T().userClub}」及「广州战队」注入积分！`}<br/>
            ${
              state.user.monthlyKm >= state.user.targetKm
                ? `• <strong style="color:var(--accent)">🎉 ${
                    isEN() ? "30km Reached! Engine Bird VIP Perks Unlocked!" : "恭喜满 30km！已解锁引擎鸟私域内购券！"
                  }</strong>`
                : ""
            }
          </div>
        </div>
        <button class="full-cta-btn orange" id="goPerksAfterSync">${
          isEN() ? "Claim Engine Bird VIP Perks →" : "去领取引擎鸟专属权益 →"
        }</button>
      `;
      document.getElementById("goPerksAfterSync").addEventListener("click", () => {
        closeSheet();
        state.phoneTab = "perks";
        renderPhone();
      });
    }, 650);
  }

  function applyValidActivity(sample) {
    state.user.monthlyKm = Number((state.user.monthlyKm + sample.km).toFixed(1));
    state.user.syncCount += 1;

    renderPhone();
    if (state.chapter === 0 || state.chapter === 4) renderPitch();
    showToast(
      isEN()
        ? `+${sample.km}km credited! ${state.user.monthlyKm >= 30 ? "Engine Bird VIP unlocked!" : ""}`
        : `+${sample.km}km 已入账！${state.user.monthlyKm >= 30 ? "引擎鸟内购已解锁！" : ""}`
    );
  }

  function openClubDetailSheet(club) {
    openSheet(`
      <div class="sheet-head">
        <div class="sheet-title">${club.name}</div>
        <button class="sheet-close" data-close-sheet>×</button>
      </div>
      <div style="font-size:12px;color:var(--ink-secondary);margin-bottom:10px;">
        ${club.city} · ${club.members} ${isEN() ? "verified members" : "名认证成员"} · <strong>${club.perk}</strong>
      </div>
      <div class="m-card" style="background:var(--bg-elevated);">
        <div style="font-size:11.5px;font-weight:700;margin-bottom:8px;">${
          isEN() ? `Fair Score Breakdown (${club.score.toFixed(1)} pts)` : `公平得分算法透视（总分 ${club.score.toFixed(1)}）`
        }</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div class="tm-cell"><div class="tm-k">${isEN() ? "10% Trimmed Avg" : "10%截尾人均跑量"}</div><div class="tm-v">${club.trimAvgKm} km</div></div>
          <div class="tm-cell"><div class="tm-k">${isEN() ? "Active Rate" : "有效活跃率"}</div><div class="tm-v good">${club.activeRate}%</div></div>
          <div class="tm-cell"><div class="tm-k">${isEN() ? "Group-Run Buff" : "合跑/小任务加成"}</div><div class="tm-v" style="color:var(--accent)">+${club.socialBonus}%</div></div>
          <div class="tm-cell"><div class="tm-k">${isEN() ? "T1 Watch Ratio" : "T1 手表可信占比"}</div><div class="tm-v good">${club.t1Ratio}%</div></div>
        </div>
        ${
          club.rawMetric
            ? `<div style="font-size:11.5px;color:var(--accent);margin-top:8px;font-weight:600;">⚡ ${
                isEN() ? "Multi-Sport EEP:" : "跨项换算明细："
              } ${club.rawMetric}</div>`
            : ""
        }
      </div>
      <button class="full-cta-btn" data-close-sheet>${isEN() ? "Close" : "关闭透视"}</button>
    `);
  }

  function openPosterSheet() {
    const gz = getCityList()[0];
    openSheet(`
      <div class="sheet-head">
        <div class="sheet-title">${isEN() ? "Viral Share Card · WeChat / Stories" : "分享战报 · 朋友圈 / 跑团群裂变"}</div>
        <button class="sheet-close" data-close-sheet>×</button>
      </div>
      <div class="poster-canvas">
        <div style="font-size:10px;letter-spacing:0.12em;color:#FF8A57;font-weight:700;margin-bottom:6px;">2026 RUN SUPER LEAGUE · ${
          isEN() ? "GUANGDONG HOME" : "跑超广东主场"
        }</div>
        <div style="font-size:20px;font-weight:800;line-height:1.25;margin-bottom:10px;">
          ${
            isEN()
              ? `I logged ${state.user.monthlyKm.toFixed(1)} km for<br/>Team Guangzhou!`
              : `我已为【广州早茶铁军】<br/>贡献 ${state.user.monthlyKm.toFixed(1)} km 战力！`
          }
        </div>
        <div style="display:flex;gap:14px;margin-bottom:14px;">
          <div>
            <div style="font-size:10px;opacity:0.7;">${isEN() ? "City Rank" : "当前省内排名"}</div>
            <div class="mono" style="font-size:20px;font-weight:800;color:#FF8A57;">NO.1</div>
          </div>
          <div>
            <div style="font-size:10px;opacity:0.7;">${isEN() ? "Guangzhou Score" : "广州总战力"}</div>
            <div class="mono" style="font-size:20px;font-weight:800;">${gz.total.toFixed(1)}</div>
          </div>
          <div>
            <div style="font-size:10px;opacity:0.7;">${isEN() ? "Nationals" : "跨省巅峰战"}</div>
            <div class="mono" style="font-size:18px;font-weight:800;color:#34D399;">${isEN() ? "Ahead of JS" : "领跑江苏"}</div>
          </div>
        </div>
        <div style="font-size:11px;opacity:0.85;border-top:1px solid rgba(255,255,255,0.16);padding-top:9px;display:flex;justify-content:space-between;">
          <span>「${isEN() ? "4:30/km before morning dim sum" : "早茶没喝完，配速先干到 430"}」</span>
          <strong>${isEN() ? "By Engine Bird" : "引擎鸟赞助"}</strong>
        </div>
      </div>
      <button class="full-cta-btn orange" id="copyPosterBtn">${
        isEN() ? "Share Rally Card to WeChat Run Group" : "一键转发至微信跑团群摇人"
      }</button>
    `);
    document.getElementById("copyPosterBtn").addEventListener("click", () => {
      closeSheet();
      showToast(isEN() ? "WeChat share card generated (Demo)" : "已生成微信群转发卡片（演示模式）");
    });
  }

  function openCouponSheet(perk) {
    const code = perk.codePrefix + "8F92K";
    openSheet(`
      <div class="sheet-head">
        <div class="sheet-title">${isEN() ? "Engine Bird Private VIP Code" : "引擎鸟私域专属核销码"}</div>
        <button class="sheet-close" data-close-sheet>×</button>
      </div>
      <div style="font-size:13px;font-weight:700;margin-bottom:3px;">${perk.name}</div>
      <div style="font-size:11.5px;color:var(--ink-secondary);">
        ${
          isEN()
            ? `Athlete: ${T().userName} (T1 Verified ${state.user.monthlyKm.toFixed(1)} km) · Single-user bound`
            : `认证跑者：${T().userName}（本月 T1 认证 ${state.user.monthlyKm.toFixed(1)} km）· 单人绑定防黄牛转卖`
        }
      </div>
      <div class="coupon-code-box">${code}</div>
      <div style="font-size:11px;color:var(--ink-secondary);line-height:1.5;margin-bottom:10px;">
        ${
          isEN()
            ? "• <strong>Price Protection</strong>: Redeems only inside Engine Bird's hidden WeChat (Youzan) VIP channel — zero impact on Tmall/JD public retail pricing.<br/>• Automatically tracks CPS attribution &amp; adds runner to Engine Bird's private CRM."
            : "• <strong>控价保护</strong>：仅限引擎鸟有赞官方微商城隐藏通道核销，不影响天猫/京东公域价格体系。<br/>• 核销成功后自动记录本场活动 CPS 归因，实时沉淀至引擎鸟私域会员池。"
        }
      </div>
      <button class="full-cta-btn orange" id="jumpYouzanBtn">${
        isEN() ? "Copy Code & Open Engine Bird VIP Store →" : "复制密令并跳转引擎鸟有赞商城 →"
      }</button>
    `);
    document.getElementById("jumpYouzanBtn").addEventListener("click", () => {
      closeSheet();
      showToast(
        isEN()
          ? `Copied ${code} · Opening Engine Bird WeChat Store (Demo)`
          : `已复制 ${code} · 模拟跳转引擎鸟有赞微商城`
      );
    });
  }

  // =========================================================================
  // Global Event Bindings
  // =========================================================================
  el.chapterNav.querySelectorAll(".chapter-pill").forEach((btn) => {
    btn.addEventListener("click", () => setChapter(Number(btn.dataset.chapter), true));
  });

  el.prevChapterBtn.addEventListener("click", () => setChapter(state.chapter - 1, true));
  el.nextChapterBtn.addEventListener("click", () => setChapter(state.chapter + 1, true));

  el.chapterDots.addEventListener("click", (e) => {
    const dot = e.target.closest("[data-dot]");
    if (dot) setChapter(Number(dot.dataset.dot), true);
  });

  el.phoneTabbar.querySelectorAll(".tab-item").forEach((btn) => {
    btn.addEventListener("click", () => setPhoneTab(btn.dataset.tab));
  });

  el.openSyncModalBtn.addEventListener("click", openSyncModal);

  el.phoneSheetBackdrop.addEventListener("click", (e) => {
    if (e.target === el.phoneSheetBackdrop) closeSheet();
  });

  el.togglePhoneOnlyBtn.addEventListener("click", () => {
    state.phoneOnly = !state.phoneOnly;
    document.body.classList.toggle("phone-only", state.phoneOnly);
    el.togglePhoneOnlyText.textContent = state.phoneOnly ? T().showPitch : T().focusProto;
  });

  if (el.langSwitchDesktop) {
    el.langSwitchDesktop.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
    });
  }

  if (el.mobileLangBtn) {
    el.mobileLangBtn.addEventListener("click", () => {
      setLanguage(isEN() ? "zh" : "en");
    });
  }

  el.mobileModeBar.querySelectorAll("[data-mobile-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.mobileView = btn.dataset.mobileView;
      el.mobileModeBar.querySelectorAll(".mobile-mode-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.mobileView === state.mobileView);
      });
      document.body.classList.toggle("mobile-show-pitch", state.mobileView === "pitch");
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "ArrowRight") setChapter(state.chapter + 1, true);
    if (e.key === "ArrowLeft") setChapter(state.chapter - 1, true);
    if (e.key === "Escape") closeSheet();
  });

  // Initialize
  syncStaticChrome();
  setChapter(0, true);
})();

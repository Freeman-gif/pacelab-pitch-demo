/* ==========================================================================
   PACELAB 领跑局 × ENGINE BIRD 引擎鸟 — Interactive Pitch Demo Engine
   ========================================================================== */

(function () {
  const D = window.PITCH_DATA;

  // Global Reactive State
  const state = {
    chapter: 0,
    phoneOnly: false,
    mobileView: "phone", // 'phone' | 'pitch'
    phoneTab: "match", // 'match' | 'clubs' | 'pk' | 'perks'

    // Interactive Pitch controls
    selectedTier: "t1",
    algoMode: "fair", // 'fair' | 'raw'
    telemetryMode: "cheat", // 'cheat' | 'normal'
    eepInput: { sport: "bike", km: 36 },

    // Interactive ROI Calculator (EngineBird)
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
      name: "林晓峰",
      city: "广州",
      clubName: "广州天河高能尖兵团",
      monthlyKm: 26.4, // Starts just under 30km so one sync unlocks EngineBird perks!
      targetKm: 30.0,
      t1Verified: true,
      syncedIds: []
    },

    // Phone UI Filters
    selectedRaceId: "gzm",
    paceFilter: "all", // 'all' | 'sub300' | 'sub330' | 'sub400' | 'female'
    clubDivision: "elite", // 'elite' | 'mid' | 'mega' | 'multisport'
    pkScope: "province", // 'province' | 'national'
    jerseyStyle: "粤跑冠军 · 广州",

    // Stateful lists cloned from data
    squads: D.squads.map((s) => ({ ...s, members: [...s.members] })),
    quests: D.quests.map((q) => ({ ...q })),
    gdCities: D.guangdongCities.map((c) => ({ ...c })),
    finals: JSON.parse(JSON.stringify(D.provinceFinals)),
    clubs: JSON.parse(JSON.stringify(D.clubsByDivision))
  };

  // DOM References
  const el = {
    pitchContent: document.getElementById("pitchContent"),
    pitchScroll: document.getElementById("pitchScroll"),
    chapterNav: document.getElementById("chapterNav"),
    chapterDots: document.getElementById("chapterDots"),
    prevChapterBtn: document.getElementById("prevChapterBtn"),
    nextChapterBtn: document.getElementById("nextChapterBtn"),
    togglePhoneOnlyBtn: document.getElementById("togglePhoneOnlyBtn"),
    togglePhoneOnlyText: document.getElementById("togglePhoneOnlyText"),
    mobileModeBar: document.getElementById("mobileModeBar"),
    deviceSyncHint: document.getElementById("deviceSyncHint"),
    wxNavTitle: document.getElementById("wxNavTitle"),
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

  // Formatters
  const fmtRMB = (n) => "¥" + Math.round(n).toLocaleString("zh-CN");
  const fmtWan = (n) => (n >= 10000 ? "¥" + (n / 10000).toFixed(1) + "万" : fmtRMB(n));

  // =========================================================================
  // Chapter Navigation & Bidirectional Sync
  // =========================================================================
  function setChapter(idx, syncPhone = true) {
    state.chapter = Math.max(0, Math.min(D.chapters.length - 1, idx));
    const ch = D.chapters[state.chapter];

    // Update top nav pills
    el.chapterNav.querySelectorAll(".chapter-pill").forEach((btn) => {
      btn.classList.toggle("active", Number(btn.dataset.chapter) === state.chapter);
    });

    // Update footer buttons & dots
    el.prevChapterBtn.disabled = state.chapter === 0;
    el.nextChapterBtn.disabled = state.chapter === D.chapters.length - 1;
    el.nextChapterBtn.querySelector("span").textContent =
      state.chapter === D.chapters.length - 1 ? "演示完成" : "下一章";

    el.chapterDots.innerHTML = D.chapters
      .map(
        (_, i) =>
          `<button class="chapter-dot ${i === state.chapter ? "active" : ""}" data-dot="${i}" aria-label="第 ${i + 1} 章"></button>`
      )
      .join("");

    el.deviceSyncHint.textContent = ch.hint;

    if (syncPhone) {
      state.phoneTab = ch.tab;
      if (state.chapter === 3) {
        state.pkScope = "province";
      }
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
    const ch = D.chapters[state.chapter];
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

  // Chapter 1: Market Pain + 3-Tier Data Ingestion
  function renderChapter1() {
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

  // Chapter 2: Race-Anchored Matching
  function renderChapter2() {
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
            <svg viewBox="0 0 240 130" width="100%" height="auto" aria-label="轨迹隐私模糊圈示意">
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

  // Chapter 3: Fair Club Ranking + Anti-Cheat Telemetry
  function renderChapter3() {
    const sorted = [...D.algoCompare].sort((a, b) =>
      state.algoMode === "fair" ? b.fairScore - a.fairScore : b.rawKm - a.rawKm
    );
    const maxVal = state.algoMode === "fair" ? 100 : 12500;

    const isCheat = state.telemetryMode === "cheat";
    const telemetrySvg = isCheat
      ? `
        <svg viewBox="0 0 360 95" width="100%" height="95">
          <line x1="0" y1="75" x2="360" y2="75" stroke="#E5E7EB" stroke-width="1"/>
          <line x1="0" y1="40" x2="360" y2="40" stroke="#E5E7EB" stroke-dasharray="3 3" stroke-width="1"/>
          <!-- High flat speed (bike) -->
          <path d="M10 22 L70 20 L140 21 L220 19 L290 21 L350 20" fill="none" stroke="#DC2626" stroke-width="2.6"/>
          <!-- Flat zero cadence -->
          <path d="M10 74 L350 74" fill="none" stroke="#9CA3AF" stroke-width="2.2" stroke-dasharray="5 3"/>
          <text x="12" y="14" font-size="9.5" fill="#DC2626" font-weight="700">异常高速平滑曲线: 16.5 km/h (配速 3'38")</text>
          <text x="12" y="68" font-size="9.5" fill="#6B7280" font-weight="700">手机/手表步频传感器读数: 0 spm（无跑步垂直振幅）</text>
        </svg>
      `
      : `
        <svg viewBox="0 0 360 95" width="100%" height="95">
          <line x1="0" y1="75" x2="360" y2="75" stroke="#E5E7EB" stroke-width="1"/>
          <line x1="0" y1="40" x2="360" y2="40" stroke="#E5E7EB" stroke-dasharray="3 3" stroke-width="1"/>
          <!-- Realistic pace wave -->
          <path d="M10 48 Q45 42 80 45 T150 41 T220 44 T290 38 T350 34" fill="none" stroke="#FC4C02" stroke-width="2.4"/>
          <!-- Realistic cadence wave -->
          <path d="M10 30 Q45 27 80 29 T150 26 T220 28 T290 25 T350 23" fill="none" stroke="#0B9E6E" stroke-width="2.2"/>
          <text x="12" y="16" font-size="9.5" fill="#0B9E6E" font-weight="700">步频稳定律动: 178–182 spm（与速度强正相关）</text>
          <text x="12" y="66" font-size="9.5" fill="#FC4C02" font-weight="700">自然配速曲线: 4'56"/km · 心率同步上升至 154 bpm</text>
        </svg>
      `;

    return `
      <div class="pitch-card">
        <div class="pitch-card-head">
          <div class="pitch-card-title">公平算法实验器（点击切换对比）</div>
          <div class="seg-group">
            <button class="seg-btn ${state.algoMode === "fair" ? "active" : ""}" data-algo="fair">我们的公平算法</button>
            <button class="seg-btn ${state.algoMode === "raw" ? "active" : ""}" data-algo="raw">传统比总里程</button>
          </div>
        </div>

        <div class="algo-formula">
          <span>跑团战力 = 10%截尾人均分 × 有效活跃率 × 规模平滑系数 × (1 + 合跑加成)</span>
          <span style="color:var(--accent);font-weight:700;white-space:nowrap;">单人日封顶 25km</span>
        </div>

        <div>
          ${sorted
            .map((item, idx) => {
              const val = state.algoMode === "fair" ? item.fairScore : item.rawKm;
              const pct = Math.min(100, Math.round((val / maxVal) * 100));
              const isHighlight = item.name.includes("广州天河");
              return `
                <div class="sim-row">
                  <div class="sim-row-top">
                    <div class="sim-club-meta">
                      <span class="sim-rank ${idx === 0 ? "top1" : ""}">${idx + 1}</span>
                      <strong>${item.name}</strong>
                      <span class="sim-tag">${item.meta}</span>
                    </div>
                    <strong class="mono">${state.algoMode === "fair" ? item.fairScore.toFixed(1) + " 分" : item.rawKm.toLocaleString() + " km"}</strong>
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
              ? "✓ <strong>结果公正</strong>：小而精、活跃率 91% 的真跑团稳居第一；僵尸粉大群和 3 人刷榜小号均被压制，且按「尖兵 / 劲旅 / 巨无霸」分重量级发奖。"
              : "⚠ <strong>传统弊端</strong>：纯拼总里程会被 320 人僵尸大群绝对碾压，中小精英团毫无胜算，迅速丧失参赛意愿。"
          }
        </div>
      </div>

      <div class="pitch-card">
        <div class="pitch-card-head">
          <div class="pitch-card-title">四道防作弊风控透视（保护引擎鸟折扣池）</div>
          <div class="seg-group">
            <button class="seg-btn ${isCheat ? "active" : ""}" data-tm="cheat">拦截骑车代跑</button>
            <button class="seg-btn ${!isCheat ? "active" : ""}" data-tm="normal">正常跑步绿灯</button>
          </div>
        </div>

        <div class="telemetry-box">
          ${telemetrySvg}
          <div class="telemetry-metrics">
            <div class="tm-cell">
              <div class="tm-k">平均配速</div>
              <div class="tm-v ${isCheat ? "bad" : "good"}">${isCheat ? "3'38\"" : "4'56\""}</div>
            </div>
            <div class="tm-cell">
              <div class="tm-k">传感器步频</div>
              <div class="tm-v ${isCheat ? "bad" : "good"}">${isCheat ? "0 spm" : "180 spm"}</div>
            </div>
            <div class="tm-cell">
              <div class="tm-k">平均心率</div>
              <div class="tm-v ${isCheat ? "bad" : "good"}">${isCheat ? "91 bpm" : "154 bpm"}</div>
            </div>
            <div class="tm-cell">
              <div class="tm-k">风控判定</div>
              <div class="tm-v ${isCheat ? "bad" : "good"}">${isCheat ? "拦截+连坐" : "T1 通过"}</div>
            </div>
          </div>
        </div>

        <div class="pitch-callout">
          <div class="callout-copy">
            <strong>跑团连坐机制：</strong>月榜设 48 小时公示举报期，若查实成员骑车刷榜，扣除 3 倍积分并冻结全团当月折扣——用熟人社会压力实现极低成本自治。
          </div>
          <button class="action-cta" id="pitchTestCheatBtn">在手机端触发拦截 →</button>
        </div>
      </div>
    `;
  }

  // Chapter 4: RunSuper City/Province PK + Cycling & Swimming EEP Conversion
  function renderChapter4() {
    const { sport, km } = state.eepInput;
    const eqRun = sport === "swim" ? km * 4 : sport === "bike" ? km / 3 : km;
    const eep = Math.round(eqRun * 10);

    return `
      <div class="pitch-card">
        <div class="pitch-card-head">
          <div class="pitch-card-title">「跑超」双轨赛制：破除大城市人口碾压</div>
          <span class="pitch-card-sub">广东 21 城海选 → Top 3 出线战全国</span>
        </div>

        <div class="kpi-grid" style="margin-bottom:12px;">
          <div class="kpi-box">
            <div class="kpi-label">城市主力分（权重 75%）</div>
            <div class="kpi-num accent">Top 100</div>
            <div class="kpi-note">取每城前 100 名主力/前5团，珠海佛山可掀翻广深</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">全民助威分（权重 25%）</div>
            <div class="kpi-num trust">+Buff</div>
            <div class="kpi-note">普通市民跑 3km 即可为家乡点亮助威能量条</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">省际巅峰对决</div>
            <div class="kpi-num">粤 vs 苏</div>
            <div class="kpi-note">广东(广深佛) 对决 江苏(宁苏锡) 引爆地域玩梗</div>
          </div>
        </div>

        <div class="week-grid">
          <div class="week-card">
            <div class="week-num">WEEK 1</div>
            <div class="week-name">全城起跑周</div>
            <div class="week-desc">拉人组队、点亮城市全民助威能量条</div>
          </div>
          <div class="week-card">
            <div class="week-num">WEEK 2</div>
            <div class="week-name">黎明突袭周</div>
            <div class="week-desc">清晨 5:00–7:30 打卡享 1.3 倍积分加成</div>
          </div>
          <div class="week-card">
            <div class="week-num">WEEK 3</div>
            <div class="week-name">宿敌德比周</div>
            <div class="week-desc">广深/宁苏捉对单挑，胜者夺取 5% 积分</div>
          </div>
          <div class="week-card">
            <div class="week-num">WEEK 4</div>
            <div class="week-name">百团决战日</div>
            <div class="week-desc">周末公园合跑双倍分 + 线下早茶/咖啡狂欢</div>
          </div>
        </div>
      </div>

      <div class="pitch-card">
        <div class="pitch-card-head">
          <div class="pitch-card-title">未来耐力三项扩展：骑行车队 & 游泳团「等效换算」入赛</div>
          <span class="pitch-card-sub">统一 EEP 积分 · 市场天花板 ×3</span>
        </div>

        <div style="font-size:12.5px;color:var(--ink-secondary);margin-bottom:10px;">
          底层采用国际铁人三项能量负荷基准换算，未来无需另起炉灶，<strong>公路车队、游泳俱乐部可直接转化积分加入城市 PK 榜</strong>，直接切入高净值中产装备人群：
        </div>

        <div class="eep-bar" style="margin-bottom:12px;">
          <div class="eep-pill">
            <span class="eep-sport">🏊 游泳 1 km</span>
            <span class="eep-val">= 40 EEP (4km跑)</span>
          </div>
          <div class="eep-pill">
            <span class="eep-sport">🏃 跑步 4 km</span>
            <span class="eep-val">= 40 EEP (基准)</span>
          </div>
          <div class="eep-pill">
            <span class="eep-sport">🚴 骑行 12 km</span>
            <span class="eep-val">= 40 EEP (3:1)</span>
          </div>
        </div>

        <div style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:12px;padding:12px 14px;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;flex-wrap:wrap;">
            <span style="font-size:12px;font-weight:700;">实时换算模拟（试算车队/泳队单次贡献）：</span>
            <div class="seg-group">
              <button class="seg-btn ${sport === "bike" ? "active" : ""}" data-eep-sport="bike">🚴 骑行车队</button>
              <button class="seg-btn ${sport === "swim" ? "active" : ""}" data-eep-sport="swim">🏊 游泳团队</button>
              <button class="seg-btn ${sport === "run" ? "active" : ""}" data-eep-sport="run">🏃 跑步团</button>
            </div>
          </div>

          <div class="slider-field" style="margin-bottom:10px;">
            <label>
              <span>单次有效距离（${sport === "bike" ? "公路骑行" : sport === "swim" ? "泳池/公开水域" : "路跑"}）</span>
              <strong id="eepKmLabel">${km} km</strong>
            </label>
            <input type="range" id="eepKmSlider"
              min="${sport === "swim" ? 0.5 : sport === "bike" ? 6 : 2}"
              max="${sport === "swim" ? 10 : sport === "bike" ? 120 : 42}"
              step="${sport === "swim" ? 0.5 : sport === "bike" ? 3 : 1}"
              value="${km}" />
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;font-size:12.5px;">
            <span style="color:var(--ink-secondary);">换算为城市赛等效跑量：<strong class="mono" style="color:var(--ink-primary);font-size:14px;">${eqRun.toFixed(1)} km</strong></span>
            <span style="color:var(--ink-secondary);">为所在城市战队贡献：<strong class="mono" style="color:var(--accent);font-size:15px;">+${eep} EEP</strong></span>
          </div>
        </div>

        <div class="pitch-callout">
          <div class="callout-copy">
            <strong>右侧实时切换：</strong>去手机里切到「全国省际巅峰」看粤苏对决，或点击下方按钮在跑团榜里一键开启<strong>「耐力三项融合榜（含骑行车队与泳队）」</strong>！
          </div>
          <button class="action-cta orange" id="pitchShowMultiSportBtn">看三项融合榜 →</button>
        </div>
      </div>
    `;
  }

  // Chapter 5: EngineBird Partnership & Live ROI Simulator
  function renderChapter5() {
    const r = state.roi;
    const qualifiedRunners = r.clubs * r.activePerClub;
    const buyers = Math.round(qualifiedRunners * (r.convRate / 100));
    const monthlyGMV = buyers * r.aov;
    const brandGrossProfit = monthlyGMV * (r.grossMargin / 100);
    const platformCps = monthlyGMV * (r.cpsRate / 100);
    const brandNetProfit = brandGrossProfit - platformCps;
    // Compare with typical Douyin/social ad CAC (~120 RMB per new customer)
    const adCostSaved = buyers * 115;

    return `
      <div class="pitch-card">
        <div class="pitch-card-head">
          <div class="pitch-card-title">引擎鸟专属共赢机制（专为鸟叔打消 2 大顾虑）</div>
          <span class="pitch-card-sub">零现金预付 · 跑通正现金流</span>
        </div>
        <div class="pitch-bullets">
          <div class="bullet-card">
            <h4>1. 严守公域控价，只走有赞私域</h4>
            <p>绝不在天猫/京东公开低价，所有团购内购码均为单人加密券，小程序一键跳转引擎鸟有赞微商城核销。</p>
          </div>
          <div class="bullet-card">
            <h4>2. Proof-of-Run 彻底过滤羊毛党</h4>
            <p>必须当月实跑 ≥30km 的 T1 认证跑者才解锁内购资格，确保每一件折扣装备都穿在跑团核心 KOL 身上。</p>
          </div>
          <div class="bullet-card">
            <h4>3. 「冠军省战袍」从打折变爆品</h4>
            <p>粤跑冠军·广州等定制印字版龙鳞速干 T，兼具高情绪价值与赛道活广告效应，跑者愿意抢单分享。</p>
          </div>
          <div class="bullet-card">
            <h4>4. 鸟叔新品众测实验室</h4>
            <p>把月榜 Top 50 硬核跑者变成引擎鸟未上市短裤/越野鞋套/运动内衣的路测官，反哺研发与小红书口碑。</p>
          </div>
        </div>
      </div>

      <div class="pitch-card">
        <div class="pitch-card-head">
          <div class="pitch-card-title">实时交互式 · 引擎鸟合作单月 ROI 测算器</div>
          <span class="pitch-card-sub">拖动滑块当场算账</span>
        </div>

        <div class="roi-sliders">
          <div class="slider-field">
            <label><span>合作活跃跑团数（广东试点 → 多省）</span><strong id="vClubs">${r.clubs} 团</strong></label>
            <input type="range" data-roi="clubs" min="10" max="150" step="5" value="${r.clubs}" />
          </div>
          <div class="slider-field">
            <label><span>单团月跑 ≥30km 达标人数</span><strong id="vActive">${r.activePerClub} 人/团</strong></label>
            <input type="range" data-roi="activePerClub" min="20" max="100" step="5" value="${r.activePerClub}" />
          </div>
          <div class="slider-field">
            <label><span>达标跑者私域下单转化率</span><strong id="vConv">${r.convRate}%</strong></label>
            <input type="range" data-roi="convRate" min="10" max="40" step="1" value="${r.convRate}" />
          </div>
          <div class="slider-field">
            <label><span>引擎鸟私域内购平均客单价</span><strong id="vAov">¥${r.aov}</strong></label>
            <input type="range" data-roi="aov" min="220" max="800" step="20" value="${r.aov}" />
          </div>
        </div>

        <div class="roi-outputs">
          <div class="roi-out-box">
            <div class="roi-out-k">精准达标跑者</div>
            <div class="roi-out-v" id="outRunners">${qualifiedRunners.toLocaleString()}人</div>
          </div>
          <div class="roi-out-box highlight">
            <div class="roi-out-k">月增量私域 GMV</div>
            <div class="roi-out-v" id="outGmv">${fmtWan(monthlyGMV)}</div>
          </div>
          <div class="roi-out-box">
            <div class="roi-out-k">引擎鸟预估净毛利</div>
            <div class="roi-out-v" style="color:var(--trust)" id="outProfit">${fmtWan(brandNetProfit)}</div>
          </div>
          <div class="roi-out-box">
            <div class="roi-out-k">省下投流获客费</div>
            <div class="roi-out-v" id="outSaved">${fmtWan(adCostSaved)}</div>
          </div>
        </div>

        <div style="font-size:11.5px;color:var(--ink-muted);margin-top:10px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;">
          <span>测算口径：折后毛利率 ${r.grossMargin}% ｜ 平台 CPS 分佣 ${r.cpsRate}%（月佣金约 <strong class="mono" id="outCps" style="color:var(--ink-primary)">${fmtWan(platformCps)}</strong>）</span>
          <span>月成交单量：<strong class="mono" id="outBuyers" style="color:var(--ink-primary)">${buyers.toLocaleString()} 单</strong></span>
        </div>

        <div class="pitch-callout trust">
          <div class="callout-copy">
            <strong>首期 90 天试点建议：</strong>引擎鸟零现金赞助，仅提供 <strong>30 件 MVP 实物奖品 + 有赞私域内购配额</strong>，我们用 20 个广东种子跑团跑通真实转化数据！
          </div>
          <button class="action-cta orange" id="pitchUnlockNowBtn">${state.user.monthlyKm >= state.user.targetKm ? "查看已解锁券 →" : "一键达标解锁 →"}</button>
        </div>
      </div>
    `;
  }

  function bindPitchEvents() {
    // Chapter 1 tier switch
    el.pitchContent.querySelectorAll("[data-tier]").forEach((node) => {
      node.addEventListener("click", () => {
        state.selectedTier = node.dataset.tier;
        renderPitch();
      });
    });

    const openSyncBtn = document.getElementById("pitchOpenSyncBtn");
    if (openSyncBtn) openSyncBtn.addEventListener("click", () => openSyncModal());

    // Chapter 2 demo female filter
    const demoFilterBtn = document.getElementById("pitchDemoFilterBtn");
    if (demoFilterBtn) {
      demoFilterBtn.addEventListener("click", () => {
        state.phoneTab = "match";
        state.paceFilter = "female";
        renderPhone();
        showToast("已筛选：女性实名认证专属配速小队");
      });
    }

    // Chapter 3 algo & telemetry switches
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

    // Chapter 4 EEP simulator
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
        showToast("已开启：跑步 + 骑行车队 + 游泳团融合排位榜");
      });
    }

    // Chapter 5 ROI sliders
    el.pitchContent.querySelectorAll("input[data-roi]").forEach((slider) => {
      slider.addEventListener("input", (e) => {
        const key = e.target.dataset.roi;
        state.roi[key] = Number(e.target.value);
        updateRoiReadouts();
      });
    });

    const unlockNowBtn = document.getElementById("pitchUnlockNowBtn");
    if (unlockNowBtn) {
      unlockNowBtn.addEventListener("click", () => {
        state.phoneTab = "perks";
        if (state.user.monthlyKm < state.user.targetKm) {
          applyValidActivity(D.syncSamples[0]);
        } else {
          renderPhone();
          openCouponSheet(D.engineBirdPerks[0]);
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
    set("vClubs", r.clubs + " 团");
    set("vActive", r.activePerClub + " 人/团");
    set("vConv", r.convRate + "%");
    set("vAov", "¥" + r.aov);
    set("outRunners", qualifiedRunners.toLocaleString() + "人");
    set("outGmv", fmtWan(monthlyGMV));
    set("outProfit", fmtWan(brandNetProfit));
    set("outSaved", fmtWan(adCostSaved));
    set("outCps", fmtWan(platformCps));
    set("outBuyers", buyers.toLocaleString() + " 单");
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

    // Update bottom tabs
    el.phoneTabbar.querySelectorAll(".tab-item").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === state.phoneTab);
    });

    const titles = {
      match: "领跑局 PACELAB",
      clubs: "引擎鸟杯 · 跑团排位",
      pk: "跑超 · 城市与省际PK",
      perks: "引擎鸟 · 跑量权益"
    };
    el.wxNavTitle.textContent = titles[state.phoneTab] || "领跑局 PACELAB";

    if (state.phoneTab === "match") renderPhoneMatch();
    else if (state.phoneTab === "clubs") renderPhoneClubs();
    else if (state.phoneTab === "pk") renderPhonePk();
    else if (state.phoneTab === "perks") renderPhonePerks();

    el.phoneBody.scrollTop = 0;
  }

  // Tab 1: Race-Anchored Matching
  function renderPhoneMatch() {
    const filteredSquads = state.squads.filter((sq) => {
      if (sq.raceId !== state.selectedRaceId) return false;
      if (state.paceFilter === "female") return sq.femaleOnly;
      if (state.paceFilter !== "all") return sq.paceBucket === state.paceFilter;
      return true;
    });

    const displaySquads = filteredSquads.length
      ? filteredSquads
      : state.squads.filter((sq) => sq.raceId === state.selectedRaceId);

    el.phoneBody.innerHTML = `
      <div class="m-section-head">
        <span class="m-section-title">选择你的下一场马拉松</span>
        <span class="m-section-sub">聚合全国 600+ 赛事</span>
      </div>

      <div class="race-scroller">
        ${D.races
          .map(
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
        <span class="m-section-title">目标配速列车 & 备赛小队</span>
        <span class="m-section-sub">按配速/兴趣精准匹配</span>
      </div>

      <div class="pill-row">
        <button class="m-pill ${state.paceFilter === "all" ? "active" : ""}" data-pf="all">全部配速</button>
        <button class="m-pill ${state.paceFilter === "sub300" ? "active" : ""}" data-pf="sub300">破300 (4'15")</button>
        <button class="m-pill ${state.paceFilter === "sub330" ? "active" : ""}" data-pf="sub330">破330 (5'00")</button>
        <button class="m-pill ${state.paceFilter === "sub400" ? "active" : ""}" data-pf="sub400">破400 (5'40")</button>
        <button class="m-pill ${state.paceFilter === "female" ? "active" : ""}" data-pf="female">女性认证局</button>
      </div>

      ${displaySquads
        .map(
          (sq) => `
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
                (t) =>
                  `<span class="mini-tag ${t.includes("女性") ? "female" : t.includes("T1") || t.includes("脱敏") ? "trust" : ""}">${t}</span>`
              )
              .join("")}
          </div>
          <div class="squad-foot">
            <div class="avatar-stack">
              ${sq.members.map((m) => `<span class="avatar-dot">${m}</span>`).join("")}
              <span class="avatar-count">${sq.members.length}/${sq.capacity} 人 · ${sq.leader}</span>
            </div>
            <button class="join-btn ${sq.joined ? "joined" : ""}" data-join-squad="${sq.id}">
              ${sq.joined ? "已上车 ✓" : "申请上车"}
            </button>
          </div>
        </div>
      `
        )
        .join("")}

      <div class="m-section-head">
        <span class="m-section-title">本周异步跑步小任务</span>
        <span class="m-section-sub">错峰也能和搭子互动</span>
      </div>

      ${state.quests
        .map(
          (q) => `
        <div class="m-card">
          <div class="quest-row">
            <div class="quest-info">
              <h4>${q.title}</h4>
              <p>${q.desc} · <strong style="color:var(--accent)">${q.reward}</strong></p>
            </div>
            <button class="quest-btn ${q.accepted ? "active" : ""}" data-quest="${q.id}">
              ${q.accepted ? "进行中" : "领取任务"}
            </button>
          </div>
        </div>
      `
        )
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
        const sq = state.squads.find((s) => s.id === btn.dataset.joinSquad);
        if (!sq) return;
        sq.joined = !sq.joined;
        if (sq.joined) {
          if (!sq.members.includes("我")) sq.members.push("我");
          showToast(`已加入「${sq.title.slice(0, 12)}...」微信群卡片已生成`);
        } else {
          sq.members = sq.members.filter((m) => m !== "我");
          showToast("已退出该配速列车");
        }
        renderPhoneMatch();
      });
    });

    el.phoneBody.querySelectorAll("[data-quest]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const q = state.quests.find((item) => item.id === btn.dataset.quest);
        if (!q) return;
        q.accepted = !q.accepted;
        showToast(q.accepted ? `已领取任务：${q.title}` : "已取消任务");
        renderPhoneMatch();
      });
    });
  }

  // Tab 2: Club Rankings (with Multi-Sport Cycling/Swimming Fusion Mode!)
  function renderPhoneClubs() {
    const list = state.clubs[state.clubDivision] || [];
    const isMulti = state.clubDivision === "multisport";

    el.phoneBody.innerHTML = `
      <div class="league-banner">
        <div class="lb-kicker">PACELAB × ENGINE BIRD 引擎鸟</div>
        <div class="lb-title">${isMulti ? "大湾区「全耐力三项」战队融合榜" : "广东秋季跑团公平排位赛"}</div>
        <div class="lb-sub">${
          isMulti
            ? "骑行 3:1 · 游泳 1:4 自动折算等效跑量，车队与泳队同台竞技"
            : "截尾人均 × 活跃率 × 合跑加成 · Top 3 解锁引擎鸟私域内购码"
        }</div>
      </div>

      <div class="pill-row">
        <button class="m-pill ${state.clubDivision === "elite" ? "active" : ""}" data-div="elite">尖兵组 (10-30人)</button>
        <button class="m-pill ${state.clubDivision === "mid" ? "active" : ""}" data-div="mid">劲旅组 (31-100人)</button>
        <button class="m-pill ${state.clubDivision === "mega" ? "active" : ""}" data-div="mega">巨无霸 (100+人)</button>
        <button class="m-pill ${state.clubDivision === "multisport" ? "active" : ""}" data-div="multisport">骑行/游泳融合赛 ✨</button>
      </div>

      <div class="m-section-head">
        <span class="m-section-title">实时战力榜（点击查看公平算法拆解）</span>
        <span class="m-section-sub">48h 公示防作弊</span>
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
              ${c.isUserClub ? `<span class="mini-tag trust">我的团</span>` : ""}
            </div>
            <div class="club-stats">
              ${
                c.sportBadge
                  ? `<strong style="color:var(--accent)">${c.sportBadge}</strong> · ${c.rawMetric}`
                  : `${c.members}人 · 活跃率 ${c.activeRate}% · 合跑加成 +${c.socialBonus}%`
              }
            </div>
          </div>
          <div class="club-score-col">
            <div class="club-score">${c.score.toFixed(1)}</div>
            <div class="club-perk-pill">${i < 3 ? "解锁内购" : "众测池"}</div>
          </div>
        </div>
      `
        )
        .join("")}

      <div class="m-card" style="background:var(--bg-elevated);font-size:11.5px;color:var(--ink-secondary);line-height:1.55;">
        <strong style="color:var(--ink-primary);">防作弊公示机制：</strong>本榜单仅计入 T1 手表直连与 T2 FIT 原始轨迹数据。如发现成员骑车/开车代跑，可点进战队详情一键举报，核实后触发 3 倍连坐扣分。
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

  // Tab 3: RunSuper City PK & Guangdong vs Jiangsu Finals
  function renderPhonePk() {
    const isProv = state.pkScope === "province";
    const gz = state.gdCities[0];
    const sz = state.gdCities[1];
    const derbyLeftPct = Math.round((gz.total / (gz.total + sz.total)) * 100);

    const fn = state.finals;
    const natLeftPct = Math.round((fn.left.score / (fn.left.score + fn.right.score)) * 100);

    el.phoneBody.innerHTML = `
      <div class="pk-switch">
        <button class="pk-switch-btn ${isProv ? "active" : ""}" data-pk="province">广东省内战 (21城)</button>
        <button class="pk-switch-btn ${!isProv ? "active" : ""}" data-pk="national">省际巅峰 (粤 vs 苏)</button>
      </div>

      ${
        isProv
          ? `
        <div class="derby-card">
          <div class="derby-badge">🔥 WEEK 3 · 广东宿敌德比战 · 胜者夺取 5% 积分</div>
          <div class="derby-vs-row">
            <div class="derby-side">
              <span class="derby-city">广州</span>
              <span class="derby-nick">${gz.nickname}</span>
              <span class="derby-score" style="color:var(--accent)">${gz.total.toFixed(1)}</span>
            </div>
            <span class="derby-vs">VS</span>
            <div class="derby-side right">
              <span class="derby-city">深圳</span>
              <span class="derby-nick">${sz.nickname}</span>
              <span class="derby-score" style="color:var(--rival-blue)">${sz.total.toFixed(1)}</span>
            </div>
          </div>
          <div class="tug-bar">
            <div class="tug-left" style="width:${derbyLeftPct}%"></div>
          </div>
          <div class="derby-meme">
            💬 实时战报：「广州靠海心沙早茶跑团清晨反超 0.9 分！深圳南山跑友正在深圳湾疯狂加班补跑中…」
          </div>
        </div>

        <div class="m-section-head">
          <span class="m-section-title">广东城市战力榜</span>
          <span class="m-section-sub">前 3 城代表广东出战全国</span>
        </div>

        <div class="m-card" style="padding:4px 13px;">
          ${state.gdCities
            .map(
              (c, idx) => `
            <div class="city-row">
              <div class="club-rank-box ${idx === 0 ? "r1" : idx === 1 ? "r2" : idx === 2 ? "r3" : ""}">${idx + 1}</div>
              <div class="club-main">
                <div class="club-name-line">
                  <span class="club-name">${c.city} · ${c.nickname}</span>
                  ${c.qualified ? `<span class="city-qual-tag">省队出线区</span>` : ""}
                </div>
                <div class="club-stats">主力75%: ${c.squadScore} + 助威25%: ${c.citizenBuff} · ${c.participants.toLocaleString()}人出战</div>
              </div>
              <div class="club-score-col">
                <div class="club-score">${c.total.toFixed(1)}</div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <button class="full-cta-btn orange" id="openPosterBtn">生成我的「广州出战」炫耀海报</button>
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
            🔥 粤方放话：「${fn.left.slogan}」<br/>
            🔥 苏方回怼：「${fn.right.slogan}」
          </div>
        </div>

        <div class="m-card">
          <div class="m-section-head" style="margin-top:0;">
            <span class="m-section-title">全国省际联合排名</span>
            <span class="m-section-sub">含骑行/游泳等效积分</span>
          </div>
          <div class="city-row">
            <div class="club-rank-box r1">1</div>
            <div class="club-main">
              <div class="club-name-line"><span class="club-name">${fn.left.province}</span><span class="city-qual-tag">当前领跑</span></div>
              <div class="club-stats">${fn.left.cities} · ${fn.left.activeRunners.toLocaleString()}名认证选手</div>
            </div>
            <div class="club-score">${fn.left.score.toFixed(1)}</div>
          </div>
          <div class="city-row">
            <div class="club-rank-box r2">2</div>
            <div class="club-main">
              <div class="club-name-line"><span class="club-name">${fn.right.province}</span></div>
              <div class="club-stats">${fn.right.cities} · ${fn.right.activeRunners.toLocaleString()}名认证选手</div>
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
          <div style="font-size:12px;font-weight:800;color:var(--accent);margin-bottom:4px;">冠军省终极荣耀权益（引擎鸟赞助）</div>
          <div style="font-size:11.5px;color:var(--ink-primary);line-height:1.5;">
            获胜省内所有当月实跑 ≥30km 的出战跑者，全员解锁 <strong>「引擎鸟冠军省 7.5 折私域内购券」</strong> + 限量抢购 <strong>「粤跑/苏跑冠军限定印字战袍」</strong>！
          </div>
        </div>

        <button class="full-cta-btn" id="openPosterBtn">生成「粤苏巅峰」助威战报</button>
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

  // Tab 4: EngineBird Proof-of-Run Perks
  function renderPhonePerks() {
    const unlocked = state.user.monthlyKm >= state.user.targetKm;
    const remain = Math.max(0, state.user.targetKm - state.user.monthlyKm);

    el.phoneBody.innerHTML = `
      <div class="por-hero ${unlocked ? "unlocked" : ""}">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
          <span class="mini-tag ${unlocked ? "trust" : ""}" style="${!unlocked ? "background:var(--accent-soft);color:var(--accent);" : ""}">
            ${unlocked ? "✓ Proof-of-Run 已达标" : "待解锁 · 防止羊毛党机制"}
          </span>
          <span class="mono" style="font-size:12px;font-weight:800;color:${unlocked ? "var(--trust)" : "var(--accent)"}">
            ${state.user.monthlyKm.toFixed(1)} / 30.0 km
          </span>
        </div>
        <div style="font-size:14.5px;font-weight:800;margin-bottom:4px;">
          ${unlocked ? "恭喜！已解锁引擎鸟私域内购与冠军战袍资格" : `再跑 ${remain.toFixed(1)} km 解锁引擎鸟跑团专属权益`}
        </div>
        <div style="font-size:11.5px;color:var(--ink-secondary);line-height:1.5;">
          ${
            unlocked
              ? "你的 T1 认证跑量已达标，且所属「广州天河高能尖兵团」位居尖兵组 Top 1。点击下方生成加密内购码直达引擎鸟有赞微商城。"
              : "只有当月实跑 ≥30km 的认证跑者才可领券，点击顶部「+ 同步运动」立即模拟上传一次跑步或骑行换算即可解锁！"
          }
        </div>
        ${
          !unlocked
            ? `<button class="full-cta-btn orange" id="perksQuickSyncBtn">+ 立即同步 1 次跑步解锁权益</button>`
            : ""
        }
      </div>

      <div class="m-section-head">
        <span class="m-section-title">引擎鸟 × 领跑局 私域专属权益</span>
        <span class="m-section-sub">不破公域控价</span>
      </div>

      ${D.engineBirdPerks
        .map((p) => {
          const canClaim = state.user.monthlyKm >= p.minKm;
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
                      <span class="perk-price">${p.salePrice === 0 ? "免费众测" : "¥" + p.salePrice}</span>
                      <span class="perk-orig">¥${p.origPrice}</span>
                    </div>
                    <button class="join-btn ${canClaim ? "" : "joined"}" style="${
                      !canClaim ? "background:var(--bg-subtle);color:var(--ink-muted);border:none;" : ""
                    }" data-claim-perk="${p.id}">
                      ${canClaim ? "生成内购码" : `需 ${p.minKm}km`}
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
          <span class="m-section-title">冠军省联名战袍印字预览</span>
          <span class="m-section-sub">鸟叔工业设计定制</span>
        </div>
        <div style="display:flex;gap:6px;margin-bottom:9px;">
          <button class="m-pill ${state.jerseyStyle.includes("广州") ? "active" : ""}" data-jersey="粤跑冠军 · 广州">粤跑冠军·广州</button>
          <button class="m-pill ${state.jerseyStyle.includes("南京") ? "active" : ""}" data-jersey="苏跑第一 · 南京">苏跑第一·南京</button>
        </div>
        <div style="background:linear-gradient(135deg,#13171E,#263040);color:#fff;border-radius:12px;padding:14px;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-size:9.5px;letter-spacing:0.12em;color:#FF8A57;font-weight:700;">ENGINE BIRD × PACELAB</div>
            <div style="font-size:16px;font-weight:800;margin:3px 0;">${state.jerseyStyle}</div>
            <div style="font-size:10.5px;color:rgba(255,255,255,0.72);">2026 跑超冠军省限定版 · 轻量化龙鳞速干面料</div>
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
        const perk = D.engineBirdPerks.find((p) => p.id === btn.dataset.claimPerk);
        if (!perk) return;
        if (state.user.monthlyKm < perk.minKm) {
          showToast(`当前跑量 ${state.user.monthlyKm.toFixed(1)}km，还差 ${(perk.minKm - state.user.monthlyKm).toFixed(1)}km 解锁`);
          openSyncModal();
          return;
        }
        openCouponSheet(perk);
      });
    });

    el.phoneBody.querySelectorAll("[data-jersey]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.jerseyStyle = btn.dataset.jersey;
        renderPhonePerks();
      });
    });
  }

  // =========================================================================
  // Phone Bottom Sheet Modals (Sync, Club Breakdown, Poster, Coupon)
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
        <div class="sheet-title">同步运动记录（多平台 + 铁三换算）</div>
        <button class="sheet-close" data-close-sheet>×</button>
      </div>
      <p style="font-size:11.5px;color:var(--ink-secondary);margin-bottom:10px;">
        点击任意模拟样例，体验 AI 截图秒识、手表直连、骑行/游泳等效换算，或测试骑车作弊拦截：
      </p>
      <div id="syncOptionsContainer">
        ${D.syncSamples
          .map(
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
    const sample = D.syncSamples.find((s) => s.id === sampleId);
    if (!sample) return;

    const container = document.getElementById("syncOptionsContainer");
    if (!container) return;

    container.innerHTML = `
      <div class="scan-box">
        <div style="font-size:22px;margin-bottom:6px;">${sample.valid ? "📡" : "🛡️"}</div>
        <div style="font-size:13.5px;font-weight:800;margin-bottom:4px;">正在进行多维轨迹与传感器校验…</div>
        <div style="font-size:11.5px;color:var(--ink-secondary);">核验来源：${sample.source}</div>
      </div>
    `;

    setTimeout(() => {
      if (!sample.valid) {
        container.innerHTML = `
          <div class="scan-box" style="background:var(--danger-soft);border-color:rgba(220,38,38,0.28);text-align:left;">
            <div style="font-size:14px;font-weight:800;color:var(--danger);margin-bottom:6px;">🚨 风控拦截：疑似骑行代跑，拒绝入账！</div>
            <div style="font-size:11.5px;color:var(--ink-primary);line-height:1.55;">
              • 配速 <strong>3'38"/km</strong>（均速 16.5km/h）但加速度计步频为 <strong>0 spm</strong><br/>
              • 心率仅 <strong>91 bpm</strong>，与配速严重背离<br/>
              • 已自动隔离该轨迹，<strong>不计入跑团排位与引擎鸟折扣资格</strong>，并向团长发送预警。
            </div>
          </div>
          <button class="full-cta-btn" id="retrySyncBtn">返回选择正常记录测试</button>
        `;
        document.getElementById("retrySyncBtn").addEventListener("click", openSyncModal);
        showToast("已拦截疑似骑车作弊轨迹！");
        return;
      }

      applyValidActivity(sample);
      container.innerHTML = `
        <div class="scan-box" style="background:var(--trust-soft);border-color:var(--trust-border);text-align:left;">
          <div style="font-size:14px;font-weight:800;color:var(--trust);margin-bottom:6px;">✓ 校验通过，已实时计入战绩！</div>
          <div style="font-size:12px;color:var(--ink-primary);line-height:1.6;">
            <strong>${sample.title}</strong><br/>
            ${sample.rawDisplay ? `原始记录：${sample.rawDisplay}<br/>` : ""}
            • 本月有效跑量更新至：<strong class="mono">${state.user.monthlyKm.toFixed(1)} km</strong><br/>
            • 已为「${state.user.clubName}」及「广州战队」注入积分！<br/>
            ${
              state.user.monthlyKm >= state.user.targetKm
                ? `• <strong style="color:var(--accent)">🎉 恭喜满 30km！已解锁引擎鸟私域内购券！</strong>`
                : ""
            }
          </div>
        </div>
        <button class="full-cta-btn orange" id="goPerksAfterSync">去领取引擎鸟专属权益 →</button>
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
    // Boost user's club & Guangzhou city score live!
    const gz = state.gdCities.find((c) => c.id === "gz");
    if (gz) {
      gz.total = Number((gz.total + 0.4).toFixed(1));
      gz.participants += 1;
    }
    state.finals.left.score = Number((state.finals.left.score + 0.4).toFixed(1));

    const userClub = state.clubs.elite.find((c) => c.isUserClub);
    if (userClub) userClub.score = Number((userClub.score + 0.3).toFixed(1));

    renderPhone();
    if (state.chapter === 0 || state.chapter === 4) renderPitch();
    showToast(`+${sample.km}km 已入账！${state.user.monthlyKm >= 30 ? "引擎鸟内购已解锁！" : ""}`);
  }

  function openClubDetailSheet(club) {
    openSheet(`
      <div class="sheet-head">
        <div class="sheet-title">${club.name}</div>
        <button class="sheet-close" data-close-sheet>×</button>
      </div>
      <div style="font-size:12px;color:var(--ink-secondary);margin-bottom:10px;">
        ${club.city} · ${club.members} 名认证成员 · <strong>${club.perk}</strong>
      </div>
      <div class="m-card" style="background:var(--bg-elevated);">
        <div style="font-size:11.5px;font-weight:700;margin-bottom:8px;">公平得分算法透视（总分 ${club.score.toFixed(1)}）</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div class="tm-cell"><div class="tm-k">10%截尾人均跑量</div><div class="tm-v">${club.trimAvgKm} km</div></div>
          <div class="tm-cell"><div class="tm-k">有效活跃率</div><div class="tm-v good">${club.activeRate}%</div></div>
          <div class="tm-cell"><div class="tm-k">合跑/小任务加成</div><div class="tm-v" style="color:var(--accent)">+${club.socialBonus}%</div></div>
          <div class="tm-cell"><div class="tm-k">T1 手表可信占比</div><div class="tm-v good">${club.t1Ratio}%</div></div>
        </div>
        ${
          club.rawMetric
            ? `<div style="font-size:11.5px;color:var(--accent);margin-top:8px;font-weight:600;">⚡ 跨项换算明细：${club.rawMetric}</div>`
            : ""
        }
      </div>
      <button class="full-cta-btn" data-close-sheet>关闭透视</button>
    `);
  }

  function openPosterSheet() {
    const gz = state.gdCities[0];
    openSheet(`
      <div class="sheet-head">
        <div class="sheet-title">分享战报 · 朋友圈 / 跑团群裂变</div>
        <button class="sheet-close" data-close-sheet>×</button>
      </div>
      <div class="poster-canvas">
        <div style="font-size:10px;letter-spacing:0.12em;color:#FF8A57;font-weight:700;margin-bottom:6px;">2026 RUN SUPER LEAGUE · 跑超广东主场</div>
        <div style="font-size:21px;font-weight:800;line-height:1.25;margin-bottom:10px;">
          我已为【广州早茶铁军】<br/>贡献 ${state.user.monthlyKm.toFixed(1)} km 战力！
        </div>
        <div style="display:flex;gap:14px;margin-bottom:14px;">
          <div>
            <div style="font-size:10px;opacity:0.7;">当前省内排名</div>
            <div class="mono" style="font-size:20px;font-weight:800;color:#FF8A57;">NO.1</div>
          </div>
          <div>
            <div style="font-size:10px;opacity:0.7;">广州总战力</div>
            <div class="mono" style="font-size:20px;font-weight:800;">${gz.total.toFixed(1)}</div>
          </div>
          <div>
            <div style="font-size:10px;opacity:0.7;">跨省巅峰战</div>
            <div class="mono" style="font-size:20px;font-weight:800;color:#34D399;">领跑江苏</div>
          </div>
        </div>
        <div style="font-size:11px;opacity:0.85;border-top:1px solid rgba(255,255,255,0.16);padding-top:9px;display:flex;justify-content:space-between;">
          <span>「早茶没喝完，配速先干到 430」</span>
          <strong>引擎鸟赞助</strong>
        </div>
      </div>
      <button class="full-cta-btn orange" id="copyPosterBtn">一键转发至微信跑团群摇人</button>
    `);
    document.getElementById("copyPosterBtn").addEventListener("click", () => {
      closeSheet();
      showToast("已生成微信群转发卡片（演示模式）");
    });
  }

  function openCouponSheet(perk) {
    const code = perk.codePrefix + "8F92K";
    openSheet(`
      <div class="sheet-head">
        <div class="sheet-title">引擎鸟私域专属核销码</div>
        <button class="sheet-close" data-close-sheet>×</button>
      </div>
      <div style="font-size:13px;font-weight:700;margin-bottom:3px;">${perk.name}</div>
      <div style="font-size:11.5px;color:var(--ink-secondary);">
        认证跑者：${state.user.name}（本月 T1 认证 ${state.user.monthlyKm.toFixed(1)} km）· 单人绑定防黄牛转卖
      </div>
      <div class="coupon-code-box">${code}</div>
      <div style="font-size:11px;color:var(--ink-secondary);line-height:1.5;margin-bottom:10px;">
        • <strong>控价保护</strong>：仅限引擎鸟有赞官方微商城隐藏通道核销，不影响天猫/京东公域价格体系。<br/>
        • 核销成功后自动记录本场活动 CPS 归因，实时沉淀至引擎鸟私域会员池。
      </div>
      <button class="full-cta-btn orange" id="jumpYouzanBtn">复制密令并跳转引擎鸟有赞商城 →</button>
    `);
    document.getElementById("jumpYouzanBtn").addEventListener("click", () => {
      closeSheet();
      showToast(`已复制 ${code} · 模拟跳转引擎鸟有赞微商城`);
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
    el.togglePhoneOnlyText.textContent = state.phoneOnly ? "显示路演面板" : "专注原型";
  });

  el.mobileModeBar.querySelectorAll("[data-mobile-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.mobileView = btn.dataset.mobileView;
      el.mobileModeBar.querySelectorAll(".mobile-mode-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.mobileView === state.mobileView);
      });
      document.body.classList.toggle("mobile-show-pitch", state.mobileView === "pitch");
    });
  });

  // Keyboard arrow navigation for live pitching
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "ArrowRight") setChapter(state.chapter + 1, true);
    if (e.key === "ArrowLeft") setChapter(state.chapter - 1, true);
    if (e.key === "Escape") closeSheet();
  });

  // Initialize
  setChapter(0, true);
})();

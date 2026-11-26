/* ==========================================================================
   PACELAB × ENGINE BIRD — English Dataset & Bilingual UI Dictionary
   Natural English founder-pitch copy for international friends & advisors
   ========================================================================== */

window.PITCH_DATA_EN = {
  chapters: [
    {
      id: 0,
      tab: "match",
      hint: "Live demo: Multi-platform sync & AI screenshot OCR",
      kicker: "01 / Wedge & Data Layer · Beyond GPS Tracking",
      title: "The cross-platform social & competitive layer for China's 7M runners",
      lead: "Serious runners in China have moved from phone tracking apps to Garmin, COROS, Huawei & Apple Watch — leaving legacy apps (Codoon, Keep, Joyrun) as isolated silos. PACELAB sits above every watch and app via a 3-tier ingestion architecture."
    },
    {
      id: 1,
      tab: "match",
      hint: "Live demo: Guangzhou Marathon Pace Trains & async quests",
      kicker: "02 / Core Retention · Race-Anchored Matching",
      title: "Replacing flaky 1-on-1 run dates with Marathon Pace Trains",
      lead: "Pure 'running buddy' apps fail from safety concerns, mismatched motives, and schedule friction. We anchor matching to 600+ real Chinese marathons and target paces — forming 3–6 runner squads with 500m home-privacy zones and async quests."
    },
    {
      id: 2,
      tab: "clubs",
      hint: "Live demo: Engine Bird Cup fair club league & anti-cheat",
      kicker: "03 / Cold-Start GTM · Fair Algorithm & Anti-Cheat",
      title: "Engine Bird Cup: where a tight 30-person club can beat a 300-person giant",
      lead: "Instead of cold-starting 1-by-1, we onboard local run-club captains in batches. Our trimmed-mean × active-rate × group-run formula rewards real community energy, while 4-layer sensor telemetry blocks bike-cheating freeloaders."
    },
    {
      id: 3,
      tab: "pk",
      hint: "Live demo: Run Super League city PK + cycling/swimming EEP fusion",
      kicker: "04 / Viral IP · China's 'Village Super League' for Endurance",
      title: "City-vs-City → Province-vs-Province PK, expanding to cycling & swimming",
      lead: "Inspired by China's viral grassroots 'Village Super League' & 'Su Super' city rivalries, our 75% Top-100 Squad + 25% Citizen Buff model lets smaller cities upset megacities. Built-in EEP conversion (1km swim = 4km run = 12km bike) unlocks a 3× larger endurance TAM."
    },
    {
      id: 4,
      tab: "perks",
      hint: "Live demo: Proof-of-Run Engine Bird private-channel perks & ROI",
      kicker: "05 / Brand Flywheel · Zero-Risk Partner ROI",
      title: "Zero public price erosion, zero freeloaders: Proof-of-Run private commerce",
      lead: "We never ask Engine Bird for blanket public discounts that hurt Tmall/JD pricing. Only T1-verified runners logging ≥30km/month unlock private WeChat-store VIP codes, champion-province jerseys, and R&D gear testing — driving pure net-new ROI."
    }
  ],

  races: [
    {
      id: "gzm",
      name: "2026 Guangzhou Marathon",
      city: "Guangzhou",
      date: "Dec 08",
      countdown: "13d left",
      runners: "2,840 training now"
    },
    {
      id: "szm",
      name: "2026 Shenzhen Marathon",
      city: "Shenzhen",
      date: "Dec 01",
      countdown: "6d left",
      runners: "2,310 training now"
    },
    {
      id: "xm",
      name: "2027 Xiamen Marathon",
      city: "Xiamen",
      date: "Jan 05",
      countdown: "41d left",
      runners: "1,960 training now"
    },
    {
      id: "wx",
      name: "2027 Wuxi Marathon",
      city: "Wuxi",
      date: "Mar 23",
      countdown: "118d left",
      runners: "3,420 training now"
    }
  ],

  squads: [
    {
      id: "sq1",
      raceId: "gzm",
      title: "GZ Sub-3:30 · Canton Tower Sunday 5:00 Pace Bus",
      pace: "4'55\"–5'05\"",
      paceBucket: "sub330",
      spot: "Guangzhou · Haixinsha Park",
      time: "Sun 06:30 · 22km LSD",
      leader: "Coach Chen (Garmin T1)",
      tags: ["T1 Watch Verified", "500m Privacy Zone", "Post-Run Dim Sum"],
      femaleOnly: false,
      members: ["C", "L", "Z", "M"],
      capacity: 6,
      joined: false
    },
    {
      id: "sq2",
      raceId: "gzm",
      title: "Pearl River Women-Only Sub-4:00 Night Squad",
      pace: "5'35\"–5'50\"",
      paceBucket: "sub400",
      spot: "Guangzhou · Pearl River Greenway",
      time: "Wed/Fri 19:30 · 10km",
      leader: "Suki (3:56 PB)",
      tags: ["Women Verified Only", "T1 Watch Verified", "Photo Run"],
      femaleOnly: true,
      members: ["S", "Y", "M"],
      capacity: 5,
      joined: true
    },
    {
      id: "sq3",
      raceId: "gzm",
      title: "Tianhe CBD 6AM Coffee Run · Sub-4:00 Push",
      pace: "5'20\"–5'35\"",
      paceBucket: "sub400",
      spot: "Guangzhou · Tianhe Sports Center",
      time: "Tue/Thu 06:15 · 8km",
      leader: "Ken (Product PM)",
      tags: ["Coffee Run", "Early Birds", "500m Privacy Zone"],
      femaleOnly: false,
      members: ["K", "Y", "H", "L", "T"],
      capacity: 6,
      joined: false
    },
    {
      id: "sq4",
      raceId: "szm",
      title: "Shenzhen Sub-3:00 Elite Long Run · Bay Breeze",
      pace: "4'10\"–4'20\"",
      paceBucket: "sub300",
      spot: "Shenzhen · Talent Park Bay",
      time: "Sat 06:00 · 30km Long Run",
      leader: "Liang (2:52 PB)",
      tags: ["T1 Watch Verified", "Engine Bird Tester", "Gel Drop"],
      femaleOnly: false,
      members: ["L", "F", "Y"],
      capacity: 5,
      joined: false
    },
    {
      id: "sq5",
      raceId: "szm",
      title: "Shenzhen Bay Sunrise 5:30 Women's Half Squad",
      pace: "5'25\"–5'40\"",
      paceBucket: "sub400",
      spot: "Shenzhen · Liuhuashan Trail",
      time: "Sun 06:30 · 15km",
      leader: "Vivi (COROS T1)",
      tags: ["Women Verified Only", "Coffee Run", "T1 Watch Verified"],
      femaleOnly: true,
      members: ["V", "Y", "Q", "A"],
      capacity: 6,
      joined: false
    },
    {
      id: "sq6",
      raceId: "xm",
      title: "GZ–SZ Remote Xiamen Marathon Prep Pod",
      pace: "4'50\"–5'05\"",
      paceBucket: "sub330",
      spot: "Cross-City · Async Check-in",
      time: "4 runs/wk · 240km team goal",
      leader: "Jay (3:24 Xiamen PB)",
      tags: ["T1 Watch Verified", "Weekly Check-in", "Early Birds"],
      femaleOnly: false,
      members: ["J", "T", "M", "X"],
      capacity: 8,
      joined: false
    },
    {
      id: "sq7",
      raceId: "wx",
      title: "Wuxi Cherry Blossom Winter Base · GD × JS Pod",
      pace: "5'10\"–5'25\"",
      paceBucket: "sub330",
      spot: "Guangzhou / Nanjing · Remote",
      time: "Sundays · Synced 20km LSD",
      leader: "Gu (3:28 Wuxi PB)",
      tags: ["Cross-Province", "T1 Watch Verified", "Coffee Run"],
      femaleOnly: false,
      members: ["G", "H", "L"],
      capacity: 6,
      joined: false
    }
  ],

  quests: [
    {
      id: "q1",
      title: "2-Runner Blind-Box Marathon Relay · 42.2 km",
      desc: "Hit a combined 42.195km this week with a pace-matched partner to unlock a duo badge",
      reward: "+120 Club Pts",
      accepted: true
    },
    {
      id: "q2",
      title: "Async Park High-Five · Haixinsha",
      desc: "Run ≥5km in the same park anytime this week to trigger a 'Crossed Paths' bonus",
      reward: "+3% Social Buff",
      accepted: false
    }
  ],

  clubsByDivision: {
    elite: [
      {
        id: "c1",
        name: "Tianhe Aero Runners",
        city: "Guangzhou",
        members: 28,
        activeRate: 93,
        trimAvgKm: 138.4,
        socialBonus: 18,
        t1Ratio: 96,
        score: 94.8,
        perk: "Top 1 · Engine Bird 28% Off VIP + Custom Jersey",
        isUserClub: true
      },
      {
        id: "c2",
        name: "Zhuhai Lovers' Road Flyers",
        city: "Zhuhai",
        members: 24,
        activeRate: 91,
        trimAvgKm: 132.0,
        socialBonus: 15,
        t1Ratio: 94,
        score: 91.2,
        perk: "Top 2 · Engine Bird 25% Off VIP Code"
      },
      {
        id: "c3",
        name: "Shenzhen Houhai Sub-3 Crew",
        city: "Shenzhen",
        members: 21,
        activeRate: 88,
        trimAvgKm: 141.5,
        socialBonus: 11,
        t1Ratio: 98,
        score: 88.6,
        perk: "Top 3 · Engine Bird 22% Off VIP Code"
      },
      {
        id: "c4",
        name: "Shantou Dawn Beef-Ball Club",
        city: "Shantou",
        members: 26,
        activeRate: 85,
        trimAvgKm: 118.2,
        socialBonus: 16,
        t1Ratio: 89,
        score: 84.1,
        perk: "Top 10 · New Gear Beta Access"
      }
    ],
    mid: [
      {
        id: "c5",
        name: "Shenzhen Bay 5AM Club",
        city: "Shenzhen",
        members: 76,
        activeRate: 89,
        trimAvgKm: 124.6,
        socialBonus: 19,
        t1Ratio: 95,
        score: 95.4,
        perk: "Top 1 · Engine Bird 28% Off VIP + Custom Jersey"
      },
      {
        id: "c6",
        name: "Foshan Qiandeng Lake Pacers",
        city: "Foshan",
        members: 64,
        activeRate: 87,
        trimAvgKm: 121.8,
        socialBonus: 17,
        t1Ratio: 92,
        score: 92.1,
        perk: "Top 2 · Engine Bird 25% Off VIP Code"
      },
      {
        id: "c7",
        name: "Songshan Lake Endurance Lab",
        city: "Dongguan",
        members: 82,
        activeRate: 83,
        trimAvgKm: 116.4,
        socialBonus: 14,
        t1Ratio: 91,
        score: 87.9,
        perk: "Top 3 · Engine Bird 22% Off VIP Code"
      }
    ],
    mega: [
      {
        id: "c8",
        name: "Yuexiu Century Runners",
        city: "Guangzhou",
        members: 218,
        activeRate: 79,
        trimAvgKm: 109.5,
        socialBonus: 16,
        t1Ratio: 88,
        score: 90.6,
        perk: "Top 1 · Engine Bird 28% Off VIP + Custom Jersey"
      },
      {
        id: "c9",
        name: "Nanshan Tech Park Mega Club",
        city: "Shenzhen",
        members: 320,
        activeRate: 62,
        trimAvgKm: 98.2,
        socialBonus: 10,
        t1Ratio: 85,
        score: 79.4,
        perk: "Top 2 · Engine Bird 25% Off VIP Code"
      }
    ],
    multisport: [
      {
        id: "cm1",
        sport: "run",
        sportBadge: "Run Club · 1:1 Base",
        name: "Tianhe Aero Runners",
        city: "Guangzhou",
        members: 28,
        activeRate: 93,
        trimAvgKm: 138.4,
        rawMetric: "Avg 138.4 km run",
        socialBonus: 18,
        t1Ratio: 96,
        score: 94.8,
        perk: "Multi-Sport #1 · Co-Branded Jersey + VIP Code",
        isUserClub: true
      },
      {
        id: "cm2",
        sport: "bike",
        sportBadge: "Cycling · 3km = 1km Run",
        name: "Dapeng Bay Aero Cycling Club",
        city: "Shenzhen",
        members: 42,
        activeRate: 90,
        trimAvgKm: 134.2,
        rawMetric: "Avg 402.6 km ride → 134.2 km eq.",
        socialBonus: 16,
        t1Ratio: 97,
        score: 93.4,
        perk: "Multi-Sport #2 · UV Apparel & VIP Code"
      },
      {
        id: "cm3",
        sport: "swim",
        sportBadge: "Swim/Tri · 1km = 4km Run",
        name: "Pearl River Open-Water Tri Club",
        city: "Guangzhou",
        members: 34,
        activeRate: 88,
        trimAvgKm: 128.0,
        rawMetric: "Avg 32.0 km swim → 128.0 km eq.",
        socialBonus: 15,
        t1Ratio: 94,
        score: 90.9,
        perk: "Multi-Sport #3 · Tri Gear & VIP Code"
      },
      {
        id: "cm4",
        sport: "bike",
        sportBadge: "Cycling · 3km = 1km Run",
        name: "Shunde Morning Peloton",
        city: "Foshan",
        members: 51,
        activeRate: 85,
        trimAvgKm: 119.5,
        rawMetric: "Avg 358.5 km ride → 119.5 km eq.",
        socialBonus: 14,
        t1Ratio: 92,
        score: 87.3,
        perk: "Top 10 · Windbreaker R&D Beta Slot"
      }
    ]
  },

  algoCompare: [
    {
      name: "Tianhe Aero Runners",
      meta: "45 runners · 91% active · high group-run rate",
      rawKm: 4120,
      fairScore: 94.8
    },
    {
      name: "Foshan Qiandeng Pacers",
      meta: "64 runners · 87% active · strong pace progress",
      rawKm: 5380,
      fairScore: 92.1
    },
    {
      name: "Generic 320-Member Mega Group",
      meta: "320 members · only 41% active · mostly lurkers",
      rawKm: 11850,
      fairScore: 68.4
    },
    {
      name: "3-Person Pro Farming Alt-Squad",
      meta: "3 people · below club size floor · 0 social buff",
      rawKm: 1290,
      fairScore: 52.0
    }
  ],

  guangdongCities: [
    {
      id: "gz",
      city: "Guangzhou",
      nickname: "Dim Sum Pacers",
      squadScore: 71.4,
      citizenBuff: 22.8,
      total: 94.2,
      participants: 6420,
      qualified: true
    },
    {
      id: "sz",
      city: "Shenzhen",
      nickname: "5AM Hustlers",
      squadScore: 70.9,
      citizenBuff: 22.4,
      total: 93.3,
      participants: 6180,
      qualified: true
    },
    {
      id: "fs",
      city: "Foshan",
      nickname: "Wing Chun Aero",
      squadScore: 68.6,
      citizenBuff: 20.9,
      total: 89.5,
      participants: 3410,
      qualified: true
    },
    {
      id: "zh",
      city: "Zhuhai",
      nickname: "Coastline Flyers",
      squadScore: 68.2,
      citizenBuff: 19.8,
      total: 88.0,
      participants: 1890,
      qualified: false
    },
    {
      id: "dg",
      city: "Dongguan",
      nickname: "Hoop-to-Road Crew",
      squadScore: 65.4,
      citizenBuff: 19.2,
      total: 84.6,
      participants: 2760,
      qualified: false
    },
    {
      id: "st",
      city: "Shantou",
      nickname: "Carb-Load Squad",
      squadScore: 63.1,
      citizenBuff: 18.7,
      total: 81.8,
      participants: 1620,
      qualified: false
    }
  ],

  provinceFinals: {
    matchTitle: "2026 Run Super Finals · Guangdong vs Jiangsu",
    left: {
      province: "Team Guangdong",
      cities: "Guangzhou · Shenzhen · Foshan",
      slogan: "4:30/km pace before morning dim sum even cools down",
      score: 277.0,
      activeRunners: 16010
    },
    right: {
      province: "Team Jiangsu",
      cities: "Nanjing · Suzhou · Wuxi",
      slogan: "Rivals at home, united to crush the Greater Bay Area",
      score: 274.6,
      activeRunners: 15480
    },
    others: [
      { rank: 3, province: "Team Zhejiang", cities: "Hangzhou · Ningbo · Wenzhou", score: 261.8 },
      { rank: 4, province: "Team Sichuan–Chongqing", cities: "Chengdu · Chongqing · Mianyang", score: 249.2 }
    ]
  },

  engineBirdPerks: [
    {
      id: "eb1",
      name: "Engine Bird · Classic 2-in-1 Marathon Shorts",
      tag: "Private-Channel VIP · Zero Tmall/JD Price Erosion",
      desc: "360° gel & phone waist pockets · anti-chafe bonded seams",
      salePrice: 179,
      origPrice: 239,
      discountLabel: "25% Off VIP",
      minKm: 30,
      codePrefix: "EB-GD30-"
    },
    {
      id: "eb2",
      name: "Champion Province Ed. · Dragon-Scale Singlet",
      tag: "City-Pride Custom Print · Walking Race Billboard",
      desc: "Custom print: 'GD CHAMPS · GUANGZHOU' or 'JS #1 · NANJING'",
      salePrice: 159,
      origPrice: 219,
      discountLabel: "Champs Exclusive",
      minKm: 30,
      isJersey: true,
      codePrefix: "EB-CHAMP-"
    },
    {
      id: "eb3",
      name: "Founder's R&D Beta Lab · Trail Gaiters / Sports Bra",
      tag: "Real Mileage Feedback Loop for Product Dev",
      desc: "Top 50 monthly verified runners test unreleased prototypes free",
      salePrice: 0,
      origPrice: 199,
      discountLabel: "Beta Pass",
      minKm: 60,
      codePrefix: "EB-LAB-"
    }
  ],

  syncSamples: [
    {
      id: "sync_garmin",
      tier: "T1",
      source: "Garmin Forerunner 265 · T1 Native FIT",
      title: "Zhujiang New Town Dawn Run · 10.2 km",
      km: 10.2,
      pace: "4'56\"/km",
      cadence: 180,
      hr: 153,
      valid: true,
      desc: "Full cadence, HR & GPS telemetry verified · 100% counts toward club & VIP unlock"
    },
    {
      id: "sync_codoon",
      tier: "T3",
      source: "Codoon App Screenshot · AI Instant OCR",
      title: "Haixinsha Evening Run · 6.5 km",
      km: 6.5,
      pace: "5'18\"/km",
      cadence: 172,
      hr: null,
      valid: true,
      desc: "AI extracts pace, distance & watermark in 1s · counts for matching & citizen buff"
    },
    {
      id: "sync_bike",
      tier: "T1",
      source: "Garmin Edge / Xingzhe · Cycling EEP (Future)",
      title: "University Town Ride 36.0 km → 12.0 km Run Eq.",
      km: 12.0,
      rawDisplay: "Ride 36.0 km (31.4 km/h avg · 195W)",
      pace: "+120 EEP",
      cadence: 88,
      hr: 146,
      valid: true,
      isMultiSport: true,
      desc: "Auto-converted at 3km bike = 1km run (triathlon MET ratio) into city standings"
    },
    {
      id: "sync_swim",
      tier: "T1",
      source: "Apple Watch · Swim EEP Conversion (Future)",
      title: "Pool Freestyle 2.0 km → 8.0 km Run Eq.",
      km: 8.0,
      rawDisplay: "Swim 2.0 km (1'52\"/100m · SWOLF 41)",
      pace: "+80 EEP",
      cadence: 34,
      hr: 142,
      valid: true,
      isMultiSport: true,
      desc: "Auto-converted at 1km swim = 4km run into your city's endurance score"
    },
    {
      id: "sync_cheat",
      tier: "ALERT",
      source: "Anti-Cheat Test · Bike-Spoofed Run",
      title: "Suspicious Track · 15.0 km",
      km: 15.0,
      pace: "3'38\"/km",
      cadence: 0,
      hr: 91,
      valid: false,
      desc: "16.5 km/h speed with 0 spm cadence, 91 bpm HR, snapped to bike lane"
    }
  ]
};

window.UI_STRINGS = {
  zh: {
    docTitle: "领跑局 PACELAB × 引擎鸟 · 合作提案交互 Demo",
    brandCn: "领跑局",
    partnerCn: "引擎鸟合作提案",
    chapterNav: ["破局与同步", "以赛带练", "跑团排位", "跑超PK", "引擎鸟ROI"],
    focusProto: "专注原型",
    showPitch: "显示路演面板",
    mobilePhone: "体验小程序",
    mobilePitch: "路演与ROI测算",
    liveBadge: "可实时点击交互",
    prevChapter: "上一章",
    nextChapter: "下一章",
    doneChapter: "演示完成",
    cityLabel: "广州",
    userName: "林晓峰",
    userClub: "广州天河高能尖兵团",
    porLabel: "本月认证跑量",
    porUnit: "/ 30 km 解锁引擎鸟内购",
    syncBtn: "同步运动",
    tabs: { match: "备赛匹配", clubs: "跑团排位", pk: "跑超PK", perks: "引擎鸟" },
    tabTitles: {
      match: "领跑局 PACELAB",
      clubs: "引擎鸟杯 · 跑团排位",
      pk: "跑超 · 城市与省际PK",
      perks: "引擎鸟 · 跑量权益"
    },
    unlockedBadge: "已解锁",
    meChar: "我"
  },
  en: {
    docTitle: "PACELAB × ENGINE BIRD · Interactive Running Pitch Demo",
    brandCn: "Running Social",
    partnerCn: "Partner Pitch Demo",
    chapterNav: ["Sync & Wedge", "Pace Trains", "Fair Clubs", "Run Super", "Partner ROI"],
    focusProto: "Phone Only",
    showPitch: "Show Pitch",
    mobilePhone: "Try Mini App",
    mobilePitch: "Pitch & ROI",
    liveBadge: "Interactive Prototype",
    prevChapter: "Previous",
    nextChapter: "Next Chapter",
    doneChapter: "Pitch Complete",
    cityLabel: "Guangzhou",
    userName: "Alex Lin",
    userClub: "Tianhe Aero Runners",
    porLabel: "Verified Miles",
    porUnit: "/ 30 km to unlock VIP",
    syncBtn: "Sync Run",
    tabs: { match: "Match", clubs: "Clubs", pk: "City PK", perks: "Perks" },
    tabTitles: {
      match: "PACELAB",
      clubs: "Engine Bird Cup",
      pk: "Run Super League",
      perks: "Engine Bird VIP"
    },
    unlockedBadge: "VIP",
    meChar: "Me"
  }
};

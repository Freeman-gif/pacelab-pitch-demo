/* ==========================================================================
   PACELAB 领跑局 × ENGINE BIRD 引擎鸟 — Mock Domain Dataset
   Grounded in 2025-2026 China Road Running Market & Guangdong/Jiangsu Context
   ========================================================================== */

window.PITCH_DATA = {
  chapters: [
    {
      id: 0,
      tab: "match",
      hint: "当前演示：多平台数据秒传与 AI 防作弊入账",
      kicker: "01 / 战略切入点 · 不卷底层 GPS",
      title: "做跨平台的「社交匹配与竞技层」，破解手表架空 App 困局",
      lead: "中国 700 万路跑人次中，严肃跑者已普遍改用佳明、高驰、华为与 Apple Watch 记录，纯工具 App 沦为数据孤岛。领跑局通过「三层接入架构」，零摩擦承接咕咚/Keep/悦跑圈及各大手表跑者。"
    },
    {
      id: 1,
      tab: "match",
      hint: "当前演示：广马/深马「配速列车」与异步小任务",
      kicker: "02 / 核心留存引擎 · 以赛带练",
      title: "用「马拉松配速列车」重构约跑，根治安全焦虑与周抛搭子",
      lead: "传统 1v1 约跑死于动机不纯、安全隐忧与配速难对齐。我们锚定全国 600+ 场马拉松赛历，按目标配速自动组建 3–6 人备赛小队与周末公开列车，叠加起终点 500m 隐私脱敏与异步小任务。"
    },
    {
      id: 2,
      tab: "clubs",
      hint: "当前演示：「引擎鸟杯」广东跑团公平排位赛",
      kicker: "03 / 冷启动破局 · 公平算法与反作弊",
      title: "「引擎鸟杯」跑团分级排位赛：让小而精的跑团也能击败巨无霸",
      lead: "靠 B 端跑团团长批量拉入首批高纯度种子跑者。通过「截尾人均 × 活跃率 × 规模平滑 × 合跑加成」公平公式与 4 道传感器反作弊防线，确保每一份引擎鸟福利都发给真跑者。"
    },
    {
      id: 3,
      tab: "pk",
      hint: "当前演示：「跑超」城市PK & 骑行/游泳等效换算融合赛",
      kicker: "04 / 全民破圈 IP · 跑超 & 铁三耐力扩展",
      title: "省内城市 PK → 省际巅峰，并通过「等效换算」吸纳骑行与游泳战队",
      lead: "复刻「苏超」地域荣誉狂欢，用「75% 百人主力 + 25% 全民助威」打破大城人口垄断；更以「1km 游泳 = 4km 跑步 = 12km 骑行」等效积分体系（EEP），让骑行车队与泳队无缝并入城市联赛，直接放大 3 倍高净值市场。"
    },
    {
      id: 4,
      tab: "perks",
      hint: "当前演示：Proof-of-Run 解锁引擎鸟私域券与冠军战袍",
      kicker: "05 / 引擎鸟深度共赢 · 不破控价的增长引擎",
      title: "不伤公域控价、杜绝羊毛党：用「跑量证明」精准转化私域复购",
      lead: "不向引擎鸟要无门槛全店大打折。只有当月实跑 ≥ 30km 的 T1 认证跑者，才解锁有赞私域专属内购码、冠军省限定印字战袍与新品众测资格——把每一次活动都变成引擎鸟的正 ROI 增量通道。"
    }
  ],

  races: [
    {
      id: "gzm",
      name: "2026 广州马拉松",
      city: "广州",
      date: "12月08日",
      countdown: "距开赛 13天",
      runners: "2,840 人正在备赛"
    },
    {
      id: "szm",
      name: "2026 深圳马拉松",
      city: "深圳",
      date: "12月01日",
      countdown: "距开赛 6天",
      runners: "2,310 人正在备赛"
    },
    {
      id: "xm",
      name: "2027 厦门马拉松",
      city: "厦门",
      date: "01月05日",
      countdown: "距开赛 41天",
      runners: "1,960 人正在备赛"
    },
    {
      id: "wx",
      name: "2027 无锡马拉松",
      city: "无锡",
      date: "03月23日",
      countdown: "距开赛 118天",
      runners: "3,420 人正在备赛"
    }
  ],

  squads: [
    {
      id: "sq1",
      raceId: "gzm",
      title: "广马破 330 · 海心沙周日 500 配速列车",
      pace: "4'55\"–5'05\"",
      paceBucket: "sub330",
      spot: "广州 · 海心沙亚运公园",
      time: "周日 06:30 · 22km LSD",
      leader: "陈教练 (佳明 T1 认证)",
      tags: ["T1手表验证", "起终点500m脱敏", "跑后早茶局"],
      femaleOnly: false,
      members: ["陈", "林", "周", "麦"],
      capacity: 6,
      joined: false
    },
    {
      id: "sq2",
      raceId: "gzm",
      title: "珠江夜跑 540 女子友好备赛小队",
      pace: "5'35\"–5'50\"",
      paceBucket: "sub400",
      spot: "广州 · 阅江路碧道",
      time: "周三/周五 19:30 · 10km",
      leader: "Suki (全马356)",
      tags: ["女性认证专属", "T1手表验证", "摄影打卡"],
      femaleOnly: true,
      members: ["S", "妍", "敏"],
      capacity: 5,
      joined: true
    },
    {
      id: "sq3",
      raceId: "gzm",
      title: "天河 CBD 早六点咖啡跑 · 破 400 冲刺",
      pace: "5'20\"–5'35\"",
      paceBucket: "sub400",
      spot: "广州 · 天河体育中心",
      time: "周二/周四 06:15 · 8km",
      leader: "阿Ken (互联网PM)",
      tags: ["咖啡跑", "早八打工人", "起终点500m脱敏"],
      femaleOnly: false,
      members: ["K", "宇", "浩", "霖", "彤"],
      capacity: 6,
      joined: false
    },
    {
      id: "sq4",
      raceId: "szm",
      title: "深马破 300 精英拉练 · 深圳湾海风列车",
      pace: "4'10\"–4'20\"",
      paceBucket: "sub300",
      spot: "深圳 · 深圳湾人才公园",
      time: "周六 06:00 · 30km 长距离",
      leader: "老梁 (全马252)",
      tags: ["T1手表验证", "引擎鸟众测官", "补给点共享"],
      femaleOnly: false,
      members: ["梁", "峰", "越"],
      capacity: 5,
      joined: false
    },
    {
      id: "sq5",
      raceId: "szm",
      title: "深圳湾日出 530 女子半马配速小队",
      pace: "5'25\"–5'40\"",
      paceBucket: "sub400",
      spot: "深圳 · 深圳湾流花山",
      time: "周日 06:30 · 15km",
      leader: "Vivi (高驰认证)",
      tags: ["女性认证专属", "咖啡跑", "T1手表验证"],
      femaleOnly: true,
      members: ["V", "瑶", "晴", "安"],
      capacity: 6,
      joined: false
    },
    {
      id: "sq6",
      raceId: "xm",
      title: "广深跨城备战厦马 · 线上同步配速组",
      pace: "4'50\"–5'05\"",
      paceBucket: "sub330",
      spot: "粤闽跨城 · 异步打卡",
      time: "每周 4 练 · 共同冲刺 240km",
      leader: "阿杰 (厦马324)",
      tags: ["T1手表验证", "周报互督", "早八打工人"],
      femaleOnly: false,
      members: ["杰", "涛", "铭", "欣"],
      capacity: 8,
      joined: false
    },
    {
      id: "sq7",
      raceId: "wx",
      title: "锡马樱花季提前冬训 · 粤苏连线 515 组",
      pace: "5'10\"–5'25\"",
      paceBucket: "sub330",
      spot: "广州/南京 · 跨省备赛",
      time: "每周日同步 LSD 20km",
      leader: "小顾 (无锡PB 328)",
      tags: ["粤苏跨省组", "T1手表验证", "咖啡跑"],
      femaleOnly: false,
      members: ["顾", "涵", "乐"],
      capacity: 6,
      joined: false
    }
  ],

  quests: [
    {
      id: "q1",
      title: "双人盲盒接力 · 42.195 km",
      desc: "与同配速搭子本周累计跑满 1 个全马，解锁双人电子勋章",
      reward: "+120 跑团积分",
      accepted: true
    },
    {
      id: "q2",
      title: "海心沙错峰击掌挑战",
      desc: "本周各自在同一公园打卡 ≥5km，触发「擦肩而过」轨迹彩蛋",
      reward: "合跑加成 +3%",
      accepted: false
    }
  ],

  clubsByDivision: {
    elite: [
      {
        id: "c1",
        name: "广州天河高能尖兵团",
        city: "广州",
        members: 28,
        activeRate: 93,
        trimAvgKm: 138.4,
        socialBonus: 18,
        t1Ratio: 96,
        score: 94.8,
        perk: "Top 1 · 引擎鸟 7.2折内购 + 定制战袍",
        isUserClub: true
      },
      {
        id: "c2",
        name: "珠海情侣路海风特战队",
        city: "珠海",
        members: 24,
        activeRate: 91,
        trimAvgKm: 132.0,
        socialBonus: 15,
        t1Ratio: 94,
        score: 91.2,
        perk: "Top 2 · 引擎鸟 7.5折内购券"
      },
      {
        id: "c3",
        name: "深圳后海破三小分队",
        city: "深圳",
        members: 21,
        activeRate: 88,
        trimAvgKm: 141.5,
        socialBonus: 11,
        t1Ratio: 98,
        score: 88.6,
        perk: "Top 3 · 引擎鸟 7.8折内购券"
      },
      {
        id: "c4",
        name: "汕头牛肉丸清晨跑团",
        city: "汕头",
        members: 26,
        activeRate: 85,
        trimAvgKm: 118.2,
        socialBonus: 16,
        t1Ratio: 89,
        score: 84.1,
        perk: "前十 · 新品众测优先权"
      }
    ],
    mid: [
      {
        id: "c5",
        name: "深圳湾凌晨五点社",
        city: "深圳",
        members: 76,
        activeRate: 89,
        trimAvgKm: 124.6,
        socialBonus: 19,
        t1Ratio: 95,
        score: 95.4,
        perk: "Top 1 · 引擎鸟 7.2折内购 + 定制战袍"
      },
      {
        id: "c6",
        name: "佛山千灯湖破风跑团",
        city: "佛山",
        members: 64,
        activeRate: 87,
        trimAvgKm: 121.8,
        socialBonus: 17,
        t1Ratio: 92,
        score: 92.1,
        perk: "Top 2 · 引擎鸟 7.5折内购券"
      },
      {
        id: "c7",
        name: "东莞松山湖耐力实验室",
        city: "东莞",
        members: 82,
        activeRate: 83,
        trimAvgKm: 116.4,
        socialBonus: 14,
        t1Ratio: 91,
        score: 87.9,
        perk: "Top 3 · 引擎鸟 7.8折内购券"
      }
    ],
    mega: [
      {
        id: "c8",
        name: "广州越秀百人长跑会",
        city: "广州",
        members: 218,
        activeRate: 79,
        trimAvgKm: 109.5,
        socialBonus: 16,
        t1Ratio: 88,
        score: 90.6,
        perk: "Top 1 · 引擎鸟 7.2折内购 + 定制战袍"
      },
      {
        id: "c9",
        name: "深圳南山科技园联合团",
        city: "深圳",
        members: 320,
        activeRate: 62,
        trimAvgKm: 98.2,
        socialBonus: 10,
        t1Ratio: 85,
        score: 79.4,
        perk: "Top 2 · 引擎鸟 7.5折内购券"
      }
    ],
    multisport: [
      {
        id: "cm1",
        sport: "run",
        sportBadge: "跑步团 · 1:1 基准",
        name: "广州天河高能尖兵团",
        city: "广州",
        members: 28,
        activeRate: 93,
        trimAvgKm: 138.4,
        rawMetric: "人均 138.4 km 跑量",
        socialBonus: 18,
        t1Ratio: 96,
        score: 94.8,
        perk: "全能 Top 1 · 引擎鸟联名战袍 + 内购券",
        isUserClub: true
      },
      {
        id: "cm2",
        sport: "bike",
        sportBadge: "骑行车队 · 3km≈1km跑",
        name: "深圳大鹏湾破风公路车队",
        city: "深圳",
        members: 42,
        activeRate: 90,
        trimAvgKm: 134.2,
        rawMetric: "人均 402.6 km 骑行 → 换算 134.2 km",
        socialBonus: 16,
        t1Ratio: 97,
        score: 93.4,
        perk: "全能 Top 2 · 引擎鸟防晒速干/内购券"
      },
      {
        id: "cm3",
        sport: "swim",
        sportBadge: "游泳铁三团 · 1km≈4km跑",
        name: "广州珠江泳者铁三俱乐部",
        city: "广州",
        members: 34,
        activeRate: 88,
        trimAvgKm: 128.0,
        rawMetric: "人均 32.0 km 游泳 → 换算 128.0 km",
        socialBonus: 15,
        t1Ratio: 94,
        score: 90.9,
        perk: "全能 Top 3 · 铁三换项配件/内购券"
      },
      {
        id: "cm4",
        sport: "bike",
        sportBadge: "骑行车队 · 3km≈1km跑",
        name: "佛山顺德早茶拉爆车队",
        city: "佛山",
        members: 51,
        activeRate: 85,
        trimAvgKm: 119.5,
        rawMetric: "人均 358.5 km 骑行 → 换算 119.5 km",
        socialBonus: 14,
        t1Ratio: 92,
        score: 87.3,
        perk: "前十 · 新品防风夹克众测名额"
      }
    ]
  },

  // Algorithm comparison demo data for Pitch Chapter 3
  algoCompare: [
    {
      name: "广州天河高能尖兵团",
      meta: "45人 · 活跃率 91% · 合跑率高",
      rawKm: 4120,
      fairScore: 94.8
    },
    {
      name: "佛山千灯湖破风跑团",
      meta: "64人 · 活跃率 87% · 进步显著",
      rawKm: 5380,
      fairScore: 92.1
    },
    {
      name: "深圳某 320 人综合大群",
      meta: "320人 · 活跃率仅 41% · 僵尸粉多",
      rawKm: 11850,
      fairScore: 68.4
    },
    {
      name: "3 人纯职业大神刷榜队",
      meta: "3人 · 未达建团门槛 · 缺社交加成",
      rawKm: 1290,
      fairScore: 52.0
    }
  ],

  // Guangdong City PK Standings
  guangdongCities: [
    {
      id: "gz",
      city: "广州",
      nickname: "早茶铁军",
      squadScore: 71.4,
      citizenBuff: 22.8,
      total: 94.2,
      participants: 6420,
      qualified: true
    },
    {
      id: "sz",
      city: "深圳",
      nickname: "凌晨搞钱队",
      squadScore: 70.9,
      citizenBuff: 22.4,
      total: 93.3,
      participants: 6180,
      qualified: true
    },
    {
      id: "fs",
      city: "佛山",
      nickname: "咏春破风队",
      squadScore: 68.6,
      citizenBuff: 20.9,
      total: 89.5,
      participants: 3410,
      qualified: true
    },
    {
      id: "zh",
      city: "珠海",
      nickname: "海风轻骑兵",
      squadScore: 68.2,
      citizenBuff: 19.8,
      total: 88.0,
      participants: 1890,
      qualified: false
    },
    {
      id: "dg",
      city: "东莞",
      nickname: "篮球转行队",
      squadScore: 65.4,
      citizenBuff: 19.2,
      total: 84.6,
      participants: 2760,
      qualified: false
    },
    {
      id: "st",
      city: "汕头",
      nickname: "牛肉丸碳水团",
      squadScore: 63.1,
      citizenBuff: 18.7,
      total: 81.8,
      participants: 1620,
      qualified: false
    }
  ],

  // National Province Finals (Guangdong vs Jiangsu vs Zhejiang)
  provinceFinals: {
    matchTitle: "2026 跑超全国总决赛 · 粤苏巅峰对决",
    left: {
      province: "广东联队",
      cities: "广州 · 深圳 · 佛山",
      slogan: "早茶没喝完，配速先干到 430",
      score: 277.0,
      activeRunners: 16010
    },
    right: {
      province: "江苏联队",
      cities: "南京 · 苏州 · 无锡",
      slogan: "散装江苏，对外一致干翻大湾区",
      score: 274.6,
      activeRunners: 15480
    },
    others: [
      { rank: 3, province: "浙江联队", cities: "杭州 · 宁波 · 温州", score: 261.8 },
      { rank: 4, province: "川渝联队", cities: "成都 · 重庆 · 绵阳", score: 249.2 }
    ]
  },

  // EngineBird Perks Catalog
  engineBirdPerks: [
    {
      id: "eb1",
      name: "引擎鸟 · 经典二合一马拉松短裤",
      tag: "私域专属内购 · 不破公域控价",
      desc: "大容量环腰口袋装手机/能量胶 · 防磨压胶",
      salePrice: 179,
      origPrice: 239,
      discountLabel: "7.5折内购码",
      minKm: 30,
      codePrefix: "EB-GD30-"
    },
    {
      id: "eb2",
      name: "跑超冠军省限定 · 龙鳞速干战袍",
      tag: "荣誉印字定制 · 赛道活广告",
      desc: "可选印字：『粤跑冠军·广州』 / 『苏跑第一·南京』",
      salePrice: 159,
      origPrice: 219,
      discountLabel: "冠军省专享",
      minKm: 30,
      isJersey: true,
      codePrefix: "EB-CHAMP-"
    },
    {
      id: "eb3",
      name: "新品众测官 · 防沙鞋套 / 运动内衣",
      tag: "鸟叔研发实验室 · 真实路测反馈",
      desc: "月榜 Top 50 硬核跑者免费/半价优先体验未上市新品",
      salePrice: 0,
      origPrice: 199,
      discountLabel: "众测直通车",
      minKm: 60,
      codePrefix: "EB-LAB-"
    }
  ],

  // Sample Sync Activities for Live Interactive Demo
  syncSamples: [
    {
      id: "sync_garmin",
      tier: "T1",
      source: "Garmin Forerunner 265 · FIT 赛级直连",
      title: "珠江新城晨跑 10.2 km",
      km: 10.2,
      pace: "4'56\"/km",
      cadence: 180,
      hr: 153,
      valid: true,
      desc: "含完整步频、心率与 GPS 轨迹校验 · 100% 计入跑团与引擎鸟解锁"
    },
    {
      id: "sync_codoon",
      tier: "T3",
      source: "咕咚 App 运动截图 · AI 极速识别",
      title: "海心沙夜跑 6.5 km",
      km: 6.5,
      pace: "5'18\"/km",
      cadence: 172,
      hr: null,
      valid: true,
      desc: "AI 1秒提取里程/配速/水印 · 计入备赛匹配与全民助威 Buff"
    },
    {
      id: "sync_bike",
      tier: "T1",
      source: "佳明码表 / 行者 · 骑行等效换算 (未来扩展)",
      title: "大学城公路骑行 36.0 km → 换算 12.0 km 跑量",
      km: 12.0,
      rawDisplay: "骑行 36.0 km (均速 31.4 km/h · 功率 195W)",
      pace: "换算 +120 EEP",
      cadence: 88,
      hr: 146,
      valid: true,
      isMultiSport: true,
      desc: "按 3km 骑行 = 1km 跑步 (12:4:1 铁三负荷基准) 自动并入城市总榜"
    },
    {
      id: "sync_swim",
      tier: "T1",
      source: "Apple Watch · 游泳等效换算 (未来扩展)",
      title: "标准池自由泳 2.0 km → 换算 8.0 km 跑量",
      km: 8.0,
      rawDisplay: "游泳 2.0 km (配速 1'52\"/100m · SWOLF 41)",
      pace: "换算 +80 EEP",
      cadence: 34,
      hr: 142,
      valid: true,
      isMultiSport: true,
      desc: "按 1km 游泳 = 4km 跑步标准自动折算积分，为所在城市战队加分"
    },
    {
      id: "sync_cheat",
      tier: "ALERT",
      source: "模拟风控测试 · 骑共享单车代跑",
      title: "疑似违规轨迹 15.0 km",
      km: 15.0,
      pace: "3'38\"/km",
      cadence: 0,
      hr: 91,
      valid: false,
      desc: "速度 16.5 km/h 但步频=0、心率仅 91 bpm、轨迹贴合非机动车道"
    }
  ]
};

import { siteCopy, SiteCopyType } from "./site-copy";

export type Language = "en" | "zh-CN" | "zh-TW" | "vi";

export const siteTranslations: Record<Language, SiteCopyType> = {
  en: siteCopy,
  "zh-CN": {
    hero: {
      kicker: "§ 00 · KAIRMA",
      wordmark: "Kai rma",
      tagline: "为跨境品牌打造的 AI 数字员工。",
      subTagline: "开箱即用。您的首个 AI 员工。",
      anchorBio: "跨境品牌运营的统一操作系统。我们用自主 AI 智能体取代重复性劳动，让雄心勃勃的品牌在不呈线性增加人力的情况下实现全球扩张。",
      cta: {
        begin: "开始 →",
        architecture: "查看架构"
      },
      scrollText: "向下滚动 ↓"
    },
    problem: {
      title: "§ 01 · 面临问题",
      heading: "跨境品牌运营仍极度依赖传统人力扩张。",
      stat: {
        value: "1.5 万亿美元",
        label: "全球每年在跨境品牌运营人力上的资金损耗。",
        context: "— 相当于 18 个月实操跨境网红商务拓展（BD）的运营成本。"
      },
      painPoints: [
        "01 · 商务拓展脚本无法标准化。销售漏斗流失严重。",
        "02 · 运营跨越四个平台。数据零整合。",
        "03 · 每进入一个新市场，都需雇佣新团队。成本呈线性上升。"
      ]
    },
    whyNow: {
      title: "§ 02 · 时代契机",
      heading: "四条技术曲线于 2026 年交汇。行业窗口期将于 2027 年第四季度关闭。",
      curves: [
        {
          num: "01",
          title: "开源模型成本降至 1/20",
          desc: "DeepSeek · Qwen · Llama 4 在企业级工作负载中达到 GPT-4 的 90% 以上性能。"
        },
        {
          num: "02",
          title: "边缘推理成本降低 10 倍",
          desc: "X86 + 核心显卡（iGPU）现能以普通硬件成本承载企业级智能体运行。"
        },
        {
          num: "03",
          title: "数据主权立法化",
          desc: "东盟八国、欧盟、中国占全球 GDP 的 45%。数据本地化已成为法律强制要求，而非企业偏好。"
        },
        {
          num: "04",
          title: "生态预算创历史新高",
          desc: "云厂商与平台项目正全力补贴开发者，降低进入门槛。"
        }
      ]
    },
    insight: {
      title: "§ 03 · 深度洞察",
      heading: "多数人尚未察觉的三大趋势。",
      insights: [
        {
          num: "01",
          title: "品牌方法论是护城河。模型本身不是。",
          desc: "谁能将运营手册编码为机器工作流，谁就拥有客户。"
        },
        {
          num: "02",
          title: "智能体将像应用一样被发现，而不是像 SaaS 一样被销售。",
          desc: "分发网络的价值远超其所分发的任何单一应用程序。"
        },
        {
          num: "03",
          title: "硬件是获客成本最低的企业级渠道。",
          desc: "边缘硬件设备带来的是一次性部署 + 主权溢价 + 36个月的高粘性锁定。"
        }
      ].map((item, idx) => ({ ...item, anchor: siteCopy.insight.insights[idx].anchor }))
    },
    whatKairmaIs: {
      title: "§ 04 · KAIRMA 定义",
      heading: "四层架构。一个不断复利的增长结构。",
      layers: [
        {
          id: "§ IV",
          title: "联盟协作",
          desc: "通过 Web3Labs 建立战略合作。与微软深度对齐。入选 YZi Labs 孵化。依托母公司生态系统对接香港政策支持。"
        },
        {
          id: "§ III",
          title: "智能员工",
          desc: "不断扩充的 AI 数字员工库。首发网红商务拓展智能体。每季度推出更多角色。面向开发者开放接入（开发中）。"
        },
        {
          id: "§ II",
          title: "操作系统",
          desc: "标准作业程序（SOP）引擎 + 智能员工协同矩阵。对品牌方法论进行编码。支持多模型路由及 RPA 自动化执行。"
        },
        {
          id: "§ I",
          title: "边缘魔盒",
          desc: "Kairma 边缘一体机。采用 X86 / Windows 轻资产硬件。本地化部署。为保障数据主权而生。"
        }
      ],
      footer: "硬件作为切入点。软件作为核心主体。未来将走向开放生态。"
    },
    architecture: {
      title: "§ 05 · 系统架构",
      heading: "数据本地化。模型云端化。任务智能路由。",
      premise: {
        title: "客户本地环境",
        box: "Kairma 边缘一体机",
        specs: "X86 / Windows",
        lakeTitle: "品牌数据湖",
        lakeDesc: "本地部署 · 绝不上传",
        engine: "SOP 工作流引擎",
        router: "多模型路由器",
        rpa: "RPA / API 交互层"
      },
      cloud: {
        title: "云端模型群",
        models: siteCopy.architecture.cloud.models,
        desc: "根据成本与具体任务，自动进行多模型智能路由。"
      },
      arrows: {
        top: "任务流",
        bottom: "原始数据不出本地"
      },
      footer: "源数据绝不离开本地环境。仅对任务指令进行云端路由。"
    },
    howItWorks: {
      title: "§ 08 · 运作流程",
      heading: "将运营成本逼近于零的复利飞轮。",
      steps: [
        {
          num: "1",
          name: "知识捕获",
          desc: "从品牌运营团队收集并整理标准的标准作业程序（SOP）。"
        },
        {
          num: "2",
          name: "工作流编码",
          desc: "SOP 引擎将品牌运营方法论编译为可由智能体执行的自动化工作流。"
        },
        {
          num: "3",
          name: "设备部署",
          desc: "Kairma 边缘一体机交付至客户本地，智能体开始在本地安全运行。"
        },
        {
          num: "4",
          name: "自主运转",
          desc: "智能体独立执行工作。品牌按月订阅。每次运行都在加深并优化 SOP。"
        },
        {
          num: "5",
          name: "架构复利",
          desc: "下一个新智能体可重用 70% 的底层框架。开发每一个新岗位的成本都会呈指数级下降。"
        }
      ]
    },
    defensibility: {
      title: "§ 06 · 壁垒优势",
      heading: "四大壁垒。由浅入深构建护城河。",
      moats: [
        {
          num: "01",
          title: "SOP 引擎 + 本地数据湖",
          desc: "将品牌专有的运营手册编码为自主运行的工作流。随着数据积累产生复利价值。",
          comparison: "→ 竞品（如 Sierra、Wonderful）仅出售标准接口，不编码业务逻辑。"
        },
        {
          num: "02",
          title: "智能员工库",
          desc: "由 Kairma 团队自主研发，即将面向生态开放共建。",
          comparison: "→ 现货交付的工具库，远比停留在 PPT 上的规划具有实际价值。"
        },
        {
          num: "03",
          title: "微软深度对齐",
          desc: "基于 Web3Labs 战略合作框架。直接对接 Azure 合作伙伴生态。对齐 X86/Windows 边缘计算技术底座。",
          comparison: "→ 纯软件型的 AI 初创公司无法享受此硬件级通道。"
        },
        {
          num: "04",
          title: "轻资产硬件供应链",
          desc: "标准 X86 架构板卡 · 深圳合约 OEM 代工组装。无库存风险，支持 18 个月迭代周期。",
          comparison: "→ 仅在海外运营的竞品无法直接利用深圳的高效硬件供应链。"
        }
      ]
    },
    story: {
      title: "§ 07 · 品牌故事",
      heading: "我们并非在废墟中重建生态，而是直接继承一个生态。",
      sections: [
        {
          kicker: "源自何处",
          title: "Web3Labs",
          desc: "我们的孵化母体。在香港、新加坡、韩国、杭州、北京五地设有实体空间，运营网络和基础设施已全面铺开。"
        },
        {
          kicker: "联合生态",
          title: "微软 (Microsoft)",
          desc: "依托 Web3Labs 战略人工智能合作框架，直接对接微软 Azure 合作伙伴计划，实现 X86 / Windows 边缘端的无缝对接。"
        },
        {
          kicker: "服务对象",
          title: "YZi Labs · 极客共创者",
          desc: "母体生态内的早期 AI 资本与开发者社区。这也是我们首批智能员工的原生地。"
        }
      ]
    },
    partners: {
      title: "§ 09 · 合作伙伴",
      heading: "我们所继承的庞大生态 —— 合作伙伴标识即将推出。"
    },
    begin: {
      title: "§ 10 · 开启通道",
      heading: "两扇大门。选择您的角色。",
      enterprise: {
        title: "面向企业客户",
        subtitle: "部署属于您的主权 AI 劳动力。",
        features: [
          "48 小时内完成本地化部署",
          "品牌数据绝不出本地",
          "多模型智能路由 (Claude · GPT · DeepSeek · Qwen)",
          "内置 18 个月打磨的 SOP 资产（由跨境网红 BD 首席架构师设计）"
        ],
        cta: "申请试点项目 →",
        email: "pilot@kairma.ai"
      },
      builders: {
        title: "面向开发者",
        subtitle: "帮助我们构建下一个数字员工。",
        features: [
          "开发者抢先体验通道",
          "智能体可直接部署至企业级 Kairma 边缘一体机",
          "开放 SDK 正在紧密开发中"
        ],
        cta: "加入 Discord 社区 →",
        github: "github.com/kairma"
      }
    },
    closing: {
      text: "工作不会停歇，因为品牌永不眠。",
      sub: "KAIRMA 操作系统 · 2026"
    },
    footer: {
      wordmark: "Kai rma",
      tagline: "为跨境品牌运营打造的 AI 数字员工。",
      osVersion: "KAIRMA OS 版本 v1.0.0",
      email: "contact@kairma.ai",
      locations: ["新加坡", "深圳", "香港", "河内"],
      provenance: {
        spinOut: "孵化自 Web3Labs 生态系统",
        partners: ["微软合作伙伴", "YZi Labs 成员"]
      },
      copyright: "© 2026 KAIRMA 版权所有"
    },
    boot: {
      title: "正在启动 KAIRMA 操作系统 · V1.0.0",
      separator: "----------------------------------------",
      steps: [
        { text: "正在初始化 SOP 工作流引擎", status: "OK" },
        { text: "正在加载本地品牌数据湖", status: "OK" },
        { text: "正在连接云端多模型路由器", status: "OK" }
      ],
      ready: "准备就绪。",
      ctaImmerse: "> [ 继续 ]",
      ctaSkip: "> [ 跳过至控制台 ]"
    },
    storyIntro: {
      osName: "KAIRMA OS 统一操作系统",
      copyright: "版权所有 © 2026 WEB3LABS",
      lines: [
        "算力替代人力的时代已经到来。",
        "AI 模型正在取代重复性的跨境工作。",
        "KAIRMA 是底盘。你来构建引擎。"
      ],
      scrollPrompt: "[ 向下滚动以初始化核心运行库 ]"
    },
    status: {
      osName: "KAIRMA OS",
      version: "v1.0.0",
      dataMode: "本地化",
      modelRoute: "云端化",
      rawData: "安全锁定",
      agentStatus: {
        kolAgent: "已就绪",
        openSdk: "开发中",
        library: "按季扩充"
      }
    },
    photography: {
      title: "§ 11 · 视觉规范",
      heading: "电影质感，而非商品图册。",
      desc: "KAIRMA 的视觉语言具有强烈的电影质感，绝非商业化商品图。每一张影像都必须呈现为电影的定格画面 —— 拒绝刻板的图库照、拒绝冰冷的产品照、拒绝俗套的企业宣传统。",
      specifications: {
        lens: "首选 50mm 或 85mm 定焦镜头。严禁使用广角镜头（28mm以下）拍摄人像。",
        aperture: "浅景深。光圈范围 f/1.8 至 f/4。严禁使用全焦深（全清晰）的刻板成像风格。",
        lighting: "仅采用单光源主光加反光板补光。严禁使用高亮度摄影棚顶光。保留并塑造阴影，而非消除它们。",
        colorTemperature: "暖色调 (3200K - 3800K, 王家卫电影风格) 或冷色调 (5600K - 6500K, 大卫·芬奇风格)。严禁使用中性的 5000K 标准白光。",
        saturation: "后期饱和度降低 5% - 15%。KAIRMA 的视觉调性绝不鲜艳夺目。",
        aspectRatio: "首选 1.85:1 或 2.39:1 的宽银幕电影比例。视频仅使用 16:9，社交媒体海报可使用 1:1。",
        grain: "后期添加 5% - 15% 胶片颗粒感。严禁使用纯净无噪点的数码成像风格。",
        subjectFraming: "人像拍摄：首选 3/4 侧脸或正侧脸。严禁使用标准正面肖像照。",
        productFraming: "首选局部细节遮挡或隐现。严禁使用全亮的产品正面定妆照。"
      },
      subjectMatter: {
        permitted: [
          "边缘魔盒 —— 作为雕塑艺术品般进行拍摄（局部暗光、材质细节特写、金属冷光）",
          "源自东亚禅意与欧洲中世纪传统的建筑细节（斑驳石墙、经书古籍、砚台墨迹）",
          "专注动作中的双手特写（书写、加盖火漆印章、轻抚质感器物）",
          "极具氛围感的光影环境 —— 雾气、微尘、穿透木窗的斜阳、烛光、黄铜斑驳表面",
          "黑猫（真实拍摄或超写实艺术渲染）"
        ],
        forbidden: [
          "假笑的团队合影或正面大头照",
          "办公室日常生活场景（写满涂鸦的白板、便利贴墙、\"头脑风暴时刻\"）",
          "任何商业化的免版权素材库图片",
          "干净白墙背景的普通商品渲染图",
          "俗套的抽象\"科技感\"素材（如虚空电路板、发光数码网格、科幻线条）",
          "千篇一律的商业握手、会议场景",
          "在自然光下以演示为目的的冷冰冰的电脑显示器画面"
        ]
      },
      references: [
        "王家卫 (杜可风摄影，代表作《花样年华》《2046》的色彩与质感)",
        "大卫·芬奇 (杰夫·克罗嫩韦斯摄影，代表作《搏击俱乐部》《十二宫》的冷峻阴郁)",
        "克里斯托弗·诺兰 (霍伊特·范·霍伊特马摄影，代表作《信条》《奥本海默》的机械写实)",
        "维姆·文德斯 (罗比·米勒摄影，代表作《德州巴黎》的构图克制)",
        "安德烈·塔可夫斯基 (对物体与时间流逝的诗意捕捉)"
      ]
    },
    audio: {
      title: "§ 12 · 声音资产",
      heading: "声音的 DNA 图谱。",
      desc: "KAIRMA 是硬件与软件的有机结合体。声音是品牌与生俱来的维度。我们的声音识别系统由五大核心声音资产组成，它们均基于特定音频词汇构建。",
      vocabulary: [
        "青铜古钟 / 大教堂钟声 —— 厚重的青铜共鸣，长尾音衰减，极具仪式感",
        "木质打击乐器 (木鱼 Muyu) —— 清脆的单次敲击，短衰减，空灵禅意",
        "铜制颂钵 —— 环绕共鸣音，仅在《Devanagari 梵文仪式》资产中使用",
        "模块化合成器脉冲 —— 模拟电路质感，微粒化，在《Chrome 赛博》资产中使用",
        "朱砂印章加盖声 —— 印章按压入纸的真实摩擦声，在《印章传统》资产中使用",
        "低频电磁哼鸣 —— 环境基底音，用于一体机的 UI 状态提示",
        "经过处理的静音 —— 刻意设计的空白，用于声音事件之间的转折过渡"
      ],
      assets: [
        {
          name: "品牌音频 Logo",
          duration: "3 - 5 秒",
          composition: "古钟钟声 + 合成器脉冲 + 木鱼单击",
          use: "Kairma 一体机启动音；品牌宣传视频片头"
        },
        {
          name: "同步就绪音",
          duration: "0.5 - 1 秒",
          composition: "单次木鱼敲击 + 瞬时盖印声",
          use: "UI 交互点击；API 接口调用成功反馈"
        },
        {
          name: "熵增警示音",
          duration: "1 - 2 秒",
          composition: "玻璃碎裂声 + 低频哼鸣 + 瞬间静音",
          use: "系统错误提示；运行警告状态"
        },
        {
          name: "因果回响大钟",
          duration: "5 - 8 秒",
          composition: "饱满的教堂大钟宏大回响，伴随长空间衰减",
          use: "重大品牌活动；达成重要业务里程碑时刻"
        },
        {
          name: "设备静默环境声",
          duration: "30 - 60 秒循环",
          composition: "低频哼鸣背景 + 间歇性木鱼微鸣 + 风铃微风掠过",
          use: "Kairma 一体机处于闲置待命状态时的底噪"
        }
      ],
      commissioningProfile: "品牌声音应邀请师承坂本龙一、吉村弘或当代东亚/欧洲先锋电子音乐家的作曲家进行定制创作。应坚决避免使用流水线化生产的商业套路配乐。"
    },
    pilotModal: {
      title: "申请试点项目",
      subtitle: "48 小时内为您部署专属的主权 AI 员工团队。",
      monoDesc: "本地魔盒。您的首个 AI 数字员工。原始数据绝不出本地。",
      fields: {
        name: {
          label: "姓名",
          placeholder: "请输入您的姓名"
        },
        email: {
          label: "企业邮箱 *",
          placeholder: "name@company.com"
        },
        company: {
          label: "公司名称",
          placeholder: "请输入公司名称"
        },
        country: {
          label: "国家/地区",
          options: ["新加坡", "印度尼西亚", "马来西亚", "泰国", "越南", "菲律宾", "香港", "中国大陆", "其他"]
        },
        workflow: {
          label: "试点工作流",
          options: ["网红 BD", "内容生成", "运营自动化", "财务审计", "自定义定制"]
        },
        sovereignty: {
          label: "数据主权合规要求",
          options: ["严苛本地部署 (Strict on-prem)", "混合云部署 (Hybrid)", "主权云部署 (Sovereign Cloud)", "暂未决定"]
        }
      },
      submitCta: "提交申请 →",
      success: {
        title: "已收到申请。",
        subtitle: "我们的专家团队将在 1 个工作日内给您答复。",
        downloadCta: "下载两页版系统架构简报 (PDF)",
        downloadLink: "/KAIRMA Business Deck 2026.pdf",
        closeCta: "关闭"
      }
    },
    ecosystemModels: {
      title: "大模型排行榜",
      subtitle: "基于 OpenRouter 周度使用量排名",
      fullRankings: "完整榜单 ↗",
      fetching: "正在获取排名...",
      metrics: {
        intelligence: "智能能力",
        coding: "代码能力",
        agentic: "智能体能力"
      },
      tableHeaders: {
        model: "模型",
        context: "上下文",
        price: "价格/百万token",
        intel: "智能",
        code: "代码"
      },
      detailLabels: {
        free: "免费",
        rank: "排名",
        context: "上下文:",
        input: "输入:",
        output: "输出:",
        modality: "模态:",
        benchmarkScores: "基准评分"
      }
    },
    partnersBox: {
      title: "§ 01 · 合作伙伴",
      heading: "全球野心需要的不仅仅是人才。",
      description: "最雄心勃勃的品牌往往受制于陈旧的运营模式、分散的数据和线性的人力成本。我们来解决这个问题。KAIRMA 提供顶级的 SOP 引擎、智能体工作流和基础设施，在不增加工资支出的前提下，助力品牌全球扩张。我们将运营摩擦转化为自动化的复利优势。",
      marqueeLabel: "生态合作伙伴"
    },
    fdeHero: {
      h1: "我们不向您推销 AI。我们将它部署到您的运营中。",
      sub: "Kairma 是专为 AI 劳动力打造的前端部署平台。首个品类：跨境品牌运营的 AI 数字员工。",
      state: "Agent OS — 编排层。开放接入开发中。",
      ctaPilot: "申请试点项目",
      ctaWorks: "前端部署如何运作"
    },
    fdeShift: {
      title: "Section 1 — The shift",
      heading: "瓶颈已从模型能力转移到了部署阶段。",
      desc: "工具让人变快。但劳动力能直接完成工作。我们部署的是后者。"
    },
    fdeEmployees: {
      title: "Section 2 — AI 数字员工",
      heading: "您的首批 AI 数字员工，是部署进来的 — 而不是下载的。",
      desc: "开放接入开发中",
      roles: ["网红 BD", "内容运营", "客户服务", "合规审计"]
    },
    fdeDeployment: {
      title: "Section 3 — 前端部署 (FDE)",
      heading: "我们驻守在您这边，直到产出结果为止。",
      desc: "我们的前置部署团队将 AI 劳动力直接空降到您的业务运营中，根据您的数据和流程进行调优，并确保您的劳动力消耗的每一个 token 都能产生业务结果 —— 拒绝无效消耗。"
    },
    fdeBox: {
      title: "Section 4 — 边缘魔盒",
      heading: "您的数字劳动力运行在一个由您完全掌控的封闭环境中。",
      desc: "设计即安全。您的智能体、您的数据以及我们共建的运营手册（Playbooks），都会留在私有的运行环境中 —— 它们不会泄露到共享云端，也不会成为别人的训练数据。"
    },
    fdeFlywheel: {
      title: "Section 5 — 每次部署都让成本更低",
      heading: "每一次部署都让下一次变得更快。",
      desc: "我们在您运营中沉淀的经验，将转化为平台中可复用的能力。工作效能不断产生复利。"
    },
    fdePilot: {
      title: "Section 6 — 试点申请",
      developers: {
        heading: "面向开发者",
        desc: "在 Kairma 上构建 AI 数字员工。您的智能体逻辑运行在封闭闭源的运行环境中 —— 知识产权完全属于您。"
      },
      operators: {
        heading: "面向运营方",
        desc: "将 AI 劳动力部署到您的跨境品牌运营中。我们与您共同落地。"
      }
    }
  },
  "zh-TW": {
    hero: {
      kicker: "§ 00 · KAIRMA",
      wordmark: "Kai rma",
      tagline: "為跨境品牌打造的 AI 數位員工。",
      subTagline: "開箱即用。您的首個 AI 員工。",
      anchorBio: "跨境品牌營運的統一作業系統。我們用自主 AI 智能體取代重複性勞動，讓雄心勃勃的品牌在不呈線性增加人力的情況下實現全球擴張。",
      cta: {
        begin: "開始 →",
        architecture: "查看架構"
      },
      scrollText: "向下捲動 ↓"
    },
    problem: {
      title: "§ 01 · 面臨問題",
      heading: "跨境品牌營運仍極度依賴傳統人力擴張。",
      stat: {
        value: "1.5 兆美元",
        label: "全球每年在跨境品牌營運人力上的資金損耗。",
        context: "— 相當於 18 個月實操跨境網紅商務拓展（BD）的營運成本。"
      },
      painPoints: [
        "01 · 商務拓展腳本無法標準化。銷售漏斗流失嚴重。",
        "02 · 營運跨越四個平台。數據零整合。",
        "03 · 每進入一個新市場，都需僱用新團隊。成本呈線性上升。"
      ]
    },
    whyNow: {
      title: "§ 02 · 時代契機",
      heading: "四條技術曲線於 2026 年交匯。行業窗口期將於 2027 年第四季關閉。",
      curves: [
        {
          num: "01",
          title: "開源模型成本降至 1/20",
          desc: "DeepSeek · Qwen · Llama 4 在企業級工作負載中達到 GPT-4 的 90% 以上性能。"
        },
        {
          num: "02",
          title: "邊緣推理成本降低 10 倍",
          desc: "X86 + 核心顯卡（iGPU）現能以普通硬體成本承載企業級智能體運行。"
        },
        {
          num: "03",
          title: "數據主權立法化",
          desc: "東協八國、歐盟、中國占全球 GDP 的 45%。數據在地化已成為法律強制要求，而非企業偏好。"
        },
        {
          num: "04",
          title: "生態預算創歷史新高",
          desc: "雲廠商與平台項目正全力補貼開發者，降低進入門檻。"
        }
      ]
    },
    insight: {
      title: "§ 03 · 深度洞察",
      heading: "多數人尚未察覺的三大趨勢。",
      insights: [
        {
          num: "01",
          title: "品牌方法論是護城河。模型本身不是。",
          desc: "誰能將營運手冊編碼為機器工作流，誰就擁有客戶。"
        },
        {
          num: "02",
          title: "智能體將像應用一樣被發現，而不是像 SaaS 一樣被銷售。",
          desc: "分發網路的價值遠超其所分發的任何單一應用程式。"
        },
        {
          num: "03",
          title: "硬體是獲客成本最低的企業級渠道。",
          desc: "邊緣硬體設備帶來的是一次性部署 + 主權溢價 + 36個月的高粘性鎖定。"
        }
      ].map((item, idx) => ({ ...item, anchor: siteCopy.insight.insights[idx].anchor }))
    },
    whatKairmaIs: {
      title: "§ 04 · KAIRMA 定義",
      heading: "四層架構。一個不斷複利的增長結構。",
      layers: [
        {
          id: "§ IV",
          title: "聯盟協作",
          desc: "通過 Web3Labs 建立戰略合作。與微軟深度對齊。入選 YZi Labs 孵化。依托母公司生態系統對接香港政策支持。"
        },
        {
          id: "§ III",
          title: "智能員工",
          desc: "不斷擴充的 AI 數位員工庫。首發網紅商務拓展智能體。每季度推出更多角色。面向開發者開放接入（開發中）。"
        },
        {
          id: "§ II",
          title: "操作系統",
          desc: "標準作業程序（SOP）引擎 + 智能員工協同矩陣。對品牌方法論進行編碼。支持多模型路由及 RPA 自動化執行。"
        },
        {
          id: "§ I",
          title: "邊緣魔盒",
          desc: "Kairma 邊緣一體機。採用 X86 / Windows 輕資產硬體。在地部署。為保障數據主權而生。"
        }
      ],
      footer: "硬體作為切入點。軟體作為核心主體。未來將走向開放生態。"
    },
    architecture: {
      title: "§ 05 · 系統架構",
      heading: "數據在地化。模型雲端化。任務智能路由。",
      premise: {
        title: "客戶在地環境",
        box: "Kairma 邊緣一體機",
        specs: "X86 / Windows",
        lakeTitle: "品牌數據湖",
        lakeDesc: "在地部署 · 絕不上傳",
        engine: "SOP 工作流引擎",
        router: "多模型路由器",
        rpa: "RPA / API 交互層"
      },
      cloud: {
        title: "雲端模型群",
        models: siteCopy.architecture.cloud.models,
        desc: "根據成本與具體任務，自動進行多模型智能路由。"
      },
      arrows: {
        top: "任務流",
        bottom: "原始數據不出在地"
      },
      footer: "源數據絕不離開在地環境。僅對任務指令進行雲端路由。"
    },
    howItWorks: {
      title: "§ 08 · 運作流程",
      heading: "將營運成本逼近於零的複利飛輪。",
      steps: [
        {
          num: "1",
          name: "知識捕獲",
          desc: "從品牌營運團隊收集並整理標準的标准作业程序（SOP）。"
        },
        {
          num: "2",
          name: "工作流編碼",
          desc: "SOP 引擎將品牌營運方法論編譯為可由智能體執行的自動化工作流。"
        },
        {
          num: "3",
          name: "設備部署",
          desc: "Kairma 邊緣一體機交付至客戶在地，智能體開始在地安全運行。"
        },
        {
          num: "4",
          name: "自主運轉",
          desc: "智能體獨立執行工作。品牌按月訂閱。每次運行都在加深並優化 SOP。"
        },
        {
          num: "5",
          name: "架構複利",
          desc: "下一個新智能體可重用 70% 的底層框架。開發每一個新崗位的成本都會呈指數級下降。"
        }
      ]
    },
    defensibility: {
      title: "§ 06 · 壁壘優勢",
      heading: "四大壁壘。由淺入深構建護城河。",
      moats: [
        {
          num: "01",
          title: "SOP 引擎 + 在地數據湖",
          desc: "將品牌專有的營運手冊編碼為自主運行的工作流。隨著數據累積產生複利價值。",
          comparison: "→ 競品（如 Sierra、Wonderful）僅出售標準接口，不編碼業務邏輯。"
        },
        {
          num: "02",
          title: "智能員工庫",
          desc: "由 Kairma 團隊自主研發，即將面向生態開放共建。",
          comparison: "→ 現貨交付的工具庫，遠比停留在 PPT 上的規劃具有實際價值。"
        },
        {
          num: "03",
          title: "微軟深度對齊",
          desc: "基於 Web3Labs 戰略合作框架。直接對接 Azure 合作夥伴生態。對齊 X86/Windows 邊緣計算技術底座。",
          comparison: "→ 純軟體型的 AI 初創公司無法享受此硬體級通道。"
        },
        {
          num: "04",
          title: "輕資產硬體供應鏈",
          desc: "標準 X86 架構板卡 · 深圳合約 OEM 代工組裝。無庫存風險，支持 18 個月疊代週期。",
          comparison: "→ 僅在海外營運的競品無法直接利用深圳的高效硬體供應鏈。"
        }
      ]
    },
    story: {
      title: "§ 07 · 品牌故事",
      heading: "我們並非在廢墟中重建生態，而是直接繼承一個生態。",
      sections: [
        {
          kicker: "源自何處",
          title: "Web3Labs",
          desc: "我們的孵化母體。在香港、新加坡、韓國、杭州、北京五地設有實體空間，營運網絡和基礎設施已全面鋪開。"
        },
        {
          kicker: "聯合生態",
          title: "微軟 (Microsoft)",
          desc: "依托 Web3Labs 戰略人工智能合作框架，直接對接微軟 Azure 合作夥伴計劃，實現 X86 / Windows 邊緣端的無縫對接。"
        },
        {
          kicker: "服務對象",
          title: "YZi Labs · 極客共創者",
          desc: "母體生態內的早期 AI 資本與開發者社區。這也是我們首批智能員工的原生地。"
        }
      ]
    },
    partners: {
      title: "§ 09 · 合作夥伴",
      heading: "我們所繼承的龐大生態 —— 合作夥伴標識即將推出。"
    },
    begin: {
      title: "§ 10 · 開啟通道",
      heading: "兩扇大門。選擇您的角色。",
      enterprise: {
        title: "面向企業客戶",
        subtitle: "部署屬於您的主權 AI 勞動力。",
        features: [
          "48 小時內完成在地化部署",
          "品牌數據絕不出在地",
          "多模型智能路由 (Claude · GPT · DeepSeek · Qwen)",
          "內置 18 個月打磨的 SOP 資產（由跨境網紅 BD 首席架構師設計）"
        ],
        cta: "申請試點項目 →",
        email: "pilot@kairma.ai"
      },
      builders: {
        title: "面向開發者",
        subtitle: "幫助我們構建下一個數位員工。",
        features: [
          "開發者搶先體驗通道",
          "智能體可直接部署至企業級 Kairma 邊緣一體機",
          "開放 SDK 正在緊密開發中"
        ],
        cta: "加入 Discord 社群 →",
        github: "github.com/kairma"
      }
    },
    closing: {
      text: "工作不會停歇，因為品牌永不眠。",
      sub: "KAIRMA 操作系統 · 2026"
    },
    footer: {
      wordmark: "Kai rma",
      tagline: "為跨境品牌營運打造的 AI 數位員工。",
      osVersion: "KAIRMA OS 版本 v1.0.0",
      email: "contact@kairma.ai",
      locations: ["新加坡", "深圳", "香港", "河內"],
      provenance: {
        spinOut: "孵化自 Web3Labs 生態系統",
        partners: ["微軟合作夥伴", "YZi Labs 成員"]
      },
      copyright: "© 2026 KAIRMA 版權所有"
    },
    boot: {
      title: "正在啟動 KAIRMA 作業系統 · V1.0.0",
      separator: "----------------------------------------",
      steps: [
        { text: "正在初始化 SOP 工作流程引擎", status: "OK" },
        { text: "正在載入本地品牌數據湖", status: "OK" },
        { text: "正在連接雲端多模型路由器", status: "OK" }
      ],
      ready: "準備就緒。",
      ctaImmerse: "> [ 繼續 ]",
      ctaSkip: "> [ 跳過至控制台 ]"
    },
    storyIntro: {
      osName: "KAIRMA OS 統一作業系統",
      copyright: "版權所有 © 2026 WEB3LABS",
      lines: [
        "算力替代人力的時代已經到來。",
        "AI 模型正在取代重複性的跨境工作。",
        "KAIRMA 是底盤。你來構建引擎。"
      ],
      scrollPrompt: "[ 向下滾動以初始化核心運行庫 ]"
    },
    status: {
      osName: "KAIRMA OS",
      version: "v1.0.0",
      dataMode: "在地化",
      modelRoute: "雲端化",
      rawData: "安全鎖定",
      agentStatus: {
        kolAgent: "已就緒",
        openSdk: "開發中",
        library: "按季擴充"
      }
    },
    photography: {
      title: "§ 11 · 視覺規範",
      heading: "電影質感，而非商品圖冊。",
      desc: "KAIRMA 的視覺語言具有強烈的電影質感，絕非商業化商品圖。每一張影像都必須呈現為電影的定格畫面 —— 拒絕刻板的圖庫照、拒絕冰冷的产品照、拒絕俗套的企業宣傳統。",
      specifications: {
        lens: "首選 50mm 或 85mm 定焦鏡頭。嚴禁使用廣角鏡頭（28mm以下）拍攝人像。",
        aperture: "淺景深。光圈範圍 f/1.8 至 f/4。嚴禁使用全焦深（全清晰）的刻板成像風格。",
        lighting: "僅採用單光源主光加反光板補光。嚴禁使用高亮度攝影棚頂光。保留並塑造陰影，而非消除它們。",
        colorTemperature: "暖色調 (3200K - 3800K, 王家衛電影風格) 或冷色調 (5600K - 6500K, 大衛·芬奇風格)。嚴禁使用中性的 5000K 標準白光。",
        saturation: "後期飽和度降低 5% - 15%。KAIRMA 的視覺調性絕不鮮艷奪目。",
        aspectRatio: "首選 1.85:1 或 2.39:1 的寬銀幕電影比例。視頻僅使用 16:9，社交媒體海報可使用 1:1。",
        grain: "後期添加 5% - 15% 膠片顆粒感。嚴禁使用純淨無噪點的數碼成像風格。",
        subjectFraming: "人像拍攝：首選 3/4 側臉或正側臉。嚴禁使用標準正面肖像照。",
        productFraming: "首選局部細節遮擋或隱現。嚴禁使用全產品的正面定妝照。"
      },
      subjectMatter: {
        permitted: [
          "邊緣魔盒 —— 作為雕塑藝術品般進行拍攝（局部暗光、材質細節特寫、金屬冷光）",
          "源自東亞禪意與歐洲中世紀傳統的建築細節（斑駁石牆、經書古籍、硯台墨跡）",
          "專注動作中的雙手特寫（書寫、加蓋火漆印章、輕撫質感器物）",
          "極具氛圍感的光影環境 —— 霧氣、微塵、穿透木窗的斜陽、燭光、黃銅斑駁表面",
          "黑貓（真實拍攝或超寫實藝術渲染）"
        ],
        forbidden: [
          "假笑的團隊合影或正面大頭照",
          "辦公室日常生活場景（寫滿塗鴉的白板、便利貼牆、\"腦力激盪時刻\"）",
          "任何商業化的免版權素材庫圖片",
          "乾淨白牆背景的普通商品渲染圖",
          "俗套的抽象\"科技感\"素材（如虛空電路板、發光數碼網格、科幻線條）",
          "千篇一律的商業握手、會議場景",
          "在自然光下以演示為目的的冷冰冰的電腦顯示器畫面"
        ]
      },
      references: [
        "王家衛 (杜可風攝影，代表作《花樣年華》《2046》的色彩與質感)",
        "大衛·芬奇 (傑夫·克羅嫩韋斯攝影，代表作《鬥陣俱樂部》《索命黃道帶》的冷峻陰鬱)",
        "克里斯托弗·諾蘭 (霍伊特·范·霍伊特馬攝影，代表作《信條》《奧本海默》的機械寫實)",
        "維姆·文德斯 (羅比·米勒攝影，代表作《德州巴黎》的構圖克制)",
        "安德烈·塔可夫斯基 (對物體與時間流逝的詩意捕捉)"
      ]
    },
    audio: {
      title: "§ 12 · 聲音資產",
      heading: "聲音的 DNA 圖譜。",
      desc: "KAIRMA 是硬體與軟體的有機結合體。聲音是品牌與生俱來的維度。我們的聲音識別系統由五大核心聲音資產組成，它們均基於特定音頻詞彙建構。",
      vocabulary: [
        "青銅古鐘 / 大教堂鐘聲 —— 厚重的青銅共鳴，長尾音衰退，極具儀式感",
        "木質打擊樂器 (木魚 Muyu) —— 清脆的單次敲擊，短衰退，空靈禪意",
        "銅製頌缽 —— 環繞共鳴音，僅在《Devanagari 梵文儀式》資產中使用",
        "模組化合成器脈衝 —— 模擬電路質感，微粒化，在《Chrome 賽博》資產中使用",
        "朱砂印章加蓋聲 —— 印章按壓入紙的真實摩擦聲，在《印章傳統》資產中使用",
        "低頻電磁哼鳴 —— 環境基底音，用於一體機的 UI 狀態提示",
        "經過處理的靜音 —— 刻意設計的空白，用於聲音事件之間的轉折過渡"
      ],
      assets: [
        {
          name: "品牌音訊 Logo",
          duration: "3 - 5 秒",
          composition: "古鐘鐘聲 + 合成器脈衝 + 木魚單擊",
          use: "Kairma 一體機啟動音；品牌宣傳影片片頭"
        },
        {
          name: "同步就緒音",
          duration: "0.5 - 1 秒",
          composition: "單次木魚敲擊 + 瞬時蓋印聲",
          use: "UI 交互點擊；API 介面調用成功反饋"
        },
        {
          name: "熵增警示音",
          duration: "1 - 2 秒",
          composition: "玻璃碎裂聲 + 低頻哼鳴 + 瞬間靜音",
          use: "系統錯誤提示；運行警告狀態"
        },
        {
          name: "因果回響大鐘",
          duration: "5 - 8 秒",
          composition: "飽滿的教堂大鐘宏大回響，伴隨長空間衰退",
          use: "重大品牌活動；達成重要業務里程碑時刻"
        },
        {
          name: "設備靜默環境聲",
          duration: "30 - 60 秒循環",
          composition: "低頻哼鳴背景 + 間歇性木魚微鳴 + 風鈴微風掠過",
          use: "Kairma 一體機處於閒置待命狀態時的底噪"
        }
      ],
      commissioningProfile: "品牌聲音應邀請師承坂本龍一、吉村弘或當代東亞/歐洲先鋒電子音樂家的作曲家進行定制創作。應堅決避免使用流水線化生產的商業套路配樂。"
    },
    pilotModal: {
      title: "申請試點項目",
      subtitle: "48 小時內為您部署專屬的主權 AI 員工團隊。",
      monoDesc: "在地魔盒。您的首個 AI 數位員工。原始數據絕不出在地。",
      fields: {
        name: {
          label: "姓名",
          placeholder: "請輸入您的姓名"
        },
        email: {
          label: "企業信箱 *",
          placeholder: "name@company.com"
        },
        company: {
          label: "公司名稱",
          placeholder: "請輸入公司名稱"
        },
        country: {
          label: "國家/地區",
          options: ["新加坡", "印度尼西亞", "馬來西亞", "泰國", "越南", "菲律賓", "香港", "中國大陸", "其他"]
        },
        workflow: {
          label: "試點工作流",
          options: ["網紅 BD", "內容生成", "營運自動化", "財務審計", "自定義定制"]
        },
        sovereignty: {
          label: "數據主權合規要求",
          options: ["嚴苛在地部署 (Strict on-prem)", "混合雲部署 (Hybrid)", "主權雲部署 (Sovereign Cloud)", "暫未決定"]
        }
      },
      submitCta: "提交申請 →",
      success: {
        title: "已收到申請。",
        subtitle: "我們的專家團隊將在 1 個工作日內給您答覆。",
        downloadCta: "下載兩頁版系統架構簡報 (PDF)",
        downloadLink: "/KAIRMA Business Deck 2026.pdf",
        closeCta: "關閉"
      }
    },
    ecosystemModels: {
      title: "大模型排行榜",
      subtitle: "基於 OpenRouter 週度使用量排名",
      fullRankings: "完整榜單 ↗",
      fetching: "正在獲取排名...",
      metrics: {
        intelligence: "智能能力",
        coding: "程式碼能力",
        agentic: "智能體能力"
      },
      tableHeaders: {
        model: "模型",
        context: "上下文",
        price: "價格/百萬token",
        intel: "智能",
        code: "程式碼"
      },
      detailLabels: {
        free: "免費",
        rank: "排名",
        context: "上下文:",
        input: "輸入:",
        output: "輸出:",
        modality: "模態:",
        benchmarkScores: "基準評分"
      }
    },
    partnersBox: {
      title: "§ 01 · 合作夥伴",
      heading: "全球野心需要的不僅僅是人才。",
      description: "最雄心勃勃的品牌往往受制於陳舊的營運模式、分散的數據和線性的人力成本。我們來解決這個問題。KAIRMA 提供頂級的 SOP 引擎、智能體工作流和基礎設施，在不增加工資支出的前提下，助力品牌全球擴張。我們將營運摩擦轉化為自動化的複利優勢。",
      marqueeLabel: "生態合作夥伴"
    },
    fdeHero: {
      h1: "我們不向您推銷 AI。我們將它部署到您的營運中。",
      sub: "Kairma 是專為 AI 勞動力打造的前端部署平台。首個品類：跨境品牌營運的 AI 數位員工。",
      state: "Agent OS — 編排層。開放接入開發中。",
      ctaPilot: "申請試點專案",
      ctaWorks: "前端部署如何運作"
    },
    fdeShift: {
      title: "Section 1 — The shift",
      heading: "瓶頸已從模型能力轉移到了部署階段。",
      desc: "工具讓人變快。但勞動力能直接完成工作。我們部署的是後者。"
    },
    fdeEmployees: {
      title: "Section 2 — AI 數位員工",
      heading: "您的首批 AI 數位員工，是部署進來的 — 而不是下載的。",
      desc: "開放接入開發中",
      roles: ["網紅 BD", "內容營運", "客戶服務", "合規審計"]
    },
    fdeDeployment: {
      title: "Section 3 — 前端部署 (FDE)",
      heading: "我們駐守在您這邊，直到產出結果為止。",
      desc: "我們的前置部署團隊將 AI 勞動力直接空降到您的業務營運中，根據您的數據和流程進行調優，並確保您的勞動力消耗的每一個 token 都能產生業務結果 —— 拒絕無效消耗。"
    },
    fdeBox: {
      title: "Section 4 — 邊緣魔盒",
      heading: "您的數位勞動力運行在一個由您完全掌控的封閉環境中。",
      desc: "設計即安全。您的智能體、您的數據以及我們共建的營運手冊（Playbooks），都會留在私有的運行環境中 —— 它們不會洩露到共享雲端，也不會成為別人的訓練數據。"
    },
    fdeFlywheel: {
      title: "Section 5 — 每次部署都讓成本更低",
      heading: "每一次部署都讓下一次變得更快。",
      desc: "我們在您營運中沉澱的經驗，將轉化為平台中可複用的能力。工作效能不斷產生複利。"
    },
    fdePilot: {
      title: "Section 6 — 試點申請",
      developers: {
        heading: "面向開發者",
        desc: "在 Kairma 上構建 AI 數位員工。您的智能體邏輯運行在封閉閉源的運行環境中 —— 知識產權完全屬於您。"
      },
      operators: {
        heading: "面向營運方",
        desc: "將 AI 勞動力部署到您的跨境品牌營運中。我們與您共同落地。"
      }
    }
  },
  vi: {
    hero: {
      kicker: "§ 00 · KAIRMA",
      wordmark: "Kai rma",
      tagline: "Lực lượng lao động AI cho các thương hiệu xuyên biên giới.",
      subTagline: "MỘT HỘP. NHÂN VIÊN AI ĐẦU TIÊN CỦA BẠN.",
      anchorBio: "HỆ ĐIỀU HÀNH THỐNG NHẤT CHO HOẠT ĐỘNG THƯƠNG HIỆU XUYÊN BIÊN GIỚI. CHÚNG TÔI THAY THẾ LAO ĐỘNG LẶP LẠI BẰNG CÁC ĐẠI LÝ AI TỰ CHỦ, CHO PHÉP CÁC THƯƠNG HIỆU THAM VỌNG MỞ RỘNG TOÀN CẦU MÀ KHÔNG BỊ GIỚI HẠN SỐ LƯỢNG NHÂN SỰ TUYẾN TÍNH.",
      cta: {
        begin: "Bắt đầu →",
        architecture: "Xem kiến trúc"
      },
      scrollText: "cuộn ↓"
    },
    problem: {
      title: "§ 01 · VẤN ĐỀ",
      heading: "Vận hành thương hiệu xuyên biên giới vẫn phụ thuộc tuyến tính vào nhân lực.",
      stat: {
        value: "$1.5 Nghìn Tỷ",
        label: "lãng phí trên toàn cầu mỗi năm cho nhân lực vận hành thương hiệu xuyên biên giới.",
        context: "— Tương đương 18 tháng thực tế chạy chiến dịch KOL BD xuyên biên giới."
      },
      painPoints: [
        "01 · Kịch bản BD không thể chuẩn hóa. Rò rỉ phễu bán hàng.",
        "02 · Vận hành trên bốn nền tảng khác nhau. Không có tích hợp dữ liệu.",
        "03 · Mỗi thị trường mới cần thuê nhân sự mới. Chi phí tăng tuyến tính."
      ]
    },
    whyNow: {
      title: "§ 02 · TẠI SAO BÂY GIỜ",
      heading: "Bốn đường cong hội tụ vào năm 2026. Cửa sổ cơ hội sẽ đóng lại vào Q4 2027.",
      curves: [
        {
          num: "01",
          title: "Mô hình mã nguồn mở giảm còn 1/20 chi phí",
          desc: "DeepSeek · Qwen · Llama 4 đạt hơn 90% hiệu năng của GPT-4 trong các tác vụ doanh nghiệp."
        },
        {
          num: "02",
          title: "Suy luận biên (Edge Inference) rẻ hơn 10 lần",
          desc: "X86 + card đồ họa tích hợp (iGPU) hiện có thể chạy các agent cấp doanh nghiệp với chi phí phần cứng thông thường."
        },
        {
          num: "03",
          title: "Bắt buộc tuân thủ chủ quyền dữ liệu",
          desc: "ASEAN-8, EU, Trung Quốc chiếm 45% GDP toàn cầu. Địa phương hóa dữ liệu là luật, không còn là tùy chọn."
        },
        {
          num: "04",
          title: "Ngân sách hệ sinh thái đạt mức cao kỷ lục",
          desc: "Các nhà cung cấp đám mây và chương trình nền tảng đang tài trợ mạnh mẽ để thu hút các nhà phát triển."
        }
      ]
    },
    insight: {
      title: "§ 03 · THẤU HIỂU",
      heading: "Ba điều mà hầu hết mọi người chưa nhận ra.",
      insights: [
        {
          num: "01",
          title: "Phương pháp vận hành thương hiệu là rào cản cốt lõi. Không phải mô hình AI.",
          desc: "Ai mã hóa được tài liệu vận hành thành quy trình máy chạy sẽ sở hữu khách hàng."
        },
        {
          num: "02",
          title: "Agent AI sẽ được tìm kiếm như ứng dụng, không phải bán như SaaS.",
          desc: "Mạng lưới phân phối có giá trị lớn hơn bất kỳ ứng dụng đơn lẻ nào mà nó phân phối."
        },
        {
          num: "03",
          title: "Phần cứng là kênh tiếp cận doanh nghiệp rẻ nhất.",
          desc: "Một thiết bị phần cứng tại biên mang lại triển khai một lần + phí bảo đảm chủ quyền dữ liệu + khóa chân khách hàng 36 tháng."
        }
      ]
    },
    whatKairmaIs: {
      title: "§ 04 · KAIRMA LÀ GÌ",
      heading: "Bốn tầng cấu trúc. Một hệ thống tích lũy giá trị.",
      layers: [
        {
          id: "§ IV",
          title: "LIÊN MINH",
          desc: "Hợp tác chiến lược thông qua Web3Labs. Đồng hành cùng Microsoft. Thuộc nhóm YZi Labs. Tiếp cận chính sách HK qua hệ sinh thái mẹ."
        },
        {
          id: "§ III",
          title: "NHÂN VIÊN AI",
          desc: "Thư viện nhân viên số AI đang phát triển. Agent KOL BD đầu tiên. Ra mắt thêm nhiều vai trò mỗi quý. Mở SDK cho nhà phát triển (đang làm)."
        },
        {
          id: "§ II",
          title: "HỆ ĐIỀU HÀNH",
          desc: "Động cơ SOP + Ma trận nhân sự AI. Mã hóa phương pháp thương hiệu. Định tuyến đa mô hình. Thực thi tự động hóa RPA."
        },
        {
          id: "§ I",
          title: "THIẾT BỊ BIÊN",
          desc: "Thiết bị biên Kairma Box. Phần cứng gọn nhẹ chạy X86 / Windows. Triển khai tại chỗ. Bảo mật chủ quyền dữ liệu ngay từ thiết kế."
        }
      ],
      footer: "Phần cứng làm bước đệm. Phần mềm làm cốt lõi. Hướng tới một hệ sinh thái mở trong tương lai."
    },
    architecture: {
      title: "§ 05 · KIẾN TRÚC",
      heading: "Dữ liệu tại chỗ. Mô hình đám mây. Định tuyến tác vụ.",
      premise: {
        title: "TẠI CHỖ KHÁCH HÀNG",
        box: "Kairma Box",
        specs: "X86 / Windows",
        lakeTitle: "Hồ dữ liệu thương hiệu",
        lakeDesc: "tại chỗ · không bao giờ tải lên",
        engine: "Động cơ SOP",
        router: "Định tuyến mô hình",
        rpa: "Lớp tương tác RPA / API"
      },
      cloud: {
        title: "MÔ HÌNH ĐÁM MÂY",
        models: siteCopy.architecture.cloud.models,
        desc: "Định tuyến đa mô hình, tự động lựa chọn dựa trên chi phí và loại tác vụ."
      },
      arrows: {
        top: "tác vụ",
        bottom: "không rò rỉ dữ liệu thô"
      },
      footer: "Dữ liệu nguồn không bao giờ rời khỏi thiết bị biên. Chỉ có tác vụ lệnh được định tuyến lên đám mây."
    },
    howItWorks: {
      title: "§ 08 · CÁCH HOẠT ĐỘNG",
      heading: "Bánh đà giúp đưa chi phí vận hành về không.",
      steps: [
        {
          num: "1",
          name: "Thu thập",
          desc: "Thu thập các tài liệu SOP vận hành chuẩn từ đội ngũ vận hành thương hiệu."
        },
        {
          num: "2",
          name: "Mã hóa",
          desc: "Động cơ SOP biên dịch phương pháp vận hành thành quy trình công việc mà agent AI có thể thực thi."
        },
        {
          num: "3",
          name: "Triển khai",
          desc: "Thiết bị Kairma Box được giao đến khách hàng. Các agent AI bắt đầu chạy trực tiếp tại chỗ."
        },
        {
          num: "4",
          name: "Vận hành",
          desc: "Các agent tự động làm việc. Thương hiệu trả phí thuê bao. Quy trình SOP được cải tiến sau mỗi lượt chạy."
        },
        {
          num: "5",
          name: "Tích lũy",
          desc: "Agent tiếp theo tái sử dụng 70% nền tảng có sẵn. Chi phí triển khai nhân sự AI mới giảm dần theo cấp số nhân."
        }
      ]
    },
    defensibility: {
      title: "§ 06 · RÀO CẢN BẢO VỆ",
      heading: "Bốn rào cản cốt lõi. Sắp xếp theo chiều sâu.",
      moats: [
        {
          num: "01",
          title: "Động cơ SOP + Hồ dữ liệu biên",
          desc: "Mã hóa cẩm nang vận hành thương hiệu thành luồng công việc tự chạy. Tích lũy giá trị sau mỗi phiên hoạt động.",
          comparison: "→ Các đối thủ như Sierra, Wonderful chỉ bán đầu cuối kết nối, không mã hóa logic nghiệp vụ."
        },
        {
          num: "02",
          title: "Thư viện Agent AI",
          desc: "Được phát triển độc quyền bởi đội ngũ Kairma. Chuẩn bị mở rộng hệ sinh thái cho bên thứ ba.",
          comparison: "→ Một thư viện sẵn sàng bàn giao luôn mang lại giá trị nhanh hơn một kế hoạch hứa hẹn."
        },
        {
          num: "03",
          title: "Đồng hành cùng Microsoft",
          desc: "Thông qua khung hợp tác chiến lược Web3Labs. Tiếp cận chương trình đối tác Azure. Tích hợp thiết bị biên chạy X86/Windows.",
          comparison: "→ Các startup AI thuần phần mềm khó có thể tiếp cận được kênh phần cứng này."
        },
        {
          num: "04",
          title: "Chuỗi cung ứng phần cứng gọn nhẹ",
          desc: "Bo mạch X86 tiêu chuẩn · lắp ráp OEM theo hợp đồng tại Thâm Quyến. Không rủi ro tồn kho. Chu kỳ nâng cấp 18 tháng.",
          comparison: "→ Các đối thủ chỉ hoạt động tại Mỹ không có lợi thế chuỗi cung ứng biên giới này."
        }
      ]
    },
    story: {
      title: "§ 07 · CÂU CHUYỆN",
      heading: "Chúng tôi không tự xây dựng hệ sinh thái từ con số không. Chúng tôi tách ra từ một hệ sinh thái sẵn có.",
      sections: [
        {
          kicker: "NGUỒN GỐC",
          title: "Web3Labs",
          desc: "Hệ sinh thái mẹ. Mạng lưới hoạt động tại 5 thành phố lớn: Hồng Kông, Singapore, Hàn Quốc, Hàng Châu, Bắc Kinh. Cơ sở hạ tầng đã vận hành ổn định."
        },
        {
          kicker: "ĐỒNG HÀNH CÙNG",
          title: "Microsoft",
          desc: "Tiếp cận chương trình đối tác Microsoft Azure thông qua khung hợp tác AI chiến lược của Web3Labs. Đồng bộ hóa thiết bị biên chạy X86 / Windows."
        },
        {
          kicker: "PHỤC VỤ CHO",
          title: "YZi Labs · Nhà kiến tạo",
          desc: "Cộng đồng nhà phát triển và quỹ đầu tư AI giai đoạn sớm thuộc hệ sinh thái mẹ. Đây là nơi các agent đầu tiên được sinh ra."
        }
      ]
    },
    partners: {
      title: "§ 09 · ĐỐI TÁC",
      heading: "Hệ sinh thái mà chúng tôi tách ra — các logo đối tác sắp sửa công bố."
    },
    begin: {
      title: "§ 10 · BẮT ĐẦU",
      heading: "Hai cánh cửa. Lựa chọn vai trò của bạn.",
      enterprise: {
        title: "DÀNH CHO DOANH NGHIỆP",
        subtitle: "Triển khai lực lượng lao động AI chủ quyền.",
        features: [
          "Triển khai tại chỗ trong 48 giờ",
          "Dữ liệu thương hiệu nằm lại tại chỗ",
          "Định tuyến đa mô hình (Claude · GPT · DeepSeek · Qwen)",
          "Tích hợp sẵn SOP đúc kết 18 tháng (được thiết kế bởi kiến trúc sư trưởng KOL BD)"
        ],
        cta: "Đăng ký chạy thử nghiệm →",
        email: "pilot@kairma.ai"
      },
      builders: {
        title: "DÀNH CHO LẬP TRÌNH VIÊN",
        subtitle: "Cùng chúng tôi xây dựng các agent tiếp theo.",
        features: [
          "Quyền truy cập sớm dành cho lập trình viên",
          "Triển khai trực tiếp lên các hộp Kairma Box của doanh nghiệp",
          "Mở SDK đang trong quá trình hoàn thiện"
        ],
        cta: "Tham gia Discord của chúng tôi →",
        github: "github.com/kairma"
      }
    },
    closing: {
      text: "Công việc không bao giờ dừng lại, bởi vì thương hiệu không bao giờ ngủ.",
      sub: "KAIRMA OS · 2026"
    },
    footer: {
      wordmark: "Kai rma",
      tagline: "Lực lượng lao động AI cho vận hành thương hiệu xuyên biên giới.",
      osVersion: "KAIRMA OS Phiên bản v1.0.0",
      email: "contact@kairma.ai",
      locations: ["Singapore", "Thâm Quyến", "Hồng Kông", "Hà Nội"],
      provenance: {
        spinOut: "Một sản phẩm tách ra từ hệ sinh thái Web3Labs",
        partners: ["Đối tác Microsoft", "Thành viên YZi Labs"]
      },
      copyright: "© 2026 KAIRMA. Bản quyền được bảo lưu."
    },
    boot: {
      title: "KHỞI ĐỘNG KAIRMA OS · V1.0.0",
      separator: "----------------------------------------",
      steps: [
        { text: "KHỞI TẠO ĐỘNG CƠ QUY TRÌNH SOP", status: "OK" },
        { text: "TẢI HỒ DỮ LIỆU THƯƠNG HIỆU ĐỊA PHƯƠNG", status: "OK" },
        { text: "KẾT NỐI BỘ ĐỊNH TUYẾN MÔ HÌNH ĐÁM MÂY", status: "OK" }
      ],
      ready: "SẴN SÀNG.",
      ctaImmerse: "> [ TIẾP TỤC ]",
      ctaSkip: "> [ BỎ QUA ĐẾN BẢNG ĐIỀU KHIỂN ]"
    },
    storyIntro: {
      osName: "HỆ ĐIỀU HÀNH KAIRMA OS THỐNG NHẤT",
      copyright: "BẢN QUYỀN © 2026 WEB3LABS",
      lines: [
        "Kỷ nguyên mở rộng quy mô lao động đã kết thúc.",
        "Các mô hình AI hiện đang thay thế các nhiệm vụ xuyên biên giới lặp đi lặp lại.",
        "KAIRMA là khung gầm. Bạn xây dựng động cơ."
      ],
      scrollPrompt: "[ CUỘN XUỐNG ĐỂ KHỞI TẠO LÕI RUNTIME ]"
    },
    status: {
      osName: "KAIRMA OS",
      version: "v1.0.0",
      dataMode: "tại chỗ (local)",
      modelRoute: "đám mây (cloud)",
      rawData: "bảo mật (sealed)",
      agentStatus: {
        kolAgent: "đang chạy",
        openSdk: "đang phát triển",
        library: "mở rộng hàng quý"
      }
    },
    photography: {
      title: "§ 11 · HÌNH ẢNH",
      heading: "Chất lượng điện ảnh, không phải danh mục sản phẩm.",
      desc: "Ngôn ngữ hình ảnh của KAIRMA mang tính điện ảnh, không mang tính thương mại. Mỗi hình ảnh phải hiển thị giống như một khung cảnh được cắt ra từ phim — không phải ảnh kho có sẵn, không phải ảnh chụp sản phẩm thông thường, không phải cảnh sinh hoạt doanh nghiệp thông thường.",
      specifications: {
        lens: "Ưu tiên ống kính tiêu cự cố định 50mm hoặc 85mm. Nghiêm cấm sử dụng ống kính góc rộng (28mm trở xuống) để chụp chân dung người.",
        aperture: "Độ sâu trường ảnh mỏng. Khẩu độ từ f/1.8 đến f/4. Nghiêm cấm ảnh nét toàn dải thông thường.",
        lighting: "Chỉ sử dụng một nguồn sáng chính định hướng và một nguồn sáng phụ. Nghiêm cấm ánh sáng studio cường độ cao từ trên xuống. Bóng tối được giữ lại để tạo hình khối, không bị triệt tiêu.",
        colorTemperature: "Tông màu ấm (3200K - 3800K, phong cách Vương Gia Vệ) HOẶC tông màu lạnh (5600K - 6500K, phong cách David Fincher). Nghiêm cấm ánh sáng trắng trung tính 5000K.",
        saturation: "Giảm độ bão hòa màu xuống 5 - 15% khi hậu kỳ. Hình ảnh KAIRMA không bao giờ sặc sỡ.",
        aspectRatio: "Ưu tiên tỷ lệ màn ảnh rộng điện ảnh 1.85:1 hoặc 2.39:1. Tỷ lệ 16:9 chỉ dùng cho video. Tỷ lệ vuông chỉ dùng cho mạng xã hội.",
        grain: "Thêm 5 - 15% hạt phim (film grain) khi hậu kỳ. Nghiêm cấm ảnh kỹ thuật số siêu mịn hoàn hảo.",
        subjectFraming: "Với người: Ưu tiên góc nghiêng 3/4 hoặc nghiêng hoàn toàn. Nghiêm cấm ảnh chân dung chính diện.",
        productFraming: "Ưu tiên tiết lộ một phần sản phẩm. Nghiêm cấm ảnh chụp chính diện toàn bộ sản phẩm thông thường."
      },
      subjectMatter: {
        permitted: [
          "Thiết bị Kairma Box — phần cứng được chụp như một tác phẩm điêu khắc (chỉ lộ một phần, ánh sáng yếu, đặc tả bề mặt chất liệu)",
          "Chi tiết kiến trúc mang truyền thống Đông Á hoặc Châu Âu thời trung cổ (đá nhà thờ cổ, chất liệu giấy chép kinh, vết mực bút lông)",
          "Cận cảnh đôi bàn tay đang thực hiện các hành động có chủ đích (viết, đóng dấu, nâng niu đồ vật)",
          "Không gian giàu không khí — sương mù, hạt bụi trong nắng, ánh nắng chiếu qua cửa sổ, ngọn nến, bề mặt đồng thau",
          "Con mèo đen (ảnh thật hoặc kết xuất 3D siêu thực)"
        ],
        forbidden: [
          "Ảnh chân dung/ảnh nhóm cười gượng gạo của nhân viên",
          "Cảnh sinh hoạt văn phòng (bảng trắng, tường dán giấy note, \"khoảnh khắc sáng tạo\")",
          "Ảnh kho có sẵn (stock photo) thuộc bất kỳ loại nào",
          "Ảnh chụp sản phẩm trên nền trắng sạch sẽ thông thường",
          "Hình ảnh trừu tượng \"công nghệ\" chung chung (bảng mạch, các nút phát sáng, lưới kỹ thuật số)",
          "Cảnh bắt tay thương mại hoặc cảnh họp hành khuôn mẫu",
          "Màn hình máy tính hiển thị dưới ánh sáng văn phòng trung tính thông thường"
        ]
      },
      references: [
        "Vương Gia Vệ (quay phim Christopher Doyle, đại diện là Tâm Trạng Khi Yêu, 2046)",
        "David Fincher (quay phim Jeff Cronenweth, đại diện là Sàn Đấu Sinh Tử, Zodiac)",
        "Christopher Nolan (quay phim Hoyte van Hoytema, đại diện là Tenet, Oppenheimer — về tính thực tế cơ khí)",
        "Wim Wenders (quay phim Robby Müller, đại diện là Paris Texas, về sự tiết chế trong bố cục)",
        "Andrei Tarkovsky (về sự cảm nhận chất thơ của đồ vật và thời gian)"
      ]
    },
    audio: {
      title: "§ 12 · ÂM THANH",
      heading: "Bản đồ DNA âm thanh.",
      desc: "KAIRMA là sự kết hợp giữa phần cứng và phần mềm. Âm thanh là một chiều nguyên bản của thương hiệu. Hệ thống nhận diện âm thanh gồm năm tài sản âm thanh cốt lõi, được xây dựng từ một danh mục âm thanh được quy định.",
      vocabulary: [
        "Tiếng chuông chùa / chuông nhà thờ cổ —— độ vang đồng thiếc, đuôi âm kéo dài, gợi cảm giác trang nghiêm",
        "Nhạc cụ gõ bằng gỗ (Mõ Muyu) —— tiếng gõ đơn sắc sảo, đuôi âm ngắn, gợi sự thanh tịnh",
        "Bát xoay bằng đồng —— tiếng vang xoay tròn, chỉ sử dụng trong tài sản 《Devanagari Rite》",
        "Xung nhạc cụ tổng hợp modular —— chất âm analog, dạng hạt, sử dụng trong tài sản 《Chrome Cyber》",
        "Tiếng đóng dấu triện son lên giấy —— âm thanh ma sát nén của con dấu, sử dụng trong tài sản 《Seal Tradition》",
        "Tiếng ù tần số thấp —— âm thanh nền môi trường, dùng để báo trạng thái giao diện thiết bị",
        "Khoảng lặng được xử lý —— khoảng trống có chủ đích, dùng để chuyển tiếp giữa các sự kiện âm thanh"
      ],
      assets: [
        {
          name: "Âm Logo thương hiệu",
          duration: "3 - 5 giây",
          composition: "Chuông chùa + xung modular + tiếng gõ mõ gỗ",
          use: "Khởi động thiết bị Kairma Box; đoạn giới thiệu của tất cả video"
        },
        {
          name: "Âm báo đồng bộ",
          duration: "0.5 - 1 giây",
          composition: "Một tiếng gõ mõ gỗ + tiếng đóng dấu triện tức thời",
          use: "Nhấp chuột tương tác giao diện; phản hồi gọi API thành công"
        },
        {
          name: "Âm báo lỗi hệ thống",
          duration: "1 - 2 giây",
          composition: "Tiếng kính vỡ + tiếng ù tần số thấp + khoảng lặng tức thì",
          use: "Thông báo lỗi hệ thống; cảnh báo trạng thái cảnh báo"
        },
        {
          name: "Chuông vang nhân quả",
          duration: "5 - 8 giây",
          composition: "Tiếng chuông nhà thờ lớn vang dội với đuôi âm kéo dài trong không gian",
          use: "Sự kiện thương hiệu lớn; đạt cột mốc vận hành quan trọng"
        },
        {
          name: "Âm nền tĩnh thiết bị",
          duration: "30 - 60 giây lặp",
          composition: "Tiếng ù nền tần số thấp + tiếng gõ mõ nhẹ ngắt quãng + chuông gió thoảng qua",
          use: "Thiết bị Kairma Box ở trạng thái chờ rảnh rỗi"
        }
      ],
      commissioningProfile: "Âm thanh thương hiệu nên được đặt hàng từ một nhạc sĩ theo trường phái của Ryuichi Sakamoto, Hiroshi Yoshimura, hoặc nhạc điện tử thực nghiệm đương đại Đông Á / Châu Âu. Nên tránh xa các công ty sản xuất nhạc thương mại công nghiệp."
    },
    pilotModal: {
      title: "ĐĂNG KÝ CHẠY THỬ NGHIỆM",
      subtitle: "Triển khai đội ngũ nhân sự AI chủ quyền trong vòng 48 giờ.",
      monoDesc: "Hộp biên tại chỗ. Nhân viên số AI đầu tiên của bạn. Dữ liệu nguồn không đi đâu.",
      fields: {
        name: {
          label: "Họ và tên",
          placeholder: "Nhập họ và tên của bạn"
        },
        email: {
          label: "Email công việc *",
          placeholder: "name@company.com"
        },
        company: {
          label: "Tên công ty",
          placeholder: "Nhập tên công ty"
        },
        country: {
          label: "Quốc gia",
          options: ["Singapore", "Indonesia", "Malaysia", "Thailand", "Vietnam", "Philippines", "Hong Kong", "China", "Other"]
        },
        workflow: {
          label: "Quy trình thử nghiệm",
          options: ["KOL BD", "nội dung", "vận hành", "tài chính", "tùy chỉnh riêng"]
        },
        sovereignty: {
          label: "Yêu cầu tuân thủ dữ liệu",
          options: ["Triển khai tại chỗ nghiêm ngặt (Strict on-prem)", "Mô hình lai (Hybrid)", "Đám mây chủ quyền", "Chưa quyết định"]
        }
      },
      submitCta: "Gửi đăng ký →",
      success: {
        title: "Đã nhận đăng ký.",
        subtitle: "Chúng tôi sẽ phản hồi trong vòng 1 ngày làm việc.",
        downloadCta: "Tải bản tóm tắt kiến trúc 2 trang (PDF)",
        downloadLink: "/KAIRMA Business Deck 2026.pdf",
        closeCta: "Đóng"
      }
    },
    ecosystemModels: {
      title: "Xếp hạng LLM",
      subtitle: "Mô hình hàng đầu · Xếp hạng theo mức sử dụng hàng tuần · qua OpenRouter",
      fullRankings: "Bảng xếp hạng đầy đủ ↗",
      fetching: "Đang tải xếp hạng...",
      metrics: {
        intelligence: "Thông minh",
        coding: "Lập trình",
        agentic: "Tác tử"
      },
      tableHeaders: {
        model: "Mô hình",
        context: "Ngữ cảnh",
        price: "Giá/M",
        intel: "Thông minh",
        code: "Lập trình"
      },
      detailLabels: {
        free: "Miễn phí",
        rank: "Xếp hạng",
        context: "Ngữ cảnh:",
        input: "Đầu vào:",
        output: "Đầu ra:",
        modality: "Định dạng:",
        benchmarkScores: "Điểm chuẩn"
      }
    },
    partnersBox: {
      title: "§ 01 · ĐỐI TÁC",
      heading: "THAM VỌNG TOÀN CẦU ĐÒI HỎI NHIỀU HƠN CHỈ LÀ NHÂN TÀI.",
      description: "Những thương hiệu tham vọng nhất bị cản trở bởi hoạt động cũ kỹ, dữ liệu phân tán và chi phí nhân sự tuyến tính. Chúng tôi khắc phục điều đó. KAIRMA mang đến công cụ SOP, quy trình làm việc tự chủ và cơ sở hạ tầng tốt nhất để mở rộng thương hiệu toàn cầu mà không tăng bảng lương. Chúng tôi biến ma sát vận hành thành lợi thế tự động.",
      marqueeLabel: "ĐỐI TÁC HỆ SINH THÁI"
    },
    fdeHero: {
      h1: "Chúng tôi không bán AI cho bạn. Chúng tôi triển khai nó vào hoạt động của bạn.",
      sub: "Kairma là một nền tảng triển khai tiền phương (FDE) cho lực lượng lao động AI. Hạng mục đầu tiên: Nhân viên kỹ thuật số AI cho hoạt động thương hiệu xuyên biên giới.",
      state: "Agent OS — Lớp điều phối. Quyền truy cập mở đang được phát triển.",
      ctaPilot: "Đăng ký dự án thí điểm",
      ctaWorks: "Cách thức triển khai tiền phương hoạt động"
    },
    fdeShift: {
      title: "Section 1 — Sự chuyển dịch",
      heading: "Điểm nghẽn đã chuyển từ năng lực mô hình sang việc triển khai.",
      desc: "Công cụ giúp con người nhanh hơn. Nhưng lực lượng lao động thực sự làm công việc đó. Chúng tôi triển khai loại thứ hai."
    },
    fdeEmployees: {
      title: "Section 2 — Nhân viên kỹ thuật số AI",
      heading: "Những nhân viên AI kỹ thuật số đầu tiên của bạn, được triển khai — không phải tải xuống.",
      desc: "Quyền truy cập mở đang được phát triển",
      roles: ["KOL BD", "vận hành nội dung", "chăm sóc khách hàng", "kiểm toán tuân thủ"]
    },
    fdeDeployment: {
      title: "Section 3 — Triển khai tiền phương",
      heading: "Chúng tôi luôn đồng hành cùng bạn cho đến khi tạo ra kết quả.",
      desc: "Đội ngũ triển khai tiền phương của chúng tôi đưa lực lượng lao động vào thẳng hoạt động kinh doanh của bạn, tinh chỉnh theo dữ liệu và quy trình của bạn, đảm bảo mỗi token mà lực lượng lao động tiêu thụ đều tạo ra kết quả kinh doanh — không lãng phí."
    },
    fdeBox: {
      title: "Section 4 — The Box",
      heading: "Lực lượng lao động của bạn chạy trong một môi trường khép kín do bạn kiểm soát.",
      desc: "Thiết kế khép kín. Các agent, dữ liệu và playbooks mà chúng ta cùng xây dựng sẽ ở trong một môi trường vận hành riêng tư — không rò rỉ lên đám mây chung và không trở thành dữ liệu huấn luyện của người khác."
    },
    fdeFlywheel: {
      title: "Section 5 — Chi phí giảm sau mỗi lần triển khai",
      heading: "Mỗi lần triển khai làm cho lần tiếp theo nhanh hơn.",
      desc: "Những gì chúng tôi học được từ hoạt động của bạn trở thành khả năng tái sử dụng trên nền tảng. Hiệu suất công việc tạo ra lãi kép."
    },
    fdePilot: {
      title: "Section 6 — Thí điểm",
      developers: {
        heading: "Dành cho nhà phát triển",
        desc: "Xây dựng nhân viên AI kỹ thuật số trên Kairma. Logic agent của bạn chạy trong môi trường mã nguồn đóng, khép kín — quyền sở hữu trí tuệ thuộc về bạn."
      },
      operators: {
        heading: "Dành cho nhà vận hành",
        desc: "Triển khai lực lượng lao động AI vào hoạt động thương hiệu xuyên biên giới của bạn. Chúng tôi cùng bạn đưa nó vào thực tế."
      }
    }
  }
};

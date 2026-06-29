import { SiteCopyTypeV4 } from "./site-copy-v4";

export const siteCopyZhCnV4: SiteCopyTypeV4 = {
  hero: {
    wordmark: "Kairma",
    h1: "我们不把 AI 交给你，而是把它部署进你的运营。",
    sub: "为跨境品牌而生的 AI 数字劳动力——前线部署，并对成果负责。",
    bio: "Kairma 把 AI 数字员工部署进跨境品牌的日常运营——KOL BD、内容、客服、合规。我们不丢一套工具就走人；一支前线部署团队把这支劳动力落进你的运营，并一路陪到跑出成果为止。底层由 Agent OS 编排。开放接入，建置中。",
    cta_primary: "申请试点 →",
    cta_secondary: "看看部署如何运作",
    fde_note: "FDE — 前线部署（Forward-Deployed Engineering）。我们不丢下软件就走，而是把工程师嵌进“你这一侧”：他们对成果负责，把产品在你的运营里转成实际结果，再把所学带回平台。短期它是成本；长期它是 R&D，让每一次后续部署都更便宜。（由 Palantir 开创，如今已遍及企业级 AI。）"
  },
  s01_problem: {
    heading: "跨境品牌运营，至今仍靠堆人来扩张。",
    stat: "全球每年约 1.5 万亿美元花在跨境品牌运营的人力上。",
    note: "建立在 18 个月真实的跨境 KOL BD 运营之上。",
    points: [
      "BD 打法无法标准化，管线处处漏。",
      "四个平台，零整合。",
      "每进一个新市场，就得新招人——成本线性上升。"
    ]
  },
  s02_whynow: {
    heading: "四条曲线在 2026 交会。",
    points: [
      "开源模型，成本只剩零头。DeepSeek、Qwen、Llama 已能以前沿价格的零头跑完企业级任务。",
      "边缘推理，便宜得多。商用级硬件已能在本地跑企业级 agent。",
      "数据主权正在立法化。在东盟、欧盟与中国，本地化日益是强制，而非选项。",
      "生态预算处于高点。云端与平台计划正在补贴开发者的入场。"
    ]
  },
  s03_insight: {
    heading: "三件多数人还没算进去的事。",
    points: [
      "护城河是方法论，不是模型。谁把品牌的运营打法编码进机器工作流，谁就握住客户。",
      "Agent 会像 App 一样被“发现”，而非像 SaaS 一样被“卖”。分发网络的价值，大于其上任何单一应用。",
      "护城河是部署，不是下载。AI 系统与真实运营之间的鸿沟从不自己合拢；跨过它、并握住部署数据的一方，才会复利。"
    ]
  },
  s04_what: {
    heading: "四层，一个会复利的结构。",
    layers: {
      l4: "§ IV · 部署 (DEPLOYMENT) — 一支前线部署团队，把劳动力落进你的运营，并为成果负责。不是顾问，不是交付了事。",
      l3: "§ III · AGENTS — 不断成长的 AI 数字员工库。KOL BD 先行，每季新增。对开发者开放接入——建置中。",
      l2: "§ II · OS (Agent OS) — SOP 引擎 + 劳动力编排。你的品牌方法论，被编码。多模型路由，RPA 执行。",
      l1: "§ I · THE KEEP — 一个由你掌控的封闭运行时。你的数据、agent 与我们共建的 playbook 全留在你这侧，绝不进共享云。"
    },
    footer: "部署在前，软件复利，生态随后开放。"
  },
  s05_architecture: {
    heading: "数据留在本地。模型留在云端。只有任务上行。",
    customer_side: "the Keep——你的封闭运行时。品牌数据湖（私有，永不上传）。SOP 引擎、模型路由、RPA／API 层。",
    cloud_models: "Claude、GPT、Gemini、DeepSeek、Qwen、Kimi——依任务与成本路由。",
    footer: "原始数据永不离开你这侧，只有任务上行。",
    form_note: "the Keep 现阶段以 the Key 形态交付——一枚你握在手中的主权U盘，主权可握于掌心。Kairma One(本地一体机)在路线图上。"
  },
  s06_moats: {
    heading: "四道护城河，由深至浅。",
    moats: [
      "SOP 引擎 + 数据湖。把品牌打法编成可执行工作流，每跑一次就更深。（别家卖的是端点，不是被编码的逻辑。）",
      "正在出货的 Agent 库。自研，每季扩充。",
      "产品化的前线部署。the Keep + SOP 库把每次部署的约 80% 标准化；剩下最后一公里由一支轻量前线部署团队收尾——FDE 的经济模型因此无需七位数合约也能跑通。",
      "部署数据飞轮。每次部署都教会平台“哪些工作流真正产生结果”。客户原始数据留在 the Keep，学习在 Kairma 这侧复利。"
    ]
  },
  s07_story: {
    heading: "我们不打造生态，我们从一个生态里长出来。",
    from: "Kairma 从一个已具规模、横跨亚洲多城的运营集团分拆而出。开局之前，运营底盘已就位。",
    how: "由真正运营过多年跨境品牌的人前线部署——不是一边公开学习、一边摸索的实验室。",
    held_note: ""
  },
  s08_howitworks: {
    heading: "让成本随每一次部署而下降的飞轮。",
    steps: [
      "取材: 我们收集你的运营 SOP。",
      "编码: SOP 引擎把它编译成可执行的 agent 工作流。",
      "部署: 一支前线部署团队把劳动力落进你的环境。",
      "运行: 劳动力产出成果。你付订阅费。每一分 token 都花在成果上，而非空转。",
      "复利: 每次部署都把下一次标准化。约 80% 可沿用，最后一公里持续缩短。"
    ]
  },
  s09_inmotion: {
    heading: "我们所从出的生态——标识后续释出。"
  },
  s10_begin: {
    heading: "两道门，选你的那道。",
    operators: {
      title: "给运营方",
      desc: "把一支 AI 劳动力部署进你的跨境品牌运营。",
      points: [
        "我们陪你一起落地——要成果，不交付了事",
        "你的数据留在 the Keep，保持私有",
        "多模型路由（Claude · GPT · DeepSeek · Qwen）",
        "18 个月跨境 KOL BD，已编码"
      ],
      cta: "申请试点 → (pilot@kairma.ai)"
    },
    builders: {
      title: "给开发者",
      desc: "在 Kairma 上，打造下一个 AI 数字员工。",
      points: [
        "开发者抢先接入",
        "你的 agent 逻辑跑在 the Keep 里——它仍是你的",
        "直接部署到实机",
        "开放 SDK，建置中"
      ],
      cta: "加入社群 → (github.com/kairma)"
    }
  },
  footer: {
    tagline: "工作不会因为你停下而停下。",
    osVersion: "Kairma · 2026"
  }
};

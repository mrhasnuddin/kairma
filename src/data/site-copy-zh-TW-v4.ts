import { SiteCopyTypeV4 } from "./site-copy-v4";

export const siteCopyZhTwV4: SiteCopyTypeV4 = {
  hero: {
    wordmark: "Kairma",
    h1: "我們不把 AI 交給你，而是把它部署進你的營運。",
    sub: "為跨境品牌而生的 AI 數位勞動力——前線部署，並對成果負責。",
    bio: "Kairma 把 AI 數位員工部署進跨境品牌的日常營運——KOL BD、內容、客服、合規。我們不丟一套工具就走人；一支前線部署團隊把這支勞動力落進你的營運，並一路陪到跑出成果為止。底層由 Agent OS 編排。開放接入，建置中。",
    cta_primary: "申請試點 →",
    cta_secondary: "看看部署如何運作",
    fde_note: "FDE — 前線部署（Forward-Deployed Engineering）。我們不丟下軟體就走，而是把工程師嵌進「你這一側」：他們對成果負責，把產品在你的營運裡轉成實際結果，再把所學帶回平台。短期它是成本；長期它是 R&D，讓每一次後續部署都更便宜。（由 Palantir 開創，如今已遍及企業級 AI。）"
  },
  s01_problem: {
    heading: "跨境品牌營運，至今仍靠堆人來擴張。",
    stat: "全球每年約 1.5 兆美元花在跨境品牌營運的人力上。",
    note: "建立在 18 個月真實的跨境 KOL BD 營運之上。",
    points: [
      "BD 打法無法標準化，管線處處漏。",
      "四個平台，零整合。",
      "每進一個新市場，就得新招人——成本線性上升。"
    ]
  },
  s02_whynow: {
    heading: "四條曲線在 2026 交會。",
    points: [
      "開源模型，成本只剩零頭。DeepSeek、Qwen、Llama 已能以前沿價格的零頭跑完企業級任務。",
      "邊緣推理，便宜得多。商用級硬體已能在本地跑企業級 agent。",
      "資料主權正在立法化。在東協、歐盟與中國，在地化日益是強制，而非選項。",
      "生態預算處於高點。雲端與平台計畫正在補貼開發者的入場。"
    ]
  },
  s03_insight: {
    heading: "三件多數人還沒算進去的事。",
    points: [
      "護城河是方法論，不是模型。誰把品牌的營運打法編碼進機器工作流，誰就握住客戶。",
      "Agent 會像 App 一樣被「發現」，而非像 SaaS 一樣被「賣」。分發網絡的價值，大於其上任何單一應用。",
      "護城河是部署，不是下載。AI 系統與真實營運之間的鴻溝從不自己合攏；跨過它、並握住部署資料的一方，才會複利。"
    ]
  },
  s04_what: {
    heading: "四層，一個會複利的結構。",
    layers: {
      l4: "§ IV · 部署 (DEPLOYMENT) — 一支前線部署團隊，把勞動力落進你的營運，並為成果負責。不是顧問，不是交付了事。",
      l3: "§ III · AGENTS — 不斷成長的 AI 數位員工庫。KOL BD 先行，每季新增。對開發者開放接入——建置中。",
      l2: "§ II · OS (Agent OS) — SOP 引擎 + 勞動力編排。你的品牌方法論，被編碼。多模型路由，RPA 執行。",
      l1: "§ I · THE KEEP — 一個由你掌控的封閉運行時。你的資料、agent 與我們共建的 playbook 全留在你這側，絕不進共享雲。"
    },
    footer: "部署在前，軟體複利，生態隨後開放。"
  },
  s05_architecture: {
    heading: "資料留在本地。模型留在雲端。只有任務上行。",
    customer_side: "the Keep——你的封閉運行時。品牌資料湖（私有，永不上傳）。SOP 引擎、模型路由、RPA／API 層。",
    cloud_models: "Claude、GPT、Gemini、DeepSeek、Qwen、Kimi——依任務與成本路由。",
    footer: "原始資料永不離開你這側，只有任務上行。",
    form_note: "the Keep 現階段以 the Key 形態交付——一枚你握在手中的主權隨身碟，主權可握於掌心。Kairma One(地端一體機)在路線圖上。"
  },
  s06_moats: {
    heading: "四道護城河，由深至淺。",
    moats: [
      "SOP 引擎 + 資料湖。把品牌打法編成可執行工作流，每跑一次就更深。（別家賣的是端點，不是被編碼的邏輯。）",
      "正在出貨的 Agent 庫。自研，每季擴充。",
      "產品化的前線部署。the Keep + SOP 庫把每次部署的約 80% 標準化；剩下最後一公里由一支輕量前線部署團隊收尾——FDE 的經濟模型因此無需七位數合約也能跑通。",
      "部署資料飛輪。每次部署都教會平台「哪些工作流真正產生成果」。客戶原始資料留在 the Keep，學習在 Kairma 這側複利。"
    ]
  },
  s07_story: {
    heading: "我們不打造生態，我們從一個生態裡長出來。",
    from: "Kairma 從一個已具規模、橫跨亞洲多城的營運集團分拆而出。開局之前，營運底盤已就位。",
    how: "由真正營運過多年跨境品牌的人前線部署——不是一邊公開學習、一邊摸索的實驗室。",
    held_note: ""
  },
  s08_howitworks: {
    heading: "讓成本隨每一次部署而下降的飛輪。",
    steps: [
      "取材: 我們收集你的營運 SOP。",
      "編碼: SOP 引擎把它編譯成可執行的 agent 工作流。",
      "部署: 一支前線部署團隊把勞動力落進你的環境。",
      "運行: 勞動力產出成果。你付訂閱費。每一分 token 都花在成果上，而非空轉。",
      "複利: 每次部署都把下一次標準化。約 80% 可沿用，最後一公里持續縮短。"
    ]
  },
  s09_inmotion: {
    heading: "我們所從出的生態——標識後續釋出。"
  },
  s10_begin: {
    heading: "兩道門，選你的那道。",
    operators: {
      title: "給營運方",
      desc: "把一支 AI 勞動力部署進你的跨境品牌營運。",
      points: [
        "我們陪你一起落地——要成果，不交付了事",
        "你的資料留在 the Keep，保持私有",
        "多模型路由（Claude · GPT · DeepSeek · Qwen）",
        "18 個月跨境 KOL BD，已編碼"
      ],
      cta: "申請試點 → (pilot@kairma.ai)"
    },
    builders: {
      title: "給開發者",
      desc: "在 Kairma 上，打造下一個 AI 數位員工。",
      points: [
        "開發者搶先接入",
        "你的 agent 邏輯跑在 the Keep 裡——它仍是你的",
        "直接部署到實機",
        "開放 SDK，建置中"
      ],
      cta: "加入社群 → (github.com/kairma)"
    }
  },
  footer: {
    tagline: "工作不會因為你停下而停下。",
    osVersion: "Kairma · 2026"
  }
};

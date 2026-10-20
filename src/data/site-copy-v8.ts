import type { Language } from "./site-translations";

/* v5 home copy. Every line traces to the live kairma.ai copy (v6), the live
   v3 component strings, or the archive lines chosen in
   docs/revamp/02-v5-structure-plan.md §3, rewritten with the humanize rules:
   no em or en dashes, no invented facts, plain verbs. Non-English locales are
   drafts for native review. */

export interface Tagged { tag: string; title: string; text: string }
export interface Part { title: string; text: string }
export interface Employee { role: string; status: string; text: string }
export interface FigureCopy { title: string; hint: string; aria: string }

export interface CopyV8 {
  nav: {
    platform: string; deploy: string; why: string; workforce: string; pilot: string;
    menu: string; close: string; theme: string; language: string; skip: string; home: string;
  };
  loader: { steps: string[]; ok: string; label: string };
  hero: { h1: string; body: string; link: string; cta: string; ticker: string[] };
  intro: { statement: string; cta: string; routedLabel: string; routedLine: string };
  problems: { label: string; h: string; body: string; items: Tagged[] };
  platform: {
    items: { title: string; body: string; cta: string }[];
    parts: Part[];
    router: {
      live: string; syncing: string; fallback: string; updated: string;
      caption: string; headers: { rank: string; model: string; context: string; price: string; intel: string; code: string };
      perMillion: string; free: string; none: string;
    };
  };
  why: { label: string; h: string; body: string; items: Tagged[] };
  workforce: { label: string; h: string; status: string; items: Employee[] };
  cta: { h: string; body: string; button: string; devLabel: string; devText: string; devNote: string };
  deploy: { title: string; lead: string; paragraphs: string[]; close: string };
  pilot: { required: string; invalid: string; sent: string; again: string };
  figures: {
    keep: FigureCopy; keepOpen: FigureCopy; rack: FigureCopy; cage: FigureCopy;
    moats: string[]; problems: string[];
    readouts: { sealed: string; tasks: string; rawOut: string; selected: string; rank: string };
  };
}

const en: CopyV8 = {
  nav: {
    platform: "Platform", deploy: "How deployment works", why: "Why Kairma", workforce: "Workforce", pilot: "Request a pilot",
    menu: "Menu", close: "Close", theme: "Switch theme", language: "Language", skip: "Skip to content", home: "Kairma home",
  },
  loader: { steps: ["SOP workflow engine", "Local brand data lake", "Cloud model router"], ok: "OK", label: "Starting Kairma OS" },
  hero: {
    h1: "AI employees that work inside your operations",
    body: "Kairma forward-deploys AI employees into the markets you enter and runs them to outcomes. You judge them by results instead of headcount, and your data stays under your control.",
    link: "How deployment works",
    cta: "Request a pilot",
    ticker: ["Data stays local", "Models run in the cloud", "Only tasks route"],
  },
  intro: {
    statement: "The models got better. The results compound in deployment, so Kairma puts AI employees inside your cross-border operations, runs them to outcomes and keeps the accounts.",
    cta: "How deployment works",
    routedLabel: "Routed across",
    routedLine: "Kairma is model-neutral. Each task is routed live to Claude, GPT, Gemini, DeepSeek, Qwen or Kimi, by task and cost.",
  },
  problems: {
    label: "The shift",
    h: "Cross-border operations still scale like labor",
    body: "Ambitious brands are held back by legacy operations, scattered data and headcount costs that rise with every market.",
    items: [
      { tag: "Unscripted", title: "BD scripts don't standardize", text: "Without a standard script, deals leak out of the pipeline." },
      { tag: "Disconnected", title: "Four platforms, no integration", text: "Your team works across four platforms that don't share data." },
      { tag: "Linear", title: "Every new market needs new hires", text: "Costs grow in a straight line with headcount." },
      { tag: "Tool-bound", title: "Tools only make people faster", text: "A workforce does the work itself. Kairma deploys the workforce." },
    ],
  },
  platform: {
    items: [
      {
        title: "The Keep",
        body: "The Keep is your sealed runtime. Your brand data stays inside it, and only tasks go out to the models. It ships today as the Key, a sovereign drive you hold. Kairma One is on the roadmap.",
        cta: "How deployment works",
      },
      {
        title: "Model router",
        body: "Kairma is model-neutral and routes each task by cost and capability. The rack holds today's most-used models on OpenRouter, ranked by daily usage.",
        cta: "Full rankings",
      },
    ],
    parts: [
      { title: "Brand data lake", text: "Stays on your premises and is never uploaded." },
      { title: "SOP engine", text: "Encodes your playbook as workflow and deepens with every run." },
      { title: "Model router", text: "Sends each task to the model that fits it on cost and capability." },
      { title: "RPA / API", text: "Does the work inside the software you already use." },
    ],
    router: {
      live: "Live from OpenRouter", syncing: "Syncing rankings", fallback: "Rankings are unavailable right now", updated: "Updated",
      caption: "Top models by daily usage on OpenRouter",
      headers: { rank: "Rank", model: "Model", context: "Context", price: "Input price", intel: "Intel", code: "Code" },
      perMillion: "per 1M tokens", free: "Free", none: "Not rated",
    },
  },
  why: {
    label: "Why Kairma",
    h: "Four moats, ordered by depth",
    body: "You know your business better than we do. Kairma mirrors it, runs it and keeps the accounts, and a person closes the last mile on purpose.",
    items: [
      { tag: "Encoded", title: "SOP engine and data lake", text: "Your operating logic is encoded once and gets deeper with every run." },
      { tag: "Productized", title: "Productized forward deployment", text: "About 80% of each deployment is standard. A small team closes the last mile." },
      { tag: "Compounding", title: "Deployment-data flywheel", text: "What we learn in one deployment carries into the next." },
      { tag: "Sovereign", title: "Sovereignty", text: "Your data stays in the Keep." },
    ],
  },
  workforce: {
    label: "The workforce",
    h: "Your first AI employees, deployed into your operation",
    status: "Status",
    items: [
      { role: "KOL BD", status: "Pilot-ready", text: "Runs business development with creators and strategic partners." },
      { role: "Content Ops", status: "FDE configured", text: "Creates content and coordinates editorial work across your channels." },
      { role: "Customer Care", status: "In development", text: "Resolves tickets around the clock and escalates across support tiers." },
      { role: "Compliance", status: "Private runtime", text: "Monitors regulations, keeps an audit trail and checks work against policy." },
    ],
  },
  cta: {
    h: "Get an AI workforce deployed into your operation",
    body: "We land it with your team and stay on your side until it produces outcomes.",
    button: "Request a pilot",
    devLabel: "For developers",
    devText: "Forge the next AI employee in the Smithy. Your logic runs sealed in the Keep and stays yours.",
    devNote: "Docs coming soon",
  },
  deploy: {
    title: "How deployment works",
    lead: "Forward-deployed engineering (FDE)",
    paragraphs: [
      "A Kairma team embeds on your side instead of shipping software and leaving. It owns the outcome, turns the product into results and feeds what it learns back into the platform.",
      "In the short term that costs us. Over time it is the R&D that makes each next deployment cheaper. Palantir pioneered the model, and it is now common across enterprise AI.",
      "Your brand data stays in the Keep. Models run in the cloud, and only tasks travel between them.",
    ],
    close: "Close",
  },
  pilot: { required: "Enter your work email.", invalid: "That email doesn't look right. Check it and try again.", sent: "Your email app has opened with these details. Send it to pilot@kairma.ai and we reply within one business day.", again: "Open email again" },
  figures: {
    keep: { title: "The Keep", hint: "Hover to pull the Key", aria: "Drawing of the Keep as a small Greek treasury on a stone base, its bronze door shut and the temple key in the lock. Sealed scrolls, the tasks, leave by one side window along a stone runnel." },
    keepOpen: { title: "Inside the Keep", hint: "Select a part", aria: "Cutaway drawing of the treasury. The brand data lake is a spring in a stone well-head, the SOP engine is Clotho's spindle, the model router is a herm of Hermes, and the RPA and API are four golden handmaidens tied to your systems. Scrolls leave by one channel, and the spring is not connected to it." },
    rack: { title: "Model rack", hint: "Hover a row", aria: "Drawing of four marble tiers holding ten altars, one per model, arranged by rank with the top model at the summit. The altar for the selected model slides forward." },
    cage: { title: "Workforce", hint: "Open a role", aria: "Drawing of Hephaestus' forge: four bronze automatons in arched niches, one per AI employee, each on a wheeled plinth with a status lamp. The open role's automaton rolls forward." },
    moats: [
      "Drawing of Clotho's spindle: thread from a distaff winds onto a spindle that grows with each run.",
      "Drawing of a stone mould holding four identical cast ingots, while a hoist lowers one piece finished by hand into the fifth.",
      "Drawing of five lampstands lit one from the next, with a tally that adds one for each deployment.",
      "Drawing of the treasury door with Athena's shield on it and the temple key in the lock.",
    ],
    problems: [
      "Drawing of the Danaids' jar, which leaks from a hole near its foot.",
      "Drawing of four columns whose joints don't match, so no capital fits.",
      "Drawing of a trireme that takes one more bench of rowers for each new market.",
      "Drawing of Hermes' winged sandals lying still beside an automaton that hammers on its own.",
    ],
    readouts: { sealed: "Sealed", tasks: "Tasks routed: {n}", rawOut: "raw data out 0 B", selected: "Selected", rank: "Rank" },
  },
};

const zhTW: CopyV8 = {
  nav: {
    platform: "平台", deploy: "部署如何運作", why: "為何選擇 Kairma", workforce: "AI 員工", pilot: "申請試點",
    menu: "選單", close: "關閉", theme: "切換主題", language: "語言", skip: "跳至內容", home: "Kairma 首頁",
  },
  loader: { steps: ["SOP 工作流引擎", "本地品牌數據湖", "雲端模型路由"], ok: "OK", label: "正在啟動 Kairma OS" },
  hero: {
    h1: "在你的業務裡工作的 AI 員工",
    body: "Kairma 把 AI 員工前置部署到你進入的市場，並一路跑到成果。你按成果而非人頭來衡量它們，數據始終由你掌控。",
    link: "部署如何運作",
    cta: "申請試點",
    ticker: ["數據留在本地", "模型在雲端運行", "只有任務在流轉"],
  },
  intro: {
    statement: "模型已經更強。成果的複利發生在部署，所以 Kairma 把 AI 員工放進你的跨境營運，跑到成果，並把每一筆賬記清。",
    cta: "部署如何運作",
    routedLabel: "路由至",
    routedLine: "Kairma 模型中立。每個任務都按任務與成本，實時路由到 Claude、GPT、Gemini、DeepSeek、Qwen 或 Kimi。",
  },
  problems: {
    label: "轉變",
    h: "跨境營運，至今仍像勞動力一樣擴張",
    body: "有野心的品牌被老舊的營運方式、分散的數據，以及每進一個市場就上升的人力成本拖住。",
    items: [
      { tag: "無腳本", title: "BD 腳本無法標準化", text: "沒有標準腳本，商機就從管道裡流失。" },
      { tag: "斷連", title: "四個平台，零整合", text: "你的團隊在四個互不共享數據的平台之間工作。" },
      { tag: "線性", title: "每個新市場都要新增人手", text: "成本隨人頭直線上升。" },
      { tag: "工具受限", title: "工具只會讓人更快", text: "勞動力自己完成工作。Kairma 部署的是勞動力。" },
    ],
  },
  platform: {
    items: [
      {
        title: "the Keep",
        body: "the Keep 是你的封存運行時。品牌數據留在其中，只有任務會送往模型。它今天以 the Key（你手中的主權驅動器）出貨，Kairma One 在路線圖上。",
        cta: "部署如何運作",
      },
      {
        title: "模型路由",
        body: "Kairma 模型中立，按成本與能力為每個任務選路。這座機架放著今天 OpenRouter 上使用量最高的模型，按每日用量排名。",
        cta: "完整排名",
      },
    ],
    parts: [
      { title: "品牌數據湖", text: "留在你的場域內，永不上傳。" },
      { title: "SOP 引擎", text: "把你的打法編碼成工作流，每跑一次就更深。" },
      { title: "模型路由", text: "按成本與能力，把每個任務送到最合適的模型。" },
      { title: "RPA / API", text: "直接在你現有的軟件裡完成工作。" },
    ],
    router: {
      live: "OpenRouter 即時數據", syncing: "正在同步排名", fallback: "暫時無法取得排名", updated: "更新於",
      caption: "OpenRouter 每日用量最高的模型",
      headers: { rank: "排名", model: "模型", context: "上下文", price: "輸入價格", intel: "智能", code: "代碼" },
      perMillion: "每 100 萬 token", free: "免費", none: "未評分",
    },
  },
  why: {
    label: "為何選擇 Kairma",
    h: "四道護城河，由深到淺",
    body: "你比我們更懂你的生意。Kairma 如實映照它、替你跑通、把賬記清，最後一公里有意交由人來完成。",
    items: [
      { tag: "已編碼", title: "SOP 引擎與數據湖", text: "你的營運邏輯只需編碼一次，每跑一次就更深。" },
      { tag: "產品化", title: "產品化前置部署", text: "每次部署約 80% 是標準化的，一支小團隊收尾最後一公里。" },
      { tag: "複利", title: "部署數據飛輪", text: "一次部署學到的，帶進下一次部署。" },
      { tag: "主權", title: "數據主權", text: "你的數據留在 the Keep。" },
    ],
  },
  workforce: {
    label: "AI 員工",
    h: "你的第一批 AI 員工，部署進你的營運",
    status: "狀態",
    items: [
      { role: "KOL BD", status: "試點就緒", text: "與創作者和策略夥伴開展業務拓展。" },
      { role: "內容營運", status: "已配置 FDE", text: "跨渠道產出內容並協調編輯工作。" },
      { role: "客戶服務", status: "開發中", text: "全天候處理工單，並按支援層級升級。" },
      { role: "合規審查", status: "私有運行環境", text: "監測法規、保留審計軌跡，並按政策檢查工作。" },
    ],
  },
  cta: {
    h: "把一支 AI 勞動力部署進你的營運",
    body: "我們和你的團隊一起落地，並站在你這一側，直到產出成果。",
    button: "申請試點",
    devLabel: "給開發者",
    devText: "在 the Smithy 鍛造下一個 AI 員工。你的邏輯封存在 the Keep 裡運行，始終屬於你。",
    devNote: "文件即將推出",
  },
  deploy: {
    title: "部署如何運作",
    lead: "前置部署工程（FDE）",
    paragraphs: [
      "Kairma 團隊派駐在你這一側，而不是交付軟件就離開。團隊對結果負責，把產品變成成果，並把所學回饋到平台。",
      "短期來看這是我們的成本。長期而言，它是讓每一次部署都更便宜的研發。這個模式由 Palantir 開創，如今通行於企業級 AI。",
      "你的品牌數據留在 the Keep。模型在雲端運行，兩者之間只流轉任務。",
    ],
    close: "關閉",
  },
  pilot: { required: "請輸入工作電郵。", invalid: "這個電郵格式不正確，請檢查後再試。", sent: "你的電郵程式已帶著這些資料開啟。寄到 pilot@kairma.ai 後，我們會在一個工作天內回覆。", again: "再次開啟電郵" },
  figures: {
    keep: { title: "the Keep", hint: "懸停以拔出鑰匙", aria: "the Keep 圖示：石座上的一座希臘式寶庫，青銅門緊閉，神殿鑰匙插在鎖中。封存的卷軸（任務）從一扇側窗沿石槽送出。" },
    keepOpen: { title: "the Keep 內部", hint: "選擇一個部件", aria: "寶庫剖面圖：品牌數據湖是石砌井欄中的泉水，SOP 引擎是克洛托的紡錘，模型路由是赫密士的界石像，RPA 與 API 是四位連接你各個系統的黃金侍女。卷軸經由一條石槽離開，泉水與它互不相連。" },
    rack: { title: "模型機架", hint: "懸停一行", aria: "四層大理石階梯上的十座祭壇，每個模型一座，按排名排列，第一名位於頂端。所選模型的祭壇會向前滑出。" },
    cage: { title: "AI 員工", hint: "展開一個角色", aria: "赫菲斯托斯的鍛造坊：四尊青銅自動人偶立在拱形壁龕中，每位 AI 員工一尊，各站在帶狀態燈的輪座上。展開角色的人偶會向前滑出。" },
    moats: [
      "克洛托的紡錘：紗線從捲線桿繞上紡錘，每跑一次就更厚。",
      "石模中放著四塊相同的鑄錠，吊架把一件手工完成的作品放進第五格。",
      "五座燈台由前一座點燃下一座，計數器每次部署加一。",
      "寶庫大門上掛著雅典娜的盾牌，神殿鑰匙插在鎖中。",
    ],
    problems: [
      "達那伊得斯的水甕，從底部的破洞不斷漏水。",
      "四根柱子的榫接互不相合，沒有一個柱頭裝得上。",
      "一艘三列槳戰船，每進一個新市場就多一排槳手。",
      "赫密士的飛翼涼鞋靜靜放著，旁邊一具自動人偶自己在打鐵。",
    ],
    readouts: { sealed: "已封存", tasks: "已路由任務：{n}", rawOut: "原始數據外流 0 B", selected: "已選擇", rank: "排名" },
  },
};

const ja: CopyV8 = {
  nav: {
    platform: "プラットフォーム", deploy: "配備の仕組み", why: "Kairma を選ぶ理由", workforce: "AI従業員", pilot: "パイロットを申し込む",
    menu: "メニュー", close: "閉じる", theme: "テーマを切り替え", language: "言語", skip: "本文へ移動", home: "Kairma ホーム",
  },
  loader: { steps: ["SOP ワークフローエンジン", "ローカルのブランドデータレイク", "クラウドのモデルルーター"], ok: "OK", label: "Kairma OS を起動中" },
  hero: {
    h1: "あなたの業務の中で働く AI 従業員",
    body: "Kairma は AI 従業員をあなたが参入する市場へ前方配備し、成果まで走らせます。人数ではなく成果で評価でき、データはあなたの管理下に残ります。",
    link: "配備の仕組み",
    cta: "パイロットを申し込む",
    ticker: ["データはローカルに", "モデルはクラウドで", "流れるのはタスクだけ"],
  },
  intro: {
    statement: "モデルは良くなった。成果が積み上がるのは配備の段階です。だから Kairma は AI 従業員を越境オペレーションの中に置き、成果まで走らせ、帳簿をつけます。",
    cta: "配備の仕組み",
    routedLabel: "ルーティング先",
    routedLine: "Kairma はモデル中立です。各タスクはタスクとコストに応じて、Claude、GPT、Gemini、DeepSeek、Qwen、Kimi へリアルタイムにルーティングされます。",
  },
  problems: {
    label: "転換",
    h: "越境オペレーションは、いまだ労働のようにスケールする",
    body: "意欲あるブランドほど、古い運用、散らばったデータ、市場ごとに増える人件費に足を引っ張られています。",
    items: [
      { tag: "台本なし", title: "BD の台本が標準化されない", text: "標準の台本がないと、商談はパイプラインから漏れていきます。" },
      { tag: "分断", title: "4 つのプラットフォーム、連携ゼロ", text: "チームはデータを共有しない 4 つのプラットフォームをまたいで働いています。" },
      { tag: "線形", title: "新しい市場ごとに新しい採用", text: "コストは人数に比例して一直線に増えます。" },
      { tag: "道具止まり", title: "道具は人を速くするだけ", text: "労働力は仕事そのものをこなします。Kairma が配備するのは労働力です。" },
    ],
  },
  platform: {
    items: [
      {
        title: "the Keep",
        body: "the Keep はあなたの封印されたランタイムです。ブランドデータはその中に留まり、モデルへ出ていくのはタスクだけ。現在は the Key（あなたが手にする主権ドライブ）として出荷しており、Kairma One はロードマップにあります。",
        cta: "配備の仕組み",
      },
      {
        title: "モデルルーター",
        body: "Kairma はモデル中立で、各タスクをコストと能力でルーティングします。このラックには、OpenRouter で今日最も使われているモデルを日次の利用量順に並べています。",
        cta: "全ランキング",
      },
    ],
    parts: [
      { title: "ブランドデータレイク", text: "あなたの拠点に留まり、アップロードされることはありません。" },
      { title: "SOP エンジン", text: "あなたのやり方をワークフローとしてコード化し、走らせるほど深くなります。" },
      { title: "モデルルーター", text: "コストと能力で最適なモデルへ各タスクを送ります。" },
      { title: "RPA / API", text: "いま使っているソフトウェアの中で仕事をこなします。" },
    ],
    router: {
      live: "OpenRouter からライブ", syncing: "ランキングを同期中", fallback: "ランキングを取得できません", updated: "更新",
      caption: "OpenRouter の日次利用量上位モデル",
      headers: { rank: "順位", model: "モデル", context: "コンテキスト", price: "入力価格", intel: "知能", code: "コード" },
      perMillion: "100 万トークンあたり", free: "無料", none: "評価なし",
    },
  },
  why: {
    label: "Kairma を選ぶ理由",
    h: "四つの堀、深さ順",
    body: "あなたの事業はあなたが一番よく知っています。Kairma はそれを映し、回し、帳簿をつけます。ラスト・ワンマイルは意図して人が担います。",
    items: [
      { tag: "コード化", title: "SOP エンジンとデータレイク", text: "運用ロジックは一度コード化すれば、走らせるほど深くなります。" },
      { tag: "製品化", title: "製品化された前方配備", text: "各配備の約 80% は標準化済み。小さなチームがラスト・ワンマイルを締めます。" },
      { tag: "複利", title: "配備データのフライホイール", text: "一つの配備で学んだことが次の配備に引き継がれます。" },
      { tag: "主権", title: "データ主権", text: "あなたのデータは the Keep に留まります。" },
    ],
  },
  workforce: {
    label: "AI 従業員",
    h: "最初の AI 従業員を、あなたの現場へ配備",
    status: "ステータス",
    items: [
      { role: "KOL BD", status: "パイロット可", text: "クリエイターや戦略パートナーとの事業開発を担います。" },
      { role: "コンテンツ運用", status: "FDE 構成済み", text: "各チャネルでコンテンツを作り、編集作業を調整します。" },
      { role: "カスタマーケア", status: "開発中", text: "チケットを 24 時間対応し、サポート階層に応じてエスカレーションします。" },
      { role: "コンプライアンス", status: "プライベートランタイム", text: "規制を監視し、監査証跡を残し、ポリシーに照らして作業を確認します。" },
    ],
  },
  cta: {
    h: "AI 労働力を、あなたの現場へ配備する",
    body: "チームと一緒に着地させ、成果が出るまであなたの側に立ちます。",
    button: "パイロットを申し込む",
    devLabel: "開発者へ",
    devText: "次の AI 従業員を the Smithy で鍛え上げる。あなたのロジックは the Keep の中で封印されたまま動き、あなたのものであり続けます。",
    devNote: "ドキュメントは近日公開",
  },
  deploy: {
    title: "配備の仕組み",
    lead: "前方配備エンジニアリング（FDE）",
    paragraphs: [
      "Kairma のチームはソフトウェアを納めて去るのではなく、あなたの側に常駐します。成果に責任を持ち、製品を結果に変え、学んだことをプラットフォームに還元します。",
      "短期的には私たちのコストです。長期的には、次の配備をそのつど安くする R&D になります。このモデルは Palantir が開拓し、いまではエンタープライズ AI 全般に広がっています。",
      "ブランドデータは the Keep に留まります。モデルはクラウドで動き、その間を流れるのはタスクだけです。",
    ],
    close: "閉じる",
  },
  pilot: { required: "勤務先のメールアドレスを入力してください。", invalid: "メールアドレスの形式が正しくありません。確認してもう一度お試しください。", sent: "入力内容を含めてメールアプリを開きました。pilot@kairma.ai へ送信いただければ、1 営業日以内にご連絡します。", again: "もう一度メールを開く" },
  figures: {
    keep: { title: "the Keep", hint: "ホバーで鍵を抜く", aria: "the Keep の図：石の基壇に建つギリシャ式の宝庫。青銅の扉は閉じられ、神殿の鍵が錠に差さっている。封をした巻物（タスク）が一つの側窓から石の樋を通って出ていく。" },
    keepOpen: { title: "the Keep の内部", hint: "部品を選ぶ", aria: "宝庫の断面図：ブランドデータレイクは石の井戸枠の中の泉、SOP エンジンはクロトの紡錘、モデルルーターはヘルメスの柱像、RPA と API はあなたのシステムにつながる四体の黄金の侍女。巻物は一本の樋から出ていき、泉はそこにつながっていない。" },
    rack: { title: "モデルラック", hint: "行にホバー", aria: "大理石の四段の壇に並ぶ十の祭壇の図。モデルごとに一つずつ順位どおりに並び、首位は頂上にある。選んだモデルの祭壇が前に出る。" },
    cage: { title: "AI 従業員", hint: "役割を開く", aria: "ヘパイストスの鍛冶場の図：アーチ形の壁龕に四体の青銅の自動人形が立つ。AI 従業員ごとに一体で、それぞれステータスランプ付きの車輪の台に乗る。開いた役割の人形が前に出る。" },
    moats: [
      "クロトの紡錘の図：糸巻き棒の糸が紡錘に巻かれ、走らせるたびに太くなる。",
      "同じ鋳塊を四つ収めた石の鋳型と、手で仕上げた一品を五つ目に下ろす吊り具の図。",
      "前の灯から次へと火を移す五つの燭台と、配備ごとに一つ増える計数器の図。",
      "アテナの盾を掛けた宝庫の扉と、錠に差さった神殿の鍵の図。",
    ],
    problems: [
      "底近くの穴から水が漏れ続けるダナイスたちの甕の図。",
      "継ぎ目が合わず、どの柱頭も載らない四本の柱の図。",
      "新しい市場ごとに漕ぎ手の列が一つ増える三段櫂船の図。",
      "じっと置かれたヘルメスの翼のサンダルと、その横でひとりでに槌を打つ自動人形の図。",
    ],
    readouts: { sealed: "封印済み", tasks: "ルーティング済みタスク：{n}", rawOut: "生データ流出 0 B", selected: "選択中", rank: "順位" },
  },
};

const ko: CopyV8 = {
  nav: {
    platform: "플랫폼", deploy: "배치 방식", why: "Kairma를 선택하는 이유", workforce: "AI 직원", pilot: "파일럿 신청",
    menu: "메뉴", close: "닫기", theme: "테마 전환", language: "언어", skip: "본문으로 건너뛰기", home: "Kairma 홈",
  },
  loader: { steps: ["SOP 워크플로 엔진", "로컬 브랜드 데이터 레이크", "클라우드 모델 라우터"], ok: "OK", label: "Kairma OS 시작 중" },
  hero: {
    h1: "당신의 운영 안에서 일하는 AI 직원",
    body: "Kairma는 AI 직원을 당신이 진출하는 시장에 전방 배치하고 성과가 날 때까지 운영합니다. 인원수가 아니라 성과로 평가하고, 데이터는 계속 당신의 통제 아래에 둡니다.",
    link: "배치 방식",
    cta: "파일럿 신청",
    ticker: ["데이터는 로컬에", "모델은 클라우드에서", "오가는 것은 작업뿐"],
  },
  intro: {
    statement: "모델은 좋아졌습니다. 성과가 복리로 쌓이는 곳은 배치이기에, Kairma는 AI 직원을 크로스보더 운영 안에 두고 성과까지 운영하며 장부를 기록합니다.",
    cta: "배치 방식",
    routedLabel: "라우팅 대상",
    routedLine: "Kairma는 모델 중립입니다. 각 작업은 작업과 비용에 따라 Claude, GPT, Gemini, DeepSeek, Qwen, Kimi로 실시간 라우팅됩니다.",
  },
  problems: {
    label: "전환",
    h: "크로스보더 운영은 아직도 노동처럼 확장된다",
    body: "야심 있는 브랜드일수록 낡은 운영 방식, 흩어진 데이터, 시장마다 늘어나는 인건비에 발목을 잡힙니다.",
    items: [
      { tag: "대본 없음", title: "BD 스크립트가 표준화되지 않는다", text: "표준 스크립트가 없으면 거래가 파이프라인에서 새어 나갑니다." },
      { tag: "단절", title: "네 개의 플랫폼, 통합은 없음", text: "팀은 데이터를 공유하지 않는 네 개의 플랫폼을 오가며 일합니다." },
      { tag: "선형", title: "새 시장마다 새 채용", text: "비용이 인원수에 비례해 직선으로 늘어납니다." },
      { tag: "도구의 한계", title: "도구는 사람을 빠르게 할 뿐", text: "인력은 일 자체를 해냅니다. Kairma가 배치하는 것은 인력입니다." },
    ],
  },
  platform: {
    items: [
      {
        title: "the Keep",
        body: "the Keep은 봉인된 런타임입니다. 브랜드 데이터는 그 안에 머물고, 모델로 나가는 것은 작업뿐입니다. 현재는 the Key(당신이 보유하는 주권 드라이브)로 출하되며, Kairma One은 로드맵에 있습니다.",
        cta: "배치 방식",
      },
      {
        title: "모델 라우터",
        body: "Kairma는 모델 중립이며 각 작업을 비용과 역량에 따라 라우팅합니다. 이 랙에는 오늘 OpenRouter에서 가장 많이 쓰인 모델을 일간 사용량 순으로 담았습니다.",
        cta: "전체 순위",
      },
    ],
    parts: [
      { title: "브랜드 데이터 레이크", text: "당신의 사업장에 머물며 절대 업로드되지 않습니다." },
      { title: "SOP 엔진", text: "당신의 플레이북을 워크플로로 코드화하고 실행할수록 깊어집니다." },
      { title: "모델 라우터", text: "비용과 역량에 맞는 모델로 각 작업을 보냅니다." },
      { title: "RPA / API", text: "이미 쓰고 있는 소프트웨어 안에서 일을 처리합니다." },
    ],
    router: {
      live: "OpenRouter 실시간", syncing: "순위 동기화 중", fallback: "지금은 순위를 불러올 수 없습니다", updated: "업데이트",
      caption: "OpenRouter 일간 사용량 상위 모델",
      headers: { rank: "순위", model: "모델", context: "컨텍스트", price: "입력 가격", intel: "지능", code: "코드" },
      perMillion: "100만 토큰당", free: "무료", none: "평가 없음",
    },
  },
  why: {
    label: "Kairma를 선택하는 이유",
    h: "깊이 순으로 정렬한 네 개의 해자",
    body: "당신의 사업은 당신이 가장 잘 압니다. Kairma는 그것을 비추고, 운영하고, 장부를 기록하며, 마지막 구간은 의도적으로 사람이 마무리합니다.",
    items: [
      { tag: "코드화", title: "SOP 엔진과 데이터 레이크", text: "운영 로직을 한 번 코드화하면 실행할수록 깊어집니다." },
      { tag: "제품화", title: "제품화된 전방 배치", text: "각 배치의 약 80%는 표준화되어 있습니다. 작은 팀이 마지막 구간을 마무리합니다." },
      { tag: "복리", title: "배치 데이터 플라이휠", text: "한 번의 배치에서 배운 것이 다음 배치로 이어집니다." },
      { tag: "주권", title: "데이터 주권", text: "당신의 데이터는 the Keep에 머뭅니다." },
    ],
  },
  workforce: {
    label: "AI 직원",
    h: "당신의 운영에 배치되는 첫 AI 직원",
    status: "상태",
    items: [
      { role: "KOL BD", status: "파일럿 준비", text: "크리에이터 및 전략 파트너와의 사업 개발을 맡습니다." },
      { role: "콘텐츠 운영", status: "FDE 구성됨", text: "채널 전반에서 콘텐츠를 만들고 편집 작업을 조율합니다." },
      { role: "고객 지원", status: "개발 중", text: "티켓을 24시간 처리하고 지원 단계에 따라 에스컬레이션합니다." },
      { role: "컴플라이언스", status: "프라이빗 런타임", text: "규제를 모니터링하고 감사 기록을 남기며 정책에 따라 작업을 점검합니다." },
    ],
  },
  cta: {
    h: "당신의 운영에 AI 인력을 배치하세요",
    body: "팀과 함께 안착시키고, 성과가 날 때까지 당신 편에 서 있습니다.",
    button: "파일럿 신청",
    devLabel: "개발자를 위해",
    devText: "the Smithy에서 다음 AI 직원을 만드세요. 당신의 로직은 the Keep 안에서 봉인된 채 실행되며 계속 당신의 것입니다.",
    devNote: "문서 곧 공개",
  },
  deploy: {
    title: "배치 방식",
    lead: "전방 배치 엔지니어링(FDE)",
    paragraphs: [
      "Kairma 팀은 소프트웨어를 넘기고 떠나는 대신 당신 쪽에 상주합니다. 성과를 책임지고, 제품을 결과로 바꾸며, 배운 것을 플랫폼에 되돌립니다.",
      "단기적으로는 우리의 비용입니다. 장기적으로는 다음 배치를 매번 더 저렴하게 만드는 R&D입니다. 이 모델은 Palantir가 개척했고 지금은 엔터프라이즈 AI 전반에서 쓰입니다.",
      "브랜드 데이터는 the Keep에 머뭅니다. 모델은 클라우드에서 실행되고, 둘 사이를 오가는 것은 작업뿐입니다.",
    ],
    close: "닫기",
  },
  pilot: { required: "업무용 이메일을 입력하세요.", invalid: "이메일 형식이 올바르지 않습니다. 확인 후 다시 시도하세요.", sent: "입력한 내용으로 이메일 앱을 열었습니다. pilot@kairma.ai로 보내 주시면 1영업일 안에 답장드립니다.", again: "이메일 다시 열기" },
  figures: {
    keep: { title: "the Keep", hint: "마우스를 올려 열쇠 뽑기", aria: "the Keep 그림: 돌 기단 위의 그리스식 보물창고. 청동 문은 닫혀 있고 신전 열쇠가 자물쇠에 꽂혀 있다. 봉인된 두루마리(작업)가 옆 창 하나로 나와 돌 홈통을 따라 나간다." },
    keepOpen: { title: "the Keep 내부", hint: "부품 선택", aria: "보물창고 단면도: 브랜드 데이터 레이크는 돌 우물 속의 샘, SOP 엔진은 클로토의 물레가락, 모델 라우터는 헤르메스의 기둥상, RPA와 API는 당신의 시스템에 연결된 네 명의 황금 시녀다. 두루마리는 홈통 하나로 나가며, 샘은 그것과 연결되어 있지 않다." },
    rack: { title: "모델 랙", hint: "행에 마우스 올리기", aria: "대리석 네 단 위에 놓인 열 개의 제단 그림. 모델마다 하나씩 순위대로 놓여 있고 1위는 꼭대기에 있다. 선택한 모델의 제단이 앞으로 나온다." },
    cage: { title: "AI 직원", hint: "역할 열기", aria: "헤파이스토스의 대장간 그림: 아치형 벽감에 청동 자동인형 네 개가 서 있다. AI 직원마다 하나씩, 각각 상태 램프가 달린 바퀴 받침 위에 있다. 연 역할의 인형이 앞으로 굴러 나온다." },
    moats: [
      "클로토의 물레가락 그림: 실패대의 실이 물레가락에 감기며 실행할 때마다 굵어진다.",
      "똑같은 주괴 네 개를 담은 돌 거푸집과, 손으로 마무리한 한 점을 다섯째 칸에 내려놓는 도르래 그림.",
      "앞의 불에서 다음으로 불을 옮겨 붙이는 등잔대 다섯 개와 배치마다 하나씩 느는 계수기 그림.",
      "아테나의 방패가 걸린 보물창고 문과 자물쇠에 꽂힌 신전 열쇠 그림.",
    ],
    problems: [
      "바닥 근처 구멍으로 물이 계속 새는 다나이스들의 항아리 그림.",
      "이음매가 맞지 않아 어떤 기둥머리도 올라가지 않는 네 개의 기둥 그림.",
      "새 시장마다 노잡이 줄이 하나씩 늘어나는 삼단노선 그림.",
      "가만히 놓인 헤르메스의 날개 달린 샌들과 그 옆에서 혼자 망치질하는 자동인형 그림.",
    ],
    readouts: { sealed: "봉인됨", tasks: "라우팅된 작업: {n}", rawOut: "원본 데이터 유출 0 B", selected: "선택됨", rank: "순위" },
  },
};

const vi: CopyV8 = {
  nav: {
    platform: "Nền tảng", deploy: "Cách triển khai", why: "Vì sao chọn Kairma", workforce: "Nhân viên AI", pilot: "Đăng ký thử nghiệm",
    menu: "Menu", close: "Đóng", theme: "Đổi giao diện", language: "Ngôn ngữ", skip: "Bỏ qua đến nội dung", home: "Trang chủ Kairma",
  },
  loader: { steps: ["Công cụ quy trình SOP", "Hồ dữ liệu thương hiệu tại chỗ", "Bộ định tuyến mô hình trên đám mây"], ok: "OK", label: "Đang khởi động Kairma OS" },
  hero: {
    h1: "Nhân viên AI làm việc ngay trong hoạt động của bạn",
    body: "Kairma triển khai tiền phương nhân viên AI vào các thị trường bạn bước vào và vận hành họ đến khi ra kết quả. Bạn đánh giá họ bằng kết quả thay vì số người, và dữ liệu vẫn nằm trong tầm kiểm soát của bạn.",
    link: "Cách triển khai",
    cta: "Đăng ký thử nghiệm",
    ticker: ["Dữ liệu ở lại tại chỗ", "Mô hình chạy trên đám mây", "Chỉ tác vụ được định tuyến"],
  },
  intro: {
    statement: "Mô hình đã tốt hơn. Kết quả cộng dồn ở khâu triển khai, nên Kairma đặt nhân viên AI vào hoạt động xuyên biên giới của bạn, vận hành đến khi ra kết quả và ghi sổ rõ ràng.",
    cta: "Cách triển khai",
    routedLabel: "Định tuyến đến",
    routedLine: "Kairma trung lập về mô hình. Mỗi tác vụ được định tuyến trực tiếp đến Claude, GPT, Gemini, DeepSeek, Qwen hoặc Kimi, theo tác vụ và chi phí.",
  },
  problems: {
    label: "Sự chuyển dịch",
    h: "Vận hành xuyên biên giới vẫn mở rộng như lao động",
    body: "Các thương hiệu tham vọng bị kìm lại bởi cách vận hành cũ, dữ liệu phân tán và chi phí nhân sự tăng theo từng thị trường.",
    items: [
      { tag: "Không kịch bản", title: "Kịch bản BD không được chuẩn hóa", text: "Không có kịch bản chuẩn, giao dịch rò rỉ khỏi pipeline." },
      { tag: "Rời rạc", title: "Bốn nền tảng, không tích hợp", text: "Đội ngũ của bạn làm việc trên bốn nền tảng không chia sẻ dữ liệu." },
      { tag: "Tuyến tính", title: "Mỗi thị trường mới cần tuyển thêm người", text: "Chi phí tăng theo đường thẳng cùng số nhân sự." },
      { tag: "Chỉ là công cụ", title: "Công cụ chỉ giúp con người nhanh hơn", text: "Lực lượng lao động tự làm việc. Kairma triển khai lực lượng lao động." },
    ],
  },
  platform: {
    items: [
      {
        title: "the Keep",
        body: "the Keep là môi trường chạy được niêm phong của bạn. Dữ liệu thương hiệu ở lại bên trong, chỉ có tác vụ đi ra các mô hình. Hiện sản phẩm được giao dưới dạng the Key, một ổ đĩa chủ quyền do bạn giữ. Kairma One nằm trong lộ trình.",
        cta: "Cách triển khai",
      },
      {
        title: "Bộ định tuyến mô hình",
        body: "Kairma trung lập về mô hình và định tuyến mỗi tác vụ theo chi phí và năng lực. Giá này chứa các mô hình được dùng nhiều nhất hôm nay trên OpenRouter, xếp theo lượng dùng hằng ngày.",
        cta: "Bảng xếp hạng đầy đủ",
      },
    ],
    parts: [
      { title: "Hồ dữ liệu thương hiệu", text: "Ở lại tại cơ sở của bạn và không bao giờ được tải lên." },
      { title: "Công cụ SOP", text: "Mã hóa cách làm của bạn thành quy trình và sâu hơn sau mỗi lần chạy." },
      { title: "Bộ định tuyến mô hình", text: "Gửi mỗi tác vụ đến mô hình phù hợp về chi phí và năng lực." },
      { title: "RPA / API", text: "Làm việc ngay trong phần mềm bạn đang dùng." },
    ],
    router: {
      live: "Trực tiếp từ OpenRouter", syncing: "Đang đồng bộ xếp hạng", fallback: "Hiện không tải được bảng xếp hạng", updated: "Cập nhật",
      caption: "Các mô hình dùng nhiều nhất hằng ngày trên OpenRouter",
      headers: { rank: "Hạng", model: "Mô hình", context: "Ngữ cảnh", price: "Giá đầu vào", intel: "Trí tuệ", code: "Mã" },
      perMillion: "mỗi 1 triệu token", free: "Miễn phí", none: "Chưa đánh giá",
    },
  },
  why: {
    label: "Vì sao chọn Kairma",
    h: "Bốn con hào, xếp theo độ sâu",
    body: "Bạn hiểu doanh nghiệp của mình hơn chúng tôi. Kairma phản chiếu nó, vận hành nó và ghi sổ rõ ràng, còn chặng cuối được con người hoàn tất một cách có chủ đích.",
    items: [
      { tag: "Đã mã hóa", title: "Công cụ SOP và hồ dữ liệu", text: "Logic vận hành của bạn được mã hóa một lần và sâu hơn sau mỗi lần chạy." },
      { tag: "Sản phẩm hóa", title: "Triển khai tiền phương được sản phẩm hóa", text: "Khoảng 80% mỗi lần triển khai là tiêu chuẩn. Một đội nhỏ hoàn tất chặng cuối." },
      { tag: "Cộng dồn", title: "Bánh đà dữ liệu triển khai", text: "Những gì học được ở lần triển khai này được mang sang lần sau." },
      { tag: "Chủ quyền", title: "Chủ quyền dữ liệu", text: "Dữ liệu của bạn ở lại trong the Keep." },
    ],
  },
  workforce: {
    label: "Nhân viên AI",
    h: "Những nhân viên AI đầu tiên, triển khai vào hoạt động của bạn",
    status: "Trạng thái",
    items: [
      { role: "KOL BD", status: "Sẵn sàng thử nghiệm", text: "Phát triển kinh doanh với nhà sáng tạo và đối tác chiến lược." },
      { role: "Vận hành nội dung", status: "Đã cấu hình FDE", text: "Tạo nội dung và điều phối công việc biên tập trên các kênh." },
      { role: "Chăm sóc khách hàng", status: "Đang phát triển", text: "Xử lý yêu cầu suốt ngày đêm và chuyển cấp theo từng tầng hỗ trợ." },
      { role: "Tuân thủ", status: "Môi trường riêng tư", text: "Theo dõi quy định, lưu vết kiểm toán và đối chiếu công việc với chính sách." },
    ],
  },
  cta: {
    h: "Triển khai một lực lượng AI vào hoạt động của bạn",
    body: "Chúng tôi cùng đội ngũ của bạn đưa nó vào vận hành và đứng về phía bạn đến khi có kết quả.",
    button: "Đăng ký thử nghiệm",
    devLabel: "Dành cho nhà phát triển",
    devText: "Rèn nhân viên AI tiếp theo trong the Smithy. Logic của bạn chạy niêm phong trong the Keep và luôn thuộc về bạn.",
    devNote: "Tài liệu sắp ra mắt",
  },
  deploy: {
    title: "Cách triển khai",
    lead: "Kỹ thuật triển khai tiền phương (FDE)",
    paragraphs: [
      "Đội ngũ Kairma làm việc ngay bên phía bạn thay vì giao phần mềm rồi rời đi. Đội chịu trách nhiệm về kết quả, biến sản phẩm thành thành quả và đưa những gì học được trở lại nền tảng.",
      "Trước mắt đó là chi phí của chúng tôi. Về lâu dài, đó là R&D giúp mỗi lần triển khai sau rẻ hơn. Palantir đi tiên phong mô hình này, và nay nó phổ biến trong AI doanh nghiệp.",
      "Dữ liệu thương hiệu của bạn ở lại trong the Keep. Mô hình chạy trên đám mây, và giữa hai bên chỉ có tác vụ đi qua.",
    ],
    close: "Đóng",
  },
  pilot: { required: "Hãy nhập email công việc của bạn.", invalid: "Email này có vẻ chưa đúng. Hãy kiểm tra và thử lại.", sent: "Ứng dụng email đã mở với các thông tin này. Gửi đến pilot@kairma.ai và chúng tôi sẽ phản hồi trong một ngày làm việc.", again: "Mở lại email" },
  figures: {
    keep: { title: "the Keep", hint: "Rê chuột để rút chìa", aria: "Hình the Keep: một kho báu kiểu Hy Lạp trên nền đá, cửa đồng đóng kín, chìa khóa đền cắm trong ổ. Những cuộn giấy niêm phong (tác vụ) ra qua một ô cửa bên, theo một máng đá." },
    keepOpen: { title: "Bên trong the Keep", hint: "Chọn một bộ phận", aria: "Hình cắt của kho báu: hồ dữ liệu thương hiệu là dòng suối trong thành giếng đá, công cụ SOP là con suốt của Clotho, bộ định tuyến mô hình là trụ tượng Hermes, còn RPA và API là bốn nữ hầu bằng vàng nối với các hệ thống của bạn. Cuộn giấy ra qua một máng duy nhất, và dòng suối không nối với máng đó." },
    rack: { title: "Giá mô hình", hint: "Rê chuột lên một hàng", aria: "Hình bốn bậc đá cẩm thạch với mười bàn thờ, mỗi mô hình một bàn, xếp theo hạng, mô hình đứng đầu ở trên đỉnh. Bàn thờ của mô hình được chọn trượt ra phía trước." },
    cage: { title: "Nhân viên AI", hint: "Mở một vai trò", aria: "Hình lò rèn của Hephaestus: bốn người máy bằng đồng đứng trong các hốc tường hình vòm, mỗi nhân viên AI một người máy, mỗi người máy đứng trên bệ có bánh xe và đèn trạng thái. Người máy của vai trò đang mở lăn ra phía trước." },
    moats: [
      "Hình con suốt của Clotho: sợi từ cọc quấn len cuộn vào con suốt, dày thêm sau mỗi lần chạy.",
      "Hình khuôn đá chứa bốn thỏi đúc giống hệt nhau, và một ròng rọc hạ một món làm bằng tay vào ô thứ năm.",
      "Hình năm giá đèn được thắp nối tiếp từ ngọn trước sang ngọn sau, với bộ đếm tăng một sau mỗi lần triển khai.",
      "Hình cửa kho báu treo khiên của Athena, chìa khóa đền cắm trong ổ.",
    ],
    problems: [
      "Hình chiếc vò của các nàng Danaid, rò nước từ một lỗ gần đáy.",
      "Hình bốn cột có mộng ghép không khớp nhau, nên không đầu cột nào lắp vừa.",
      "Hình chiến thuyền ba tầng chèo, thêm một hàng tay chèo cho mỗi thị trường mới.",
      "Hình đôi dép có cánh của Hermes nằm yên, bên cạnh một người máy tự quai búa trên đe.",
    ],
    readouts: { sealed: "Đã niêm phong", tasks: "Tác vụ đã định tuyến: {n}", rawOut: "dữ liệu thô ra ngoài 0 B", selected: "Đã chọn", rank: "Hạng" },
  },
};

const ms: CopyV8 = {
  nav: {
    platform: "Platform", deploy: "Cara penempatan berfungsi", why: "Mengapa Kairma", workforce: "Pekerja AI", pilot: "Mohon perintis",
    menu: "Menu", close: "Tutup", theme: "Tukar tema", language: "Bahasa", skip: "Langkau ke kandungan", home: "Laman utama Kairma",
  },
  loader: { steps: ["Enjin aliran kerja SOP", "Tasik data jenama tempatan", "Penghala model awan"], ok: "OK", label: "Memulakan Kairma OS" },
  hero: {
    h1: "Pekerja AI yang bekerja di dalam operasi anda",
    body: "Kairma menempatkan pekerja AI di barisan hadapan pasaran yang anda masuki dan menjalankan mereka sehingga mencapai hasil. Anda menilai mereka melalui hasil, bukan bilangan kakitangan, dan data anda kekal dalam kawalan anda.",
    link: "Cara penempatan berfungsi",
    cta: "Mohon perintis",
    ticker: ["Data kekal setempat", "Model berjalan di awan", "Hanya tugasan dihalakan"],
  },
  intro: {
    statement: "Model sudah semakin baik. Hasil berganda pada peringkat penempatan, jadi Kairma meletakkan pekerja AI di dalam operasi rentas sempadan anda, menjalankan mereka hingga mencapai hasil dan menyimpan akaun dengan jelas.",
    cta: "Cara penempatan berfungsi",
    routedLabel: "Dihalakan ke",
    routedLine: "Kairma neutral model. Setiap tugasan dihalakan secara langsung kepada Claude, GPT, Gemini, DeepSeek, Qwen atau Kimi, mengikut tugasan dan kos.",
  },
  problems: {
    label: "Anjakan",
    h: "Operasi rentas sempadan masih berkembang seperti tenaga kerja",
    body: "Jenama yang bercita-cita tinggi tersekat oleh operasi lama, data yang berselerak dan kos kakitangan yang naik bagi setiap pasaran.",
    items: [
      { tag: "Tanpa skrip", title: "Skrip BD tidak diseragamkan", text: "Tanpa skrip piawai, urus niaga bocor keluar dari saluran jualan." },
      { tag: "Terputus", title: "Empat platform, tiada integrasi", text: "Pasukan anda bekerja merentas empat platform yang tidak berkongsi data." },
      { tag: "Linear", title: "Setiap pasaran baharu perlukan pengambilan baharu", text: "Kos meningkat secara lurus mengikut bilangan kakitangan." },
      { tag: "Terikat alat", title: "Alat hanya menjadikan orang lebih pantas", text: "Tenaga kerja melakukan kerja itu sendiri. Kairma menempatkan tenaga kerja." },
    ],
  },
  platform: {
    items: [
      {
        title: "the Keep",
        body: "the Keep ialah persekitaran masa jalan anda yang dimeterai. Data jenama anda kekal di dalamnya, dan hanya tugasan keluar kepada model. Hari ini ia dihantar sebagai the Key, pemacu berdaulat yang anda pegang. Kairma One berada dalam pelan hala tuju.",
        cta: "Cara penempatan berfungsi",
      },
      {
        title: "Penghala model",
        body: "Kairma neutral model dan menghalakan setiap tugasan mengikut kos dan keupayaan. Rak ini memuatkan model yang paling banyak digunakan hari ini di OpenRouter, disusun mengikut penggunaan harian.",
        cta: "Kedudukan penuh",
      },
    ],
    parts: [
      { title: "Tasik data jenama", text: "Kekal di premis anda dan tidak pernah dimuat naik." },
      { title: "Enjin SOP", text: "Mengekod buku panduan anda sebagai aliran kerja dan semakin mendalam setiap kali dijalankan." },
      { title: "Penghala model", text: "Menghantar setiap tugasan kepada model yang sesuai dari segi kos dan keupayaan." },
      { title: "RPA / API", text: "Melakukan kerja di dalam perisian yang sudah anda gunakan." },
    ],
    router: {
      live: "Langsung dari OpenRouter", syncing: "Menyegerak kedudukan", fallback: "Kedudukan tidak tersedia buat masa ini", updated: "Dikemas kini",
      caption: "Model teratas mengikut penggunaan harian di OpenRouter",
      headers: { rank: "Kedudukan", model: "Model", context: "Konteks", price: "Harga input", intel: "Kepintaran", code: "Kod" },
      perMillion: "setiap 1 juta token", free: "Percuma", none: "Belum dinilai",
    },
  },
  why: {
    label: "Mengapa Kairma",
    h: "Empat parit, mengikut kedalaman",
    body: "Anda lebih memahami perniagaan anda berbanding kami. Kairma mencerminkannya, menjalankannya dan menyimpan akaun, manakala batu terakhir diselesaikan oleh manusia dengan sengaja.",
    items: [
      { tag: "Dikodkan", title: "Enjin SOP dan tasik data", text: "Logik operasi anda dikodkan sekali dan semakin mendalam setiap kali dijalankan." },
      { tag: "Diproduktkan", title: "Penempatan barisan hadapan yang diproduktkan", text: "Kira-kira 80% setiap penempatan adalah piawai. Pasukan kecil menyelesaikan batu terakhir." },
      { tag: "Berganda", title: "Roda tenaga data penempatan", text: "Apa yang dipelajari dalam satu penempatan dibawa ke penempatan seterusnya." },
      { tag: "Berdaulat", title: "Kedaulatan", text: "Data anda kekal di dalam the Keep." },
    ],
  },
  workforce: {
    label: "Pekerja AI",
    h: "Pekerja AI pertama anda, ditempatkan di dalam operasi anda",
    status: "Status",
    items: [
      { role: "KOL BD", status: "Sedia perintis", text: "Menjalankan pembangunan perniagaan bersama pencipta dan rakan strategik." },
      { role: "Operasi Kandungan", status: "FDE dikonfigurasi", text: "Menghasilkan kandungan dan menyelaras kerja editorial merentas saluran anda." },
      { role: "Khidmat Pelanggan", status: "Dalam pembangunan", text: "Menyelesaikan tiket sepanjang masa dan meningkatkan isu mengikut peringkat sokongan." },
      { role: "Pematuhan", status: "Persekitaran peribadi", text: "Memantau peraturan, menyimpan jejak audit dan menyemak kerja berdasarkan polisi." },
    ],
  },
  cta: {
    h: "Tempatkan tenaga kerja AI di dalam operasi anda",
    body: "Kami melaksanakannya bersama pasukan anda dan kekal di pihak anda sehingga ia menghasilkan keputusan.",
    button: "Mohon perintis",
    devLabel: "Untuk pembangun",
    devText: "Tempa pekerja AI seterusnya di the Smithy. Logik anda berjalan dimeterai di dalam the Keep dan kekal milik anda.",
    devNote: "Dokumentasi akan datang",
  },
  deploy: {
    title: "Cara penempatan berfungsi",
    lead: "Kejuruteraan penempatan barisan hadapan (FDE)",
    paragraphs: [
      "Pasukan Kairma ditempatkan di pihak anda, bukannya menghantar perisian lalu pergi. Pasukan itu bertanggungjawab atas hasil, menukar produk menjadi keputusan dan menyalurkan apa yang dipelajari kembali ke platform.",
      "Dalam jangka pendek ia kos kami. Dalam jangka panjang ia R&D yang menjadikan setiap penempatan seterusnya lebih murah. Palantir mempelopori model ini, dan kini ia biasa dalam AI perusahaan.",
      "Data jenama anda kekal di dalam the Keep. Model berjalan di awan, dan hanya tugasan bergerak di antara keduanya.",
    ],
    close: "Tutup",
  },
  pilot: { required: "Masukkan e-mel kerja anda.", invalid: "E-mel itu kelihatan tidak betul. Semak dan cuba lagi.", sent: "Aplikasi e-mel anda telah dibuka dengan butiran ini. Hantar ke pilot@kairma.ai dan kami membalas dalam satu hari bekerja.", again: "Buka e-mel semula" },
  figures: {
    keep: { title: "the Keep", hint: "Tuding untuk mencabut Kunci", aria: "Lukisan the Keep sebagai perbendaharaan Yunani kecil di atas tapak batu, pintu gangsanya tertutup dan kunci kuil di dalam mangganya. Gulungan bermeterai, iaitu tugasan, keluar melalui satu tingkap sisi di sepanjang saluran batu." },
    keepOpen: { title: "Di dalam the Keep", hint: "Pilih satu bahagian", aria: "Lukisan keratan perbendaharaan. Tasik data jenama ialah mata air di dalam bibir perigi batu, enjin SOP ialah pemintal Clotho, penghala model ialah tugu Hermes, dan RPA serta API ialah empat dayang emas yang terikat pada sistem anda. Gulungan keluar melalui satu saluran, dan mata air itu tidak bersambung dengannya." },
    rack: { title: "Rak model", hint: "Tuding pada satu baris", aria: "Lukisan empat tingkat marmar yang memuatkan sepuluh altar, satu bagi setiap model, disusun mengikut kedudukan dengan model teratas di puncak. Altar model yang dipilih tergelincir ke hadapan." },
    cage: { title: "Pekerja AI", hint: "Buka satu peranan", aria: "Lukisan bengkel tempa Hephaestus: empat automaton gangsa di dalam ceruk berlengkung, satu bagi setiap pekerja AI, masing-masing di atas alas beroda dengan lampu status. Automaton peranan yang dibuka bergolek ke hadapan." },
    moats: [
      "Lukisan pemintal Clotho: benang dari galah bulu dililit pada pemintal yang semakin tebal setiap kali dijalankan.",
      "Lukisan acuan batu yang memuatkan empat jongkong tuangan yang sama, sementara takal menurunkan satu bahagian buatan tangan ke petak kelima.",
      "Lukisan lima kaki pelita yang dinyalakan satu demi satu, dengan pengira yang bertambah satu bagi setiap penempatan.",
      "Lukisan pintu perbendaharaan dengan perisai Athena padanya dan kunci kuil di dalam mangga.",
    ],
    problems: [
      "Lukisan tempayan para Danaid yang bocor dari lubang berhampiran kakinya.",
      "Lukisan empat tiang yang sambungannya tidak sepadan, jadi tiada kepala tiang yang muat.",
      "Lukisan kapal trireme yang memerlukan satu lagi barisan pendayung bagi setiap pasaran baharu.",
      "Lukisan sandal bersayap Hermes yang terletak diam di sebelah automaton yang menukul sendiri.",
    ],
    readouts: { sealed: "Dimeterai", tasks: "Tugasan dihalakan: {n}", rawOut: "data mentah keluar 0 B", selected: "Dipilih", rank: "Kedudukan" },
  },
};

export const COPY_V8: Record<Language, CopyV8> = { en, "zh-TW": zhTW, ja, ko, vi, ms };

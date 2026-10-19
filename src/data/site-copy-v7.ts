import type { Language } from "./site-translations";

/* Site copy v7: the v4 (Heron-grammar) home page.
   Rewritten from v6 for scannability: short headings, one idea per line, no
   formula contrasts. Every claim traces to v6 copy or the v3 page; nothing
   new is asserted. Non-English locales follow the v6 glossary (AI 員工 /
   AI従業員 / AI 직원, "the Keep", "the Smithy") and need a native review. */

type Item = { title: string; text: string };

export interface CopyV7 {
  nav: { shift: string; keep: string; moats: string; workforce: string; models: string; build: string; pilot: string; menu: string; close: string; theme: string; language: string };
  hero: { label: string; h1: string; sub: string; cta: string; ctaSecondary: string; ticker: string[] };
  shift: { label: string; statement: string; body: string; stepsLabel: string; steps: Item[] };
  keep: { label: string; stages: [string, string, string]; local: string; cloud: string; tasks: string; hotspotsLabel: string; hotspots: Item[]; closing: string };
  moats: { label: string; h: string; items: Item[] };
  models: { label: string; h: string; body: string; source: string };
  workforce: { label: string; h: string; sub: string; items: { role: string; status: string; text: string }[] };
  doors: {
    operators: { label: string; h: string; body: string; cta: string };
    developers: { label: string; h: string; body: string; cta: string };
  };
  cta: { h: string; body: string; button: string };
  footer: { slogan: string; explore: string; company: string; howItWorks: string; rights: string; frontispiece: string };
}

const en: CopyV7 = {
  nav: { shift: "Shift", keep: "The Keep", moats: "Moats", workforce: "Workforce", models: "Models", build: "Build", pilot: "Request a pilot", menu: "Menu", close: "Close", theme: "Switch theme", language: "Language" },
  hero: {
    label: "Forward-deployed AI employees",
    h1: "Own your AI workforce.",
    sub: "Kairma deploys AI employees into your cross-border operations and runs them to outcomes. Your brand data never leaves your own runtime.",
    cta: "Request a pilot",
    ctaSecondary: "How deployment works",
    ticker: ["Agent OS online", "Data routing", "Workflow sync", "Runtime sealed", "Model-neutral routing"],
  },
  shift: {
    label: "The shift",
    statement: "Cross-border operations still scale like labor. The models got better. Deployment is where outcomes compound.",
    body: "We don't claim to know your business better than you do. We reflect it back, run it and keep the accounts. The last mile stays human, on purpose.",
    stepsLabel: "From model to outcome",
    steps: [
      { title: "Model", text: "Each task goes to the right model, routed live by task and cost." },
      { title: "Workflow", text: "Your operating procedures, encoded in the SOP engine. The logic deepens with every run." },
      { title: "Deployment", text: "A forward-deployed team lands it inside your operation and stays through the last mile." },
      { title: "Outcome", text: "You measure it in outcomes. Each deployment makes the next one cheaper." },
    ],
  },
  keep: {
    label: "The Keep",
    stages: ["Your data stays local.", "Models run in the cloud.", "Only tasks travel between them."],
    local: "Local",
    cloud: "Cloud",
    tasks: "Tasks only",
    hotspotsLabel: "Inside the Keep",
    hotspots: [
      { title: "SOP engine", text: "Your procedures, encoded once and refined on every run." },
      { title: "Model router", text: "Picks the model for each task by capability and cost." },
      { title: "RPA / API", text: "Works through your existing software, by API or through the interface." },
    ],
    closing: "The Keep is your sealed runtime. It ships today as the Key, a sovereign drive you hold. Kairma One is on the roadmap.",
  },
  moats: {
    label: "Why it compounds",
    h: "Four moats, ordered by depth",
    items: [
      { title: "SOP engine and data lake", text: "Encoded logic that deepens with every run." },
      { title: "Productized deployment", text: "About 80% standardized. A small team closes the last mile." },
      { title: "Deployment data", text: "Each deployment feeds the next and makes it cheaper." },
      { title: "Sovereignty", text: "Your data stays in the Keep, under your control." },
    ],
  },
  models: {
    label: "Model-neutral",
    h: "Routed across the cloud",
    body: "Kairma routes work across Claude, GPT, Gemini, DeepSeek, Qwen and Kimi, choosing by task and cost.",
    source: "Live rankings from OpenRouter, refreshed every five minutes.",
  },
  workforce: {
    label: "The workforce",
    h: "Your first AI employees",
    sub: "Each one is deployed and configured inside your operation.",
    items: [
      { role: "KOL BD", status: "Pilot-ready", text: "Runs business development with creators and strategic partners." },
      { role: "Content Ops", status: "FDE configured", text: "Produces and coordinates content across your channels." },
      { role: "Customer Care", status: "In development", text: "Resolves tickets around the clock and escalates by tier when needed." },
      { role: "Compliance", status: "Private runtime", text: "Monitors regulations, keeps an audit trail and checks work against policy." },
    ],
  },
  doors: {
    operators: { label: "For operators", h: "Put a workforce into your operation", body: "We deploy it alongside your team and stay through to the outcome.", cta: "Request a pilot" },
    developers: { label: "For developers", h: "Build the next AI employee in the Smithy", body: "Your logic runs sealed in the Keep and stays yours. We deploy it into live operations.", cta: "Documentation coming soon" },
  },
  cta: { h: "Start with a pilot", body: "Tell us about your operation. We reply within one business day.", button: "Request a pilot" },
  footer: { slogan: "Kairma keeps the accounts.", explore: "Explore", company: "Get started", howItWorks: "How deployment works", rights: "© 2026 Kairma. All rights reserved.", frontispiece: "观 · The Frontispiece" },
};

const zhTW: CopyV7 = {
  nav: { shift: "轉變", keep: "the Keep", moats: "護城河", workforce: "AI 員工", models: "模型", build: "開發", pilot: "申請試點", menu: "選單", close: "關閉", theme: "切換主題", language: "語言" },
  hero: {
    label: "前置部署的 AI 員工",
    h1: "擁有你自己的 AI 員工團隊。",
    sub: "Kairma 把 AI 員工部署進你的跨境營運，並以成果為導向持續運行。品牌數據始終留在你自己的運行環境中。",
    cta: "申請試點",
    ctaSecondary: "部署如何運作",
    ticker: ["Agent OS 上線", "數據路由", "工作流同步", "運行環境封存", "模型中立路由"],
  },
  shift: {
    label: "轉變",
    statement: "跨境營運至今仍像勞動力一樣擴張。模型已經更強。成果的複利，發生在部署。",
    body: "我們不認為自己比你更懂你的業務。我們把它如實映照、替你運行，並把賬目記清楚。最後一公里，刻意留給人。",
    stepsLabel: "從模型到成果",
    steps: [
      { title: "模型", text: "每項任務都依任務類型與成本，即時路由到合適的模型。" },
      { title: "工作流", text: "你的作業流程寫進 SOP 引擎。每運行一次，邏輯就更深一層。" },
      { title: "部署", text: "前置部署團隊把它落地到你的營運中，並陪你走完最後一公里。" },
      { title: "成果", text: "以成果衡量。每一次部署都讓下一次更省成本。" },
    ],
  },
  keep: {
    label: "the Keep",
    stages: ["數據留在本地。", "模型在雲端運行。", "兩者之間只有任務在流轉。"],
    local: "本地",
    cloud: "雲端",
    tasks: "僅任務",
    hotspotsLabel: "the Keep 內部",
    hotspots: [
      { title: "SOP 引擎", text: "你的流程只需編碼一次，每次運行都會再優化。" },
      { title: "模型路由", text: "依能力與成本，為每項任務挑選模型。" },
      { title: "RPA / API", text: "透過 API 或介面操作，直接使用你現有的軟體。" },
    ],
    closing: "the Keep 是你的封存運行環境。目前以 the Key 形式交付，一個由你持有的主權硬碟。Kairma One 已列入路線圖。",
  },
  moats: {
    label: "為何能夠複利",
    h: "四道護城河，依深度排列",
    items: [
      { title: "SOP 引擎與數據湖", text: "編碼後的邏輯，每運行一次就更深一層。" },
      { title: "產品化部署", text: "約 80% 已標準化，由小型團隊完成最後一公里。" },
      { title: "部署數據", text: "每一次部署都回饋下一次，讓它更省成本。" },
      { title: "數據主權", text: "你的數據留在 the Keep，由你掌控。" },
    ],
  },
  models: {
    label: "模型中立",
    h: "在雲端之間路由",
    body: "Kairma 依任務與成本，在 Claude、GPT、Gemini、DeepSeek、Qwen 與 Kimi 之間路由工作。",
    source: "排行數據來自 OpenRouter，每五分鐘更新一次。",
  },
  workforce: {
    label: "AI 員工",
    h: "你的第一批 AI 員工",
    sub: "每一位都在你的營運中部署並完成配置。",
    items: [
      { role: "KOL BD", status: "試點就緒", text: "與創作者及策略夥伴推進商務拓展。" },
      { role: "內容營運", status: "已配置 FDE", text: "在各渠道產出並統籌內容。" },
      { role: "客戶服務", status: "開發中", text: "全天候處理工單，需要時按層級升級。" },
      { role: "合規審查", status: "私有運行環境", text: "監測法規、保留審計軌跡，並依政策檢查工作。" },
    ],
  },
  doors: {
    operators: { label: "給營運者", h: "把一支 AI 員工團隊部署進你的營運", body: "我們與你的團隊一起部署，並陪伴到成果落地。", cta: "申請試點" },
    developers: { label: "給開發者", h: "在 the Smithy 打造下一位 AI 員工", body: "你的邏輯在 the Keep 中封存運行，始終屬於你。我們把它部署進真實營運。", cta: "文件即將推出" },
  },
  cta: { h: "從試點開始", body: "告訴我們你的營運情況。我們會在一個工作日內回覆。", button: "申請試點" },
  footer: { slogan: "Kairma 把賬目記清楚。", explore: "瀏覽", company: "開始", howItWorks: "部署如何運作", rights: "© 2026 Kairma。保留所有權利。", frontispiece: "观 · 卷首" },
};

const ja: CopyV7 = {
  nav: { shift: "転換", keep: "the Keep", moats: "堀", workforce: "AI従業員", models: "モデル", build: "開発", pilot: "パイロットを申し込む", menu: "メニュー", close: "閉じる", theme: "テーマ切替", language: "言語" },
  hero: {
    label: "前方配備のAI従業員",
    h1: "自分たちのAI従業員チームを持つ。",
    sub: "KairmaはAI従業員をあなたのクロスボーダー事業に配備し、成果に向けて運用します。ブランドデータは、あなた自身の実行環境から出ることはありません。",
    cta: "パイロットを申し込む",
    ctaSecondary: "配備の仕組み",
    ticker: ["Agent OS 稼働中", "データルーティング", "ワークフロー同期", "実行環境は封印済み", "モデル中立のルーティング"],
  },
  shift: {
    label: "転換",
    statement: "越境オペレーションは、いまだ労働のようにスケールする。モデルは良くなった。成果が複利で積み上がるのは、配備の段階だ。",
    body: "あなたの事業を、あなた以上に理解しているとは考えていません。事業をそのまま映し出し、運用し、帳簿をつけます。最後の一歩は、あえて人に残しています。",
    stepsLabel: "モデルから成果まで",
    steps: [
      { title: "モデル", text: "タスクとコストに応じて、各タスクを最適なモデルへリアルタイムに振り分けます。" },
      { title: "ワークフロー", text: "業務手順をSOPエンジンにエンコード。実行するたびにロジックが深まります。" },
      { title: "配備", text: "前方配備チームが現場に導入し、最後の一歩まで伴走します。" },
      { title: "成果", text: "成果で測ります。配備を重ねるほど、次の配備は安くなります。" },
    ],
  },
  keep: {
    label: "the Keep",
    stages: ["データはローカルに。", "モデルはクラウドで動く。", "その間を流れるのはタスクだけ。"],
    local: "ローカル",
    cloud: "クラウド",
    tasks: "タスクのみ",
    hotspotsLabel: "the Keep の内部",
    hotspots: [
      { title: "SOPエンジン", text: "手順は一度エンコードすれば、実行のたびに磨かれます。" },
      { title: "モデルルーター", text: "能力とコストで、タスクごとにモデルを選びます。" },
      { title: "RPA / API", text: "APIまたは画面操作で、既存のソフトウェアをそのまま使います。" },
    ],
    closing: "the Keep は封印された実行環境です。現在は、あなたが保持する主権ドライブ the Key として提供しています。Kairma One はロードマップにあります。",
  },
  moats: {
    label: "なぜ複利になるのか",
    h: "深さ順に並ぶ、4つの堀",
    items: [
      { title: "SOPエンジンとデータレイク", text: "エンコードされたロジックは、実行のたびに深まります。" },
      { title: "製品化された配備", text: "約80%を標準化。小さなチームが最後の一歩を担います。" },
      { title: "配備データ", text: "配備のたびに次へ還元され、次の配備がより安くなります。" },
      { title: "データ主権", text: "データは the Keep に残り、あなたの管理下にあります。" },
    ],
  },
  models: {
    label: "モデル中立",
    h: "クラウドをまたいでルーティング",
    body: "Kairmaはタスクとコストに応じて、Claude、GPT、Gemini、DeepSeek、Qwen、Kimiの間で仕事を振り分けます。",
    source: "ランキングはOpenRouterから取得し、5分ごとに更新しています。",
  },
  workforce: {
    label: "AI従業員",
    h: "最初のAI従業員たち",
    sub: "一人ひとりを、あなたの現場に配備し、設定します。",
    items: [
      { role: "KOL BD", status: "パイロット準備完了", text: "クリエイターや戦略パートナーとの事業開発を進めます。" },
      { role: "コンテンツ運用", status: "FDE構成済み", text: "各チャネルのコンテンツを制作し、取りまとめます。" },
      { role: "カスタマーケア", status: "開発中", text: "チケットを24時間対応し、必要に応じて段階的にエスカレーションします。" },
      { role: "コンプライアンス", status: "プライベート実行環境", text: "規制を監視し、監査証跡を残し、ポリシーに照らして作業を確認します。" },
    ],
  },
  doors: {
    operators: { label: "オペレーターへ", h: "あなたの現場にAI従業員チームを", body: "チームと一緒に配備し、成果が出るまで伴走します。", cta: "パイロットを申し込む" },
    developers: { label: "開発者へ", h: "次のAI従業員を the Smithy で", body: "ロジックは the Keep の中で封印されたまま動き、あなたのものであり続けます。それを実運用へ配備します。", cta: "ドキュメントは近日公開" },
  },
  cta: { h: "まずはパイロットから", body: "事業について教えてください。1営業日以内にご返信します。", button: "パイロットを申し込む" },
  footer: { slogan: "Kairmaは帳簿をつける。", explore: "サイト", company: "はじめる", howItWorks: "配備の仕組み", rights: "© 2026 Kairma. All rights reserved.", frontispiece: "观 · 口絵" },
};

const ko: CopyV7 = {
  nav: { shift: "전환", keep: "the Keep", moats: "해자", workforce: "AI 직원", models: "모델", build: "개발", pilot: "파일럿 신청", menu: "메뉴", close: "닫기", theme: "테마 전환", language: "언어" },
  hero: {
    label: "전진 배치된 AI 직원",
    h1: "당신만의 AI 인력을 소유하세요.",
    sub: "Kairma는 AI 직원을 당신의 크로스보더 운영에 배치하고 성과까지 운영합니다. 브랜드 데이터는 당신의 실행 환경을 벗어나지 않습니다.",
    cta: "파일럿 신청",
    ctaSecondary: "배치 방식 보기",
    ticker: ["Agent OS 온라인", "데이터 라우팅", "워크플로 동기화", "실행 환경 봉인", "모델 중립 라우팅"],
  },
  shift: {
    label: "전환",
    statement: "국경을 넘는 운영은 여전히 노동처럼 확장됩니다. 모델은 좋아졌습니다. 성과가 복리로 쌓이는 곳은 배치입니다.",
    body: "우리는 당신의 사업을 당신보다 더 잘 안다고 말하지 않습니다. 사업을 그대로 비추고, 운영하고, 장부를 정리합니다. 마지막 한 걸음은 의도적으로 사람에게 남겨 둡니다.",
    stepsLabel: "모델에서 성과까지",
    steps: [
      { title: "모델", text: "작업 유형과 비용에 따라 각 작업을 알맞은 모델로 실시간 라우팅합니다." },
      { title: "워크플로", text: "운영 절차를 SOP 엔진에 담습니다. 실행할 때마다 로직이 깊어집니다." },
      { title: "배치", text: "전진 배치 팀이 현장에 도입하고 마지막 한 걸음까지 함께합니다." },
      { title: "성과", text: "성과로 측정합니다. 배치를 거듭할수록 다음 배치 비용이 낮아집니다." },
    ],
  },
  keep: {
    label: "the Keep",
    stages: ["데이터는 로컬에.", "모델은 클라우드에서.", "그 사이를 오가는 것은 작업뿐."],
    local: "로컬",
    cloud: "클라우드",
    tasks: "작업만",
    hotspotsLabel: "the Keep 내부",
    hotspots: [
      { title: "SOP 엔진", text: "절차는 한 번만 담고, 실행할 때마다 다듬습니다." },
      { title: "모델 라우터", text: "역량과 비용을 기준으로 작업마다 모델을 고릅니다." },
      { title: "RPA / API", text: "API나 화면 조작으로 기존 소프트웨어를 그대로 활용합니다." },
    ],
    closing: "the Keep은 봉인된 실행 환경입니다. 현재는 당신이 보유하는 주권 드라이브, the Key로 제공됩니다. Kairma One은 로드맵에 있습니다.",
  },
  moats: {
    label: "복리가 되는 이유",
    h: "깊이 순으로 놓인 네 개의 해자",
    items: [
      { title: "SOP 엔진과 데이터 레이크", text: "담아 둔 로직이 실행할 때마다 깊어집니다." },
      { title: "제품화된 배치", text: "약 80%를 표준화했습니다. 작은 팀이 마지막 한 걸음을 맡습니다." },
      { title: "배치 데이터", text: "배치할 때마다 다음 배치에 반영되어 비용이 낮아집니다." },
      { title: "데이터 주권", text: "데이터는 the Keep에 남아 당신이 통제합니다." },
    ],
  },
  models: {
    label: "모델 중립",
    h: "클라우드를 가로지르는 라우팅",
    body: "Kairma는 작업과 비용에 따라 Claude, GPT, Gemini, DeepSeek, Qwen, Kimi 사이에서 업무를 라우팅합니다.",
    source: "순위는 OpenRouter에서 가져오며 5분마다 갱신됩니다.",
  },
  workforce: {
    label: "AI 직원",
    h: "당신의 첫 AI 직원들",
    sub: "모두 당신의 운영 안에 배치되고 설정됩니다.",
    items: [
      { role: "KOL BD", status: "파일럿 준비 완료", text: "크리에이터 및 전략 파트너와의 사업 개발을 진행합니다." },
      { role: "콘텐츠 운영", status: "FDE 구성 완료", text: "채널 전반의 콘텐츠를 제작하고 조율합니다." },
      { role: "고객 지원", status: "개발 중", text: "티켓을 24시간 처리하고 필요하면 단계별로 에스컬레이션합니다." },
      { role: "컴플라이언스", status: "프라이빗 실행 환경", text: "규제를 모니터링하고 감사 기록을 남기며 정책에 맞춰 작업을 점검합니다." },
    ],
  },
  doors: {
    operators: { label: "운영자를 위해", h: "당신의 운영에 AI 인력을 배치하세요", body: "당신의 팀과 함께 배치하고 성과가 나올 때까지 함께합니다.", cta: "파일럿 신청" },
    developers: { label: "개발자를 위해", h: "다음 AI 직원을 the Smithy에서 만드세요", body: "로직은 the Keep 안에서 봉인된 채 실행되며 계속 당신의 것입니다. 우리는 그것을 실제 운영에 배치합니다.", cta: "문서 곧 공개" },
  },
  cta: { h: "파일럿으로 시작하세요", body: "운영에 대해 알려 주세요. 영업일 기준 하루 안에 답변드립니다.", button: "파일럿 신청" },
  footer: { slogan: "Kairma가 장부를 정리합니다.", explore: "둘러보기", company: "시작하기", howItWorks: "배치 방식 보기", rights: "© 2026 Kairma. All rights reserved.", frontispiece: "观 · 권두" },
};

const vi: CopyV7 = {
  nav: { shift: "Chuyển đổi", keep: "the Keep", moats: "Hào lũy", workforce: "Nhân viên AI", models: "Mô hình", build: "Xây dựng", pilot: "Yêu cầu chạy thử", menu: "Menu", close: "Đóng", theme: "Đổi giao diện", language: "Ngôn ngữ" },
  hero: {
    label: "Nhân viên AI triển khai tại chỗ",
    h1: "Sở hữu đội ngũ AI của riêng bạn.",
    sub: "Kairma triển khai nhân viên AI vào hoạt động xuyên biên giới của bạn và vận hành chúng hướng tới kết quả. Dữ liệu thương hiệu không bao giờ rời khỏi môi trường vận hành của bạn.",
    cta: "Yêu cầu chạy thử",
    ctaSecondary: "Cách triển khai",
    ticker: ["Agent OS trực tuyến", "Định tuyến dữ liệu", "Đồng bộ quy trình", "Môi trường niêm phong", "Định tuyến trung lập mô hình"],
  },
  shift: {
    label: "Sự chuyển đổi",
    statement: "Vận hành xuyên biên giới vẫn mở rộng như lao động. Mô hình đã tốt hơn. Kết quả cộng dồn ở khâu triển khai.",
    body: "Chúng tôi không cho rằng mình hiểu doanh nghiệp của bạn hơn bạn. Chúng tôi phản chiếu nó, vận hành nó và ghi chép sổ sách rõ ràng. Chặng cuối được cố ý để con người đảm nhận.",
    stepsLabel: "Từ mô hình đến kết quả",
    steps: [
      { title: "Mô hình", text: "Mỗi tác vụ được định tuyến theo thời gian thực tới mô hình phù hợp, theo loại việc và chi phí." },
      { title: "Quy trình", text: "Quy trình vận hành của bạn được mã hóa trong SOP engine. Logic sâu thêm sau mỗi lần chạy." },
      { title: "Triển khai", text: "Một đội triển khai tại chỗ đưa nó vào vận hành và đi cùng bạn tới chặng cuối." },
      { title: "Kết quả", text: "Đo bằng kết quả. Mỗi lần triển khai giúp lần sau rẻ hơn." },
    ],
  },
  keep: {
    label: "the Keep",
    stages: ["Dữ liệu ở lại tại chỗ.", "Mô hình chạy trên cloud.", "Giữa hai bên chỉ có tác vụ di chuyển."],
    local: "Tại chỗ",
    cloud: "Cloud",
    tasks: "Chỉ tác vụ",
    hotspotsLabel: "Bên trong the Keep",
    hotspots: [
      { title: "SOP engine", text: "Quy trình được mã hóa một lần và tinh chỉnh sau mỗi lần chạy." },
      { title: "Bộ định tuyến mô hình", text: "Chọn mô hình cho từng tác vụ theo năng lực và chi phí." },
      { title: "RPA / API", text: "Làm việc qua phần mềm sẵn có của bạn, bằng API hoặc qua giao diện." },
    ],
    closing: "the Keep là môi trường vận hành niêm phong của bạn. Hiện được giao dưới dạng the Key, một ổ đĩa chủ quyền do bạn nắm giữ. Kairma One nằm trong lộ trình.",
  },
  moats: {
    label: "Vì sao lợi thế cộng dồn",
    h: "Bốn hào lũy, xếp theo độ sâu",
    items: [
      { title: "SOP engine và data lake", text: "Logic được mã hóa, sâu thêm sau mỗi lần chạy." },
      { title: "Triển khai đã chuẩn hóa", text: "Khoảng 80% được chuẩn hóa. Một đội nhỏ hoàn thành chặng cuối." },
      { title: "Dữ liệu triển khai", text: "Mỗi lần triển khai bồi đắp cho lần sau và giúp nó rẻ hơn." },
      { title: "Chủ quyền dữ liệu", text: "Dữ liệu của bạn ở lại trong the Keep, dưới quyền kiểm soát của bạn." },
    ],
  },
  models: {
    label: "Trung lập mô hình",
    h: "Định tuyến khắp cloud",
    body: "Kairma định tuyến công việc giữa Claude, GPT, Gemini, DeepSeek, Qwen và Kimi, lựa chọn theo loại việc và chi phí.",
    source: "Bảng xếp hạng lấy từ OpenRouter, cập nhật mỗi năm phút.",
  },
  workforce: {
    label: "Nhân viên AI",
    h: "Những nhân viên AI đầu tiên của bạn",
    sub: "Mỗi người đều được triển khai và cấu hình ngay trong vận hành của bạn.",
    items: [
      { role: "KOL BD", status: "Sẵn sàng chạy thử", text: "Phát triển kinh doanh cùng nhà sáng tạo và đối tác chiến lược." },
      { role: "Vận hành nội dung", status: "Đã cấu hình FDE", text: "Sản xuất và điều phối nội dung trên các kênh của bạn." },
      { role: "Chăm sóc khách hàng", status: "Đang phát triển", text: "Xử lý yêu cầu suốt ngày đêm và chuyển cấp khi cần." },
      { role: "Tuân thủ", status: "Môi trường riêng", text: "Theo dõi quy định, lưu vết kiểm toán và đối chiếu công việc với chính sách." },
    ],
  },
  doors: {
    operators: { label: "Dành cho người vận hành", h: "Đưa đội ngũ AI vào vận hành của bạn", body: "Chúng tôi triển khai cùng đội của bạn và đồng hành tới khi có kết quả.", cta: "Yêu cầu chạy thử" },
    developers: { label: "Dành cho nhà phát triển", h: "Xây dựng nhân viên AI tiếp theo trong the Smithy", body: "Logic của bạn chạy niêm phong trong the Keep và vẫn thuộc về bạn. Chúng tôi triển khai nó vào vận hành thực.", cta: "Tài liệu sắp ra mắt" },
  },
  cta: { h: "Bắt đầu với một đợt chạy thử", body: "Hãy kể cho chúng tôi về hoạt động của bạn. Chúng tôi phản hồi trong vòng một ngày làm việc.", button: "Yêu cầu chạy thử" },
  footer: { slogan: "Kairma ghi chép sổ sách rõ ràng.", explore: "Khám phá", company: "Bắt đầu", howItWorks: "Cách triển khai", rights: "© 2026 Kairma. Bảo lưu mọi quyền.", frontispiece: "观 · Trang đầu" },
};

const ms: CopyV7 = {
  nav: { shift: "Peralihan", keep: "the Keep", moats: "Benteng", workforce: "Pekerja AI", models: "Model", build: "Bina", pilot: "Mohon program perintis", menu: "Menu", close: "Tutup", theme: "Tukar tema", language: "Bahasa" },
  hero: {
    label: "Pekerja AI barisan hadapan",
    h1: "Miliki tenaga kerja AI anda sendiri.",
    sub: "Kairma menggerakkan pekerja AI ke dalam operasi rentas sempadan anda dan menjalankannya hingga mencapai hasil. Data jenama anda tidak pernah keluar dari persekitaran anda sendiri.",
    cta: "Mohon program perintis",
    ctaSecondary: "Cara penggerakan",
    ticker: ["Agent OS dalam talian", "Penghalaan data", "Penyegerakan aliran kerja", "Persekitaran termeterai", "Penghalaan neutral model"],
  },
  shift: {
    label: "Peralihan",
    statement: "Operasi rentas sempadan masih berskala seperti buruh. Model sudah lebih baik. Hasil bertokok di peringkat penggerakan.",
    body: "Kami tidak mendakwa lebih memahami perniagaan anda berbanding anda. Kami mencerminkannya, menjalankannya dan menyimpan kira-kira dengan teratur. Langkah terakhir sengaja diserahkan kepada manusia.",
    stepsLabel: "Dari model ke hasil",
    steps: [
      { title: "Model", text: "Setiap tugasan dihalakan secara langsung ke model yang sesuai, mengikut jenis tugasan dan kos." },
      { title: "Aliran kerja", text: "Prosedur operasi anda dikodkan dalam enjin SOP. Logiknya semakin mendalam setiap kali dijalankan." },
      { title: "Penggerakan", text: "Pasukan barisan hadapan memasang sistem dalam operasi anda dan kekal hingga langkah terakhir." },
      { title: "Hasil", text: "Diukur melalui hasil. Setiap penggerakan menjadikan penggerakan seterusnya lebih murah." },
    ],
  },
  keep: {
    label: "the Keep",
    stages: ["Data kekal setempat.", "Model berjalan di cloud.", "Hanya tugasan bergerak di antaranya."],
    local: "Setempat",
    cloud: "Cloud",
    tasks: "Tugasan sahaja",
    hotspotsLabel: "Di dalam the Keep",
    hotspots: [
      { title: "Enjin SOP", text: "Prosedur anda dikodkan sekali dan diperhalusi setiap kali dijalankan." },
      { title: "Penghala model", text: "Memilih model bagi setiap tugasan berdasarkan keupayaan dan kos." },
      { title: "RPA / API", text: "Bekerja melalui perisian sedia ada anda, sama ada melalui API atau antara muka." },
    ],
    closing: "the Keep ialah persekitaran termeterai anda. Kini ia dihantar sebagai the Key, pemacu berdaulat yang anda pegang. Kairma One dalam pelan hala tuju.",
  },
  moats: {
    label: "Mengapa ia bertokok",
    h: "Empat benteng, mengikut kedalaman",
    items: [
      { title: "Enjin SOP dan data lake", text: "Logik yang dikodkan semakin mendalam setiap kali dijalankan." },
      { title: "Penggerakan berproduk", text: "Kira-kira 80% diseragamkan. Pasukan kecil menyelesaikan langkah terakhir." },
      { title: "Data penggerakan", text: "Setiap penggerakan menyumbang kepada yang seterusnya dan menjadikannya lebih murah." },
      { title: "Kedaulatan data", text: "Data anda kekal dalam the Keep, di bawah kawalan anda." },
    ],
  },
  models: {
    label: "Neutral model",
    h: "Dihalakan merentas cloud",
    body: "Kairma menghalakan kerja merentas Claude, GPT, Gemini, DeepSeek, Qwen dan Kimi, dipilih mengikut tugasan dan kos.",
    source: "Kedudukan langsung daripada OpenRouter, dikemas kini setiap lima minit.",
  },
  workforce: {
    label: "Pekerja AI",
    h: "Pekerja AI pertama anda",
    sub: "Setiap satu digerakkan dan dikonfigurasi dalam operasi anda.",
    items: [
      { role: "KOL BD", status: "Sedia perintis", text: "Menjalankan pembangunan perniagaan bersama pencipta kandungan dan rakan strategik." },
      { role: "Operasi Kandungan", status: "FDE dikonfigurasi", text: "Menghasilkan dan menyelaras kandungan merentas saluran anda." },
      { role: "Khidmat Pelanggan", status: "Dalam pembangunan", text: "Menyelesaikan tiket sepanjang masa dan meningkatkan mengikut peringkat apabila perlu." },
      { role: "Pematuhan", status: "Persekitaran peribadi", text: "Memantau peraturan, menyimpan jejak audit dan menyemak kerja berdasarkan polisi." },
    ],
  },
  doors: {
    operators: { label: "Untuk operator", h: "Gerakkan tenaga kerja AI ke dalam operasi anda", body: "Kami menggerakkannya bersama pasukan anda dan kekal hingga hasil tercapai.", cta: "Mohon program perintis" },
    developers: { label: "Untuk pembangun", h: "Bina pekerja AI seterusnya dalam the Smithy", body: "Logik anda berjalan termeterai dalam the Keep dan kekal milik anda. Kami menggerakkannya ke dalam operasi sebenar.", cta: "Dokumentasi akan datang" },
  },
  cta: { h: "Mulakan dengan program perintis", body: "Ceritakan tentang operasi anda. Kami membalas dalam satu hari bekerja.", button: "Mohon program perintis" },
  footer: { slogan: "Kairma menyimpan kira-kira dengan teratur.", explore: "Terokai", company: "Mula", howItWorks: "Cara penggerakan", rights: "© 2026 Kairma. Hak cipta terpelihara.", frontispiece: "观 · Halaman hadapan" },
};

export const COPY_V7: Record<Language, CopyV7> = { en, "zh-TW": zhTW, ja, ko, vi, ms };

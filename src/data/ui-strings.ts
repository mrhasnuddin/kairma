import type { Language } from "./site-translations";

/* UI micro-copy shared by the v3 and v4 shells (leaderboard, statuses). */
export const UI_STRINGS: Record<string, Record<string, string>> = {
  // Hero section
  "system_online":        { en: "System: Online",        "zh-TW": "系統狀態: 上線",     vi: "Hệ thống: Trực tuyến",           ms: "Sistem: Dalam Talian", ja: "システム: オンライン", ko: "시스템: 온라인" },
  "the_shift":            { en: "The Shift",             "zh-TW": "轉移",               vi: "Sự chuyển đổi",                  ms: "Anjakan", ja: "転換", ko: "전환" },
  // Digital Employees box
  "digital_emp_heading":  { en: "Your first AI employees, deployed – not downloaded.", "zh-TW": "您的第一批 AI 員工，已部署，無需下載。", vi: "Nhân viên AI đầu tiên — được triển khai, không phải tải xuống.", ms: "Pekerja AI pertama anda — ditempatkan, bukan dimuat turun.", ja: "あなたの最初のAI従業員——ダウンロードではなく、配備。", ko: "당신의 첫 AI 직원 — 다운로드가 아니라 배치." },
  "pilot_ready":          { en: "Pilot-ready",           "zh-TW": "試點就緒",           vi: "Sẵn sàng thử nghiệm",            ms: "Sedia perintis", ja: "パイロット可", ko: "파일럿 준비" },
  "fde_configured":       { en: "FDE configured",        "zh-TW": "已配置 FDE",         vi: "Đã cấu hình FDE",                ms: "FDE dikonfigurasi", ja: "FDE構成済み", ko: "FDE 구성됨" },
  "customer_care":        { en: "Customer Care",         "zh-TW": "客戶服務",           vi: "Chăm sóc khách hàng",            ms: "Khidmat Pelanggan", ja: "カスタマーケア", ko: "고객 지원" },
  "in_development":       { en: "In development",        "zh-TW": "開發中",             vi: "Đang phát triển",                ms: "Dalam pembangunan", ja: "開発中", ko: "개발 중" },
  "compliance":           { en: "Compliance",            "zh-TW": "合規審查",           vi: "Tuân thủ",                       ms: "Pematuhan", ja: "コンプライアンス", ko: "컴플라이언스" },
  "private_runtime":      { en: "Private runtime",       "zh-TW": "私有運行環境",       vi: "Môi trường riêng tư",            ms: "Persekitaran peribadi", ja: "プライベートランタイム", ko: "프라이빗 런타임" },
  // CTA boxes
  "for_developers":       { en: "For Developers",        "zh-TW": "面向開發者",         vi: "Dành cho nhà phát triển",         ms: "Untuk Pembangun", ja: "開発者へ", ko: "개발자를 위해" },
  "for_operators":        { en: "For Operators",         "zh-TW": "面向營運方",         vi: "Dành cho nhà vận hành",           ms: "Untuk Operator", ja: "オペレーターへ", ko: "운영자를 위해" },
  "view_docs":            { en: "View Docs",             "zh-TW": "查看文件",           vi: "Xem tài liệu",                   ms: "Lihat Dokumen", ja: "ドキュメントを見る", ko: "문서 보기" },
  // Quote / pipeline
  "quote":                { en: "Models got better.\nBut deployment velocity is\nwhere outcomes compound.", "zh-TW": "模型變得更好了。\n但部署速度才是\n業務成果產生複利的地方。", vi: "Mô hình tốt hơn.\nNhưng tốc độ triển khai\nmới là nơi kết quả cộng hưởng.", ms: "Model semakin baik.\nTetapi halaju penempatan\nadalah di mana hasil berganda.", ja: "モデルは良くなった。\n成果が複利で積み上がるのは、\n配備の段階だ。", ko: "모델은 좋아졌습니다.\n성과가 복리로 쌓이는 곳은\n배치입니다." },
  // OpenRouter / Model box
  "syncing":              { en: "SYNCING...",            "zh-TW": "同步中...",           vi: "ĐANG ĐỒNG BỘ...",                ms: "MENYEGERAK...", ja: "同期中...", ko: "동기화 중..." },
  "openrouter_live":      { en: "OPENROUTER SYNC: LIVE", "zh-TW": "OPENROUTER 同步: 運行中", vi: "OPENROUTER ĐỒNG BỘ: TRỰC TIẾP", ms: "OPENROUTER SEGERAK: LANGSUNG", ja: "OPENROUTER 同期: 稼働中", ko: "OPENROUTER 동기화: 켜짐" },
  "fetching_rankings":    { en: "FETCHING LATEST RANKINGS...", "zh-TW": "正在獲取最新排名...", vi: "ĐANG TẢI BẢNG XẾP HẠNG...",   ms: "MEMUATKAN KEDUDUKAN TERKINI...", ja: "最新ランキングを取得中...", ko: "최신 순위를 가져오는 중..." },
  "intel":                { en: "Intel",                 "zh-TW": "智能",               vi: "Trí tuệ",                        ms: "Kepintaran", ja: "知能", ko: "지능" },
  "coding":               { en: "Coding",                "zh-TW": "代碼",               vi: "Lập trình",                      ms: "Pengekodan", ja: "コーディング", ko: "코딩" },
  "agentic":              { en: "Agentic",               "zh-TW": "智能體",             vi: "Tự hành",                        ms: "Agentik", ja: "エージェント", ko: "에이전틱" },
  "kol_bd":               { en: "Creator BD",            "zh-TW": "KOL BD",             vi: "KOL BD",                         ms: "KOL BD", ja: "KOL BD", ko: "KOL BD" },
  "content_ops":          { en: "Content Ops",           "zh-TW": "內容營運",           vi: "Vận hành nội dung",              ms: "Operasi Kandungan", ja: "コンテンツ運用", ko: "콘텐츠 운영" },
  "benchmarks_note":      { en: "* BENCHMARKS NORMALIZED BY ARTIFICIAL ANALYSIS LEADERBOARDS.", "zh-TW": "* 基準數據由 ARTIFICIAL ANALYSIS 排行榜標準化。", vi: "* ĐIỂM CHUẨN ĐƯỢC CHUẨN HÓA BỞI BẢNG XẾP HẠNG ARTIFICIAL ANALYSIS.", ms: "* PENANDA ARAS DINORMALISASI OLEH PAPAN PENDAHULU ARTIFICIAL ANALYSIS.", ja: "* ベンチマークは ARTIFICIAL ANALYSIS のリーダーボードにより正規化されています。", ko: "* 벤치마크는 ARTIFICIAL ANALYSIS 리더보드에 의해 정규화되었습니다." },
  "top_daily_runtimes":   { en: "TOP DAILY RUNTIMES",    "zh-TW": "每日最熱運行環境",   vi: "MÔI TRƯỜNG CHẠY HÀNG ĐẦU HÀNG NGÀY", ms: "PERSEKITARAN HARIAN TERATAS", ja: "毎日の人気ランタイム", ko: "일일 최고 런타임" },
  // Model Leaderboard / Neural Pipeline HUD
  "model_leaderboard":    { en: "ROUTED ACROSS THE CLOUD", "zh-TW": "模型排行榜",         vi: "BẢNG XẾP HẠNG MÔ HÌNH",         ms: "PAPAN PENDAHULU MODEL", ja: "モデルリーダーボード", ko: "모델 리더보드" },
  "data_groups":          { en: "DATA GROUPS",           "zh-TW": "數據群組",           vi: "NHÓM DỮ LIỆU",                  ms: "KUMPULAN DATA", ja: "データグループ", ko: "데이터 그룹" },
  "select_group_hint":    { en: "select a data group to parse", "zh-TW": "選擇要解析的數據群組", vi: "chọn nhóm dữ liệu để phân tích", ms: "pilih kumpulan data untuk dihurai", ja: "解析するデータグループを選択", ko: "분석할 데이터 그룹을 선택" },
  "output_nodes":         { en: "OUTPUT NODES",          "zh-TW": "輸出節點",           vi: "NÚT ĐẦU RA",                    ms: "NOD OUTPUT", ja: "出力ノード", ko: "출력 노드" },
  "generated_insights":   { en: "generated insights",    "zh-TW": "生成的洞察",         vi: "thông tin được tạo",             ms: "cerapan dijana", ja: "生成されたインサイト", ko: "생성된 인사이트" },
  "active_group":         { en: "ACTIVE GROUP",          "zh-TW": "當前群組",           vi: "NHÓM ĐANG CHỌN",                ms: "KUMPULAN AKTIF", ja: "アクティブグループ", ko: "활성 그룹" },
  "parsing_data":         { en: "PARSING DATA...",       "zh-TW": "解析數據中...",      vi: "ĐANG PHÂN TÍCH...",             ms: "MENGHURAI DATA...", ja: "データ解析中...", ko: "데이터 분석 중..." },
  "feed_stable":          { en: "FEED STABLE",           "zh-TW": "數據流穩定",         vi: "NGUỒN ỔN ĐỊNH",                 ms: "SUAPAN STABIL", ja: "フィード安定", ko: "피드 안정" },
  "data_source":          { en: "DATA SOURCE",           "zh-TW": "數據來源",           vi: "NGUỒN DỮ LIỆU",                 ms: "SUMBER DATA", ja: "データソース", ko: "데이터 소스" },
  "model_core":           { en: "MODEL CORE",            "zh-TW": "模型核心",           vi: "LÕI MÔ HÌNH",                   ms: "TERAS MODEL", ja: "モデルコア", ko: "모델 코어" },
  "tokens_used":          { en: "TOKENS USED",           "zh-TW": "已用 TOKEN",         vi: "TOKEN ĐÃ DÙNG",                 ms: "TOKEN DIGUNA", ja: "使用トークン", ko: "사용 토큰" },
  "context_limit":        { en: "CONTEXT LIMIT",         "zh-TW": "上下文上限",         vi: "GIỚI HẠN NGỮ CẢNH",             ms: "HAD KONTEKS", ja: "コンテキスト上限", ko: "컨텍스트 한도" },
  "query_cost":           { en: "QUERY COST",            "zh-TW": "查詢成本",           vi: "CHI PHÍ TRUY VẤN",              ms: "KOS PERTANYAAN", ja: "クエリコスト", ko: "쿼리 비용" },
  "search_db":            { en: "Search database...",    "zh-TW": "搜尋資料庫...",      vi: "Tìm trong cơ sở dữ liệu...",     ms: "Cari pangkalan data...", ja: "データベースを検索...", ko: "데이터베이스 검색..." },
  "search_label":         { en: "SEARCH",                "zh-TW": "搜尋",               vi: "TÌM KIẾM",                      ms: "CARIAN", ja: "検索", ko: "검색" },
  "select_node_hint":     { en: "SELECT A GENERATED OUTPUT NODE FOR TELEMETRY INSIGHTS...", "zh-TW": "選擇一個輸出節點以查看遙測洞察...", vi: "CHỌN MỘT NÚT ĐẦU RA ĐỂ XEM THÔNG TIN TELEMETRY...", ms: "PILIH NOD OUTPUT UNTUK CERAPAN TELEMETRI...", ja: "出力ノードを選択してテレメトリを表示...", ko: "출력 노드를 선택하면 텔레메트리 인사이트가 표시됩니다..." },
  "no_telemetry":         { en: "[0x404] NO TELEMETRY FOUND", "zh-TW": "[0x404] 未找到遙測數據", vi: "[0x404] KHÔNG TÌM THẤY DỮ LIỆU", ms: "[0x404] TIADA TELEMETRI DITEMUI", ja: "[0x404] テレメトリが見つかりません", ko: "[0x404] 텔레메트리를 찾을 수 없음" },
  "no_match":             { en: "No models matched",     "zh-TW": "沒有符合的模型：",   vi: "Không có mô hình khớp",          ms: "Tiada model sepadan", ja: "一致するモデルなし", ko: "일치하는 모델 없음" },
  "grp_intel":            { en: "INTEL",                 "zh-TW": "智能",               vi: "TRÍ TUỆ",                       ms: "INTEL", ja: "知能", ko: "지능" },
  "grp_coding":           { en: "CODING",                "zh-TW": "代碼",               vi: "LẬP TRÌNH",                     ms: "KOD", ja: "コード", ko: "코딩" },
  "grp_agentic":          { en: "AGENTIC",               "zh-TW": "智能體",             vi: "TỰ HÀNH",                       ms: "AGENTIK", ja: "エージェント", ko: "에이전트" },
  "grp_runtimes":         { en: "RUNTIMES",              "zh-TW": "運行時",             vi: "VẬN HÀNH",                      ms: "MASA JALAN", ja: "ランタイム", ko: "런타임" },
  "grp_cost":             { en: "COST",                  "zh-TW": "成本",               vi: "CHI PHÍ",                       ms: "KOS", ja: "コスト", ko: "비용" },
  "grp_context":          { en: "CONTEXT",               "zh-TW": "上下文",             vi: "NGỮ CẢNH",                      ms: "KONTEKS", ja: "文脈", ko: "컨텍스트" },
  // Model detail modal
  "runtime_module":       { en: "Runtime Module",        "zh-TW": "運行時模組",         vi: "Mô-đun vận hành",                ms: "Modul Masa Jalan", ja: "ランタイムモジュール", ko: "런타임 모듈" },
  "specs_metrics":        { en: "Specs & Metrics",       "zh-TW": "規格與指標",         vi: "Thông số & Chỉ số",              ms: "Spesifikasi & Metrik", ja: "仕様と指標", ko: "사양 및 지표" },
  "context_window":       { en: "CONTEXT WINDOW",        "zh-TW": "上下文窗口",         vi: "CỬA SỔ NGỮ CẢNH",               ms: "TETINGKAP KONTEKS", ja: "コンテキストウィンドウ", ko: "컨텍스트 윈도우" },
  "max_completion":       { en: "MAX COMPLETION",        "zh-TW": "最大輸出限制",       vi: "ĐẦU RA TỐI ĐA",                 ms: "PENYELESAIAN MAKS", ja: "最大出力", ko: "최대 출력" },
  "pricing_prompt":       { en: "PRICING (PROMPT)",      "zh-TW": "計費 (輸入)",        vi: "GIÁ (ĐẦU VÀO)",                 ms: "HARGA (PROMPT)", ja: "価格 (入力)", ko: "가격 (프롬프트)" },
  "pricing_comp":         { en: "PRICING (COMP)",        "zh-TW": "計費 (輸出)",        vi: "GIÁ (ĐẦU RA)",                  ms: "HARGA (PENYELESAIAN)", ja: "価格 (出力)", ko: "가격 (생성)" },
  "cost_savings":         { en: "cost savings vs baseline", "zh-TW": "比基線模型節省成本", vi: "tiết kiệm chi phí so với cơ sở",  ms: "penjimatan kos berbanding garis asas", ja: "ベースラインからのコスト削減", ko: "베이스라인 대비 비용 절감" },
  "benchmarks":           { en: "Benchmarks",            "zh-TW": "基準測試",           vi: "Điểm chuẩn",                     ms: "Penanda Aras", ja: "ベンチマーク", ko: "벤치마크" },
  "intelligence":         { en: "Intelligence",          "zh-TW": "智能程度",           vi: "Trí tuệ",                        ms: "Kepintaran", ja: "知能", ko: "지능" },
  "coding_speed":         { en: "Coding Speed",          "zh-TW": "代碼生成速度",       vi: "Tốc độ lập trình",               ms: "Kelajuan Pengekodan", ja: "コーディング速度", ko: "코딩 속도" },
  "autonomy":             { en: "Autonomy",              "zh-TW": "自主執行力",         vi: "Tự chủ",                         ms: "Autonomi", ja: "自律性", ko: "자율성" },
  "pending_eval":         { en: "PENDING EVAL",          "zh-TW": "等待評測",           vi: "CHỜ ĐÁNH GIÁ",                  ms: "MENUNGGU PENILAIAN", ja: "評価待ち", ko: "평가 대기 중" },
  "latency_ttft":         { en: "LATENCY (TTFT)",        "zh-TW": "首字延遲 (TTFT)",    vi: "ĐỘ TRỄ (TTFT)",                 ms: "KEPENDAMAN (TTFT)", ja: "レイテンシ (TTFT)", ko: "지연 시간 (TTFT)" },
  "throughput":           { en: "THROUGHPUT",             "zh-TW": "吞吐速度",           vi: "THÔNG LƯỢNG",                    ms: "DAYA PEMPROSESAN", ja: "スループット", ko: "처리량" },
  "reliability":          { en: "RELIABILITY",           "zh-TW": "穩定性/上線率",      vi: "ĐỘ TIN CẬY",                    ms: "KEBOLEHPERCAYAAN", ja: "信頼性", ko: "신뢰도" },
  "verdict":              { en: "VERDICT:",              "zh-TW": "運營結論:",          vi: "KẾT LUẬN:",                      ms: "KEPUTUSAN:", ja: "結論:", ko: "결론:" },
  "use_cases":            { en: "USE CASES:",            "zh-TW": "建議工作流:",        vi: "TRƯỜNG HỢP SỬ DỤNG:",           ms: "KES PENGGUNAAN:", ja: "ユースケース:", ko: "사용 사례:" },
};

export const makeT = (language: Language) => (key: string) =>
  UI_STRINGS[key]?.[language] ?? UI_STRINGS[key]?.en ?? key;

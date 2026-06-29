import { SiteCopyTypeV4 } from "./site-copy-v4";

export const siteCopyViV4: SiteCopyTypeV4 = {
  hero: {
    wordmark: "Kairma",
    h1: "Chúng tôi không giao phó AI cho bạn, mà triển khai nó vào hoạt động vận hành của bạn.",
    sub: "Lực lượng lao động AI dành cho các thương hiệu xuyên biên giới — triển khai tiền phương và chịu trách nhiệm về kết quả.",
    bio: "Kairma đưa các nhân viên kỹ thuật số AI vào các hoạt động vận hành hàng ngày của thương hiệu xuyên biên giới — KOL BD, nội dung, chăm sóc khách hàng, tuân thủ. Chúng tôi không chỉ ném cho bạn một bộ công cụ rồi bỏ đi; một đội ngũ triển khai tiền phương sẽ đưa lực lượng lao động này vào hệ thống của bạn, và đồng hành cho đến khi tạo ra kết quả thực tế. Nền tảng được điều phối bởi Agent OS. Truy cập mở đang được xây dựng.",
    cta_primary: "Đăng ký thử nghiệm →",
    cta_secondary: "Xem cách triển khai hoạt động",
    fde_note: "FDE — Triển khai Tiền phương (Forward-Deployed Engineering). Chúng tôi không chỉ giao phần mềm rồi rời đi, mà đưa các kỹ sư vào \"phía của bạn\": họ chịu trách nhiệm về kết quả, biến sản phẩm thành kết quả thực tế trong hoạt động của bạn, sau đó đưa những bài học kinh nghiệm trở lại nền tảng. Ngắn hạn thì đó là chi phí; dài hạn thì đó là R&D, giúp mỗi lần triển khai sau này rẻ hơn. (Do Palantir tiên phong, nay đã phổ biến trong AI doanh nghiệp.)"
  },
  s01_problem: {
    heading: "Hoạt động thương hiệu xuyên biên giới vẫn phải phụ thuộc vào việc tăng nhân lực để mở rộng.",
    stat: "Khoảng 1.5 nghìn tỷ USD được chi tiêu mỗi năm trên toàn cầu cho nhân lực vận hành thương hiệu xuyên biên giới.",
    note: "Dựa trên 18 tháng vận hành KOL BD xuyên biên giới thực tế.",
    points: [
      "Cách thức BD không thể chuẩn hóa, phễu bị rò rỉ ở khắp nơi.",
      "Bốn nền tảng, hoàn toàn không có sự tích hợp.",
      "Mỗi khi vào thị trường mới, phải tuyển người mới — chi phí tăng tuyến tính."
    ]
  },
  s02_whynow: {
    heading: "Bốn đường cong hội tụ vào năm 2026.",
    points: [
      "Mô hình mã nguồn mở, chi phí chỉ còn một phần rất nhỏ. DeepSeek, Qwen, Llama đã có thể chạy các tác vụ cấp doanh nghiệp với mức giá chỉ bằng một phần nhỏ so với các mô hình hàng đầu.",
      "Suy luận biên (Edge Inference), rẻ hơn nhiều. Phần cứng thương mại đã có thể chạy các agent doanh nghiệp tại chỗ.",
      "Chủ quyền dữ liệu đang được luật hóa. Tại ASEAN, EU và Trung Quốc, nội địa hóa ngày càng là bắt buộc chứ không phải tùy chọn.",
      "Ngân sách hệ sinh thái đang ở mức cao. Các chương trình đám mây và nền tảng đang trợ cấp cho việc tham gia của các nhà phát triển."
    ]
  },
  s03_insight: {
    heading: "Ba điều mà hầu hết mọi người chưa tính đến.",
    points: [
      "Hào quang bảo vệ là phương pháp luận, không phải mô hình. Bất cứ ai mã hóa được chiến lược hoạt động của thương hiệu vào luồng công việc của máy móc, người đó sẽ giữ chân được khách hàng.",
      "Agent sẽ được \"phát hiện\" như App, không phải được \"bán\" như SaaS. Giá trị của mạng lưới phân phối lớn hơn bất kỳ ứng dụng đơn lẻ nào trên đó.",
      "Hào quang bảo vệ là triển khai, không phải tải xuống. Khoảng cách giữa hệ thống AI và vận hành thực tế không bao giờ tự thu hẹp; bên nào vượt qua được nó và nắm giữ dữ liệu triển khai sẽ tạo ra lãi kép."
    ]
  },
  s04_what: {
    heading: "Bốn tầng, một cấu trúc tạo lãi kép.",
    layers: {
      l4: "§ IV · TRIỂN KHAI (DEPLOYMENT) — Một đội ngũ triển khai tiền phương, đưa lực lượng lao động vào hệ thống của bạn và chịu trách nhiệm về kết quả. Không phải là tư vấn, không phải chỉ bàn giao là xong.",
      l3: "§ III · AGENTS — Kho nhân viên kỹ thuật số AI không ngừng phát triển. Bắt đầu với KOL BD, thêm mới mỗi quý. Truy cập mở cho các nhà phát triển — đang được xây dựng.",
      l2: "§ II · OS (Agent OS) — Động cơ SOP + Điều phối lực lượng lao động. Phương pháp luận thương hiệu của bạn, được mã hóa. Định tuyến đa mô hình, thực thi RPA.",
      l1: "§ I · THE KEEP — Một không gian vận hành khép kín do bạn kiểm soát. Dữ liệu của bạn, agent và playbook chúng ta cùng xây dựng hoàn toàn ở phía bạn, tuyệt đối không đưa lên đám mây chia sẻ."
    },
    footer: "Triển khai đi trước, phần mềm tạo lãi kép, hệ sinh thái mở theo sau."
  },
  s05_architecture: {
    heading: "Dữ liệu ở lại tại chỗ. Mô hình ở trên đám mây. Chỉ có nhiệm vụ được gửi lên.",
    customer_side: "the Keep——Không gian vận hành khép kín của bạn. Hồ dữ liệu thương hiệu (riêng tư, không bao giờ tải lên). Động cơ SOP, định tuyến mô hình, lớp RPA/API.",
    cloud_models: "Claude, GPT, Gemini, DeepSeek, Qwen, Kimi——Định tuyến dựa trên nhiệm vụ và chi phí.",
    footer: "Dữ liệu thô không bao giờ rời khỏi phía của bạn, chỉ có nhiệm vụ được gửi lên.",
    form_note: "Giai đoạn này the Keep được chuyển giao dưới dạng the Key——một ổ đĩa chủ quyền mà bạn cầm trong tay. Kairma One (máy chủ tại chỗ) đang nằm trong lộ trình phát triển."
  },
  s06_moats: {
    heading: "Bốn hào quang bảo vệ, từ sâu đến cạn.",
    moats: [
      "Động cơ SOP + Hồ dữ liệu. Biến chiến lược thương hiệu thành luồng công việc có thể thực thi, càng chạy càng sâu. (Những người khác bán thiết bị đầu cuối, không phải logic được mã hóa.)",
      "Kho Agent đang xuất xưởng. Tự phát triển, mở rộng mỗi quý.",
      "Triển khai tiền phương được sản phẩm hóa. the Keep + Kho SOP chuẩn hóa khoảng 80% mỗi lần triển khai; chặng cuối được hoàn thành bởi một đội ngũ triển khai tiền phương gọn nhẹ — do đó mô hình kinh tế FDE có thể hoạt động mà không cần hợp đồng 7 chữ số.",
      "Bánh đà dữ liệu triển khai. Mỗi lần triển khai dạy cho nền tảng biết \"luồng công việc nào thực sự mang lại kết quả\". Dữ liệu thô của khách hàng ở lại the Keep, việc học hỏi tạo lãi kép bên phía Kairma."
    ]
  },
  s07_story: {
    heading: "Chúng tôi không xây dựng một hệ sinh thái, chúng tôi phát triển từ một hệ sinh thái.",
    from: "Kairma được tách ra từ một tập đoàn vận hành quy quy mô lớn, có mặt tại nhiều thành phố ở Châu Á. Trước khi bắt đầu, nền tảng vận hành đã sẵn sàng.",
    how: "Được triển khai bởi những người đã thực sự vận hành thương hiệu xuyên biên giới trong nhiều năm — không phải là một phòng thí nghiệm vừa học vừa mò mẫm công khai.",
    held_note: ""
  },
  s08_howitworks: {
    heading: "Bánh đà làm giảm chi phí sau mỗi lần triển khai.",
    steps: [
      "Thu thập: Chúng tôi thu thập SOP vận hành của bạn.",
      "Mã hóa: Động cơ SOP biên dịch nó thành luồng công việc agent có thể thực thi.",
      "Triển khai: Đội ngũ triển khai tiền phương đưa lực lượng lao động vào môi trường của bạn.",
      "Vận hành: Lực lượng lao động tạo ra kết quả. Bạn trả phí đăng ký. Mỗi đồng token đều được chi cho kết quả, chứ không phải chạy không.",
      "Lãi kép: Mỗi lần triển khai đều chuẩn hóa lần tiếp theo. Khoảng 80% có thể tái sử dụng, chặng cuối không ngừng rút ngắn."
    ]
  },
  s09_inmotion: {
    heading: "Hệ sinh thái mà chúng tôi xuất phát —— logo sẽ được công bố sau."
  },
  s10_begin: {
    heading: "Hai cánh cửa, hãy chọn cánh cửa của bạn.",
    operators: {
      title: "Dành cho nhà vận hành",
      desc: "Triển khai một lực lượng lao động AI vào hoạt động thương hiệu xuyên biên giới của bạn.",
      points: [
        "Chúng tôi cùng bạn đưa vào thực tế —— yêu cầu kết quả, không chỉ bàn giao là xong",
        "Dữ liệu của bạn ở lại the Keep, giữ tính riêng tư",
        "Định tuyến đa mô hình (Claude · GPT · DeepSeek · Qwen)",
        "18 tháng KOL BD xuyên biên giới, đã được mã hóa"
      ],
      cta: "Đăng ký thử nghiệm → (pilot@kairma.ai)"
    },
    builders: {
      title: "Dành cho nhà phát triển",
      desc: "Trên Kairma, hãy tạo ra nhân viên kỹ thuật số AI tiếp theo.",
      points: [
        "Nhà phát triển được quyền truy cập sớm",
        "Logic agent của bạn chạy trong the Keep —— nó vẫn là của bạn",
        "Triển khai trực tiếp lên máy thực tế",
        "SDK mở, đang được xây dựng"
      ],
      cta: "Tham gia cộng đồng → (github.com/kairma)"
    }
  },
  footer: {
    tagline: "Công việc không dừng lại chỉ vì bạn nghỉ ngơi.",
    osVersion: "Kairma · 2026"
  }
};

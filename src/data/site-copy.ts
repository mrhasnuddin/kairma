export interface SectionCopy {
  title: string;
  heading: string;
}

export interface HeroCopy {
  kicker: string;
  wordmark: string;
  tagline: string;
  subTagline: string;
  anchorBio: string;
  cta: {
    begin: string;
    architecture: string;
  };
  scrollText: string;
}

export interface ProblemCopy extends SectionCopy {
  stat: {
    value: string;
    label: string;
    context: string;
  };
  painPoints: string[];
}

export interface CurveItem {
  num: string;
  title: string;
  desc: string;
}

export interface WhyNowCopy extends SectionCopy {
  curves: CurveItem[];
}

export interface InsightItem {
  num: string;
  title: string;
  desc: string;
  anchor: string;
}

export interface InsightCopy extends SectionCopy {
  insights: InsightItem[];
}

export interface LayerItem {
  id: string;
  title: string;
  desc: string;
}

export interface WhatKairmaIsCopy extends SectionCopy {
  layers: LayerItem[];
  footer: string;
}

export interface ArchitectureCopy extends SectionCopy {
  premise: {
    title: string;
    box: string;
    specs: string;
    lakeTitle: string;
    lakeDesc: string;
    engine: string;
    router: string;
    rpa: string;
  };
  cloud: {
    title: string;
    models: string[];
    desc: string;
  };
  arrows: {
    top: string;
    bottom: string;
  };
  footer: string;
}

export interface StepItem {
  num: string;
  name: string;
  desc: string;
}

export interface HowItWorksCopy extends SectionCopy {
  steps: StepItem[];
}

export interface MoatItem {
  num: string;
  title: string;
  desc: string;
  comparison: string;
}

export interface DefensibilityCopy extends SectionCopy {
  moats: MoatItem[];
}

export interface StorySection {
  kicker: string;
  title: string;
  desc: string;
}

export interface StoryCopy extends SectionCopy {
  sections: StorySection[];
}

export interface PartnersCopy extends SectionCopy {}

export interface EnterpriseBegin {
  title: string;
  subtitle: string;
  features: string[];
  cta: string;
  email: string;
}

export interface BuildersBegin {
  title: string;
  subtitle: string;
  features: string[];
  cta: string;
  github: string;
}

export interface BeginCopy extends SectionCopy {
  enterprise: EnterpriseBegin;
  builders: BuildersBegin;
}

export interface ClosingCopy {
  text: string;
  sub: string;
}

export interface FooterCopy {
  wordmark: string;
  tagline: string;
  osVersion: string;
  email: string;
  locations: string[];
  provenance: {
    spinOut: string;
    partners: string[];
  };
  copyright: string;
}

export interface BootCopy {
  title: string;
  separator: string;
  steps: { text: string; status: string }[];
  ready: string;
  ctaImmerse: string;
  ctaSkip: string;
}

export interface StoryIntroCopy {
  osName: string;
  copyright: string;
  lines: string[];
  scrollPrompt: string;
}

export interface StatusCopy {
  osName: string;
  version: string;
  dataMode: string;
  modelRoute: string;
  rawData: string;
  agentStatus: {
    kolAgent: string;
    openSdk: string;
    library: string;
  };
}

export interface EcosystemModelsCopy {
  title: string;
  subtitle: string;
  fullRankings: string;
  fetching: string;
  metrics: {
    intelligence: string;
    coding: string;
    agentic: string;
  };
  tableHeaders: {
    model: string;
    context: string;
    price: string;
    intel: string;
    code: string;
  };
  detailLabels: {
    free: string;
    rank: string;
    context: string;
    input: string;
    output: string;
    modality: string;
    benchmarkScores: string;
  };
}

export interface SpecDetail {
  label: string;
  val: string;
}

export interface PhotographyCopy extends SectionCopy {
  desc: string;
  specifications: {
    lens: string;
    aperture: string;
    lighting: string;
    colorTemperature: string;
    saturation: string;
    aspectRatio: string;
    grain: string;
    subjectFraming: string;
    productFraming: string;
  };
  subjectMatter: {
    permitted: string[];
    forbidden: string[];
  };
  references: string[];
}

export interface AudioAsset {
  name: string;
  duration: string;
  composition: string;
  use: string;
}

export interface AudioCopy extends SectionCopy {
  desc: string;
  vocabulary: string[];
  assets: AudioAsset[];
  commissioningProfile: string;
}

export interface PilotFormField {
  label: string;
  placeholder?: string;
  options?: string[];
}

export interface PilotModalCopy {
  title: string;
  subtitle: string;
  monoDesc: string;
  fields: {
    name: PilotFormField;
    email: PilotFormField;
    company: PilotFormField;
    country: PilotFormField;
    workflow: PilotFormField;
    sovereignty: PilotFormField;
  };
  submitCta: string;
  success: {
    title: string;
    subtitle: string;
    downloadCta: string;
    downloadLink: string;
    closeCta: string;
  };
}

export interface PartnerMarqueeCopy extends SectionCopy {
  description: string;
  marqueeLabel: string;
}

export interface FDEHeroCopy {
  h1: string;
  sub: string;
  state: string;
  ctaPilot: string;
  ctaWorks: string;
}

export interface FDESectionCopy {
  title: string;
  heading: string;
  desc: string;
}

export interface FDEEmployeesCopy extends FDESectionCopy {
  roles: string[];
}

export interface FDEPilotCopy {
  title: string;
  developers: {
    heading: string;
    desc: string;
  };
  operators: {
    heading: string;
    desc: string;
  };
}

export interface SiteCopyType {
  hero: HeroCopy;
  problem: ProblemCopy;
  whyNow: WhyNowCopy;
  insight: InsightCopy;
  whatKairmaIs: WhatKairmaIsCopy;
  architecture: ArchitectureCopy;
  howItWorks: HowItWorksCopy;
  defensibility: DefensibilityCopy;
  story: StoryCopy;
  partners: PartnersCopy;
  begin: BeginCopy;
  closing: ClosingCopy;
  footer: FooterCopy;
  boot: BootCopy;
  storyIntro: StoryIntroCopy;
  status: StatusCopy;
  photography: PhotographyCopy;
  audio: AudioCopy;
  pilotModal: PilotModalCopy;
  ecosystemModels: EcosystemModelsCopy;
  partnersBox: PartnerMarqueeCopy;
  fdeHero: FDEHeroCopy;
  fdeShift: FDESectionCopy;
  fdeEmployees: FDEEmployeesCopy;
  fdeDeployment: FDESectionCopy;
  fdeBox: FDESectionCopy;
  fdeFlywheel: FDESectionCopy;
  fdePilot: FDEPilotCopy;
}

export const siteCopy: SiteCopyType = {
  hero: {
    kicker: "§ 00 · KAIRMA",
    wordmark: "Kai rma",
    tagline: "The AI workforce for cross-border brands.",
    subTagline: "ONE BOX. YOUR FIRST AI EMPLOYEE.",
    anchorBio: "THE UNIFIED OPERATING SYSTEM FOR CROSS-BORDER BRAND OPERATIONS. WE REPLACE REPETITIVE LABOR WITH AUTONOMOUS AI AGENTS, ALLOWING AMBITIOUS BRANDS TO SCALE GLOBALLY WITHOUT LINEAR HEADCOUNT LIMITATIONS.",
    cta: {
      begin: "Begin →",
      architecture: "See the architecture"
    },
    scrollText: "scroll ↓"
  },
  partnersBox: {
    title: "§ 01 · PARTNERS",
    heading: "GLOBAL AMBITION REQUIRES MORE THAN JUST TALENT.",
    description: "The most ambitious brands are bottlenecked by legacy operations, scattered data, and linear headcount costs. We fix that. KAIRMA brings the best SOP engine, agentic workflows, and infrastructure to scale your brand globally without scaling your payroll. We turn operational friction into an automated compounding advantage.",
    marqueeLabel: "ECOSYSTEM PARTNERS"
  },
  problem: {
    title: "§ 01 · THE PROBLEM",
    heading: "Cross-border brand operations still scale like labor.",
    stat: {
      value: "$1.5T",
      label: "burned globally every year on cross-border brand operations labor.",
      context: "— 18 months of live cross-border KOL BD operations."
    },
    painPoints: [
      "01 · BD scripts don't standardize. Pipelines leak.",
      "02 · Four platforms. Zero integration.",
      "03 · Every new market. New hires. Linear cost."
    ]
  },
  whyNow: {
    title: "§ 02 · WHY NOW",
    heading: "Four curves converge in 2026. The window closes Q4 2027.",
    curves: [
      {
        num: "01",
        title: "Open Models at 1/20 the Cost",
        desc: "DeepSeek · Qwen · Llama 4 reach >90% of GPT-4 on enterprise workloads."
      },
      {
        num: "02",
        title: "Edge Inference, 10× Cheaper",
        desc: "X86 + iGPU now hosts enterprise-grade agents at commodity hardware cost."
      },
      {
        num: "03",
        title: "Sovereign Data Mandated",
        desc: "ASEAN-8, EU, China = 45% of global GDP. Localization is law, not preference."
      },
      {
        num: "04",
        title: "Ecosystem Budgets at Record High",
        desc: "Cloud vendors and platform programs are subsidizing the entire developer onramp."
      }
    ]
  },
  insight: {
    title: "§ 03 · THE INSIGHT",
    heading: "Three things most haven't seen yet.",
    insights: [
      {
        num: "01",
        title: "Brand methodology is the moat. Not the model.",
        desc: "Whoever encodes an operating playbook into machine workflow owns the customer.",
        anchor: "Palantir · Salesforce Einstein"
      },
      {
        num: "02",
        title: "Agents will be discovered like apps, not sold like SaaS.",
        desc: "Distribution networks outvalue any single application they distribute.",
        anchor: "Shopify · Hugging Face Hub · App Store"
      },
      {
        num: "03",
        title: "Hardware is the cheapest enterprise channel.",
        desc: "An edge appliance is one-shot deployment + sovereignty premium + 36-month lock-in.",
        anchor: "Cisco Meraki · Palantir Apollo"
      }
    ]
  },
  whatKairmaIs: {
    title: "§ 04 · WHAT KAIRMA IS",
    heading: "Four layers. One compounding structure.",
    layers: [
      {
        id: "§ IV",
        title: "ALLIANCE",
        desc: "Strategic partnerships through Web3Labs. Microsoft alignment. YZi Labs cohort. HK policy access via parent ecosystem."
      },
      {
        id: "§ III",
        title: "AGENTS",
        desc: "A growing library of AI digital employees. KOL BD agent first. More launching each quarter. Open access for builders — in development."
      },
      {
        id: "§ II",
        title: "OS",
        desc: "SOP Engine + AI Workforce Matrix. Brand methodology, encoded. Multi-model routing. RPA execution."
      },
      {
        id: "§ I",
        title: "BOX",
        desc: "Kairma Edge Appliance. X86 / Windows · asset-light hardware. On-premise. Sovereign by design."
      }
    ],
    footer: "Hardware wedges. Software bodies. Open ecosystem ahead."
  },
  architecture: {
    title: "§ 05 · ARCHITECTURE",
    heading: "Data local. Models cloud. Tasks routed.",
    premise: {
      title: "CUSTOMER PREMISE",
      box: "Kairma Box",
      specs: "X86 / Windows",
      lakeTitle: "Brand Data Lake",
      lakeDesc: "on-premise · never uploaded",
      engine: "SOP Engine",
      router: "Model Router",
      rpa: "RPA / API Layer"
    },
    cloud: {
      title: "CLOUD MODELS",
      models: ["Claude", "GPT", "Gemini", "DeepSeek", "Qwen", "Kimi"],
      desc: "Multi-model routing, selected by cost and task."
    },
    arrows: {
      top: "tasks",
      bottom: "no raw data leaves"
    },
    footer: "Source data never leaves the premise. Only tasks route up."
  },
  howItWorks: {
    title: "§ 08 · HOW IT WORKS",
    heading: "The flywheel that brings cost to zero.",
    steps: [
      {
        num: "1",
        name: "Source",
        desc: "Brand SOPs collected from operations team."
      },
      {
        num: "2",
        name: "Encode",
        desc: "SOP Engine compiles methodology into executable agent workflow."
      },
      {
        num: "3",
        name: "Deploy",
        desc: "Kairma Box ships to customer. Agents run on-premise."
      },
      {
        num: "4",
        name: "Run",
        desc: "Agents work. Brand pays subscription. SOP deepens with each run."
      },
      {
        num: "5",
        name: "Compound",
        desc: "Next agent reuses 70% of the foundation. Each new role costs less than the last."
      }
    ]
  },
  defensibility: {
    title: "§ 06 · DEFENSIBILITY",
    heading: "Four moats. Ordered by depth.",
    moats: [
      {
        num: "01",
        title: "SOP Engine + Data Lake",
        desc: "Encodes a brand's playbook into executable workflow. Compounds per run.",
        comparison: "→ Sierra, Wonderful sell endpoints. Not encoded logic."
      },
      {
        num: "02",
        title: "Agent Library",
        desc: "Built in-house by the Kairma team. Open ecosystem coming.",
        comparison: "→ A library that ships compounds faster than a library that's promised."
      },
      {
        num: "03",
        title: "Microsoft Alignment",
        desc: "Via the Web3Labs partnership framework. Azure partner-program access. X86/Windows edge.",
        comparison: "→ Pure-software AI startups can't access this."
      },
      {
        num: "04",
        title: "Asset-Light Hardware",
        desc: "Standard X86 board · contract OEM assembly in Shenzhen. No inventory risk. 18-month refresh.",
        comparison: "→ US-only competitors don't have the supply chain."
      }
    ]
  },
  story: {
    title: "§ 07 · THE STORY",
    heading: "We don't build the ecosystem. We spin out of one.",
    sections: [
      {
        kicker: "WHERE WE'RE FROM",
        title: "Web3Labs",
        desc: "Spin-out parent. 5-city footprint across Hong Kong, Singapore, Korea, Hangzhou, Beijing. Operating chassis already in place."
      },
      {
        kicker: "WHO WE'RE BUILT WITH",
        title: "Microsoft",
        desc: "Azure partner-program access through the Web3Labs strategic AI partnership framework. X86 / Windows edge alignment."
      },
      {
        kicker: "WHO WE BUILD FOR",
        title: "YZi Labs · Alpha Builders",
        desc: "The early-stage AI capital + builder cohort within the parent ecosystem. Where the first agents come from."
      }
    ]
  },
  partners: {
    title: "§ 09 · IN MOTION",
    heading: "The ecosystem we spin out of — partner mark to follow."
  },
  begin: {
    title: "§ 10 · BEGIN",
    heading: "Two doors. Pick yours.",
    enterprise: {
      title: "FOR ENTERPRISES",
      subtitle: "Deploy a sovereign AI workforce.",
      features: [
        "On-premise in 48 hours",
        "Brand data stays local",
        "Multi-model routing (Claude · GPT · DeepSeek · Qwen)",
        "18 months of SOP encoded (cross-border KOL BD lead architect)"
      ],
      cta: "Request a Pilot →",
      email: "pilot@kairma.ai"
    },
    builders: {
      title: "FOR BUILDERS",
      subtitle: "Help us build the next agent.",
      features: [
        "Early access for builders",
        "Deploy directly to enterprise Kairma Boxes",
        "Open SDK in development"
      ],
      cta: "Join the Discord →",
      github: "github.com/kairma"
    }
  },
  closing: {
    text: "The work doesn't stop because you can't.",
    sub: "KAIRMA OS · 2026"
  },
  footer: {
    wordmark: "Kai rma",
    tagline: "The AI workforce for cross-border brand operations.",
    osVersion: "KAIRMA OS v1.0.0",
    email: "contact@kairma.ai",
    locations: ["Singapore", "Shenzhen", "Hong Kong", "Hanoi"],
    provenance: {
      spinOut: "A spin-out of the Web3Labs ecosystem",
      partners: ["Microsoft partner", "YZi Labs cohort"]
    },
    copyright: "© 2026 KAIRMA"
  },
  boot: {
    title: "BOOTING KAIRMA OS · V1.0.0",
    separator: "----------------------------------------",
    steps: [
      { text: "INITIALIZING SOP WORKFLOW ENGINE", status: "OK" },
      { text: "LOADING LOCAL BRAND DATA LAKE", status: "OK" },
      { text: "CONNECTING CLOUD MODEL ROUTER", status: "OK" }
    ],
    ready: "SYSTEM READY.",
    ctaImmerse: "> [ CONTINUE ]",
    ctaSkip: "> [ SKIP TO DASHBOARD ]"
  },
  storyIntro: {
    osName: "KAIRMA OS UNIFIED OPERATING SYSTEM",
    copyright: "COPYRIGHT © 2026 WEB3LABS",
    lines: [
      "The era of labor scaling is over.",
      "AI models now replace repetitive cross-border tasks.",
      "KAIRMA is the chassis. You build the engine."
    ],
    scrollPrompt: "[ SCROLL TO INITIALIZE RUNTIME CORE ]"
  },
  status: {
    osName: "KAIRMA OS",
    version: "v1.0.0",
    dataMode: "local",
    modelRoute: "cloud",
    rawData: "sealed",
    agentStatus: {
      kolAgent: "live",
      openSdk: "in development",
      library: "expanding quarterly"
    }
  },
  photography: {
    title: "§ 11 · PHOTOGRAPHY",
    heading: "Cinema, not catalogue.",
    desc: "KAIRMA's photographic language is cinematic, not commercial. Every image must read as a still from a film — not as a stock photograph, not as a product shot, not as a corporate lifestyle scene.",
    specifications: {
      lens: "50mm or 85mm prime lens preferred. Wide-angle (28mm and below) forbidden for human subjects.",
      aperture: "Shallow depth of field. f/1.8 to f/4 range. Tack-sharp full-DOF imagery is forbidden.",
      lighting: "One motivated key light plus one fill. High-key studio lighting is forbidden. Shadows are not eliminated; they are sculpted.",
      colorTemperature: "Warm (3200K - 3800K, Wong Kar-wai lineage) OR cool (5600K - 6500K, Fincher lineage). Never neutral 5000K.",
      saturation: "Reduce by 5 - 15% in post. KAIRMA images are never vivid.",
      aspectRatio: "Preferred 1.85:1 or 2.39:1 cinematic ratios. 16:9 only for video. Square only for social media.",
      grain: "5 - 15% film grain applied in post. Pure clean digital is forbidden.",
      subjectFraming: "People: 3/4 profile or full profile preferred. Frontal portraits forbidden.",
      productFraming: "Partial reveal preferred. A full-product hero shot is forbidden."
    },
    subjectMatter: {
      permitted: [
        "The Box — hardware appliance, photographed as a sculptural object (partial reveals, low-light, materiality close-ups)",
        "Architectural details from East Asian and medieval European traditions (cathedral stone, sutra paper textures, brush ink)",
        "Human hands engaged in deliberate action (writing, sealing, holding objects with care)",
        "Atmospheric environments — fog, dust, low sunlight through windows, candle flame, brass surfaces",
        "The Black Cat (real or rendered)"
      ],
      forbidden: [
        "Smiling team headshots / group photos",
        "Office lifestyle scenes (whiteboards, sticky notes, \"innovation moments\")",
        "Stock photography of any kind",
        "Clean white-background product photography",
        "Generic abstract \"tech\" imagery (circuit boards, glowing nodes, digital meshes)",
        "Conference / handshake imagery",
        "Computer screens displayed in a neutral, illustrative way"
      ]
    },
    references: [
      "Wong Kar-wai (Christopher Doyle cinematography, In the Mood for Love, 2046)",
      "David Fincher (Jeff Cronenweth cinematography, Fight Club, Zodiac)",
      "Christopher Nolan (Hoyte van Hoytema, Tenet, Oppenheimer — for technical sequences)",
      "Wim Wenders (Robby Müller, Paris Texas, for compositional restraint)",
      "Andrei Tarkovsky (for the spiritual treatment of objects and time)"
    ]
  },
  audio: {
    title: "§ 12 · AUDIO",
    heading: "The sonic DNA layer.",
    desc: "KAIRMA is a hardware-plus-software product. Audio is a native dimension of the brand. The audio identity comprises five fixed sonic assets, each built from a defined vocabulary of permitted sounds.",
    vocabulary: [
      "Temple bell / cathedral bell — bronze resonance, long decay, sacred associations",
      "Wooden percussion (muyu / 木魚) — sharp single-strike, short decay, ritualistic",
      "Indian copper singing bowl — circular resonance, used only in M.05 Devanagari Rite",
      "Modular synthesizer pulses — analog, granular, used in M.02 Chrome Cyber",
      "Vermilion seal stamp on paper — pressed-impression sound, used in M.06 Seal Tradition",
      "Low-frequency hum — ambient bed, used for product UI states",
      "Processed silence — engineered absence, used between events"
    ],
    assets: [
      {
        name: "Audio Logo",
        duration: "3 - 5 sec",
        composition: "Temple bell + modular pulse + wooden percussion",
        use: "KAIRMA Box startup; opening of all videos"
      },
      {
        name: "Synk Tone",
        duration: "0.5 - 1 sec",
        composition: "Single wooden strike + brief seal stamp",
        use: "UI click; successful API call"
      },
      {
        name: "Entropy Tone",
        duration: "1 - 2 sec",
        composition: "Glass crack + low-frequency hum + silence",
        use: "Error states; system warnings"
      },
      {
        name: "Karma Bell",
        duration: "5 - 8 sec",
        composition: "Full cathedral bell with long spatial decay",
        use: "Major brand events; milestone achievements; anniversary moments"
      },
      {
        name: "Box Ambient Loop",
        duration: "30 - 60 sec loop",
        composition: "Low-frequency hum + occasional wooden strike + wind chime",
        use: "KAIRMA Box idle ambient state"
      }
    ],
    commissioningProfile: "The audio identity should be commissioned from a composer working in the lineage of Ryuichi Sakamoto, Hiroshi Yoshimura, or contemporary East Asian / European experimental electronic music. Genericized \"brand sonic\" agencies should be avoided."
  },
  pilotModal: {
    title: "REQUEST A PILOT",
    subtitle: "Deploy a sovereign AI workforce in 48 hours.",
    monoDesc: "One on-premise box. Your first AI employee. Brand data never leaves.",
    fields: {
      name: {
        label: "Name",
        placeholder: "Enter your name"
      },
      email: {
        label: "Work email *",
        placeholder: "name@company.com"
      },
      company: {
        label: "Company",
        placeholder: "Enter company name"
      },
      country: {
        label: "Country",
        options: ["Singapore", "Indonesia", "Malaysia", "Thailand", "Vietnam", "Philippines", "Hong Kong", "China", "Other"]
      },
      workflow: {
        label: "Pilot Workflow",
        options: ["KOL BD", "content", "ops", "finance", "custom"]
      },
      sovereignty: {
        label: "Data Sovereignty Requirement",
        options: ["Strict on-premise", "Hybrid", "Cloud sovereign", "Not yet decided"]
      }
    },
    submitCta: "Send →",
    success: {
      title: "Received.",
      subtitle: "We respond within 1 business day.",
      downloadCta: "Download the 2-page architecture brief (PDF)",
      downloadLink: "/KAIRMA Business Deck 2026.pdf",
      closeCta: "Close"
    }
  },
  ecosystemModels: {
    title: "LLM Rankings",
    subtitle: "Top models · Ranked by weekly usage · via OpenRouter",
    fullRankings: "Full Rankings ↗",
    fetching: "Fetching Rankings...",
    metrics: {
      intelligence: "Intelligence",
      coding: "Coding",
      agentic: "Agentic"
    },
    tableHeaders: {
      model: "Model",
      context: "Context",
      price: "Price/M",
      intel: "Intel",
      code: "Code"
    },
    detailLabels: {
      free: "Free",
      rank: "Rank",
      context: "Context:",
      input: "Input:",
      output: "Output:",
      modality: "Modality:",
      benchmarkScores: "Benchmark Scores"
    }
  },
  fdeHero: {
    h1: "We don't ship you AI. We deploy it into your operations.",
    sub: "Kairma is a forward-deployed platform for the AI workforce. The first category: AI digital employees for cross-border brand operations.",
    state: "Agent OS — the orchestration layer. Open access in development.",
    ctaPilot: "Apply to the pilot",
    ctaWorks: "How forward deployment works"
  },
  fdeShift: {
    title: "Section 1 — The shift",
    heading: "The bottleneck moved from model capability to deployment.",
    desc: "Tools make people faster. A workforce does the work. We deploy the second kind."
  },
  fdeEmployees: {
    title: "Section 2 — AI digital employees",
    heading: "Your first AI digital employees, deployed — not downloaded.",
    desc: "open access in development",
    roles: ["KOL BD", "content ops", "customer care", "compliance"]
  },
  fdeDeployment: {
    title: "Section 3 — Forward deployment",
    heading: "We sit on your side until it produces outcomes.",
    desc: "Our forward-deployed team lands the workforce inside your operations, tunes it to your data and your processes, and makes sure every token your workforce spends produces a business result — not idle usage."
  },
  fdeBox: {
    title: "Section 4 — The Box",
    heading: "Your workforce runs in a sealed runtime you control.",
    desc: "Closed by design. Your agents, your data, and the playbooks we build together stay in a private runtime — they don't leak into a shared cloud, and they don't become someone else's training data."
  },
  fdeFlywheel: {
    title: "Section 5 — Gets cheaper every deployment",
    heading: "Every deployment makes the next one faster.",
    desc: "What we learn on your operations becomes reusable in the platform. The work compounds."
  },
  fdePilot: {
    title: "Section 6 — The pilot",
    developers: {
      heading: "For developers",
      desc: "Build AI digital employees on Kairma. Your agent logic runs in a sealed, closed-source runtime — it stays yours."
    },
    operators: {
      heading: "For operators",
      desc: "Get a workforce deployed into your cross-border brand ops. We land it with you."
    }
  }
};

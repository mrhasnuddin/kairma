export interface SiteCopyTypeV4 {
  hero: {
    wordmark: string;
    h1: string;
    sub: string;
    bio: string;
    cta_primary: string;
    cta_secondary: string;
    fde_note: string;
  };
  s01_problem: {
    heading: string;
    stat: string;
    note: string;
    points: string[];
  };
  s02_whynow: {
    heading: string;
    points: string[];
  };
  s03_insight: {
    heading: string;
    points: string[];
  };
  s04_what: {
    heading: string;
    layers: {
      l4: string;
      l3: string;
      l2: string;
      l1: string;
    };
    footer: string;
  };
  s05_architecture: {
    heading: string;
    customer_side: string;
    cloud_models: string;
    footer: string;
    form_note: string;
  };
  s06_moats: {
    heading: string;
    moats: string[];
  };
  s07_story: {
    heading: string;
    from: string;
    how: string;
    held_note: string;
  };
  s08_howitworks: {
    heading: string;
    steps: string[];
  };
  s09_inmotion: {
    heading: string;
  };
  s10_begin: {
    heading: string;
    operators: {
      title: string;
      desc: string;
      points: string[];
      cta: string;
    };
    builders: {
      title: string;
      desc: string;
      points: string[];
      cta: string;
    };
  };
  footer: {
    tagline: string;
    osVersion: string;
  };
}

export const siteCopyEnV4: SiteCopyTypeV4 = {
  hero: {
    wordmark: "Kairma",
    h1: "We don't ship you AI. We deploy it into your operations.",
    sub: "The AI workforce for cross-border brands — forward-deployed, and accountable for outcomes.",
    bio: "Kairma deploys AI digital employees into the work that runs a cross-border brand — KOL BD, content, customer care, compliance. We don't hand you a tool and walk away. A forward-deployed team lands the workforce inside your operation and stays until it produces results. Agent OS is the orchestration layer underneath. Open access in development.",
    cta_primary: "Request a pilot →",
    cta_secondary: "See how deployment works",
    fde_note: "FDE — Forward-Deployed Engineering. Instead of shipping software and leaving, we embed engineers on your side who own the outcome, turn the product into results inside your operation, and feed what they learn back into the platform. Short-term it sits in cost; long-term it's R&D that makes every next deployment cheaper. (Pioneered by Palantir; now adopted across enterprise AI.)"
  },
  s01_problem: {
    heading: "Cross-border brand operations still scale like labor.",
    stat: "Roughly $1.5T a year goes to cross-border brand-operations labor worldwide.",
    note: "Built on 18 months of live cross-border KOL BD operations.",
    points: [
      "BD playbooks don't standardize. Pipelines leak.",
      "Four platforms, zero integration.",
      "Every new market means new hires — and linear cost."
    ]
  },
  s02_whynow: {
    heading: "Four curves converge in 2026.",
    points: [
      "Open models at a fraction of the cost. DeepSeek, Qwen, Llama now clear enterprise workloads at a fraction of frontier pricing.",
      "Edge inference, far cheaper. Commodity hardware now runs enterprise-grade agents on-site.",
      "Data sovereignty is becoming law. Across ASEAN, the EU, and China, localization is increasingly mandated, not optional.",
      "Ecosystem budgets at a high. Cloud and platform programs are subsidizing the developer onramp."
    ]
  },
  s03_insight: {
    heading: "Three things most haven't priced in yet.",
    points: [
      "The methodology is the moat — not the model. Whoever encodes a brand's operating playbook into machine workflow owns the customer.",
      "Agents get discovered like apps, not sold like SaaS. The distribution network outlasts any single app on it.",
      "Deployment is the moat — not the download. The gap between an AI system and a real operation never closes on its own. Whoever crosses it — and keeps the deployment data — compounds."
    ]
  },
  s04_what: {
    heading: "Four layers. One compounding structure.",
    layers: {
      l4: "§ IV · DEPLOYMENT — A forward-deployed team that lands the workforce inside your operation and owns the outcome. Not consulting. Not a hand-off.",
      l3: "§ III · AGENTS — A growing library of AI digital employees. KOL BD first; more each quarter. Open access for builders — in development.",
      l2: "§ II · OS (Agent OS) — SOP engine + workforce orchestration. Your brand methodology, encoded. Multi-model routing, RPA execution.",
      l1: "§ I · THE KEEP — A sealed runtime you control. Your data, agents, and the playbooks we build together stay private — on your side, never a shared cloud."
    },
    footer: "Deployment leads. Software compounds. The ecosystem opens."
  },
  s05_architecture: {
    heading: "Data stays local. Models stay in the cloud. Only tasks route.",
    customer_side: "The Keep — your sealed runtime. Brand data lake (private, never uploaded). SOP engine, model router, RPA / API layer.",
    cloud_models: "Claude, GPT, Gemini, DeepSeek, Qwen, Kimi — routed per task and cost.",
    footer: "Source data never leaves your side. Only tasks route up.",
    form_note: "The Keep ships today as the Key — a sovereign drive you hold; sovereignty in your hand. Kairma One, the on-premise appliance, is on the roadmap."
  },
  s06_moats: {
    heading: "Four moats, ordered by depth.",
    moats: [
      "SOP engine + data lake. Encodes a brand's playbook into executable workflow. Deepens with every run. (Others sell endpoints, not encoded logic.)",
      "Agent library, shipping. Built in-house, expanding quarterly.",
      "Productized forward deployment. The Keep + SOP library standardize ~80% of every deployment; a light forward-deployed team closes the last mile — so FDE economics work without seven-figure contracts.",
      "Deployment-data flywheel. Each deployment teaches the platform which workflows produce real outcomes. Raw client data stays in the Keep; the learning compounds in Kairma."
    ]
  },
  s07_story: {
    heading: "We don't build the ecosystem. We spin out of one.",
    from: "Kairma is a spin-out of an established operating group with a multi-city footprint across Asia. The operating chassis was already in place before day one.",
    how: "Forward-deployed by people who have run cross-border brand operations for years — not a lab learning the domain in public.",
    held_note: "Parent entity, framework-agreement / cloud-program partners, capital cohort — kept in the investor deck, off this page until your go."
  },
  s08_howitworks: {
    heading: "The flywheel that drives cost down with every deployment.",
    steps: [
      "Source — We collect your operating SOPs.",
      "Encode — The SOP engine compiles them into executable agent workflows.",
      "Deploy — A forward-deployed team lands the workforce in your environment.",
      "Run — The workforce produces outcomes. You pay a subscription. Every token is spent on results, not idle usage.",
      "Compound — Each deployment standardizes the next. ~80% carries over; the last mile keeps shrinking."
    ]
  },
  s09_inmotion: {
    heading: "The ecosystem we spin out of — marks to follow."
  },
  s10_begin: {
    heading: "Two doors. Pick yours.",
    operators: {
      title: "For operators",
      desc: "Deploy an AI workforce into your cross-border brand ops.",
      points: [
        "We land it with you — outcomes, not a hand-off",
        "Your data stays private, in the Keep",
        "Multi-model routing (Claude · GPT · DeepSeek · Qwen)",
        "18 months of cross-border KOL BD, encoded"
      ],
      cta: "Request a pilot →"
    },
    builders: {
      title: "For builders",
      desc: "Build the next AI digital employee on Kairma.",
      points: [
        "Early access for builders",
        "Open SDK (in development)",
        "Reach cross-border enterprise deployments"
      ],
      cta: "Join Waitlist →"
    }
  },
  footer: {
    tagline: "AI digital employees, forward-deployed.",
    osVersion: "AGENT OS v1.02.04"
  }
};

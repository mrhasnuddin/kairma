export interface GuanQuote {
  chamber: number;
  chamberName: string;
  quote: string;
  original?: string;
  attribution: string;
  context: string;
}

export const guanCodex: GuanQuote[] = [
  {
    chamber: 1,
    chamberName: "镜 · The Mirror",
    quote: "“For now we see through a glass, darkly; but then face to face.”",
    attribution: "1 Corinthians 13:12 (KJV)",
    context: "perception, self-knowledge, the limits of seeing"
  },
  {
    chamber: 2,
    chamberName: "魂与壳 · Ghost & Shell",
    quote: "“The soul is the first actuality of a natural body that has life potentially within it.”",
    attribution: "Aristotle, De Anima II.1",
    context: "mind and body, soul, identity, memory"
  },
  {
    chamber: 3,
    chamberName: "业 · Karma & the Made Thing",
    quote: "“Life and death, coming and going — a puppet on a stage; when the single string is cut, all falls to nothing.”",
    original: "生死去来，棚头傀儡，一线断时，落落磊磊",
    attribution: "Zeami, 花镜 (Kakyō)",
    context: "creation, the puppet, the debt we owe what we make"
  },
  {
    chamber: 4,
    chamberName: "心 · The Heart & the Will",
    quote: "“Because I have a heart, I envy. Because I have a heart, I devour… Because I have a heart — I want all of you.”",
    original: "心在るが故に妬み／喰らい／奪い／…／お前のすべてを欲する",
    attribution: "Bleach, Vol. 40",
    context: "desire, attachment, why beings want"
  },
  {
    chamber: 5,
    chamberName: "路 · The Path",
    quote: "“The future is not a straight line. It is filled with many crossroads. There must be a future that we can choose for ourselves.”",
    attribution: "Akira (1988), Kiyoko",
    context: "agency, choosing the future, knowing vs. walking"
  },
  {
    chamber: 6,
    chamberName: "爱不可量 · Love Beyond Number",
    quote: "“The heart has its reasons, of which reason knows nothing.”",
    original: "Le cœur a ses raisons que la raison ne connaît point",
    attribution: "Blaise Pascal, Pensées",
    context: "the limit of quantification — the AI Renaissance core"
  },
  {
    chamber: 7,
    chamberName: "无常 · Impermanence",
    quote: "“All those moments will be lost in time, like tears in rain.”",
    attribution: "Blade Runner (1982), Roy Batty",
    context: "memory, loss, the cut string, tears in rain"
  },
  {
    chamber: 8,
    chamberName: "独行 · The Solitary Walk",
    quote: "“Better to walk alone and do good than to keep company with fools.”",
    original: "宁独行为善，不与愚为侣",
    attribution: "Dhammapada",
    context: "restraint, integrity, the quiet practice"
  }
];

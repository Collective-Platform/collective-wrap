export interface Story {
  id: string;
  type:
    | "stat"
    | "hero"
    | "quiz"
    | "image"
    | "cta"
    | "multi-stat"
    | "2025-pledge-stat"
    | "appreciation"
    | "medal"
    | "video"
    | "wrap-title";
  category?: { en: string; cn: string };
  title?: { en: string; cn: string };
  subtitle?: { en: string; cn: string };
  value?: string | number;
  label?: { en: string; cn: string };
  description?: { en: string; cn: string };
  image?: string;
  backgroundImage?: string;
  videoSrc?: string;
  muxPlaybackId?: string;
  bars?: {
    label: { en: string; cn: string };
    value: string;
  }[];
  quizOptions?: { value: string; label: string }[];
  correctAnswer?: string;
  revealText?: { en: string; cn: string };
  mapData?: {
    region: "malaysia" | "asia";
    mainLocation: { name: string; lat: number; lng: number };
    locations: { name: string; lat: number; lng: number }[];
  };
}

export const stories: Story[] = [
  // ACT 1 — BELONGING
  {
    id: "wrap-title-1",
    type: "wrap-title",
    title: { en: "2025 WRAP", cn: "2025 WRAP" },
  },

  {
    id: "hero-2",
    type: "hero",
    title: { en: "You didn't just attend church.", cn: "你不仅仅是来聚会，" },
    subtitle: {
      en: "You built one.",
      cn: "更是建立了一间教会。",
    },
  },

  {
    id: "hero-3",
    type: "hero",
    title: {
      en: "Last year, 9784 people walked through the doors.",
      cn: "去年，共有 9,784 人走进了这扇大门。",
    },
    subtitle: {
      en: "That's the capacity of Stadium Negara.",
      cn: "这相当于整个国家体育馆的容量。",
    },
  },

  {
    id: "video-1",
    type: "video",
    videoSrc:
      "https://mqyxc4xvodvuodmx.public.blob.vercel-storage.com/updated/walking-in-church.mp4",
  },

  {
    id: "hero-4",
    type: "hero",
    title: {
      en: "For 273 of them, the visit changed everything. ",
      cn: "对于其中的 273 人来说，这一次到访改变了一切。",
    },
    subtitle: {
      en: "They accepted Christ.",
      cn: "他们决志信主了。",
    },
  },

  {
    id: "hero-churches",
    type: "hero",
    title: {
      en: "Your giving didn't just build one church.",
      cn: "你的奉献不仅仅是建立了一间教会。",
    },
    subtitle: {
      en: "It supported 17 churches across 7 countries.",
      cn: "它支持了遍布 7 个国家的 17 间教会。",
    },
  },

  {
    id: "video-2",
    type: "video",
    videoSrc:
      "https://mqyxc4xvodvuodmx.public.blob.vercel-storage.com/updated/collective-global.mp4",
  },

  {
    id: "hero-5",
    type: "hero",
    title: {
      en: "You probably don't remember every ringgit you gave.",
      cn: "你或许不记得你奉献的每一令吉，",
    },
    subtitle: {
      en: "But the 213 kids will never forget the school hall you built for them.",
      cn: "但这 213 位孩子永远不会忘记你为他们建的学校礼堂。",
    },
  },

  {
    id: "video-3",
    type: "video",
    videoSrc:
      "https://mqyxc4xvodvuodmx.public.blob.vercel-storage.com/updated/hall-makeover.mp4",
  },

  {
    id: "hero-6",
    type: "hero",
    title: {
      en: "You paid for 1,085 tooth extractions.",
      cn: "你资助了 1,085 次拔牙手术。",
    },
    subtitle: {
      en: "No identification. No subsidised care. <br/> For 454 of them, there was no second option.",
      cn: "没有身份证，没有津贴医疗。对其中的 454 人来说，这是唯一的选择。",
    },
  },

  {
    id: "video-4",
    type: "video",
    videoSrc:
      "https://mqyxc4xvodvuodmx.public.blob.vercel-storage.com/updated/dental-compressed.mp4",
  },

  {
    id: "hero-7",
    type: "hero",
    title: {
      en: "You subsidised doctors' visits <br/> for 4,371 refugees.",
      cn: "你资助了 4,371 位难民看诊。",
    },
    subtitle: {
      en: "331 babies were vaccinated against serious disease threats.",
      cn: "让 331 名婴儿接种了疫苗，免受严重疾病的威胁。",
    },
  },

  {
    id: "video-5",
    type: "video",
    videoSrc:
      "https://mqyxc4xvodvuodmx.public.blob.vercel-storage.com/updated/autrui.mp4",
  },

  {
    id: "hero-8",
    type: "hero",
    title: {
      en: "Some kids walk hours just to learn in Sabah. ",
      cn: "在沙巴，有些孩子为了上学要走好几个小时的路。",
    },
    subtitle: {
      en: "You kept 5 hostels running for 180 of them.",
      cn: "你维持了 5 间宿舍的运作，成为了 180 位孩子的避风港。",
    },
  },

  {
    id: "video-6-walking to school",
    type: "video",
    videoSrc:
      "https://mqyxc4xvodvuodmx.public.blob.vercel-storage.com/updated/walking-to-school.mp4",
  },

  {
    id: "hero-9",
    type: "hero",
    title: {
      en: "We cannot list it all. ",
      cn: "我们要感谢的还有很多，无法一一列举。",
    },
    subtitle: {
      en: "But you made it all happen.",
      cn: "但这一切之所以发生，都是因为你。",
    },
  },

  {
    id: "hero-10",
    type: "hero",
    title: {
      en: "No single person did this.",
      cn: "这不是一个人完成的。",
    },
    subtitle: {
      en: "It took 432 of us.",
      cn: "这是我们 432 人共同努力的成果。",
    },
  },

  {
    id: "final-cta",
    type: "cta",
    category: { en: "2026", cn: "2026年" },
    title: { en: "Our goal this year is to raise", cn: "我们今年的筹款目标是" },
    value: "RM 1,500,000",
    label: { en: "Join Us", cn: "加入我们" },
    subtitle: {
      en: "Let's build together",
      cn: "让我们一起建造",
    },
  },
];

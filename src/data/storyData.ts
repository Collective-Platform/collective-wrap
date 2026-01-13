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
    | "medal";
  category?: { en: string; cn: string };
  title?: { en: string; cn: string };
  subtitle?: { en: string; cn: string };
  value?: string | number;
  label?: { en: string; cn: string };
  description?: { en: string; cn: string };
  image?: string;
  backgroundImage?: string;
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
    id: "hero-1",
    type: "hero",
    title: { en: "2025: Unwrapped", cn: "2025 很特别" },
    subtitle: {
      en: "It was a long year, but you made it count.",
      cn: "因为有你",
    },
  },

  {
    id: "hero-2",
    type: "hero",
    title: { en: "You didn't just attend church.", cn: "因为你的奉献" },
    subtitle: {
      en: "You built one.",
      cn: "我们才能做重要的事",
    },
  },

  {
    id: "hero-3",
    type: "hero",
    title: {
      en: "Last year, 9784 people walked through the doors.",
      cn: "因为你的奉献",
    },
    subtitle: {
      en: "That's the capacity of Stadium Negara.",
      cn: "我们才能做重要的事",
    },
  },

  {
    id: "hero-4",
    type: "hero",
    title: {
      en: "For 273 of them, the visit changed everything. ",
      cn: "因为你的奉献",
    },
    subtitle: {
      en: "They accepted Christ.",
      cn: "我们才能做重要的事",
    },
  },

  {
    id: "hero-5",
    type: "hero",
    title: {
      en: "Your giving didn't just build one church.",
      cn: "因为你的奉献",
    },
    subtitle: {
      en: "It supported 17 churches across 7 countries.",
      cn: "我们才能做重要的事",
    },
  },

  {
    id: "hero-6",
    type: "hero",
    title: {
      en: "You probably don't remember every ringgit you gave.",
      cn: "因为你的奉献",
    },
    subtitle: {
      en: "But the 213 kids will never forget the school hall you built for them.",
      cn: "我们才能做重要的事",
    },
  },
  {
    id: "missions-quiz",
    type: "quiz",
    category: { en: "Missions", cn: "宣教事工" },
    title: {
      en: "Guess how many lives have we impacted in 2025?",
      cn: "你猜我们在2025年影响了多少生命？",
    },
    quizOptions: [
      { value: "2,202", label: "A. 2,202" },
      { value: "21,630", label: "B. 21,630" },
      { value: "5,413", label: "C. 5,413" },
      { value: "16,170", label: "D. 16,170" },
    ],
    correctAnswer: "21,630",
    revealText: {
      en: "We impacted over 21,630 lives",
      cn: "我们影响了超过 21,630 条生命",
    },
  },

  // // ACT 5 — GLOBAL
  // {
  //   id: "global-family",
  //   type: "stat",
  //   category: { en: "Collective Global", cn: "全球集体" },
  //   title: { en: "Beyond Malaysia", cn: "不止在马来西亚" },
  //   value: "17",
  //   label: { en: "Churches Across Asia", cn: "亚洲各地教会" },
  //   mapData: {
  //     region: "asia",
  //     mainLocation: {
  //       name: "COLLECTIVE",
  //       lat: 3.0738,
  //       lng: 101.5883,
  //     },
  //     locations: [
  //       // Malaysia - Peninsular
  //       { name: "ALPHA COLORS | Shah Alam", lat: 3.0733, lng: 101.5185 },
  //       { name: "CITY LIGHT | Penang", lat: 5.4141, lng: 100.3288 },
  //       { name: "SOUL | Alor Setar", lat: 6.1248, lng: 100.3679 },
  //       { name: "ASCENT | Kedah", lat: 5.6474, lng: 100.488 },
  //       { name: "BORDERLESS | Malacca", lat: 2.1896, lng: 102.2501 },
  //       { name: "OASIS | Johor Bahru", lat: 1.4927, lng: 103.7414 },
  //       { name: "XIAO LOU JIAN | KL", lat: 3.139, lng: 101.6869 },
  //       // Malaysia - East
  //       { name: "CITY ON A HILL | Sandakan", lat: 5.8402, lng: 118.1179 },
  //       // Indonesia
  //       {
  //         name: "CREATIVE CITY WORSHIP | Jakarta",
  //         lat: -6.2088,
  //         lng: 106.8456,
  //       },
  //       // India
  //       { name: "ZEALOUS | Pune", lat: 18.5204, lng: 73.8567 },
  //       { name: "CITY ROCK CHURCH | Chennai", lat: 13.0827, lng: 80.2707 },
  //       // Philippines
  //       { name: "BLESSED | Manila", lat: 14.5995, lng: 120.9842 },
  //       { name: "CREATIVES CHURCH | Manila", lat: 14.6042, lng: 120.9822 },
  //       // Taiwan
  //       { name: "BETHEL | Taiwan", lat: 25.033, lng: 121.5654 },
  //       // Japan
  //       { name: "ZION CHURCH | Okinawa", lat: 26.2124, lng: 127.6809 },
  //       // Cambodia
  //       { name: "MATTER | Phnom Penh", lat: 11.5564, lng: 104.9282 },
  //     ],
  //   },
  // },

  // // ACT 6 — INVITATION
  // {
  //   id: "appreciation-fade",
  //   type: "appreciation",
  //   title: {
  //     en: "All these wouldn't happen without you",
  //     cn: "没有你,这一切都不会发生",
  //   },
  //   backgroundImage: "/path/to/2025-highlights.jpg", // Add your 2025 highlights image here
  // },

  // {
  //   id: "mvp-thanks",
  //   type: "medal",
  //   title: { en: "Thanks to all 546 of you who give", cn: "感谢546位奉献者" },
  //   subtitle: { en: "You're the real MVP", cn: "你们是真正的MVP" },
  //   backgroundImage: "/path/to/background16.jpg", // Optional: add your image path
  // },

  // {
  //   id: "future-setup",
  //   type: "hero",
  //   title: { en: "2026 is bigger", cn: "2026 更大更远" },
  //   subtitle: {
  //     en: "And we can't do it alone",
  //     cn: "我们无法独自完成",
  //   },
  // },

  {
    id: "final-cta",
    type: "cta",
    category: { en: "2026", cn: "2026年" },
    title: { en: "Our goal this year is to raised", cn: "我们今年的目标" },
    value: "RM 1,500,000",
    label: { en: "Join Us", cn: "加入我们" },
    subtitle: {
      en: "Let's build together",
      cn: "让我们一起建造",
    },
  },
];

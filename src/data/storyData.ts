export interface Story {
  id: string;
  type:
    | "stat"
    | "hero"
    | "quiz"
    | "image"
    | "cta"
    | "multi-stat"
    | "2025-pledge-stat";
  category?: { en: string; cn: string };
  title?: { en: string; cn: string };
  subtitle?: { en: string; cn: string };
  value?: string | number;
  label?: { en: string; cn: string };
  description?: { en: string; cn: string };
  image?: string;
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
    title: { en: "2025 was special", cn: "2025 很特别" },
    subtitle: { en: "And you were part of it", cn: "因为有你" },
  },

  {
    id: "hero-2",
    type: "hero",
    title: { en: "Because you gave", cn: "因为你的奉献" },
    subtitle: {
      en: "We could do what mattered",
      cn: "我们才能做重要的事",
    },
  },

  // ACT 2 — PROOF
  {
    id: "giving-total",
    type: "2025-pledge-stat",
    category: { en: "Overview", cn: "概览" },
    title: { en: "Together, we pledged", cn: "我们一起认献了" },
    value: "RM1,688,244.50",
    label: { en: "in 2025", cn: "在 2025 年" },
  },

  {
    id: "reframe",
    type: "hero",
    title: { en: "But money wasn't the point", cn: "但重点不在金钱" },
    subtitle: { en: "Lives were", cn: "而在生命" },
  },

  // ACT 3 — LOCAL IMPACT
  {
    id: "autrui",
    type: "stat",
    category: { en: "Autrui", cn: "奥德医" },
    title: { en: "1,000 DAYS PROJECT", cn: "1000 名婴儿" },
    value: "1,000",
    label: { en: "Babies", cn: "婴儿" },
    subtitle: {
      en: "We Sponsored",
      cn: "我们帮助了",
    },
  },

  {
    id: "autrui-momentum",
    type: "stat",
    category: { en: "Autrui", cn: "奥德医" },
    title: { en: "We're growing", cn: "仍在成长" },
    value: "1",
    label: { en: "New Clinic in Penang", cn: "在槟城建立了新的诊所" },
    mapData: {
      region: "malaysia",
      mainLocation: {
        name: "Autrui Subang Jaya",
        lat: 3.0738,
        lng: 101.5883,
      },
      locations: [
        {
          name: "Autrui Penang",
          lat: 5.4141,
          lng: 100.3288,
        },
      ],
    },
  },

  {
    id: "loan-progress",
    type: "stat",
    category: { en: "Building", cn: "建筑" },
    title: { en: "Building Loan", cn: "建筑贷款" },
    value: "10%",
    label: { en: "of our building loan remaining", cn: "教会建设贷款剩余贷款" },
    subtitle: {
      en: "Almost there",
      cn: "就快完成了",
    },
  },

  {
    id: "community-growth",
    type: "multi-stat",
    category: { en: "Building", cn: "建筑" },
    title: { en: "Collective Family", cn: "不断成长的属灵家庭" },
    bars: [
      {
        label: { en: "Stepped into Collective", cn: "走进 Collective" },
        value: "9,784",
      },
      {
        label: { en: "Accepted Christ", cn: "接受基督" },
        value: "273",
      },
      {
        label: { en: "Rooted in CG", cn: "扎根小组" },
        value: "480",
      },
    ],
  },

  {
    id: "volunteers",
    type: "stat",
    category: { en: "Building", cn: "建筑" },
    title: { en: "Served by many", cn: "许多人一起服事" },
    value: "150",
    label: { en: "Weekly Volunteers", cn: "每周志愿者" },
  },

  // ACT 4 — MISSIONS
  {
    id: "missions-quiz",
    type: "quiz",
    category: { en: "Missions", cn: "宣教事工" },
    title: {
      en: "How many lives have we impacted in 2025?",
      cn: "你猜我们在2025年影响了多少生命？",
    },
    quizOptions: [
      { value: "220", label: "A. 1092" },
      { value: "2163", label: "B. 2163" },
      { value: "543", label: "C. 723" },
      { value: "167", label: "D. 1523" },
    ],
    correctAnswer: "2163",
    revealText: { en: "We impacted 2163 lives", cn: "我们影响了 2163 条生命" },
  },

  {
    id: "missions-impact",
    type: "multi-stat",
    category: { en: "Missions", cn: "宣教事工" },
    title: { en: "Love in action", cn: "爱在行动中" },
    bars: [
      {
        label: { en: "Mission Projects", cn: "宣教项目" },
        value: "7",
      },
      {
        label: { en: "Volunteers", cn: "志愿者" },
        value: "200+",
      },
      {
        label: { en: "Teeth Treated", cn: "牙科治疗" },
        value: "2,000+",
      },
    ],
  },

  // ACT 5 — GLOBAL
  {
    id: "global-family",
    type: "stat",
    category: { en: "Collective Global", cn: "全球集体" },
    title: { en: "Beyond Malaysia", cn: "不止在马来西亚" },
    value: "17",
    label: { en: "Churches Across Asia", cn: "亚洲各地教会" },
    mapData: {
      region: "asia",
      mainLocation: {
        name: "COLLECTIVE",
        lat: 3.0738,
        lng: 101.5883,
      },
      locations: [
        // Malaysia - Peninsular
        { name: "ALPHA COLORS | Shah Alam", lat: 3.0733, lng: 101.5185 },
        { name: "CITY LIGHT | Penang", lat: 5.4141, lng: 100.3288 },
        { name: "SOUL | Alor Setar", lat: 6.1248, lng: 100.3679 },
        { name: "ASCENT | Kedah", lat: 5.6474, lng: 100.488 },
        { name: "BORDERLESS | Malacca", lat: 2.1896, lng: 102.2501 },
        { name: "OASIS | Johor Bahru", lat: 1.4927, lng: 103.7414 },
        { name: "XIAO LOU JIAN | KL", lat: 3.139, lng: 101.6869 },
        // Malaysia - East
        { name: "CITY ON A HILL | Sandakan", lat: 5.8402, lng: 118.1179 },
        // Indonesia
        {
          name: "CREATIVE CITY WORSHIP | Jakarta",
          lat: -6.2088,
          lng: 106.8456,
        },
        // India
        { name: "ZEALOUS | Pune", lat: 18.5204, lng: 73.8567 },
        { name: "CITY ROCK CHURCH | Chennai", lat: 13.0827, lng: 80.2707 },
        // Philippines
        { name: "BLESSED | Manila", lat: 14.5995, lng: 120.9842 },
        { name: "CREATIVES CHURCH | Manila", lat: 14.6042, lng: 120.9822 },
        // Taiwan
        { name: "BETHEL | Taiwan", lat: 25.033, lng: 121.5654 },
        // Japan
        { name: "ZION CHURCH | Okinawa", lat: 26.2124, lng: 127.6809 },
        // Cambodia
        { name: "MATTER | Phnom Penh", lat: 11.5564, lng: 104.9282 },
      ],
    },
  },

  {
    id: "pastors",
    type: "stat",
    category: { en: "Collective Global", cn: "一体全球" },
    title: { en: "Leaders equipped", cn: "领袖被装备" },
    value: "5",
    label: { en: "New Pastors", cn: "新授权牧师" },
  },

  {
    id: "momentum",
    type: "stat",
    category: { en: "Collective Global", cn: "一体全球" },
    title: { en: "We've Partnered with", cn: "仍在成长" },
    value: "2",
    label: { en: "New Churches in 2025", cn: "新加入教会在2025年" },
  },

  // ACT 6 — INVITATION
  {
    id: "future-setup",
    type: "hero",
    title: { en: "2026 is bigger", cn: "2026 更大更远" },
    subtitle: {
      en: "And we can't do it alone",
      cn: "我们无法独自完成",
    },
  },

  {
    id: "final-cta",
    type: "cta",
    category: { en: "2026", cn: "2026年" },
    title: { en: "Our goal this year", cn: "我们今年的目标" },
    value: "RM 1,500,000",
    label: { en: "Join Us", cn: "加入我们" },
    subtitle: {
      en: "Let's build together",
      cn: "让我们一起建造",
    },
  },
];

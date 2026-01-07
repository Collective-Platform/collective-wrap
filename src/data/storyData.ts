export interface Story {
  id: string;
  type: "stat" | "hero" | "quiz" | "image" | "cta" | "multi-stat";
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
    percentage: number;
  }[];
  quizOptions?: { value: string; label: string }[];
  correctAnswer?: string;
  revealText?: { en: string; cn: string };
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
    type: "stat",
    category: { en: "Overview", cn: "概览" },
    title: { en: "Together, we gave", cn: "我们一起奉献" },
    value: "RM1,688,244.50",
    label: { en: "Total Giving", cn: "总奉献金额" },
  },

  {
    id: "reframe",
    type: "hero",
    title: { en: "But money wasn’t the point", cn: "但重点不在金钱" },
    subtitle: { en: "Lives were", cn: "而在生命" },
  },

  // ACT 3 — LOCAL IMPACT
  {
    id: "autrui",
    type: "stat",
    category: { en: "Autrui Clinic", cn: "澳萃诊所" },
    title: { en: "1,000 babies", cn: "1000 名婴儿" },
    value: "1,000",
    label: { en: "Sponsored", cn: "得到赞助" },
    subtitle: {
      en: "Through the 1,000 Day Project",
      cn: "透过「1000 天计划」",
    },
  },

  {
    id: "loan-progress",
    type: "stat",
    category: { en: "Building", cn: "教会建设" },
    title: { en: "Almost there", cn: "就快完成了" },
    value: "10%",
    label: { en: "Remaining", cn: "剩余贷款" },
    subtitle: {
      en: "Of our building loan",
      cn: "教会建设贷款",
    },
  },

  {
    id: "community-growth",
    type: "multi-stat",
    category: { en: "Building", cn: "教会建设" },
    title: { en: "A growing family", cn: "不断成长的属灵家庭" },
    bars: [
      {
        label: { en: "Stepped into Collective", cn: "走进 Collective" },
        value: "9,784",
        percentage: 100,
      },
      {
        label: { en: "Accepted Christ", cn: "接受基督" },
        value: "273",
        percentage: 70,
      },
      {
        label: { en: "Rooted in CG", cn: "扎根小组" },
        value: "480",
        percentage: 85,
      },
    ],
  },

  {
    id: "volunteers",
    type: "stat",
    category: { en: "Building", cn: "教会建设" },
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
      en: "How many lives?",
      cn: "你猜影响了多少生命？",
    },
    quizOptions: [
      { value: "220", label: "A. 220" },
      { value: "700", label: "B. 700" },
      { value: "543", label: "C. 543" },
      { value: "167", label: "D. 167" },
    ],
    correctAnswer: "700",
    revealText: { en: "We impacted 700 lives", cn: "我们影响了 700 条生命" },
  },

  {
    id: "missions-impact",
    type: "multi-stat",
    category: { en: "Missions", cn: "宣教事工" },
    title: { en: "Love in action", cn: "爱在行动中" },
    bars: [
      {
        label: { en: "Teeth Treated", cn: "牙科治疗" },
        value: "2,000+",
        percentage: 100,
      },
      {
        label: { en: "Volunteers", cn: "志愿者" },
        value: "200+",
        percentage: 10,
      },
      {
        label: { en: "Mission Projects", cn: "宣教项目" },
        value: "7",
        percentage: 3,
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
  },

  {
    id: "pastors",
    type: "stat",
    category: { en: "Collective Global", cn: "全球集体" },
    title: { en: "Leaders equipped", cn: "领袖被装备" },
    value: "5",
    label: { en: "New Pastors", cn: "新授权牧师" },
  },

  {
    id: "momentum",
    type: "stat",
    category: { en: "Collective Global", cn: "全球集体" },
    title: { en: "And we’re growing", cn: "而且仍在成长" },
    value: "2",
    label: { en: "New Churches", cn: "新加入教会" },
  },

  // ACT 6 — INVITATION
  {
    id: "future-setup",
    type: "hero",
    title: { en: "2026 is bigger", cn: "2026 更大更远" },
    subtitle: {
      en: "And we can’t do it alone",
      cn: "我们无法独自完成",
    },
  },

  {
    id: "final-cta",
    type: "cta",
    category: { en: "2026", cn: "2026年" },
    title: { en: "Our faith goal", cn: "我们的信心目标" },
    value: "RM 1,500,000",
    label: { en: "Join Us", cn: "加入我们" },
    subtitle: {
      en: "Let’s build together",
      cn: "让我们一起建造",
    },
  },
];

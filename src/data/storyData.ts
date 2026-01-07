export interface Story {
  id: string;
  type: "stat" | "hero" | "quiz" | "image" | "cta";
  title?: { en: string; cn: string };
  subtitle?: { en: string; cn: string };
  value?: string;
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
  // Welcome
  {
    id: "welcome",
    type: "hero",
    title: { en: "2025 has been amazing", cn: "2025年太棒了" },
    subtitle: {
      en: "and we couldn't have done it without you",
      cn: "没有你我们无法做到",
    },
  },

  // Total Giving
  {
    id: "giving",
    type: "stat",
    title: {
      en: "Thank you for helping us raise this ENORMOUS amount!",
      cn: "感谢您帮助我们筹集了这笔巨款！",
    },
    value: "RM 1,688,244.50",
    label: { en: "Total Giving", cn: "总捐款" },
  },

  // Autrui Clinic
  {
    id: "autrui",
    type: "stat",
    title: { en: "1,000 Day Project", cn: "1000天计划" },
    subtitle: { en: "We sponsored 1000 babies", cn: "我们赞助了1000名婴儿" },
    value: "1,000",
    label: { en: "Babies Sponsored", cn: "赞助婴儿" },
  },

  // Loan Repayment
  {
    id: "loan",
    type: "stat",
    title: { en: "Loan Repayment Progress", cn: "贷款偿还进度" },
    subtitle: {
      en: "We're finally down to our last 10%",
      cn: "我们终于降到最后10%",
    },
    value: "RM 500,000",
    label: { en: "Paid Off", cn: "已还清" },
  },

  // Building Stats - Attendance
  {
    id: "attendance",
    type: "stat",
    value: "2,687",
    label: { en: "Stepped into Collective", cn: "进入Collective" },
  },

  // Accepted Christ
  {
    id: "accepted-christ",
    type: "stat",
    value: "273",
    label: { en: "Accepted Christ", cn: "接受基督" },
  },

  // Rooted in CG
  {
    id: "rooted",
    type: "stat",
    value: "480",
    label: { en: "Rooted in CG", cn: "扎根小组" },
  },

  // Volunteers
  {
    id: "volunteers",
    type: "stat",
    value: "150",
    label: { en: "Weekly Volunteers", cn: "每周志愿者" },
  },

  // Missions Quiz
  {
    id: "missions-quiz",
    type: "quiz",
    title: {
      en: "Guess how many lives have we impacted this year?",
      cn: "猜猜我们今年影响了多少生命？",
    },
    quizOptions: [
      { value: "220", label: "A. 220" },
      { value: "700", label: "B. 700" },
      { value: "543", label: "C. 543" },
      { value: "167", label: "D. 167" },
    ],
    correctAnswer: "700",
    revealText: { en: "700 lives impacted!", cn: "影响了700条生命！" },
  },

  // Missions Stats
  {
    id: "missions-lives",
    type: "stat",
    value: "700+",
    label: { en: "Lives Impacted", cn: "受影响的生命" },
  },

  {
    id: "missions-teeth",
    type: "stat",
    value: "2,000+",
    label: { en: "Tooth Removed", cn: "拔除牙齿" },
  },

  {
    id: "missions-volunteers",
    type: "stat",
    value: "200+",
    label: { en: "Volunteers", cn: "志愿者" },
  },

  // Missions Projects
  {
    id: "missions-projects",
    type: "stat",
    value: "7",
    label: { en: "Mission Projects Completed", cn: "完成的宣教项目" },
  },

  // Churches
  {
    id: "churches",
    type: "stat",
    title: { en: "Our Global Family", cn: "我们的全球家庭" },
    value: "17",
    label: { en: "Churches Across Asia", cn: "遍布亚洲的教会" },
  },

  // New Pastors
  {
    id: "pastors",
    type: "stat",
    value: "5",
    label: { en: "New Pastors Licensed", cn: "新授权牧师" },
  },

  // New Churches
  {
    id: "new-churches",
    type: "stat",
    value: "2",
    label: { en: "New Churches Joined", cn: "新教会加入" },
  },

  // Final CTA
  {
    id: "final-cta",
    type: "cta",
    title: { en: "We want to raise RM2.5mil", cn: "我们想筹集250万令吉" },
    subtitle: {
      en: "to do even crazier things and we want you to join us.",
      cn: "做更疯狂的事情，我们希望你加入我们。",
    },
    value: "RM 2,500,000",
    label: { en: "Join Us", cn: "加入我们" },
  },
];

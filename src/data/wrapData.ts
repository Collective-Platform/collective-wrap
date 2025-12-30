// Data structure for the church wrap website
export interface WrapData {
  chapters: Chapter[];
}

export interface Chapter {
  id: number;
  title: { en: string; cn: string };
  subtitle: { en: string; cn: string };
  cards: Card[];
}

export interface Card {
  id: string;
  type:
    | "hero"
    | "stat"
    | "multistat"
    | "quiz"
    | "story"
    | "list"
    | "people"
    | "expandable-story"
    | "expandable-list"
    | "cta";
  title?: { en: string; cn: string };
  subtitle?: { en: string; cn: string };
  content?: any;
}

export const wrapData: WrapData = {
  chapters: [
    {
      id: 0,
      title: { en: "Welcome", cn: "欢迎" },
      subtitle: { en: "2025 Year in Review", cn: "2025年度回顾" },
      cards: [
        {
          id: "hero-1",
          type: "hero",
          title: {
            en: "2025 has been amazing",
            cn: "2025年太棒了",
          },
          subtitle: {
            en: "and we couldn't have done it without you",
            cn: "没有你我们无法做到",
          },
        },
        {
          id: "hero-2",
          type: "hero",
          title: {
            en: "You gave. We counted.",
            cn: "你给予。我们计算。",
          },
        },
        {
          id: "giving-total",
          type: "stat",
          title: {
            en: "Thank you for helping us raise this ENORMOUS amount!",
            cn: "感谢您帮助我们筹集了这笔巨款！",
          },
          content: {
            value: "RM 1,688,244.50",
            label: { en: "Total Giving", cn: "总捐款" },
          },
        },
        {
          id: "hero-3",
          type: "hero",
          title: {
            en: "Here's what we've done!",
            cn: "这是我们所做的！",
          },
        },
      ],
    },
    {
      id: 1,
      title: { en: "Autrui Clinic", cn: "澳萃诊所" },
      subtitle: { en: "Caring for our community", cn: "关爱我们的社区" },
      cards: [
        {
          id: "autrui-babies",
          type: "stat",
          title: {
            en: "1,000 Day Project",
            cn: "1000天计划",
          },
          subtitle: {
            en: "We sponsored 1000 babies through our 1,000 day project",
            cn: "我们通过1000天项目赞助了1000名婴儿",
          },
          content: {
            value: "1,000",
            label: { en: "Babies Sponsored", cn: "赞助婴儿" },
          },
        },
      ],
    },
    {
      id: 2,
      title: { en: "Building", cn: "教会建设" },
      subtitle: { en: "Growing our church", cn: "发展我们的教会" },
      cards: [
        {
          id: "loan-repayment",
          type: "stat",
          title: {
            en: "Loan Repayment Progress",
            cn: "贷款偿还进度",
          },
          subtitle: {
            en: "We're finally down to our last 10%",
            cn: "我们终于降到最后10%",
          },
          content: {
            value: "RM 500,000",
            label: { en: "Paid Off", cn: "已还清" },
            progress: 90,
            description: {
              en: "Thanks to you we've paid off a big part of our loan",
              cn: "感谢您，我们已经还清了大部分贷款",
            },
          },
        },
        {
          id: "building-stats",
          type: "multistat",
          content: {
            stats: [
              {
                value: "2,687",
                label: {
                  en: "Stepped foot into Collective",
                  cn: "进入Collective",
                },
              },
              {
                value: "273",
                label: { en: "Accepted Christ", cn: "接受基督" },
              },
              {
                value: "480",
                label: {
                  en: "Rooted in CG and Ministry",
                  cn: "扎根于小组和事工",
                },
              },
              {
                value: "150",
                label: {
                  en: "Volunteers actively serving weekly",
                  cn: "每周积极服务的志愿者",
                },
              },
            ],
          },
        },
      ],
    },
    {
      id: 3,
      title: { en: "Missions", cn: "宣教事工" },
      subtitle: { en: "Impacting lives globally", cn: "影响全球生命" },
      cards: [
        {
          id: "missions-quiz",
          type: "quiz",
          title: {
            en: "Guess how many lives have we impacted this year?",
            cn: "猜猜我们今年影响了多少生命？",
          },
          content: {
            options: [
              { value: "220", label: "a. 220" },
              { value: "700", label: "b. 700" },
              { value: "543", label: "c. 543" },
              { value: "167", label: "d. 167" },
            ],
            correct: "700",
            reveal: {
              en: "700 lives impacted!",
              cn: "影响了700条生命！",
            },
          },
        },
        {
          id: "school-makeover",
          type: "expandable-story",
          title: {
            en: "School Makeover Story",
            cn: "学校改造故事",
          },
          content: {
            thumbnail:
              "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
            description: {
              en: "Watch how we transformed a school in Subang Jaya",
              cn: "观看我们如何改造梳邦再也的一所学校",
            },
            fullStory: {
              en: "Our team spent weeks planning and executing this school makeover project. We repainted classrooms, built new furniture, and created a vibrant learning environment for over 200 students. The transformation was incredible - from dull, worn-out spaces to bright, inspiring classrooms that sparked joy in every child's eyes.",
              cn: "我们的团队花了数周时间规划和执行这个学校改造项目。我们重新粉刷了教室，制作了新家具，为200多名学生创造了一个充满活力的学习环境。改造令人难以置信——从沉闷、破旧的空间变成明亮、鼓舞人心的教室，点燃了每个孩子眼中的喜悦。",
            },
          },
        },
        {
          id: "missions-projects",
          type: "expandable-list",
          title: {
            en: "We did 7 Missions Project",
            cn: "我们做了7个宣教项目",
          },
          content: {
            items: [
              {
                name: {
                  en: "Dental Mission — Refugee Community (Subang)",
                  cn: "牙科宣教 — 难民社区（梳邦）",
                },
                icon: "🦷",
                image: "missions/dental-subang.jpg",
                description: {
                  en: "Restoring dignity and relief through essential dental care.",
                  cn: "通过基本牙科护理恢复尊严与健康。",
                },
                fullStory: {
                  en: `Many refugees live with untreated dental pain due to limited access to healthcare.

• 100 patients received dental care  
• 106 fillings and 53 extractions completed  
• 38 volunteers and dentists served together`,
                  cn: `许多难民因缺乏医疗资源而长期忍受牙痛。

• 100人接受牙科护理  
• 完成106次补牙与53次拔牙  
• 38名志愿者与牙医共同服事`,
                },
              },

              {
                name: {
                  en: "Dental Mission — Sandakan Stateless Community",
                  cn: "牙科宣教 — 山打根无国籍社区",
                },
                icon: "🦷",
                image: "missions/dental-subang.jpg",
                description: {
                  en: "Extending healing and hope to underserved communities in East Malaysia.",
                  cn: "将医治与盼望带到东马弱势社区。",
                },
                fullStory: {
                  en: `Our team travelled to Sandakan to serve stateless communities with little access to dental care.

• 354 patients treated  
• 1,032 extractions and 118 fillings completed  
• 13 volunteers and dentists served`,
                  cn: `团队前往山打根，为几乎无法获得牙科护理的无国籍社区服务。

• 354人接受治疗  
• 完成1,032次拔牙与118次补牙  
• 13名志愿者与牙医参与`,
                },
              },

              {
                name: {
                  en: "Starfish Youth Camp — Kudat",
                  cn: "海星青年营 — 古达",
                },
                icon: "🏕️",
                image: "missions/dental-subang.jpg",
                description: {
                  en: "Empowering rural youth with encouragement, purpose, and hope.",
                  cn: "用鼓励、使命与盼望激励乡区青年。",
                },
                fullStory: {
                  en: `A 3-day camp designed to inspire and disciple rural youths.

• 51 youths aged 13–19+ impacted  
• 7 volunteers journeyed with them`,
                  cn: `为期三天的营会，鼓励并栽培乡区青年。

• 51名13–19岁青年参与  
• 7名志愿者陪伴同行`,
                },
              },

              {
                name: {
                  en: "Starfish Children’s Camp — Kudat",
                  cn: "海星儿童营 — 古达",
                },
                icon: "🎨",
                image: "missions/dental-subang.jpg",
                description: {
                  en: "Creating safe spaces for joy, learning, and encouragement.",
                  cn: "为孩子们创造充满喜乐与学习的安全空间。",
                },
                fullStory: {
                  en: `A nurturing camp focused on play, learning, and care.

• 37 primary school children reached  
• 13 volunteers served`,
                  cn: `透过游戏、学习与关怀，陪伴孩子成长。

• 37名小学生参与  
• 13名志愿者服事`,
                },
              },

              {
                name: {
                  en: "Love Is A Verb — Gift Box Initiative",
                  cn: "爱是行动 — 礼盒计划",
                },
                icon: "🎁",
                image: "missions/dental-subang.jpg",
                description: {
                  en: "Turning generosity into tangible love for refugee students.",
                  cn: "把慷慨化为难民学生可触摸的爱。",
                },
                fullStory: {
                  en: `Providing school essentials and a joyful Christmas experience.

• 213 students blessed  
• Over 70 volunteers involved`,
                  cn: `提供学习用品，并让孩子们体验充满喜乐的圣诞节。

• 213名学生受惠  
• 超过70名志愿者参与`,
                },
              },

              {
                name: {
                  en: "Love Is A Verb — Entrepreneurship Workshop",
                  cn: "爱是行动 — 创业工作坊",
                },
                icon: "💡",
                image: "missions/dental-subang.jpg",
                description: {
                  en: "Equipping young minds with confidence and real-world skills.",
                  cn: "用真实技能与信心装备年轻生命。",
                },
                fullStory: {
                  en: `A hands-on workshop helping students dream and create.

• 21 students empowered  
• Facilitated by volunteers and youth leaders`,
                  cn: `透过实践式教学，激发学生梦想与创造力。

• 21名学生受装备  
• 志愿者与青年领袖带领`,
                },
              },

              {
                name: {
                  en: "School Hall Makeover — Blessed Learning Center",
                  cn: "学校礼堂翻新 — 蒙福学习中心",
                },
                icon: "🏫",
                image: "missions/dental-subang.jpg",
                description: {
                  en: "Transforming spaces to serve communities better.",
                  cn: "翻新空间，更好服事社区。",
                },
                fullStory: {
                  en: `A renovation project creating a welcoming and functional hall.

• Over 213 students and staff benefited`,
                  cn: `翻新礼堂，为学习与社区活动创造更好的环境。

• 超过213名学生与教职员受惠`,
                },
              },
            ],
          },
        },
        {
          id: "missions-stats",
          type: "multistat",
          content: {
            stats: [
              {
                value: "700+",
                label: { en: "Lives Impacted", cn: "受影响的生命" },
              },
              {
                value: "2,000+",
                label: { en: "Tooth Removed", cn: "拔除牙齿" },
              },
              {
                value: "200+",
                label: { en: "Volunteers", cn: "志愿者" },
              },
            ],
          },
        },
      ],
    },
    {
      id: 4,
      title: { en: "Collective Global", cn: "全球集体" },
      subtitle: { en: "Expanding God's Kingdom", cn: "扩展神的国度" },
      cards: [
        {
          id: "new-pastors",
          type: "people",
          title: {
            en: "Licensed 5 new pastors this year",
            cn: "今年授权5位新牧师",
          },
          content: {
            people: [
              {
                name: "Pastor Nolan",
                image: "pastors/pastor-nolan.png",
              },
              { name: "Pastor Jay", image: "pastors/pastor-jay.png" },
              {
                name: "Pastor Caroline",
                image: "pastors/pastor-caroline.png",
              },
              {
                name: "Pastor Fredrick",
                image: "pastors/pastor-fredrick.png",
              },
              {
                name: "Pastor Samuel",
                image: "pastors/pastor-samuel.png",
              },
            ],
          },
        },
        {
          id: "church-stats",
          type: "multistat",
          content: {
            stats: [
              {
                value: "2",
                label: {
                  en: "New Churches joined our family",
                  cn: "新教会加入我们的大家庭",
                },
              },
              {
                value: "13",
                label: { en: "Total Churches", cn: "教会总数" },
              },
            ],
          },
        },
      ],
    },
    {
      id: 5,
      title: { en: "This Year 2026", cn: "2026年" },
      subtitle: { en: "Join us in doing more", cn: "与我们一起做更多" },
      cards: [
        {
          id: "2026-cta",
          type: "cta",
          title: {
            en: "We want to raise RM2.5mil",
            cn: "我们想筹集250万令吉",
          },
          subtitle: {
            en: "to do even crazier things and we want you to join us.",
            cn: "做更疯狂的事情，我们希望你加入我们。",
          },
          content: {
            target: "RM 2,500,000",
            cta: { en: "Join Us", cn: "加入我们" },
          },
        },
      ],
    },
  ],
};

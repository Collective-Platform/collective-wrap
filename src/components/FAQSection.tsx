import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface FAQSectionProps {
  lang: "en" | "cn";
}

export const FAQSection: React.FC<FAQSectionProps> = ({ lang }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    >
      <h3
        className={`text-5xl md:text-8xl leading-[1.1]  text-text-on-dark mb-4 tracking-wide ${
          lang === "cn" ? "font-chinese-heading" : "font-gc uppercase"
        }`}
      >
        {lang === "en" ? "FAQ" : "常见问题"}
      </h3>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-text-on-dark">
          <AccordionTrigger
            className={`text-left 
              text-lg md:text-2xl 
              text-text-on-dark hover:no-underline hover:text-text-accent ${
                lang === "cn"
                  ? "font-chinese-body tracking-widest"
                  : "font-normal"
              }`}
          >
            {lang === "en"
              ? "How will my gift be used if we don't reach the goal?"
              : "如果我们没有达到目标，我的奉献将如何使用？"}
          </AccordionTrigger>
          <AccordionContent
            className={`text-sm md:text-lg text-text-on-dark/70 leading-normal ${
              lang === "cn" ? "font-chinese-body tracking-widest" : ""
            }`}
          >
            {lang === "en"
              ? "Every gift will be put to work immediately. If needed, we'll prioritise projects that can be completed with the funds raised. For any urgent projects, we'll launch specific fundraising efforts to meet those needs."
              : "每一笔奉献将立即使用。如果有必要，这笔资金将优先开展能完成的项目。针对任何紧急项目，我们会另外启动专项筹款以满足相关需求。"}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="border-text-on-dark">
          <AccordionTrigger
            className={`text-left 
              text-lg md:text-2xl 
              font-normal text-text-on-dark hover:no-underline hover:text-text-accent ${
                lang === "cn" ? "font-chinese-body tracking-widest" : ""
              }`}
          >
            {lang === "en"
              ? "What if we exceed the goal?"
              : "如果所筹的资金必预期更多，将会如何使用？"}
          </AccordionTrigger>
          <AccordionContent
            className={`text-sm md:text-lg text-text-on-dark/70 leading-normal ${
              lang === "cn" ? "font-chinese-body tracking-widest" : ""
            }`}
          >
            {lang === "en"
              ? "If we're blessed to exceed our goal, any additional funds will continue to support our three priorities—church planting, building, and missions—extending the reach and impact of this campaign."
              : "如果我们达到比预期的目标更多，任何额外资金将继续支持我们的三大优先事项（植堂、建堂和宣教），为扩大这次活动的影响力。"}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className="border-text-on-dark">
          <AccordionTrigger
            className={`text-left text-text-on-dark text-lg md:text-2xl 
              font-normal hover:no-underline hover:text-text-accent ${
                lang === "cn" ? "font-chinese-body tracking-widest" : ""
              }`}
          >
            {lang === "en"
              ? "Can I designate my gift to church planting, building, or missions?"
              : "我可以指定我的奉献用于植堂、建堂或宣教吗？"}
          </AccordionTrigger>
          <AccordionContent
            className={`text-sm md:text-lg text-text-on-dark/70 leading-normal ${
              lang === "cn" ? "font-chinese-body tracking-widest" : ""
            }`}
          >
            {lang === "en"
              ? "All gifts go into a unified fund, allowing eldership to allocate resources where they'll make the greatest impact. We've found this approach is more effective than designated giving, which can sometimes leave funds \"stuck\" while urgent needs go unmet."
              : '所有奉献都进入统一基金，由长老团队将资源分配到最能产生影响的地方。我们发现这种方式比指定奉献更有效，因为指定奉献有时会导致资金"滞留"，而紧急需求无法满足。'}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
};

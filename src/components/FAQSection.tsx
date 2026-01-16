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
        className={`text-5xl md:text-8xl leading-[1.1] uppercase font-gc text-text-on-dark mb-4 tracking-wide ${
          lang === "cn" ? "font-chinese-heading" : ""
        }`}
      >
        {lang === "en" ? "Frequently Asked Questions" : "常见问题"}
      </h3>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-text-on-dark">
          <AccordionTrigger
            className={`text-left 
              text-lg md:text-2xl 
              font-normal
              text-text-on-dark hover:no-underline hover:text-text-accent ${
                lang === "cn" ? "font-chinese-body" : ""
              }`}
          >
            {lang === "en"
              ? "How will my gift be used if we don't hit the goal?"
              : "如果我们没有达到目标，我的奉献将如何使用？"}
          </AccordionTrigger>
          <AccordionContent
            className={`text-sm text-text-on-dark/70 leading-normal ${
              lang === "cn" ? "font-chinese-body" : ""
            }`}
          >
            {lang === "en"
              ? "Every gift will be put to work immediately. If needed, we'll prioritise projects that can be completed with the funds raised. For any urgent projects, we'll launch specific fundraising efforts to meet those needs."
              : "每一份奉献都会立即投入使用。如有需要，我们会优先完成筹集资金可支持的项目。对于任何紧急项目，我们会发起专门的筹款活动来满足需求。"}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="border-text-on-dark">
          <AccordionTrigger
            className={`text-left 
              text-lg md:text-2xl 
              font-normal text-text-on-dark hover:no-underline hover:text-text-accent ${
                lang === "cn" ? "font-chinese-body" : ""
              }`}
          >
            {lang === "en"
              ? "What if we exceed the goal?"
              : "如果我们超过目标怎么办？"}
          </AccordionTrigger>
          <AccordionContent
            className={`text-sm text-text-on-dark/70 leading-normal ${
              lang === "cn" ? "font-chinese-body" : ""
            }`}
          >
            {lang === "en"
              ? "If we're blessed to exceed our goal, any additional funds will continue to support our three priorities—church planting, building, and missions—extending the reach and impact of this campaign."
              : "如果我们有幸超过目标，任何额外资金将继续支持我们的三大优先事项——植堂、建堂和宣教——扩大这次活动的影响力。"}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className="border-text-on-dark">
          <AccordionTrigger
            className={`text-left text-text-on-dark text-lg md:text-2xl 
              font-normal hover:no-underline hover:text-text-accent ${
                lang === "cn" ? "font-chinese-body" : ""
              }`}
          >
            {lang === "en"
              ? "Can I designate my gift to church planting, building, or missions?"
              : "我可以指定我的奉献用于植堂、建堂或宣教吗？"}
          </AccordionTrigger>
          <AccordionContent
            className={`text-sm text-text-on-dark/70 leading-normal ${
              lang === "cn" ? "font-chinese-body" : ""
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

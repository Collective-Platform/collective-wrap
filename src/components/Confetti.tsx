import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<number[]>([]);

  useEffect(() => {
    setPieces(Array.from({ length: 50 }, (_, i) => i));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((i) => {
        const randomX = Math.random() * 100;
        const randomDelay = Math.random() * 0.5;
        const randomDuration = 1 + Math.random() * 1;
        const randomRotation = Math.random() * 360;
        const colors = [
          "#FFD700",
          "#FF6B9D",
          "#4ECDC4",
          "#95E1D3",
          "#F38181",
          "#AA96DA",
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        return (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              left: `${randomX}%`,
              top: "-10%",
              backgroundColor: randomColor,
            }}
            initial={{ y: 0, opacity: 1, rotate: 0 }}
            animate={{
              y: window.innerHeight + 50,
              opacity: 0,
              rotate: randomRotation,
            }}
            transition={{
              duration: randomDuration,
              delay: randomDelay,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
};

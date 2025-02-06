// space-background.js

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function SpaceBackground() {
  const [mounted, setMounted] = useState(false);
  const [meteors, setMeteors] = useState([]);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    const interval = setInterval(() => {
      setMeteors((prev) => [...prev, Date.now()]);
    }, 2000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 overflow-hidden bg-[#0a0a2e]" />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0a0a2e]">
      {/* Stars */}
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            scale: Math.random(),
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Meteors */}
      {meteors.map((timestamp) => (
        <div
          key={timestamp}
          className="absolute h-0.5 w-0.5 rotate-[215deg] animate-meteor"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        >
          <div className="absolute top-0 w-[50px] h-[1px] bg-gradient-to-r from-white to-transparent" />
        </div>
      ))}
    </div>
  );
}

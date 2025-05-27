"use client";

import { motion } from "framer-motion";
import { Zap, Cpu, BarChartBig, Code } from "lucide-react"; // Or other relevant icons

const Loading = () => {
  const coreVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "circOut" }
    },
  };

  const ringVariants = (delay: number, reverse: boolean = false) => ({
    initial: { opacity: 0, rotate: reverse ? 360 : 0 },
    animate: {
      opacity: [0, 0.6, 0.5, 0.6, 0],
      rotate: reverse ? 0 : 360,
      transition: {
        duration: 8 + delay * 2,
        repeat: Infinity,
        ease: "linear",
        delay: delay * 0.5,
        opacity: {
          duration: 4 + delay,
          repeat: Infinity,
          repeatType: "mirror" as const,
          ease: "easeInOut"
        }
      },
    },
  });

  const particleVariants = {
    initial: (i: number) => ({
      x: Math.random() * 100 - 50 + "vw",
      y: Math.random() * 100 - 50 + "vh",
      opacity: 0,
      scale: Math.random() * 0.5 + 0.2,
    }),
    animate: (i: number) => ({
      x: Math.random() * 80 - 40 + "vw",
      y: Math.random() * 80 - 40 + "vh",
      opacity: [0, Math.random() * 0.3 + 0.1, 0],
      scale: [Math.random() * 0.3 + 0.1, Math.random() * 0.6 + 0.3, Math.random() * 0.3 + 0.1],
      transition: {
        duration: Math.random() * 15 + 10,
        repeat: Infinity,
        repeatType: "mirror" as const,
        delay: i * 0.2,
        ease: "easeInOut",
      },
    }),
  };
  
  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: 0.5,
        ease: "easeOut"
       },
    },
     pulse: {
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1.2
      }
    }
  };

  const glowVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 0.05, 0.03, 0.05, 0],
      scale: [1, 1.5, 1],
      transition: {
        duration: 10,
        repeat: Infinity,
        repeatType: "mirror" as const,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-metamesh-dark text-gray-300 overflow-hidden">
      {/* Subtle background glow */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        variants={glowVariants}
        initial="initial"
        animate="animate"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[80vw] w-[80vw] md:h-[60vw] md:w-[60vw] rounded-full bg-gradient-radial from-metamesh-yellow/30 to-transparent blur-3xl opacity-20" />
      </motion.div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          custom={i}
          variants={particleVariants}
          initial="initial"
          animate="animate"
          className="absolute rounded-full bg-metamesh-yellow z-0"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
          }}
        />
      ))}

      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center"
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{duration: 0.5}}
      >
        {/* Central Quantum Core */}
        <motion.div
          className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center mb-8"
          variants={coreVariants}
          initial="initial"
          animate="animate"
        >
          {/* Outer Rings */}
          <motion.div
            className="absolute w-full h-full border-2 border-metamesh-gray/40 rounded-full"
            variants={ringVariants(0)}
            initial="initial"
            animate="animate"
          />
          <motion.div
            className="absolute w-[85%] h-[85%] border border-metamesh-gray/30 rounded-full"
            variants={ringVariants(0.8, true)}
            initial="initial"
            animate="animate"
          />
          <motion.div
            className="absolute w-[70%] h-[70%] border-2 border-metamesh-yellow/50 rounded-full"
            variants={ringVariants(1.5)}
            initial="initial"
            animate="animate"
          />

          {/* Inner Pulsing Core Element (Icon or Shape) */}
          <motion.div 
            className="relative"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror", ease:"easeInOut" }}
          >
            <Cpu className="w-12 h-12 md:w-16 md:h-16 text-metamesh-yellow" />
          </motion.div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
            variants={textVariants}
            initial="initial"
            animate={["animate", "pulse"]}
        >
            <p className="text-lg md:text-xl font-light tracking-wider text-metamesh-yellow/80">
              CONNECTING TO ZENOVA NETWORK
            </p>
            <div className="w-3/4 h-0.5 bg-gradient-to-r from-transparent via-metamesh-yellow/50 to-transparent mx-auto mt-3"></div>
        </motion.div>
        
        {/* Optional: Sub-status text or icons */}
        <motion.div 
          className="flex space-x-6 mt-10"
          initial={{opacity:0}}
          animate={{opacity:1}}
          transition={{delay:0.8, duration:0.5}}
        >
            <motion.div className="flex items-center text-xs text-gray-500" initial={{y:10}} animate={{y:0}} transition={{delay:1, duration:0.3}}>
                <Zap size={14} className="mr-1.5 text-metamesh-yellow/50" /> AI Core Sync...
            </motion.div>
            <motion.div className="flex items-center text-xs text-gray-500" initial={{y:10}} animate={{y:0}} transition={{delay:1.2, duration:0.3}}>
                <BarChartBig size={14} className="mr-1.5 text-metamesh-yellow/50" /> Market Data...
            </motion.div>
            <motion.div className="flex items-center text-xs text-gray-500" initial={{y:10}} animate={{y:0}} transition={{delay:1.4, duration:0.3}}>
                <Code size={14} className="mr-1.5 text-metamesh-yellow/50" /> Smart Contracts...
            </motion.div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Loading; 
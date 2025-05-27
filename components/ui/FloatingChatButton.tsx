import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Bot } from "lucide-react";
import FloatingChatInterface from "./FloatingChatInterface";

const FloatingChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && <FloatingChatInterface onClose={() => setIsOpen(false)} />}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group w-16 h-16 rounded-full border-2 transition-all duration-300 overflow-hidden ${
            isOpen
              ? "bg-metamesh-yellow border-metamesh-yellow text-metamesh-dark"
              : "bg-metamesh-dark-card border-metamesh-yellow/50 text-metamesh-yellow hover:border-metamesh-yellow"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-metamesh-yellow/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Animated background pulse */}
          <motion.div
            className="absolute inset-0 bg-metamesh-yellow/10 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Icon */}
          <div className="relative z-10 flex items-center justify-center w-full h-full">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: 180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -180, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <MessageCircle className="h-6 w-6" />
                  {/* AI indicator dot */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-metamesh-dark-card"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
      </motion.div>
    </>
  );
};

export default FloatingChatButton;

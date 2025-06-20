"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import FloatingChatButton from "../ui/FloatingChatButton";
interface LayoutProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-metamesh-dark mesh-bg">
      <Navbar />
      <motion.main
        className="flex-grow pt-16 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <Footer />
      <FloatingChatButton />
    </div>
  );
};

export default LayoutWrapper;

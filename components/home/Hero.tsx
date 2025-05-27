"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import AnimatedButton from '../ui/AnimatedButton';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  // Token allocation categories with typing animation
  const allocationCategories = useMemo(() => [
    "Company Equity", 
    "Investor Tokens", 
    "Market Reserve", 
    "AI Regulated Supply"
  ], []);
  
  // Additional allocation sections with typing animation
  const topPerformingCompanies = useMemo(() => [
    "TechCorp Global",
    "FinInnovate",
    "BioScience Pro",
    "EcoEnergy Inc.",
    "MetaVerse Systems",
    "Quantum Solutions",
    "GreenTech Innovations",
    "CyberSecure Inc."
  ], []);

  // Allocation percentages with typing animation
  const allocationPercentages = useMemo(() => [
    "65% - Initial offering",
    "20% - Market stabilization",
    "10% - Future expansion",
    "5% - Treasury reserve"
  ], []);

  // Allocation features with typing animation
  const allocationFeatures = useMemo(() => [
    "Smart contract enabled",
    "Real-time valuation",
    "Instant settlement",
    "Fraud-proof design"
  ], []);

  // State for main allocation categories
  const [currentCategory, setCurrentCategory] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State for top performing companies
  const [currentCompany, setCurrentCompany] = useState("");
  const [companyIndex, setCompanyIndex] = useState(0);
  const [companyCharIndex, setCompanyCharIndex] = useState(0);
  const [isCompanyDeleting, setIsCompanyDeleting] = useState(false);

  // State for allocation percentages
  const [currentPercentage, setCurrentPercentage] = useState("");
  const [percentageIndex, setPercentageIndex] = useState(0);
  const [percentageCharIndex, setPercentageCharIndex] = useState(0);
  const [isPercentageDeleting, setIsPercentageDeleting] = useState(false);

  // State for allocation features
  const [currentFeature, setCurrentFeature] = useState("");
  const [featureIndex, setFeatureIndex] = useState(0);
  const [featureCharIndex, setFeatureCharIndex] = useState(0);
  const [isFeatureDeleting, setIsFeatureDeleting] = useState(false);

  // Animation for token allocation categories
  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100; // Faster when deleting
    
    if (!isDeleting && charIndex === allocationCategories[categoryIndex].length) {
      // Pause at the end of typing out a word
      setTimeout(() => setIsDeleting(true), 1500);
      return;
    }
    
    if (isDeleting && charIndex === 0) {
      // Move to next category
      setIsDeleting(false);
      setCategoryIndex((prev) => (prev + 1) % allocationCategories.length);
      return;
    }
    
    const timeout = setTimeout(() => {
      setCurrentCategory(
        allocationCategories[categoryIndex].substring(0, charIndex + (isDeleting ? -1 : 1))
      );
      setCharIndex(charIndex + (isDeleting ? -1 : 1));
    }, typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [charIndex, categoryIndex, isDeleting, allocationCategories]);

  // Animation for top performing companies
  useEffect(() => {
    const typingSpeed = isCompanyDeleting ? 50 : 100;
    
    if (!isCompanyDeleting && companyCharIndex === topPerformingCompanies[companyIndex].length) {
      setTimeout(() => setIsCompanyDeleting(true), 1500);
      return;
    }
    
    if (isCompanyDeleting && companyCharIndex === 0) {
      setIsCompanyDeleting(false);
      setCompanyIndex((prev) => (prev + 1) % topPerformingCompanies.length);
      return;
    }
    
    const timeout = setTimeout(() => {
      setCurrentCompany(
        topPerformingCompanies[companyIndex].substring(0, companyCharIndex + (isCompanyDeleting ? -1 : 1))
      );
      setCompanyCharIndex(companyCharIndex + (isCompanyDeleting ? -1 : 1));
    }, typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [companyCharIndex, companyIndex, isCompanyDeleting, topPerformingCompanies]);

  // Animation for allocation percentages
  useEffect(() => {
    const typingSpeed = isPercentageDeleting ? 50 : 100;
    
    if (!isPercentageDeleting && percentageCharIndex === allocationPercentages[percentageIndex].length) {
      setTimeout(() => setIsPercentageDeleting(true), 1500);
      return;
    }
    
    if (isPercentageDeleting && percentageCharIndex === 0) {
      setIsPercentageDeleting(false);
      setPercentageIndex((prev) => (prev + 1) % allocationPercentages.length);
      return;
    }
    
    const timeout = setTimeout(() => {
      setCurrentPercentage(
        allocationPercentages[percentageIndex].substring(0, percentageCharIndex + (isPercentageDeleting ? -1 : 1))
      );
      setPercentageCharIndex(percentageCharIndex + (isPercentageDeleting ? -1 : 1));
    }, typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [percentageCharIndex, percentageIndex, isPercentageDeleting, allocationPercentages]);

  // Animation for allocation features
  useEffect(() => {
    const typingSpeed = isFeatureDeleting ? 50 : 100;
    
    if (!isFeatureDeleting && featureCharIndex === allocationFeatures[featureIndex].length) {
      setTimeout(() => setIsFeatureDeleting(true), 1500);
      return;
    }
    
    if (isFeatureDeleting && featureCharIndex === 0) {
      setIsFeatureDeleting(false);
      setFeatureIndex((prev) => (prev + 1) % allocationFeatures.length);
      return;
    }
    
    const timeout = setTimeout(() => {
      setCurrentFeature(
        allocationFeatures[featureIndex].substring(0, featureCharIndex + (isFeatureDeleting ? -1 : 1))
      );
      setFeatureCharIndex(featureCharIndex + (isFeatureDeleting ? -1 : 1));
    }, typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [allocationFeatures, featureCharIndex, featureIndex, isFeatureDeleting]);

  return (
    <div className="relative overflow-hidden py-20 lg:py-32">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-10 left-1/4 h-64 w-64 rounded-full bg-gradient-radial from-metamesh-yellow/20 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-gradient-radial from-metamesh-yellow/10 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-block">
            <span className="rounded-full bg-metamesh-yellow/10 border border-metamesh-yellow/30 px-3 py-1 text-sm text-metamesh-yellow mb-8 inline-block">
              <span className="animate-pulse mr-2 inline-block h-2 w-2 rounded-full bg-metamesh-yellow"></span>
              The Future of Stocks
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 gradient-text"
          >
            Tokenized. <br className="hidden sm:block" /> 
            Intelligent. <span className="relative">
              <span className="relative text-gray-400 hover:text-white cursor-pointer">Autonomous</span>
              <motion.span 
                className="absolute bottom-0 left-0 h-1 bg-metamesh-yellow"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1, duration: 1 }}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-400 max-w-3xl mx-auto mb-8"
          >
            Revolutionizing how companies go public and how stocks are traded. 
            AI-driven valuation, blockchain tokenization, and 
            autonomous trading — all in one platform.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <AnimatedButton to="/assets" size="lg">
              Explore Companies
            </AnimatedButton>
            <AnimatedButton to="/onboarding" variant="outline" size="lg">
              Join Zenova 🚀
            </AnimatedButton>
          </motion.div>
          
          <motion.div 
            className="mt-16 relative"
            variants={itemVariants}
          >
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl border border-metamesh-gray/50 bg-metamesh-dark-light shadow-2xl shadow-metamesh-yellow/5">
              <div className="flex items-center justify-start border-b border-metamesh-gray/50 bg-metamesh-dark-card p-2">
                <div className="flex space-x-1.5 px-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 md:col-span-2">
                    <div className="h-40 rounded-lg border border-metamesh-gray/50 bg-metamesh-dark p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm text-metamesh-yellow">Market Performance</div>
                        <div className="h-2 w-2 rounded-full bg-green-400"></div>
                      </div>
                      <div className="flex h-24 items-end justify-between">
                        {[35, 55, 40, 65, 45, 60, 75, 50, 80, 70].map((h, i) => (
                          <motion.div
                            key={i}
                            className="w-[8%] bg-metamesh-yellow/50"
                            style={{ height: `${h}%` }}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{
                              delay: 1 + i * 0.1,
                              duration: 0.5,
                              ease: "easeOut"
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 h-40 rounded-lg border border-metamesh-gray/50 bg-metamesh-dark p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm text-metamesh-yellow">Token Allocation</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-metamesh-yellow mr-2"></div>
                          <div className="h-6 flex items-center">
                            <span className="text-sm text-white mr-2">
                              {currentCategory}
                            </span>
                            <span className="h-4 w-0.5 bg-white/70 animate-pulse"></span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-metamesh-yellow mr-2"></div>
                          <div className="h-6 flex items-center">
                            <span className="text-sm text-white mr-2">
                              {currentPercentage}
                            </span>
                            <span className="h-4 w-0.5 bg-white/70 animate-pulse"></span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-metamesh-yellow mr-2"></div>
                          <div className="h-6 flex items-center">
                            <span className="text-sm text-white mr-2">
                              {currentFeature}
                            </span>
                            <span className="h-4 w-0.5 bg-white/70 animate-pulse"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-1">
                    <div className="h-full rounded-lg border border-metamesh-gray/50 bg-metamesh-dark p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm text-metamesh-yellow">Top Performing</div>
                      </div>
                      <div className="space-y-3 mt-3">
                        <div className="p-2 border border-metamesh-gray/50 bg-metamesh-dark-light rounded flex items-center justify-between">
                          <div className="flex items-center h-6">
                            <span className="text-xs mr-2">{currentCompany}</span>
                            <span className="h-4 w-0.5 bg-white/70 animate-pulse"></span>
                          </div>
                          <span className="h-2 w-2 rounded-full bg-green-400"></span>
                        </div>
                        <motion.div 
                          className="p-2 border border-metamesh-gray/50 bg-metamesh-dark-light rounded flex items-center justify-between"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.5, duration: 0.5 }}
                        >
                          <div className="flex items-center">
                            <span className="text-xs">NeuroAI Labs</span>
                            <span className="ml-1 text-xs text-green-400">+24.8%</span>
                          </div>
                          <span className="h-2 w-2 rounded-full bg-green-400"></span>
                        </motion.div>
                        <motion.div 
                          className="p-2 border border-metamesh-gray/50 bg-metamesh-dark-light rounded flex items-center justify-between"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.7, duration: 0.5 }}
                        >
                          <div className="flex items-center">
                            <span className="text-xs">Blockchain United</span>
                            <span className="ml-1 text-xs text-green-400">+18.3%</span>
                          </div>
                          <span className="h-2 w-2 rounded-full bg-green-400"></span>
                        </motion.div>
                        <motion.div 
                          className="p-2 border border-metamesh-gray/50 bg-metamesh-dark-light rounded flex items-center justify-between"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.9, duration: 0.5 }}
                        >
                          <div className="flex items-center">
                            <span className="text-xs">SpaceX Enterprise</span>
                            <span className="ml-1 text-xs text-green-400">+15.2%</span>
                          </div>
                          <span className="h-2 w-2 rounded-full bg-green-400"></span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Glow effect */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-40 w-3/4 rounded-full bg-metamesh-yellow/10 blur-3xl"></div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;

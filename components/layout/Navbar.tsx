"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ZenovaCustomConnectButton } from '@/components/ui/ZenovaCustomConnectButton';
import UsdtBalance from '@/components/layout/UsdtBalance';
import { useUIFocus, UIFocusTarget } from '@/contexts/UIFocusContext';

const navLinks = [
  { text: "Home", path: "/" },
  { text: "Assets", path: "/assets" },
  { text: "Portfolio", path: "/portfolio" },
  { text: "Platform Stats", path: "/platform-stats" }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { focusElement, setFocusElement } = useUIFocus();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isConnectButtonFocused = focusElement === UIFocusTarget.NAVBAR_CONNECT_BUTTON;

  useEffect(() => {
    if (isConnectButtonFocused) {
      const timer = setTimeout(() => {
        setFocusElement(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isConnectButtonFocused, setFocusElement]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-effect border-b border-metamesh-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 relative">
                <motion.div
                  className="absolute inset-0 bg-metamesh-yellow rounded-full opacity-60"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">Z</span>
                </div>
              </div>
              <span className="ml-2 text-xl font-bold tracking-tight text-white">
                Zen<span className="text-metamesh-yellow">ova</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-6">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.path}
                  className="text-gray-300 hover:text-metamesh-yellow px-1 py-2 text-sm font-medium transition-colors relative group"
                >
                  {link.text}
                  <motion.span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-metamesh-yellow"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              ))}

              <UsdtBalance />
              <div className={`${isConnectButtonFocused ? 'animate-pulse-strong' : ''} rounded-md`}>
                <ZenovaCustomConnectButton />
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden bg-metamesh-dark-light border-b border-metamesh-gray"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.path}
                className="text-gray-300 hover:text-metamesh-yellow block px-3 py-2 text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.text}
              </Link>
            ))}

            <div className="mt-2 space-y-2">
              <UsdtBalance />
              <div className={`${isConnectButtonFocused ? 'animate-pulse-strong' : ''} rounded-md`}>
                <ZenovaCustomConnectButton />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};


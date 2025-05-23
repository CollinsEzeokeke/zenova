"use client";

import React from 'react';
import Link from 'next/link';


export default function Footer() {
    return (
        <footer className="bg-metamesh-dark-light border-t border-metamesh-gray mt-auto">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-white">
                Zen<span className="text-metamesh-yellow">ova</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Revolutionizing stock trading through AI-powered tokenization and autonomous pricing.
            </p>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/marketplace" className="text-gray-400 hover:text-metamesh-yellow">
                  Tokenized Markets
                </Link>
              </li>
              <li>
                <Link href="/modules" className="text-gray-400 hover:text-metamesh-yellow">
                  Company Tokens
                </Link>
              </li>
              <li>
                <Link href="/build" className="text-gray-400 hover:text-metamesh-yellow">
                  Investment Portfolio
                </Link>
              </li>
              <li>
                <Link href="/monitoring" className="text-gray-400 hover:text-metamesh-yellow">
                  AI Valuation
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-metamesh-yellow">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-gray-400 hover:text-metamesh-yellow">
                  Investor Guides
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-gray-400 hover:text-metamesh-yellow">
                  API Reference
                </Link>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-metamesh-yellow">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-metamesh-yellow">
                  About
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-metamesh-yellow">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-metamesh-yellow">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-metamesh-yellow">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-metamesh-gray pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Zenova. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/terms" className="text-gray-400 hover:text-metamesh-yellow text-xs">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-metamesh-yellow text-xs">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-metamesh-yellow text-xs">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


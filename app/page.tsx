"use client";

import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import { motion } from 'framer-motion';
import AnimatedButton from '../components/ui/AnimatedButton';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Features />
      
      {/* Testimonials Section */}
      <section className="py-16 bg-metamesh-dark-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Trusted by Companies & Investors
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              See how businesses and investors are leveraging Zenova&apos;s tokenized stock platform
              for transparent, efficient capital markets.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Zenova's AI valuation was spot-on with our internal metrics. The tokenization process was seamless and gave us global reach.",
                author: "Alex Chen",
                role: "CFO, NextGen Technologies",
              },
              {
                quote: "The autonomous pricing algorithms provide liquidity and stability that traditional exchanges simply cannot match.",
                author: "Sarah Johnson",
                role: "Investment Director, Horizon Capital",
              },
              {
                quote: "For the first time, we were able to go public without the cost and complications of traditional IPOs. Game-changer for mid-sized companies.",
                author: "Michael Rodriguez",
                role: "CEO, EcoSolutions Inc.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-metamesh-dark p-6 rounded-lg border border-metamesh-gray"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-4 text-metamesh-yellow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.039 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983V18H0Z"/>
                  </svg>
                </div>
                <p className="text-gray-300 mb-4">{testimonial.quote}</p>
                <div>
                  <p className="font-medium text-white">{testimonial.author}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-metamesh-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-mesh-pattern"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="bg-metamesh-yellow/10 text-metamesh-yellow px-4 py-1 rounded-full text-sm font-medium">
                Get Started Today
              </span>
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-bold mt-6 mb-6 gradient-text">
              The Future of Stock Markets is Here
            </h2>
            
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join the tokenized stock revolution and experience an entirely new way to invest in companies.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <AnimatedButton to="/docs" size="lg">
                How It Works
              </AnimatedButton>
              <AnimatedButton to="/build" variant="outline" size="lg">
                Start Investing
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

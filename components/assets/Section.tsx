"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon: Icon, children }) => (
    <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
    >
        <div className="flex items-center mb-6 pb-4 border-b border-metamesh-gray/30">
            <div className="p-2.5 bg-metamesh-yellow/10 rounded-lg mr-4 border border-metamesh-yellow/20">
                <Icon className="h-6 w-6 text-metamesh-yellow" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-white glow-text tracking-wide">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {React.Children.map(children, (child, index) => {
                // Define an interface for child props to avoid `any`
                interface ChildProps {
                    fullWidth?: boolean;
                    // Add other potential props if known, otherwise keep it minimal
                }
                const childProps = React.isValidElement(child) ? child.props as ChildProps : {};
                const isFullWidth = childProps.fullWidth;
                return (
                    <div key={index} className={isFullWidth ? "md:col-span-2" : ""}>
                        {child}
                    </div>
                );
            })}
        </div>
    </motion.div>
);

export default Section; 
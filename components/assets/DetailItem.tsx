"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, AlertTriangle } from 'lucide-react';
import { formatAddressShort } from '@/src/utils/formatters';

interface DetailItemProps {
    icon: React.ElementType;
    label: string;
    value?: string | number | boolean | null;
    isTag?: boolean;
    isBoolean?: boolean;
    unit?: string;
    children?: React.ReactNode;
    isAddress?: boolean;
    fullWidth?: boolean;
    className?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({
    icon: Icon,
    label,
    value,
    isTag,
    isBoolean,
    unit,
    children,
    isAddress,
    fullWidth,
    className
}) => {
    let displayValue: React.ReactNode = value;

    if (isAddress && typeof value === 'string') {
        displayValue = <span title={value} className="cursor-help">{formatAddressShort(value)}</span>;
    } else if (typeof value === 'boolean') {
        displayValue = value ? <BadgeCheck className="h-5 w-5 text-green-400" /> : <AlertTriangle className="h-5 w-5 text-red-400" />;
    } else if (isTag) {
        displayValue = <span className="px-3 py-1.5 text-xs bg-metamesh-yellow/10 text-metamesh-yellow border border-metamesh-yellow/30 rounded-full shadow-sm font-medium">{value}</span>;
    } else if (unit && value !== null && value !== undefined && !isBoolean) {
        displayValue = <><span className="font-mono text-white">{value}</span> <span className="text-xs text-gray-400 ml-1">{unit}</span></>;
    } else if (value === null || value === undefined) {
        displayValue = <span className="text-gray-500 italic">N/A</span>;
    } else {
        displayValue = <span className="font-mono text-white">{String(value)}</span>;
    }

    return (
        <motion.div
            className={`flex items-start space-x-4 p-5 bg-gradient-to-br from-metamesh-dark-card to-metamesh-dark-card/80 border border-metamesh-gray/50 rounded-xl card-highlight hover:border-metamesh-yellow/60 hover:shadow-lg transition-all duration-300 glow-on-hover backdrop-blur-sm ${fullWidth ? "col-span-1 md:col-span-2" : ""} ${className}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            <div className="flex-shrink-0 mt-0.5 p-2.5 bg-metamesh-yellow/10 rounded-lg border border-metamesh-yellow/20">
                <Icon className="h-5 w-5 text-metamesh-yellow" />
            </div>
            <div className="flex-grow min-w-0 overflow-hidden">
                <p className="text-sm text-gray-400 mb-1 font-medium">{label}</p>
                {children ?
                    <div className="text-base text-white break-words overflow-hidden">{children}</div> :
                    <div className="text-base font-medium text-white break-words overflow-hidden" title={typeof value === 'string' ? value : undefined}>
                        {displayValue}
                    </div>
                }
            </div>
        </motion.div>
    );
};

export default DetailItem; 
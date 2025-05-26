"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const AssetDetailsSkeleton: React.FC = () => (
    <div className="min-h-screen py-12 md:py-16 mesh-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
                <Skeleton className="h-16 w-3/4 mx-auto bg-metamesh-gray/30 rounded-md mb-4" />
                <Skeleton className="h-6 w-1/2 mx-auto bg-metamesh-gray/20 rounded-md" />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3 space-y-10">
                    {Array(4).fill(0).map((_, sectionIndex) => (
                        <div key={sectionIndex} className="space-y-6">
                            <Skeleton className="h-10 w-1/3 bg-metamesh-gray/30 rounded-md" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Array(4).fill(0).map((_, i) => (
                                    <div key={i} className="flex items-start space-x-4 p-5 bg-metamesh-dark-card border border-metamesh-gray/50 rounded-xl">
                                        <Skeleton className="h-8 w-8 rounded-lg bg-metamesh-gray/30" />
                                        <div className="flex-grow space-y-2">
                                            <Skeleton className="h-4 w-1/3 bg-metamesh-gray/30 rounded-sm" />
                                            <Skeleton className="h-6 w-2/3 bg-metamesh-gray/30 rounded-sm" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="xl:col-span-1">
                    <div className="sticky top-28">
                        <Skeleton className="h-[600px] w-full bg-metamesh-dark-card border border-metamesh-gray/50 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default AssetDetailsSkeleton; 
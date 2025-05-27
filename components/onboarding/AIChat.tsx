"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Maximize2, Minimize2 } from 'lucide-react';
import SciFiButton from '@/components/ui/SciFiButton';
import { useAccount } from "wagmi";

import {
  AssistantRuntimeProvider,
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "../thread";
import { toast } from "sonner";

interface AIChatProps {
  className?: string;
}

// The main AIChat component that wraps everything
const AIChat: React.FC<AIChatProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { address } = useAccount();

  // Set up the runtime with useChatRuntime, just like in ZenovaAIChat.tsx
  const runtime = useChatRuntime({
    api: "/api/chat",
    adapters: {
      attachments: new CompositeAttachmentAdapter([
        new SimpleImageAttachmentAdapter(),
        new SimpleTextAttachmentAdapter(),
      ]),
    },
    headers: {
      "X-User-Address": address || "unknown",
    },
    onError: (error: Error) => {
      console.error("Zenova Onboarding Chat error:", error);
      toast.error("Chat Error: " + error.message);
    },
  });

  // This is a simplified version that just provides the UI shell
  // Thread component will handle the actual chat display and input
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className={`bg-metamesh-dark-card border border-metamesh-gray rounded-lg overflow-hidden flex flex-col ${className}`}>
        {/* Chat Header */}
        <div className="bg-metamesh-dark border-b border-metamesh-gray p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <h3 className="text-white font-semibold">ZenovaAI Console</h3>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                className="flex items-center space-x-2"
                animate={{ opacity: 1 }}
              >
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-sm text-green-400">
                  Online
                </span>
              </motion.div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Message area with Thread component */}
        <div className={`flex-1 overflow-y-auto p-4`}>
          <Thread className='h-full w-full' />
        </div>
        
        {/* No custom input handling for now, let Thread handle it */}
        {/* This input area is just for visual consistency with your UI */}
        <div className="hidden">
          <div className="border-t border-metamesh-gray p-4 flex-shrink-0">
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Type your response to ZenovaAI..."
                className="flex-1 bg-metamesh-dark border border-metamesh-gray rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-metamesh-yellow/50 focus:outline-none transition-colors"
              />
              <SciFiButton 
                variant="primary"
                className="px-4"
              >
                <Send className="h-4 w-4" />
              </SciFiButton>
            </div>
          </div>
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
};

export default AIChat;

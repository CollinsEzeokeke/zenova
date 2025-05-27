"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Minimize2, Maximize2 } from 'lucide-react';

// Assistant UI Imports
import {
  AssistantRuntimeProvider,
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "../thread";
import { toast } from "sonner";
import { useAccount } from "wagmi";

interface FloatingChatInterfaceProps {
  onClose: () => void;
}

const FloatingChatInterface: React.FC<FloatingChatInterfaceProps> = ({ onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const { address } = useAccount();

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
      console.error("Zenova Floating Chat error:", error);
      toast.error("Chat Error: " + error.message);
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        height: isMinimized ? 'auto' : '500px'
      }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-24 right-6 z-40 w-96 bg-metamesh-dark-card border border-metamesh-gray rounded-lg shadow-2xl overflow-hidden flex flex-col"
    >
      <div className="bg-metamesh-dark border-b border-metamesh-gray p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bot className="h-6 w-6 text-metamesh-yellow" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h3 className="text-white font-semibold">ZenovaAI Assistant</h3>
              <p className="text-xs text-green-400">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex-1 relative overflow-hidden">
          <AssistantRuntimeProvider runtime={runtime}>
            <div className="absolute inset-0 overflow-y-auto">
              <Thread />
            </div>
          </AssistantRuntimeProvider>
        </div>
      )}
    </motion.div>
  );
};

export default FloatingChatInterface;

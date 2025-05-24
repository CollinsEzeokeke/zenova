"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  AssistantRuntimeProvider,
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { useChat } from "@ai-sdk/react";
import { Thread } from "../thread";
import { toast } from "sonner";
import SciFiButton from "../ui/SciFiButton";

interface OnboardingAIChatProps {
  initialStage: number;
  onAIStageChange: (newStage: number) => void;
}

const OnboardingAIChat: React.FC<OnboardingAIChatProps> = ({ initialStage, onAIStageChange }) => {
  const { address } = useAccount();
  const [currentLocalStage, setCurrentLocalStage] = useState(initialStage);

  useEffect(() => {
    setCurrentLocalStage(initialStage);
  }, [initialStage]);

  const { messages, append, error: chatError, setMessages } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: '0',
        role: 'assistant',
        content: `ZenovaAI Onboarding: Stage ${currentLocalStage}. Let's begin.`
      }
    ],
    headers: {
      'X-User-Address': address || 'unknown',
      'X-Onboarding-Stage': String(currentLocalStage)
    },
    onError: (err: Error) => {
      console.error("Vercel Chat Hook error:", err);
      toast.error("AI Chat Error (Vercel SDK): " + err.message);
    }
  });

  const assistantRuntime = useChatRuntime({
    api: "/api/chat",
    adapters: {
      attachments: new CompositeAttachmentAdapter([
        new SimpleImageAttachmentAdapter(),
        new SimpleTextAttachmentAdapter(),
      ]),
    },
    headers: {
      'X-User-Address': address || 'unknown',
      'X-Onboarding-Stage': String(currentLocalStage)
    },
  });

  useEffect(() => {
    if (chatError) {
      toast.error("Chat Error: " + chatError.message);
    }
  }, [chatError]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && typeof lastMessage.content === 'string') {
        const stageMatch = lastMessage.content.match(/STAGE_TRANSITION:(\\d+)/);
        if (stageMatch && stageMatch[1]) {
          const newStage = parseInt(stageMatch[1], 10);
          if (!isNaN(newStage) && newStage !== currentLocalStage) {
            console.log(`AI signaled stage transition to: ${newStage}`);
            onAIStageChange(newStage);
            if (messages.length === 1) {
                 setMessages([
                    {
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: `ZenovaAI Onboarding: Stage ${newStage}. Resuming session.`
                    }
                 ]);
            }
          }
        }
      }
    }
  }, [messages, onAIStageChange, currentLocalStage, setMessages]);

  const handleQuickClick = (text: string) => {
    append({ 
        role: "user",
        content: text,
    }, {
        headers: {
            'X-User-Address': address || 'unknown',
            'X-Onboarding-Stage': String(currentLocalStage)
        }
    });
  };

  const accentColor = "metamesh-yellow";
  const darkBgColor = "metamesh-dark-card";

  const getQuickClickSuggestions = (stage: number) => {
    if (stage === 1) {
      return ["Hi ZenovaAI!", "What information do you need first?", "Let's start onboarding."];
    }
    return [];
  };

  const quickClickSuggestions = getQuickClickSuggestions(currentLocalStage);

  return (
    <AssistantRuntimeProvider runtime={assistantRuntime}>
      <div 
        className={`w-full bg-${darkBgColor} border border-${accentColor}/30 rounded-lg p-4 flex flex-col shadow-lg glow-border`}
        style={{
          height: '600px', // Initial height
          minHeight: '300px', // Minimum resizable height
          maxHeight: '80vh',  // Maximum resizable height (e.g., 80% of viewport height)
          resize: 'vertical',
          overflow: 'auto',
        }}
      >
        <h2 className={`text-xl font-semibold text-${accentColor} mb-3 font-orbitron glow-text`}>
          ZenovaAI Onboarding Assistant (Stage: {currentLocalStage})
        </h2>
        <div className="flex-grow overflow-y-auto mb-2" style={{ scrollbarWidth: 'thin' }}>
          <Thread />
        </div>
        {quickClickSuggestions.length > 0 && (
          <div className="mt-2 pt-2 border-t border-metamesh-gray/50 flex flex-wrap gap-2">
            {quickClickSuggestions.map((text, index) => (
              <SciFiButton
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickClick(text)}
                className="text-xs"
              >
                {text}
              </SciFiButton>
            ))}
          </div>
        )}
      </div>
    </AssistantRuntimeProvider>
  );
};

export default OnboardingAIChat; 
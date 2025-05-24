
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import SciFiButton from '../ui/SciFiButton';

interface Message {
  id: string;
  type: 'ai' | 'user' | 'system';
  content: string;
  timestamp: Date;
}

interface AIInteractionConsoleProps {
  currentStage: number;
  onStageChange: (stage: number) => void;
}

const AIInteractionConsole: React.FC<AIInteractionConsoleProps> = ({
  currentStage,
  onStageChange
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const addMessage = (type: 'ai' | 'user' | 'system', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateAIResponse = (response: string, delay: number = 1000) => {
    setIsAITyping(true);
    setTimeout(() => {
      addMessage('ai', response);
      setIsAITyping(false);
    }, delay);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    addMessage('user', userInput);
    const input = userInput;
    setUserInput('');

    // Simulate AI responses based on stage
    switch (currentStage) {
      case 1:
        simulateAIResponse(
          `Thank you for providing "${input}". I've recorded your company name. Now, could you please provide your company's official website URL? This will help me verify your business information and gather additional context.`
        );
        break;
      case 2:
        simulateAIResponse(
          `Excellent. I'm now analyzing your company information and conducting market research. This process involves cross-referencing multiple data sources and may take a few moments...`,
          2000
        );
        setTimeout(() => {
          setIsProcessing(true);
          addMessage('system', 'AI is conducting comprehensive market analysis...');
          setTimeout(() => {
            setIsProcessing(false);
            onStageChange(3);
            simulateAIResponse(
              `Analysis complete! Based on my evaluation, I've determined a preliminary valuation of $2.5M USD with an initial token price of $12.50. I will now submit this valuation to the Zenova Factory for processing.`
            );
          }, 3000);
        }, 2000);
        break;
      default:
        simulateAIResponse('I understand. Let me process that information...');
    }
  };

  useEffect(() => {
    // Initial AI greeting
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage('ai', 'Welcome! I am ZenovaAI, your intelligent onboarding assistant. I will guide you through the process of tokenizing your company on the blockchain. To begin, could you please provide your company\'s officially registered name?');
      }, 1000);
    }
  }, [messages.length]);

  return (
    <div className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg overflow-hidden">
      {/* Console Header */}
      <div className="bg-metamesh-dark border-b border-metamesh-gray p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <h3 className="text-white font-semibold">ZenovaAI Console</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm text-green-400">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'ai' 
                  ? 'bg-metamesh-yellow/10 border border-metamesh-yellow/30 text-white' 
                  : message.type === 'user'
                  ? 'bg-metamesh-gray text-white'
                  : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
              }`}>
                {message.type === 'ai' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-metamesh-yellow"></div>
                    <span className="text-xs text-metamesh-yellow font-medium">ZenovaAI</span>
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <span className="text-xs text-gray-400 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* AI Typing Indicator */}
        {isAITyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-metamesh-yellow/10 border border-metamesh-yellow/30 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-metamesh-yellow"></div>
                <span className="text-xs text-metamesh-yellow font-medium">ZenovaAI</span>
              </div>
              <div className="flex items-center space-x-1 mt-2">
                <Loader2 className="h-3 w-3 animate-spin text-metamesh-yellow" />
                <span className="text-xs text-white">AI is typing...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <div className="bg-metamesh-dark border border-metamesh-yellow/50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Loader2 className="h-5 w-5 animate-spin text-metamesh-yellow" />
                <span className="text-metamesh-yellow font-medium">Processing</span>
              </div>
              <p className="text-sm text-gray-400">AI is conducting deep market analysis...</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-metamesh-gray p-4">
        <div className="flex space-x-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your response to ZenovaAI..."
            className="flex-1 bg-metamesh-dark border border-metamesh-gray rounded-lg px-4 py-2 text-white focus:border-metamesh-yellow/50 focus:outline-none"
            disabled={isAITyping || isProcessing}
          />
          <SciFiButton 
            onClick={handleSendMessage}
            disabled={!userInput.trim() || isAITyping || isProcessing}
            variant="primary"
          >
            <Send className="h-4 w-4" />
          </SciFiButton>
        </div>
      </div>
    </div>
  );
};

export default AIInteractionConsole;

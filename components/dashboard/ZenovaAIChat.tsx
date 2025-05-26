"use client";

import { MessageCircle, List, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; // Assuming Zenova has these
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"; // Assuming Zenova has these
import { useMediaQuery } from "@/hooks/useMediaQuery"; // Assuming Zenova has this
import { useState } from "react";
import { useAccount } from "wagmi"; // Keep if Zenova uses wagmi

import {
  AssistantRuntimeProvider,
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "../thread"; // Assuming Zenova has this or a similar component
import { ThreadList } from "../thread-list"; // Assuming Zenova has this or a similar component
import { toast } from "sonner"; // Keep if Zenova uses sonner

const ZenovaAIChat = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1279px)");
  const [showThreadList, setShowThreadList] = useState(false);
  const { address } = useAccount(); // Active user's address

  const runtime = useChatRuntime({
    api: "/api/chat", // IMPORTANT: Configure Zenova's chat API endpoint
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
      // Added Error type
      console.error("Zenova Chat error:", error);
      toast.error("Chat Error: " + error.message);
    },
  });

  const toggleThreadList = () => setShowThreadList((prev: boolean) => !prev); // Added boolean type

  // Styles adapted for Zenova: metamesh-yellow accents on dark background
  const accentColor = "metamesh-yellow"; // Your theme's yellow
  const accentColorRGB = "250, 204, 21"; // RGB for metamesh-yellow (example, adjust if needed)
  const darkBgColor = "black"; // Or "metamesh-dark"

  const motionButtonBoxShadow = `0 0 15px rgba(${accentColorRGB}, 0.5)`;
  const motionDivBoxShadow = `-5px 0 20px rgba(${accentColorRGB}, 0.2)`;
  const motionButtonIconBoxShadow = `0 0 15px rgba(${accentColorRGB}, 0.5)`;

  const threadListButton = (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: motionButtonBoxShadow }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleThreadList}
      className={`absolute top-4 right-4 z-10 w-6 h-6 rounded-full bg-${darkBgColor} border border-${accentColor} flex items-center justify-center shadow-[0_0_10px_rgba(${accentColorRGB},0.3)]`}
    >
      <List className={`text-${accentColor}`} size={12} />
    </motion.button>
  );

  const threadListPanel = (
    <AnimatePresence>
      {showThreadList && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: "20%", opacity: 1 }} // Adjust animation as needed
          exit={{ x: "100%", opacity: 0 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            bounce: 0.2,
          }}
          className={`absolute inset-y-0 right-0 z-20 w-4/5 bg-${darkBgColor} border-l border-${accentColor} backdrop-blur-sm`}
          style={{
            boxShadow: motionDivBoxShadow,
            // Example gradient, adjust to Zenova's theme
            backgroundImage: `radial-gradient(circle at 100% 0%, rgba(${accentColorRGB}, 0.05) 0%, transparent 25%)`,
          }}
        >
          <div
            className={`flex justify-between items-center p-3 border-b border-${accentColor}/30`}
          >
            <h3
              className={`text-${accentColor} font-orbitron text-xs tracking-widest`}
            >
              {" "}
              {/* Consider Zenova's font */}
              <span className="relative inline-block">
                <span className="relative z-10">CHAT_HISTORY</span>
                <span
                  className={`absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-${accentColor} to-transparent`}
                ></span>
              </span>
            </h3>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleThreadList}
              className={`text-${accentColor} hover:text-white transition-colors duration-200`}
            >
              ✕
            </motion.button>
          </div>
          <div className="overflow-auto h-full pb-20 px-2">
            <ThreadList />
          </div>

          {/* Floating close button - adapted for Zenova */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <motion.button
              whileHover={{
                x: -2,
                boxShadow: motionButtonBoxShadow,
              }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleThreadList}
              className={`relative w-8 h-24 flex flex-col items-center justify-center bg-${darkBgColor} border-y border-r border-${accentColor} rounded-r-md shadow-[0_0_10px_rgba(${accentColorRGB},0.2)]`}
            >
              <div
                className={`absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-${accentColor}/50 to-transparent`}
              ></div>
              <ArrowLeft className={`text-${accentColor} mb-2`} size={12} />
              <div className="flex flex-col items-center">
                {["B", "A", "C", "K"].map((letter, i) => (
                  <span
                    key={i}
                    className={`text-[9px] font-orbitron text-${accentColor} leading-tight`}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const chatContent = (
    <AssistantRuntimeProvider runtime={runtime}>
      {" "}
      {/* Corrected Type Cast */}
      <div className="relative h-full">
        <Thread />
        {threadListButton}
        {threadListPanel}
      </div>
    </AssistantRuntimeProvider>
  );

  // For mobile: Drawer from bottom
  if (isMobile) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Drawer>
          <DrawerTrigger asChild>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: motionButtonIconBoxShadow,
              }}
              className={`w-10 h-10 rounded-full bg-${darkBgColor} border-2 border-${accentColor} flex items-center justify-center shadow-[0_0_10px_rgba(${accentColorRGB},0.3)]`}
            >
              <MessageCircle className={`text-${accentColor}`} size={18} />
            </motion.button>
          </DrawerTrigger>
          <DrawerContent
            className={`h-[80vh] bg-${darkBgColor} border-t-2 border-${accentColor} text-white p-0 flex flex-col`}
          >
            <DrawerHeader className={`border-b border-${accentColor}/30 p-3`}>
              <DrawerTitle
                className={`text-${accentColor} font-orbitron text-xs`}
              >
                ZENOVA_AI_ASSISTANT
              </DrawerTitle>
            </DrawerHeader>
            <div className="relative flex-1 overflow-hidden">{chatContent}</div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  // For tablet: Sheet from right
  if (isTablet) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: motionButtonIconBoxShadow,
              }}
              className={`w-10 h-10 rounded-full bg-${darkBgColor} border-2 border-${accentColor} flex items-center justify-center shadow-[0_0_10px_rgba(${accentColorRGB},0.3)]`}
            >
              <MessageCircle className={`text-${accentColor}`} size={18} />
            </motion.button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className={`w-[350px] h-full bg-${darkBgColor} border-l-2 border-${accentColor} text-white p-0 flex flex-col`}
          >
            <SheetHeader className={`border-b border-${accentColor}/30 p-3`}>
              <SheetTitle
                className={`text-${accentColor} font-orbitron text-xs`}
              >
                ZENOVA_AI_ASSISTANT
              </SheetTitle>
            </SheetHeader>
            <div className="relative flex-1 overflow-hidden">{chatContent}</div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // For desktop: fixed sidebar
  return (
    <div
      className={`h-full bg-${darkBgColor} border-l border-${accentColor}/30 flex flex-col w-full`}
    >
      <div className={`p-3 border-b border-${accentColor}/30`}>
        <h2
          className={`text-${accentColor} font-orbitron text-xs tracking-wide`}
        >
          ZENOVA_AI_ASSISTANT
        </h2>
      </div>
      <div className="relative flex-1 overflow-hidden">{chatContent}</div>
    </div>
  );
};

export default ZenovaAIChat;

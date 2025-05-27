"use client";

import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

export enum UIFocusTarget {
  NAVBAR_CONNECT_BUTTON = 'navbar_connect_button',
  // Add other focusable elements here if needed
}

interface UIFocusContextType {
  focusElement: UIFocusTarget | null;
  setFocusElement: Dispatch<SetStateAction<UIFocusTarget | null>>;
}

const UIFocusContext = createContext<UIFocusContextType | undefined>(undefined);

interface UIFocusProviderProps {
  children: ReactNode;
}

export const UIFocusProvider: React.FC<UIFocusProviderProps> = ({ children }) => {
  const [focusElement, setFocusElement] = useState<UIFocusTarget | null>(null);

  return (
    <UIFocusContext.Provider value={{ focusElement, setFocusElement }}>
      {children}
    </UIFocusContext.Provider>
  );
};

export const useUIFocus = (): UIFocusContextType => {
  const context = useContext(UIFocusContext);
  if (context === undefined) {
    throw new Error('useUIFocus must be used within a UIFocusProvider');
  }
  return context;
}; 
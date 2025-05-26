import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Connector } from 'wagmi';

export enum PortfolioOnboardingStage {
    CONNECT_WALLET,
    GET_RWA,
    MINT_USDT,
    COMPLETED,
}

interface OnboardingState {
    currentStage: PortfolioOnboardingStage;
    userAddress: `0x${string}` | null;
    isConnected: boolean;
    isConnecting: boolean;
    connector: Connector | undefined;
    chainId: number | undefined;
    hasAttemptedUSDTMint: boolean; // To prevent re-triggering mint step if user navigates away and comes back
    hasRWA: boolean; // New state to track if user has RWA
    hasPerformedRWACheck: boolean; // Track whether a balance check has been performed
    setStage: (stage: PortfolioOnboardingStage) => void;
    setUserAccount: (data: {
        address: `0x${string}` | null;
        isConnected: boolean;
        isConnecting: boolean;
        connector: Connector | undefined;
        chainId: number | undefined;
    }) => void;
    setHasAttemptedUSDTMint: (status: boolean) => void;
    setHasRWA: (status: boolean) => void; // Setter for hasRWA
    setHasPerformedRWACheck: (status: boolean) => void; // Setter for hasPerformedRWACheck
    resetOnboarding: () => void;
}

const initialState = {
    currentStage: PortfolioOnboardingStage.CONNECT_WALLET,
    userAddress: null,
    isConnected: false,
    isConnecting: false,
    connector: undefined,
    chainId: undefined,
    hasAttemptedUSDTMint: false,
    hasRWA: false, // Initial value for hasRWA
    hasPerformedRWACheck: false, // Initial value for hasPerformedRWACheck
};

export const useOnboardingStore = create<OnboardingState>()(
    (set, get) => ({
        ...initialState,
        setStage: (stage) => set({ currentStage: stage }),
        setUserAccount: (data) => set({
            userAddress: data.address,
            isConnected: data.isConnected,
            isConnecting: data.isConnecting,
            connector: data.connector,
            chainId: data.chainId,
        }),
        setHasAttemptedUSDTMint: (status) => set({ hasAttemptedUSDTMint: status }),
        setHasRWA: (status) => set({ hasRWA: status }), // Implement setter for hasRWA
        setHasPerformedRWACheck: (status) => set({ hasPerformedRWACheck: status }), // Implement setter for hasPerformedRWACheck
        resetOnboarding: () => {
            set({
                ...initialState,
                // Preserve hasAttemptedUSDTMint if user resets after minting, 
                // so they don't have to mint again if they restart onboarding later.
                // However, hasRWA and hasPerformedRWACheck should be reset as they need fresh checking.
                hasAttemptedUSDTMint: get().hasAttemptedUSDTMint,
                hasRWA: false,
                hasPerformedRWACheck: false
            });
        },
    }),
    // {
    //     name: 'zenova-portfolio-onboarding-storage', // name of the item in the storage (must be unique)
    //     storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    //     partialize: (state) => ({
    //         // Only persist currentStage, hasAttemptedUSDTMint and hasRWA
    //         currentStage: state.currentStage,
    //         hasAttemptedUSDTMint: state.hasAttemptedUSDTMint,
    //         hasRWA: state.hasRWA,
    //         hasPerformedRWACheck: state.hasPerformedRWACheck,
    //     },
    // }
    // )
); 
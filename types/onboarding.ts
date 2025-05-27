
export interface OnboardingStage {
    id: string;
    title: string;
    description?: string;
    isCompleted?: boolean;
    isActive?: boolean;
  }
  
  export interface AICommand {
    type: 'stage_transition' | 'ui_update' | 'data_collection' | 'error';
    stage_id?: string;
    data?: {
      progress?: number;
      ui_hints?: string[];
      quick_replies?: string[];
      form_data?: Record<string, any>;
      error_message?: string;
    };
  }
  
  export interface OnboardingContextType {
    currentStage: string;
    stages: OnboardingStage[];
    progress: number;
    walletConnected: boolean;
    setCurrentStage: (stageId: string) => void;
    updateProgress: (progress: number) => void;
    completeStage: (stageId: string) => void;
  }
  
  export interface CompanyData {
    name?: string;
    industry?: string;
    legalStructure?: string;
    website?: string;
    description?: string;
    foundedYear?: number;
    employees?: number;
    revenue?: number;
    assets?: string[];
  }
  
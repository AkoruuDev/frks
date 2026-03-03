// Types (constants instead of enums for erasableSyntaxOnly compatibility)
export const ObjectiveType = {
  PHYSICAL: 'FÍSICA',
  INTELLECTUAL: 'INTELECTUAL',
  FINANCIAL: 'FINANCEIRA'
} as const;

export type ObjectiveType = typeof ObjectiveType[keyof typeof ObjectiveType];

export const IdentityMode = {
  TRACKER: 'TRACKER',
  MONK: 'MONK',
  DARK: 'DARK'
} as const;

export type IdentityMode = typeof IdentityMode[keyof typeof IdentityMode];

// Interfaces
export interface Profile {
  email: string;
  phone: string;
  city: string;
  objective: ObjectiveType | null;
  notifications: boolean;
}

export interface Transaction {
  id: string;
  description: string;
  value: number;
  type: 'IN' | 'OUT';
  date: string;
}

export interface Book {
  id: string;
  title: string;
  totalPages: number;
  currentPage: number;
}

export interface AppState {
  profile: Profile;
  finances: {
    balance: number;
    transactions: Transaction[];
  };
  financialSetup: {
    salary: string;
    fixedExpenses: string;
    goalAmount: string;
    startDate: string;
    targetDate: string;
    goalType: string;
  };
  intellectual: {
    books: Book[];
    totalFocusMinutes: number;
    goal: string;
  };
  tasks: Record<string, boolean>;
  userMode: IdentityMode;
}

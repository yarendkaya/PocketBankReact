export const BudgetPeriod = {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY'
} as const;

export type BudgetPeriod = typeof BudgetPeriod[keyof typeof BudgetPeriod];

export const BudgetStatus = {
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
  ARCHIVED: 'ARCHIVED'
} as const;

export type BudgetStatus = typeof BudgetStatus[keyof typeof BudgetStatus];

export const AlertType = {
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL',
  INFO: 'INFO'
} as const;

export type AlertType = typeof AlertType[keyof typeof AlertType];

export interface BudgetCategory {
  categoryId: string;
  categoryName?: string;
  allocatedAmount: number;
  spentAmount: number;
  currency: string;
}

export interface Budget {
  id: string;
  userId: string;
  name: string;
  description?: string;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  totalAmount: number;
  spentAmount: number;
  currency: string;
  categories: BudgetCategory[];
  status: BudgetStatus;
  isShared: boolean;
  sharedWith?: string[]; // user IDs
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetTemplate {
  id: string;
  name: string;
  description?: string;
  period: BudgetPeriod;
  categories: Array<{
    categoryId: string;
    categoryName: string;
    percentage: number; // percentage of total budget
  }>;
  isPublic: boolean;
  userId: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetAlert {
  id: string;
  budgetId: string;
  type: AlertType;
  message: string;
  threshold: number; // percentage threshold that triggered the alert
  currentPercentage: number;
  categoryId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface BudgetFormData {
  name: string;
  description?: string;
  period: BudgetPeriod;
  startDate: string;
  endDate?: string;
  totalAmount: number;
  currency: string;
  categories: Array<{
    categoryId: string;
    allocatedAmount: number;
  }>;
}

export interface BudgetWizardStep {
  title: string;
  description: string;
  completed: boolean;
}

export interface BudgetActualComparison {
  categoryId: string;
  categoryName: string;
  budgeted: number;
  actual: number;
  difference: number;
  percentageUsed: number;
}

export interface BudgetShareRequest {
  budgetId: string;
  userIds: string[];
  permissions: {
    canEdit: boolean;
    canView: boolean;
  };
}

export interface SharedBudget {
  budget: Budget;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  permissions: {
    canEdit: boolean;
    canView: boolean;
  };
  sharedAt: string;
}

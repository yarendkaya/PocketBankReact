export interface Transaction {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  currency: string;
  type: TransactionType;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  isRecurring?: boolean;
  recurringId?: string;
  tags?: string[];
  attachments?: string[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: TransactionType;
  isDefault: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringTransaction {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  currency: string;
  type: TransactionType;
  description: string;
  frequency: RecurringFrequency;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  nextExecutionDate: string;
  createdAt: string;
  updatedAt: string;
}

export const TransactionType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
  TRANSFER: 'TRANSFER'
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export const RecurringFrequency = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY',
  YEARLY: 'YEARLY'
} as const;

export type RecurringFrequency = typeof RecurringFrequency[keyof typeof RecurringFrequency];

export interface TransactionFilters {
  dateFrom?: string;
  dateTo?: string;
  categoryIds?: string[];
  type?: TransactionType;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  tags?: string[];
}

export interface TransactionFormData {
  amount: number;
  categoryId: string;
  type: TransactionType;
  description: string;
  date: string;
  tags?: string[];
}

export interface BulkImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    message: string;
  }>;
}

export interface PaginatedTransactions {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
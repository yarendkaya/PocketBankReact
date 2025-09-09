// src/modules/accounts/types/index.ts

export const AccountType = {
  CHECKING: 'Checking',
  SAVINGS: 'Savings',
  CREDIT: 'Credit'
} as const;

export type AccountType = typeof AccountType[keyof typeof AccountType];

export interface Account {
  id: string;
  name: string;
  accountType: AccountType;
  balance: number;
  currency: string;
}

// Formlarda kullanmak için bir tip
export interface AccountFormData {
    name: string;
    accountType: AccountType;
    initialBalance: number;
    currency: string;
}
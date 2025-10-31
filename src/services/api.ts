// src/services/api.ts

import type { TransactionFilters } from '../modules/transactions/types';
import type { Account, AccountFormData } from '../modules/accounts/types';


const API_BASE_URL = 'https://localhost:7170'; // Backend URL'niz

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface BalanceResponse {
  balance: number;
  currency: string;
}


class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage: string;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || 'Network error';
        } catch {
          errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null as T;
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Auth methods
  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // User methods
  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/api/user/profile');
  }
  
  async getBalance(): Promise<BalanceResponse> {
    return this.request<BalanceResponse>('/api/user/balance');
  }

  // Account Methods
  async getAccounts(): Promise<Account[]> {
    return this.request<Account[]>('/api/Account'); 
  }

  async createAccount(data: AccountFormData): Promise<Account> {
    return this.request<Account>('/api/Account', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAccount(id: string, data: Partial<AccountFormData>): Promise<Account> {
    return this.request<Account>(`/api/Account/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(id: string): Promise<void> {
    await this.request<void>(`/api/Account/${id}`, {
      method: 'DELETE',
    });
  }
  
  
  
async linkBankAccount(bank: string, username: string, password: string): Promise<any[]> {
    return this.request<any[]>('/api/Account/link-bank', {
        method: 'POST',
        body: JSON.stringify({ bank, username, password }),
    });
}
  // Transaction methods
  async getTransactions(page: number = 1, limit: number = 10, filters: TransactionFilters = {}) {
     const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      // --- DEĞİŞİKLİK BURADA BAŞLIYOR ---
     // Artık 'filters' objesi içindeki accountId dahil tüm filtreleri
     // güvenli bir şekilde URL'e ekliyoruz.
 
    
     Object.entries(filters).forEach(([key, value]) => {
       

       if (value !== undefined && value !== null && String(value).length > 0) {
         
  
         if (Array.isArray(value)) {
           value.forEach(item => {
             queryParams.append(key, String(item));
           });
         } else {
 
           queryParams.append(key, String(value));
         }
       }
     });
  

    return this.request(`/api/transactions?${queryParams.toString()}`);
  }

  async createTransaction(data: any): Promise<any> {
    return this.request('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTransaction(id: string, data: any): Promise<any> {
    return this.request(`/api/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.request(`/api/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Category methods
  async getCategories(): Promise<any[]> {
    return this.request('/api/categories');
  }

  async createCategory(data: any): Promise<any> {
    return this.request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: any): Promise<any> {
    return this.request(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await this.request(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Recurring transaction methods
  async getRecurringTransactions(): Promise<any[]> {
    return this.request('/api/transactions/recurring');
  }

  async createRecurringTransaction(data: any): Promise<any> {
    return this.request('/api/transactions/recurring', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRecurringTransaction(id: string, data: any): Promise<any> {
    return this.request(`/api/transactions/recurring/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRecurringTransaction(id: string): Promise<void> {
    await this.request(`/api/transactions/recurring/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleRecurringTransaction(id: string, isActive: boolean): Promise<any> {
    return this.request(`/api/transactions/recurring/${id}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

} // <--- Sınıfın bittiği yer

export default new ApiService();
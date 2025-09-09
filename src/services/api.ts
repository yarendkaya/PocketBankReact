// src/services/api.ts (TAM VE HATASIZ SON HALİ)

// Tipleri "import type" ile alarak belirsizliği ortadan kaldırıyoruz.
import type { TransactionFilters,} from '../modules/transactions/types';
import type { Account, AccountFormData } from '../modules/accounts/types';

const API_BASE_URL = 'https://localhost:7170'; // Backend URL'niz

// ... Diğer interface tanımlamalarınız (LoginCredentials, RegisterData vb.) burada kalabilir ...

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

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      
      return response.text() as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Auth methods
  async register(userData: any): Promise<any> {
    return this.request<any>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: any): Promise<any> {
    return this.request<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // User methods
  async getProfile(): Promise<any> {
    return this.request<any>('/api/user/profile');
  }
  
  async getBalance(): Promise<any> {
    return this.request<any>('/api/user/balance');
  }

   // Account Methods
  async getAccounts(): Promise<Account[]> {
    // URL'yi backend controller'ınıza uygun olarak "Account" şeklinde güncelliyoruz.
    return this.request<Account[]>('/api/Account'); 
  }

  async createAccount(data: AccountFormData): Promise<Account> {
    return this.request<Account>('/api/Account', { // Burayı da güncelliyoruz
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAccount(id: string, data: Partial<AccountFormData>): Promise<Account> {
    return this.request<Account>(`/api/Account/${id}`, { // Burayı da güncelliyoruz
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(id: string): Promise<void> {
    await this.request<void>(`/api/Account/${id}`, { // Burayı da güncelliyoruz
      method: 'DELETE',
    });
  }
  // Transaction methods
  async getTransactions(page: number = 1, limit: number = 10, filters: TransactionFilters = {}) {
     const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      // Filterları güvenli bir şekilde işle ve URL'e ekle
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && String(value).length > 0) {
          queryParams.append(key, String(value));
        }
      });
      
    return this.request(`/api/transactions?${queryParams.toString()}`);
  }
}

export default new ApiService();
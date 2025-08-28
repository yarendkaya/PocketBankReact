const API_BASE_URL = 'https://localhost:7170'; // Your backend URL

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
  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
  }

  // User methods
  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/api/user/profile');
  }

  async getBalance(): Promise<BalanceResponse> {
    return this.request<BalanceResponse>('/api/user/balance');
  }

  // Additional banking methods you might need
  async getTransactions(page: number = 1, limit: number = 10) {
    return this.request(`/api/user/transactions?page=${page}&limit=${limit}`);
  }

  async transfer(data: { recipientEmail: string; amount: number; description?: string }) {
    return this.request('/api/user/transfer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export default new ApiService();
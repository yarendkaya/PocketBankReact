// src/modules/transactions/hooks/useTransactions.ts (GÜNCELLENMİŞ HALİ)

import { useState, useEffect, useCallback } from 'react';
import type { Transaction, TransactionFilters, TransactionFormData } from '../types';
import ApiService from '../../../services/api';

// --- 1. DEĞİŞİKLİK: Hook'un opsiyonel bir accountId almasını sağla ---
export const useTransactions = (accountId?: string, initialFilters?: TransactionFilters) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters || {});

  const fetchTransactions = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError('');
    
    try {
      // --- 2. DEĞİŞİKLİK: Mevcut filtreleri ve yeni accountId'yi birleştir ---
      const allFilters = { ...filters, accountId };

      // --- 3. DEĞİŞİKLİK: ApiService'e tüm filtreleri gönder ---
      const response = await ApiService.getTransactions(page, pagination.limit, allFilters) as any;
      
      if (Array.isArray(response)) {
        // ... (Bu kısım senin kodunla aynı, değiştirilmedi) ...
        setTransactions(response);
        setPagination(prev => ({ ...prev, page, total: response.length }));
      } else {
        // ... (Bu kısım senin kodunla aynı, değiştirilmedi) ...
        setTransactions(response.transactions || []);
        setPagination({
          page: response.page || page,
          limit: response.limit || pagination.limit,
          total: response.total || 0,
          totalPages: response.totalPages || 0
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  // --- 4. DEĞİŞİKLİK: useCallback'in bağımlılıklarına accountId ve filters'ı ekle ---
  // Bu, URL (accountId) veya filtreler değiştiğinde verinin yeniden çekilmesini sağlar.
  }, [pagination.limit, filters, accountId]);

  
  // --- AŞAĞIDAKİ FONKSİYONLARIN HİÇBİRİ DEĞİŞTİRİLMEDİ ---

  const createTransaction = async (data: TransactionFormData): Promise<Transaction> => {
    setLoading(true);
    try {
      // You can modify this to match your API endpoint
      const newTransaction = await ApiService.request<Transaction>('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: string, data: Partial<TransactionFormData>): Promise<Transaction> => {
    setLoading(true);
    try {
      const updatedTransaction = await ApiService.request<Transaction>(`/api/transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      
      setTransactions(prev => 
        prev.map(t => t.id === id ? updatedTransaction : t)
      );
      return updatedTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await ApiService.request(`/api/transactions/${id}`, {
        method: 'DELETE'
      });
      
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
    fetchTransactions(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({});
    fetchTransactions(1);
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); // fetchTransactions'ın bağımlılıkları değiştiğinde (örn: accountId) bu da tetiklenecek.

  return {
    transactions,
    loading,
    error,
    pagination,
    filters,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    applyFilters,
    clearFilters,
    refetch: () => fetchTransactions(pagination.page)
  };
};
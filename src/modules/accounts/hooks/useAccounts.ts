// src/modules/accounts/hooks/useAccounts.ts

import { useState, useCallback, useEffect } from 'react';
// AccountFormData tipini de types dosyasından import ediyoruz
import type { Account, AccountFormData } from '../types';
import ApiService from '../../../services/api';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Bu fonksiyon doğru, dokunmuyoruz.
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ApiService.getAccounts();
      setAccounts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch accounts.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // YENİ EKLENEN FONKSİYONLAR:
  // ==========================================================

  // Yeni bir hesap oluşturmak için
  const createAccount = async (data: AccountFormData) => {
    setLoading(true);
    try {
      // ApiService'e createAccount fonksiyonunu ekleyeceğiz
      const newAccount = await ApiService.createAccount(data);
      // Başarılı olursa, tüm listeyi yeniden çekmek yerine yeni hesabı mevcut listeye ekliyoruz.
      // Bu, uygulamayı daha hızlı ve verimli yapar.
      setAccounts(prev => [newAccount, ...prev]);
    } catch (err) {
      console.error(err);
      // Hatanın formda gösterilmesi için yukarı fırlatıyoruz
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  // Mevcut bir hesabı güncellemek için
  const updateAccount = async (id: string, data: Partial<AccountFormData>) => {
    setLoading(true);
    try {
      const updatedAccount = await ApiService.updateAccount(id, data);
      // Listeyi map'leyerek sadece güncellenen hesabı değiştiriyoruz
      setAccounts(prev => prev.map(acc => acc.id === id ? updatedAccount : acc));
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Bir hesabı silmek için
  const deleteAccount = async (id: string) => {
    setLoading(true);
    try {
      await ApiService.deleteAccount(id);
      // Listeden silinen hesabı filtreleyerek çıkarıyoruz
      setAccounts(prev => prev.filter(acc => acc.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // ==========================================================

  // Dışarıya açtığımız objeyi yeni fonksiyonları içerecek şekilde güncelliyoruz
  return { 
    accounts, 
    loading, 
    error, 
    refetchAccounts: fetchAccounts,
    createAccount,  // <-- YENİ
    updateAccount,  // <-- YENİ
    deleteAccount   // <-- YENİ
  };
};
import { useState, useEffect, useCallback } from 'react';
import type { Category } from '../types';
import { TransactionType } from '../types';
import ApiService from '../../../services/api';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      // You can modify this endpoint to match your backend
      const response = await ApiService.request<Category[]>('/api/categories');
      setCategories(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = async (data: Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
    setLoading(true);
    try {
      const newCategory = await ApiService.request<Category>('/api/categories', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, data: Partial<Category>): Promise<Category> => {
    setLoading(true);
    try {
      const updatedCategory = await ApiService.request<Category>(`/api/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      
      setCategories(prev => 
        prev.map(c => c.id === id ? updatedCategory : c)
      );
      return updatedCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await ApiService.request(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCategoriesByType = (type: TransactionType): Category[] => {
    return categories.filter(category => category.type === type);
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoriesByType,
    refetch: fetchCategories
  };
};
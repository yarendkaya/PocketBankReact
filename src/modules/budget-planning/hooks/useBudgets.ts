import { useState, useEffect, useCallback } from 'react';
import type { Budget, BudgetFormData, BudgetAlert, BudgetTemplate } from '../types';
import ApiService from '../../../services/api';

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.request<Budget[]>('/api/budgets');
      setBudgets(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBudget = async (data: BudgetFormData): Promise<Budget> => {
    setLoading(true);
    try {
      const newBudget = await ApiService.request<Budget>('/api/budgets', {
        method: 'POST',
        body: JSON.stringify(data)
      });

      setBudgets(prev => [newBudget, ...prev]);
      return newBudget;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create budget');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async (id: string, data: Partial<BudgetFormData>): Promise<Budget> => {
    setLoading(true);
    try {
      const updatedBudget = await ApiService.request<Budget>(`/api/budgets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });

      setBudgets(prev => prev.map(b => b.id === id ? updatedBudget : b));
      return updatedBudget;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update budget');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBudget = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await ApiService.request(`/api/budgets/${id}`, {
        method: 'DELETE'
      });

      setBudgets(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete budget');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const shareBudget = async (budgetId: string, userIds: string[]): Promise<void> => {
    setLoading(true);
    try {
      await ApiService.request(`/api/budgets/${budgetId}/share`, {
        method: 'POST',
        body: JSON.stringify({ userIds })
      });

      // Refresh budgets to get updated sharing info
      await fetchBudgets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share budget');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  return {
    budgets,
    loading,
    error,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    shareBudget,
    refetch: fetchBudgets
  };
};

export const useBudgetAlerts = (budgetId?: string) => {
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const endpoint = budgetId
        ? `/api/budgets/${budgetId}/alerts`
        : '/api/budget-alerts';
      const response = await ApiService.request<BudgetAlert[]>(endpoint);
      setAlerts(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  }, [budgetId]);

  const markAlertAsRead = async (alertId: string): Promise<void> => {
    try {
      await ApiService.request(`/api/budget-alerts/${alertId}/read`, {
        method: 'PUT'
      });

      setAlerts(prev => prev.map(a =>
        a.id === alertId ? { ...a, isRead: true } : a
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark alert as read');
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return {
    alerts,
    loading,
    error,
    fetchAlerts,
    markAlertAsRead,
    unreadCount: alerts.filter(a => !a.isRead).length
  };
};

export const useBudgetTemplates = () => {
  const [templates, setTemplates] = useState<BudgetTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.request<BudgetTemplate[]>('/api/budget-templates');
      setTemplates(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTemplate = async (data: Partial<BudgetTemplate>): Promise<BudgetTemplate> => {
    setLoading(true);
    try {
      const newTemplate = await ApiService.request<BudgetTemplate>('/api/budget-templates', {
        method: 'POST',
        body: JSON.stringify(data)
      });

      setTemplates(prev => [newTemplate, ...prev]);
      return newTemplate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create template');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = async (templateId: string, budgetData: Partial<BudgetFormData>): Promise<Budget> => {
    setLoading(true);
    try {
      const budget = await ApiService.request<Budget>(`/api/budget-templates/${templateId}/apply`, {
        method: 'POST',
        body: JSON.stringify(budgetData)
      });

      return budget;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply template');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    error,
    fetchTemplates,
    createTemplate,
    applyTemplate
  };
};

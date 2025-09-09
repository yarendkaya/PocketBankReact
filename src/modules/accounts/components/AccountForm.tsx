// src/modules/accounts/components/AccountForm.tsx (TAM VE DÜZELTİLMİŞ HALİ)

import React, { useState, useEffect } from 'react'; // useEffect eklendi
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  InputAdornment
} from '@mui/material';
import type { Account, AccountFormData, AccountType } from '../types'; // Account tipi eklendi

interface AccountFormProps {
  onSubmit: (data: AccountFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  initialData?: Account | null; // EKSİK OLAN PROP BURAYA EKLENDİ
}

export const AccountForm: React.FC<AccountFormProps> = ({ onSubmit, onCancel, loading = false, initialData }) => {
  const [formData, setFormData] = useState<AccountFormData>({
    name: '',
    accountType: 'Checking',
    initialBalance: 0,
    currency: 'TRY'
  });
  const [error, setError] = useState('');

  // GÜNCELLEME: Formun, düzenleme için gelen veriyle dolmasını sağlayan bölüm
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        accountType: initialData.accountType,
        initialBalance: initialData.balance, // initialBalance, gelen verinin balance'ı olacak
        currency: initialData.currency,
      });
    } else {
      // Eğer yeni hesap ekleniyorsa formu sıfırla
      setFormData({
        name: '',
        accountType: 'Checking',
        initialBalance: 0,
        currency: 'TRY'
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Account name is required.');
      return;
    }

    // initialBalance'ın negatif olmamasını sadece yeni hesap oluştururken kontrol et
    if (!initialData && formData.initialBalance < 0) {
        setError('Initial balance cannot be negative.');
        return;
    }

    try {
      await onSubmit(formData);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'An unknown error occurred.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3} sx={{ mt: 1 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          name="name"
          label="Account Name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          autoFocus
        />

        <FormControl fullWidth required>
          <InputLabel>Account Type</InputLabel>
          <Select
            name="accountType"
            value={formData.accountType}
            label="Account Type"
            onChange={handleChange as any}
          >
            <MenuItem value="Checking">Checking (Vadesiz)</MenuItem>
            <MenuItem value="Savings">Savings (Birikim)</MenuItem>
            <MenuItem value="Credit">Credit (Kredi)</MenuItem>
          </Select>
        </FormControl>

        <TextField
          name="initialBalance"
          label={initialData ? "Balance" : "Initial Balance"} // Düzenleme modunda etiketi değiştir
          type="number"
          value={formData.initialBalance}
          onChange={handleChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">₺</InputAdornment>,
          }}
          // Düzenleme sırasında bakiye negatif olabilir (kredi kartı borcu gibi)
          inputProps={{ step: 0.01 }}
          fullWidth
          required
          // Sadece yeni hesap oluşturulurken bu alan "Initial Balance" olur.
          // Düzenleme sırasında mevcut bakiye gösterilir.
          disabled={!!initialData} 
          helperText={initialData ? "Balance can only be updated via transactions." : ""}
        />
        
        <TextField
          name="currency"
          label="Currency"
          value={formData.currency}
          onChange={handleChange}
          fullWidth
          required
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
          <Button onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update Account' : 'Create Account'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
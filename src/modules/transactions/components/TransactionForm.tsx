import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Add } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { TransactionType } from '../types';
import type { TransactionFormData, Category } from '../types';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => Promise<void>;
  initialData?: Partial<TransactionFormData>;
  categories: Category[];
  loading?: boolean;
  title?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  initialData,
  categories,
  loading = false,
  title = 'Add Transaction'
}) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: initialData?.amount || 0,
    categoryId: initialData?.categoryId || '',
    type: initialData?.type || TransactionType.EXPENSE,
    description: initialData?.description || '',
    date: initialData?.date || dayjs().format('YYYY-MM-DD'),
    tags: initialData?.tags || []
  });
  
  const [selectedDate, setSelectedDate] = useState<Dayjs>(
    initialData?.date ? dayjs(initialData.date) : dayjs()
  );
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState<string>('');

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || formData.amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (!formData.categoryId) {
      setError('Please select a category');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    try {
      await onSubmit({
        ...formData,
        date: selectedDate.format('YYYY-MM-DD')
      });
      
      if (!initialData) {
        setFormData({
          amount: 0,
          categoryId: '',
          type: TransactionType.EXPENSE,
          description: '',
          date: dayjs().format('YYYY-MM-DD'),
          tags: []
        });
        setSelectedDate(dayjs());
        setTagInput('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save transaction');
    }
  };

  const handleTypeChange = (type: TransactionType) => {
    setFormData(prev => ({
      ...prev,
      type,
      categoryId: ''
    }));
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          {title}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Transaction Type */}
            <FormControl fullWidth>
              <InputLabel>Transaction Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => handleTypeChange(e.target.value as TransactionType)}
                label="Transaction Type"
              >
                <MenuItem value={TransactionType.INCOME}>Income</MenuItem>
                <MenuItem value={TransactionType.EXPENSE}>Expense</MenuItem>
                <MenuItem value={TransactionType.TRANSFER}>Transfer</MenuItem>
              </Select>
            </FormControl>

            {/* Amount */}
            <TextField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
              inputProps={{ min: 0, step: 0.01 }}
              fullWidth
              required
            />

            {/* Category */}
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                label="Category"
                required
              >
                {filteredCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: category.color
                        }}
                      />
                      {category.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Description */}
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
              fullWidth
              required
            />

            {/* Date */}
            <DatePicker
              label="Date"
              value={selectedDate}
              onChange={(date) => setSelectedDate(date || dayjs())}
              slotProps={{ textField: { fullWidth: true } }}
            />

            {/* Tags */}
            <Box>
              <TextField
                label="Add Tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleAddTag} disabled={!tagInput.trim()}>
                        <Add />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                helperText="Press Enter or click + to add a tag"
              />
              
              {formData.tags && formData.tags.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {formData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Saving...' : initialData ? 'Update Transaction' : 'Add Transaction'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default TransactionForm;
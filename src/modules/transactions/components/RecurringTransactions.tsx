import React, { useState} from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Alert,
  Grid,
  InputAdornment,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Add,
  Edit,
  Delete,
  Repeat,
  Schedule,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import {
  type RecurringTransaction,
  RecurringFrequency,
  TransactionType,
  type Category
} from '../types';

interface RecurringTransactionsProps {
  recurringTransactions: RecurringTransaction[];
  categories: Category[];
  onCreateRecurring: (data: Omit<RecurringTransaction, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'nextExecutionDate'>) => Promise<void>;
  onUpdateRecurring: (id: string, data: Partial<RecurringTransaction>) => Promise<void>;
  onDeleteRecurring: (id: string) => Promise<void>;
  onToggleRecurring: (id: string, isActive: boolean) => Promise<void>;
  loading?: boolean;
}

interface RecurringFormData {
  categoryId: string;
  amount: number;
  type: TransactionType;
  description: string;
  frequency: RecurringFrequency;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  currency: string;
}

const RecurringTransactions: React.FC<RecurringTransactionsProps> = ({
  recurringTransactions,
  categories,
  onCreateRecurring,
  onUpdateRecurring,
  onDeleteRecurring,
  onToggleRecurring,
  loading = false
}) => {
  const [open, setOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | null>(null);
  const [formData, setFormData] = useState<RecurringFormData>({
    categoryId: '',
    amount: 0,
    type: TransactionType.EXPENSE,
    description: '',
    frequency: RecurringFrequency.MONTHLY,
    startDate: dayjs().format('YYYY-MM-DD'),
    isActive: true,
    currency: 'USD'
  });
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [error, setError] = useState<string>('');

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
      const data = {
        ...formData,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined
      };

      if (editingRecurring) {
        await onUpdateRecurring(editingRecurring.id, data);
      } else {
        await onCreateRecurring(data);
      }

      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save recurring transaction');
    }
  };

  const handleEdit = (recurring: RecurringTransaction) => {
    setEditingRecurring(recurring);
    setFormData({
      categoryId: recurring.categoryId,
      amount: recurring.amount,
      type: recurring.type,
      description: recurring.description,
      frequency: recurring.frequency,
      startDate: recurring.startDate,
      endDate: recurring.endDate,
      isActive: recurring.isActive,
      currency: recurring.currency
    });
    setStartDate(dayjs(recurring.startDate));
    setEndDate(recurring.endDate ? dayjs(recurring.endDate) : null);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this recurring transaction?')) {
      try {
        await onDeleteRecurring(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete recurring transaction');
      }
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await onToggleRecurring(id, !isActive);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle recurring transaction');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRecurring(null);
    setFormData({
      categoryId: '',
      amount: 0,
      type: TransactionType.EXPENSE,
      description: '',
      frequency: RecurringFrequency.MONTHLY,
      startDate: dayjs().format('YYYY-MM-DD'),
      isActive: true,
      currency: 'USD'
    });
    setStartDate(dayjs());
    setEndDate(null);
    setError('');
  };

  const getFrequencyLabel = (frequency: RecurringFrequency): string => {
    const labels = {
      [RecurringFrequency.DAILY]: 'Daily',
      [RecurringFrequency.WEEKLY]: 'Weekly',
      [RecurringFrequency.MONTHLY]: 'Monthly',
      [RecurringFrequency.QUARTERLY]: 'Quarterly',
      [RecurringFrequency.YEARLY]: 'Yearly'
    };
    return labels[frequency];
  };

  const getNextExecutionDisplay = (date: string): string => {
    const nextDate = dayjs(date);
    const now = dayjs();
    const diffDays = nextDate.diff(now, 'day');

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;

    return nextDate.format('MMM DD, YYYY');
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ color: '#333' }}>
            Recurring Transactions
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            disabled={loading}
            sx={{
              bgcolor: '#d32f2f',
              '&:hover': { bgcolor: '#b71c1c' }
            }}
          >
            Add Recurring Transaction
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {recurringTransactions.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', border: '1px solid #e0e0e0' }}>
            <Repeat sx={{ fontSize: 64, color: '#d32f2f', mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" color="text.primary" sx={{ mb: 1, fontWeight: 600 }}>
              No Recurring Transactions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Set up recurring transactions to automate your regular income and expenses.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpen(true)}
              sx={{
                bgcolor: '#d32f2f',
                '&:hover': { bgcolor: '#b71c1c' }
              }}
            >
              Create Your First Recurring Transaction
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {recurringTransactions.map((recurring) => {
              const category = categories.find(cat => cat.id === recurring.categoryId);
              const isOverdue = dayjs(recurring.nextExecutionDate).isBefore(dayjs(), 'day');

              return (
                <Grid item xs={12} md={6} lg={4} key={recurring.id}>
                  <Card
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderLeft: `4px solid ${category?.color || '#ccc'}`,
                      opacity: recurring.isActive ? 1 : 0.6,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                          {recurring.type === TransactionType.INCOME ? (
                            <TrendingUp sx={{ color: '#4caf50' }} />
                          ) : (
                            <TrendingDown sx={{ color: '#f44336' }} />
                          )}
                          <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#333' }}>
                            {recurring.description}
                          </Typography>
                        </Box>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={recurring.isActive}
                              onChange={() => handleToggle(recurring.id, recurring.isActive)}
                              disabled={loading}
                              size="small"
                            />
                          }
                          label=""
                          sx={{ m: 0 }}
                        />
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      <Stack spacing={2}>
                        <Box>
                          <Typography
                            variant="h5"
                            fontWeight={700}
                            color={recurring.type === TransactionType.INCOME ? '#4caf50' : '#f44336'}
                          >
                            {recurring.type === TransactionType.INCOME ? '+' : '-'}${recurring.amount.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {category?.name || 'Unknown Category'}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Chip
                            label={getFrequencyLabel(recurring.frequency)}
                            size="small"
                            sx={{
                              bgcolor: '#e3f2fd',
                              color: '#1976d2',
                              fontWeight: 600
                            }}
                          />
                          <Chip
                            label={recurring.type}
                            size="small"
                            sx={{
                              bgcolor: recurring.type === TransactionType.INCOME ? '#e8f5e9' : '#ffebee',
                              color: recurring.type === TransactionType.INCOME ? '#4caf50' : '#f44336',
                              fontWeight: 600
                            }}
                          />
                        </Stack>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1.5,
                            bgcolor: isOverdue ? '#ffebee' : '#f5f5f5',
                            borderRadius: 1,
                            border: isOverdue ? '1px solid #ffcdd2' : '1px solid #e0e0e0'
                          }}
                        >
                          <Schedule fontSize="small" sx={{ color: isOverdue ? '#d32f2f' : '#666' }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                              Next Execution
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color={isOverdue ? '#d32f2f' : '#333'}
                            >
                              {getNextExecutionDisplay(recurring.nextExecutionDate)}
                            </Typography>
                          </Box>
                        </Box>

                        {recurring.endDate && (
                          <Typography variant="caption" color="text.secondary">
                            Ends on {dayjs(recurring.endDate).format('MMM DD, YYYY')}
                          </Typography>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1, borderTop: '1px solid #e0e0e0' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(recurring)}
                            disabled={loading}
                            sx={{
                              border: '1px solid #e0e0e0',
                              '&:hover': { bgcolor: '#f5f5f5' }
                            }}
                          >
                            <Edit fontSize="small" sx={{ color: '#666' }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(recurring.id)}
                            disabled={loading}
                            sx={{
                              border: '1px solid #ffcdd2',
                              '&:hover': { bgcolor: '#ffebee' }
                            }}
                          >
                            <Delete fontSize="small" sx={{ color: '#d32f2f' }} />
                          </IconButton>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Recurring Transaction Form Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" fontWeight={600}>
              {editingRecurring ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Transaction Type */}
                <FormControl fullWidth>
                  <InputLabel>Transaction Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      type: e.target.value as TransactionType,
                      categoryId: ''
                    }))}
                    label="Transaction Type"
                  >
                    <MenuItem value={TransactionType.INCOME}>Income</MenuItem>
                    <MenuItem value={TransactionType.EXPENSE}>Expense</MenuItem>
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
                  fullWidth
                  required
                />

                {/* Frequency */}
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={formData.frequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as RecurringFrequency }))}
                    label="Frequency"
                  >
                    <MenuItem value={RecurringFrequency.DAILY}>Daily</MenuItem>
                    <MenuItem value={RecurringFrequency.WEEKLY}>Weekly</MenuItem>
                    <MenuItem value={RecurringFrequency.MONTHLY}>Monthly</MenuItem>
                    <MenuItem value={RecurringFrequency.QUARTERLY}>Quarterly</MenuItem>
                    <MenuItem value={RecurringFrequency.YEARLY}>Yearly</MenuItem>
                  </Select>
                </FormControl>

                {/* Start Date */}
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(date) => setStartDate(date || dayjs())}
                  slotProps={{ textField: { fullWidth: true } }}
                />

                {/* End Date (Optional) */}
                <DatePicker
                  label="End Date (Optional)"
                  value={endDate}
                  onChange={setEndDate}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText: 'Leave empty for indefinite recurrence'
                    }
                  }}
                />

                {/* Active Switch */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                  }
                  label="Active"
                />
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid #e0e0e0', px: 3, py: 2 }}>
            <Button onClick={handleClose} sx={{ color: '#666' }}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#d32f2f',
                '&:hover': { bgcolor: '#b71c1c' }
              }}
            >
              {loading ? 'Saving...' : editingRecurring ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default RecurringTransactions;

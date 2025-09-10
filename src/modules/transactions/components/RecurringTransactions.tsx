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
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Add,
  Edit,
  Delete,
  Repeat,
  Schedule
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
  currency: string;   // ✅ added
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
    currency: 'USD'  // ✅ default currency set to USD
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
      currency: recurring.currency  // ✅ set currency when editing
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
      currency: 'USD'  // ✅ reset to default currency on close
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
          <Typography variant="h6" fontWeight={600}>
            Recurring Transactions
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            Add Recurring Transaction
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Recurring Transactions List */}
        <Grid container spacing={2}>
          {recurringTransactions.map((recurring) => {
            const category = categories.find(cat => cat.id === recurring.categoryId);
            const isOverdue = dayjs(recurring.nextExecutionDate).isBefore(dayjs(), 'day');
            
            return (
              <Grid item xs={12} md={6} lg={4} key={recurring.id}>
                <Card
                  sx={{
                    borderLeft: `4px solid ${category?.color || '#ccc'}`,
                    opacity: recurring.isActive ? 1 : 0.6
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Repeat sx={{ color: category?.color || 'text.secondary' }} />
                        <Typography variant="subtitle1" fontWeight={600}>
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

                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="h6" color={recurring.type === TransactionType.INCOME ? 'success.main' : 'error.main'}>
                          {recurring.type === TransactionType.INCOME ? '+' : '-'}${recurring.amount.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {category?.name || 'Unknown Category'}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1}>
                        <Chip
                          label={getFrequencyLabel(recurring.frequency)}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={recurring.type}
                          size="small"
                          color={recurring.type === TransactionType.INCOME ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </Stack>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Schedule fontSize="small" color={isOverdue ? 'error' : 'action'} />
                        <Typography 
                          variant="body2" 
                          color={isOverdue ? 'error.main' : 'text.secondary'}
                        >
                          Next: {getNextExecutionDisplay(recurring.nextExecutionDate)}
                        </Typography>
                      </Box>

                      {recurring.endDate && (
                        <Typography variant="body2" color="text.secondary">
                          Ends: {dayjs(recurring.endDate).format('MMM DD, YYYY')}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(recurring)}
                          disabled={loading}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(recurring.id)}
                          disabled={loading}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {recurringTransactions.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Repeat sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No Recurring Transactions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Set up recurring transactions to automate your regular income and expenses.
            </Typography>
          </Paper>
        )}

        {/* Recurring Transaction Form Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingRecurring ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{ mt: 1 }}>
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
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={loading}>
              {loading ? 'Saving...' : editingRecurring ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default RecurringTransactions;
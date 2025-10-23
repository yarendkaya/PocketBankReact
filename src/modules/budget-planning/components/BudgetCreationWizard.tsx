import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Alert,
  Chip,
  IconButton
} from '@mui/material';
import { Add, Delete, CalendarToday } from '@mui/icons-material';
import type { BudgetFormData, BudgetPeriod } from '../types';
import { BudgetPeriod as BudgetPeriodEnum } from '../types';
import type { Category } from '../../transactions/types';

interface BudgetCreationWizardProps {
  onSubmit: (data: BudgetFormData) => Promise<void>;
  onCancel: () => void;
  categories: Category[];
  loading?: boolean;
}

const steps = ['Basic Info', 'Set Period', 'Allocate Budget', 'Review'];

const BudgetCreationWizard: React.FC<BudgetCreationWizardProps> = ({
  onSubmit,
  onCancel,
  categories,
  loading = false
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<BudgetFormData>({
    name: '',
    description: '',
    period: BudgetPeriodEnum.MONTHLY,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    totalAmount: 0,
    currency: 'USD',
    categories: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.name.trim()) {
        newErrors.name = 'Budget name is required';
      }
      if (formData.totalAmount <= 0) {
        newErrors.totalAmount = 'Total amount must be greater than 0';
      }
    }

    if (step === 1) {
      if (!formData.startDate) {
        newErrors.startDate = 'Start date is required';
      }
      if (formData.period === BudgetPeriodEnum.YEARLY && !formData.endDate) {
        newErrors.endDate = 'End date is required for yearly budgets';
      }
    }

    if (step === 2) {
      if (formData.categories.length === 0) {
        newErrors.categories = 'Please allocate budget to at least one category';
      }
      const totalAllocated = formData.categories.reduce((sum, cat) => sum + cat.allocatedAmount, 0);
      if (totalAllocated > formData.totalAmount) {
        newErrors.categories = 'Total allocated amount exceeds budget';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(activeStep)) {
      try {
        await onSubmit(formData);
      } catch (error) {
        setErrors({ submit: 'Failed to create budget' });
      }
    }
  };

  const addCategory = () => {
    setFormData(prev => ({
      ...prev,
      categories: [
        ...prev.categories,
        { categoryId: '', allocatedAmount: 0 }
      ]
    }));
  };

  const updateCategory = (index: number, field: 'categoryId' | 'allocatedAmount', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) =>
        i === index ? { ...cat, [field]: value } : cat
      )
    }));
  };

  const removeCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const calculateEndDate = (startDate: string, period: BudgetPeriod): string => {
    const start = new Date(startDate);
    if (period === BudgetPeriodEnum.MONTHLY) {
      start.setMonth(start.getMonth() + 1);
    } else {
      start.setFullYear(start.getFullYear() + 1);
    }
    return start.toISOString().split('T')[0];
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Basic Budget Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Budget Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={!!errors.name}
                  helperText={errors.name}
                  placeholder="e.g., Monthly Personal Budget"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description (Optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add notes about this budget..."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Budget Amount"
                  value={formData.totalAmount || ''}
                  onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })}
                  error={!!errors.totalAmount}
                  helperText={errors.totalAmount}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={formData.currency}
                    label="Currency"
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  >
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Budget Period
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Period Type</InputLabel>
                  <Select
                    value={formData.period}
                    label="Period Type"
                    onChange={(e) => {
                      const period = e.target.value as BudgetPeriod;
                      setFormData({
                        ...formData,
                        period,
                        endDate: calculateEndDate(formData.startDate, period)
                      });
                    }}
                  >
                    <MenuItem value={BudgetPeriodEnum.MONTHLY}>Monthly</MenuItem>
                    <MenuItem value={BudgetPeriodEnum.YEARLY}>Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(e) => {
                    const startDate = e.target.value;
                    setFormData({
                      ...formData,
                      startDate,
                      endDate: calculateEndDate(startDate, formData.period)
                    });
                  }}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><CalendarToday fontSize="small" /></InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><CalendarToday fontSize="small" /></InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info">
                  Budget will run from {formData.startDate} to {formData.endDate || 'TBD'}
                </Alert>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        const totalAllocated = formData.categories.reduce((sum, cat) => sum + cat.allocatedAmount, 0);
        const remaining = formData.totalAmount - totalAllocated;

        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Allocate Budget to Categories
            </Typography>

            <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">Total Budget</Typography>
                  <Typography variant="h6">${formData.totalAmount.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">Allocated</Typography>
                  <Typography variant="h6" color={totalAllocated > formData.totalAmount ? 'error' : 'primary'}>
                    ${totalAllocated.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">Remaining</Typography>
                  <Typography variant="h6" color={remaining < 0 ? 'error' : 'success'}>
                    ${remaining.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {errors.categories && (
              <Alert severity="error" sx={{ mb: 2 }}>{errors.categories}</Alert>
            )}

            {formData.categories.map((category, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={category.categoryId}
                          label="Category"
                          onChange={(e) => updateCategory(index, 'categoryId', e.target.value)}
                        >
                          {categories.map((cat) => (
                            <MenuItem
                              key={cat.id}
                              value={cat.id}
                              disabled={formData.categories.some((c, i) => i !== index && c.categoryId === cat.id)}
                            >
                              {cat.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Amount"
                        value={category.allocatedAmount || ''}
                        onChange={(e) => updateCategory(index, 'allocatedAmount', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <IconButton onClick={() => removeCategory(index)} color="error">
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={addCategory}
              fullWidth
              sx={{ mt: 2 }}
            >
              Add Category
            </Button>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Budget
            </Typography>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">Budget Name</Typography>
                <Typography variant="h6" gutterBottom>{formData.name}</Typography>

                {formData.description && (
                  <>
                    <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                    <Typography gutterBottom>{formData.description}</Typography>
                  </>
                )}

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Total Amount</Typography>
                    <Typography variant="h6">${formData.totalAmount.toLocaleString()} {formData.currency}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Period</Typography>
                    <Typography variant="h6">{formData.period}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Start Date</Typography>
                    <Typography>{formData.startDate}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">End Date</Typography>
                    <Typography>{formData.endDate}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>Category Allocations</Typography>
                {formData.categories.map((category, index) => {
                  const cat = categories.find(c => c.id === category.categoryId);
                  const percentage = (category.allocatedAmount / formData.totalAmount * 100).toFixed(1);
                  return (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>{cat?.name || 'Unknown Category'}</Typography>
                        <Box>
                          <Chip
                            label={`${percentage}%`}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Typography component="span" fontWeight="bold">
                            ${category.allocatedAmount.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </CardContent>
            </Card>

            {errors.submit && (
              <Alert severity="error" sx={{ mt: 2 }}>{errors.submit}</Alert>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent(activeStep)}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={activeStep === 0 ? onCancel : handleBack}>
          {activeStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                bgcolor: '#d32f2f',
                '&:hover': { bgcolor: '#b71c1c' }
              }}
            >
              {loading ? 'Creating...' : 'Create Budget'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                bgcolor: '#d32f2f',
                '&:hover': { bgcolor: '#b71c1c' }
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default BudgetCreationWizard;

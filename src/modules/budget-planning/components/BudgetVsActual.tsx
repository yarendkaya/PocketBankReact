import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  Chip,
  Alert
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import type { Budget } from '../types';
import type { Category } from '../../transactions/types';

interface BudgetVsActualProps {
  budget: Budget;
  categories: Category[];
}

const BudgetVsActual: React.FC<BudgetVsActualProps> = ({ budget, categories }) => {
  const getProgressColor = (percentage: number): string => {
    if (percentage < 70) return '#4caf50'; // green
    if (percentage < 90) return '#ff9800'; // orange
    return '#f44336'; // red
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage < 70) return <CheckCircle sx={{ color: '#4caf50' }} />;
    if (percentage < 90) return <Warning sx={{ color: '#ff9800' }} />;
    return <Warning sx={{ color: '#f44336' }} />;
  };

  const overallPercentage = (budget.spentAmount / budget.totalAmount) * 100;
  const remainingAmount = budget.totalAmount - budget.spentAmount;

  return (
    <Box>
      {/* Overall Budget Summary */}
      <Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Overall Budget Progress
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">Total Budget</Typography>
              <Typography variant="h5" fontWeight="bold">
                ${budget.totalAmount.toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">Spent</Typography>
              <Typography variant="h5" fontWeight="bold" color={getProgressColor(overallPercentage)}>
                ${budget.spentAmount.toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">Remaining</Typography>
              <Typography variant="h5" fontWeight="bold" color={remainingAmount < 0 ? 'error' : 'success'}>
                ${remainingAmount.toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">Used</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getStatusIcon(overallPercentage)}
                <Typography variant="h5" fontWeight="bold">
                  {overallPercentage.toFixed(1)}%
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Progress</Typography>
              <Typography variant="body2" fontWeight="bold">
                {overallPercentage.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(overallPercentage, 100)}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  bgcolor: getProgressColor(overallPercentage)
                }
              }}
            />
          </Box>

          {overallPercentage >= 100 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Budget exceeded! You've overspent by ${(budget.spentAmount - budget.totalAmount).toLocaleString()}
            </Alert>
          )}

          {overallPercentage >= 90 && overallPercentage < 100 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Warning: You've used {overallPercentage.toFixed(1)}% of your budget
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Typography variant="h6" gutterBottom>
        Category Breakdown
      </Typography>

      {budget.categories.map((budgetCategory) => {
        const category = categories.find(c => c.id === budgetCategory.categoryId);
        const percentage = (budgetCategory.spentAmount / budgetCategory.allocatedAmount) * 100;
        const remaining = budgetCategory.allocatedAmount - budgetCategory.spentAmount;
        const isOverBudget = budgetCategory.spentAmount > budgetCategory.allocatedAmount;

        return (
          <Card key={budgetCategory.categoryId} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6">{category?.name || 'Unknown Category'}</Typography>
                  {isOverBudget && (
                    <Chip
                      label="Over Budget"
                      size="small"
                      color="error"
                      icon={<TrendingDown />}
                    />
                  )}
                  {!isOverBudget && percentage >= 90 && (
                    <Chip
                      label="Near Limit"
                      size="small"
                      color="warning"
                      icon={<Warning />}
                    />
                  )}
                  {percentage < 70 && (
                    <Chip
                      label="On Track"
                      size="small"
                      color="success"
                      icon={<CheckCircle />}
                    />
                  )}
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="textSecondary">
                    ${budgetCategory.spentAmount.toLocaleString()} of ${budgetCategory.allocatedAmount.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Remaining: ${Math.abs(remaining).toLocaleString()}
                    {isOverBudget && ' over budget'}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color={getProgressColor(percentage)}
                  >
                    {percentage.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(percentage, 100)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getProgressColor(percentage)
                    }
                  }}
                />
              </Box>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">Budgeted</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      ${budgetCategory.allocatedAmount.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">Spent</Typography>
                    <Typography variant="body1" fontWeight="bold" color={getProgressColor(percentage)}>
                      ${budgetCategory.spentAmount.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">Difference</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
                      {remaining >= 0 ? (
                        <TrendingUp sx={{ fontSize: 16, color: '#4caf50' }} />
                      ) : (
                        <TrendingDown sx={{ fontSize: 16, color: '#f44336' }} />
                      )}
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color={remaining >= 0 ? 'success' : 'error'}
                      >
                        ${Math.abs(remaining).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default BudgetVsActual;

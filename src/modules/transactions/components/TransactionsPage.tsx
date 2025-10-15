import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Snackbar,
  Paper,
  CircularProgress,
  Fab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccountBalance,
  Add,
  Receipt,
  Category,
  Repeat,
  Upload,
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { bankingTheme } from '../../../styles/theme';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import type { TransactionFormData, BulkImportResult, RecurringTransaction } from '../types';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import TransactionFiltersComponent from './TransactionFilters';
import CategoryManager from './CategoryManager';
import BulkImport from './BulkImport';
import RecurringTransactions from './RecurringTransactions';

const TransactionsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [currentTab, setCurrentTab] = useState(0);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const [recurringTransactions] = useState<RecurringTransaction[]>([]);
  const [availableTags] = useState<string[]>(['food', 'transport', 'entertainment', 'bills', 'salary', 'shopping']);

  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    pagination,
    filters,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    applyFilters,
    clearFilters
  } = useTransactions();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategories();

  const stats = {
    totalIncome: transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0),
    totalExpense: transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0),
    balance: transactions.reduce((sum, t) => t.type === 'INCOME' ? sum + t.amount : sum - t.amount, 0),
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTransactionSubmit = async (data: TransactionFormData) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, data);
        setSnackbar({
          open: true,
          message: 'Transaction updated successfully',
          severity: 'success'
        });
      } else {
        await createTransaction(data);
        setSnackbar({
          open: true,
          message: 'Transaction created successfully',
          severity: 'success'
        });
      }
      setShowTransactionForm(false);
      setEditingTransaction(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save transaction',
        severity: 'error'
      });
    }
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        setSnackbar({
          open: true,
          message: 'Transaction deleted successfully',
          severity: 'success'
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to delete transaction',
          severity: 'error'
        });
      }
    }
  };

  const handleBulkImport = async (transactions: TransactionFormData[]): Promise<BulkImportResult> => {
    try {
      const results = await Promise.allSettled(
        transactions.map(transaction => createTransaction(transaction))
      );

      const success = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      const errors = results
        .map((result, index) => ({
          row: index + 1,
          message: result.status === 'rejected' ? result.reason.message : ''
        }))
        .filter(error => error.message);

      setSnackbar({
        open: true,
        message: `Import completed: ${success} successful, ${failed} failed`,
        severity: failed > 0 ? 'error' : 'success'
      });

      return { success, failed, errors };
    } catch (error) {
      throw new Error('Bulk import failed');
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => deleteTransaction(id)));
      setSnackbar({
        open: true,
        message: `${ids.length} transactions deleted successfully`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete selected transactions',
        severity: 'error'
      });
    }
  };

  const handleCreateRecurring = async (data: any) => {
    console.log('Create recurring:', data);
  };

  const handleUpdateRecurring = async (id: string, data: any) => {
    console.log('Update recurring:', id, data);
  };

  const handleDeleteRecurring = async (id: string) => {
    console.log('Delete recurring:', id);
  };

  const handleToggleRecurring = async (id: string, isActive: boolean) => {
    console.log('Toggle recurring:', id, isActive);
  };

  const handleCloseTransactionForm = () => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
  };

  return (
    <ThemeProvider theme={bankingTheme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        {/* Top Bar */}
        <Box sx={{ bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                  Welcome, {user?.firstName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#d32f2f', width: 32, height: 32 }}>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
                <Button
                  startIcon={<Receipt />}
                  onClick={handleLogout}
                  size="small"
                  sx={{ color: '#666' }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Main Header */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
          <Container maxWidth="xl">
            <Toolbar sx={{ px: 0, py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <AccountBalance sx={{ fontSize: 40, color: '#d32f2f', mr: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f', fontSize: '2rem' }}>
                  PocketBank
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Button sx={{ color: '#333', fontWeight: 500 }} onClick={() => navigate('/dashboard')}>Dashboard</Button>
                <Button sx={{ color: '#d32f2f', fontWeight: 600, borderBottom: '2px solid #d32f2f' }}>Transactions</Button>
                <Button sx={{ color: '#333', fontWeight: 500 }}>Accounts</Button>
                <Button sx={{ color: '#333', fontWeight: 500 }}>Settings</Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Page Header with Stats */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
              Transactions Overview
            </Typography>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ border: '1px solid #e0e0e0', height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#666' }}>Total Income</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50' }}>
                      ${stats.totalIncome.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ border: '1px solid #e0e0e0', height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TrendingDown sx={{ color: '#f44336', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#666' }}>Total Expenses</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336' }}>
                      ${stats.totalExpense.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{
                  border: '1px solid #e0e0e0',
                  background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
                  color: 'white',
                  height: '100%'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccountBalanceWallet sx={{ color: 'white', mr: 1 }} />
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Net Balance</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      ${stats.balance.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Error Messages */}
          {(transactionsError || categoriesError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {transactionsError || categoriesError}
            </Alert>
          )}

          {/* Action Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant={currentTab === 0 ? 'contained' : 'outlined'}
                startIcon={<Receipt />}
                onClick={() => setCurrentTab(0)}
                sx={{
                  bgcolor: currentTab === 0 ? '#d32f2f' : 'transparent',
                  color: currentTab === 0 ? 'white' : '#d32f2f',
                  borderColor: '#d32f2f',
                  '&:hover': {
                    bgcolor: currentTab === 0 ? '#b71c1c' : 'rgba(211, 47, 47, 0.1)',
                    borderColor: '#d32f2f'
                  }
                }}
              >
                All Transactions
              </Button>
              <Button
                variant={currentTab === 1 ? 'contained' : 'outlined'}
                startIcon={<Category />}
                onClick={() => setCurrentTab(1)}
                sx={{
                  bgcolor: currentTab === 1 ? '#d32f2f' : 'transparent',
                  color: currentTab === 1 ? 'white' : '#d32f2f',
                  borderColor: '#d32f2f',
                  '&:hover': {
                    bgcolor: currentTab === 1 ? '#b71c1c' : 'rgba(211, 47, 47, 0.1)',
                    borderColor: '#d32f2f'
                  }
                }}
              >
                Categories
              </Button>
              <Button
                variant={currentTab === 2 ? 'contained' : 'outlined'}
                startIcon={<Repeat />}
                onClick={() => setCurrentTab(2)}
                sx={{
                  bgcolor: currentTab === 2 ? '#d32f2f' : 'transparent',
                  color: currentTab === 2 ? 'white' : '#d32f2f',
                  borderColor: '#d32f2f',
                  '&:hover': {
                    bgcolor: currentTab === 2 ? '#b71c1c' : 'rgba(211, 47, 47, 0.1)',
                    borderColor: '#d32f2f'
                  }
                }}
              >
                Recurring
              </Button>
              <Button
                variant={currentTab === 3 ? 'contained' : 'outlined'}
                startIcon={<Upload />}
                onClick={() => setCurrentTab(3)}
                sx={{
                  bgcolor: currentTab === 3 ? '#d32f2f' : 'transparent',
                  color: currentTab === 3 ? 'white' : '#d32f2f',
                  borderColor: '#d32f2f',
                  '&:hover': {
                    bgcolor: currentTab === 3 ? '#b71c1c' : 'rgba(211, 47, 47, 0.1)',
                    borderColor: '#d32f2f'
                  }
                }}
              >
                Import
              </Button>
            </Box>
            {currentTab === 0 && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowTransactionForm(true)}
                disabled={transactionsLoading}
                sx={{
                  bgcolor: '#d32f2f',
                  '&:hover': { bgcolor: '#b71c1c' }
                }}
              >
                Add Transaction
              </Button>
            )}
          </Box>

          {/* Tab Content */}
          <Paper sx={{ border: '1px solid #e0e0e0' }}>
            {/* Transactions Tab */}
            {currentTab === 0 && (
              <Box sx={{ p: 3, minHeight: '500px' }}>
                <TransactionFiltersComponent
                  filters={filters}
                  categories={categories}
                  availableTags={availableTags}
                  onFiltersChange={applyFilters}
                  onClearFilters={clearFilters}
                  loading={transactionsLoading}
                />

                {transactionsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <TransactionList
                    transactions={transactions}
                    categories={categories}
                    loading={transactionsLoading}
                    totalCount={pagination.total}
                    page={pagination.page - 1}
                    rowsPerPage={pagination.limit}
                    onPageChange={(page) => fetchTransactions(page + 1)}
                    onRowsPerPageChange={() => {
                      fetchTransactions(1);
                    }}
                    onEditTransaction={handleEditTransaction}
                    onDeleteTransaction={handleDeleteTransaction}
                    onBulkDelete={handleBulkDelete}
                    selectable
                  />
                )}
              </Box>
            )}

            {/* Categories Tab */}
            {currentTab === 1 && (
              <Box sx={{ p: 3, minHeight: '500px' }}>
                <CategoryManager
                  categories={categories}
                  onCreateCategory={async (data) => {
                    await createCategory(data);
                  }}
                  onUpdateCategory={async (id, data) => {
                    await updateCategory(id, data);
                  }}
                  onDeleteCategory={deleteCategory}
                  loading={categoriesLoading}
                />
              </Box>
            )}

            {/* Recurring Transactions Tab */}
            {currentTab === 2 && (
              <Box sx={{ p: 3, minHeight: '500px' }}>
                <RecurringTransactions
                  recurringTransactions={recurringTransactions}
                  categories={categories}
                  onCreateRecurring={handleCreateRecurring}
                  onUpdateRecurring={handleUpdateRecurring}
                  onDeleteRecurring={handleDeleteRecurring}
                  onToggleRecurring={handleToggleRecurring}
                  loading={false}
                />
              </Box>
            )}

            {/* Bulk Import Tab */}
            {currentTab === 3 && (
              <Box sx={{ p: 3, minHeight: '500px' }}>
                <BulkImport
                  onImport={handleBulkImport}
                  loading={transactionsLoading}
                />
              </Box>
            )}
          </Paper>
        </Container>

        {/* Transaction Form Dialog */}
        <Dialog
          open={showTransactionForm}
          onClose={handleCloseTransactionForm}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </DialogTitle>
          <DialogContent>
            <TransactionForm
              onSubmit={handleTransactionSubmit}
              initialData={editingTransaction}
              categories={categories}
              loading={transactionsLoading}
              title=""
            />
          </DialogContent>
        </Dialog>

        {/* Floating Action Button for Mobile */}
        {isMobile && currentTab === 0 && (
          <Fab
            color="primary"
            aria-label="add transaction"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              bgcolor: '#d32f2f',
              '&:hover': { bgcolor: '#b71c1c' }
            }}
            onClick={() => setShowTransactionForm(true)}
          >
            <Add />
          </Fab>
        )}

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default TransactionsPage;

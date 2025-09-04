import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Snackbar,
  Fab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add,
  Receipt,
  Category,
  Repeat,
  Upload
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { bankingTheme } from '../../../styles/theme';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import type { TransactionFormData, BulkImportResult, RecurringTransaction } from '../types';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import TransactionFiltersComponent from './TransactionFilters';
import CategoryManager from './CategoryManager';
import BulkImport from './BulkImport';
import RecurringTransactions from './RecurringTransactions';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} role="tabpanel">
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const TransactionsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [currentTab, setCurrentTab] = useState(0);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Mock recurring transactions data - replace with actual hook when backend is ready
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
    // Mock implementation - replace with actual API call
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

  // Mock recurring transaction handlers - implement when backend is ready
  const handleCreateRecurring = async (data: any) => {
    // Mock implementation
    console.log('Create recurring:', data);
  };

  const handleUpdateRecurring = async (id: string, data: any) => {
    // Mock implementation
    console.log('Update recurring:', id, data);
  };

  const handleDeleteRecurring = async (id: string) => {
    // Mock implementation
    console.log('Delete recurring:', id);
  };

  const handleToggleRecurring = async (id: string, isActive: boolean) => {
    // Mock implementation
    console.log('Toggle recurring:', id, isActive);
  };

  const handleCloseTransactionForm = () => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
  };

  const tabLabels = [
    { label: 'Transactions', icon: <Receipt /> },
    { label: 'Categories', icon: <Category /> },
    { label: 'Recurring', icon: <Repeat /> },
    { label: 'Import', icon: <Upload /> }
  ];

  return (
    <ThemeProvider theme={bankingTheme}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={600}>
            Transactions
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowTransactionForm(true)}
            disabled={transactionsLoading}
          >
            Add Transaction
          </Button>
        </Box>

        {(transactionsError || categoriesError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {transactionsError || categoriesError}
          </Alert>
        )}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => setCurrentTab(newValue)}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons={isMobile ? 'auto' : false}
          >
            {tabLabels.map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={currentTab} index={0}>
          {/* Transactions Tab */}
          <TransactionFiltersComponent
            filters={filters}
            categories={categories}
            availableTags={availableTags}
            onFiltersChange={applyFilters}
            onClearFilters={clearFilters}
            loading={transactionsLoading}
          />
          
          <TransactionList
            transactions={transactions}
            categories={categories}
            loading={transactionsLoading}
            totalCount={pagination.total}
            page={pagination.page - 1} // Material-UI uses 0-based pagination
            rowsPerPage={pagination.limit}
            onPageChange={(page) => fetchTransactions(page + 1)}
            onRowsPerPageChange={() => {
              // You might need to implement this in your hook
              fetchTransactions(1);
            }}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onBulkDelete={handleBulkDelete}
            selectable
          />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {/* Categories Tab */}
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
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          {/* Recurring Transactions Tab */}
          <RecurringTransactions
            recurringTransactions={recurringTransactions}
            categories={categories}
            onCreateRecurring={handleCreateRecurring}
            onUpdateRecurring={handleUpdateRecurring}
            onDeleteRecurring={handleDeleteRecurring}
            onToggleRecurring={handleToggleRecurring}
            loading={false}
          />
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          {/* Bulk Import Tab */}
          <BulkImport
            onImport={handleBulkImport}
            loading={transactionsLoading}
          />
        </TabPanel>

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
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
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
      </Container>
    </ThemeProvider>
  );
};

export default TransactionsPage;
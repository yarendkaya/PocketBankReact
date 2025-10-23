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
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  AccountBalance,
  Add,
  AccountBalanceWallet,
  TrendingUp,
  TrendingDown,
  MoreVert,
  Edit,
  Delete,
  Share,
  Notifications,
  Receipt
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { bankingTheme } from '../../../styles/theme';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useBudgets, useBudgetAlerts } from '../hooks/useBudgets';
import { useCategories } from '../../transactions/hooks/useCategories';
import type { BudgetFormData, Budget } from '../types';
import BudgetCreationWizard from './BudgetCreationWizard';
import BudgetVsActual from './BudgetVsActual';
import BudgetAlerts from './BudgetAlerts';
import BudgetTemplates from './BudgetTemplates';
import BudgetSharing from './BudgetSharing';

const BudgetPlanningPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [currentTab, setCurrentTab] = useState(0);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const {
    budgets,
    loading: budgetsLoading,
    error: budgetsError,
    createBudget,
    updateBudget,
    deleteBudget,
    shareBudget
  } = useBudgets();

  const { categories, loading: categoriesLoading } = useCategories();
  const { unreadCount } = useBudgetAlerts();

  const activeBudgets = budgets.filter(b => b.status === 'ACTIVE');
  const totalBudgeted = activeBudgets.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalSpent = activeBudgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const totalRemaining = totalBudgeted - totalSpent;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateBudget = async (data: BudgetFormData) => {
    try {
      await createBudget(data);
      setSnackbar({
        open: true,
        message: 'Budget created successfully',
        severity: 'success'
      });
      setShowWizard(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to create budget',
        severity: 'error'
      });
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(id);
        setSnackbar({
          open: true,
          message: 'Budget deleted successfully',
          severity: 'success'
        });
        setSelectedBudget(null);
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to delete budget',
          severity: 'error'
        });
      }
    }
  };

  const handleShareBudget = async (userIds: string[], permissions: any) => {
    if (selectedBudget) {
      try {
        await shareBudget(selectedBudget.id, userIds);
        setSnackbar({
          open: true,
          message: 'Budget shared successfully',
          severity: 'success'
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to share budget',
          severity: 'error'
        });
      }
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, budget: Budget) => {
    setAnchorEl(event.currentTarget);
    setSelectedBudget(budget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleApplyTemplate = (templateId: string) => {
    setShowWizard(true);
    // Template data would be pre-filled in the wizard
  };

  return (
    <ThemeProvider theme={bankingTheme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', width: '100vw', overflowX: 'hidden' }}>
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
                <Button sx={{ color: '#333', fontWeight: 500 }} onClick={() => navigate('/transactions')}>Transactions</Button>
                <Button sx={{ color: '#d32f2f', fontWeight: 600, borderBottom: '2px solid #d32f2f' }}>Budget Planning</Button>
                <Button sx={{ color: '#333', fontWeight: 500 }} onClick={() => navigate('/settings')}>Settings</Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Box sx={{ maxWidth: '1536px', margin: '0 auto', py: 4, px: { xs: 2, sm: 3 }, width: '100%' }}>
          {/* Page Header with Stats */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Budget Planning
              </Typography>
              {unreadCount > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<Notifications />}
                  onClick={() => setCurrentTab(3)}
                  sx={{
                    borderColor: '#d32f2f',
                    color: '#d32f2f',
                    '&:hover': { borderColor: '#b71c1c', bgcolor: 'rgba(211, 47, 47, 0.1)' }
                  }}
                >
                  {unreadCount} New Alerts
                </Button>
              )}
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ border: '1px solid #e0e0e0', height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccountBalanceWallet sx={{ color: '#2196f3', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#666' }}>Total Budgeted</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196f3' }}>
                      ${totalBudgeted.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ border: '1px solid #e0e0e0', height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TrendingDown sx={{ color: '#f44336', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#666' }}>Total Spent</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336' }}>
                      ${totalSpent.toLocaleString()}
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
                      <TrendingUp sx={{ color: 'white', mr: 1 }} />
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Remaining</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      ${totalRemaining.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Error Messages */}
          {budgetsError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {budgetsError}
            </Alert>
          )}

          {/* Action Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant={currentTab === 0 ? 'contained' : 'outlined'}
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
                My Budgets
              </Button>
              <Button
                variant={currentTab === 1 ? 'contained' : 'outlined'}
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
                Templates
              </Button>
              <Button
                variant={currentTab === 2 ? 'contained' : 'outlined'}
                startIcon={<Share />}
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
                Shared
              </Button>
              <Button
                variant={currentTab === 3 ? 'contained' : 'outlined'}
                startIcon={<Notifications />}
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
                Alerts
              </Button>
            </Box>
            {currentTab === 0 && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowWizard(true)}
                disabled={budgetsLoading}
                sx={{
                  bgcolor: '#d32f2f',
                  '&:hover': { bgcolor: '#b71c1c' }
                }}
              >
                Create Budget
              </Button>
            )}
          </Box>

          {/* Tab Content */}
          <Paper sx={{ border: '1px solid #e0e0e0', minHeight: '500px' }}>
            {/* My Budgets Tab */}
            {currentTab === 0 && (
              <Box sx={{ p: 3 }}>
                {budgetsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                  </Box>
                ) : budgets.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <AccountBalanceWallet sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>No Budgets Yet</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                      Create your first budget to start tracking your spending
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setShowWizard(true)}
                      sx={{
                        bgcolor: '#d32f2f',
                        '&:hover': { bgcolor: '#b71c1c' }
                      }}
                    >
                      Create Budget
                    </Button>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {budgets.map((budget) => (
                      <Grid item xs={12} key={budget.id}>
                        <Card sx={{ border: '1px solid #e0e0e0' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box>
                                <Typography variant="h6">{budget.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {budget.period} • {budget.startDate} to {budget.endDate}
                                </Typography>
                              </Box>
                              <IconButton onClick={(e) => handleMenuOpen(e, budget)}>
                                <MoreVert />
                              </IconButton>
                            </Box>
                            <BudgetVsActual budget={budget} categories={categories} />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {/* Templates Tab */}
            {currentTab === 1 && (
              <Box sx={{ p: 3 }}>
                <BudgetTemplates onApplyTemplate={handleApplyTemplate} />
              </Box>
            )}

            {/* Shared Budgets Tab */}
            {currentTab === 2 && (
              <Box sx={{ p: 3 }}>
                {selectedBudget ? (
                  <BudgetSharing
                    budget={selectedBudget}
                    onShare={handleShareBudget}
                    onRemoveShare={async () => {}}
                    loading={budgetsLoading}
                  />
                ) : (
                  <Alert severity="info">
                    Select a budget from the "My Budgets" tab to manage sharing
                  </Alert>
                )}
              </Box>
            )}

            {/* Alerts Tab */}
            {currentTab === 3 && (
              <Box sx={{ p: 3 }}>
                <BudgetAlerts />
              </Box>
            )}
          </Paper>
        </Box>

        {/* Budget Creation Wizard Dialog */}
        <Dialog
          open={showWizard}
          onClose={() => setShowWizard(false)}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogContent>
            <BudgetCreationWizard
              onSubmit={handleCreateBudget}
              onCancel={() => setShowWizard(false)}
              categories={categories}
              loading={budgetsLoading}
            />
          </DialogContent>
        </Dialog>

        {/* Budget Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => {
            handleMenuClose();
            setCurrentTab(2);
          }}>
            <Share sx={{ mr: 1 }} /> Share Budget
          </MenuItem>
          <MenuItem onClick={() => {
            handleMenuClose();
            if (selectedBudget) handleDeleteBudget(selectedBudget.id);
          }}>
            <Delete sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>

        {/* Floating Action Button for Mobile */}
        {isMobile && currentTab === 0 && (
          <Fab
            color="primary"
            aria-label="create budget"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              bgcolor: '#d32f2f',
              '&:hover': { bgcolor: '#b71c1c' }
            }}
            onClick={() => setShowWizard(true)}
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

export default BudgetPlanningPage;

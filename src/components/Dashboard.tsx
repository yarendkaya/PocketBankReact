import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import {
  AccountBalance,
  Logout,
  AccountBox,
  TrendingUp,
  Payment,
  History,
  Add
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { bankingTheme } from '../styles/theme';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

// GEREKLİ TÜM IMPORT'LAR
import { useAccounts } from '../modules/accounts/hooks/useAccounts';
import { AccountCard } from '../modules/accounts/components/AccountCard';
import { AccountForm } from '../modules/accounts/components/AccountForm';
import type { Account, AccountFormData } from '../modules/accounts/types';
import { AddAccountMethodDialog } from '../modules/accounts/components/AddAccountMethodDialog';
import { LinkBankDialog } from '../modules/accounts/components/LinkBankDialog';
import { SelectLinkedAccountsDialog } from '../modules/accounts/components/SelectLinkedAccountsDialog';

interface BalanceData {
  balance: number;
  currency: string;
}

const Dashboard: React.FC = () => {
  // ORİJİNAL STATE'LERİNİZ
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);

  // GEREKLİ YENİ STATE'LER VE HOOK'LAR
  const { accounts, loading: accountsLoading, error: accountsError, createAccount, updateAccount, deleteAccount, refetch: refetchAccounts } = useAccounts();
  const [isMethodSelectionOpen, setIsMethodSelectionOpen] = useState(false);
  const [isManualFormOpen, setIsManualFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [linkedAccounts, setLinkedAccounts] = useState<Account[]>([]);
  const [isAccountSelectionOpen, setIsAccountSelectionOpen] = useState(false);
  const [isLinkingOpen, setIsLinkingOpen] = useState(false);

  // ORİJİNAL FONKSİYONLARINIZ
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const balanceData = await ApiService.getBalance();
      setBalance(balanceData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // GEREKLİ YENİ FONKSİYONLAR
  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setIsManualFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu hesabı silmek istediğinizden emin misiniz?')) {
      await deleteAccount(id);
    }
  };
  
  const handleCloseForm = () => {
    setIsManualFormOpen(false);
    setEditingAccount(null);
  };

  const handleFormSubmit = async (data: AccountFormData) => {
    if (editingAccount) {
      await updateAccount(editingAccount.id, data);
    } else {
      await createAccount(data);
    }
    handleCloseForm();
  };

  const handleSelectMethod = (method: 'manual' | 'link') => {
    setIsMethodSelectionOpen(false);
    if (method === 'manual') {
      setEditingAccount(null);
      setIsManualFormOpen(true);
    }
    if (method === 'link') {
   setIsLinkingOpen(true); // Yeni pencereyi aç
 }
  };
  const handleLinkBankAccount = async (bank: string, username: string, password: string) => {
    try {
      const result = await ApiService.linkBankAccount(bank, username, password);
      setLinkedAccounts(result); // 'linkedAccounts' ve 'setLinkedAccounts' burada kullanılıyor
      setIsLinkingOpen(false);   // 'isLinkingOpen' burada kullanılıyor
      setIsAccountSelectionOpen(true); // 'isAccountSelectionOpen' burada kullanılıyor
    } catch (error) {
      console.error("Failed to link bank account:", error);
      alert(`Banka hesabına bağlanırken bir hata oluştu.`);
      setIsLinkingOpen(false);
    }
  };

  const handleAddSelectedAccounts = async (selectedAccounts: AccountFormData[]) => {
    try {
        await Promise.all(selectedAccounts.map(acc => createAccount(acc)));
        setIsAccountSelectionOpen(false); // 'setIsAccountSelectionOpen' burada kullanılıyor
        refetchAccounts();
    } catch(error) {
        console.error("Failed to add selected accounts:", error);
        alert('Seçilen hesaplar eklenirken bir hata oluştu.');
        refetchAccounts();
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={bankingTheme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

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
                  startIcon={<Logout />}
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
                <Button sx={{ color: '#333', fontWeight: 500 }}>Dashboard</Button>
                <Button sx={{ color: '#333', fontWeight: 500 }} onClick={() => navigate('/transactions')}>Transactions</Button>
                <Button sx={{ color: '#333', fontWeight: 500 }}>Accounts</Button>
                <Button sx={{ color: '#333', fontWeight: 500 }}>Settings</Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
            Welcome back, {user?.firstName}!
          </Typography>

          {/* Account Overview Section */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{
                background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
                color: 'white',
                height: '200px',
                border: '1px solid #e0e0e0'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>Account Balance</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {balance ? `${balance.currency} ${balance.balance.toLocaleString()}` : '---'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Available Balance</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, height: '200px', border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>Quick Actions</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{
                      textAlign: 'center',
                      p: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      border: '1px solid #e0e0e0',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                        borderColor: '#d32f2f'
                      }
                    }}>
                      <Box sx={{ color: '#d32f2f', mb: 1 }}>
                        <Payment />
                      </Box>
                      <Typography variant="body2" fontWeight={500}>Transfer</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{
                      textAlign: 'center',
                      p: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      border: '1px solid #e0e0e0',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                        borderColor: '#d32f2f'
                      }
                    }}>
                      <Box sx={{ color: '#d32f2f', mb: 1 }}>
                        <History />
                      </Box>
                      <Typography variant="body2" fontWeight={500}>History</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{
                      textAlign: 'center',
                      p: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      border: '1px solid #e0e0e0',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                        borderColor: '#d32f2f'
                      }
                    }}>
                      <Box sx={{ color: '#d32f2f', mb: 1 }}>
                        <TrendingUp />
                      </Box>
                      <Typography variant="body2" fontWeight={500}>Investments</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{
                      textAlign: 'center',
                      p: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      border: '1px solid #e0e0e0',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                        borderColor: '#d32f2f'
                      }
                    }}>
                      <Box sx={{ color: '#d32f2f', mb: 1 }}>
                        <AccountBox />
                      </Box>
                      <Typography variant="body2" fontWeight={500}>Settings</Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>Account Information</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Email</Typography>
                  <Typography variant="body1" sx={{ color: '#333' }}>{user?.email}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Name</Typography>
                  <Typography variant="body1" sx={{ color: '#333' }}>{user?.firstName} {user?.lastName}</Typography>
                </Box>
                {user?.phone && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Phone</Typography>
                    <Typography variant="body1" sx={{ color: '#333' }}>{user.phone}</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>Recent Activity</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', py: 4 }}>
                  No recent transactions
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {/* My Accounts Section */}
          <Box sx={{ mt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>My Accounts</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setIsMethodSelectionOpen(true)}
                sx={{
                  bgcolor: '#d32f2f',
                  '&:hover': { bgcolor: '#b71c1c' }
                }}
              >
                Add New Account
              </Button>
            </Box>
            {accountsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
            ) : accountsError ? (
              <Alert severity="error">{accountsError}</Alert>
            ) : (
              <Grid container spacing={3}>
                {accounts.map(account => (
                  <Grid item xs={12} sm={6} md={4} key={account.id}>
                    <AccountCard account={account} onEdit={handleEdit} onDelete={handleDelete} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Container>

        {/* YENİ PENCERELER (SADECE EKLENDİ) */}
        <AddAccountMethodDialog
          open={isMethodSelectionOpen}
          onClose={() => setIsMethodSelectionOpen(false)}
          onSelectMethod={handleSelectMethod}
        />
        <Dialog open={isManualFormOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
          <DialogTitle>{editingAccount ? 'Edit Account' : 'Add a New Account Manually'}</DialogTitle>
          <DialogContent sx={{ pt: '20px !important' }}>
            <AccountForm
              onSubmit={handleFormSubmit}
              onCancel={handleCloseForm}
              loading={accountsLoading}
              initialData={editingAccount} 
            />
          </DialogContent>
        </Dialog>
        {/* BU BÖLÜMÜ EKLEYİN */}
        <LinkBankDialog
          open={isLinkingOpen} // 'isLinkingOpen' burada kullanılıyor
          onClose={() => setIsLinkingOpen(false)}
          onLink={handleLinkBankAccount}
          loading={accountsLoading}
        />
        
        <SelectLinkedAccountsDialog
          open={isAccountSelectionOpen} // 'isAccountSelectionOpen' burada kullanılıyor
          onClose={() => setIsAccountSelectionOpen(false)}
          accounts={linkedAccounts} // 'linkedAccounts' burada kullanılıyor
          onAdd={handleAddSelectedAccounts}
          loading={accountsLoading}
        /> 

      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;

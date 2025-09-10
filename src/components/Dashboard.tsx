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
  CircularProgress
} from '@mui/material';
import {
  AccountBalance,
  Logout,
  AccountBox,
  TrendingUp,
  Payment,
  History
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { bankingTheme } from '../styles/theme';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

interface BalanceData {
  balance: number;
  currency: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);

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
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Header */}
        <AppBar 
          position="static" 
          elevation={0} 
          sx={{ 
            bgcolor: 'white', 
            borderBottom: '1px solid #e0e0e0',
            py: 1
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ px: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <AccountBalance sx={{ color: 'primary.main', fontSize: 36, mr: 2 }} />
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: 'primary.main', 
                    fontWeight: 700,
                    letterSpacing: -0.5
                  }}
                >
                  PocketBank
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Button
                  startIcon={<Logout />}
                  onClick={handleLogout}
                  sx={{ color: 'text.secondary' }}
                >
                  Logout
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
            Welcome back, {user?.firstName}!
          </Typography>

          <Grid container spacing={4}>
            {/* Balance Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #e3068b 0%, #c70577 100%)',
                color: 'white',
                height: '200px'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                    Account Balance
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {balance ? `${balance.currency} ${balance.balance.toLocaleString()}` : '---'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Available Balance
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, height: '200px' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Payment />}
                      sx={{ 
                        py: 2,
                        flexDirection: 'column',
                        gap: 1,
                        height: 'auto'
                      }}
                    >
                      <Typography variant="body2">Transfer Money</Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<History />}
                      onClick={() => navigate('/transactions')}
                      sx={{ 
                        py: 2,
                        flexDirection: 'column',
                        gap: 1,
                        height: 'auto'
                      }}
                    >
                      <Typography variant="body2">Transaction History</Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<TrendingUp />}
                      sx={{ 
                        py: 2,
                        flexDirection: 'column',
                        gap: 1,
                        height: 'auto'
                      }}
                    >
                      <Typography variant="body2">Investments</Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<AccountBox />}
                      sx={{ 
                        py: 2,
                        flexDirection: 'column',
                        gap: 1,
                        height: 'auto'
                      }}
                    >
                      <Typography variant="body2">Account Settings</Typography>
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Account Info */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Account Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{user?.email}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Name</Typography>
                  <Typography variant="body1">{user?.firstName} {user?.lastName}</Typography>
                </Box>
                {user?.phone && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Phone</Typography>
                    <Typography variant="body1">{user.phone}</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Recent Activity Placeholder */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Recent Activity
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No recent transactions
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
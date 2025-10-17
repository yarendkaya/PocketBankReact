import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Avatar,
  TextField,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  AccountBalance,
  Logout,
  ArrowBack,
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../../../contexts/AuthContext';
import { bankingTheme } from '../../../styles/theme';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <ThemeProvider theme={bankingTheme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        {/* Top Bar */}
        <Box sx={{ bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                Welcome, {user?.firstName}
              </Typography>
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
                <Button sx={{ color: '#333', fontWeight: 500 }} onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <Button sx={{ color: '#333', fontWeight: 500 }} onClick={() => navigate('/transactions')}>
                  Transactions
                </Button>
                <Button sx={{ color: '#333', fontWeight: 500 }} onClick={() => navigate('/budget-planning')}>
                  Budget Planning
                </Button>
                <Button sx={{ color: '#d32f2f', fontWeight: 600, borderBottom: '2px solid #d32f2f' }}>
                  Settings
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Box sx={{ maxWidth: '1536px', margin: '0 auto', py: 4, px: { xs: 2, sm: 3 }, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2, color: '#666' }}
            >
              Back
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Settings
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Profile Settings */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                  Profile Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="First Name"
                    defaultValue={user?.firstName}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Last Name"
                    defaultValue={user?.lastName}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Email"
                    defaultValue={user?.email}
                    fullWidth
                    variant="outlined"
                    disabled
                  />
                  <TextField
                    label="Phone"
                    defaultValue={user?.phone || ''}
                    fullWidth
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#d32f2f',
                      '&:hover': { bgcolor: '#b71c1c' },
                      mt: 2
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Security Settings */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, border: '1px solid #e0e0e0', mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                  Security
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Current Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#d32f2f',
                      '&:hover': { bgcolor: '#b71c1c' },
                      mt: 2
                    }}
                  >
                    Update Password
                  </Button>
                </Box>
              </Paper>

              <Paper sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                  Preferences
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={twoFactorAuth}
                        onChange={(e) => setTwoFactorAuth(e.target.checked)}
                        color="error"
                      />
                    }
                    label="Enable Two-Factor Authentication"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationsEnabled}
                        onChange={(e) => setNotificationsEnabled(e.target.checked)}
                        color="error"
                      />
                    }
                    label="Push Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        color="error"
                      />
                    }
                    label="Email Notifications"
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SettingsPage;

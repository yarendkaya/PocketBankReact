import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Container,
  Typography,
  Grid,
  Breadcrumbs,
  Link,
  Card
} from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { Header } from './layout/Header';
import { HeroSection } from './layout/HeroSection';
import { QuickActions } from './layout/QuickActions';
import { SecurityCard } from './layout/SecurityCard';
import { BankingServices } from './layout/BankingServices';
import { LoginForm } from './auth/LoginForm';
import { RegisterForm } from './auth/RegisterForm';
import { validateLoginForm, validateRegisterForm } from '../utils/validation';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const MainPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    const validationErrors = validateLoginForm(email, password);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        await login({ email, password });
        navigate('/dashboard');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        setErrors({ general: errorMessage });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRegister = async (data: RegisterData) => {
    const validationErrors = validateRegisterForm(
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.password,
      data.confirmPassword
    );
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        await register(data);
        navigate('/dashboard');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Registration failed';
        setErrors({ general: errorMessage });
      } finally {
        setLoading(false);
      }
    }
  };

  const switchForm = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setErrors({});
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Header />
      <HeroSection />
      <QuickActions />

      {/* Breadcrumb */}
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ fontSize: '0.875rem' }}
        >
          <Link underline="hover" color="inherit" href="#" sx={{ color: '#666' }}>
            Home
          </Link>
          <Link underline="hover" color="inherit" href="#" sx={{ color: '#666' }}>
            Digital Banking
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 500 }}>
            Internet Banking Login
          </Typography>
        </Breadcrumbs>
      </Container>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ pb: 8 }}>
        <Grid container spacing={6}>
          {/* Left Column - Information */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ pr: { lg: 4 } }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}
              >
                Welcome to PocketBank Digital Banking
              </Typography>

              <Typography
                variant="body1"
                paragraph
                sx={{ color: '#666', lineHeight: 1.6, mb: 3 }}
              >
                Experience all the possibilities of modern banking with our digital platform.
                Manage your financial transactions securely, anywhere, anytime.
              </Typography>

              <SecurityCard />
              <BankingServices />
            </Box>
          </Grid>

          {/* Right Column - Forms */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ position: 'sticky', top: 24 }}>
              {/* Form Selection Tabs */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 1.5,
                      textAlign: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      border: '2px solid',
                      borderColor: isLogin ? '#d32f2f' : '#e0e0e0',
                      bgcolor: isLogin ? '#fafafa' : 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#d32f2f',
                        bgcolor: '#fafafa'
                      }
                    }}
                    onClick={() => switchForm(true)}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        color: isLogin ? '#d32f2f' : '#666',
                        mb: 0.5,
                        fontSize: '0.95rem'
                      }}
                    >
                      Login
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#666',
                        fontSize: '0.7rem',
                        display: 'block'
                      }}
                    >
                      Already have an account?
                    </Typography>
                    {isLogin && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          bgcolor: '#d32f2f',
                          borderRadius: '0 0 4px 4px'
                        }}
                      />
                    )}
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 1.5,
                      textAlign: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      border: '2px solid',
                      borderColor: !isLogin ? '#d32f2f' : '#e0e0e0',
                      bgcolor: !isLogin ? '#fafafa' : 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#d32f2f',
                        bgcolor: '#fafafa'
                      }
                    }}
                    onClick={() => switchForm(false)}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        color: !isLogin ? '#d32f2f' : '#666',
                        mb: 0.5,
                        fontSize: '0.95rem'
                      }}
                    >
                      Register
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#666',
                        fontSize: '0.7rem',
                        display: 'block'
                      }}
                    >
                      New to PocketBank?
                    </Typography>
                    {!isLogin && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          bgcolor: '#d32f2f',
                          borderRadius: '0 0 4px 4px'
                        }}
                      />
                    )}
                  </Card>
                </Grid>
              </Grid>

              {/* Active Form */}
              <Card elevation={2} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                {isLogin ? (
                  <LoginForm
                    onSubmit={handleLogin}
                    errors={errors}
                    loading={loading}
                  />
                ) : (
                  <RegisterForm
                    onSubmit={handleRegister}
                    errors={errors}
                    loading={loading}
                  />
                )}
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MainPage;

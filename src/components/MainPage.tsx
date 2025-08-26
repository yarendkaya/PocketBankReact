import { useState } from 'react'
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Grid,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  AccountBalance,
  Person,
  Lock,
  Security,
  Shield,
  NavigateNext,
  Phone,
  Help
} from '@mui/icons-material'
import { ThemeProvider } from '@mui/material/styles'
import { bankingTheme } from '../styles/theme'
import { mainPageStyles } from '../styles/mainPageStyles'

const MainPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loginForm, setLoginForm] = useState({ 
    customerId: '', 
    password: '' 
  })
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: {[key: string]: string} = {}

    if (!loginForm.customerId.trim()) {
      newErrors.customerId = 'Customer ID is required'
    }

    if (!loginForm.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      console.log('Login attempt:', loginForm)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: {[key: string]: string} = {}

    if (!registerForm.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!registerForm.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!registerForm.email || !validateEmail(registerForm.email)) {
      newErrors.email = 'Valid email is required'
    }
    if (!registerForm.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!validatePassword(registerForm.password)) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      console.log('Register attempt:', registerForm)
    }
  }

  const bankingServices = [
    { title: 'Account Management', description: 'View balances & history' },
    { title: 'Money Transfers', description: 'Send money instantly' },
    { title: 'Bill Payments', description: 'Pay utilities & loans' },
    { title: 'Investment Portfolio', description: 'Track investments' },
    { title: 'Card Services', description: 'Manage cards & limits' },
    { title: 'Loan Services', description: 'Apply & track loans' }
  ]

  return (
    <ThemeProvider theme={bankingTheme}>
      <Box sx={mainPageStyles.root}>
        {/* Header */}
        <AppBar position="static" elevation={0} sx={mainPageStyles.header}>
          <Container maxWidth="xl">
            <Toolbar sx={{ px: 0 }}>
              <Box sx={mainPageStyles.headerLeft}>
                <AccountBalance sx={mainPageStyles.headerIcon} />
                <Typography variant="h4" sx={mainPageStyles.headerTitle}>
                  PocketBank
                </Typography>
              </Box>
              <Box sx={mainPageStyles.headerRight}>
                <Button startIcon={<Phone />} sx={mainPageStyles.headerButton}>
                  444 0 POCKET
                </Button>
                <Button startIcon={<Help />} sx={mainPageStyles.headerButton}>
                  Help & Support
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Hero Section */}
        <Box sx={mainPageStyles.hero}>
          <Container maxWidth="xl">
            <Box sx={mainPageStyles.heroContent}>
              <Typography variant="h3" sx={mainPageStyles.heroTitle}>
                Internet Banking
              </Typography>
              <Typography variant="body1" sx={mainPageStyles.heroDescription}>
                Secure, fast, and convenient banking at your fingertips. 
                Access your accounts 24/7 with our advanced digital banking platform.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Breadcrumb */}
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ fontSize: '0.875rem' }}>
            <Link underline="hover" color="inherit" href="#" sx={mainPageStyles.breadcrumbLink}>
              Home
            </Link>
            <Link underline="hover" color="inherit" href="#" sx={mainPageStyles.breadcrumbLink}>
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
                <Typography variant="h4" gutterBottom sx={mainPageStyles.sectionTitle}>
                  Welcome to PocketBank Digital Banking
                </Typography>
                
                <Typography variant="body1" paragraph sx={mainPageStyles.sectionDescription}>
                  Experience modern banking with our comprehensive digital platform. 
                  Manage your finances securely from anywhere, anytime with our 
                  state-of-the-art internet banking solution.
                </Typography>

                {/* Security Card */}
                <Paper sx={mainPageStyles.securityCard}>
                  <Box sx={mainPageStyles.securityHeader}>
                    <Shield sx={mainPageStyles.securityIcon} />
                    <Typography variant="h6" sx={mainPageStyles.securityTitle}>
                      Bank-Grade Security
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph sx={mainPageStyles.securityDescription}>
                    Your security is our top priority. We employ multiple layers of 
                    protection to ensure your data and transactions remain secure.
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={mainPageStyles.securityFeature}>
                        <Security sx={mainPageStyles.securityFeatureIcon} />
                        <Typography variant="body2" sx={mainPageStyles.securityFeatureText}>
                          256-bit SSL Encryption
                        </Typography>
                      </Box>
                      <Box sx={mainPageStyles.securityFeature}>
                        <Security sx={mainPageStyles.securityFeatureIcon} />
                        <Typography variant="body2" sx={mainPageStyles.securityFeatureText}>
                          Two-Factor Authentication
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={mainPageStyles.securityFeature}>
                        <Security sx={mainPageStyles.securityFeatureIcon} />
                        <Typography variant="body2" sx={mainPageStyles.securityFeatureText}>
                          JWT Token Security
                        </Typography>
                      </Box>
                      <Box sx={mainPageStyles.securityFeature}>
                        <Security sx={mainPageStyles.securityFeatureIcon} />
                        <Typography variant="body2" sx={mainPageStyles.securityFeatureText}>
                          Real-time Monitoring
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Banking Services */}
                <Typography variant="h6" gutterBottom sx={mainPageStyles.servicesTitle}>
                  Banking Services
                </Typography>
                <Grid container spacing={1.5}>
                  {bankingServices.map((service, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <Paper sx={mainPageStyles.serviceCard}>
                        <Typography variant="subtitle2" sx={mainPageStyles.serviceTitle}>
                          {service.title}
                        </Typography>
                        <Typography variant="body2" sx={mainPageStyles.serviceDescription}>
                          {service.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            {/* Right Column - Forms */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ position: 'sticky', top: 24 }}>
                {/* Form Selection Boxes */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{
                      ...mainPageStyles.formSelector,
                      ...(isLogin ? mainPageStyles.formSelectorActive : mainPageStyles.formSelectorInactive)
                    }} onClick={() => setIsLogin(true)}>
                      <Typography variant="h6" sx={{
                        ...mainPageStyles.formSelectorTitle,
                        color: isLogin ? 'primary.main' : 'text.primary'
                      }}>
                        Sign In
                      </Typography>
                      <Typography variant="body2" sx={mainPageStyles.formSelectorDescription}>
                        Already have an account?
                      </Typography>
                      {isLogin && <Box sx={mainPageStyles.activeIndicator} />}
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{
                      ...mainPageStyles.formSelector,
                      ...(!isLogin ? mainPageStyles.formSelectorActive : mainPageStyles.formSelectorInactive)
                    }} onClick={() => setIsLogin(false)}>
                      <Typography variant="h6" sx={{
                        ...mainPageStyles.formSelectorTitle,
                        color: !isLogin ? 'primary.main' : 'text.primary'
                      }}>
                        Register
                      </Typography>
                      <Typography variant="body2" sx={mainPageStyles.formSelectorDescription}>
                        New to PocketBank?
                      </Typography>
                      {!isLogin && <Box sx={mainPageStyles.activeIndicator} />}
                    </Paper>
                  </Grid>
                </Grid>

                {/* Active Form */}
                <Paper elevation={0} sx={mainPageStyles.formContainer}>
                  {isLogin ? (
                    <Box component="form" onSubmit={handleLogin}>
                      <Typography variant="h6" sx={mainPageStyles.formTitle}>
                        Welcome Back
                      </Typography>
                      <Typography variant="body2" sx={mainPageStyles.formSubtitle}>
                        Please sign in to your account
                      </Typography>
                      
                      <TextField
                        fullWidth
                        label="Customer ID"
                        placeholder="Enter your customer ID"
                        variant="outlined"
                        size="small"
                        value={loginForm.customerId}
                        onChange={(e) => setLoginForm({ ...loginForm, customerId: e.target.value })}
                        error={!!errors.customerId}
                        helperText={errors.customerId}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                        required
                      />
                      
                      <TextField
                        fullWidth
                        label="Password"
                        placeholder="Enter your password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        size="small"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                size="small"
                              >
                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 3 }}
                        required
                      />
                      
                      <Button type="submit" fullWidth variant="contained" size="medium" sx={{ mb: 2 }}>
                        Sign In to Account
                      </Button>
                      
                      <Box sx={{ textAlign: 'center' }}>
                        <Link href="#" variant="body2" sx={mainPageStyles.forgotPassword}>
                          Forgot your password?
                        </Link>
                      </Box>
                    </Box>
                  ) : (
                    <Box component="form" onSubmit={handleRegister}>
                      <Typography variant="h6" sx={mainPageStyles.formTitle}>
                        Create Account
                      </Typography>
                      <Typography variant="body2" sx={mainPageStyles.formSubtitle}>
                        Join PocketBank today
                      </Typography>
                      
                      <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="First Name"
                            variant="outlined"
                            size="small"
                            value={registerForm.firstName}
                            onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                            required
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Last Name"
                            variant="outlined"
                            size="small"
                            value={registerForm.lastName}
                            onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                            required
                          />
                        </Grid>
                      </Grid>
                      
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        variant="outlined"
                        size="small"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={{ mb: 2 }}
                        required
                      />
                      
                      <TextField
                        fullWidth
                        label="Phone Number"
                        variant="outlined"
                        size="small"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        sx={{ mb: 2 }}
                        required
                      />
                      
                      <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        size="small"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        error={!!errors.password}
                        helperText={errors.password || 'Minimum 8 characters'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                size="small"
                              >
                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                        required
                      />
                      
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        size="small"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        sx={{ mb: 3 }}
                        required
                      />
                      
                      <Button type="submit" fullWidth variant="contained" size="medium">
                        Create Account
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default MainPage
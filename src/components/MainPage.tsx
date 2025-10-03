import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Box,
  Container,
  Typography,
  Grid,
  Breadcrumbs,
  Link,
  Card
} from '@mui/material'
import { NavigateNext } from '@mui/icons-material'

// Layout components
import { Header } from './layout/Header'
import { HeroSection } from './layout/HeroSection'
import { QuickActions } from './layout/QuickActions'
import { SecurityCard } from './layout/SecurityCard'
import { BankingServices } from './layout/BankingServices'

// Auth components
import { LoginForm } from './auth/LoginForm'
import { RegisterForm } from './auth/RegisterForm'

// Utilities
import { validateLoginForm, validateRegisterForm } from '../utils/validation'

const MainPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleLogin = async (email: string, password: string) => {
    const validationErrors = validateLoginForm(email, password)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true)
      try {
        await login({ email, password })
        navigate('/dashboard')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Giriş başarısız'
        setErrors({ general: errorMessage })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleRegister = async (data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
  }) => {
    const validationErrors = validateRegisterForm(
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.password,
      data.confirmPassword
    )
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true)
      try {
        await register(data)
        navigate('/dashboard')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Kayıt başarısız'
        setErrors({ general: errorMessage })
      } finally {
        setLoading(false)
      }
    }
  }

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
            Ana Sayfa
          </Link>
          <Link underline="hover" color="inherit" href="#" sx={{ color: '#666' }}>
            Dijital Bankacılık
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 500 }}>
            İnternet Bankacılığı Girişi
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
                PocketBank Dijital Bankacılığa Hoş Geldiniz
              </Typography>

              <Typography
                variant="body1"
                paragraph
                sx={{ color: '#666', lineHeight: 1.6, mb: 3 }}
              >
                Modern bankacılığın tüm imkanlarını dijital platformumuzla
                deneyimleyin. Finansal işlemlerinizi güvenle, her yerden, her zaman
                yönetin.
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
                <Grid item xs={6} sx={{ display: 'flex' }}>
                  <Card
                    elevation={0}
                    sx={{
                      flex: 1,
                      p: 1,
                      textAlign: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      border: isLogin
                        ? '2px solid #d32f2f'
                        : '2px solid #e0e0e0',
                      bgcolor: isLogin ? '#fafafa' : 'white',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => setIsLogin(true)}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        color: isLogin ? '#d32f2f' : '#666',
                        mb: 0.25,
                        fontSize: '0.95rem'
                      }}
                    >
                      Giriş Yap
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#666',
                        fontSize: '0.7rem',
                        display: 'block',
                        textAlign: 'center',
                        minHeight: 20
                      }}
                    >
                      Hesabınız var mı?
                    </Typography>
                    {isLogin && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          bgcolor: '#d32f2f'
                        }}
                      />
                    )}
                  </Card>
                </Grid>
                <Grid item xs={6} sx={{ display: 'flex' }}>
                  <Card
                    elevation={0}
                    sx={{
                      flex: 1,
                      p: 1,
                      textAlign: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      border: !isLogin
                        ? '2px solid #d32f2f'
                        : '2px solid #e0e0e0',
                      bgcolor: !isLogin ? '#fafafa' : 'white',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => setIsLogin(false)}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        color: !isLogin ? '#d32f2f' : '#666',
                        mb: 0.25,
                        fontSize: '0.95rem'
                      }}
                    >
                      Kayıt Ol
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#666',
                        fontSize: '0.68rem',
                        display: 'block',
                        textAlign: 'center',
                        minHeight: 20
                      }}
                    >
                      PocketBank'ta yeni misiniz?
                    </Typography>
                    {!isLogin && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          bgcolor: '#d32f2f'
                        }}
                      />
                    )}
                  </Card>
                </Grid>
              </Grid>

              {/* Active Form */}
              <Card elevation={2} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                {isLogin ? (
                  <LoginForm onSubmit={handleLogin} errors={errors} loading={loading} />
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
  )
}

export default MainPage

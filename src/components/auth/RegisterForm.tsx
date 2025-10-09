import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Grid
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Phone
} from '@mui/icons-material'

interface RegisterFormProps {
  onSubmit: (data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
  }) => Promise<void>
  errors: { [key: string]: string }
  loading: boolean
}

export const RegisterForm = ({ onSubmit, errors, loading }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
        Hesap Oluştur
      </Typography>
      <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
        PocketBank ailesine katılın
      </Typography>

      <Grid container spacing={1} sx={{ mb: 1.5 }}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Ad"
            variant="outlined"
            size="small"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Soyad"
            variant="outlined"
            size="small"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName}
            required
          />
        </Grid>
      </Grid>

      <TextField
        fullWidth
        label="E-posta"
        type="email"
        variant="outlined"
        size="small"
        value={formData.email}
        onChange={handleChange('email')}
        error={!!errors.email}
        helperText={errors.email}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person color="action" fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 1.5 }}
        required
      />

      <TextField
        fullWidth
        label="Telefon"
        variant="outlined"
        size="small"
        value={formData.phone}
        onChange={handleChange('phone')}
        error={!!errors.phone}
        helperText={errors.phone}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone color="action" fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 1.5 }}
        required
      />

      <TextField
        fullWidth
        label="Şifre"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        size="small"
        value={formData.password}
        onChange={handleChange('password')}
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
        sx={{ mb: 1.5 }}
        required
      />

      <TextField
        fullWidth
        label="Şifre Tekrar"
        type="password"
        variant="outlined"
        size="small"
        value={formData.confirmPassword}
        onChange={handleChange('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
        required
      />

      {errors.general && (
        <Typography variant="body2" color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {errors.general}
        </Typography>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="medium"
        sx={{
          mb: 2,
          bgcolor: '#d32f2f',
          '&:hover': { bgcolor: '#b71c1c' }
        }}
        disabled={loading}
      >
        {loading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
      </Button>
    </Box>
  )
}

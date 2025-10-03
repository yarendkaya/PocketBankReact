import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Link
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock
} from '@mui/icons-material'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
  errors: { [key: string]: string }
  loading: boolean
}

export const LoginForm = ({ onSubmit, errors, loading }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(email, password)
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
        Hoş Geldiniz
      </Typography>
      <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
        Hesabınıza giriş yapın
      </Typography>

      <TextField
        fullWidth
        label="E-posta Adresi"
        placeholder="E-posta adresinizi girin"
        type="email"
        variant="outlined"
        size="small"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
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
        label="Şifre"
        placeholder="Şifrenizi girin"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        size="small"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
        {loading ? 'Giriş yapılıyor...' : 'Hesaba Giriş Yap'}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Link href="#" variant="body2" sx={{ color: '#d32f2f', textDecoration: 'none' }}>
          Şifrenizi mi unuttunuz?
        </Link>
      </Box>
    </Box>
  )
}

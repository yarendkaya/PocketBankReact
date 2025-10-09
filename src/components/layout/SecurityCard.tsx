import {
  Box,
  Card,
  Grid,
  Typography
} from '@mui/material'
import {
  Shield,
  Security
} from '@mui/icons-material'

export const SecurityCard = () => {
  const securityFeatures = [
    '256-bit SSL Şifreleme',
    'İki Faktörlü Doğrulama',
    'Gelişmiş Token Güvenliği',
    '7/24 Güvenlik İzleme'
  ]

  return (
    <Card sx={{ p: 3, mb: 4, border: '1px solid #e0e0e0' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Shield sx={{ fontSize: 32, color: '#d32f2f', mr: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
          Güvenlik Önceliğimiz
        </Typography>
      </Box>
      <Typography variant="body2" paragraph sx={{ color: '#666', mb: 3 }}>
        Güvenliğiniz bizim önceliğimizdir. Verilerinizi ve işlemlerinizi korumak için
        en ileri güvenlik teknolojilerini kullanırız.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {securityFeatures.slice(0, 2).map((feature, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Security sx={{ fontSize: 20, color: '#1976d2', mr: 1 }} />
              <Typography variant="body2" sx={{ color: '#333' }}>
                {feature}
              </Typography>
            </Box>
          ))}
        </Grid>
        <Grid item xs={12} sm={6}>
          {securityFeatures.slice(2).map((feature, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Security sx={{ fontSize: 20, color: '#1976d2', mr: 1 }} />
              <Typography variant="body2" sx={{ color: '#333' }}>
                {feature}
              </Typography>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Card>
  )
}

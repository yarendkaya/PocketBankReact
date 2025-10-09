import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Chip
} from '@mui/material'
import {
  Security,
  Phone,
  TrendingUp
} from '@mui/icons-material'

export const HeroSection = () => {
  return (
    <Box sx={{
      background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
      color: 'white',
      py: 6
    }}>
      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
              İnternet Bankacılığı
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6 }}>
              7/24 güvenli bankacılık hizmetleri. Hesaplarınızı yönetin,
              para transferi yapın, yatırımlarınızı takip edin.
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip
                icon={<Security />}
                label="Güvenli Bankacılık"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={<Phone />}
                label="7/24 Hizmet"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={<TrendingUp />}
                label="Anlık İşlemler"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

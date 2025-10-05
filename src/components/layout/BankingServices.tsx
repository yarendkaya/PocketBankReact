import {
  Box,
  Grid,
  Card,
  Typography
} from '@mui/material'
import { bankingServices } from '../../constants/bankingData'

export const BankingServices = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}>
        Bankacılık Hizmetleri
      </Typography>
      <Grid container spacing={2}>
        {bankingServices.map((service, index) => {
          const IconComponent = service.icon
          return (
            <Grid item xs={6} sm={4} md={4} key={index}>
              <Card sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}>
                <Box sx={{ color: '#d32f2f', mb: 1 }}>
                  <IconComponent />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {service.description}
                </Typography>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

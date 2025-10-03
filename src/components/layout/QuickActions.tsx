import {
  Box,
  Container,
  Grid,
  Card,
  Typography
} from '@mui/material'
import { quickActions } from '../../constants/bankingData'

export const QuickActions = () => {
  return (
    <Box sx={{ bgcolor: '#f8f9fa', py: 3 }}>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          {quickActions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <Grid item xs={6} sm={3} key={index}>
                <Card sx={{
                  textAlign: 'center',
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}>
                  <Box sx={{ color: action.color, mb: 1 }}>
                    <IconComponent />
                  </Box>
                  <Typography variant="body2" fontWeight={500}>
                    {action.title}
                  </Typography>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </Box>
  )
}

import {
  Box,
  Container,
  Button,
  AppBar,
  Toolbar,
  Typography
} from '@mui/material'
import {
  AccountBalance,
  Phone,
  Language
} from '@mui/icons-material'

export const Header = () => {
  return (
    <>
      {/* Top Bar */}
      <Box sx={{ bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button size="small" startIcon={<Phone />} sx={{ color: '#666', fontSize: '0.875rem' }}>
                444 0 POCKET
              </Button>
              <Button size="small" sx={{ color: '#666', fontSize: '0.875rem' }}>
                Şube/ATM
              </Button>
              <Button size="small" sx={{ color: '#666', fontSize: '0.875rem' }}>
                İletişim
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" startIcon={<Language />} sx={{ color: '#666' }}>
                TR
              </Button>
              <Button size="small" sx={{ color: '#666' }}>
                EN
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
              <Button sx={{ color: '#333', fontWeight: 500 }}>Bireysel</Button>
              <Button sx={{ color: '#333', fontWeight: 500 }}>Ticari</Button>
              <Button sx={{ color: '#333', fontWeight: 500 }}>Kurumsal</Button>
              <Button sx={{ color: '#333', fontWeight: 500 }}>Yatırımcı İlişkileri</Button>
              <Button sx={{ color: '#333', fontWeight: 500 }}>Bankamız</Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}

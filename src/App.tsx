import { useState } from 'react'
import { Button as MuiButton, Typography, Box, Card, CardContent } from '@mui/material'
import { Favorite } from '@mui/icons-material'
import { Button as AntButton, Space, Divider, notification } from 'antd'
import { HeartOutlined, StarOutlined } from '@ant-design/icons'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const showNotification = () => {
    notification.success({
      message: 'Success',
      description: 'Both Material-UI and Ant Design are working perfectly!',
    })
  }

  return (
    <Box sx={{ padding: 4, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        React 18 + TypeScript + MUI + Ant Design
      </Typography>
      
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Material-UI Components
          </Typography>
          <Space direction="vertical">
            <MuiButton 
              variant="contained" 
              color="primary" 
              startIcon={<Favorite />}
              onClick={() => setCount(count + 1)}
            >
              MUI Button (Count: {count})
            </MuiButton>
          </Space>
        </CardContent>
      </Card>

      <Divider style={{ margin: '24px 0' }} />

      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Ant Design Components
          </Typography>
          <Space>
            <AntButton 
              type="primary" 
              icon={<HeartOutlined />}
              onClick={showNotification}
            >
              Ant Design Button
            </AntButton>
            <AntButton 
              type="default" 
              icon={<StarOutlined />}
              onClick={() => setCount(count - 1)}
            >
              Decrease Count
            </AntButton>
          </Space>
        </CardContent>
      </Card>

      <Typography variant="body1" align="center" color="text.secondary">
        Edit src/App.tsx and save to test HMR with both UI libraries!
      </Typography>
    </Box>
  )
}

export default App

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Badge,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button
} from '@mui/material';
import {
  Warning,
  Error as ErrorIcon,
  Info,
  CheckCircle,
  Close,
  Notifications
} from '@mui/icons-material';
import { useBudgetAlerts } from '../hooks/useBudgets';
import { AlertType } from '../types';
import type { BudgetAlert } from '../types';

interface BudgetAlertsProps {
  budgetId?: string;
  compact?: boolean;
}

const BudgetAlerts: React.FC<BudgetAlertsProps> = ({ budgetId, compact = false }) => {
  const { alerts, loading, markAlertAsRead, unreadCount } = useBudgetAlerts(budgetId);

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'CRITICAL':
        return <ErrorIcon sx={{ color: '#f44336' }} />;
      case 'WARNING':
        return <Warning sx={{ color: '#ff9800' }} />;
      case 'INFO':
        return <Info sx={{ color: '#2196f3' }} />;
      default:
        return <Info />;
    }
  };

  const getAlertSeverity = (type: AlertType): 'error' | 'warning' | 'info' => {
    switch (type) {
      case 'CRITICAL':
        return 'error';
      case 'WARNING':
        return 'warning';
      case 'INFO':
        return 'info';
      default:
        return 'info';
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    await markAlertAsRead(alertId);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="textSecondary">Loading alerts...</Typography>
      </Box>
    );
  }

  if (alerts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircle sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
        <Typography variant="h6" gutterBottom>All Good!</Typography>
        <Typography variant="body2" color="textSecondary">
          No budget alerts at the moment
        </Typography>
      </Box>
    );
  }

  if (compact) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Badge badgeContent={unreadCount} color="error">
            <Notifications />
          </Badge>
          <Typography variant="subtitle1" fontWeight="bold">
            Budget Alerts
          </Typography>
        </Box>

        {alerts.slice(0, 3).map((alert) => (
          <Alert
            key={alert.id}
            severity={getAlertSeverity(alert.type)}
            onClose={() => handleMarkAsRead(alert.id)}
            sx={{ mb: 1, opacity: alert.isRead ? 0.6 : 1 }}
          >
            {alert.message}
          </Alert>
        ))}

        {alerts.length > 3 && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1, textAlign: 'center' }}>
            +{alerts.length - 3} more alerts
          </Typography>
        )}
      </Box>
    );
  }

  const unreadAlerts = alerts.filter(a => !a.isRead);
  const readAlerts = alerts.filter(a => a.isRead);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">Budget Alerts</Typography>
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} unread`}
              size="small"
              color="error"
            />
          )}
        </Box>
        {unreadAlerts.length > 0 && (
          <Button
            size="small"
            onClick={() => unreadAlerts.forEach(a => markAlertAsRead(a.id))}
          >
            Mark All as Read
          </Button>
        )}
      </Box>

      {/* Unread Alerts */}
      {unreadAlerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Unread
          </Typography>
          <List>
            {unreadAlerts.map((alert) => (
              <Card key={alert.id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                      <Box>{getAlertIcon(alert.type)}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip
                            label={alert.type}
                            size="small"
                            color={alert.type === 'CRITICAL' ? 'error' : alert.type === 'WARNING' ? 'warning' : 'info'}
                          />
                          <Typography variant="caption" color="textSecondary">
                            {new Date(alert.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="body1" gutterBottom>
                          {alert.message}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                          <Typography variant="caption" color="textSecondary">
                            Threshold: {alert.threshold}%
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Current: {alert.currentPercentage.toFixed(1)}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleMarkAsRead(alert.id)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </List>
        </Box>
      )}

      {/* Read Alerts */}
      {readAlerts.length > 0 && (
        <Box>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Read
          </Typography>
          <List>
            {readAlerts.map((alert) => (
              <ListItem
                key={alert.id}
                sx={{
                  mb: 1,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  opacity: 0.6,
                  bgcolor: '#fafafa'
                }}
              >
                <ListItemIcon>{getAlertIcon(alert.type)}</ListItemIcon>
                <ListItemText
                  primary={alert.message}
                  secondary={new Date(alert.createdAt).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default BudgetAlerts;

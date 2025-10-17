import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Chip,
  FormControlLabel,
  Switch,
  Alert,
  Autocomplete
} from '@mui/material';
import {
  Share,
  PersonAdd,
  Delete,
  Edit,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import type { Budget, SharedBudget } from '../types';

interface BudgetSharingProps {
  budget: Budget;
  onShare: (userIds: string[], permissions: { canEdit: boolean; canView: boolean }) => Promise<void>;
  onRemoveShare: (userId: string) => Promise<void>;
  loading?: boolean;
}

const BudgetSharing: React.FC<BudgetSharingProps> = ({
  budget,
  onShare,
  onRemoveShare,
  loading = false
}) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [permissions, setPermissions] = useState({
    canEdit: false,
    canView: true
  });
  const [error, setError] = useState('');

  // Mock users - in production, this would come from an API
  const [availableUsers] = useState([
    { id: '1', email: 'user1@example.com', name: 'John Doe' },
    { id: '2', email: 'user2@example.com', name: 'Jane Smith' },
    { id: '3', email: 'user3@example.com', name: 'Bob Johnson' }
  ]);

  const handleShare = async () => {
    if (selectedUsers.length === 0) {
      setError('Please select at least one user to share with');
      return;
    }

    try {
      await onShare(selectedUsers, permissions);
      setShareDialogOpen(false);
      setSelectedUsers([]);
      setEmailInput('');
      setError('');
    } catch (err) {
      setError('Failed to share budget');
    }
  };

  const handleRemoveShare = async (userId: string) => {
    if (window.confirm('Are you sure you want to remove this user from the budget?')) {
      try {
        await onRemoveShare(userId);
      } catch (err) {
        setError('Failed to remove user');
      }
    }
  };

  const sharedUsers = budget.sharedWith || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6">Budget Sharing</Typography>
          <Typography variant="body2" color="textSecondary">
            Share this budget with other users
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setShareDialogOpen(true)}
          sx={{
            bgcolor: '#d32f2f',
            '&:hover': { bgcolor: '#b71c1c' }
          }}
        >
          Share Budget
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {budget.isShared && sharedUsers.length > 0 ? (
        <Card sx={{ border: '1px solid #e0e0e0' }}>
          <CardContent>
            <List>
              {sharedUsers.map((userId) => {
                // In production, fetch actual user data
                const user = availableUsers.find(u => u.id === userId) || {
                  id: userId,
                  name: 'Unknown User',
                  email: 'unknown@example.com'
                };

                return (
                  <ListItem key={userId} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#d32f2f' }}>
                        {user.name[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name}
                      secondary={user.email}
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip
                          label="Can View"
                          size="small"
                          icon={<Visibility />}
                        />
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveShare(userId)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ border: '1px solid #e0e0e0' }}>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Share sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Budget Not Shared
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Share this budget with others to collaborate
              </Typography>
              <Button
                variant="outlined"
                startIcon={<PersonAdd />}
                onClick={() => setShareDialogOpen(true)}
                sx={{
                  borderColor: '#d32f2f',
                  color: '#d32f2f',
                  '&:hover': {
                    borderColor: '#b71c1c',
                    bgcolor: 'rgba(211, 47, 47, 0.1)'
                  }
                }}
              >
                Share Now
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Share Budget: {budget.name}</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Users you share with will be able to view budget details and track progress together.
          </Alert>

          <Autocomplete
            multiple
            options={availableUsers}
            getOptionLabel={(option) => `${option.name} (${option.email})`}
            value={availableUsers.filter(u => selectedUsers.includes(u.id))}
            onChange={(_, newValue) => {
              setSelectedUsers(newValue.map(u => u.id));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Users"
                placeholder="Search users by name or email"
              />
            )}
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Permissions
            </Typography>
            <Box sx={{ pl: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={permissions.canView}
                    onChange={(e) => setPermissions({ ...permissions, canView: e.target.checked })}
                  />
                }
                label="Can view budget details"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={permissions.canEdit}
                    onChange={(e) => setPermissions({ ...permissions, canEdit: e.target.checked })}
                  />
                }
                label="Can edit budget (add/modify transactions)"
                disabled
              />
            </Box>
          </Box>

          {selectedUsers.length > 0 && (
            <Alert severity="success">
              Budget will be shared with {selectedUsers.length} user(s)
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleShare}
            disabled={loading || selectedUsers.length === 0}
            sx={{
              bgcolor: '#d32f2f',
              '&:hover': { bgcolor: '#b71c1c' }
            }}
          >
            {loading ? 'Sharing...' : 'Share'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetSharing;

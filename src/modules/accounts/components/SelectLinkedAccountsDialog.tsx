import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
  Chip,
  Divider
} from '@mui/material';
import { AccountBalance, CheckCircle } from '@mui/icons-material';
import type { Account, AccountFormData } from '../types';

interface SelectLinkedAccountsDialogProps {
  open: boolean;
  onClose: () => void;
  accounts: Account[];
  onAdd: (selectedAccounts: AccountFormData[]) => Promise<void>;
  loading?: boolean;
}

export const SelectLinkedAccountsDialog: React.FC<SelectLinkedAccountsDialogProps> = ({
  open,
  onClose,
  accounts,
  onAdd,
  loading = false
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setSelected([]);
    }
  }, [open]);

  const handleToggle = (accountId: string) => {
    setSelected(prev =>
      prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleAddSelected = async () => {
    const accountsToAdd = accounts
      .filter(acc => selected.includes(acc.id))
      .map(acc => ({
        name: acc.name,
        accountType: acc.accountType,
        initialBalance: acc.balance,
        currency: acc.currency,
      }));

    await onAdd(accountsToAdd);
  };

  const isSelected = (accountId: string) => selected.includes(accountId);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalance sx={{ color: '#d32f2f' }} />
          <Typography variant="h6" fontWeight={600}>
            Select Accounts to Add
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          We found the following accounts. Please select which ones you'd like to add to PocketBank.
        </Typography>

        {selected.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Chip
              icon={<CheckCircle />}
              label={`${selected.length} account${selected.length > 1 ? 's' : ''} selected`}
              color="primary"
              size="small"
              sx={{
                bgcolor: '#e3f2fd',
                color: '#1976d2',
                fontWeight: 600
              }}
            />
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        {accounts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No accounts found to add.
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {accounts.map((account, index) => (
              <React.Fragment key={account.id}>
                <ListItem
                  onClick={() => handleToggle(account.id)}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: isSelected(account.id) ? '#d32f2f' : '#e0e0e0',
                    bgcolor: isSelected(account.id) ? 'rgba(211, 47, 47, 0.04)' : 'transparent',
                    mb: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#d32f2f',
                      bgcolor: 'rgba(211, 47, 47, 0.02)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={isSelected(account.id)}
                      tabIndex={-1}
                      disableRipple
                      sx={{
                        color: '#d32f2f',
                        '&.Mui-checked': {
                          color: '#d32f2f'
                        }
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#333' }}>
                        {account.name}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {account.accountType}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                          {account.currency} {account.balance.toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < accounts.length - 1 && <Box sx={{ mb: 0 }} />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid #e0e0e0', px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ color: '#666' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAddSelected}
          variant="contained"
          disabled={loading || selected.length === 0}
          sx={{
            bgcolor: '#d32f2f',
            '&:hover': { bgcolor: '#b71c1c' },
            minWidth: 180
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            `Add ${selected.length} Account${selected.length > 1 ? 's' : ''}`
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

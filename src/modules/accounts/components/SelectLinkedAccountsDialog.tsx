// src/modules/accounts/components/SelectLinkedAccountsDialog.tsx

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  CircularProgress
} from '@mui/material';
import type { Account, AccountFormData } from '../types';

interface SelectLinkedAccountsDialogProps {
  open: boolean;
  onClose: () => void;
  accounts: Account[]; // Simülasyondan gelen hesaplar
  onAdd: (selectedAccounts: AccountFormData[]) => Promise<void>;
  loading?: boolean;
}

export const SelectLinkedAccountsDialog: React.FC<SelectLinkedAccountsDialogProps> = ({ open, onClose, accounts, onAdd, loading }) => {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
     // Pencere her açıldığında seçimi sıfırla
     if (open) {
         setSelected([]);
     }
  }, [open]);

  const handleToggle = (accountId: string) => {
    const currentIndex = selected.indexOf(accountId);
    const newSelected = [...selected];

    if (currentIndex === -1) {
      newSelected.push(accountId);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setSelected(newSelected);
  };

  const handleAddSelected = () => {
    const accountsToAdd = accounts
      .filter(acc => selected.includes(acc.id))
      .map(acc => ({
        name: acc.name,
        accountType: acc.accountType,
        initialBalance: acc.balance,
        currency: acc.currency,
      }));
    onAdd(accountsToAdd);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Select Accounts to Add</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          We found the following accounts. Please select which ones you'd like to add to PocketBank.
        </Typography>
        <List>
          {accounts.map((account) => (
            <ListItem key={account.id} button onClick={() => handleToggle(account.id)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selected.indexOf(account.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText 
                primary={account.name} 
                secondary={`${account.currency} ${account.balance.toLocaleString()}`} 
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleAddSelected} variant="contained" disabled={loading || selected.length === 0}>
          {loading ? <CircularProgress size={24} /> : `Add ${selected.length} Selected Account(s)`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
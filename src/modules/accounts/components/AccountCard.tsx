// src/modules/accounts/components/AccountCard.tsx

import React from 'react';
import { Card, CardActions, CardContent, Typography, Box, Chip, IconButton } from '@mui/material'; // CardActions ve IconButton eklendi
import { AccountBalanceWallet, CreditCard, Savings, Edit, Delete } from '@mui/icons-material'; // Edit ve Delete ikonları eklendi
import type { Account, AccountType } from '../types';

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;   // YENİ PROP
  onDelete: (id: string) => void;        // YENİ PROP
}

const getAccountIcon = (type: AccountType) => {
  // ... (Bu fonksiyon aynı kalıyor)
  switch (type) {
    case 'Checking':
      return <AccountBalanceWallet sx={{ fontSize: 40, color: 'primary.main' }} />;
    case 'Savings':
      return <Savings sx={{ fontSize: 40, color: 'success.main' }} />;
    case 'Credit':
      return <CreditCard sx={{ fontSize: 40, color: 'error.main' }} />;
    default:
      return <AccountBalanceWallet sx={{ fontSize: 40, color: 'action.active' }} />;
  }
};

export const AccountCard: React.FC<AccountCardProps> = ({ account, onEdit, onDelete }) => {
  return (
    <Card 
      variant="outlined"
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: `5px solid`,
        borderColor: 
          account.accountType === 'Checking' ? 'primary.main' :
          account.accountType === 'Savings' ? 'success.main' :
          'error.main'
      }}
    >
      <CardContent sx={{ pb: 1 }}> {/* Alt padding azaltıldı */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div" fontWeight={600}>
            {account.name}
          </Typography>
          {getAccountIcon(account.accountType)}
        </Box>
        
        <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>
          {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: account.currency }).format(account.balance)}
        </Typography>
        
        <Chip label={account.accountType} size="small" sx={{ mt: 1 }} />
      </CardContent>

      {/* YENİ EKLENEN BÖLÜM: AKSİYON BUTONLARI */}
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <IconButton aria-label="edit" onClick={() => onEdit(account)}>
          <Edit />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => onDelete(account.id)}>
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
};
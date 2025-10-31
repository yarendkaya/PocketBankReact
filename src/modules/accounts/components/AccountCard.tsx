// src/modules/accounts/components/AccountCard.tsx (GÜNCELLENMİŞ HALİ)

import React from 'react';
import { Card, CardActions, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
// --- 1. YENİ İKONU EKLE ---
import { AccountBalanceWallet, CreditCard, Savings, Edit, Delete, History } from '@mui/icons-material';
// --- 2. YENİ IMPORT'U EKLE ---
import { useNavigate } from 'react-router-dom';
import type { Account, AccountType } from '../types';

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
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
  // --- 3. YENİ HOOK'U ÇAĞIR ---
  const navigate = useNavigate();

  // --- 4. YENİ FONKSİYONU EKLE ---
  const handleGoToHistory = () => {
    // Kullanıcıyı o hesaba özel işlem geçmişi sayfasına yönlendir
    navigate(`/accounts/${account.id}/transactions`);
  };

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
      <CardContent sx={{ pb: 1 }}>
        {/* ... (Bu bölümün tamamı aynı kalıyor) ... */}
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

      {/* --- 5. CARD ACTIONS BÖLÜMÜNÜ GÜNCELLE --- */}
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        
        {/* YENİ EKLENEN BUTON */}
        <IconButton aria-label="history" onClick={handleGoToHistory}>
          <History />
        </IconButton>
        
        {/* MEVCUT BUTONLARIN (değiştirilmedi) */}
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
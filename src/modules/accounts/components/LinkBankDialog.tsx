// src/modules/accounts/components/LinkBankDialog.tsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';

interface LinkBankDialogProps {
  open: boolean;
  onClose: () => void;
onLink: (bank: string, username: string, password: string) => Promise<void>;
  loading?: boolean;
}

export const LinkBankDialog: React.FC<LinkBankDialogProps> = ({ open, onClose, onLink, loading }) => {
  const [bank, setBank] = useState('xbank');
  const [username, setUsername] = useState('testuser');
  const [password, setPassword] = useState('123456'); // Şifre sadece görsel, kullanılmayacak

  const handleLink = () => {
  onLink(bank, username, password);
};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Link Bank Account</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Bank</InputLabel>
            <Select
              value={bank}
              label="Bank"
              onChange={(e) => setBank(e.target.value)}
            >
              <MenuItem value="xbank">X Bank</MenuItem>
              <MenuItem value="ybank">Y Bank</MenuItem>
              <MenuItem value="zbank">Z Bank</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Username / Customer ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleLink} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Connect'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
// src/modules/accounts/components/AddAccountMethodDialog.tsx

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Paper,
  Typography,
  Box
} from '@mui/material';
import { Edit, AccountBalance } from '@mui/icons-material';

interface AddAccountMethodDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectMethod: (method: 'manual' | 'link') => void;
}

export const AddAccountMethodDialog: React.FC<AddAccountMethodDialogProps> = ({ open, onClose, onSelectMethod }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add a New Account</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          How would you like to add your account?
        </Typography>
        <Stack spacing={2}>
          <Paper
            variant="outlined"
            onClick={() => onSelectMethod('manual')}
            sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' } }}
          >
            <Edit color="primary" />
            <Box>
              <Typography fontWeight="bold">Add Manually</Typography>
              <Typography variant="body2" color="text.secondary">Enter account details yourself.</Typography>
            </Box>
          </Paper>

          <Paper
            variant="outlined"
            onClick={() => onSelectMethod('link')}
            sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' } }}
          >
            <AccountBalance color="primary" />
            <Box>
              <Typography fontWeight="bold">Link Bank Account</Typography>
              <Typography variant="body2" color="text.secondary">Connect to your bank (simulation).</Typography>
            </Box>
          </Paper>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
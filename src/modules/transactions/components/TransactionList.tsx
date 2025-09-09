import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Typography,
  Stack,
  Checkbox,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  DeleteSweep
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { TransactionType } from '../types';
import type { Transaction, Category } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  loading?: boolean;
  totalCount?: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  selectable?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  loading = false,
  totalCount = 0,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEditTransaction,
  onDeleteTransaction,
  onBulkDelete,
  selectable = false
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuTransactionId, setMenuTransactionId] = useState<string | null>(null);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(transactions.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, transactionId: string) => {
    setMenuAnchor(event.currentTarget);
    setMenuTransactionId(transactionId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuTransactionId(null);
  };

  const handleEdit = () => {
    const transaction = transactions.find(t => t.id === menuTransactionId);
    if (transaction) {
      onEditTransaction(transaction);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (menuTransactionId) {
      onDeleteTransaction(menuTransactionId);
    }
    handleMenuClose();
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedIds.length > 0) {
      onBulkDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INCOME:
        return <TrendingUp color="success" />;
      case TransactionType.EXPENSE:
        return <TrendingDown color="error" />;
      case TransactionType.TRANSFER:
        return <SwapHoriz color="info" />;
      default:
        return <SwapHoriz />;
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INCOME:
        return 'success.main';
      case TransactionType.EXPENSE:
        return 'error.main';
      case TransactionType.TRANSFER:
        return 'info.main';
      default:
        return 'text.primary';
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || {
      name: 'Unknown Category',
      color: '#ccc'
    };
  };

  const isSelected = (id: string) => selectedIds.includes(id);
  const selectedCount = selectedIds.length;
  const isAllSelected = selectedIds.length === transactions.length && transactions.length > 0;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < transactions.length;

  return (
    <Paper sx={{ width: '100%' }}>
      {/* Bulk Actions */}
      {selectable && selectedCount > 0 && (
        <Box sx={{ p: 2, bgcolor: 'primary.light', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1">
            {selectedCount} selected
          </Typography>
          <Button
            startIcon={<DeleteSweep />}
            onClick={handleBulkDelete}
            color="error"
            disabled={loading}
          >
            Delete Selected
          </Button>
        </Box>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    disabled={loading}
                  />
                </TableCell>
              )}
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => {
              const category = getCategoryInfo(transaction.categoryId);
              const selected = isSelected(transaction.id);

              return (
                <TableRow
                  key={transaction.id}
                  hover
                  selected={selected}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected}
                        onChange={() => handleSelectOne(transaction.id)}
                        disabled={loading}
                      />
                    </TableCell>
                  )}
                  
                  <TableCell>
                    <Typography variant="body2">
                      {dayjs(transaction.date).format('MMM DD, YYYY')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(transaction.createdAt).format('HH:mm')}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: category.color }}>
                        {getTransactionIcon(transaction.type)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {transaction.description}
                        </Typography>
                        {transaction.isRecurring && (
                          <Chip
                            label="Recurring"
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: category.color
                        }}
                      />
                      <Typography variant="body2">
                        {category.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={transaction.type}
                      size="small"
                      color={
                        transaction.type === TransactionType.INCOME 
                          ? 'success' 
                          : transaction.type === TransactionType.EXPENSE
                          ? 'error'
                          : 'info'
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color={getTransactionColor(transaction.type)}
                    >
                      {transaction.type === TransactionType.INCOME ? '+' : '-'}
                      {transaction.currency} {transaction.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {transaction.tags?.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Stack>
                  </TableCell>
                  
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, transaction.id)}
                      disabled={loading}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            
            {transactions.length === 0 && !loading && (
              <TableRow>
                <TableCell 
                  colSpan={selectable ? 8 : 7} 
                  align="center" 
                  sx={{ py: 4 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No transactions found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
      />

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default TransactionList;
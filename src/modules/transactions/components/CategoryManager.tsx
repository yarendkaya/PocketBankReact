import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Alert,
  Stack,
  Divider
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Circle,
  Category as CategoryIcon
} from '@mui/icons-material';
import { TransactionType } from '../types';
import type { Category } from '../types';

interface CategoryManagerProps {
  categories: Category[];
  onCreateCategory: (category: Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  loading?: boolean;
}

interface CategoryFormData {
  name: string;
  color: string;
  icon: string;
  type: TransactionType;
}

const defaultColors = [
  '#d32f2f', '#c2185b', '#7b1fa2', '#512da8', '#303f9f',
  '#1976d2', '#0288d1', '#0097a7', '#00796b', '#388e3c',
  '#689f38', '#afb42b', '#fbc02d', '#ffa000', '#f57c00',
  '#e64a19', '#5d4037', '#616161', '#455a64'
];

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  loading = false
}) => {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    color: defaultColors[0],
    icon: 'category',
    type: TransactionType.EXPENSE
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    setError('');

    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      if (editingCategory) {
        await onUpdateCategory(editingCategory.id, formData);
      } else {
        await onCreateCategory({
          ...formData,
          isDefault: false
        });
      }
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon,
      type: category.type
    });
    setOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await onDeleteCategory(categoryId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete category');
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      color: defaultColors[0],
      icon: 'category',
      type: TransactionType.EXPENSE
    });
    setError('');
  };

  const groupedCategories = {
    [TransactionType.INCOME]: categories.filter(cat => cat.type === TransactionType.INCOME),
    [TransactionType.EXPENSE]: categories.filter(cat => cat.type === TransactionType.EXPENSE),
    [TransactionType.TRANSFER]: categories.filter(cat => cat.type === TransactionType.TRANSFER)
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ color: '#333' }}>
          Manage Categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          disabled={loading}
          sx={{
            bgcolor: '#d32f2f',
            '&:hover': { bgcolor: '#b71c1c' }
          }}
        >
          Add Category
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Categories by Type */}
      <Stack spacing={3}>
        {Object.entries(groupedCategories).map(([type, categoryList]) => (
          <Paper key={type} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CategoryIcon sx={{ mr: 1, color: '#d32f2f' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                {type === TransactionType.INCOME ? 'Income' : type === TransactionType.EXPENSE ? 'Expense' : 'Transfer'} Categories
              </Typography>
              <Chip
                label={categoryList.length}
                size="small"
                sx={{ ml: 2, bgcolor: '#f5f5f5' }}
              />
            </Box>
            <Divider sx={{ mb: 2 }} />

            {categoryList.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No categories yet. Create one to get started.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {categoryList.map((category) => (
                  <Grid item xs={12} sm={6} md={4} key={category.id}>
                    <Card
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderLeft: `4px solid ${category.color}`,
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 2,
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                            <Circle sx={{ fontSize: 12, mr: 1, color: category.color }} />
                            <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#333' }}>
                              {category.name}
                            </Typography>
                          </Box>

                          {category.isDefault && (
                            <Chip
                              label="Default"
                              size="small"
                              sx={{
                                bgcolor: '#e3f2fd',
                                color: '#1976d2',
                                fontSize: '0.7rem',
                                height: 20
                              }}
                            />
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(category)}
                            disabled={loading}
                            sx={{
                              border: '1px solid #e0e0e0',
                              '&:hover': { bgcolor: '#f5f5f5' }
                            }}
                          >
                            <Edit fontSize="small" sx={{ color: '#666' }} />
                          </IconButton>
                          {!category.isDefault && (
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(category.id)}
                              disabled={loading}
                              sx={{
                                border: '1px solid #ffcdd2',
                                '&:hover': { bgcolor: '#ffebee' }
                              }}
                            >
                              <Delete fontSize="small" sx={{ color: '#d32f2f' }} />
                            </IconButton>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        ))}
      </Stack>

      {/* Category Form Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" fontWeight={600}>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <TextField
              label="Category Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />

            <FormControl fullWidth>
              <InputLabel>Transaction Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as TransactionType }))}
                label="Transaction Type"
              >
                <MenuItem value={TransactionType.INCOME}>Income</MenuItem>
                <MenuItem value={TransactionType.EXPENSE}>Expense</MenuItem>
                <MenuItem value={TransactionType.TRANSFER}>Transfer</MenuItem>
              </Select>
            </FormControl>

            {/* Color Selection */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Choose Color
              </Typography>
              <Grid container spacing={1}>
                {defaultColors.map((color) => (
                  <Grid item key={color}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: color,
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: formData.color === color ? '3px solid #333' : '2px solid #e0e0e0',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: 2
                        }
                      }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #e0e0e0', px: 3, py: 2 }}>
          <Button onClick={handleClose} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#d32f2f',
              '&:hover': { bgcolor: '#b71c1c' }
            }}
          >
            {loading ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManager;

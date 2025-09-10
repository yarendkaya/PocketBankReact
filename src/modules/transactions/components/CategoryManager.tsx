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
  Stack
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Palette,
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
  '#e3f2fd', '#f3e5f5', '#e8f5e8', '#fff3e0', '#fce4ec',
  '#e1f5fe', '#f1f8e9', '#fff8e1', '#fde7f3', '#e8eaf6'
];

const defaultIcons = [
  'shopping_cart', 'restaurant', 'local_gas_station', 'home', 'health_and_safety',
  'school', 'sports_esports', 'movie', 'flight', 'business'
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
    icon: defaultIcons[0],
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
      icon: defaultIcons[0],
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
        <Typography variant="h6" fontWeight={600}>
          Category Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          disabled={loading}
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
          <Paper key={type} sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              {type} Categories
            </Typography>
            <Grid container spacing={2}>
              {categoryList.map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <Card
                    sx={{
                      borderLeft: `4px solid ${category.color}`,
                      position: 'relative'
                    }}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CategoryIcon sx={{ mr: 1, color: category.color }} />
                        <Typography variant="subtitle2" fontWeight={600}>
                          {category.name}
                        </Typography>
                      </Box>
                      
                      {category.isDefault && (
                        <Chip
                          label="Default"
                          size="small"
                          color="primary"
                          sx={{ mb: 1 }}
                        />
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(category)}
                          disabled={loading}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        {!category.isDefault && (
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(category.id)}
                            disabled={loading}
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        ))}
      </Stack>

      {/* Category Form Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
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
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Color
              </Typography>
              <Grid container spacing={1}>
                {defaultColors.map((color) => (
                  <Grid item key={color}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: color,
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: formData.color === color ? '2px solid #000' : '1px solid #ddd'
                      }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Icon Selection */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Icon
              </Typography>
              <Grid container spacing={1}>
                {defaultIcons.map((icon) => (
                  <Grid item key={icon}>
                    <IconButton
                      sx={{
                        border: formData.icon === icon ? '2px solid #000' : '1px solid #ddd',
                        color: formData.color
                      }}
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    >
                      <Palette />
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManager;
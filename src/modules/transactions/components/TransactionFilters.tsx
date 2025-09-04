import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Grid,
  Collapse,
  IconButton,
  Stack,
  Autocomplete,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Search,
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { TransactionType } from '../types';
import type { TransactionFilters, Category } from '../types';

interface TransactionFiltersProps {
  filters: TransactionFilters;
  categories: Category[];
  availableTags: string[];
  onFiltersChange: (filters: TransactionFilters) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const TransactionFiltersComponent: React.FC<TransactionFiltersProps> = ({
  filters,
  categories,
  availableTags,
  onFiltersChange,
  onClearFilters,
  loading = false
}) => {
  const [expanded, setExpanded] = useState(false);
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(
    filters.dateFrom ? dayjs(filters.dateFrom) : null
  );
  const [dateTo, setDateTo] = useState<Dayjs | null>(
    filters.dateTo ? dayjs(filters.dateTo) : null
  );

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleTypeChange = (type: TransactionType | '') => {
    onFiltersChange({ 
      ...filters, 
      type: type || undefined,
      categoryIds: type ? filters.categoryIds?.filter(id => 
        categories.find(cat => cat.id === id)?.type === type
      ) : filters.categoryIds
    });
  };

  const handleCategoryChange = (categoryIds: string[]) => {
    onFiltersChange({ ...filters, categoryIds });
  };

  const handleAmountChange = (field: 'minAmount' | 'maxAmount', value: string) => {
    const amount = parseFloat(value) || undefined;
    onFiltersChange({ ...filters, [field]: amount });
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo', date: Dayjs | null) => {
    if (field === 'dateFrom') {
      setDateFrom(date);
    } else {
      setDateTo(date);
    }
    
    onFiltersChange({ 
      ...filters, 
      [field]: date ? date.format('YYYY-MM-DD') : undefined 
    });
  };

  const handleTagsChange = (tags: string[]) => {
    onFiltersChange({ ...filters, tags });
  };

  const getFilteredCategories = () => {
    if (!filters.type) return categories;
    return categories.filter(cat => cat.type === filters.type);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.type) count++;
    if (filters.categoryIds?.length) count++;
    if (filters.minAmount !== undefined) count++;
    if (filters.maxAmount !== undefined) count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    if (filters.tags?.length) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 2, mb: 3 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search transactions..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleSearchChange('')}
                    disabled={loading}
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>

        {/* Filter Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            startIcon={<FilterList />}
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setExpanded(!expanded)}
            disabled={loading}
          >
            Filters
            {activeFiltersCount > 0 && (
              <Chip
                label={activeFiltersCount}
                size="small"
                color="primary"
                sx={{ ml: 1, minWidth: 'auto', height: 20 }}
              />
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              startIcon={<Clear />}
              onClick={onClearFilters}
              disabled={loading}
              color="secondary"
              size="small"
            >
              Clear All
            </Button>
          )}
        </Box>

        {/* Advanced Filters */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              {/* Transaction Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Transaction Type</InputLabel>
                  <Select
                    value={filters.type || ''}
                    onChange={(e) => handleTypeChange(e.target.value as TransactionType)}
                    label="Transaction Type"
                    disabled={loading}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value={TransactionType.INCOME}>Income</MenuItem>
                    <MenuItem value={TransactionType.EXPENSE}>Expense</MenuItem>
                    <MenuItem value={TransactionType.TRANSFER}>Transfer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Categories */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    multiple
                    options={getFilteredCategories()}
                    getOptionLabel={(option) => option.name}
                    value={getFilteredCategories().filter(cat => 
                      filters.categoryIds?.includes(cat.id)
                    )}
                    onChange={(_, selected) => 
                      handleCategoryChange(selected.map(cat => cat.id))
                    }
                    disabled={loading}
                    renderInput={(params) => (
                      <TextField {...params} label="Categories" />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: option.color
                          }}
                        />
                        {option.name}
                      </Box>
                    )}
                    renderTags={(selected, getTagProps) =>
                      selected.map((option, index) => (
                        <Chip
                          key={option.id}
                          label={option.name}
                          {...getTagProps({ index })}
                          size="small"
                          sx={{ 
                            bgcolor: `${option.color}20`,
                            borderColor: option.color,
                            color: option.color
                          }}
                        />
                      ))
                    }
                  />
                </FormControl>
              </Grid>

              {/* Date Range */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="From Date"
                  value={dateFrom}
                  onChange={(date) => handleDateChange('dateFrom', date)}
                  disabled={loading}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker
                  label="To Date"
                  value={dateTo}
                  onChange={(date) => handleDateChange('dateTo', date)}
                  disabled={loading}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              {/* Amount Range */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Min Amount"
                  type="number"
                  value={filters.minAmount || ''}
                  onChange={(e) => handleAmountChange('minAmount', e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Amount"
                  type="number"
                  value={filters.maxAmount || ''}
                  onChange={(e) => handleAmountChange('maxAmount', e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              {/* Tags */}
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={availableTags}
                  value={filters.tags || []}
                  onChange={(_, selected) => handleTagsChange(selected)}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField {...params} label="Tags" helperText="Type to add custom tags" />
                  )}
                  renderTags={(selected, getTagProps) =>
                    selected.map((tag, index) => (
                      <Chip
                        key={tag}
                        label={tag}
                        {...getTagProps({ index })}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Active Filters:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {filters.search && (
                <Chip
                  label={`Search: "${filters.search}"`}
                  size="small"
                  onDelete={() => handleSearchChange('')}
                  disabled={loading}
                />
              )}
              {filters.type && (
                <Chip
                  label={`Type: ${filters.type}`}
                  size="small"
                  onDelete={() => handleTypeChange('')}
                  disabled={loading}
                />
              )}
              {filters.categoryIds?.length && (
                <Chip
                  label={`Categories: ${filters.categoryIds.length}`}
                  size="small"
                  onDelete={() => handleCategoryChange([])}
                  disabled={loading}
                />
              )}
              {filters.dateFrom && (
                <Chip
                  label={`From: ${dayjs(filters.dateFrom).format('MMM DD, YYYY')}`}
                  size="small"
                  onDelete={() => handleDateChange('dateFrom', null)}
                  disabled={loading}
                />
              )}
              {filters.dateTo && (
                <Chip
                  label={`To: ${dayjs(filters.dateTo).format('MMM DD, YYYY')}`}
                  size="small"
                  onDelete={() => handleDateChange('dateTo', null)}
                  disabled={loading}
                />
              )}
              {filters.tags?.length && (
                <Chip
                  label={`Tags: ${filters.tags.length}`}
                  size="small"
                  onDelete={() => handleTagsChange([])}
                  disabled={loading}
                />
              )}
            </Stack>
          </Box>
        )}
      </Paper>
    </LocalizationProvider>
  );
};

export default TransactionFiltersComponent;
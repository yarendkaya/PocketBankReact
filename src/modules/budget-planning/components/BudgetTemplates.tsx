import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Alert
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  FileCopy,
  Public,
  Lock,
  TrendingUp
} from '@mui/icons-material';
import { useBudgetTemplates } from '../hooks/useBudgets';
import type { BudgetTemplate } from '../types';

interface BudgetTemplatesProps {
  onApplyTemplate: (templateId: string) => void;
}

const BudgetTemplates: React.FC<BudgetTemplatesProps> = ({ onApplyTemplate }) => {
  const { templates, loading, createTemplate } = useBudgetTemplates();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<BudgetTemplate | null>(null);

  const handleCreateTemplate = () => {
    setCreateDialogOpen(true);
  };

  const handleApply = (templateId: string) => {
    onApplyTemplate(templateId);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="textSecondary">Loading templates...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Budget Templates</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateTemplate}
          sx={{
            bgcolor: '#d32f2f',
            '&:hover': { bgcolor: '#b71c1c' }
          }}
        >
          Create Template
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Templates help you quickly create budgets based on predefined category allocations.
        You can use public templates or create your own.
      </Alert>

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <Card sx={{ border: '1px solid #e0e0e0', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {template.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {template.isPublic ? (
                      <Public sx={{ fontSize: 20, color: '#2196f3' }} />
                    ) : (
                      <Lock sx={{ fontSize: 20, color: '#666' }} />
                    )}
                  </Box>
                </Box>

                {template.description && (
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {template.description}
                  </Typography>
                )}

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={template.period}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`${template.usageCount} uses`}
                    size="small"
                    icon={<TrendingUp />}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Category Distribution
                  </Typography>
                  {template.categories.map((category, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 0.5
                      }}
                    >
                      <Typography variant="body2">{category.categoryName}</Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {category.percentage}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>

              <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<FileCopy />}
                  onClick={() => handleApply(template.id)}
                  sx={{
                    bgcolor: '#d32f2f',
                    '&:hover': { bgcolor: '#b71c1c' }
                  }}
                >
                  Use Template
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}

        {templates.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>No Templates Yet</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Create your first budget template to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateTemplate}
                sx={{
                  bgcolor: '#d32f2f',
                  '&:hover': { bgcolor: '#b71c1c' }
                }}
              >
                Create Template
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Create Template Dialog - Placeholder */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Budget Template</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Template creation wizard would go here. You can create templates from existing budgets or start from scratch.
          </Alert>
          <TextField
            fullWidth
            label="Template Name"
            placeholder="e.g., Standard Monthly Budget"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            placeholder="Describe what this template is for..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => setCreateDialogOpen(false)}
            sx={{
              bgcolor: '#d32f2f',
              '&:hover': { bgcolor: '#b71c1c' }
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetTemplates;

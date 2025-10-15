import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack
} from '@mui/material';
import { CloudUpload, Download, CheckCircle, Error } from '@mui/icons-material';
import { TransactionType } from '../types';
import type { TransactionFormData, BulkImportResult } from '../types';

interface BulkImportProps {
  onImport: (transactions: TransactionFormData[]) => Promise<BulkImportResult>;
  loading?: boolean;
}

interface ParsedTransaction {
  row: number;
  data: TransactionFormData;
  isValid: boolean;
  errors: string[];
}

const BulkImport: React.FC<BulkImportProps> = ({
  onImport,
  loading = false
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedTransaction[]>([]);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file) return;

    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(fileType || '')) {
      setError('Please select a CSV or Excel file');
      return;
    }

    parseFile(file);
  };

  const parseFile = async (file: File) => {
    setError('');
    const text = await file.text();
    
    try {
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Validate headers
      const requiredHeaders = ['amount', 'type', 'description', 'date'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        setError(`Missing required columns: ${missingHeaders.join(', ')}`);
        return;
      }

      const parsed: ParsedTransaction[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row: any = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index]?.trim() || '';
        });

        const errors: string[] = [];
        
        // Validate amount
        const amount = parseFloat(row.amount);
        if (isNaN(amount) || amount <= 0) {
          errors.push('Invalid amount');
        }

        // Validate type
        if (!Object.values(TransactionType).includes(row.type?.toUpperCase())) {
          errors.push('Invalid transaction type');
        }

        // Validate date
        const date = new Date(row.date);
        if (isNaN(date.getTime())) {
          errors.push('Invalid date format');
        }

        // Validate description
        if (!row.description) {
          errors.push('Description is required');
        }

        const transactionData: TransactionFormData = {
          amount: amount,
          type: row.type?.toUpperCase() as TransactionType,
          description: row.description,
          date: date.toISOString().split('T')[0],
          categoryId: row.categoryid || '', // Optional
          tags: row.tags ? row.tags.split(';').filter(Boolean) : []
        };

        parsed.push({
          row: i + 1,
          data: transactionData,
          isValid: errors.length === 0,
          errors
        });
      }

      setParsedData(parsed);
      setShowPreview(true);
      
    } catch (err) {
      setError('Failed to parse file. Please check the format.');
    }
  };

  const handleImport = async () => {
    const validTransactions = parsedData
      .filter(item => item.isValid)
      .map(item => item.data);

    try {
      const result = await onImport(validTransactions);
      setImportResult(result);
      setShowPreview(false);
      setParsedData([]);
    } catch (err) {
      setError(
        typeof err === 'object' && err !== null && 'message' in err
          ? (err as { message: string }).message
          : 'Import failed'
      );
    }
  };

  const downloadTemplate = () => {
    const headers = ['amount', 'type', 'description', 'date', 'categoryid', 'tags'];
    const sampleData = [
      ['100.50', 'INCOME', 'Salary payment', '2024-01-15', 'salary-category-id', 'work;salary'],
      ['25.99', 'EXPENSE', 'Groceries', '2024-01-16', 'food-category-id', 'food;shopping']
    ];
    
    const csvContent = [headers, ...sampleData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaction_template.csv';
    a.click();
    
    window.URL.revokeObjectURL(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Bulk Import Transactions
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={downloadTemplate}
        >
          Download Template
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {importResult && (
        <Alert 
          severity={importResult.failed > 0 ? 'warning' : 'success'} 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => setImportResult(null)}>
              Close
            </Button>
          }
        >
          Import completed: {importResult.success} successful, {importResult.failed} failed
          {importResult.errors.length > 0 && (
            <Box sx={{ mt: 1 }}>
              {importResult.errors.map((error, index) => (
                <Typography key={index} variant="body2">
                  Row {error.row}: {error.message}
                </Typography>
              ))}
            </Box>
          )}
        </Alert>
      )}

      {/* File Upload Area */}
      <Paper
        sx={{
          p: 4,
          border: dragOver ? '2px dashed #1976d2' : '2px dashed #ccc',
          borderRadius: 2,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: dragOver ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
          transition: 'all 0.2s ease'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Drop your file here or click to browse
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supported formats: CSV, Excel (.xlsx, .xls)
        </Typography>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />
      </Paper>

      {loading && <LinearProgress sx={{ mt: 2 }} />}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Import Preview</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Chip
                icon={<CheckCircle />}
                label={`${parsedData.filter(item => item.isValid).length} Valid`}
                color="success"
                variant="outlined"
              />
              <Chip
                icon={<Error />}
                label={`${parsedData.filter(item => !item.isValid).length} Invalid`}
                color="error"
                variant="outlined"
              />
            </Box>

            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Row</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Errors</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parsedData.map((item) => (
                    <TableRow key={item.row}>
                      <TableCell>{item.row}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={item.isValid ? 'Valid' : 'Invalid'}
                          color={item.isValid ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell>${item.data.amount}</TableCell>
                      <TableCell>{item.data.type}</TableCell>
                      <TableCell>{item.data.description}</TableCell>
                      <TableCell>{item.data.date}</TableCell>
                      <TableCell>
                        {item.errors.map((error, index) => (
                          <Typography key={index} variant="caption" color="error" display="block">
                            {error}
                          </Typography>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Cancel</Button>
          <Button
            onClick={handleImport}
            variant="contained"
            disabled={parsedData.filter(item => item.isValid).length === 0 || loading}
          >
            Import {parsedData.filter(item => item.isValid).length} Transactions
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BulkImport;
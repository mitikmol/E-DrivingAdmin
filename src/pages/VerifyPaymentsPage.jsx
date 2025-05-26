import {
  CheckCircle as ApproveIcon,
  Receipt as ReceiptIcon,
  Cancel as RejectIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Snackbar,
  Typography
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

const PaymentVerificationPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, paymentId: null, action: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  });

  const fetchPendingPayments = async () => {
    try {
      const res = await axios.get(
        'https://driving-backend-stmb.onrender.com/api/payments/pending',
        getAuthHeader()
      );
      setPayments(res.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setSnackbar({ open: true, message: 'Failed to fetch payments.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    const { paymentId, action } = actionDialog;
    setActionDialog({ open: false, paymentId: null, action: null });

    try {
      setProcessingId(paymentId);
      await axios.post(
        `https://driving-backend-stmb.onrender.com/api/payments/${paymentId}/${action}`,
        {},
        getAuthHeader()
      );
      await fetchPendingPayments();
      setSnackbar({ open: true, message: `Payment ${action}ed successfully.`, severity: 'success' });
    } catch (err) {
      console.error(`${action} failed:`, err);
      setSnackbar({ open: true, message: `Failed to ${action} payment.`, severity: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Payment Verifications
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : payments.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No pending payments found
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {payments.map(payment => (
            <Grid item xs={12} key={payment.id}>
              <Card variant="outlined">
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1">
                        Enrollment: {payment.enrollment_id}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Amount: ₹{payment.amount}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      {payment.paid_at && (
                        <Typography variant="body2">
                          Paid: {format(new Date(payment.paid_at), 'dd MMM yyyy HH:mm')}
                        </Typography>
                      )}
                      {payment.payment_proof_url && (
                        <Button
                          variant="outlined"
                          startIcon={<ReceiptIcon />}
                          href={payment.payment_proof_url}
                          target="_blank"
                          sx={{ mt: 1 }}
                        >
                          View Proof
                        </Button>
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box display="flex" gap={1} justifyContent="flex-end">
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<ApproveIcon />}
                          onClick={() =>
                            setActionDialog({ open: true, paymentId: payment.id, action: 'verify' })
                          }
                          disabled={processingId === payment.id}
                        >
                          {processingId === payment.id ? 'Verifying...' : 'Approve'}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<RejectIcon />}
                          onClick={() =>
                            setActionDialog({ open: true, paymentId: payment.id, action: 'reject' })
                          }
                          disabled={processingId === payment.id}
                        >
                          Reject
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Confirm Dialog */}
      <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false })}>
        <DialogTitle>Confirm {actionDialog.action}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {actionDialog.action} this payment? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog({ open: false })}>Cancel</Button>
          <Button onClick={handleConfirmAction} color="primary" autoFocus>
            Yes, {actionDialog.action}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PaymentVerificationPage;

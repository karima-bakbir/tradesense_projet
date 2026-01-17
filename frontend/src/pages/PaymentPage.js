import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  Alert
} from '@mui/material';
import { useAppContext } from '../contexts/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const { t } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(location.state?.plan || null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle case where user navigates directly to payment page without selecting a plan
  useEffect(() => {
    if (!plan) {
      navigate('/'); // Redirect to home if no plan selected
    }
  }, [plan, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!cardNumber || !expiryDate || !cvv || !cardHolderName) {
      setError(t.fillAllFields || 'Please fill in all fields');
      return;
    }

    // Validate card number (basic validation)
    const cardNumberClean = cardNumber.replace(/\s/g, '');
    if (cardNumberClean.length !== 16 || isNaN(cardNumberClean)) {
      setError(t.invalidCardNumber || 'Invalid card number');
      return;
    }

    // Validate expiry date (MM/AA format)
    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!expiryRegex.test(expiryDate)) {
      setError(t.invalidExpiryDate || 'Invalid expiry date format (MM/YY)');
      return;
    }

    // Validate CVV
    if (cvv.length !== 3 || isNaN(cvv)) {
      setError(t.invalidCvv || 'Invalid CVV');
      return;
    }

    // Simulate successful payment
    setSuccess(`${t.paymentSuccessful || 'Payment successful'}! ${t.processingOrder || 'Processing your order...'}`);
    setError('');
    
    // In a real application, you would process the payment here
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (!plan) {
    return null; // Render nothing if no plan is selected
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {t.payment || 'Paiement'} - {plan.name}
          </Typography>
          
          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
            {t.paymentOf || 'Paiement de'} {plan.price} {t.forPlan || 'pour le plan'} {plan.name}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t.cardNumber || "Numéro de carte"}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  inputProps={{ maxLength: 19 }}
                  helperText={t.cardNumberHelper || "Enter your 16-digit card number"}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t.expiryDate || "Date d'expiration"}
                  value={expiryDate}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Auto-format MM/YY
                    if (value.length === 2 && !value.includes('/')) {
                      value = value + '/';
                    }
                    setExpiryDate(value);
                  }}
                  placeholder="MM/AA"
                  inputProps={{ maxLength: 5 }}
                  helperText={t.expiryDateHelper || "Format: MM/AA"}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t.cvv || "CVV"}
                  value={cvv}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length <= 3) {
                      setCvv(value);
                    }
                  }}
                  placeholder="123"
                  inputProps={{ maxLength: 3 }}
                  helperText={t.cvvHelper || "3-digit security code"}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t.cardHolderName || "Nom du titulaire"}
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  placeholder={t.fullNamePlaceholder || "Nom complet"}
                  helperText={t.cardholderNameHelper || "Name as it appears on the card"}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={t.saveCardInfo || "Enregistrer ces informations pour les prochains paiements"}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {t.payNow || 'Payer maintenant'} - {plan.price}
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button 
              variant="text" 
              onClick={() => navigate(-1)}
            >
              {t.backToPlans || 'Retour aux plans'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PaymentPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Box,
  CircularProgress,
  Alert,
  TextField,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/system';
import { useAppContext } from '../contexts/AppContext';
import api from '../utils/api';

const PricingCard = styled(Card)(({ theme, featured }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  ...(featured && {
    border: '2px solid #1976d2',
    boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)',
  }),
}));

const Payment = () => {
  const { t } = useAppContext();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 200,
      currency: 'DH',
      features: t.starterFeatures,
      buttonText: t.chooseStarter,
      buttonColor: 'secondary'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 500,
      currency: 'DH',
      features: t.proFeatures,
      buttonText: t.choosePro,
      buttonColor: 'primary',
      featured: true
    },
    {
      id: 'elite',
      name: 'Elite',
      price: 1000,
      currency: 'DH',
      features: t.eliteFeatures,
      buttonText: t.chooseElite,
      buttonColor: 'error'
    }
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const processPayment = async () => {
    setPaymentProcessing(true);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Get user info
      const response = await api.get('/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const userId = response.data.user.id || response.data.user_id;
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate payment success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        // Call backend to create challenge
        const purchaseResponse = await api.post('/challenge/purchase', {
          plan_id: selectedPlan.id,
          user_id: userId
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (purchaseResponse.status === 200) {
          setPaymentSuccess(true);
          setTimeout(() => {
            setPaymentProcessing(false);
            setPaymentSuccess(false);
            setShowForm(false);
            setFormData({ cardNumber: '', expiryDate: '', cvv: '', cardHolderName: '' });
            // Redirect to dashboard after successful challenge creation
            navigate('/dashboard');
          }, 3000);
        } else {
          setPaymentProcessing(false);
          alert(t.paymentFailure || 'Échec du paiement. Veuillez vérifier vos informations de carte.');
        }
      } else {
        setPaymentProcessing(false);
        alert(t.paymentFailure || 'Échec du paiement. Veuillez vérifier vos informations de carte.');
      }
    } catch (error) {
      setPaymentProcessing(false);
      console.error('Payment processing error:', error);
      alert(t.paymentFailure || 'Échec du paiement. Veuillez vérifier vos informations de carte.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" align="center" gutterBottom>
        {t.chooseYourPlan}
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" sx={{ mb: 6 }}>
        {t.accessAdvancedFeatures}
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <PricingCard featured={plan.featured}>
              {plan.featured && (
                <Box sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  py: 1, 
                  textAlign: 'center' 
                }}>
                  <Typography variant="caption" fontWeight="bold">
                    {t.popular}
                  </Typography>
                </Box>
              )}
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  {plan.price} <span style={{ fontSize: '1rem' }}>{plan.currency}</span>
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                  {t.perMonth}
                </Typography>
                
                <ul style={{ textAlign: 'left', paddingLeft: '1rem' }}>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <Typography variant="body2">{feature}</Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', padding: 2 }}>
                <Button 
                  variant={plan.featured ? "contained" : "outlined"} 
                  color={plan.buttonColor}
                  size="large"
                  onClick={() => handleSelectPlan(plan)}
                  fullWidth
                >
                  {plan.buttonText}
                </Button>
              </CardActions>
            </PricingCard>
          </Grid>
        ))}
      </Grid>

      {/* Payment Form Dialog */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {paymentProcessing ? t.processingPayment : 
           paymentSuccess ? t.paymentSuccess : 
           `${t.payment} - ${selectedPlan?.name}`}
        </DialogTitle>
        <DialogContent>
          {paymentProcessing ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {t.paymentProcessing}
              </Typography>
              <LinearProgress sx={{ width: '100%', my: 2 }} />
              <Typography variant="body2" color="textSecondary">
                {t.pleaseWaitPaymentProcessing.replace('{price}', selectedPlan?.price).replace('{currency}', selectedPlan?.currency)}
              </Typography>
            </Box>
          ) : paymentSuccess ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                bgcolor: 'success.light', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 2
              }}>
                <Typography variant="h2" color="success.main">✓</Typography>
              </Box>
              <Typography variant="h5" color="success.main" gutterBottom>
                {t.paymentSuccess}
              </Typography>
              <Typography variant="body1" align="center">
                {t.paymentSuccessMessage.replace('{price}', selectedPlan?.price).replace('{currency}', selectedPlan?.currency).replace('{plan}', selectedPlan?.name)}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                {t.paymentInfo.replace('{price}', selectedPlan?.price).replace('{currency}', selectedPlan?.currency).replace('{plan}', selectedPlan?.name)}
              </Alert>
              
              <TextField
                fullWidth
                label={t.cardNumber}
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                margin="normal"
                InputProps={{
                  inputProps: { 
                    maxLength: 19,
                    pattern: "[0-9 ]*"
                  }
                }}
              />
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={t.expiryDate}
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/AA"
                    inputProps={{ maxLength: 5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={t.cvv}
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    inputProps={{ maxLength: 3 }}
                  />
                </Grid>
              </Grid>
              
              <TextField
                fullWidth
                label={t.cardHolderName}
                name="cardHolderName"
                value={formData.cardHolderName}
                onChange={handleInputChange}
                placeholder="Nom complet"
                margin="normal"
              />
              
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label={t.saveForFuturePayments}
                sx={{ mt: 1 }}
              />
            </Box>
          )}
        </DialogContent>
        {!paymentProcessing && !paymentSuccess && (
          <DialogActions>
            <Button onClick={() => setShowForm(false)}>{t.cancel}</Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={processPayment}
              disabled={!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardHolderName}
            >
              {t.payAmount.replace('{price}', selectedPlan?.price).replace('{currency}', selectedPlan?.currency)}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Features Comparison Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {t.whyChooseTradeSense}
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center" p={2}>
              <Typography variant="h6" color="primary" gutterBottom>
                {t.advancedAI}
              </Typography>
              <Typography variant="body2">
                {t.advancedAIExplanation}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center" p={2}>
              <Typography variant="h6" color="primary" gutterBottom>
                {t.completePlatform}
              </Typography>
              <Typography variant="body2">
                {t.completePlatformExplanation}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center" p={2}>
              <Typography variant="h6" color="primary" gutterBottom>
                {t.localSupport}
              </Typography>
              <Typography variant="body2">
                {t.localSupportExplanation}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Payment;
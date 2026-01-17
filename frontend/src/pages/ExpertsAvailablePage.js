import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Rating
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const ExpertsAvailablePage = () => {
  const { t } = useAppContext();
  const navigate = useNavigate();
  const [experts, setExperts] = useState([]);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [contactMessage, setContactMessage] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Sample experts data
  useEffect(() => {
    const sampleExperts = [
      {
        id: 1,
        name: 'Dr. Jean-Pierre Dubois',
        specialty: 'Analyse technique avancée',
        experience: '15 ans',
        rating: 4.8,
        reviews: 124,
        availability: 'Disponible',
        profile: 'Expert en analyse technique et gestion de portefeuille avec une approche quantitative.',
        hourlyRate: 150,
        contactMethods: ['email', 'call', 'message'],
        languages: ['Français', 'Anglais']
      },
      {
        id: 2,
        name: 'Sophie Laurent',
        specialty: 'Trading Forex & CFD',
        experience: '10 ans',
        rating: 4.9,
        reviews: 98,
        availability: 'Occupé',
        profile: 'Spécialisée dans les stratégies de trading sur les devises et les CFD avec un excellent taux de succès.',
        hourlyRate: 120,
        contactMethods: ['email', 'message'],
        languages: ['Français', 'Espagnol']
      },
      {
        id: 3,
        name: 'Dr. Ahmed Benali',
        specialty: 'Crypto & Blockchain',
        experience: '8 ans',
        rating: 4.7,
        reviews: 87,
        availability: 'Disponible',
        profile: 'Expert en cryptomonnaies et technologies blockchain, avec une connaissance approfondie des marchés émergents.',
        hourlyRate: 200,
        contactMethods: ['email', 'call'],
        languages: ['Français', 'Arabe', 'Anglais']
      },
      {
        id: 4,
        name: 'Marie-Claire Rousseau',
        specialty: 'Options & Dé rivatifs',
        experience: '12 ans',
        rating: 4.6,
        reviews: 76,
        availability: 'Bientôt disponible',
        profile: 'Spécialiste des stratégies complexes d\'options et de gestion des risques sur les instruments dérivés.',
        hourlyRate: 180,
        contactMethods: ['email', 'call', 'message'],
        languages: ['Français', 'Anglais', 'Allemand']
      },
      {
        id: 5,
        name: 'Pierre Martin',
        specialty: 'Day Trading Actions',
        experience: '9 ans',
        rating: 4.5,
        reviews: 112,
        availability: 'Disponible',
        profile: 'Enseignant le day trading sur les actions américaines et européennes avec des stratégies à haut rendement.',
        hourlyRate: 100,
        contactMethods: ['email', 'message'],
        languages: ['Français', 'Anglais']
      },
      {
        id: 6,
        name: 'Fatima Zahra El Amrani',
        specialty: 'Analyse fondamentale',
        experience: '14 ans',
        rating: 4.9,
        reviews: 142,
        availability: 'Occupé',
        profile: 'Expert en analyse fondamentale et valorisation d\'entreprises, avec une expertise particulière dans les marchés émergents.',
        hourlyRate: 160,
        contactMethods: ['email', 'call'],
        languages: ['Français', 'Arabe', 'Anglais']
      }
    ];
    setExperts(sampleExperts);
  }, []);

  const handleContactExpert = (expert) => {
    setSelectedExpert(expert);
    setContactMessage('');
    setOpenContactDialog(true);
  };

  const handleCloseContactDialog = () => {
    setOpenContactDialog(false);
    setSelectedExpert(null);
    setContactMessage('');
  };

  const handleSendMessage = () => {
    // In a real app, this would send the message to the expert
    console.log(`Message sent to ${selectedExpert.name}: ${contactMessage}`);
    handleCloseContactDialog();
  };

  const filteredExperts = experts.filter(expert => {
    if (activeTab === 0) return expert.availability === 'Disponible';
    if (activeTab === 1) return expert.availability === 'Bientôt disponible';
    return expert.availability === 'Occupé';
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" mb={4}>
        {t.availableExperts || 'Experts disponibles'}
      </Typography>

      <Typography variant="h6" color="textSecondary" paragraph mb={4}>
        {t.availableExpertsDesc || 'Accédez à des traders professionnels et des analystes experts pour poser vos questions et recevoir des conseils personnalisés.'}
      </Typography>

      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)} 
        sx={{ mb: 3 }}
      >
        <Tab label={`${t.available || 'Disponible'} (${experts.filter(e => e.availability === 'Disponible').length})`} />
        <Tab label={`${t.soonAvailable || 'Bientôt disponible'} (${experts.filter(e => e.availability === 'Bientôt disponible').length})`} />
        <Tab label={`${t.currentlyBusy || 'Actuellement occupé'} (${experts.filter(e => e.availability === 'Occupé').length})`} />
      </Tabs>

      <Grid container spacing={3}>
        {filteredExperts.map((expert) => (
          <Grid item xs={12} sm={6} key={expert.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="flex-start" mb={2}>
                  <Avatar sx={{ width: 60, height: 60, mr: 2, fontSize: 24 }}>
                    {expert.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box flex={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h5" component="h2">
                        {expert.name}
                      </Typography>
                      <Chip 
                        label={expert.availability} 
                        color={
                          expert.availability === 'Disponible' ? 'success' :
                          expert.availability === 'Bientôt disponible' ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    </Box>
                    <Typography color="textSecondary" variant="body2">
                      {expert.specialty} • {expert.experience} {t.experience || 'expérience'}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" mt={1}>
                      <Rating value={expert.rating} readOnly precision={0.1} />
                      <Typography variant="body2" ml={1}>
                        {expert.rating}/5 ({expert.reviews} {t.reviews || 'avis'})
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="primary" mt={1}>
                      {t.hourlyRate || 'Tarif horaire'}: {expert.hourlyRate}€
                    </Typography>
                    
                    <Box mt={1}>
                      <Typography variant="caption" color="textSecondary">
                        {t.languages || 'Langues'}: {expert.languages.join(', ')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Typography variant="body1" paragraph mt={2}>
                  {expert.profile}
                </Typography>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    {expert.contactMethods.includes('call') && (
                      <Chip label={t.call || 'Appeler'} size="small" sx={{ mr: 1 }} />
                    )}
                    {expert.contactMethods.includes('email') && (
                      <Chip label={t.email || 'Email'} size="small" sx={{ mr: 1 }} />
                    )}
                    {expert.contactMethods.includes('message') && (
                      <Chip label={t.message || 'Message'} size="small" />
                    )}
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    {t.lastSeen || 'Vu récemment'}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => handleContactExpert(expert)}
                  disabled={expert.availability === 'Occupé'}
                >
                  {expert.availability === 'Occupé' ? t.notAvailable || 'Non disponible' : t.contactExpert || 'Contacter l\'expert'}
                </Button>
                <Button size="small">{t.viewProfile || 'Voir le profil'}</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Contact Expert Dialog */}
      <Dialog open={openContactDialog} onClose={handleCloseContactDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t.contactExpert || 'Contacter l\'expert'} - {selectedExpert?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {t.contactExpertDesc || 'Envoyez un message à cet expert pour demander une consultation ou poser vos questions.'}
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            label={t.yourMessage || 'Votre message'}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            sx={{ mt: 2 }}
          />
          
          <Box mt={2} p={2} bgcolor="info.light" borderRadius={1}>
            <Typography variant="body2">
              <strong>{t.pricingInfo || 'Information tarifaire'}:</strong> {t.consultationRate || 'Le tarif de consultation est de'} {selectedExpert?.hourlyRate}€/heure
            </Typography>
            <Typography variant="body2" mt={1}>
              <strong>{t.availability || 'Disponibilité'}:</strong> {selectedExpert?.availability}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseContactDialog}>{t.cancel || 'Annuler'}</Button>
          <Button onClick={handleSendMessage} variant="contained">
            {t.sendMessage || 'Envoyer le message'}
          </Button>
        </DialogActions>
      </Dialog>

      <Box textAlign="center" mt={6}>
        <Button 
          variant="outlined" 
          size="large"
          onClick={() => navigate('/community-hub')}
        >
          {t.backToCommunity || 'Retour à la communauté'}
        </Button>
      </Box>
    </Container>
  );
};

export default ExpertsAvailablePage;
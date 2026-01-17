import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const ChallengesPage = () => {
  const { t } = useAppContext();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" color="secondary" gutterBottom>
          🏆 {t.tradingChallenges || 'Challenges de Trading'}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {t.challengeDescription || 'Relevez des défis de trading pour prouver vos compétences et gagner des fonds pour trader avec de l\'argent réel.'}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 4, 
              height: '100%', 
              backgroundColor: '#fce4ec', 
              border: '2px solid', 
              borderColor: 'secondary.light', 
              borderRadius: 2, 
              '&:hover': { 
                backgroundColor: '#f8bbd0',
                transform: 'translateY(-5px)',
                boxShadow: 6
              }, 
              transition: 'all 0.3s ease-in-out' 
            }} 
          >
            <Typography variant="h5" color="secondary" gutterBottom fontWeight="bold">
              {t.profitabilityChallenge || 'Défi de rentabilité'}
            </Typography>
            <Typography variant="body1" color="#333" gutterBottom>
              {t.profitabilityChallengeDesc || 'Mettez vos compétences à l\'épreuve en atteignant des objectifs de rentabilité spécifiques dans un environnement simulé.'}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip label={t.challengeLevel || 'Avancé'} size="medium" color="secondary" sx={{ mr: 1, mb: 1 }} />
              <Chip label={t.profitTarget || 'Objectif: 10%'} size="medium" color="success" sx={{ mr: 1, mb: 1 }} />
              <Chip label={t.timeLimit || 'Durée: 30 jours'} size="medium" color="info" sx={{ mb: 1 }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 4, 
              height: '100%', 
              backgroundColor: '#fce4ec', 
              border: '2px solid', 
              borderColor: 'secondary.light', 
              borderRadius: 2, 
              '&:hover': { 
                backgroundColor: '#f8bbd0',
                transform: 'translateY(-5px)',
                boxShadow: 6
              }, 
              transition: 'all 0.3s ease-in-out' 
            }} 
          >
            <Typography variant="h5" color="secondary" gutterBottom fontWeight="bold">
              {t.riskManagementChallenge || 'Défi de risque maîtrisé'}
            </Typography>
            <Typography variant="body1" color="#333" gutterBottom>
              {t.riskManagementChallengeDesc || 'Démontrez votre capacité à gérer le risque tout en maintenant des performances positives.'}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip label={t.challengeLevel || 'Intermédiaire'} size="medium" color="warning" sx={{ mr: 1, mb: 1 }} />
              <Chip label={t.maxLoss || 'Perte max: 5%'} size="medium" color="error" sx={{ mr: 1, mb: 1 }} />
              <Chip label={t.timeLimit || 'Durée: 45 jours'} size="medium" color="info" sx={{ mb: 1 }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 4, 
              height: '100%', 
              backgroundColor: '#fce4ec', 
              border: '2px solid', 
              borderColor: 'secondary.light', 
              borderRadius: 2, 
              '&:hover': { 
                backgroundColor: '#f8bbd0',
                transform: 'translateY(-5px)',
                boxShadow: 6
              }, 
              transition: 'all 0.3s ease-in-out' 
            }} 
          >
            <Typography variant="h5" color="secondary" gutterBottom fontWeight="bold">
              {t.consistencyChallenge || 'Défi de cohérence'}
            </Typography>
            <Typography variant="body1" color="#333" gutterBottom>
              {t.consistencyChallengeDesc || 'Prouvez votre aptitude à générer des résultats stables sur une période prolongée.'}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip label={t.challengeLevel || 'Expert'} size="medium" color="error" sx={{ mr: 1, mb: 1 }} />
              <Chip label={t.performance || 'Consistance: 80%'} size="medium" color="success" sx={{ mr: 1, mb: 1 }} />
              <Chip label={t.timeLimit || 'Durée: 90 jours'} size="medium" color="info" sx={{ mb: 1 }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 4, 
              height: '100%', 
              backgroundColor: '#fce4ec', 
              border: '2px solid', 
              borderColor: 'secondary.light', 
              borderRadius: 2, 
              '&:hover': { 
                backgroundColor: '#f8bbd0',
                transform: 'translateY(-5px)',
                boxShadow: 6
              }, 
              transition: 'all 0.3s ease-in-out' 
            }} 
          >
            <Typography variant="h5" color="secondary" gutterBottom fontWeight="bold">
              {t.dailyChallenges || 'Challenges quotidiens'}
            </Typography>
            <Typography variant="body1" color="#333" gutterBottom>
              {t.dailyChallengesDesc || 'Participez à des défis quotidiens pour perfectionner vos compétences en temps réel.'}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip label={t.challengeLevel || 'Tous niveaux'} size="medium" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label={t.dailyRewards || 'Récompenses quotidiennes'} size="medium" color="success" sx={{ mr: 1, mb: 1 }} />
              <Chip label={t.competitive || 'Compétitif'} size="medium" color="warning" sx={{ mb: 1 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" color="primary" gutterBottom>
          {t.accessRealCapital || 'Accédez au capital réel'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t.capitalAccessDesc || 'Réussissez les challenges pour obtenir un compte réel avec du capital à risquer.'}
        </Typography>
        
        <Button 
          variant="contained" 
          color="secondary" 
          size="large" 
          onClick={() => navigate('/dashboard')}
          sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
        >
          {t.participateNow || 'Participer aux Challenges'}
        </Button>
      </Box>
    </Container>
  );
};

export default ChallengesPage;
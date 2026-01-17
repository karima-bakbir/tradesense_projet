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
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const TradingStrategiesPage = () => {
  const { t } = useAppContext();
  const navigate = useNavigate();
  const [strategies, setStrategies] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newStrategy, setNewStrategy] = useState({ title: '', description: '', author: 'Utilisateur Actuel' });

  // Sample initial strategies
  useEffect(() => {
    const sampleStrategies = [
      {
        id: 1,
        title: 'Stratégie de Scalping Forex',
        description: 'Technique de scalping sur les paires majeures avec des bougies de 1 minute. Utilise RSI et MACD pour les signaux.',
        author: 'Jean Dupont',
        date: '2024-01-15',
        likes: 24,
        category: 'Forex',
        difficulty: 'Intermédiaire'
      },
      {
        id: 2,
        title: 'Day Trading Actions Tech',
        description: 'Stratégie basée sur les volumes et les niveaux de support/résistance pour les actions technologiques.',
        author: 'Marie Leclerc',
        date: '2024-01-14',
        likes: 18,
        category: 'Actions',
        difficulty: 'Avancé'
      },
      {
        id: 3,
        title: 'Swing Trading Indices',
        description: 'Approche de swing trading sur les indices américains avec des positions de 2-5 jours.',
        author: 'Pierre Martin',
        date: '2024-01-13',
        likes: 31,
        category: 'Indices',
        difficulty: 'Débutant'
      }
    ];
    setStrategies(sampleStrategies);
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewStrategy({ title: '', description: '', author: 'Utilisateur Actuel' });
  };

  const handleAddStrategy = () => {
    if (newStrategy.title && newStrategy.description) {
      const strategyToAdd = {
        id: strategies.length + 1,
        ...newStrategy,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        category: 'Général',
        difficulty: 'Intermédiaire'
      };
      setStrategies([strategyToAdd, ...strategies]);
      handleCloseDialog();
    }
  };

  const handleLike = (id) => {
    setStrategies(strategies.map(strategy => 
      strategy.id === id ? { ...strategy, likes: strategy.likes + 1 } : strategy
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3" component="h1">
          {t.strategySharing || 'Partage de stratégies'}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={handleOpenDialog}
        >
          {t.addStrategy || 'Ajouter une stratégie'}
        </Button>
      </Box>

      <Typography variant="h6" color="textSecondary" paragraph sx={{ mb: 4 }}>
        {t.strategySharingDesc || 'Échangez vos stratégies de trading avec d\'autres membres de la communauté et collaborez pour améliorer vos performances.'}
      </Typography>

      <Grid container spacing={3}>
        {strategies.map((strategy) => (
          <Grid item xs={12} key={strategy.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {strategy.title}
                    </Typography>
                    <Box display="flex" gap={1} mb={2}>
                      <Chip 
                        label={strategy.category} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                      <Chip 
                        label={strategy.difficulty} 
                        size="small" 
                        color="secondary" 
                        variant="outlined" 
                      />
                    </Box>
                  </Box>
                  <Avatar>{strategy.author.charAt(0)}</Avatar>
                </Box>
                
                <Typography variant="body1" paragraph>
                  {strategy.description}
                </Typography>
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Typography variant="caption" color="textSecondary">
                    {t.byAuthor || 'Par'} {strategy.author} • {strategy.date}
                  </Typography>
                  <Box>
                    <Button 
                      size="small" 
                      onClick={() => handleLike(strategy.id)}
                      sx={{ mr: 1 }}
                    >
                      👍 {strategy.likes}
                    </Button>
                    <Button size="small" color="secondary">
                      💬 {Math.floor(Math.random() * 10)}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
              <Divider />
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => {
                    // View strategy details
                    alert(`${t.strategyDetails || 'Détails de la stratégie'}:\n${strategy.title}\n\n${strategy.description}`);
                  }}
                >
                  {t.viewDetails || 'Voir détails'}
                </Button>
                <Button 
                  size="small" 
                  onClick={() => {
                    // Save strategy
                    alert(`${t.strategySaved || 'Stratégie sauvegardée'}: ${strategy.title}`);
                  }}
                >
                  {t.saveStrategy || 'Sauvegarder'}
                </Button>
                <Button 
                  size="small" 
                  color="secondary"
                  onClick={() => {
                    // Report strategy
                    alert(`${t.strategyReported || 'Stratégie signalée'}: ${strategy.title}`);
                  }}
                >
                  {t.report || 'Signaler'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Strategy Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t.addNewStrategy || 'Ajouter une nouvelle stratégie'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t.strategyTitle || 'Titre de la stratégie'}
            fullWidth
            variant="outlined"
            value={newStrategy.title}
            onChange={(e) => setNewStrategy({...newStrategy, title: e.target.value})}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            label={t.strategyDescription || 'Description de la stratégie'}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newStrategy.description}
            onChange={(e) => setNewStrategy({...newStrategy, description: e.target.value})}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t.cancel || 'Annuler'}</Button>
          <Button onClick={handleAddStrategy} variant="contained">{t.add || 'Ajouter'}</Button>
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

export default TradingStrategiesPage;
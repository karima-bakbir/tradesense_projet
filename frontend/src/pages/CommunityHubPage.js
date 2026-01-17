import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import StrategyIcon from '@mui/icons-material/BarChart';
import DiscussionIcon from '@mui/icons-material/Forum';
import ExpertsIcon from '@mui/icons-material/People';

const CommunityHubPage = () => {
  const { t } = useAppContext();
  const navigate = useNavigate();

  const communityFeatures = [
    {
      id: 'strategies',
      title: t.strategySharing || 'Partage de stratégies',
      description: t.strategySharingDesc || 'Échangez vos stratégies de trading avec d\'autres membres de la communauté et collaborez pour améliorer vos performances.',
      icon: <StrategyIcon sx={{ fontSize: 60 }} />,
      color: 'primary',
      link: '/trading-strategies'
    },
    {
      id: 'discussions',
      title: t.marketDiscussions || 'Discussions sur le marché',
      description: t.marketDiscussionsDesc || 'Participez aux discussions en temps réel sur les tendances du marché, les analyses techniques et les événements économiques.',
      icon: <DiscussionIcon sx={{ fontSize: 60 }} />,
      color: 'secondary',
      link: '/market-discussions'
    },
    {
      id: 'experts',
      title: t.availableExperts || 'Experts disponibles',
      description: t.availableExpertsDesc || 'Accédez à des traders professionnels et des analystes experts pour poser vos questions et recevoir des conseils personnalisés.',
      icon: <ExpertsIcon sx={{ fontSize: 60 }} />,
      color: 'warning',
      link: '/experts-available'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          {t.zoneCommunautaire || 'Zone Communautaire'}
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          {t.communityBenefits || 'Profitez pleinement de notre communauté en participant activement aux discussions, en partageant vos connaissances et en apprenant des autres membres.'}
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {communityFeatures.map((feature) => (
          <Grid item xs={12} md={4} key={feature.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box color={`${feature.color}.main`} mb={2}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', padding: 2 }}>
                <Button 
                  variant="contained" 
                  color={feature.color}
                  size="large"
                  onClick={() => navigate(feature.link)}
                >
                  {t.explore || 'Explorer'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center" mt={6}>
        <Button 
          variant="outlined" 
          size="large"
          onClick={() => navigate('/')}
        >
          {t.backToHome || 'Retour à l\'accueil'}
        </Button>
      </Box>
    </Container>
  );
};

export default CommunityHubPage;
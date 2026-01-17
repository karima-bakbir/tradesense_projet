import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  IconButton,
  CircularProgress
} from '@mui/material';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { getFinancialNews } from '../utils/api';
import { Close as CloseIcon, Notifications as NotificationsIcon, TrendingUp as TrendingIcon, Event as EventIcon, Description as DescriptionIcon, Warning as WarningIcon } from '@mui/icons-material';

const NewsFeedPage = () => {
  const { t } = useAppContext();
  const navigate = useNavigate();
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real financial news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // Attempt to fetch news from our backend API using the dedicated function
        const response = await getFinancialNews();
        
        // Axios always returns a response object, so check status
        if (response.status === 200) {
          setNewsItems(response.data);
        } else {
          // If our API doesn't have news, use mock data
          const mockNews = [
            {
              id: 1,
              title: t.fedPauseHike || "La Fed décide de suspendre la hausse des taux pour le moment",
              description: "La banque centrale américaine annonce une pause dans sa politique de resserrement monétaire face à l'évolution de l'inflation.",
              source: "Reuters",
              time: "Il y a 15 minutes",
              type: "economic",
              priority: "high"
            },
            {
              id: 2,
              title: t.iamUpQuarterly || "IAM affiche une progression de 5% au cours du dernier trimestre",
              description: "Le géant marocain des télécommunications dépasse les attentes avec une croissance de 5% au dernier trimestre.",
              source: "Bloomberg",
              time: "Il y a 45 minutes",
              type: "stock",
              priority: "medium"
            },
            {
              id: 3,
              title: t.cryptoRegulationNews || "Nouvelle réglementation pour les cryptomonnaies en Europe",
              description: "L'Union européenne adopte un nouveau cadre réglementaire pour encadrer le secteur des cryptomonnaies.",
              source: "Financial Times",
              time: "Il y a 2 heures",
              type: "crypto",
              priority: "high"
            },
            {
              id: 4,
              title: "Mise à jour du marché pétrolier",
              description: "Les stocks de pétrole brut ont baissé cette semaine, soutenant les prix.",
              source: "MarketWatch",
              time: "Il y a 3 heures",
              type: "commodity",
              priority: "low"
            },
            {
              id: 5,
              title: "Analyse technique hebdomadaire du S&P 500",
              description: "L'indice présente des signes de consolidation après une forte hausse au cours des dernières semaines.",
              source: "AI Analysis",
              time: "Il y a 4 heures",
              type: "analysis",
              priority: "medium"
            }
          ];
          setNewsItems(mockNews);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        // Handle different types of errors
        let errorMessage = 'Unknown error occurred';
        if (err.response) {
          // Server responded with error status
          errorMessage = `Server error: ${err.response.status}`;
        } else if (err.request) {
          // Request was made but no response received
          errorMessage = 'Network Error - Unable to connect to news service. Showing offline content.';
        } else {
          // Something else happened
          errorMessage = err.message || 'Unknown error occurred';
        }
        setError(errorMessage);
        // Use mock data as fallback
        const mockNews = [
          {
            id: 1,
            title: t.fedPauseHike || "La Fed décide de suspendre la hausse des taux pour le moment",
            description: "La banque centrale américaine annonce une pause dans sa politique de resserrement monétaire face à l'évolution de l'inflation.",
            source: "Reuters",
            time: "Il y a 15 minutes",
            type: "economic",
            priority: "high"
          },
          {
            id: 2,
            title: t.iamUpQuarterly || "IAM affiche une progression de 5% au cours du dernier trimestre",
            description: "Le géant marocain des télécommunications dépasse les attentes avec une croissance de 5% au dernier trimestre.",
            source: "Bloomberg",
            time: "Il y a 45 minutes",
            type: "stock",
            priority: "medium"
          },
          {
            id: 3,
            title: t.cryptoRegulationNews || "Nouvelle réglementation pour les cryptomonnaies en Europe",
            description: "L'Union européenne adopte un nouveau cadre réglementaire pour encadrer le secteur des cryptomonnaies.",
            source: "Financial Times",
            time: "Il y a 2 heures",
            type: "crypto",
            priority: "high"
          },
          {
            id: 4,
            title: "Mise à jour du marché pétrolier",
            description: "Les stocks de pétrole brut ont baissé cette semaine, soutenant les prix.",
            source: "MarketWatch",
            time: "Il y a 3 heures",
            type: "commodity",
            priority: "low"
          },
          {
            id: 5,
            title: "Analyse technique hebdomadaire du S&P 500",
            description: "L'indice présente des signes de consolidation après une forte hausse au cours des dernières semaines.",
            source: "AI Analysis",
            time: "Il y a 4 heures",
            type: "analysis",
            priority: "medium"
          }
        ];
        setNewsItems(mockNews);
      } finally {
        setLoading(false);
      }
    };

    // Fetch news initially
    fetchNews();
    
    // Set up interval to refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000); // 5 minutes
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [t]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'economic':
        return <EventIcon />;
      case 'stock':
        return <TrendingIcon />;
      case 'crypto':
        return <NotificationsIcon />;
      case 'analysis':
        return <DescriptionIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          {t.hubNews || 'Hub d\'Actualités'}
        </Typography>
        <IconButton onClick={() => navigate(-1)}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        {t.hubNewsDescription || 'Restez informé des dernières nouvelles financières, des tendances du marché et des événements économiques en direct.'}
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
              {t.latestFinancialNews || 'Dernières Nouvelles Financières'}
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <CircularProgress size={24} sx={{ mr: 2 }} />
                <Typography variant="body1">{t.loadingNews || 'Chargement des actualités...'}</Typography>
              </Box>
            ) : error ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <WarningIcon color="error" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="body1" color="error" align="center">
                  {t.errorLoadingNews || 'Erreur de chargement des actualités:'} {error}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  {t.newsTemporarilyUnavailable || 'Les actualités sont temporairement indisponibles. Veuillez réessayer plus tard.'}
                </Typography>
              </Box>
            ) : newsItems.length === 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary" align="center">
                  {t.noNewsAvailable || 'Aucune actualité disponible pour le moment.'}
                </Typography>
              </Box>
            ) : (
              <List>
                {newsItems.map((item, index) => (
                  <div key={item.id}>
                    <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                      <ListItemIcon sx={{ minWidth: '40px', color: 'primary.main' }}>
                        {getTypeIcon(item.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6" component="div">
                              {item.title}
                            </Typography>
                            <Chip 
                              label={item.priority === 'high' ? 'Prioritaire' : item.priority === 'medium' ? 'Important' : 'Standard'} 
                              size="small" 
                              color={getPriorityColor(item.priority)} 
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {item.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.source} • {item.time}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < newsItems.length - 1 && <Divider />}
                  </div>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  {t.realTimeFinancialNews || 'Nouvelles financières en temps réel'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.realTimeDataDescription || 'Accédez aux dernières nouvelles financières en temps réel pour rester informé des mouvements du marché.'}
                </Typography>
              </CardContent>
            </Card>
            
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  {t.aiMarketSummaries || 'Résumés de marché créés par l\'IA'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.aiAnalysisProcess || 'Notre IA combine l\'analyse technique, les données économiques et les indicateurs du marché pour générer des résumés intelligents.'}
                </Typography>
              </CardContent>
            </Card>
            
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  {t.economicEventAlerts || 'Alertes d\'événements économiques'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.economicCalendar || 'Restez informé des événements économiques majeurs qui pourraient impacter les marchés.'}
                </Typography>
              </CardContent>
            </Card>
            
            <Card elevation={3} sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t.stayAhead || 'Gardez toujours une longueur d\'avance'}
                </Typography>
                <Typography variant="body2">
                  {t.stayAheadDescription || 'Avec notre flux d\'actualités en temps réel, vous aurez toujours les informations les plus récentes pour prendre des décisions éclairées.'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewsFeedPage;
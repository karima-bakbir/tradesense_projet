import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useUserContext } from '../contexts/UserContext';
import api from '../utils/api';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Link,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import PeopleIcon from '@mui/icons-material/People';
import { styled } from '@mui/system';
import AIAssistant from '../components/AIAssistant';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  marginBottom: theme.spacing(4),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(10px)',
  '& .MuiToolbar-root': {
    minHeight: 70,
  }
}));

const LandingPage = () => {
  const { t } = useAppContext();
  const { user, isAuthenticated } = useUserContext();
  const navigate = useNavigate();
  
  // State for dropdown menus
  const [platformMenuAnchor, setPlatformMenuAnchor] = useState(null);
  const [communityMenuAnchor, setCommunityMenuAnchor] = useState(null);
  const [learningMenuAnchor, setLearningMenuAnchor] = useState(null);
  
  // Platform menu handlers
  const handlePlatformMenuOpen = (event) => {
    setPlatformMenuAnchor(event.currentTarget);
  };
  
  const handlePlatformMenuClose = () => {
    setPlatformMenuAnchor(null);
  };
  
  // Community menu handlers
  const handleCommunityMenuOpen = (event) => {
    setCommunityMenuAnchor(event.currentTarget);
  };
  
  const handleCommunityMenuClose = () => {
    setCommunityMenuAnchor(null);
  };
  
  // Learning menu handlers
  const handleLearningMenuOpen = (event) => {
    setLearningMenuAnchor(event.currentTarget);
  };
  
  const handleLearningMenuClose = () => {
    setLearningMenuAnchor(null);
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAIDetails, setShowAIDetails] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedAIAlgorithm, setSelectedAIAlgorithm] = useState('overview');
  const [userHasActiveChallenge, setUserHasActiveChallenge] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Check if user has active challenge
  useEffect(() => {
    const checkChallengeStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.get('/api/user/challenges', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const activeChallenge = data.find(challenge => 
              challenge.status === 'active' || 
              challenge.status === 'funded'
            );
            setUserHasActiveChallenge(!!activeChallenge);
          }
        }
      } catch (error) {
        console.error('Error checking challenge status:', error);
      }
    };

    checkChallengeStatus();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 3); // Cycle between 0, 1, 2
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const confirmPurchase = async () => {
    if (!selectedPlan) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await api.post('/challenge/purchase', {
        plan_id: selectedPlan.id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      
      if (response.status === 200) {
        setSuccess(t.purchaseSuccess || 'Challenge purchased successfully!');
        setUserHasActiveChallenge(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(response.data?.message || (t.purchaseError || 'Error purchasing challenge'));
      }
    } catch (error) {
      setError(t.purchaseRetry || 'Error connecting to server. Please try again.');
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handlePlanSelect = (plan) => {
    if (userHasActiveChallenge) {
      setError(t.activeChallengeExists || 'You already have an active challenge.');
      return;
    }
    
    setSelectedPlan(plan);
    setOpenDialog(true);
  };

  return (
    <div>
      <Container maxWidth="false" sx={{ py: 0, px: 0, maxWidth: '100%', bgcolor: 'background.default' }}>
      {/* Trading-themed Animated Background */}
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3,
          },
          animation: 'gradientShift 15s ease infinite',
          '@keyframes gradientShift': {
            '0%': {
              background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
            },
            '50%': {
              background: 'linear-gradient(135deg, #2c5364 0%, #0f2027 50%, #203a43 100%)',
            },
            '100%': {
              background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
            },
          }
        }}
      >
        {/* Animated trading lines */}
        {[...Array(15)].map((_, i) => (
          <Box
            key={`line-${i}`}
            sx={{
              position: 'absolute',
              height: '2px',
              width: '100%',
              background: `linear-gradient(90deg, transparent, ${['#1e3c72', '#2a5298', '#2c3e50', '#1e3c72', '#2a5298'][i % 5]}, transparent)`,
              top: `${(i * 7) % 100}%`,
              animation: `horizontalMove ${15 + (i % 5) * 5}s linear infinite`,
              animationDelay: `${i * 0.5}s`,
              opacity: 0.3,
            }}
          />
        ))}
        
        {/* Animated trading dots */}
        {[...Array(20)].map((_, i) => (
          <Box
            key={`dot-${i}`}
            sx={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: ['#1e3c72', '#2a5298', '#2c3e50', '#1e3c72', '#2a5298'][i % 5],
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `verticalMove ${8 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.6,
            }}
          />
        ))}
        
        {/* Animated trading chart elements */}
        {[...Array(8)].map((_, i) => (
          <Box
            key={`chart-${i}`}
            sx={{
              position: 'absolute',
              width: '60px',
              height: '40px',
              borderLeft: '2px solid rgba(255,255,255,0.1)',
              borderBottom: '2px solid rgba(255,255,255,0.1)',
              top: `${20 + (i * 10)}%`,
              left: `${10 + (i * 10)}%`,
              transform: 'rotate(180deg)',
              opacity: 0.2,
            }}
          >
            {/* Chart line */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(to top right, transparent 30%, ${['#1e3c72', '#2a5298', '#2c3e50', '#1e3c72'][i % 4]} 50%, transparent 70%)`,
                clipPath: 'polygon(0 100%, 15% 70%, 30% 85%, 45% 60%, 60% 75%, 75% 40%, 90% 65%, 100% 0%, 100% 100%, 0% 100%)',
                animation: `chartRise ${6 + (i % 4) * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          </Box>
        ))}
        
        {/* Keyframes for animations */}
        <style>{`
          @keyframes horizontalMove {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
                  
          @keyframes verticalMove {
            0% { transform: translateY(-100vh); }
            100% { transform: translateY(100vh); }
          }
                  
          @keyframes chartRise {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
          }
                  
          @keyframes floatSymbol {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(20px, -20px) rotate(10deg); }
            50% { transform: translate(0, -40px) rotate(0deg); }
            75% { transform: translate(-20px, -20px) rotate(-10deg); }
          }
        `}</style>
        {/* Animated floating elements */}
        <Box sx={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(180deg)' },
          }
        }} />
        <Box sx={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '1s',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-25px) rotate(-180deg)' },
          }
        }} />
        
        {/* Additional floating shapes */}
        <Box sx={{
          position: 'absolute',
          top: '40%',
          left: '70%',
          width: 40,
          height: 40,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          animation: 'float 7s ease-in-out infinite',
          animationDelay: '2s',
        }} />
        <Box sx={{
          position: 'absolute',
          top: '10%',
          left: '40%',
          width: 50,
          height: 50,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          animation: 'float 9s ease-in-out infinite',
          animationDelay: '0.5s',
        }} />
              
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', py: 8, px: 2 }}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2.5rem', md: '4rem' }, 
              fontWeight: 700, 
              lineHeight: 1.2,
              background: 'linear-gradient(45deg, #ffffff, #a1c4fd, #c2e9fb)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              animation: 'fadeInUp 1s ease-out',
              '@keyframes fadeInUp': {
                '0%': { opacity: 0, transform: 'translateY(30px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              }
            }}
          >
            {t.landingProductPlatform || 'La plateforme de prop trading intelligente pour les traders ambitieux'}
          </Typography>
          <Typography 
            variant="h4" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 800, 
              mx: 'auto', 
              mb: 6,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              fontWeight: 300,
              color: '#e0e0e0',
              animation: 'fadeInUp 1s ease-out 0.2s both',
            }}
          >
            {t.productVisionDescription || 'Une plateforme complète qui combine intelligence artificielle, analyse de marché et communauté de traders'}
          </Typography>
                      
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 3, 
            flexWrap: 'wrap',
            animation: 'fadeInUp 1s ease-out 0.4s both',
          }}>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/pricing')}
              sx={{ 
                minWidth: 220,
                minHeight: 50,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #2193b0, #6dd5ed)',
                boxShadow: '0 4px 20px rgba(33, 147, 176, 0.4)',
                borderRadius: '50px',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(33, 147, 176, 0.6)',
                  background: 'linear-gradient(45deg, #2193b0, #2193b0)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {t.startChallenge || 'Start Challenge'}
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              onClick={() => navigate('/pricing')}
              sx={{ 
                minWidth: 220,
                minHeight: 50,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                borderRadius: '50px',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderColor: 'white',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 4px 20px rgba(255,255,255,0.2)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {t.viewPricing || 'View Pricing'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 12, bgcolor: 'background.default', position: 'relative' }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.02) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.02) 0%, transparent 20%)',
        }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" align="center" gutterBottom sx={{ mb: 8, fontWeight: 600, color: 'common.white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            {t.whyChooseTradeSense || 'Why choose TradeSense AI?'}
          </Typography>
                
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  p: 4, 
                  textAlign: 'center', 
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    background: 'linear-gradient(145deg, #1e3c72, #2a5298)',
                    color: 'white',
                  },
                  position: 'relative',
                  overflow: 'visible',
                  cursor: 'pointer',
                  background: 'linear-gradient(145deg, #2c3e50, #1e3c72)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={() => {
                  setShowAIAssistant(true);
                }}
              >
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 3,
                  color: 'primary.contrastText',
                  border: '2px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 0 20px rgba(100, 149, 237, 0.6)',
                  }
                }}>
                <Typography variant="h4">🤖</Typography>
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'inherit' }}>
                  {t.advancedAssistantAI || 'Assistance IA Avancée'}
                </Typography>
                <Typography color="text.secondary" paragraph sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {t.assistantIADescription || 'Notre IA analyse les marchés en temps réel pour vous fournir des signaux de trading précis et des analyses techniques approfondies.'}
                </Typography>
                <Box sx={{ mt: 2, textAlign: 'left', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'inherit', fontWeight: 600 }}>
                    {t.askAIAssistant || 'Posez votre question à l\'assistant IA'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.realTimeSignals || 'Signaux de trading en temps réel'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.detailedTechnicalAnalysis || 'Analyse technique approfondie'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.personalizedRecommendations || 'Recommandations personnalisées'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.performanceTracking || 'Suivi des performances'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.smartAlerts || 'Alertes intelligentes'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
                  
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  p: 4, 
                  textAlign: 'center', 
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    background: 'linear-gradient(145deg, #00b09b, #96c93d)',
                    color: 'white',
                  },
                  position: 'relative',
                  overflow: 'visible',
                  cursor: 'pointer',
                  background: 'linear-gradient(145deg, #27ae60, #2ecc71)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={() => {
                  navigate('/news-feed');
                }}
              >
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 3,
                  color: 'success.contrastText',
                  border: '2px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 0 20px rgba(46, 204, 113, 0.6)',
                  }
                }}>
                <Typography variant="h4">📰</Typography>
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'inherit' }}>
                  {t.hubNews || 'Hub d\'Actualités'}
                </Typography>
                <Typography color="text.secondary" paragraph sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {t.hubNewsDescription || 'Restez informé des dernières nouvelles financières, des tendances du marché et des événements économiques en direct.'}
                </Typography>
                <Box sx={{ mt: 2, textAlign: 'left', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'inherit', fontWeight: 600 }}>
                    {t.askAIAssistant || 'Posez votre question à l\'assistant IA'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.realTimeFinancialNews || 'Nouvelles financières en temps réel'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.marketTrends || 'Tendances du marché'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.majorEconomicEvents || 'Événements économiques majeurs'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.economicCalendar || 'Calendrier économique'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.customizedAlerts || 'Alertes personnalisées'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
                  
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  p: 4, 
                  textAlign: 'center', 
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    background: 'linear-gradient(145deg, #ff9a9e, #fad0c4)',
                    color: 'white',
                  },
                  position: 'relative',
                  overflow: 'visible',
                  cursor: 'pointer',
                  background: 'linear-gradient(145deg, #8e44ad, #9b59b6)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={() => {
                  // Navigate to the community zone main page
                  navigate('/community-hub');
                }}
              >
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 3,
                  color: 'warning.contrastText',
                  border: '2px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 0 20px rgba(155, 89, 182, 0.6)',
                  }
                }}>
                <Typography variant="h4">👥</Typography>
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'inherit' }}>
                  {t.zoneCommunity || 'Zone Communautaire'}
                </Typography>
                <Typography color="text.secondary" paragraph sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {t.zoneCommunityDescription || 'Partagez vos stratégies, discutez avec d\'autres traders et collaborez dans notre communauté active de professionnels.'}
                </Typography>
                <Box sx={{ mt: 2, textAlign: 'left', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'inherit', fontWeight: 600 }}>
                    {t.askAIAssistant || 'Posez votre question à l\'assistant IA'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.strategySharing || 'Partage de stratégies'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.marketDiscussions || 'Discussions sur le marché'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.availableExperts || 'Experts disponibles'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.regularWebinars || 'Webinaires réguliers'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.performanceTracking || 'Suivi des performances'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
        </Grid>
      </Container>
      </Box>

      {/* Additional Features Section */}
      <Box sx={{ py: 12, bgcolor: 'background.default', position: 'relative' }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.02) 0%, transparent 20%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.02) 0%, transparent 20%)',
        }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" align="center" gutterBottom sx={{ mb: 8, fontWeight: 600, color: 'common.white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            {t.additionalFeatures || 'Fonctionnalités Complémentaires'}
          </Typography>
                
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  p: 4, 
                  textAlign: 'center', 
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    background: 'linear-gradient(145deg, #f093fb, #f5576c)',
                    color: 'white',
                  },
                  position: 'relative',
                  overflow: 'visible',
                  cursor: 'pointer',
                  background: 'linear-gradient(145deg, #3498db, #2c3e50)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={() => {
                  setSelectedAIAlgorithm('courses');
                  setShowAIDetails(true);
                }}
              >
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 3,
                  color: 'info.contrastText',
                  border: '2px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 0 20px rgba(52, 152, 219, 0.6)',
                  }
                }}>
                <Typography variant="h4">🎓</Typography>
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'inherit' }}>
                  {t.masterClass || 'MasterClass de Trading'}
                </Typography>
                <Typography color="text.secondary" paragraph sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {t.masterClassDescription || 'Des formations exclusives dispensées par des traders professionnels pour améliorer vos compétences et votre rentabilité.'}
                </Typography>
                <Box sx={{ mt: 2, textAlign: 'left', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'inherit', fontWeight: 600 }}>
                    {t.askAIAssistant || 'Posez votre question à l\'assistant IA'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.provenTradingStrategies || 'Stratégies de trading éprouvées'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.advancedTechnicalAnalysis || 'Analyse technique avancée'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.riskManagement || 'Gestion des risques'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.tradingPsychology || 'Psychologie du trading'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.expertAccess || 'Accès aux experts'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
                  
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  p: 4, 
                  textAlign: 'center', 
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    background: 'linear-gradient(145deg, #ff9a9e, #fecfef)',
                    color: 'white',
                  },
                  position: 'relative',
                  overflow: 'visible',
                  cursor: 'pointer',
                  background: 'linear-gradient(145deg, #e74c3c, #c0392b)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={() => {
                  setSelectedAIAlgorithm('challenges');
                  setShowAIDetails(true);
                }}
              >
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 3,
                  color: 'secondary.contrastText',
                  border: '2px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 0 20px rgba(231, 76, 60, 0.6)',
                  }
                }}>
                <Typography variant="h4">🏆</Typography>
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'inherit' }}>
                  {t.challenges || 'Challenges de Trading'}
                </Typography>
                <Typography color="text.secondary" paragraph sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {t.challengesDescription || 'Relevez des défis de trading pour prouver vos compétences et gagner des fonds pour trader avec de l\'argent réel.'}
                </Typography>
                <Box sx={{ mt: 2, textAlign: 'left', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'inherit', fontWeight: 600 }}>
                    {t.askAIAssistant || 'Posez votre question à l\'assistant IA'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.profitabilityChallenge || 'Défi de rentabilité'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.riskManagementChallenge || 'Défi de risque maîtrisé'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.consistencyChallenge || 'Défi de cohérence'}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.dailyChallenges || 'Challenges quotidiens'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    • {t.realCapitalAccess || 'Accès au capital réel'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 12, bgcolor: 'background.default', position: 'relative' }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 30%), radial-gradient(circle at 50% 100%, rgba(255,255,255,0.02) 0%, transparent 30%)',
        }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" align="center" gutterBottom sx={{ mb: 8, fontWeight: 600, color: 'common.white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            {t.howItWorks || 'How it works?'}
          </Typography>
          
          <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
            {/* Connecting line */}
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: { md: '15%' },
              right: { md: '15%' },
              height: '2px',
              bgcolor: 'grey.300',
              zIndex: 0,
              display: { xs: 'none', md: 'block' },
              opacity: 0.5
            }}>
              <Box
                sx={{
                  height: '100%',
                  width: activeStep === 0 ? '0%' : activeStep === 1 ? '50%' : '100%',
                  background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
                  transition: 'width 1s ease-in-out',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: '-4px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: 'linear-gradient(145deg, #00c6ff, #0072ff)',
                    transform: 'translateY(50%)',
                    transition: 'right 1s ease-in-out',
                    boxShadow: '0 0 10px rgba(0, 198, 255, 0.7)'
                  }}
                  style={{ right: activeStep === 0 ? '0%' : activeStep === 1 ? '50%' : '100%' }}
                />
              </Box>
            </Box>
            
            <Grid item xs={12} md={4} sx={{ position: 'relative', zIndex: 1 }}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
                    transform: activeStep === 0 ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.6s ease',
                  },
                  '&:hover:before': {
                    transform: 'scaleX(1)',
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                    backgroundColor: 'rgba(0, 198, 255, 0.05)',
                  },
                  transform: activeStep === 0 ? 'translateY(-8px)' : 'none',
                  boxShadow: activeStep === 0 ? '0 20px 40px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
                  cursor: 'pointer',
                  background: 'linear-gradient(145deg, #e3f2fd, #bbdefb)',
                  color: 'text.primary',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={() => {
                  navigate('/dashboard');
                }}
              >
                <Box sx={{ 
                  fontSize: '2.5rem', 
                  mb: 2, 
                  color: '#0072ff',
                  animation: activeStep === 0 ? 'pulse 1.5s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'scale(1)',
                      textShadow: '0 0 5px rgba(0, 114, 255, 0.5)',
                    },
                    '50%': {
                      transform: 'scale(1.1)',
                      textShadow: '0 0 15px rgba(0, 114, 255, 0.8)',
                    },
                    '100%': {
                      transform: 'scale(1)',
                      textShadow: '0 0 5px rgba(0, 114, 255, 0.5)',
                    },
                  }
                }}>1</Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#0072ff' }}>
                  {t.startFreeTrial || 'Start your free trial'}
                </Typography>
                <Typography color="text.secondary">
                  {t.createAccountAndConnect || 'Create an account and connect to our platform.'}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                    🔐 Secure Registration
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4} sx={{ position: 'relative', zIndex: 1 }}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #00d2ff, #3a7bd5)',
                    transform: activeStep === 1 ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.6s ease',
                  },
                  '&:hover:before': {
                    transform: 'scaleX(1)',
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                    backgroundColor: 'rgba(58, 123, 213, 0.05)',
                  },
                  transform: activeStep === 1 ? 'translateY(-8px)' : 'none',
                  boxShadow: activeStep === 1 ? '0 20px 40px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
                  cursor: 'pointer',
                  background: 'linear-gradient(145deg, #e1f5fe, #b3e5fc)',
                  color: 'text.primary',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={() => {
                  navigate('/dashboard');
                }}
              >
                <Box sx={{ 
                  fontSize: '2.5rem', 
                  mb: 2, 
                  color: '#3a7bd5',
                  animation: activeStep === 1 ? 'pulse 1.5s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'scale(1)',
                      textShadow: '0 0 5px rgba(58, 123, 213, 0.5)',
                    },
                    '50%': {
                      transform: 'scale(1.1)',
                      textShadow: '0 0 15px rgba(58, 123, 213, 0.8)',
                    },
                    '100%': {
                      transform: 'scale(1)',
                      textShadow: '0 0 5px rgba(58, 123, 213, 0.5)',
                    },
                  }
                }}>2</Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#3a7bd5' }}>
                  {t.configureYourStrategy || 'Configure your strategy'}
                </Typography>
                <Typography color="text.secondary">
                  {t.setParametersAndRules || 'Set your parameters and trading rules.'}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                    ⚙️ Custom Settings
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4} sx={{ position: 'relative', zIndex: 1 }}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #00b09b, #96c93d)',
                    transform: activeStep === 2 ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.6s ease',
                  },
                  '&:hover:before': {
                    transform: 'scaleX(1)',
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                    backgroundColor: 'rgba(0, 176, 155, 0.05)',
                  },
                  transform: activeStep === 2 ? 'translateY(-8px)' : 'none',
                  boxShadow: activeStep === 2 ? '0 20px 40px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
                  cursor: 'pointer',
                  background: 'linear-gradient(145deg, #e8f5e8, #c8e6c9)',
                  color: 'text.primary',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={() => {
                  navigate('/dashboard');
                }}
              >
                <Box sx={{ 
                  fontSize: '2.5rem', 
                  mb: 2, 
                  color: '#00b09b',
                  animation: activeStep === 2 ? 'pulse 1.5s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'scale(1)',
                      textShadow: '0 0 5px rgba(0, 176, 155, 0.5)',
                    },
                    '50%': {
                      transform: 'scale(1.1)',
                      textShadow: '0 0 15px rgba(0, 176, 155, 0.8)',
                    },
                    '100%': {
                      transform: 'scale(1)',
                      textShadow: '0 0 5px rgba(0, 176, 155, 0.5)',
                    },
                  }
                }}>3</Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#00b09b' }}>
                  {t.monitorAndAnalyze || 'Monitor and analyze'}
                </Typography>
                <Typography color="text.secondary">
                  {t.trackPerformanceAndResults || 'Track your performance and results.'}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                    📊 Live Analytics
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Pricing Preview Section */}
      <Box sx={{ py: 12, bgcolor: 'background.default', position: 'relative' }}>
        <Box sx={
          {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'radial-gradient(circle at 80% 10%, rgba(255,255,255,0.02) 0%, transparent 20%), radial-gradient(circle at 20% 90%, rgba(255,255,255,0.02) 0%, transparent 20%)',
        }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" align="center" gutterBottom sx={{ mb: 8, fontWeight: 600, color: 'common.white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            {t.pricing || 'Pricing'}
          </Typography>
                
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4} sm={6}>
              <Card 
                sx={{ 
                  height: '100%', 
                  p: 4, 
                  textAlign: 'center',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    background: 'linear-gradient(145deg, #4CAF50, #2E7D32)',
                    color: 'white',
                  },
                  position: 'relative',
                  overflow: 'visible',
                  cursor: 'pointer',
                  background: 'linear-gradient(145deg, #e8f5e8, #c8e6c9)',
                  color: 'text.primary',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={() => handlePlanSelect({
                  id: 1,
                  name: 'Starter',
                  price: '200 DH',
                  description: 'Access to basic features for beginners'
                })}
              >
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(46, 125, 50, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2,
                  color: '#2e7d32',
                  border: '2px solid rgba(46, 125, 50, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 0 20px rgba(46, 125, 50, 0.4)',
                  }
                }}>
                <Typography variant="h4">🌱</Typography>
                </Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#2e7d32' }}>
                  {t.starter || 'Starter'}
                </Typography>
                <Typography variant="h3" color="#2e7d32" gutterBottom>
                  200 DH
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t.perMonth || 'per month'}
                </Typography>
                <Box sx={{ my: 3 }}>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    • {t.basicCharts || 'Access to basic charts'}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    • {t.fiveAISignals || '5 AI signals per day'}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    • {t.emailSupport || 'Email support'}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    • {t.oneTradingChallenge || '1 trading challenge'}
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  color="success"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelect({
                      id: 1,
                      name: 'Starter',
                      price: '200 DH',
                      description: 'Access to basic features for beginners'
                    });
                  }}
                  sx={{ mt: 2 }}
                >
                  {t.getStarted || 'Get Started'}
                </Button>
              </Card>
            </Grid>
                  
            <Grid item xs={12} md={4} sm={6}>
              <Card 
                sx={{ 
                  height: '100%', 
                  p: 4, 
                  textAlign: 'center',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    background: 'linear-gradient(145deg, #FFB74D, #EF6C00)',
                    color: 'white',
                  },
                  position: 'relative',
                  overflow: 'visible',
                  cursor: 'pointer',
                  background: 'linear-gradient(145deg, #fff3e0, #ffe0b2)',
                  color: 'text.primary',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={() => handlePlanSelect({
                  id: 2,
                  name: 'Pro',
                  price: '500 DH',
                  description: 'Access to advanced features for serious traders'
                })}
              >
                <Box sx={{ 
                  position: 'absolute', 
                  top: -12, 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  bgcolor: '#ef6c00',
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: 10,
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  {t.popular || 'POPULAR'}
                </Box>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(239, 108, 0, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2,
                  color: '#ef6c00',
                  border: '2px solid rgba(239, 108, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 0 20px rgba(239, 108, 0, 0.4)',
                  }
                }}>
                <Typography variant="h4">🔥</Typography>
                </Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#ef6c00' }}>
                  {t.pro || 'Pro'}
                </Typography>
                <Typography variant="h3" color="#ef6c00" gutterBottom>
                  500 DH
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t.perMonth || 'per month'}
                </Typography>
                <Box sx={{ my: 3 }}>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    • {t.allStarterBenefits || 'All Starter benefits'}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    • {t.unlimitedAISignals || 'Unlimited AI signals'}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    • {t.prioritySupport || 'Priority support'}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    • {t.fiveTradingChallenges || '5 trading challenges'}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    • {t.advancedTechnicalAnalysis || 'Advanced technical analysis'}
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  color="warning"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelect({
                      id: 2,
                      name: 'Pro',
                      price: '500 DH',
                      description: 'Access to advanced features for serious traders'
                    });
                  }}
                  sx={{ mt: 2 }}
                >
                  {t.bestValue || 'Best Value'}
                </Button>
              </Card>
            </Grid>
                  
            <Grid item xs={12} md={4} sm={6}>
              <Card 
                sx={{ 
                  height: '100%', 
                  p: 4, 
                  textAlign: 'center',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    background: 'linear-gradient(145deg, #BA68C8, #7B1FA2)',
                    color: 'white',
                  },
                  position: 'relative',
                  overflow: 'visible',
                  cursor: 'pointer',
                  background: 'linear-gradient(145deg, #f3e5f5, #e1bee7)',
                  color: 'text.primary',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={() => handlePlanSelect({
                  id: 3,
                  name: 'Elite',
                  price: '1000 DH',
                  description: 'Premium features for professional traders'
                })}
              >
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(123, 31, 162, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2,
                  color: '#7b1fa2',
                  border: '2px solid rgba(123, 31, 162, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 0 20px rgba(123, 31, 162, 0.4)',
                  }
                }}>
                <Typography variant="h4">👑</Typography>
                </Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#7b1fa2' }}>
                  {t.elite || 'Elite'}
                </Typography>
                <Typography variant="h3" color="#7b1fa2" gutterBottom>
                  1000 DH
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t.perMonth || 'per month'}
                </Typography>
                <Box sx={{ my: 3 }}>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    • {t.allProBenefits || 'All Pro benefits'}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    • {t.earlyAccess || 'Early access to new features'}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    • {t.personalCoaching || 'Personal coaching session'}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    • {t.vipCommunity || 'VIP community access'}
                  </Typography>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    • {t.realTimeAISignals || 'Real-time AI signals'}
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelect({
                      id: 3,
                      name: 'Elite',
                      price: '1000 DH',
                      description: 'Premium features for professional traders'
                    });
                  }}
                  sx={{ mt: 2 }}
                >
                  {t.goPremium || 'Go Premium'}
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Trading Statistics and Market News Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default', position: 'relative' }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.02) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.02) 0%, transparent 20%)',
        }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4}>
            {/* Trading Statistics */}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  background: 'linear-gradient(145deg, #2c3e50, #1e3c72)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  height: '100%'
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'common.white', mb: 3 }}>
                  Statistiques de Trading
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Positions Ouvertes
                      </Typography>
                      <Typography variant="h4" color="primary.light" fontWeight="bold">
                        3
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Gains/Pertes
                      </Typography>
                      <Typography variant="h4" color="success.light" fontWeight="bold">
                        +125.30 USD
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Taux de Réussite
                      </Typography>
                      <Typography variant="h4" color="warning.light" fontWeight="bold">
                        78%
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Volatilité
                      </Typography>
                      <Typography variant="h4" color="info.light" fontWeight="bold">
                        Moyenne
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            
            {/* Market News */}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  p: 3, 
                  background: 'linear-gradient(145deg, #2c3e50, #1e3c72)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  height: '100%'
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'common.white', mb: 3 }}>
                  Dernières Nouvelles du Marché
                </Typography>
                
                <List sx={{ py: 0 }}>
                  <ListItem sx={{ py: 1.5, '&:not(:last-child)': { borderBottom: '1px solid rgba(255,255,255,0.1)' } }}>
                    <ListItemText 
                      primary="La Fed décide de suspendre la hausse des taux pour le moment" 
                      secondary="il y a 2 heures" 
                      primaryTypographyProps={{ sx: { color: 'common.white', fontWeight: 500 } }}
                      secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ py: 1.5, '&:not(:last-child)': { borderBottom: '1px solid rgba(255,255,255,0.1)' } }}>
                    <ListItemText 
                      primary="IAM affiche une progression de 5% au cours du dernier trimestre" 
                      secondary="il y a 4 heures" 
                      primaryTypographyProps={{ sx: { color: 'common.white', fontWeight: 500 } }}
                      secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ py: 1.5 }}>
                    <ListItemText 
                      primary="Nouvelle réglementation pour les cryptomonnaies en Europe" 
                      secondary="il y a 6 heures" 
                      primaryTypographyProps={{ sx: { color: 'common.white', fontWeight: 500 } }}
                      secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                    />
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 12, bgcolor: 'background.paper', position: 'relative' }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'radial-gradient(circle at 10% 80%, rgba(255,255,255,0.03) 0%, transparent 20%), radial-gradient(circle at 90% 20%, rgba(255,255,255,0.03) 0%, transparent 20%)',
        }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" align="center" gutterBottom sx={{ mb: 8, fontWeight: 600, color: 'common.white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            {t.testimonials || 'What Our Traders Say'}
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4} sm={6}>
              <Card 
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    background: 'linear-gradient(145deg, #82aaff, #448aff)',
                    color: 'white',
                  },
                  position: 'relative',
                  overflow: 'visible',
                  cursor: 'pointer',
                  background: 'linear-gradient(145deg, #e3f2fd, #bbdefb)',
                  color: 'text.primary',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={() => navigate('/dashboard')}
              >
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(25, 118, 210, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2,
                  color: '#1976d2',
                  border: '2px solid rgba(25, 118, 210, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 0 20px rgba(25, 118, 210, 0.4)',
                  }
                }}>
                <Typography variant="h4">⭐</Typography>
                </Box>
                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 3, color: 'text.primary' }}>
                  "{t.firstTestimonial || 'The AI trading signals helped me improve my decision-making process significantly. Within 3 months, I passed my first challenge and received my funded account.'}"
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                  {t.alexJohnson || 'Alex Johnson'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.professionalTrader || 'Professional Trader'}
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4} sm={6}>
              <Card 
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    background: 'linear-gradient(145deg, #d1c4e9, #b39ddb)',
                    color: 'white',
                  },
                  position: 'relative',
                  overflow: 'visible',
                  cursor: 'pointer',
                  background: 'linear-gradient(145deg, #f3e5f5, #e1bee7)',
                  color: 'text.primary',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={() => navigate('/dashboard')}
              >
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(123, 31, 162, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2,
                  color: '#7b1fa2',
                  border: '2px solid rgba(123, 31, 162, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 0 20px rgba(123, 31, 162, 0.4)',
                  }
                }}>
                <Typography variant="h4">⭐</Typography>
                </Box>
                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 3, color: 'text.primary' }}>
                  "{t.secondTestimonial || 'The risk management tools are exceptional. I was able to practice consistently without blowing my account. The platform really prepares you for real trading.'}"
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#7b1fa2' }}>
                  {t.sarahChen || 'Sarah Chen'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.dayTrader || 'Day Trader'}
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4} sm={6}>
              <Card 
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    background: 'linear-gradient(145deg, #a5d6a7, #81c784)',
                    color: 'white',
                  },
                  position: 'relative',
                  overflow: 'visible',
                  cursor: 'pointer',
                  background: 'linear-gradient(145deg, #e8f5e8, #c8e6c9)',
                  color: 'text.primary',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={() => navigate('/dashboard')}
              >
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(46, 125, 50, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2,
                  color: '#2e7d32',
                  border: '2px solid rgba(46, 125, 50, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 0 20px rgba(46, 125, 50, 0.4)',
                  }
                }}>
                <Typography variant="h4">⭐</Typography>
                </Box>
                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 3, color: 'text.primary' }}>
                  "{t.thirdTestimonial || 'Passed my second challenge last month and got promoted to a $50k funded account. The training curriculum is comprehensive and well-structured.'}"
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                  {t.michaelRodriguez || 'Michael Rodriguez'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.propTrader || 'Prop Trader'}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Error/Success Messages */}
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

      {/* Purchase Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {t.confirmPurchase || 'Confirm Purchase'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {t.confirmPurchaseMessage ? t.confirmPurchaseMessage.replace('{plan}', selectedPlan?.name) : `Are you sure you want to purchase the ${selectedPlan?.name} challenge?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loading}>
            {t.cancel || 'Cancel'}
          </Button>
          <Button 
            onClick={confirmPurchase} 
            variant="contained" 
            disabled={loading}
            color="primary"
          >
            {loading ? <CircularProgress size={24} /> : (t.buy || 'Buy')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* AI Algorithms Details Modal */}
      <Dialog open={showAIDetails} onClose={() => setShowAIDetails(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedAIAlgorithm === 'trading_signals' ? (t.preciseTradingSignals || 'Signaux de Trading Précis') : selectedAIAlgorithm === 'news_feed' ? (t.latestFinancialNews || 'Dernières Nouvelles Financières') : selectedAIAlgorithm === 'community' ? (t.communityZone || 'Zone Communautaire') : selectedAIAlgorithm === 'courses' ? (t.masterClass || 'MasterClass de Trading') : selectedAIAlgorithm === 'challenges' ? (t.challenges || 'Challenges de Trading') : (t.advancedAI || 'Advanced Artificial Intelligence')}
        </DialogTitle>
        <DialogContent>
          {selectedAIAlgorithm === 'trading_signals' ? (
            <Box>
              <Typography variant="h6" gutterBottom>{t.realTimeSignals || 'Signaux de Trading en Temps Réel'}</Typography>
              <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: '#e8f5e8', color: 'green' }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Actif:</strong> AAPL<br/>
                  <strong>Action:</strong> BUY<br/>
                  <strong>Confiance:</strong> 85%<br/>
                  <strong>Raison:</strong> RSI divergence haussière
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Analyse Technique:</strong> L'indice de Force Relative montre un modèle de divergence haussière où le prix fait des plus bas tandis que le RSI fait des plus hauts, indiquant un potentiel retournement à la hausse.
                </Typography>
                <Typography variant="body2">
                  <strong>Prix cible:</strong> $165.50 | <strong>Stop Loss:</strong> $145.00 | <strong>Horizon:</strong> Short-term
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: '#ffe8e8', color: 'red' }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Actif:</strong> TSLA<br/>
                  <strong>Action:</strong> SELL<br/>
                  <strong>Confiance:</strong> 78%<br/>
                  <strong>Raison:</strong> Conditions de surachats
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Analyse Technique:</strong> Le prix se négocie au-dessus de la bande supérieure de Bollinger avec un RSI supérieur à 70, indiquant des conditions de surachat et un potentiel de correction.
                </Typography>
                <Typography variant="body2">
                  <strong>Prix cible:</strong> $220.00 | <strong>Stop Loss:</strong> $265.00 | <strong>Horizon:</strong> Medium-term
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 2, backgroundColor: '#e8f5e8', color: 'green' }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Actif:</strong> IAM<br/>
                  <strong>Action:</strong> BUY<br/>
                  <strong>Confiance:</strong> 92%<br/>
                  <strong>Raison:</strong> Maintien du niveau de support
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Analyse Technique:</strong> Le prix a trouvé un solide support au niveau de 78.00 avec un volume croissant sur le rebond, suggérant un accumulation institutionnelle.
                </Typography>
                <Typography variant="body2">
                  <strong>Prix cible:</strong> $82.50 | <strong>Stop Loss:</strong> $75.00 | <strong>Horizon:</strong> Medium-term
                </Typography>
              </Paper>
            </Box>
          ) : selectedAIAlgorithm === 'news_feed' ? (
            <Box>
              <Typography variant="h6" gutterBottom>{t.latestFinancialNews || 'Dernières Nouvelles Financières'}</Typography>
              <Paper elevation={2} sx={{ p: 3, mb: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  La Fed décide de suspendre la hausse des taux pour le moment
                </Typography>
                <Typography variant="body2" gutterBottom>
                  La Fed décide de suspendre la hausse des taux pour le moment
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Economy • Reuters • 2h auparavant
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 3, mb: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  IAM affiche une progression de 5% au cours du dernier trimestre
                </Typography>
                <Typography variant="body2" gutterBottom>
                  IAM affiche une progression de 5% au cours du dernier trimestre
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Markets • Bloomberg • 4h auparavant
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Nouvelle réglementation pour les cryptomonnaies en Europe
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Nouvelle réglementation pour les cryptomonnaies en Europe
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Crypto • Financial Times • 6h auparavant
                </Typography>
              </Paper>
            </Box>
          ) : selectedAIAlgorithm === 'community' ? (
            <Box>
              <Typography variant="h6" gutterBottom>{t.zoneCommunity || 'Zone Communautaire'}</Typography>
              <Paper elevation={2} sx={{ p: 3, mb: 2, backgroundColor: '#fff3e0' }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'orange' }}>
                  Partagez vos stratégies
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Échangez vos stratégies de trading avec d'autres membres de la communauté et collaborez pour améliorer vos performances.
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 3, mb: 2, backgroundColor: '#fff3e0' }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'orange' }}>
                  Discussions sur le marché
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Participez aux discussions en temps réel sur les tendances du marché, les analyses techniques et les événements économiques.
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 3, backgroundColor: '#fff3e0' }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'orange' }}>
                  Experts disponibles
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Accédez à des traders professionnels et des analystes experts pour poser vos questions et recevoir des conseils personnalisés.
                </Typography>
              </Paper>
            </Box>
          ) : selectedAIAlgorithm === 'courses' ? (
            <Box>
              <Typography variant="h6" gutterBottom>{t.masterClass || 'MasterClass de Trading'}</Typography>
              <Paper elevation={2} sx={{ p: 3, mb: 2, backgroundColor: '#e3f2fd' }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'blue' }}>
                  Stratégies de trading éprouvées
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Découvrez des stratégies de trading éprouvées et testées par des professionnels du marché.
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 3, mb: 2, backgroundColor: '#e3f2fd' }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'blue' }}>
                  Analyse technique avancée
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Maîtrisez les outils d'analyse technique pour identifier les tendances et les points d'entrée optimaux.
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 3, mb: 2, backgroundColor: '#e3f2fd' }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'blue' }}>
                  Gestion des risques
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Apprenez à gérer efficacement le risque pour protéger votre capital et optimiser vos rendements.
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 3, mb: 2, backgroundColor: '#e3f2fd' }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'blue' }}>
                  Psychologie du trading
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Développez la discipline mentale nécessaire pour prendre des décisions rationnelles sous pression.
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 3, backgroundColor: '#e3f2fd' }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'blue' }}>
                  Accès aux experts
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Bénéficiez de l'expertise de traders professionnels par le biais de sessions de mentorat exclusives.
                </Typography>
              </Paper>
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => {
                    navigate('/training-courses');
                    setShowAIDetails(false);
                  }}
                >
                  {t.goToTrainingCourses || 'Accéder aux formations'}
                </Button>
              </Box>
            </Box>
          ) : selectedAIAlgorithm === 'challenges' ? (
            <Box>
              <Typography variant="h6" gutterBottom>{t.challenges || 'Challenges de Trading'}</Typography>
              <Paper elevation={2} sx={{ p: 3, mb: 2, backgroundColor: '#fce4ec' }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'pink' }}>
                  Défi de rentabilité
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Mettez vos compétences à l'épreuve en atteignant des objectifs de rentabilité spécifiques dans un environnement simulé.
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 3, mb: 2, backgroundColor: '#fce4ec' }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'pink' }}>
                  Défi de risque maîtrisé
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Démontrez votre capacité à gérer le risque tout en maintenant des performances positives.
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 3, mb: 2, backgroundColor: '#fce4ec' }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'pink' }}>
                  Défi de cohérence
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Prouvez votre aptitude à générer des résultats stables sur une période prolongée.
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 3, mb: 2, backgroundColor: '#fce4ec' }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'pink' }}>
                  Challenges quotidiens
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Participez à des défis quotidiens pour perfectionner vos compétences en temps réel.
                </Typography>
              </Paper>
              <Paper elevation={2} sx={{ p: 3, backgroundColor: '#fce4ec' }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'pink' }}>
                  Accès au capital réel
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Réussissez les challenges pour obtenir un compte réel avec du capital à risquer.
                </Typography>
              </Paper>
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button 
                  variant="contained" 
                  color="secondary"
                  onClick={() => {
                    navigate('/challenges');
                    setShowAIDetails(false);
                  }}
                >
                  {t.takeChallenge || 'Participer aux Challenges'}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                {t.howItWorks || 'How it Works:'}
              </Typography>
              <Typography variant="body1" paragraph>
                {t.aiDetailedExplanation || 'Our AI system continuously analyzes market data, news, social sentiment, and technical indicators to generate accurate trading signals in real-time.'}
              </Typography>
              
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                {t.aiAlgorithms || 'AI Algorithms:'}
              </Typography>
              
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>{t.machineLearningModels || 'Machine Learning Models'}:</strong> {t.mlModelsDescription || 'These models analyze historical market data to identify patterns and predict future price movements.'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>{t.neuralNetworks || 'Neural Networks'}:</strong> {t.neuralNetworksDescription || 'Deep learning networks that mimic human brain processes to recognize complex patterns in market data.'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>{t.patternRecognition || 'Pattern Recognition'}:</strong> {t.patternRecognitionDescription || 'Identifies recurring price patterns and chart formations to predict future market movements.'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>{t.predictiveAnalytics || 'Predictive Analytics'}:</strong> {t.predictiveAnalyticsDescription || 'Uses statistical techniques to predict future outcomes based on historical and current market data.'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>{t.sentimentAnalysis || 'Sentiment Analysis'}:</strong> {t.sentimentAnalysisDescription || 'Analyzes news articles, social media, and financial reports to gauge market sentiment.'}
                </Typography>
              </Box>
              
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                {t.realTimeAnalysis || 'Real-time Analysis:'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {t.realTimeAnalysisDescription || 'Our system processes millions of data points every second to provide up-to-date trading signals and recommendations.'}
              </Typography>
              
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                {t.accuracyMetrics || 'Accuracy Metrics:'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {t.accuracyMetricsDescription || 'Our AI models maintain an average accuracy rate of 85-90% for short-term predictions and 75-80% for medium-term forecasts.'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAIDetails(false)}>
            {t.close || 'Close'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Footer */}
      <Box sx={{ 
        py: 6, 
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          opacity: 0.9,
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h6" color="common.white" sx={{ fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                TradeSense AI
              </Typography>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/" color="grey.200" underline="hover" sx={{ transition: 'color 0.3s ease', '&:hover': { color: '#64b5f6' } }}>
                  {t.about || 'About'}
                </Link>
                <Link href="/pricing" color="grey.200" underline="hover" sx={{ transition: 'color 0.3s ease', '&:hover': { color: '#64b5f6' } }}>
                  {t.pricing || 'Pricing'}
                </Link>
                <Link href="/" color="grey.200" underline="hover" sx={{ transition: 'color 0.3s ease', '&:hover': { color: '#64b5f6' } }}>
                  {t.contact || 'Contact'}
                </Link>
                <Link href="/" color="grey.200" underline="hover" sx={{ transition: 'color 0.3s ease', '&:hover': { color: '#64b5f6' } }}>
                  {t.terms || 'Terms'}
                </Link>
                <Link href="/" color="grey.200" underline="hover" sx={{ transition: 'color 0.3s ease', '&:hover': { color: '#64b5f6' } }}>
                  {t.privacy || 'Privacy'}
                </Link>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
            <Typography variant="body2" color="grey.200">
              © {new Date().getFullYear()} TradeSense AI. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
      <AIAssistant 
        isOpen={showAIAssistant} 
        onClose={() => setShowAIAssistant(false)} 
      />
    </Container>
    </div>
  );
};

export default LandingPage;
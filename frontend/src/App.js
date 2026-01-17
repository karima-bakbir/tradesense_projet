import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { UserProvider, useUserContext } from './contexts/UserContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import PlatformFeaturesPage from './pages/PlatformFeaturesPage';
import PaymentPage from './pages/PaymentPage';
import Leaderboard from './pages/Leaderboard';
import AdminPanel from './pages/AdminPanel';
import Auth from './pages/Auth';
import ChallengesPage from './pages/ChallengesPage';
import LanguageToggle from './components/LanguageToggle';
import ThemeToggle from './components/ThemeToggle';
import TrainingCourses from './pages/TrainingCourses';
import CourseContent from './pages/CourseContent';
import TradeHistoryPage from './pages/TradeHistoryPage';
import DebugView from './pages/DebugView';
import NewsFeedPage from './pages/NewsFeedPage';
import TradingStrategiesPage from './pages/TradingStrategiesPage';
import MarketDiscussionsPage from './pages/MarketDiscussionsPage';
import ExpertsAvailablePage from './pages/ExpertsAvailablePage';
import CommunityHubPage from './pages/CommunityHubPage';
import ChartPage from './pages/ChartPage';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
  marginBottom: theme.spacing(4),
}));

const AppWithProvider = () => {
  return (
    <UserProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </UserProvider>
  );
};

const AppContent = () => {
  const { t } = useAppContext();
  const { user, isAuthenticated, logout } = useUserContext();
  
  // State for dropdown menus
  const [platformMenuAnchor, setPlatformMenuAnchor] = useState(null);
  const [communityMenuAnchor, setCommunityMenuAnchor] = useState(null);
  const [learningMenuAnchor, setLearningMenuAnchor] = useState(null);
  
  const handleLogout = () => {
    logout();
  };
  
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
  
  return (
    <Router>
      <div className="App">
        <StyledAppBar position="static">
          <Toolbar>
            <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
              TradeSense AI
            </Typography>
            
            {/* Platform Features Dropdown */}
            <Button
              color="inherit"
              aria-controls="platform-menu"
              aria-haspopup="true"
              onClick={handlePlatformMenuOpen}
            >
              {t.platformFeatures || 'Platform'}
            </Button>
            <Menu
              id="platform-menu"
              anchorEl={platformMenuAnchor}
              open={Boolean(platformMenuAnchor)}
              onClose={handlePlatformMenuClose}
            >
              <MenuItem component={Link} to="/" onClick={handlePlatformMenuClose}>{t.home}</MenuItem>
              <MenuItem component={Link} to="/dashboard" onClick={handlePlatformMenuClose}>{t.dashboard}</MenuItem>
              <MenuItem component={Link} to="/trade-history" onClick={handlePlatformMenuClose}>{t.tradeHistory || 'Trade History'}</MenuItem>
              <MenuItem component={Link} to="/leaderboard" onClick={handlePlatformMenuClose}>{t.leaderboard}</MenuItem>
              <MenuItem component={Link} to="/pricing" onClick={handlePlatformMenuClose}>{t.pricing}</MenuItem>
              <MenuItem component={Link} to="/chart" onClick={handlePlatformMenuClose}>{t.chart || 'Chart'}</MenuItem>
              <MenuItem component={Link} to="/news-feed" onClick={handlePlatformMenuClose}>{t.newsHub || 'News Feed'}</MenuItem>
            </Menu>
            
            {/* Community Dropdown */}
            <Button
              color="inherit"
              aria-controls="community-menu"
              aria-haspopup="true"
              onClick={handleCommunityMenuOpen}
            >
              {t.community || 'Community'}
            </Button>
            <Menu
              id="community-menu"
              anchorEl={communityMenuAnchor}
              open={Boolean(communityMenuAnchor)}
              onClose={handleCommunityMenuClose}
            >
              <MenuItem component={Link} to="/community-hub" onClick={handleCommunityMenuClose}>{t.zoneCommunautaire || 'Community Hub'}</MenuItem>
              <MenuItem component={Link} to="/trading-strategies" onClick={handleCommunityMenuClose}>{t.tradingStrategies || 'Trading Strategies'}</MenuItem>
              <MenuItem component={Link} to="/market-discussions" onClick={handleCommunityMenuClose}>{t.marketDiscussions || 'Market Discussions'}</MenuItem>
              <MenuItem component={Link} to="/experts-available" onClick={handleCommunityMenuClose}>{t.availableExperts || 'Experts Available'}</MenuItem>
            </Menu>
            
            {/* Learning Dropdown */}
            <Button
              color="inherit"
              aria-controls="learning-menu"
              aria-haspopup="true"
              onClick={handleLearningMenuOpen}
            >
              {t.learning || 'Learning'}
            </Button>
            <Menu
              id="learning-menu"
              anchorEl={learningMenuAnchor}
              open={Boolean(learningMenuAnchor)}
              onClose={handleLearningMenuClose}
            >
              <MenuItem component={Link} to="/training-courses" onClick={handleLearningMenuClose}>{t.trainingCourses || 'Training Courses'}</MenuItem>
              <MenuItem component={Link} to="/challenges" onClick={handleLearningMenuClose}>{t.challenges || 'Trading Challenges'}</MenuItem>
            </Menu>
            
            {/* Admin and Debug - separate buttons */}
            <Button color="inherit" component={Link} to="/admin">{t.admin}</Button>
            <Button color="inherit" component={Link} to="/debug">Debug</Button>
            
            {isAuthenticated ? (
              <Box>
                <Button color="inherit" component={Link} to="#" disabled>
                  Welcome, {user?.username || user?.email}
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  {t.logout || 'Logout'}
                </Button>
              </Box>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  {t.login || 'Login'}
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  {t.register || 'Register'}
                </Button>
              </>
            )}
            <ThemeToggle />
            <LanguageToggle />
          </Toolbar>
        </StyledAppBar>

        <Container maxWidth="false" sx={{ mt: 0, mb: 4 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/pricing" element={<Payment />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/trade-history" element={<TradeHistoryPage />} />
            <Route path="/trade-history/:challengeId" element={<TradeHistoryPage />} />
            <Route path="/platform-features" element={<PlatformFeaturesPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/training-courses" element={<TrainingCourses />} />
                        <Route path="/course-content/:courseId" element={<CourseContent />} />
                        <Route path="/course-content" element={<CourseContent />} />
                                    <Route path="/debug" element={<DebugView />} />
                        <Route path="/news-feed" element={<NewsFeedPage />} />
                                      <Route path="/trading-strategies" element={<TradingStrategiesPage />} />
                                      <Route path="/market-discussions" element={<MarketDiscussionsPage />} />
                                      <Route path="/experts-available" element={<ExpertsAvailablePage />} />
                                                    <Route path="/community-hub" element={<CommunityHubPage />} />
                                                  <Route path="/chart" element={<ChartPage />} />
          </Routes>
        </Container>

        {/* Footer */}
        <footer style={{ backgroundColor: '#f5f5f5', padding: '2rem 0', marginTop: 'auto' }}>
          <Container maxWidth="lg">
            <div style={{ textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                © 2026 TradeSense AI. Tous droits réservés.
              </Typography>
              <div style={{ marginTop: '1rem' }}>
                <Button size="small" href="#privacy">Politique de confidentialité</Button>
                <Button size="small" href="#terms">Conditions d'utilisation</Button>
                <Button size="small" href="#contact">Contact</Button>
              </div>
            </div>
          </Container>
        </footer>
      </div>
    </Router>
  );
};

export default AppWithProvider;
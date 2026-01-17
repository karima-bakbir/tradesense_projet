import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const PlatformFeaturesPage = () => {
  const { t } = useAppContext();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          {t.completePlatform || 'Complete Platform'}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate(-1)}
        >
          {t.back || 'Back'}
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Advanced Charts Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={t.advancedCharts || 'Advanced Charts:'}
              titleTypographyProps={{ variant: 'h5', color: 'primary' }}
            />
            <CardContent>
              <Typography variant="body1">
                {t.advancedChartsDescription || 'Interactive charts with multiple timeframes, technical indicators, drawing tools, and real-time data visualization to help you analyze market trends effectively.'}
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {t.keyFeatures || 'Key Features:'}
                </Typography>
                <Typography variant="body2" component="div">
                  <ul>
                    <li>{t.multipleTimeFrames || 'Multiple timeframes'}</li>
                    <li>{t.technicalIndicators || 'Technical indicators'}</li>
                    <li>{t.drawingTools || 'Drawing tools'}</li>
                    <li>{t.realTimeData || 'Real-time data'}</li>
                    <li>{t.customizableLayout || 'Customizable layout'}</li>
                  </ul>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Signals Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={t.iaSignals || 'AI Signals:'}
              titleTypographyProps={{ variant: 'h5', color: 'primary' }}
            />
            <CardContent>
              <Typography variant="body1">
                {t.iaSignalsDescription || 'Real-time artificial intelligence signals based on machine learning algorithms that analyze market data, news sentiment, and technical indicators to generate accurate trading recommendations.'}
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {t.howItWorks || 'How it Works:'}
                </Typography>
                <Typography variant="body2" component="div">
                  <ul>
                    <li>{t.dataAnalysis || 'Continuous data analysis'}</li>
                    <li>{t.patternRecognition || 'Pattern recognition'}</li>
                    <li>{t.predictiveModeling || 'Predictive modeling'}</li>
                    <li>{t.confidenceScoring || 'Confidence scoring'}</li>
                    <li>{t.realTimeUpdates || 'Real-time updates'}</li>
                  </ul>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Portfolio Management Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={t.portfolioManagement || 'Portfolio Management:'}
              titleTypographyProps={{ variant: 'h5', color: 'primary' }}
            />
            <CardContent>
              <Typography variant="body1">
                {t.portfolioManagementDescription || 'Comprehensive tools to track your investments, monitor performance, set alerts, and analyze risk exposure across all your trading positions.'}
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {t.capabilities || 'Capabilities:'}
                </Typography>
                <Typography variant="body2" component="div">
                  <ul>
                    <li>{t.performanceTracking || 'Performance tracking'}</li>
                    <li>{t.riskAnalysis || 'Risk analysis'}</li>
                    <li>{t.allocationMonitoring || 'Allocation monitoring'}</li>
                    <li>{t.alertSystem || 'Alert system'}</li>
                    <li>{t.reportingTools || 'Reporting tools'}</li>
                  </ul>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Professional Trader Community Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={t.professionalTraderCommunity || 'Professional Trader Community:'}
              titleTypographyProps={{ variant: 'h5', color: 'primary' }}
            />
            <CardContent>
              <Typography variant="body1">
                {t.professionalTraderCommunityDescription || 'Connect with experienced traders, share strategies, participate in discussions, and learn from market experts in our exclusive community.'}
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'secondary.light', borderRadius: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {t.communityFeatures || 'Community Features:'}
                </Typography>
                <Typography variant="body2" component="div">
                  <ul>
                    <li>{t.strategySharing || 'Strategy sharing'}</li>
                    <li>{t.marketDiscussions || 'Market discussions'}</li>
                    <li>{t.educationalContent || 'Educational content'}</li>
                    <li>{t.expertInsights || 'Expert insights'}</li>
                    <li>{t.collaborativeLearning || 'Collaborative learning'}</li>
                  </ul>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Integration Benefits Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 4, bgcolor: 'primary.dark', color: 'white' }}>
            <Typography variant="h4" gutterBottom color="inherit">
              {t.integrationBenefits || 'Integration Benefits:'}
            </Typography>
            <Typography variant="h6" gutterBottom color="inherit">
              {t.unifiedExperience || 'Unified Experience:'}
            </Typography>
            <Typography variant="body1" paragraph color="inherit">
              {t.integrationBenefitsDescription || 'All features work seamlessly together, providing a unified experience where AI signals appear directly on charts, portfolio metrics update in real-time, and community insights integrate with your trading decisions.'}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom color="inherit">
                {t.seamlessIntegration || 'Seamless Integration:'}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                    <Typography variant="h6" color="inherit">✓</Typography>
                    <Typography variant="body2" color="inherit">{t.signalsOnCharts || 'Signals on Charts'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                    <Typography variant="h6" color="inherit">✓</Typography>
                    <Typography variant="body2" color="inherit">{t.liveMetrics || 'Live Metrics'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                    <Typography variant="h6" color="inherit">✓</Typography>
                    <Typography variant="body2" color="inherit">{t.communityInsights || 'Community Insights'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                    <Typography variant="h6" color="inherit">✓</Typography>
                    <Typography variant="body2" color="inherit">{t.decisionSupport || 'Decision Support'}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/dashboard')}
          sx={{ mr: 2 }}
        >
          {t.goToDashboard || 'Go to Dashboard'}
        </Button>
        <Button 
          variant="outlined" 
          size="large"
          onClick={() => navigate('/')}
        >
          {t.backToHome || 'Back to Home'}
        </Button>
      </Box>
    </Container>
  );
};

export default PlatformFeaturesPage;
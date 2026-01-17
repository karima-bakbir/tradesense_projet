import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { PlayArrow, LibraryBooks, VideoLibrary, Assignment } from '@mui/icons-material';
import { useAppContext } from '../contexts/AppContext';
import { useParams } from 'react-router-dom';

const CourseContent = () => {
  const { t } = useAppContext();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [enrolledCourse, setEnrolledCourse] = useState(null);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  // Course data based on courseId
  const courseData = {
    1: {
      id: 1,
      title: t.beginnerCourse,
      level: t.beginnerLevel,
      duration: '4h',
      lessons: 12,
      description: t.beginnerCourseDesc,
      color: 'secondary',
      videos: [
        { id: 'NeAlHGi5V4w', title: 'Step 1: What is Trading?', duration: '10:15', thumbnail: 'https://img.youtube.com/vi/NeAlHGi5V4w/maxresdefault.jpg', description: 'Understanding the fundamentals of trading and financial markets.' },
        { id: 'n5f2qcS6t7o', title: 'Step 2: Reading Price Charts', duration: '14:30', thumbnail: 'https://img.youtube.com/vi/n5f2qcS6t7o/maxresdefault.jpg', description: 'How to interpret candlestick and bar charts.' },
        { id: 'RfsW_qEVr4M', title: 'Step 3: Essential Risk Management', duration: '12:45', thumbnail: 'https://img.youtube.com/vi/RfsW_qEVr4M/maxresdefault.jpg', description: 'Protecting your capital with proper risk management.' },
        { id: 'mgMkSSZvrIA', title: 'Step 4: Setting Up Your First Account', duration: '8:20', thumbnail: 'https://img.youtube.com/vi/mgMkSSZvrIA/maxresdefault.jpg', description: 'Practical guide to opening and configuring your trading account.' },
        { id: 'aXeiZOW0Vd4', title: 'Step 5: Basic Trading Strategies', duration: '18:50', thumbnail: 'https://img.youtube.com/vi/aXeiZOW0Vd4/maxresdefault.jpg', description: 'Introduction to simple but effective trading strategies.' }
      ],
      materials: [
        { id: 1, title: 'Trading Basics PDF Guide', type: 'PDF', url: '/assets/trading-basics-guide.pdf' },
        { id: 2, title: 'Market Analysis Worksheet', type: 'Worksheet', url: '/assets/market-analysis-worksheet.pdf' },
        { id: 3, title: 'Glossary of Trading Terms', type: 'PDF', url: '/assets/trading-terms-glossary.pdf' },
        { id: 4, title: 'Practice Quiz Chapter 1', type: 'Quiz', url: '/assets/practice-quiz-chapter1.pdf' },
        { id: 5, title: 'Step 1: What is Trading?', type: 'PDF', url: '/assets/step1-what-is-trading.pdf' },
        { id: 6, title: 'Trading Journal Template', type: 'PDF', url: '/assets/trading-journal-template.pdf' },
        { id: 7, title: 'Trading Journal Template', type: 'Excel', url: '/assets/trading-journal-template.xlsx' }
      ]
    },
    2: {
      id: 2,
      title: t.advancedCourse,
      level: t.advancedLevel,
      duration: '6h',
      lessons: 18,
      description: t.advancedCourseDesc,
      color: 'primary',
      videos: [
        { id: 'lNUbdNgiAwg', title: 'Step 1: Advanced Chart Patterns', duration: '20:15', thumbnail: 'https://img.youtube.com/vi/lNUbdNgiAwg/maxresdefault.jpg', description: 'Identifying and trading advanced chart patterns.' },
        { id: '4J-abWVW8rM', title: 'Step 2: Building Trading Algorithms', duration: '25:30', thumbnail: 'https://img.youtube.com/vi/4J-abWVW8rM/maxresdefault.jpg', description: 'Creating your first algorithmic trading system.' },
        { id: '6V4X4DnsHqo', title: 'Step 3: Portfolio Construction', duration: '18:45', thumbnail: 'https://img.youtube.com/vi/6V4X4DnsHqo/maxresdefault.jpg', description: 'Building a diversified investment portfolio.' },
        { id: 'XzseKOfbg70', title: 'Step 4: Behavioral Finance', duration: '16:20', thumbnail: 'https://img.youtube.com/vi/XzseKOfbg70/maxresdefault.jpg', description: 'Understanding market psychology and behavioral biases.' },
        { id: 'uX7EU3vlB5M', title: 'Step 5: Advanced Risk Controls', duration: '22:10', thumbnail: 'https://img.youtube.com/vi/uX7EU3vlB5M/maxresdefault.jpg', description: 'Implementing sophisticated risk management techniques.' }
      ],
      materials: [
        { id: 1, title: 'Advanced Analysis Techniques', type: 'PDF', url: '/assets/advanced-analysis-techniques.pdf' },
        { id: 2, title: 'Algorithmic Trading Code Samples', type: 'Code', url: '/assets/algorithmic-trading-samples.zip' },
        { id: 3, title: 'Portfolio Optimization Models', type: 'Excel', url: '/assets/portfolio-optimization-models.xlsx' },
        { id: 4, title: 'Advanced Quiz Series', type: 'Quiz', url: '/assets/advanced-quiz-series.pdf' },
        { id: 5, title: 'Advanced Trading Strategies', type: 'PDF', url: '/assets/advanced-trading-strategies.pdf' },
        { id: 6, title: 'Risk Management in Advanced Trading', type: 'PDF', url: '/assets/risk-management-advanced.pdf' },
        { id: 7, title: 'Backtesting Framework', type: 'Excel', url: '/assets/backtesting-framework.xlsx' }
      ]
    },
    3: {
      id: 3,
      title: t.expertCourse,
      level: t.expertLevel,
      duration: '8h',
      lessons: 24,
      description: t.expertCourseDesc,
      color: 'success',
      videos: [
        { id: 'MXXzS4wj8Xs', title: 'Step 1: Quantitative Modeling', duration: '28:15', thumbnail: 'https://img.youtube.com/vi/MXXzS4wj8Xs/maxresdefault.jpg', description: 'Building mathematical models for market prediction.' },
        { id: 'pnpTJIlfEQ4', title: 'Step 2: High-Frequency Trading', duration: '32:40', thumbnail: 'https://img.youtube.com/vi/pnpTJIlfEQ4/maxresdefault.jpg', description: 'Understanding HFT systems and execution algorithms.' },
        { id: 'uX7EU3vlB5M', title: 'Step 3: Portfolio Optimization', duration: '26:30', thumbnail: 'https://img.youtube.com/vi/uX7EU3vlB5M/maxresdefault.jpg', description: 'Advanced portfolio construction techniques.' },
        { id: '7gF7bvQc2Cs', title: 'Step 4: Derivatives Pricing', duration: '30:25', thumbnail: 'https://img.youtube.com/vi/7gF7bvQc2Cs/maxresdefault.jpg', description: 'Understanding options and derivatives valuation.' },
        { id: 'XzseKOfbg70', title: 'Step 5: Market Microstructure', duration: '24:50', thumbnail: 'https://img.youtube.com/vi/XzseKOfbg70/maxresdefault.jpg', description: 'Understanding market mechanics and liquidity.' }
      ],
      materials: [
        { id: 1, title: 'Quantitative Models Reference', type: 'PDF', url: '/assets/quantitative-models-reference.pdf' },
        { id: 2, title: 'HFT Algorithm Implementation', type: 'Code', url: '/assets/hft-algorithm-implementation.zip' },
        { id: 3, title: 'Derivatives Pricing Calculator', type: 'Excel', url: '/assets/derivatives-pricing-calculator.xlsx' },
        { id: 4, title: 'Expert Certification Exam', type: 'Exam', url: '/assets/expert-certification-exam.pdf' },
        { id: 5, title: 'Mathematical Foundations', type: 'PDF', url: '/assets/mathematical-foundations.pdf' },
        { id: 6, title: 'Market Microstructure Analysis', type: 'PDF', url: '/assets/market-microstructure-analysis.pdf' },
        { id: 7, title: 'Statistical Arbitrage Models', type: 'Excel', url: '/assets/statistical-arbitrage-models.xlsx' }
      ]
    },
    4: {
      id: 4,
      title: t.specializedCourse,
      level: t.intermediateLevel,
      duration: '5h',
      lessons: 15,
      description: t.specializedCourseDesc,
      color: 'warning',
      videos: [
        { id: 'XkY4H-XrD8o', title: 'Step 1: Forex Market Basics', duration: '16:20', thumbnail: 'https://img.youtube.com/vi/XkY4H-XrD8o/maxresdefault.jpg', description: 'Understanding currency pairs and forex mechanics.' },
        { id: 'p5knhi9wXBg', title: 'Step 2: Options Trading', duration: '22:35', thumbnail: 'https://img.youtube.com/vi/p5knhi9wXBg/maxresdefault.jpg', description: 'Mastering options strategies and Greeks.' },
        { id: 'vY8ujMMxU30', title: 'Step 3: Crypto Trading', duration: '18:45', thumbnail: 'https://img.youtube.com/vi/vY8ujMMxU30/maxresdefault.jpg', description: 'Trading cryptocurrencies and digital assets.' },
        { id: 'jgN4071Mx9M', title: 'Step 4: Commodities Markets', duration: '15:30', thumbnail: 'https://img.youtube.com/vi/jgN4071Mx9M/maxresdefault.jpg', description: 'Trading physical goods and commodities.' },
        { id: 'U3Q1Lj0hzLI', title: 'Step 5: Arbitrage Strategies', duration: '24:15', thumbnail: 'https://img.youtube.com/vi/U3Q1Lj0hzLI/maxresdefault.jpg', description: 'Exploiting price differences across markets.' }
      ],
      materials: [
        { id: 1, title: 'Forex Trading Manual', type: 'PDF', url: '/assets/forex-trading-manual.pdf' },
        { id: 2, title: 'Options Strategy Templates', type: 'Template', url: '/assets/options-strategy-templates.xlsx' },
        { id: 3, title: 'Crypto Market Analysis Tools', type: 'Tools', url: '/assets/crypto-analysis-tools.zip' },
        { id: 4, title: 'Commodities Trading Guide', type: 'PDF', url: '/assets/commodities-trading-guide.pdf' },
        { id: 5, title: 'Currency Pair Analysis', type: 'PDF', url: '/assets/currency-pair-analysis.pdf' },
        { id: 6, title: 'Options Greeks Calculator', type: 'Excel', url: '/assets/options-greeks-calculator.xlsx' },
        { id: 7, title: 'Crypto Trading Strategies', type: 'PDF', url: '/assets/crypto-trading-strategies.pdf' }
      ]
    }
  };

  useEffect(() => {
    if (courseId) {
      const course = courseData[courseId];
      if (course) {
        setEnrolledCourse(course);
      } else {
        // Default to first course if no specific course is selected
        setEnrolledCourse(courseData[1]);
      }
    } else {
      // Default to first course
      setEnrolledCourse(courseData[1]);
    }
  }, [courseId]);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleCompleteCourse = () => {
    setShowCompletionDialog(true);
  };

  const handleCloseDialog = () => {
    setShowCompletionDialog(false);
  };

  if (!enrolledCourse) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" align="center">
          {t.courseNotFound || 'Course not found'}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3, backgroundColor: `${enrolledCourse.color}.light`, border: '2px solid', borderColor: `${enrolledCourse.color}.main` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" color={enrolledCourse.color} sx={{ mr: 2 }}>
            📘
          </Typography>
          <Box>
            <Typography variant="h4" fontWeight="bold" color={enrolledCourse.color}>
              {enrolledCourse.title}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {enrolledCourse.description}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          <Chip label={enrolledCourse.level} size="medium" color={enrolledCourse.color} />
          <Chip label={`${enrolledCourse.duration}`} size="medium" color="info" />
          <Chip label={`${enrolledCourse.lessons} ${t.lessons}`} size="medium" color="success" />
        </Box>
      </Paper>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label={t.learningMaterials || "Learning Materials"} icon={<LibraryBooks />} iconPosition="start" />
          <Tab label={t.courseContent || "Course Content"} icon={<VideoLibrary />} iconPosition="start" />
          <Tab label={t.courseProgress || "Progress"} icon={<Assignment />} iconPosition="start" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ color: enrolledCourse.color, mb: 3 }}>
            {t.learningMaterials || "Learning Materials"}
          </Typography>
          <List>
            {enrolledCourse.materials.map((material) => (
              <ListItem 
                key={material.id} 
                sx={{ 
                  borderBottom: '1px solid', 
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <ListItemText 
                  primary={material.title} 
                  secondary={material.type}
                />
                <Button variant="outlined" color="primary" href={material.url} target="_blank" download>
                  {t.download || "Download"}
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ color: enrolledCourse.color, mb: 3 }}>
            {t.courseContent || "Course Content"}
          </Typography>
          <List>
            {enrolledCourse.materials.map((material, index) => (
              <ListItem 
                key={index} 
                sx={{ 
                  borderBottom: '1px solid', 
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <ListItemText 
                  primary={`${index + 1}. ${material.title}`} 
                  secondary={material.type}
                />
                <Button variant="outlined" color="primary" href={material.url} target="_blank" download>
                  {t.download || "Download"}
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ color: enrolledCourse.color, mb: 3 }}>
            {t.courseProgress || "Course Progress"}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {t.progressOverview || "Progress Overview"}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t.courseProgressDescription || "Complete various modules to progress through the course."}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
            <Button 
              variant="contained" 
              color={enrolledCourse.color} 
              size="large"
              onClick={handleCompleteCourse}
              sx={{ px: 4, py: 1.5 }}
            >
              {t.markAsComplete || "Mark Course as Complete"}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Video Player Dialog */}
      {selectedVideo && (
        <Dialog 
          open={Boolean(selectedVideo)} 
          onClose={() => setSelectedVideo(null)} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle>
            {selectedVideo.title}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                position: 'relative',
                paddingTop: '56.25%', // 16:9 Aspect Ratio
                mb: 2
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
                onError={(e) => {
                  console.error('Video failed to load:', e.target.src);
                  // Fallback to a working video if the current one fails
                  e.target.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
                }}
              />
            </Box>
            <Typography variant="h6" gutterBottom>
              {selectedVideo.title}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {selectedVideo.description}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Duration: {selectedVideo.duration}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedVideo(null)}>{t.close || "Close"}</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Completion Dialog */}
      <Dialog open={showCompletionDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t.congratulations || "Congratulations!"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {t.courseCompletedSuccessfully || "You have successfully completed the course!"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t.courseCertificateInfo || "You can now download your certificate of completion."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t.close || "Close"}</Button>
          <Button 
            variant="contained" 
            color={enrolledCourse.color}
            onClick={handleCloseDialog}
          >
            {t.downloadCertificate || "Download Certificate"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseContent;
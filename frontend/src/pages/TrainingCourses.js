import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useAppContext } from '../contexts/AppContext';

const TrainingCourses = () => {
  const { t } = useAppContext();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseDetail, setShowCourseDetail] = useState(false);

  // Course data
  const courses = [
    {
      id: 1,
      title: t.beginnerCourse,
      description: t.beginnerCourseDesc,
      duration: '4 hours',
      lessons: 12,
      level: t.beginnerLevel,
      topics: [t.introToTrading, t.chartPatterns, t.riskBasics],
      color: 'secondary',
      backgroundColor: '#ffffff',
      borderColor: '#9c27b0'
    },
    {
      id: 2,
      title: t.advancedCourse,
      description: t.advancedCourseDesc,
      duration: '6 hours',
      lessons: 18,
      level: t.advancedLevel,
      topics: [t.technicalAnalysis, t.algorithmicTrading, t.portfolioManagement],
      color: 'primary',
      backgroundColor: '#ffffff',
      borderColor: '#2196f3'
    },
    {
      id: 3,
      title: t.expertCourse,
      description: t.expertCourseDesc,
      duration: '8 hours',
      lessons: 24,
      level: t.expertLevel,
      topics: [t.quantitativeAnalysis, t.riskManagement, t.momentumTrading],
      color: 'success',
      backgroundColor: '#ffffff',
      borderColor: '#4caf50'
    },
    {
      id: 4,
      title: t.specializedCourse,
      description: t.specializedCourseDesc,
      duration: '5 hours',
      lessons: 15,
      level: t.intermediateLevel,
      topics: [t.forexTrading, t.optionsStrategy, t.cryptoMarkets],
      color: 'warning',
      backgroundColor: '#ffffff',
      borderColor: '#ff9800'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" color="secondary" gutterBottom>
          📘 {t.tradingMasterclass}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {t.tradingMasterclassDesc}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {courses.map((course) => (
          <Grid item xs={12} md={6} key={course.id}>
            <Paper 
              sx={{ 
                p: 3, 
                height: '100%', 
                backgroundColor: course.backgroundColor, 
                border: '2px solid', 
                borderColor: course.borderColor, 
                borderRadius: 2, 
                '&:hover': { 
                  backgroundColor: '#f5f5f5',
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }, 
                transition: 'all 0.3s ease-in-out', 
                cursor: 'pointer' 
              }} 
              onClick={() => {
                setSelectedCourse(course);
                setShowCourseDetail(true);
              }}
            >
              <Typography variant="h5" color={course.color} gutterBottom fontWeight="bold">
                {course.title}
              </Typography>
              <Typography variant="body1" color="#333" gutterBottom>
                {course.description}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip label={course.level} size="medium" color={course.color} sx={{ mr: 1, mb: 1 }} />
                <Chip label={`${course.duration}`} size="medium" color="info" sx={{ mr: 1, mb: 1 }} />
                <Chip label={`${course.lessons} ${t.lessons}`} size="medium" color="success" sx={{ mb: 1 }} />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Course Detail Modal */}
      {selectedCourse && showCourseDetail && (
        <Dialog open={showCourseDetail} onClose={() => setShowCourseDetail(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedCourse.title}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                {selectedCourse.description}
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {t.courseDetails}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>{t.duration}:</strong> {selectedCourse.duration}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>{t.lessons}:</strong> {selectedCourse.lessons}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>{t.level}:</strong> {selectedCourse.level}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {t.topicsCovered}
                  </Typography>
                  <List>
                    {selectedCourse.topics.map((topic, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={`• ${topic}`} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button variant="contained" color="primary" onClick={() => {
                  alert(t.enrollSuccess);
                  // Redirect to course content page
                  window.location.href = `/course-content/${selectedCourse.id}`;
                }}>
                  {t.enrollNow}
                </Button>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCourseDetail(false)}>{t.close}</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default TrainingCourses;
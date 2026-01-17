import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
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
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const MarketDiscussionsPage = () => {
  const { t } = useAppContext();
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState({});
  const [newDiscussion, setNewDiscussion] = useState({ 
    title: '', 
    content: '', 
    author: 'Utilisateur Actuel', 
    category: 'general' 
  });

  // Sample initial discussions
  useEffect(() => {
    const sampleDiscussions = [
      {
        id: 1,
        title: 'Analyse technique du S&P 500 cette semaine',
        content: 'Quelles sont vos perspectives sur le S&P 500 pour cette semaine ? Les niveaux clés à surveiller...',
        author: 'Sophie Bernard',
        date: '2024-01-15',
        replies: 12,
        category: 'Indices',
        likes: 8
      },
      {
        id: 2,
        title: 'Tendance du Bitcoin face aux annonces de la Fed',
        content: 'Comment les dernières déclarations de la Fed affectent-elles votre positionnement sur le Bitcoin ?',
        author: 'Thomas Petit',
        date: '2024-01-15',
        replies: 24,
        category: 'Crypto',
        likes: 15
      },
      {
        id: 3,
        title: 'Stratégie de couverture en période de volatilité',
        content: 'Quelles stratégies utilisez-vous pour vous protéger contre la volatilité extrême sur les marchés ?',
        author: 'Camille Moreau',
        date: '2024-01-14',
        replies: 8,
        category: 'Stratégie',
        likes: 5
      }
    ];
    setDiscussions(sampleDiscussions);
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewDiscussion({ 
      title: '', 
      content: '', 
      author: 'Utilisateur Actuel', 
      category: 'general' 
    });
  };

  const handleAddDiscussion = () => {
    if (newDiscussion.title && newDiscussion.content) {
      const discussionToAdd = {
        id: discussions.length + 1,
        ...newDiscussion,
        date: new Date().toISOString().split('T')[0],
        replies: 0,
        likes: 0
      };
      setDiscussions([discussionToAdd, ...discussions]);
      handleCloseDialog();
    }
  };

  const handleLike = (id) => {
    setDiscussions(discussions.map(discussion => 
      discussion.id === id ? { ...discussion, likes: discussion.likes + 1 } : discussion
    ));
  };

  const handleReply = (id) => {
    // In a real app, this would open a reply dialog
    setDiscussions(discussions.map(discussion => 
      discussion.id === id ? { ...discussion, replies: discussion.replies + 1 } : discussion
    ));
  };

  const handleJoinDiscussion = (discussion) => {
    setSelectedDiscussion(discussion);
    // Show all replies for this discussion
    setShowReplies({
      ...showReplies,
      [discussion.id]: true
    });
  };

  const handleAddReply = (discussionId) => {
    if (replyText.trim()) {
      // In a real app, this would add the reply to the discussion
      setDiscussions(discussions.map(discussion => 
        discussion.id === discussionId ? { ...discussion, replies: discussion.replies + 1 } : discussion
      ));
      setReplyText('');
      alert(`${t.replyAdded || 'Réponse ajoutée'}: ${replyText}`);
    }
  };

  const toggleReplies = (discussionId) => {
    setShowReplies({
      ...showReplies,
      [discussionId]: !showReplies[discussionId]
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3" component="h1">
          {t.marketDiscussions || 'Discussions sur le marché'}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={handleOpenDialog}
        >
          {t.startDiscussion || 'Nouvelle discussion'}
        </Button>
      </Box>

      <Typography variant="h6" color="textSecondary" paragraph sx={{ mb: 4 }}>
        {t.marketDiscussionsDesc || 'Participez aux discussions en temps réel sur les tendances du marché, les analyses techniques et les événements économiques.'}
      </Typography>

      <Grid container spacing={3}>
        {discussions.map((discussion) => (
          <Grid item xs={12} key={discussion.id}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar>
                    {discussion.author.charAt(0)}
                  </Avatar>
                }
                title={
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">{discussion.title}</Typography>
                    <Chip 
                      label={discussion.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                }
                subheader={`${t.byAuthor || 'Par'} ${discussion.author} • ${discussion.date}`}
              />
              <Divider />
              <CardContent>
                <Typography variant="body1" paragraph>
                  {discussion.content}
                </Typography>
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Box>
                    <Button 
                      size="small" 
                      onClick={() => handleLike(discussion.id)}
                      sx={{ mr: 1 }}
                    >
                      👍 {discussion.likes}
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => handleReply(discussion.id)}
                    >
                      💬 {discussion.replies}
                    </Button>
                  </Box>
                  <Button 
                    size="small" 
                    color="secondary"
                    onClick={() => handleJoinDiscussion(discussion)}
                  >
                    {t.joinDiscussion || 'Rejoindre la discussion'}
                  </Button>
                </Box>
              </CardContent>
              
              {/* Discussion Replies Section */}
              {(discussion.replies > 0 || showReplies[discussion.id]) && (
                <>
                  <Divider />
                  <CardContent sx={{ pt: 1, pb: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2" color="textSecondary">
                        {t.replies || 'Réponses'} ({discussion.replies})
                      </Typography>
                      <Button 
                        size="small" 
                        onClick={() => toggleReplies(discussion.id)}
                      >
                        {showReplies[discussion.id] ? (t.hideReplies || 'Masquer') : (t.viewReplies || 'Voir réponses')}
                      </Button>
                    </Box>
                    
                    {showReplies[discussion.id] && (
                      <>
                        <List dense>
                          {[...Array(discussion.replies)].map((_, idx) => (
                            <ListItem key={idx} sx={{ pl: 0 }}>
                              <ListItemAvatar>
                                <Avatar sx={{ width: 32, height: 32 }}>
                                  U
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={`Réponse ${idx + 1} par Utilisateur ${idx + 1}`}
                                secondary={`Contenu de la réponse... Ceci est un exemple de réponse à la discussion.`}
                              />
                            </ListItem>
                          ))}
                        </List>
                        
                        {/* Reply Input */}
                        <Box display="flex" gap={1} mt={2}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder={t.writeReply || 'Écrire une réponse...'}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            multiline
                            maxRows={3}
                          />
                          <Button 
                            variant="contained" 
                            onClick={() => handleAddReply(discussion.id)}
                          >
                            {t.postReply || 'Publier la réponse'}
                          </Button>
                        </Box>
                      </>
                    )}
                  </CardContent>
                </>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* New Discussion Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {t.startNewDiscussion || 'Démarrer une nouvelle discussion'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t.discussionTitle || 'Titre de la discussion'}
            fullWidth
            variant="outlined"
            value={newDiscussion.title}
            onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            label={t.discussionCategory || 'Catégorie'}
            select
            fullWidth
            variant="outlined"
            value={newDiscussion.category}
            onChange={(e) => setNewDiscussion({...newDiscussion, category: e.target.value})}
            sx={{ mt: 2 }}
          >
            <option value="general">{t.general || 'Général'}</option>
            <option value="forex">Forex</option>
            <option value="stocks">{t.stocks || 'Actions'}</option>
            <option value="crypto">{t.crypto || 'Crypto'}</option>
            <option value="indices">Indices</option>
            <option value="commodities">{t.commodities || 'Matières premières'}</option>
            <option value="strategy">{t.strategy || 'Stratégie'}</option>
            <option value="news">{t.news || 'Actualités'}</option>
          </TextField>
          <TextField
            margin="dense"
            label={t.discussionContent || 'Contenu de la discussion'}
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={newDiscussion.content}
            onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t.cancel || 'Annuler'}</Button>
          <Button onClick={handleAddDiscussion} variant="contained">{t.post || 'Publier'}</Button>
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

export default MarketDiscussionsPage;
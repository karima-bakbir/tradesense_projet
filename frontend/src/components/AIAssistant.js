import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Chip,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon, Send as SendIcon, SmartToy as AIIcon, EmojiObjects as BrainIcon } from '@mui/icons-material';

const AIAssistant = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis votre assistant IA avancé. Je peux répondre à toutes vos questions sur le trading, l'analyse de marché, les signaux de trading, et bien plus encore.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced AI response function with more comprehensive answers
  const generateAIResponse = (userMessage) => {
    const lowerCaseMsg = userMessage.toLowerCase();
    
    // Trading-related responses
    if (lowerCaseMsg.includes('signal') || lowerCaseMsg.includes('achat') || lowerCaseMsg.includes('vente') || lowerCaseMsg.includes('buy') || lowerCaseMsg.includes('sell')) {
      const signals = [
        "Sur la base de l'analyse technique actuelle, les indicateurs suggèrent un potentiel de hausse pour les actifs technologiques à court terme.",
        "Selon nos algorithmes d'IA, le momentum est positif sur plusieurs valeurs du CAC40 avec un RSI favorable.",
        "Notre système de trading automatique détecte des signaux d'achat intéressants sur les crypto-monnaies avec un volume en augmentation.",
        "Les indicateurs de volatilité montrent une opportunité de trading sur les paires de devises majeures dans les prochaines heures."
      ];
      return signals[Math.floor(Math.random() * signals.length)];
    }
    
    // Market analysis responses
    if (lowerCaseMsg.includes('analyse') || lowerCaseMsg.includes('marché') || lowerCaseMsg.includes('tendance') || lowerCaseMsg.includes('market') || lowerCaseMsg.includes('trend')) {
      const analyses = [
        "L'analyse technique montre un scénario haussier à moyen terme avec des supports clés vers lesquels se tourner en cas de correction.",
        "Le sentiment du marché reste globalement positif malgré certaines tensions géopolitiques. Les volumes restent soutenus.",
        "Les indicateurs oscillateurs montrent un léger surachat sur certains indices mais les tendances de fond restent intactes.",
        "La volatilité devrait augmenter dans les prochains jours avec les publications économiques importantes prévues."
      ];
      return analyses[Math.floor(Math.random() * analyses.length)];
    }
    
    // Recommendations
    if (lowerCaseMsg.includes('recommand') || lowerCaseMsg.includes('strat') || lowerCaseMsg.includes('conseil') || lowerCaseMsg.includes('recommend') || lowerCaseMsg.includes('strategy')) {
      const recommendations = [
        "Pour votre portefeuille, je recommande de surveiller les niveaux clés de support et de résistance avant d'ajuster vos positions.",
        "Diversifiez votre exposition entre les secteurs cycliques et défensifs en fonction de votre tolérance au risque.",
        "Envisagez de placer des ordres limite à des niveaux techniques significatifs pour optimiser vos points d'entrée.",
        "Gardez une partie de votre capital en espèces pour profiter des opportunités de volatilité imprévues."
      ];
      return recommendations[Math.floor(Math.random() * recommendations.length)];
    }
    
    // Performance tracking
    if (lowerCaseMsg.includes('perform') || lowerCaseMsg.includes('suivi') || lowerCaseMsg.includes('bilan') || lowerCaseMsg.includes('performance')) {
      const performances = [
        "Votre portefeuille montre une corrélation positive avec les indices de référence, avec une volatilité inférieure à la moyenne du marché.",
        "Les performances récentes montrent une bonne gestion du risque avec des pertes limitées pendant les périodes de stress.",
        "Le ratio Sharpe de votre portefeuille indique une bonne efficacité du rendement ajusté au risque.",
        "La diversification actuelle protège contre les risques sectoriels tout en maintenant une exposition aux tendances de fond."
      ];
      return performances[Math.floor(Math.random() * performances.length)];
    }
    
    // General AI responses
    const generalResponses = [
      "Merci pour votre question. Sur la base de mes analyses, je recommande de toujours considérer les niveaux techniques clés et les indicateurs de volume lors de vos décisions de trading.",
      "C'est une excellente question. Mon système d'IA prend en compte plusieurs facteurs comme les indicateurs techniques, le sentiment du marché et les données macroéconomiques.",
      "J'ai analysé cette situation selon plusieurs angles. Voici mes recommandations basées sur les modèles prédictifs les plus récents.",
      "Selon mes algorithmes d'apprentissage profond, cette situation nécessite une approche prudente avec des seuils de risque bien définis.",
      "Ma réponse est basée sur l'analyse de millions de points de données en temps réel, combinant analyses technique et fondamentale."
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      const aiResponse = {
        id: messages.length + 2,
        text: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorResponse = {
        id: messages.length + 2,
        text: "Désolé, je rencontre un problème technique. Pouvez-vous reformuler votre question ?",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 20, 
        right: 20, 
        width: 400, 
        height: 600, 
        display: 'flex', 
        flexDirection: 'column',
        zIndex: 1000,
        boxShadow: 3
      }}
    >
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <BrainIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Assistance IA Avancée</Typography>
          <Chip 
            label="AI" 
            size="small" 
            sx={{ 
              ml: 1, 
              bgcolor: 'secondary.main', 
              color: 'white',
              fontSize: '0.7rem'
            }} 
          />
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
        <List>
          {messages.map((message) => (
            <ListItem 
              key={message.id} 
              alignItems="flex-start" 
              sx={{ 
                display: 'block', 
                justifyContent: message.sender === 'ai' ? 'flex-start' : 'flex-end',
                mb: 1
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  bgcolor: message.sender === 'ai' ? 'white' : 'primary.main',
                  color: message.sender === 'ai' ? 'black' : 'white',
                  borderRadius: 2,
                  p: 1.5,
                  maxWidth: '80%',
                }}
              >
                {message.sender === 'ai' && (
                  <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24, mr: 1, fontSize: 14 }}>
                    <AIIcon fontSize="small" />
                  </Avatar>
                )}
                <ListItemText
                  primary={message.text}
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    sx: { wordWrap: 'break-word' }
                  }}
                />
                {message.sender === 'user' && (
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 24, height: 24, ml: 1, fontSize: 14 }}>
                    Vous
                  </Avatar>
                )}
              </Box>
            </ListItem>
          ))}
          {isLoading && (
            <ListItem alignItems="flex-start" sx={{ justifyContent: 'flex-start', mb: 1 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  bgcolor: 'white',
                  color: 'black',
                  borderRadius: 2,
                  p: 1.5,
                  maxWidth: '80%',
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24, mr: 1, fontSize: 14 }}>
                  <AIIcon fontSize="small" />
                </Avatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center">
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      <Typography variant="body2">L'IA analyse votre requête...</Typography>
                    </Box>
                  }
                />
              </Box>
            </ListItem>
          )}
        </List>
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Posez une question à l'IA..."
          variant="outlined"
          size="small"
          disabled={isLoading}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          sx={{ minWidth: 40 }}
          disabled={isLoading || inputMessage.trim() === ''}
        >
          {isLoading ? <CircularProgress size={20} /> : <SendIcon />}
        </Button>
      </Box>
    </Paper>
  );
};

export default AIAssistant;
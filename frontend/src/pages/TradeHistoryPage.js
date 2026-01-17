import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Box, Button } from '@mui/material';
import api, { getChallengeTrades } from '../utils/api';
import { useAppContext } from '../contexts/AppContext';
import { useParams } from 'react-router-dom';

const TradeHistoryPage = () => {
  const { t } = useAppContext();
  const { challengeId: urlChallengeId } = useParams();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTradeHistory = async () => {
      try {
        // Get challenge ID from multiple possible sources
        let challengeId = urlChallengeId; // Get from URL parameter via useParams
        
        // If not in URL params, try localStorage
        if (!challengeId) {
          challengeId = localStorage.getItem('challengeId');
        }
        
        // If still not in localStorage, try to get from URL search parameters
        if (!challengeId) {
          const urlParams = new URLSearchParams(window.location.search);
          challengeId = urlParams.get('challengeId');
        }
        
        // If still not found, try to get from the current user's active challenge
        if (!challengeId) {
          // Get user's token to fetch their challenges
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const profileResponse = await api.get('/profile');
              if (profileResponse.data && profileResponse.data.user) {
                const userId = profileResponse.data.user.id;
                
                // Fetch user's challenges
                const challengesResponse = await api.get(`/user/${userId}/challenges`);
                if (challengesResponse.data && challengesResponse.data.challenges) {
                  // Find the most recent active challenge, or just the most recent challenge
                  const challenges = challengesResponse.data.challenges;
                  const activeChallenge = challenges.find(challenge => challenge.status === 'active');
                  
                  if (activeChallenge) {
                    challengeId = activeChallenge.challenge_id || activeChallenge.id;
                  } else if (challenges.length > 0) {
                    // Use the most recent challenge if no active one exists
                    const mostRecent = challenges.reduce((latest, challenge) => 
                      new Date(latest.created_at || latest.timestamp) > 
                      new Date(challenge.created_at || challenge.timestamp) ? latest : challenge
                    );
                    challengeId = mostRecent.challenge_id || mostRecent.id;
                  }
                }
              }
            } catch (err) {
              console.error('Error fetching user challenges:', err);
            }
          }
          
          // If still no challenge ID found, try to create one for the user
          if (!challengeId) {
            const token = localStorage.getItem('token');
            if (token) {
              try {
                // Get user profile to get user ID
                const profileResponse = await api.get('/profile');
                if (profileResponse.data && profileResponse.data.user) {
                  const userId = profileResponse.data.user.id;
                  
                  // Create a new challenge
                  const createResponse = await api.post('/challenge/create', { user_id: userId });
                  if (createResponse.data && createResponse.data.challenge_id) {
                    challengeId = createResponse.data.challenge_id;
                    // Store the new challenge ID in localStorage
                    localStorage.setItem('challengeId', challengeId);
                  } else {
                    setError('Failed to create challenge. Please create a challenge first.');
                    setLoading(false);
                    return;
                  }
                } else {
                  setError('Unable to retrieve user profile. Please login again.');
                  setLoading(false);
                  return;
                }
              } catch (error) {
                console.error('Error creating challenge:', error);
                setError('Error creating challenge. Please create a challenge first.');
                setLoading(false);
                return;
              }
            } else {
              // No token, redirect to login
              setError('Please login to access trade history.');
              setLoading(false);
              return;
            }
          }
        }

        // Get trades from the API if challenge ID exists
        let apiTrades = [];
        if (challengeId) {
          try {
            const response = await getChallengeTrades(challengeId);
            apiTrades = response.data.trades || [];
          } catch (apiErr) {
            console.error('Error fetching trade history from API:', apiErr);
          }
        }
        
        // Get trades from localStorage (from dashboard trades)
        const localStorageTrades = JSON.parse(localStorage.getItem('tradeHistory') || '[]');
        
        // Combine both sets of trades and sort by timestamp (most recent first)
        const allTrades = [...apiTrades, ...localStorageTrades]
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setTrades(allTrades);
        setError(null);
      } catch (err) {
        console.error('Error fetching trade history:', err);
        setError(t.errorFetchingTradeHistory || 'Error fetching trade history');
      } finally {
        setLoading(false);
      }
    };

    fetchTradeHistory();
  }, [t, urlChallengeId]);

  // Function to refresh trade history
  const refreshTradeHistory = async () => {
    setLoading(true);
    try {
      let challengeId = urlChallengeId || localStorage.getItem('challengeId');
      
      if (!challengeId) {
        const urlParams = new URLSearchParams(window.location.search);
        challengeId = urlParams.get('challengeId');
      }
      
      if (!challengeId) {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const profileResponse = await api.get('/profile');
            if (profileResponse.data && profileResponse.data.user) {
              const userId = profileResponse.data.user.id;
              const challengesResponse = await api.get(`/user/${userId}/challenges`);
              if (challengesResponse.data && challengesResponse.data.challenges) {
                const challenges = challengesResponse.data.challenges;
                const activeChallenge = challenges.find(challenge => challenge.status === 'active');
                if (activeChallenge) {
                  challengeId = activeChallenge.challenge_id || activeChallenge.id;
                } else if (challenges.length > 0) {
                  const mostRecent = challenges.reduce((latest, challenge) => 
                    new Date(latest.created_at || latest.timestamp) > 
                    new Date(challenge.created_at || challenge.timestamp) ? latest : challenge
                  );
                  challengeId = mostRecent.challenge_id || mostRecent.id;
                }
              }
            }
          } catch (err) {
            console.error('Error fetching user challenges:', err);
          }
        }
      }
      
      // Get trades from the API if challenge ID exists
      let apiTrades = [];
      if (challengeId) {
        try {
          const response = await getChallengeTrades(challengeId);
          apiTrades = response.data.trades || [];
        } catch (apiErr) {
          console.error('Error fetching trade history from API:', apiErr);
        }
      }
      
      // Get trades from localStorage (from dashboard trades)
      const localStorageTrades = JSON.parse(localStorage.getItem('tradeHistory') || '[]');
      
      // Combine both sets of trades and sort by timestamp (most recent first)
      const allTrades = [...apiTrades, ...localStorageTrades]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setTrades(allTrades);
      setError(null);
    } catch (err) {
      console.error('Error fetching trade history:', err);
      setError(t.errorFetchingTradeHistory || 'Error fetching trade history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          {t.tradeHistory || 'Trade History'}
        </Typography>
        <Button 
          variant="contained" 
          onClick={refreshTradeHistory}
          disabled={loading}
        >
          {t.refresh || 'Refresh'}
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t.assetName || 'Asset'}</TableCell>
                <TableCell>{t.tradeType || 'Type'}</TableCell>
                <TableCell align="right">{t.entryPrice || 'Entry Price'}</TableCell>
                <TableCell align="right">{t.timestamp || 'Date/Time'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trades.length > 0 ? (
                trades.map((trade) => (
                  <TableRow key={trade.trade_id || trade.id}>
                    <TableCell>{trade.asset_name || trade.asset}</TableCell>
                    <TableCell>
                      <span style={{ 
                        color: (trade.type || '').toLowerCase() === 'buy' ? '#4caf50' : '#f44336',
                        fontWeight: 'bold'
                      }}>
                        {(trade.type || '').toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell align="right">${parseFloat(trade.entry_price || trade.price).toFixed(2)}</TableCell>
                    <TableCell align="right">
                      {new Date(trade.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {t.noTradesFound || 'No trades found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {!loading && !error && trades.length === 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            {t.noTradesFound || 'No trades found'}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default TradeHistoryPage;
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { getChallenge, getAllChallenges } from '../utils/api';
import ClearIcon from '@mui/icons-material/Clear';

const DebugView = () => {
  const [challengeId, setChallengeId] = useState('');
  const [challengeData, setChallengeData] = useState(null);
  const [allChallenges, setAllChallenges] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch a specific challenge by ID
  const fetchChallenge = async () => {
    if (!challengeId) {
      setError('Please enter a challenge ID');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await getChallenge(challengeId);
      if (response.data) {
        // Normalize the response data to ensure consistent structure
        const normalizedData = {
          id: response.data.challenge_id || response.data.id,
          user_id: response.data.user_id,
          initial_balance: response.data.initial_balance,
          current_balance: response.data.current_balance,
          status: response.data.status,
          start_date: response.data.start_date,
          end_date: response.data.end_date,
          max_daily_loss: response.data.max_daily_loss,
          max_total_loss: response.data.max_total_loss,
          profit_target: response.data.profit_target,
          challenge_type: response.data.challenge_type,
          trades: response.data.trades
        };
        setChallengeData(normalizedData);
      } else {
        setError('Challenge not found');
      }
    } catch (err) {
      console.error('Error fetching challenge:', err);
      setError('Error fetching challenge data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all challenges
  const fetchAllChallenges = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllChallenges();
      if (response.data && response.data.challenges) {
        // Normalize the challenge data to ensure consistent structure
        const normalizedChallenges = response.data.challenges.map(challenge => ({
          id: challenge.id,
          user_id: challenge.user_id,
          initial_balance: challenge.initial_balance,
          current_balance: challenge.current_balance,
          status: challenge.status,
          start_date: challenge.start_date,
          end_date: challenge.end_date,
          max_daily_loss: challenge.max_daily_loss,
          max_total_loss: challenge.max_total_loss,
          profit_target: challenge.profit_target,
          trades_count: challenge.trades_count
        }));
        setAllChallenges(normalizedChallenges);
      } else {
        setError('No challenges found');
      }
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError('Error fetching challenges data');
    } finally {
      setLoading(false);
    }
  };

  // Load all challenges on component mount
  useEffect(() => {
    fetchAllChallenges();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Debug View - Challenge Data
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This is a debug view to see challenge data for demo purposes. 
        You can view specific challenges by ID or see all challenges in the system.
      </Alert>

      {/* Challenge Lookup */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            View Specific Challenge
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <TextField
              label="Challenge ID"
              value={challengeId}
              onChange={(e) => setChallengeId(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ width: 200 }}
            />
            <Button 
              variant="contained" 
              onClick={fetchChallenge}
              disabled={loading}
            >
              Load Challenge
            </Button>
          </Box>
          
          {challengeData && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" gutterBottom>
                  Challenge #{challengeData.id} | Status: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {challengeData.status}
                  </span>
                </Typography>
                <IconButton 
                  onClick={() => setChallengeData(null)}
                  size="small"
                  title="Clear current challenge view"
                >
                  <ClearIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
                <Box>
                  <Typography><strong>Challenge ID:</strong> {challengeData.id}</Typography>
                  <Typography><strong>Status:</strong> <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{challengeData.status}</span></Typography>
                  <Typography><strong>Initial Balance:</strong> ${challengeData.initial_balance?.toFixed(2)}</Typography>
                  <Typography><strong>Current Balance:</strong> ${challengeData.current_balance?.toFixed(2)}</Typography>
                  <Typography><strong>Total Change:</strong> {((challengeData.current_balance - challengeData.initial_balance) / challengeData.initial_balance * 100).toFixed(2)}%</Typography>
                </Box>
                <Box>
                  <Typography><strong>User ID:</strong> {challengeData.user_id}</Typography>
                  <Typography><strong>Start Date:</strong> {new Date(challengeData.start_date).toLocaleString()}</Typography>
                  <Typography><strong>End Date:</strong> {challengeData.end_date ? new Date(challengeData.end_date).toLocaleString() : 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography><strong>Max Daily Loss:</strong> {challengeData.max_daily_loss}%</Typography>
                  <Typography><strong>Max Total Loss:</strong> {challengeData.max_total_loss}%</Typography>
                  <Typography><strong>Profit Target:</strong> {challengeData.profit_target}%</Typography>
                </Box>
              </Box>
              
              {/* Show trades if available */}
              {challengeData.trades && challengeData.trades.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Trades ({challengeData.trades.length})
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Asset</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Timestamp</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {challengeData.trades.map((trade) => (
                          <TableRow key={trade.trade_id || trade.id}>
                            <TableCell>{trade.trade_id || trade.id}</TableCell>
                            <TableCell>{trade.asset_name}</TableCell>
                            <TableCell>
                              <span style={{ 
                                fontWeight: 'bold', 
                                color: trade.type === 'buy' ? 'green' : 'red' 
                              }}>
                                {trade.type.toUpperCase()}
                              </span>
                            </TableCell>
                            <TableCell align="right">${trade.entry_price?.toFixed(2)}</TableCell>
                            <TableCell align="right">{trade.quantity || 10}</TableCell>
                            <TableCell align="right">
                              {new Date(trade.timestamp).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* All Challenges */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Challenges ({allChallenges.length})
          </Typography>
          <Button 
            variant="outlined" 
            onClick={fetchAllChallenges}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            Refresh All Challenges
          </Button>
          
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Initial Balance</TableCell>
                  <TableCell align="right">Current Balance</TableCell>
                  <TableCell align="right">Change %</TableCell>
                  <TableCell>Start Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allChallenges.map((challenge) => (
                  <TableRow 
                    key={challenge.id} 
                    onClick={() => {
                      setChallengeId(challenge.id.toString());
                      setChallengeData(challenge);
                    }}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <TableCell>{challenge.id}</TableCell>
                    <TableCell>{challenge.user_id}</TableCell>
                    <TableCell>
                      <span style={{ 
                        fontWeight: 'bold', 
                        textTransform: 'uppercase',
                        color: 
                          challenge.status === 'active' ? '#2196f3' :
                          challenge.status === 'funded' ? '#4caf50' :
                          challenge.status === 'failed' ? '#f44336' : 'inherit'
                      }}>
                        {challenge.status}
                      </span>
                    </TableCell>
                    <TableCell align="right">${challenge.initial_balance?.toFixed(2)}</TableCell>
                    <TableCell align="right">${challenge.current_balance?.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <span style={{ 
                        fontWeight: 'bold',
                        color: ((challenge.current_balance - challenge.initial_balance) / challenge.initial_balance * 100) >= 0 ? 'green' : 'red' 
                      }}>
                        {((challenge.current_balance - challenge.initial_balance) / challenge.initial_balance * 100).toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell>{new Date(challenge.start_date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default DebugView;
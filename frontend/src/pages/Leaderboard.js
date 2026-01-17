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
  Box,
  Chip,
  Avatar,
  IconButton
} from '@mui/material';
import { styled } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grade, TrendingUp, EmojiEvents } from '@mui/icons-material';
import axios from 'axios';
import { useAppContext } from '../contexts/AppContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

const RankAvatar = styled(Avatar)(({ rank }) => ({
  backgroundColor: 
    rank === 1 ? '#FFD700' : // Gold
    rank === 2 ? '#C0C0C0' : // Silver
    rank === 3 ? '#CD7F32' : // Bronze
    '#1976d2', // Blue for others
  color: 'white',
  fontWeight: 'bold',
}));

const Leaderboard = () => {
  const { t } = useAppContext();
  const [topTraders, setTopTraders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch top traders from backend API
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/leaderboard');
        
        // Transform the API response to match our expected format
        const transformedData = response.data.leaderboard.map((trader, index) => ({
          id: index + 1,
          username: trader.username,
          profitPercentage: trader.profit_percentage,
          totalProfit: trader.total_profit,
          challengeStatus: trader.challenge_status,
          trades: trader.trades
        }));
        
        setTopTraders(transformedData);
        setLoading(false);
      } catch (error) {
        console.error(t.fetchLeaderboardError || 'Error fetching leaderboard data:', error);
        
        // Fallback to mock data if API fails
        const mockData = [
          { id: 1, username: 'TradingMaster', profitPercentage: 45.2, totalProfit: 2260, challengeStatus: 'funded', trades: 156 },
          { id: 2, username: 'ProTrader2023', profitPercentage: 38.7, totalProfit: 1935, challengeStatus: 'funded', trades: 142 },
          { id: 3, username: 'MoroccoTrader', profitPercentage: 32.1, totalProfit: 1605, challengeStatus: 'funded', trades: 128 },
          { id: 4, username: 'QuantumEdge', profitPercentage: 28.9, totalProfit: 1445, challengeStatus: 'active', trades: 115 },
          { id: 5, username: 'AlphaInvestor', profitPercentage: 25.4, totalProfit: 1270, challengeStatus: 'active', trades: 108 },
          { id: 6, username: 'CryptoKing', profitPercentage: 22.8, totalProfit: 1140, challengeStatus: 'active', trades: 95 },
          { id: 7, username: 'MarketWhisper', profitPercentage: 19.3, totalProfit: 965, challengeStatus: 'active', trades: 87 },
          { id: 8, username: 'SwiftTrader', profitPercentage: 16.7, totalProfit: 835, challengeStatus: 'active', trades: 78 },
          { id: 9, username: 'ProfitSeeker', profitPercentage: 14.2, totalProfit: 710, challengeStatus: 'active', trades: 69 },
          { id: 10, username: 'RiskManager', profitPercentage: 11.8, totalProfit: 590, challengeStatus: 'active', trades: 62 },
        ];
        
        setTopTraders(mockData);
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'funded':
        return 'success';
      case 'active':
        return 'info';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <EmojiEvents color="primary" sx={{ fontSize: 40, mr: 2 }} />
        <Typography variant="h3" component="h1">
          {t.traderLeaderboard}
        </Typography>
      </Box>
      
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {t.top10TradersByProfitPercent}
      </Typography>

      <StyledPaper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" width="10%">{t.rank}</TableCell>
                <TableCell>{t.username}</TableCell>
                <TableCell align="right">{t.profitPercent}</TableCell>
                <TableCell align="right">{t.totalProfitDollar}</TableCell>
                <TableCell align="right">{t.transactions}</TableCell>
                <TableCell align="center">{t.status}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topTraders.map((trader, index) => (
                <TableRow key={trader.id} hover>
                  <TableCell align="center">
                    <RankAvatar rank={index + 1}>
                      {index + 1}
                    </RankAvatar>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Grade 
                        color={index < 3 ? "primary" : "disabled"} 
                        sx={{ mr: 1 }} 
                      />
                      <Typography variant="body1" fontWeight="medium">
                        {trader.username}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={`${trader.profitPercentage}%`} 
                      color={trader.profitPercentage > 20 ? 'success' : trader.profitPercentage > 10 ? 'info' : 'default'}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                    ${trader.totalProfit.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    {trader.trades}
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={trader.challengeStatus === 'funded' ? t.funded : 
                             trader.challengeStatus === 'active' ? t.active : t.failed}
                      color={getStatusColor(trader.challengeStatus)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledPaper>

      <Box mt={4} textAlign="center">
        <Typography variant="h6" gutterBottom>
          {t.rankingMethodology}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {t.rankingExplanation}
        </Typography>
      </Box>

      <Box mt={4} display="flex" justifyContent="center">
        <TrendingUp color="primary" sx={{ fontSize: 60 }} />
      </Box>
    </Container>
  );
};

export default Leaderboard;
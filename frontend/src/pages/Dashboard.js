import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  IconButton,
  CircularProgress
} from '@mui/material';
import { 
  ComposedChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  TimeScale,
  Filler,
  BarElement
} from 'chart.js';
import { styled } from '@mui/system';
import { getPrice, getMultipleAISignals, getPopularAISignals } from '../utils/api';
import { useAppContext } from '../contexts/AppContext';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Close, ShoppingCart, AccountBalanceWallet } from '@mui/icons-material';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Legend,
  TimeScale,
  Filler
);

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
}));

const SignalChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 'bold',
}));

const DashboardContent = () => {
  const { t } = useAppContext();
  const { user, loading: userLoading, isAuthenticated } = useUserContext();
  const navigate = useNavigate();

  // All state hooks at the top to comply with React Hooks rules
  const [balance, setBalance] = useState(5000);  // Default starting balance
  // Challenge ID is not used in direct trading mode
  const [currentPrice, setCurrentPrice] = useState(150.25);
  const [selectedAsset, setSelectedAsset] = useState('AAPL');
  // Challenge status is not used in direct trading mode
  const [tradeSize, setTradeSize] = useState(10);  // Default trade size, can be increased for demo purposes
  
  const [aiSignals, setAiSignals] = useState([]);
  const [detailedSignal, setDetailedSignal] = useState(null);
  const [showDetailedSignal, setShowDetailedSignal] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trades, setTrades] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(5000);
  
  // Technical Analysis State
  const [selectedIndicator, setSelectedIndicator] = useState('sma'); // Simple Moving Average

  // Calculate Simple Moving Average
  const calculateSMA = useCallback((data, period) => {
    const sma = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        sma.push(null);
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((acc, item) => acc + item.price, 0);
        sma.push(parseFloat((sum / period).toFixed(2)));
      }
    }
    return sma;
  }, []);

  // Calculate Exponential Moving Average
  const calculateEMA = useCallback((data, period) => {
    const ema = [];
    const k = 2 / (period + 1);
    
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        ema.push(data[i].price);
      } else {
        const prevEma = ema[i - 1];
        ema.push(parseFloat(((data[i].price - prevEma) * k + prevEma).toFixed(2)));
      }
    }
    return ema;
  }, []);

  // Calculate RSI
  const calculateRSI = useCallback((data, period = 14) => {
    const rsi = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period) {
        rsi.push(null);
      } else {
        let gains = 0;
        let losses = 0;
        
        for (let j = i - period; j < i; j++) {
          const change = data[j + 1].price - data[j].price;
          if (change > 0) {
            gains += change;
          } else {
            losses -= change;
          }
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        
        if (avgLoss === 0) {
          rsi.push(100);
        } else {
          const rs = avgGain / avgLoss;
          rsi.push(parseFloat((100 - (100 / (1 + rs))).toFixed(2)));
        }
      }
    }
    return rsi;
  }, []);

  // Calculate Bollinger Bands
  const calculateBollingerBands = useCallback((data, period) => {
    const upper = [];
    const middle = [];
    const lower = [];
    
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        upper.push(null);
        middle.push(null);
        lower.push(null);
      } else {
        const slice = data.slice(i - period + 1, i + 1);
        const sum = slice.reduce((acc, item) => acc + item.price, 0);
        const ma = sum / period;
        
        const variance = slice.reduce((acc, item) => acc + Math.pow(item.price - ma, 2), 0) / period;
        const stdDev = Math.sqrt(variance);
        
        upper.push(parseFloat((ma + 2 * stdDev).toFixed(2)));
        middle.push(parseFloat(ma.toFixed(2)));
        lower.push(parseFloat((ma - 2 * stdDev).toFixed(2)));
      }
    }
    
    return { upper, middle, lower };
  }, []);

  // Calculate MACD
  const calculateMACD = useCallback((data) => {
    const ema12 = calculateEMA(data, 12);
    const ema26 = calculateEMA(data, 26);
    
    const macdLine = [];
    const signalLine = [];
    const histogram = [];
    
    for (let i = 0; i < data.length; i++) {
      if (i < 25) {
        macdLine.push(null);
        signalLine.push(null);
        histogram.push(null);
      } else {
        const macdVal = ema12[i] - ema26[i];
        macdLine.push(parseFloat(macdVal.toFixed(2)));
        
        // Calculate signal line (9-day EMA of MACD line)
        if (i >= 33) { // Need at least 9 values for signal line
          const signalSlice = macdLine.slice(i - 8, i + 1).filter(val => val !== null);
          if (signalSlice.length === 9) {
            const signalSum = signalSlice.reduce((acc, val) => acc + val, 0);
            const signalVal = signalSum / 9;
            signalLine.push(parseFloat(signalVal.toFixed(2)));
            
            // Histogram is MACD line minus signal line
            histogram.push(parseFloat((macdLine[i] - signalVal).toFixed(2)));
          } else {
            signalLine.push(null);
            histogram.push(null);
          }
        } else {
          signalLine.push(null);
          histogram.push(null);
        }
      }
    }
    
    return { macdLine, signalLine, histogram };
  }, [calculateEMA]);

  // Calculate Stochastic
  const calculateStochastic = useCallback((data, period = 14) => {
    const kValues = [];
    const dValues = [];
    
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        kValues.push(null);
        dValues.push(null);
      } else {
        const highs = data.slice(i - period + 1, i + 1).map(d => d.high || d.price);
        const lows = data.slice(i - period + 1, i + 1).map(d => d.low || d.price);
        const closes = data.slice(i - period + 1, i + 1).map(d => d.price);
        
        const highestHigh = Math.max(...highs);
        const lowestLow = Math.min(...lows);
        
        if (highestHigh === lowestLow) {
          kValues.push(50); // Neutral value when there's no variation
        } else {
          const currentClose = closes[closes.length - 1];
          const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
          kValues.push(parseFloat(k.toFixed(2)));
          
          // Calculate D (3-period SMA of K)
          if (i >= period + 2) {
            const kSlice = kValues.slice(i - 2, i + 1);
            const d = kSlice.reduce((acc, val) => acc + val, 0) / 3;
            dValues.push(parseFloat(d.toFixed(2)));
          } else {
            dValues.push(null);
          }
        }
      }
    }
    
    return { k: kValues, d: dValues };
  }, []);

  // Calculate Williams %R
  const calculateWilliamsR = useCallback((data, period = 14) => {
    const rValues = [];
    
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        rValues.push(null);
      } else {
        const highs = data.slice(i - period + 1, i + 1).map(d => d.high || d.price);
        const lows = data.slice(i - period + 1, i + 1).map(d => d.low || d.price);
        const currentClose = data[i].price;
        
        const highestHigh = Math.max(...highs);
        const lowestLow = Math.min(...lows);
        
        if (highestHigh === lowestLow) {
          rValues.push(-50); // Neutral value
        } else {
          const r = ((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100;
          rValues.push(parseFloat(r.toFixed(2)));
        }
      }
    }
    
    return rValues;
  }, []);

  // Main function to calculate all technical indicators
  const calculateTechnicalIndicators = useCallback((data) => {
    const sma = calculateSMA(data, 20);
    const ema = calculateEMA(data, 20);
    const rsi = calculateRSI(data, 14);
    const bb = calculateBollingerBands(data, 20);
    const macd = calculateMACD(data);
    const stochastic = calculateStochastic(data, 14);
    const williamsR = calculateWilliamsR(data, 14);
    
    const result = data.map((item, index) => ({
      ...item,
      sma: sma[index],
      ema: ema[index],
      rsi: rsi[index],
      bbUpper: bb.upper[index],
      bbMiddle: bb.middle[index],
      bbLower: bb.lower[index],
      macdLine: macd.macdLine[index],
      macdSignal: macd.signalLine[index],
      macdHistogram: macd.histogram[index],
      stochK: stochastic.k[index],
      stochD: stochastic.d[index],
      williamsR: williamsR[index]
    }));
    
    return result;
  }, [calculateSMA, calculateEMA, calculateRSI, calculateBollingerBands, calculateMACD, calculateStochastic, calculateWilliamsR]);

  // Initialize dashboard data
  useEffect(() => {
    let isMounted = true; // Track if component is still mounted
    
    const initializeDashboard = async () => {
      // Generate sample chart data with technical indicators
      const data = [];
      let cumulativePrice = 150;
      
      for (let i = 0; i < 50; i++) {
        // Simulate realistic price movement with more volatility
        const volatility = 0.02; // 2% volatility
        const drift = 0.0005; // Small upward drift
        const change = (Math.random() * 2 - 1) * volatility * cumulativePrice + drift * cumulativePrice; // Random change based on current price
        cumulativePrice = Math.max(0.01, cumulativePrice + change); // Prevent negative prices
        
        // Calculate high and low based on the price movement
        const high = Math.max(cumulativePrice, cumulativePrice * (1 + Math.random() * 0.015));
        const low = Math.min(cumulativePrice, cumulativePrice * (1 - Math.random() * 0.015));
        
        data.push({
          time: new Date(Date.now() - (49 - i) * 2000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), // Realistic timestamps
          price: parseFloat(cumulativePrice.toFixed(2)),
          volume: Math.floor(Math.random() * 1000000) + 500000, // Random volume
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          open: i > 0 ? data[i-1].price : parseFloat(cumulativePrice.toFixed(2))
        });
      }
      
      // Calculate technical indicators
      const updatedData = calculateTechnicalIndicators(data);
      
      // Only update state if component is still mounted
      if (isMounted) {
        setChartData(prevData => {
          // Only update if the new data is different
          if (JSON.stringify(prevData) !== JSON.stringify(updatedData)) {
            return updatedData;
          }
          return prevData; // Return previous data if no change
        });
      }

      // Fetch AI signals for popular assets
      try {
        const response = await getPopularAISignals();
        if (response.data && response.data.popular_signals) {
          const signals = Object.entries(response.data.popular_signals).map(([symbol, signalData], index) => {
            if (!signalData.error) {
              return {
                id: index + 1,
                asset: symbol,
                signal: signalData.signal.toUpperCase(),
                confidence: signalData.confidence,
                reason: signalData.recommendation.split('.')[0] || `${signalData.signal.toUpperCase()} signal for ${symbol}`,
                technicalAnalysis: signalData.recommendation || `${signalData.signal.toUpperCase()} signal for ${symbol}`,
                indicators: ['Technical Analysis', 'Machine Learning', 'Pattern Recognition'],
                targetPrice: signalData.price * (signalData.signal === 'buy' ? 1.05 : signalData.signal === 'sell' ? 0.95 : 1.02),
                stopLoss: signalData.price * (signalData.signal === 'buy' ? 0.98 : signalData.signal === 'sell' ? 1.02 : 0.99),
                timeFrame: signalData.timeframe || 'Short-term (1-3 days)'
              };
            }
            return null; // Skip assets with errors
          }).filter(Boolean); // Remove null entries
                
          // Only update state if component is still mounted
          if (isMounted) {
            setAiSignals(signals);
          }
        }
      } catch (error) {
        console.error('Error fetching AI signals:', error);
              
        // Fallback to initial signals if API fails
        const initialSignals = [
          { 
            id: 1, 
            asset: 'AAPL', 
            signal: 'BUY', 
            confidence: 85, 
            reason: 'RSI divergence bullish',
            technicalAnalysis: 'The Relative Strength Index shows a bullish divergence pattern with price making lower lows while RSI makes higher lows, indicating potential reversal to the upside.',
            indicators: ['RSI', 'MACD', 'Moving Averages'],
            targetPrice: 165.50,
            stopLoss: 145.00,
            timeFrame: 'Short-term (1-3 days)'
          },
          { 
            id: 2, 
            asset: 'TSLA', 
            signal: 'SELL', 
            confidence: 78, 
            reason: 'Overbought conditions',
            technicalAnalysis: 'Price is trading above the upper Bollinger Band with RSI above 70, indicating overbought conditions and potential for pullback.',
            indicators: ['RSI', 'Bollinger Bands', 'Stochastic'],
            targetPrice: 220.00,
            stopLoss: 265.00,
            timeFrame: 'Medium-term (3-7 days)'
          },
          { 
            id: 3, 
            asset: 'IAM', 
            signal: 'BUY', 
            confidence: 92, 
            reason: 'Support level holding',
            technicalAnalysis: 'Price has found strong support at the 78.00 level with increasing volume on bounce, suggesting institutional accumulation.',
            indicators: ['Support/Resistance', 'Volume Profile', 'Moving Averages'],
            targetPrice: 82.50,
            stopLoss: 75.00,
            timeFrame: 'Medium-term (1-2 weeks)'
          },
          { 
            id: 4, 
            asset: 'ATW', 
            signal: 'HOLD', 
            confidence: 65, 
            reason: 'Consolidation phase',
            technicalAnalysis: 'Price is trading in a tight range between 1240 and 1260 with low volatility, awaiting breakout direction.',
            indicators: ['Bollinger Bands', 'ATR', 'Volume'],
            targetPrice: 1270.0,
            stopLoss: 1230.0,
            timeFrame: 'Short-term (1-2 days)'
          },
          { 
            id: 5, 
            asset: 'BTC-USD', 
            signal: 'BUY', 
            confidence: 82, 
            reason: 'Positive momentum',
            technicalAnalysis: 'Cryptocurrency showing positive momentum with increased trading volume.',
            indicators: ['Momentum', 'Volume', 'Volatility'],
            targetPrice: 46000.00,
            stopLoss: 42000.00,
            timeFrame: 'Medium-term (1-2 weeks)'
          },
        ];
              
        // Only update state if component is still mounted
        if (isMounted) {
          setAiSignals(initialSignals);
        }
      }
    };
    
    initializeDashboard();
    
    return () => {
      isMounted = false; // Cleanup function to prevent state updates on unmounted component
    };
  }, [calculateTechnicalIndicators]);

  // Effect to periodically update price
  useEffect(() => {
    let interval;
    interval = setInterval(async () => {
      try {
        // Simulate price changes more realistically
        const lastPrice = currentPrice;
        const volatility = 0.005; // 0.5% volatility
        const changePercent = (Math.random() - 0.5) * 2 * volatility; // Random change between -volatility and +volatility
        const newPrice = lastPrice * (1 + changePercent);
        
        setCurrentPrice(parseFloat(newPrice.toFixed(2)));
        
        // Update chart with new data point
        setChartData(prevData => {
          const newData = [...prevData];
          if (newData.length >= 50) {
            newData.shift(); // Remove oldest data point
          }
          
          // Calculate high, low based on the price movement
          const high = Math.max(lastPrice, newPrice) * (1 + Math.random() * 0.005);
          const low = Math.min(lastPrice, newPrice) * (1 - Math.random() * 0.005);
          const open = prevData.length > 0 ? prevData[prevData.length - 1].price : lastPrice;
          
          newData.push({
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
            price: parseFloat(newPrice.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            volume: Math.floor(Math.random() * 1000000) + 500000,
            open: parseFloat(open.toFixed(2))
          });
          return newData;
        });
      } catch (error) {
        console.error('Error updating price:', error);
      }
    }, 5000); // Update every 5 seconds for more dynamic movement
    
    return () => clearInterval(interval);
  }, [selectedAsset, currentPrice]);

  // Effect to load AI signals
  useEffect(() => {
    const loadAISignals = async () => {
      try {
        const signalsResponse = await getMultipleAISignals([selectedAsset]);
        setAiSignals(Array.isArray(signalsResponse.data.signals) ? signalsResponse.data.signals : []);
      } catch (error) {
        console.error('Error loading AI signals:', error);
      }
    };
    
    if (selectedAsset) {
      loadAISignals();
    }
  }, [selectedAsset]);

  // Memoized chart data
  const memoizedChartData = useMemo(() => {
    return chartData.map((point, index) => ({
      ...point,
      index
    }));
  }, [chartData]);

  // Function to execute a trade
  const executeTrade = async (type) => {
    setIsLoading(true);
    try {
      const tradeValue = currentPrice * tradeSize;
      
      // In a real implementation, this would call the backend API
      // For demo purposes, we'll simulate the trade
      if (type === 'buy') {
        const newBalance = balance - tradeValue;
        setBalance(newBalance);
        setPortfolioValue(portfolioValue + tradeValue);
      } else if (type === 'sell') {
        const newBalance = balance + tradeValue;
        setBalance(newBalance);
        setPortfolioValue(portfolioValue - tradeValue);
      }
      
      // Create the new trade record
      const newTrade = {
        id: Date.now(), // Use timestamp as unique ID
        asset: selectedAsset,
        type,
        price: currentPrice,
        quantity: tradeSize,
        value: tradeValue,
        timestamp: new Date().toISOString(),
        // Add fields that match the TradeHistoryPage format
        trade_id: Date.now(),
        asset_name: selectedAsset,
        entry_price: currentPrice,
      };
      
      // Add trade to the local trade history
      setTrades(prev => [newTrade, ...prev]);
      
      // Save trade to localStorage for persistence across sessions and to sync with TradeHistoryPage
      const existingTrades = JSON.parse(localStorage.getItem('tradeHistory') || '[]');
      const updatedTrades = [newTrade, ...existingTrades];
      localStorage.setItem('tradeHistory', JSON.stringify(updatedTrades));
      
      // Show success message
      alert(`${type.toUpperCase()} order executed for ${tradeSize} shares of ${selectedAsset} at $${currentPrice.toFixed(2)} per share`);
    } catch (error) {
      console.error('Error executing trade:', error);
      alert('Error executing trade');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle asset selection
  const handleAssetChange = (event) => {
    setSelectedAsset(event.target.value);
  };

  // Function to handle trade size change
  const handleTradeSizeChange = (event) => {
    setTradeSize(Number(event.target.value));
  };

  // Function to show detailed signal
  const showDetailedSignalDialog = (signal) => {
    setDetailedSignal(signal);
    setShowDetailedSignal(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1e3c72' }}>
        TradeSense AI Trading Dashboard
      </Typography>
      
      {/* Account Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper sx={{ bgcolor: '#e3f2fd' }}>
            <AccountBalanceWallet sx={{ fontSize: 40, color: '#1e3c72', mb: 1 }} />
            <Typography variant="h6" gutterBottom>Account Balance</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e3c72' }}>${balance.toLocaleString()}</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper sx={{ bgcolor: '#f3e5f5' }}>
            <TrendingUp sx={{ fontSize: 40, color: '#7b1fa2', mb: 1 }} />
            <Typography variant="h6" gutterBottom>Portfolio Value</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#7b1fa2' }}>${portfolioValue.toLocaleString()}</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper sx={{ bgcolor: '#e8f5e9' }}>
            <ShoppingCart sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
            <Typography variant="h6" gutterBottom>Total Trades</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#388e3c' }}>{trades.length}</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper sx={{ bgcolor: '#fff3e0' }}>
            <Typography variant="h6" gutterBottom>Challenge Status</Typography>
            <Chip 
              label="TRADING"
              color="info" 
              size="large" 
              sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
            />
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Main Dashboard Grid */}
      <Grid container spacing={3}>
        {/* Chart Preview Card */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              {selectedAsset} Price Chart
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', flexDirection: 'column' }}>
              <Typography variant="h5" sx={{ color: '#1e3c72', mb: 2 }}>
                ${currentPrice.toFixed(2)}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Current {selectedAsset} Price
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={() => window.location.href = '/chart'}
                sx={{ mt: 2 }}
              >
                View Full Chart
              </Button>
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Asset</InputLabel>
                  <Select
                    value={selectedAsset}
                    label="Asset"
                    onChange={handleAssetChange}
                  >
                    <MenuItem value="AAPL">Apple (AAPL)</MenuItem>
                    <MenuItem value="TSLA">Tesla (TSLA)</MenuItem>
                    <MenuItem value="MSFT">Microsoft (MSFT)</MenuItem>
                    <MenuItem value="GOOGL">Google (GOOGL)</MenuItem>
                    <MenuItem value="AMZN">Amazon (AMZN)</MenuItem>
                    <MenuItem value="NVDA">NVIDIA (NVDA)</MenuItem>
                    <MenuItem value="IAM">IAM</MenuItem>
                    <MenuItem value="ATW">ATW</MenuItem>
                    <MenuItem value="BTC-USD">Bitcoin (BTC-USD)</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Indicator</InputLabel>
                  <Select
                    value={selectedIndicator}
                    label="Indicator"
                    onChange={(e) => setSelectedIndicator(e.target.value)}
                  >
                    <MenuItem value="sma">SMA</MenuItem>
                    <MenuItem value="ema">EMA</MenuItem>
                    <MenuItem value="rsi">RSI</MenuItem>
                    <MenuItem value="bollinger">Bollinger Bands</MenuItem>
                    <MenuItem value="macd">MACD</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Trading Panel */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Trading Panel
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                Current Price: <strong>${currentPrice.toFixed(2)}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Selected Asset: {selectedAsset}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Trade Size (Shares)"
                type="number"
                value={tradeSize}
                onChange={handleTradeSizeChange}
                InputProps={{ inputProps: { min: 1, max: 1000 } }}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Estimated Value: ${(currentPrice * tradeSize).toFixed(2)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => executeTrade('buy')}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <TrendingUp />}
                fullWidth
              >
                {isLoading ? 'Processing...' : 'BUY'}
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => executeTrade('sell')}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <TrendingDown />}
                fullWidth
              >
                {isLoading ? 'Processing...' : 'SELL'}
              </Button>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Quick Stats
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary={`Balance: $${balance.toLocaleString()}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Challenge: N/A" />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Trades: ${trades.length}`} />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Trading Panel and AI Signals Row */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Trading Panel
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    Current Price: <strong>${currentPrice.toFixed(2)}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Selected Asset: {selectedAsset}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Trade Size (Shares)"
                    type="number"
                    value={tradeSize}
                    onChange={handleTradeSizeChange}
                    InputProps={{ inputProps: { min: 1, max: 1000 } }}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Estimated Value: ${(currentPrice * tradeSize).toFixed(2)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => executeTrade('buy')}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <TrendingUp />}
                    fullWidth
                  >
                    {isLoading ? 'Processing...' : 'BUY'}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => executeTrade('sell')}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <TrendingDown />}
                    fullWidth
                  >
                    {isLoading ? 'Processing...' : 'SELL'}
                  </Button>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Quick Stats
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary={`Balance: $${balance.toLocaleString()}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Challenge: N/A" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`Trades: ${trades.length}`} />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  AI Trading Signals
                </Typography>
                <Grid container spacing={2}>
                  {aiSignals.slice(0, 6).map((signal) => (
                    <Grid item xs={12} sm={6} md={2} key={signal.id}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          border: '1px solid #ddd', 
                          borderRadius: 1,
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: '#f5f5f5' },
                          backgroundColor: signal.signal === 'BUY' ? '#e8f5e9' : 
                                          signal.signal === 'SELL' ? '#ffebee' : '#fff3e0'
                        }}
                        onClick={() => showDetailedSignalDialog(signal)}
                      >
                        <Typography variant="subtitle2">{signal.asset}</Typography>
                        <SignalChip 
                          label={signal.signal} 
                          color={signal.signal === 'BUY' ? 'success' : signal.signal === 'SELL' ? 'error' : 'warning'}
                          size="small"
                        />
                        <Typography variant="body2">Conf: {signal.confidence}%</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Trades and Market Overview Row */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Trades
                </Typography>
                <List>
                  {trades.slice(0, 5).map((trade) => (
                    <ListItem key={trade.id} divider>
                      <ListItemText
                        primary={`${trade.type.toUpperCase()} ${trade.quantity} shares of ${trade.asset}`}
                        secondary={`$${trade.price.toFixed(2)} × ${trade.quantity} = $${trade.value.toFixed(2)} • ${new Date(trade.timestamp).toLocaleTimeString()}`}
                      />
                      <Chip 
                        label={trade.type} 
                        color={trade.type === 'buy' ? 'success' : 'error'} 
                        size="small" 
                      />
                    </ListItem>
                  ))}
                  {trades.length === 0 && (
                    <ListItem>
                      <ListItemText primary="No trades yet. Execute your first trade!" />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Market Overview
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">S&P 500</Typography>
                    <Typography variant="body1"><strong>+0.78%</strong></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">NASDAQ</Typography>
                    <Typography variant="body1"><strong>+1.23%</strong></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">DOW JONES</Typography>
                    <Typography variant="body1"><strong>+0.45%</strong></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">VIX</Typography>
                    <Typography variant="body1"><strong>18.2</strong></Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Detailed Signal Dialog */}
      <Dialog 
        open={showDetailedSignal} 
        onClose={() => setShowDetailedSignal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {detailedSignal?.asset} Analysis
          <IconButton
            aria-label="close"
            onClick={() => setShowDetailedSignal(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {detailedSignal && (
            <Box>
              <Chip 
                label={detailedSignal.signal} 
                color={detailedSignal.signal === 'BUY' ? 'success' : detailedSignal.signal === 'SELL' ? 'error' : 'warning'}
                size="large"
                sx={{ mb: 2, fontSize: '1.2rem', fontWeight: 'bold' }}
              />
              <Typography variant="h6" gutterBottom>
                Confidence: {detailedSignal.confidence}%
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Reason:</strong> {detailedSignal.reason}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Technical Analysis:</strong> {detailedSignal.technicalAnalysis}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Indicators:</strong> {detailedSignal.indicators.join(', ')}
              </Typography>
              <Typography variant="body2">
                <strong>Target Price:</strong> ${detailedSignal.targetPrice.toFixed(2)} | 
                <strong> Stop Loss:</strong> ${detailedSignal.stopLoss.toFixed(2)} | 
                <strong> Time Frame:</strong> {detailedSignal.timeFrame}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetailedSignal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const Dashboard = () => {
  const { user, loading: userLoading, isAuthenticated } = useUserContext();
  const navigate = useNavigate();

  // Check authentication status and redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, userLoading, navigate]);

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6" align="center">
          Loading...
        </Typography>
      </Container>
    );
  }

  // If not authenticated, don't render the dashboard content
  if (!isAuthenticated) {
    return null;
  }

  // Render the main dashboard content if authenticated
  return <DashboardContent />;
};

export default Dashboard;
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton
} from '@mui/material';
import { 
  ComposedChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  ReferenceLine,
  Tooltip
} from 'recharts';
import { styled } from '@mui/system';
import { getPrice } from '../utils/api';
import { useAppContext } from '../contexts/AppContext';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
}));

const ChartPage = () => {
  const { t } = useAppContext();
  const { user, loading: userLoading, isAuthenticated } = useUserContext();
  const navigate = useNavigate();

  // State hooks
  const [currentPrice, setCurrentPrice] = useState(150.25);
  const [selectedAsset, setSelectedAsset] = useState('AAPL');
  const [selectedIndicator, setSelectedIndicator] = useState('sma'); // Simple Moving Average
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Initialize chart data
  useEffect(() => {
    let isMounted = true; // Track if component is still mounted
    
    const initializeChart = async () => {
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
        setChartData(updatedData);
      }
    };
    
    initializeChart();
    
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

  // Memoized chart data
  const memoizedChartData = useMemo(() => {
    return chartData.map((point, index) => ({
      ...point,
      index
    }));
  }, [chartData]);

  // Handle asset change
  const handleAssetChange = (event) => {
    setSelectedAsset(event.target.value);
  };

  // Handle indicator change
  const handleIndicatorChange = (event) => {
    setSelectedIndicator(event.target.value);
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

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

  // If not authenticated, don't render the chart content
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBackToDashboard} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1e3c72', flex: 1 }}>
          {selectedAsset} Price Chart
        </Typography>
      </Box>
      
      <Paper sx={{ p: 2, height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6">
            {selectedAsset} Price Chart
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
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
                onChange={handleIndicatorChange}
              >
                <MenuItem value="sma">SMA</MenuItem>
                <MenuItem value="ema">EMA</MenuItem>
                <MenuItem value="rsi">RSI</MenuItem>
                <MenuItem value="bollinger">Bollinger Bands</MenuItem>
                <MenuItem value="macd">MACD</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" onClick={handleBackToDashboard}>
              Back to Dashboard
            </Button>
          </Box>
        </Box>
        
        <ResponsiveContainer width="100%" height={700}>
          <ComposedChart
            data={memoizedChartData}
            margin={{ top: 10, right: 30, left: 50, bottom: 80 }}
            animationBegin={0}
            animationDuration={300}
            animationEasing="ease-in-out"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 14 }}
              interval={Math.max(0, Math.floor(memoizedChartData.length / 15))}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tick={{ fontSize: 14 }}
              tickFormatter={(value) => `$${value}`}
              width={80}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
              labelFormatter={(label) => `Time: ${label}`}
              contentStyle={{ fontSize: '14px' }}
            />
            <ReferenceLine y={0} stroke="#000" />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#8884d8" 
              strokeWidth={3} 
              dot={false}
              isAnimationActive={true}
              animationDuration={300}
            />
            {selectedIndicator === 'sma' && <Line 
              type="monotone" 
              dataKey="sma" 
              stroke="#82ca9d" 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={true}
              animationDuration={300}
            />}
            {selectedIndicator === 'ema' && <Line 
              type="monotone" 
              dataKey="ema" 
              stroke="#ffc658" 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={true}
              animationDuration={300}
            />}
            {selectedIndicator === 'bollinger' && (
              <>
                <Line 
                  type="monotone" 
                  dataKey="bbUpper" 
                  stroke="#ff7300" 
                  strokeWidth={1} 
                  strokeDasharray="3 3" 
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={300}
                />
                <Line 
                  type="monotone" 
                  dataKey="bbLower" 
                  stroke="#ff7300" 
                  strokeWidth={1} 
                  strokeDasharray="3 3" 
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={300}
                />
                <Line 
                  type="monotone" 
                  dataKey="bbMiddle" 
                  stroke="#ff7300" 
                  strokeWidth={1} 
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={300}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </Paper>
    </Container>
  );
};

export default ChartPage;
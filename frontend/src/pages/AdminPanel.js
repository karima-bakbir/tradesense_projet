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
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useAppContext } from '../contexts/AppContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

const AdminPanel = () => {
  const { t } = useAppContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/admin');
        setUsers(response.data.users);
        setLoading(false);
      } catch (err) {
        setError(t.fetchUsersError || 'Erreur lors du chargement des utilisateurs');
        setLoading(false);
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleStatusChange = (user) => {
    setSelectedUser(user);
    setNewStatus(user.challenge_status || 'active');
    setShowUpdateDialog(true);
  };

  const updateStatus = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/admin/user/${selectedUser.user_id}/update-status`, {
        status: newStatus
      });

      // Update the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.user_id === selectedUser.user_id 
            ? { ...user, challenge_status: newStatus } 
            : user
        )
      );

      setShowUpdateDialog(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error updating user status:', err);
      alert(t.updateStatusError || 'Erreur lors de la mise à jour du statut');
    }
  };

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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">{t.loadingUsers}</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {t.adminPanel}
      </Typography>
      
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {t.userManagement}
      </Typography>

      <StyledPaper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t.userId}</TableCell>
                <TableCell>{t.username}</TableCell>
                <TableCell>{t.email}</TableCell>
                <TableCell>{t.challengeId}</TableCell>
                <TableCell>{t.challengeStatus}</TableCell>
                <TableCell>{t.currentBalance}</TableCell>
                <TableCell>{t.initialBalance}</TableCell>
                <TableCell align="center">{t.actions}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.user_id} hover>
                  <TableCell>{user.user_id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.challenge_id || t.nA}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.challenge_status === 'funded' ? t.funded : 
                             user.challenge_status === 'active' ? t.active : 
                             user.challenge_status === 'failed' ? t.failed : t.noChallenge}
                      color={getStatusColor(user.challenge_status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.current_balance ? `$${user.current_balance.toFixed(2)}` : t.nA}</TableCell>
                  <TableCell>{user.initial_balance ? `$${user.initial_balance.toFixed(2)}` : t.nA}</TableCell>
                  <TableCell align="center">
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => handleStatusChange(user)}
                      disabled={!user.challenge_id}
                    >
                      {t.modify}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledPaper>

      {/* Update Status Dialog */}
      <Dialog open={showUpdateDialog} onClose={() => setShowUpdateDialog(false)}>
        <DialogTitle>{t.updateChallengeStatus}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              {t.user}: <strong>{selectedUser?.username}</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {t.challengeId}: {selectedUser?.challenge_id}
            </Typography>
            
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>{t.status}</InputLabel>
              <Select
                value={newStatus}
                label={t.status}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="active">{t.active}</MenuItem>
                <MenuItem value="failed">{t.failed}</MenuItem>
                <MenuItem value="funded">{t.funded}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateDialog(false)}>{t.cancel}</Button>
          <Button onClick={updateStatus} variant="contained" color="primary">
            {t.update}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPanel;
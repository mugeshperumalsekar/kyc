import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Box, Container, Button, Grid } from '@mui/material';
import Header from '../../layouts/header/header';

const ChangePassword: React.FC = () => {
  const [loginId, setLoginId] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post<{ message: string }>('http://localhost:8081/api/reset', {
        loginId,
        oldPassword,
        newPassword,
      });
      const { message } = response.data;
      alert(message);
      setLoginId('');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage('');
      navigate('/changepassword');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <>
      <Header />
      <div style={{ marginTop: '10%', marginLeft: '2%' }}>
        <Box m={2}>
          <Container>
            <h4>CHANGE PASSWORD</h4>
            {errorMessage && <p>{errorMessage}</p>}
            <form className="form-container">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    label="Email Id"
                    name="name"
                    variant="outlined"
                    value={loginId}
                    onChange={(e) => {
                      setLoginId(e.target.value);
                    }}
                    margin="dense"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    label="Old Password"
                    name="password"
                    variant="outlined"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    margin="dense"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    label="New Password"
                    name="password"
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    margin="dense"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    label="Confirm Password"
                    name="password"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    margin="dense"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <br />
              <Grid container justifyContent="center">
                <Grid item xs={12} sm={6} md={3}>
                  <Button variant="contained" color="primary" onClick={handleChangePassword}>
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Container>
        </Box>
      </div>
    </>
  );
};

export default ChangePassword;

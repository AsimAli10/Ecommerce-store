// Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import useStyles from './styles';
import {
    Typography,
    TextField,
    Button,
    Container,
    Paper,
  } from '@material-ui/core';

  const Login = () => {
    const classes = useStyles();
  
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setError(null);
  
      try {
        const response = await axios.post('http://localhost:5000/admin/login', {
          username,
          password,
        });
  
        if (response.data.success) {
          // Redirect to admin dashboard
          window.location.href = '/admin';
        }
      } catch (error) {
        setError('Invalid credentials');
      }
    };
  
    return (
      <Container maxWidth="sm">
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Admin Login
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    );
  };
  
  export default Login;
  
  
  
  
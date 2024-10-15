import React, { useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import LandingBanner from './components/LandingBanner';
import { rightAuthContainer, transitionAuthContainer } from './style';
import { useAlert } from '../../context/AlertsContext';
import Register from './Register';
import Login from './Login';
import theme from '../../utils/theme';

const AuthPage: React.FC = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { action } = useParams();

  useEffect(() => {
    if (!action || !['login', 'register'].includes(action)) {
      navigate('/auth/login');
      showAlert({
        message:
          'Route does not exist or you do not have the privileges to access this page.',
        severity: 'error',
      });
    }
  }, [action, navigate, showAlert]);

  const isXsScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box display="flex">
      {!isXsScreen && (
        <LandingBanner
          heading={
            action === 'login'
              ? 'Glad to have you back'
              : 'Welcome to Ecometrics'
          }
        />
      )}
      <Box flexGrow={1} sx={rightAuthContainer}>
        <Box sx={transitionAuthContainer(action)}>
          <Login />
          <Register />
        </Box>
      </Box>
    </Box>
  );
};

export default AuthPage;

import React, { useState, FormEvent, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  Button,
  Typography,
  CircularProgress,
  Box,
  useMediaQuery,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import PasswordField from '../components/PasswordField';
import InputField from '../../../components/InputField';
import {
  forgotPasswordStyle,
  loginButtonStyle,
  loginTitleStyle,
} from './style';
import { useAlert } from '../../../context/AlertsContext';
import { authContainer, authContentContainer } from '../style';
import { useAuth } from '../../../context/UserContext';
import { useThemeContext } from '../../../context/ThemeContextProvider';
import theme from '../../../utils/theme';

/**
 * React functional component for a login page.
 * @returns {ReactElement} React element representing the Login component.
 */
const Login: React.FC = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [processingLogin, setProcessingLogin] = useState<boolean>(false);

  /**
   * Handles the login process.
   * @param {FormEvent<HTMLFormElement>} event - The form submit event.
   * @returns {void}
   */
  const login = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    setProcessingLogin(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        showAlert({
          message: `Logged in with ${userCredential.user.email}`,
          severity: 'success',
        });
        navigate('/');
      })
      .catch(() => {
        showAlert({
          message: 'Incorrect email or password',
          severity: 'error',
        });
        setProcessingLogin(false);
      });
  };

  /**
   * Resets fields on site navigation.
   */
  useEffect(() => {
    setEmail('');
    setPassword('');
    setProcessingLogin(false);
  }, [navigate]);

  const { mode, toggleMode } = useThemeContext();
  useEffect(() => {
    mode === 'dark' && toggleMode(); // eslint-disable-next-line
  }, []);
  const isXsScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={authContainer}>
      <Box sx={authContentContainer}>
        <Typography variant="h1" sx={loginTitleStyle}>
          Log into your Ecometrics account
        </Typography>
        <form onSubmit={login}>
          <InputField
            label="Email Address"
            name="email"
            value={email}
            setValue={setEmail}
            autoFill="email"
          />
          <PasswordField
            name="password"
            label="Password"
            password={password}
            setPassword={setPassword}
          />

          <Typography variant="subtitle1" sx={forgotPasswordStyle}>
            <Link to={'/forgot-password'} style={{ color: 'inherit' }}>
              Forgot Password?
            </Link>
          </Typography>
          <Box sx={loginButtonStyle}>
            {processingLogin ? (
              <CircularProgress />
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size={isXsScreen ? 'small' : 'medium'}
              >
                Login
              </Button>
            )}
          </Box>
        </form>
        <Typography variant="subtitle1" color="#64748b" m="20px 0">
          Don't have an account?{' '}
          <Typography
            component="span"
            variant="subtitle1"
            color="primary.main"
            fontWeight="500"
          >
            <Link to={'/auth/register'} style={{ color: 'inherit' }}>
              Create free account
            </Link>
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;

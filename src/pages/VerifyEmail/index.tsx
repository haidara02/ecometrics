import React, { useEffect, useState } from 'react';
import { sendEmailVerification, AuthError } from 'firebase/auth';
import {
  Button,
  Container,
  Typography,
  CircularProgress,
  Stack,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../context/AlertsContext';
import logo from '../../assets/logo.svg';
import { useAuth } from '../../context/UserContext';

/**
 * React functional component for handling user password reset.
 * @returns {ReactElement} React element representing the ForgotPasswordPage component.
 */
const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { auth } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);

  /**
   * Sends a verification email to the user's email address.
   */
  const sendEmail = () => {
    if (sendingEmail) return;
    setLoading(true);
    setSendingEmail(true);

    if (auth?.currentUser && !auth.currentUser.emailVerified) {
      sendEmailVerification(auth.currentUser)
        .then(() => {
          showAlert({
            message: `"Verification email sent to ${auth.currentUser?.email}. Please check your inbox.`,
            severity: 'success',
          });
        })
        .catch((error: AuthError) => {
          showAlert({
            message: `"Error resending verification email: ${error.message}`,
            severity: 'error',
          });
          sendEmail();
        });
    }
  };

  /**
   * Awaits email verification every 5 seconds.
   * Navigates to homepage once verified.
   */
  useEffect(() => {
    // check every 5 seconds if email was verified
    const interval = setInterval(() => {
      if (auth?.currentUser) {
        auth.currentUser.reload().then(() => {
          if (auth?.currentUser?.emailVerified) {
            setLoading(false);
            navigate('/');
            clearInterval(interval);
          }
        });
      }
      setSendingEmail(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [auth.currentUser, navigate]);

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ textAlign: 'center', m: '100px auto' }}
    >
      <Box p="10px" component="img" src={logo} alt="Company Logo" width={100} />
      <Typography component="h1" variant="h2">
        Verify Your Email Address
      </Typography>
      <Typography variant="body1" style={{ marginBottom: '20px' }}>
        Click the button below to send an verification email and then click the
        link in the email to verify your account.
      </Typography>
      {loading ? (
        <Stack gap="20px">
          <Button
            variant="contained"
            disabled={sendingEmail}
            onClick={sendEmail}
          >
            Resend Email
          </Button>
          <CircularProgress sx={{ m: 'auto' }} />
        </Stack>
      ) : (
        <Button variant="contained" fullWidth onClick={sendEmail}>
          Send Email
        </Button>
      )}
    </Container>
  );
};

export default VerifyEmail;

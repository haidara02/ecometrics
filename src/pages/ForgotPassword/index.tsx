import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Button, Container, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import InputField from '../../components/InputField';
import { useAlert } from '../../context/AlertsContext';
import logo from '../../assets/logo.svg';
import { useAuth } from '../../context/UserContext';

/**
 * React functional component for handling user password reset.
 * @returns {ReactElement} React element representing the ForgotPasswordPage component.
 */
const ForgotPasswordPage: React.FC = () => {
  const { showAlert } = useAlert();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');

  /**
   * Handles form submission to send a password reset email.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    sendPasswordResetEmail(auth, email)
      .then(() => {
        showAlert({
          message: `A link to reset your password has been sent to ${email}.`,
          severity: 'success',
        });
        navigate('/auth/login');
      })
      .catch((error) => {
        showAlert({
          message:
            error.code === 'auth/user-not-found'
              ? 'No user found with this email.'
              : 'Failed to send password reset email. Please try again later.',
          severity: 'error',
        });
      });
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ m: '100px auto' }}>
      <Box p="10px" component="img" src={logo} alt="Company Logo" width={100} />
      <Typography component="h1" variant="h2">
        Forgot Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <InputField
          name="email"
          label="Please enter your email address, we will send you a link to reset your password."
          value={email}
          setValue={setEmail}
          autoFill="email"
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          Send Reset Email
        </Button>
      </form>
      <Typography
        component="span"
        variant="subtitle1"
        color="primary.main"
        fontWeight="500"
      >
        <Link to={'/auth/login'} style={{ color: 'inherit' }}>
          Back to Login
        </Link>
      </Typography>
    </Container>
  );
};

export default ForgotPasswordPage;

import React, { FormEvent, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Button, Typography, CircularProgress, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import PasswordField from '../components/PasswordField';
import { signUpButtonStyle, registerTitleStyle, signUpSubText } from './style';
import InputField from '../../../components/InputField';
import {
  getFirebaseErrorMsg,
  isPasswordValid,
  isValidFullName,
} from '../../../utils/helpers';
import NewPasswordField from '../components/NewPasswordField';
import { useAlert } from '../../../context/AlertsContext';
import { authContainer, authContentContainer } from '../style';
import { useAuth } from '../../../context/UserContext';
import { useThemeContext } from '../../../context/ThemeContextProvider';
import { addNewUser } from '../../../services/firebase';

/**
 * React functional component for a registration page.
 * @returns {ReactElement} React element representing the Register component.
 */
const Register: React.FC = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { auth } = useAuth();

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [confirmPassError, setConfirmPassError] = useState<string>('');

  const [processingRegister, setProcessingRegister] = useState<boolean>(false);

  const handleNameBlur = () => {
    if (!isValidFullName(fullName))
      setNameError('Please enter a valid full name e.g. John Smith');
  };

  const handleEmailBlur = () => {
    if (email.match(/.+@.+\.[^@]+/g)?.length !== 1)
      setEmailError('Please enter a valid email e.g. example@email.com');
  };

  const handleConfirmPassBlur = () => {
    if (password !== confirmPassword)
      setConfirmPassError('Passwords do not match.');
  };

  /**
   * Handles the register process.
   * @param {FormEvent<HTMLFormElement>} event - The form submit event.
   * @returns {void}
   */
  const register = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    setProcessingRegister(true);
    if (
      !isPasswordValid(password) ||
      nameError ||
      emailError ||
      confirmPassError
    ) {
      showAlert({
        message: 'At least one of the inputs are not valid.',
        severity: 'warning',
      });
      setProcessingRegister(false);
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        showAlert({
          message: `Account created successfully.`,
          severity: 'success',
        });
        addNewUser(userCredential.user);
        return updateProfile(userCredential.user, { displayName: fullName });
      })
      .catch((error) => {
        showAlert({
          message: `${getFirebaseErrorMsg(error.message)}`,
          severity: 'error',
        });
      });
  };

  /**
   * Resets fields on site navigation.
   */
  useEffect(() => {
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');

    setNameError('');
    setEmailError('');
    setConfirmPassError('');
  }, [navigate]);

  const { mode, toggleMode } = useThemeContext();
  useEffect(() => {
    mode === 'dark' && toggleMode(); // eslint-disable-next-line
  }, []);

  return (
    <Box sx={authContainer}>
      <Box sx={authContentContainer}>
        <Typography variant="h1" sx={registerTitleStyle}>
          Join Ecometrics
        </Typography>
        <Typography sx={signUpSubText}>
          The go-to solution for responsible and impactful investing
        </Typography>
        <form onSubmit={register}>
          <InputField
            label="Full Name"
            name="name"
            autoFill="name"
            value={fullName}
            setValue={setFullName}
            handleBlur={handleNameBlur}
            errorMsg={nameError}
            setErrorMsg={setNameError}
            required
          />
          <InputField
            label="Email Address"
            name="reg-email"
            autoFill="email"
            value={email}
            setValue={setEmail}
            errorMsg={emailError}
            setErrorMsg={setEmailError}
            handleBlur={handleEmailBlur}
            required
          />
          <NewPasswordField
            password={password}
            setPassword={setPassword}
            label="Password"
          />
          <PasswordField
            name="confirm-password"
            label="Confirm Password"
            password={confirmPassword}
            setPassword={setConfirmPassword}
            errorMsg={confirmPassError}
            setErrorMsg={setConfirmPassError}
            handleBlur={handleConfirmPassBlur}
          />

          <Box sx={signUpButtonStyle}>
            {processingRegister ? (
              <CircularProgress />
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={!fullName || !email || !password || !confirmPassword}
              >
                Sign Up
              </Button>
            )}
          </Box>
        </form>
        <Typography variant="subtitle1" color="#64748b" m="20px 0">
          Already have an account?
          <Link to={'/auth/login'} style={{ color: 'inherit' }}>
            <Typography
              component="span"
              variant="subtitle1"
              color="primary.main"
              fontWeight="500"
            >
              Login
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;

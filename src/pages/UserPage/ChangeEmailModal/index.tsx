import { Button, Stack, Typography } from '@mui/material';
import InputField from '../../../components/InputField';
import { useEffect, useState } from 'react';
import EcometricsDialog from '../../../components/EcometricsDialog';
import PasswordField from '../../Auth/components/PasswordField';
import {
  EmailAuthProvider,
  User,
  fetchSignInMethodsForEmail,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from '@firebase/auth';
import { isEmailValid } from '../../../utils/helpers';
import { useAuth } from '../../../context/UserContext';
import { useAlert } from '../../../context/AlertsContext';

interface ChangeEmailModalProps {
  user: User | null;
}

const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({ user }) => {
  const { auth } = useAuth();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);

  const handleBlur = (field: string) => {
    let allgood = true;
    if (
      (field === 'email' && email.match(/.+@.+\.[^@]+/g)?.length !== 1) ||
      email === ''
    ) {
      setEmailError('Please enter a valid email e.g. example@email.com');
      allgood = false;
    } else {
      setEmailError('');
    }
    if (field === 'password' && password === '') {
      setPasswordError('Please enter your password');
      allgood = false;
    } else {
      setPasswordError('');
    }
    setSubmitDisabled(!allgood);
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleUpdateEmail = async () => {
    if (email === user?.email) {
      showAlert({
        message: 'Email is the same as the current email',
        severity: 'error',
      });
      return;
    }
    if (user && isEmailValid(email)) {
      const credential = EmailAuthProvider.credential(
        user.email || '',
        password
      );
      reauthenticateWithCredential(user, credential)
        .then(() => fetchSignInMethodsForEmail(auth, email))
        .then((signInMethods) => {
          if (signInMethods.length !== 0) {
            showAlert({
              message: 'Email is already in use',
              severity: 'error',
            });
            handleClose();
            return;
          }
        })
        .then(() => verifyBeforeUpdateEmail(user, email))
        .then(() => {
          setConfirm(true);
          showAlert({
            message: `An email has been sent to ${email} to verify the email change.`,
            severity: 'success',
          });
        })
        .catch((error) => {
          if (error.code === 'auth/wrong-password') {
            showAlert({
              message: 'Password is incorrect',
              severity: 'error',
            });
          }
        });
    } else {
      showAlert({
        message: 'Please enter a valid email',
        severity: 'error',
      });
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  useEffect(() => {
    setEmail('');
    setPassword('');
    setEmailError('');
    setPasswordError('');
  }, [modalOpen]);

  return (
    <>
      {confirm ? (
        <EcometricsDialog
          open={modalOpen}
          handleClose={handleClose}
          title={'Verify Your Email Address'}
          actions={
            <Button variant="contained" type="submit" onClick={handleLogout}>
              Logout
            </Button>
          }
        >
          <Stack>
            <Typography variant="body1" style={{ marginBottom: '20px' }}>
              An verification email has been sent. Your email address will be
              changed once verified.
            </Typography>
          </Stack>
        </EcometricsDialog>
      ) : (
        <EcometricsDialog
          open={modalOpen}
          handleClose={handleClose}
          title={'Change Email'}
          actions={
            <Button
              variant="contained"
              type="submit"
              onClick={handleUpdateEmail}
              disabled={submitDisabled}
            >
              Update Email
            </Button>
          }
        >
          <form>
            <Stack onSubmit={handleUpdateEmail}>
              <InputField
                label="New Email Address"
                name="change-email"
                autoFill="email"
                required
                value={email}
                setValue={setEmail}
                errorMsg={emailError}
                setErrorMsg={setEmailError}
                handleBlur={() => handleBlur('name')}
              />

              <PasswordField
                name="enter-password"
                label="Enter Password"
                required
                password={password}
                setPassword={setPassword}
                setErrorMsg={setPasswordError}
                errorMsg={passwordError}
                handleBlur={() => handleBlur('password')}
              />
            </Stack>
          </form>
        </EcometricsDialog>
      )}
      <Button onClick={() => handleOpen()} variant="contained" fullWidth>
        Change Email
      </Button>
    </>
  );
};

export default ChangeEmailModal;

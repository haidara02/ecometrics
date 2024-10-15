import { Box, Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import EcometricsDialog from '../../../components/EcometricsDialog';
import PasswordField from '../../Auth/components/PasswordField';
import {
  EmailAuthProvider,
  User,
  reauthenticateWithCredential,
  updatePassword,
} from '@firebase/auth';
import { useAuth } from '../../../context/UserContext';
import { useAlert } from '../../../context/AlertsContext';
import NewPasswordField from '../../Auth/components/NewPasswordField';
import { getFirebaseErrorMsg, isPasswordValid } from '../../../utils/helpers';

interface ChangePasswordModalProps {
  user: User | null;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ user }) => {
  const { auth } = useAuth();
  const { showAlert } = useAlert();

  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [updating, setUpdating] = useState<boolean>(false);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleBlur = () => {
    let allgood = true;

    if (password === '') {
      setPasswordError('Please enter your password');
      allgood = false;
    } else {
      setPasswordError('');
    }

    if (!newPassword) {
      allgood = false;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      allgood = false;
    } else {
      setConfirmPasswordError('');
    }

    setSubmitDisabled(!allgood);
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      showAlert({
        message: 'Please enter a new password.',
        severity: 'error',
      });
      return;
    } else if (!isPasswordValid(newPassword)) {
      showAlert({
        message: 'Password is too weak.',
        severity: 'error',
      });
      return;
    } else if (password === newPassword) {
      showAlert({
        message: 'Current password and new password cannot be the same.',
        severity: 'error',
      });
      return;
    }

    if (user && user.email) {
      setUpdating(true);
      const credential = EmailAuthProvider.credential(user.email, password);
      reauthenticateWithCredential(user, credential)
        .then(() => updatePassword(user, newPassword))
        .then(() => {
          showAlert({
            message: 'Password updated successfully, please log back in',
            severity: 'success',
          });
          handleClose();
          auth.signOut();
        })
        .catch((error) => {
          setPasswordError('Password is incorrect');
          showAlert({
            message: getFirebaseErrorMsg(error.code),
            severity: 'error',
          });
          setUpdating(false);
        });
    }
  };

  useEffect(() => {
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setPasswordError('');
    setConfirmPasswordError('');
  }, []);

  return (
    <>
      <EcometricsDialog
        open={modalOpen}
        handleClose={handleClose}
        title={'Change Password'}
        actions={
          <>
            {updating ? (
              <Box height="54.5px">
                <CircularProgress />
              </Box>
            ) : (
              <Button
                variant="contained"
                type="submit"
                onClick={handleUpdatePassword}
                disabled={submitDisabled}
              >
                Update Password
              </Button>
            )}
          </>
        }
      >
        <form onSubmit={handleUpdatePassword}>
          <PasswordField
            name="password"
            label="Current Password"
            required
            password={password}
            setPassword={setPassword}
            errorMsg={passwordError}
            setErrorMsg={setPasswordError}
            handleBlur={handleBlur}
          />
          <NewPasswordField
            label="New Password"
            password={newPassword}
            setPassword={setNewPassword}
          />
          <PasswordField
            name="confirm-new-password"
            label="Confirm New Password"
            password={confirmPassword}
            errorMsg={confirmPasswordError}
            setErrorMsg={setConfirmPasswordError}
            handleBlur={handleBlur}
            setPassword={setConfirmPassword}
          />
        </form>
      </EcometricsDialog>
      <Button onClick={() => handleOpen()} variant="contained" fullWidth>
        Change Password
      </Button>
    </>
  );
};

export default ChangePasswordModal;

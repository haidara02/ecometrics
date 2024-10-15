import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import EcometricsDialog from '../../../components/EcometricsDialog';
import PasswordField from '../../Auth/components/PasswordField';
import {
  EmailAuthProvider,
  User,
  deleteUser,
  reauthenticateWithCredential,
} from '@firebase/auth';
import { useAlert } from '../../../context/AlertsContext';
import InputField from '../../../components/InputField';
import { getFirebaseErrorMsg } from '../../../utils/helpers';
import { removeUserData } from '../../../services/firebase';

interface DeleteAccountModalProps {
  user: User | null;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ user }) => {
  const { showAlert } = useAlert();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);

  const handleBlur = (field: string) => {
    let allgood = true;
    console.log(email === user?.email);
    if (field === 'email' && email !== user?.email) {
      setEmailError('Email does not match current one');
      allgood = false;
    } else if (field === 'email' && email) {
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

  const handleDeleteAccount = async () => {
    if (user) {
      const credential = EmailAuthProvider.credential(
        user.email || '',
        password
      );
      reauthenticateWithCredential(user, credential)
        .then(() => {
          deleteUser(user);
          removeUserData(user, 'new_users/metrics/');
          removeUserData(user, 'new_users/');
          removeUserData(user, 'user_photos/');
          showAlert({
            message: 'Account deleted succesfully',
            severity: 'success',
          });
        })
        .catch((error) => {
          showAlert({
            message: getFirebaseErrorMsg(error.code),
            severity: 'error',
          });
        });
    }
  };

  useEffect(() => {
    setEmail('');
    setPassword('');
    setEmailError('');
    setPasswordError('');
  }, []);

  return (
    <>
      <EcometricsDialog
        open={modalOpen}
        handleClose={handleClose}
        title={'Delete Account'}
        actions={
          <Button
            variant="outlined"
            color="error"
            type="submit"
            onClick={handleDeleteAccount}
            disabled={submitDisabled}
          >
            Delete
          </Button>
        }
      >
        <Typography variant="body1" style={{ marginBottom: '20px' }}>
          Enter your current email and password to delete your account. This
          cannot be undone.
        </Typography>
        <InputField
          label="Email Address"
          name="email"
          errorMsg={emailError}
          setErrorMsg={setEmailError}
          handleBlur={() => handleBlur('email')}
          value={email}
          setValue={setEmail}
        />

        <PasswordField
          name="password"
          label="Password"
          password={password}
          setPassword={setPassword}
          errorMsg={passwordError}
          setErrorMsg={setPasswordError}
          handleBlur={() => handleBlur('password')}
        />
      </EcometricsDialog>
      <Button
        onClick={() => handleOpen()}
        variant="outlined"
        color="error"
        fullWidth
      >
        Delete Account
      </Button>
    </>
  );
};

export default DeleteAccountModal;

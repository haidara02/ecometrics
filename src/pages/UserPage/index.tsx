import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/Navbar';
import {
  LoadingProgress,
  editAvatarHover,
  userAvatar,
  userProfileContainer,
} from './style';
import { useAuth } from '../../context/UserContext';
import { updateUserPhoto } from '../../services/firebase';
import { useAlert } from '../../context/AlertsContext';
import { User, updateProfile } from '@firebase/auth';
import { CheckRounded, EditRounded } from '@mui/icons-material';
import { greyScale } from '../../utils/theme';
import ChangeEmailModal from './ChangeEmailModal';
import ChangePasswordModal from './ChangePasswordModal';
import DeleteAccountModal from './DeleteAccountModal';
import { ring } from 'ldrs';
import { isValidFullName } from '../../utils/helpers';
import InputField from '../../components/InputField';

const UserProfile: React.FC = () => {
  const { auth } = useAuth();

  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');

  const [created, setCreated] = useState<Date>();
  const [editName, setEditName] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<
    string | null | undefined
  >('');
  const [loading, setLoading] = useState<boolean>(true);
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  const [hoverPfp, setHoverPfp] = useState<boolean>(false);

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 1 && user) {
      setImageLoading(true);
      setProfilePicture('');
      const photo = e.target.files[0];
      updateUserPhoto(user, photo).then((url) => url && setProfilePicture(url));
    }
  };

  const handleUpdateName = async () => {
    if (user && isValidFullName(name)) {
      updateProfile(user, { displayName: name }).then(() => {
        showAlert({
          message: 'Name updated successfully',
          severity: 'success',
        });
      });
      setEditName(false);
    } else {
      showAlert({
        message: 'Please enter a valid name',
        severity: 'error',
      });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (!isValidFullName(newName)) {
      setNameError('Please enter a valid full name e.g. John Smith');
    } else setNameError('');
  };

  useEffect(() => {
    setName('');
    setNameError('');
  }, [navigate]);

  // get user profile when user is logged in
  useEffect(() => {
    setProfilePicture(user?.photoURL);
    setName(user?.displayName ?? '');
    setCreated(new Date(user?.metadata.creationTime ?? ''));
    if (user !== null) {
      setLoading(false);
    }
  }, [user]);

  // listener for when user changes state
  useEffect(() => {
    ring.register();
    const unsubscribe = auth.onAuthStateChanged(() => {
      setUser(auth.currentUser);
    });

    return unsubscribe;
  }, [auth]);

  return (
    <Box>
      <NavBar newStatus={false} />
      {loading ? (
        <Box textAlign="center" margin="100px auto">
          <CircularProgress sx={LoadingProgress} />
        </Box>
      ) : (
        <Stack
          direction={{ sm: 'column', md: 'row' }}
          sx={userProfileContainer}
        >
          <Stack>
            <Box
              onMouseOut={() => setHoverPfp(false)}
              onMouseOver={() => setHoverPfp(true)}
            >
              <IconButton aria-label="upload" component="label" sx={{ p: '0' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadPhoto(e)}
                  hidden
                />
                {hoverPfp && (
                  <Stack sx={editAvatarHover}>
                    <EditRounded
                      transform="scale(2.2)"
                      sx={{ color: greyScale['100'] }}
                    />
                    <Typography color={greyScale['100']}>
                      Edit Profile Picture
                    </Typography>
                  </Stack>
                )}

                <Avatar
                  sx={userAvatar}
                  src={profilePicture ?? ''}
                  alt={user?.displayName ?? ''}
                  slotProps={{
                    img: {
                      onLoad: () => {
                        setImageLoading(false);
                      },
                    },
                  }}
                />
                {profilePicture !== null && imageLoading && (
                  <Box position="absolute">
                    <l-ring size="40" stroke="5" speed="2" color="white" />
                  </Box>
                )}
              </IconButton>
            </Box>
            <Typography textAlign="center" marginTop="20px">
              {`User since ${created?.toLocaleString('default', { month: 'long' })}
              ${created?.getFullYear()}`}
            </Typography>
          </Stack>
          <Stack flex={1} spacing={2}>
            <Stack>
              {editName ? (
                <form onSubmit={() => handleUpdateName()}>
                  <InputField
                    name="name"
                    label="Name"
                    value={name}
                    onChange={handleNameChange}
                    disabled={!editName}
                    errorMsg={nameError}
                    setErrorMsg={setNameError}
                    setValue={setName}
                    required
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => handleUpdateName()}>
                          <CheckRounded sx={{ color: 'neutral.main' }} />
                        </IconButton>
                      ),
                    }}
                  />
                </form>
              ) : (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  p="10px 14px 10px 0"
                  alignItems="center"
                >
                  <Box height="56px">
                    <Typography fontWeight="bold">Name</Typography>
                    <Typography>{user?.displayName}</Typography>
                  </Box>
                  <IconButton
                    onClick={() => setEditName(true)}
                    sx={{
                      witdh: '40px',
                      height: '40px',
                      color: 'neutral.main',
                    }}
                  >
                    <EditRounded />
                  </IconButton>
                </Stack>
              )}
              <Box>
                <Typography fontWeight="bold">Email</Typography>
                <Typography>{user?.email}</Typography>
              </Box>
            </Stack>
            <ChangeEmailModal user={user} />
            <ChangePasswordModal user={user} />
            <DeleteAccountModal user={user} />
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default UserProfile;

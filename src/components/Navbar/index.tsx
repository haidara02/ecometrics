import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth } from '../../context/UserContext';
import { ring } from 'ldrs';
import ModeSwitch from './ModeSwitch';

/**
 * Height (in pixels) for the navigation bar.
 */
export const NAVBAR_HEIGHT = '80px';

interface NavbarProps {
    newStatus: boolean;
    setNewStatus?: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * React functional component for a navigation bar.
 * @returns {ReactElement} React element representing the NavBar component.
 */
const NavBar: React.FC<NavbarProps> = (props) => {
  /**
   * State to manage the anchor element for the menu.
   */
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [imageLoading, setImageLoading] = useState(true);
  /**
   * Function to handle opening the dropdown menu.
   * @param {React.MouseEvent<HTMLElement>} event - The mouse event.
   */
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTutorialOpen = () => {
    if(props.setNewStatus) {
        props.setNewStatus(true);
    } 
  };

  const handleNavigateProfile = () => {
    navigate('/user/profile');
  };

  const logOut = () => {
    auth.signOut();
  };

  useEffect(() => {
    ring.register();
  }, []);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        padding: '10px',
        height: NAVBAR_HEIGHT,
      }}
    >
      <Toolbar>
        <Box flexGrow={1}>
          <Link to="/">
            <Box width="40px" component="img" src={logo} alt="Company Logo" />
          </Link>
        </Box>
        <ModeSwitch />
        <IconButton onClick={handleTutorialOpen} sx={{ color: 'primary.main' }}>
          <QuestionMarkRoundedIcon />
        </IconButton>
        <Tooltip
          title="Profile settings"
          aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
        >
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              borderRadius: '8px',
              color: 'primary.main',
              fontSize: '30px',
            }}
          >
            <Avatar
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              {imageLoading && (
                <Box position="absolute">
                  <l-ring size="20" stroke="2" speed="2" color="white" />
                </Box>
              )}
              <Avatar
                src={auth.currentUser?.photoURL ?? ''}
                alt={
                  auth.currentUser?.displayName
                    ? `${auth.currentUser?.displayName}'s Icon`
                    : ''
                }
                slotProps={{
                  img: {
                    onLoad: () => {
                      setImageLoading(false);
                    },
                  },
                }}
              />
            </Avatar>
            <Typography alignSelf="center" justifySelf="center" margin="8px">
              {auth.currentUser?.displayName}
            </Typography>
            <ExpandMoreIcon />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleNavigateProfile}>Profile</MenuItem>
          <MenuItem onClick={logOut}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

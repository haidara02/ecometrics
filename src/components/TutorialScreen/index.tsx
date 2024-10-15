import React, { useEffect, useState } from 'react';
import {
  Backdrop,
  Box,
  Typography,
  Button,
  useTheme,
  Container,
  useMediaQuery,
  Stack,
} from '@mui/material';
import { User } from '@firebase/auth';
import { useAuth } from '../../context/UserContext';
import {
  changeUserStatus,
  newUserStatus,
  removeUserData,
} from '../../services/firebase';
import EcometricsDialog from '../EcometricsDialog';

export interface Position {
  top: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

export const initialPosition: Position = {
  top: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0,
};

export type RefType =
  | React.RefObject<HTMLButtonElement>
  | React.RefObject<HTMLDivElement>
  | null;

interface TutorialScreenProps {
  page: number;
  loaded: boolean;
  newStatus: boolean;
  setNewStatus: React.Dispatch<React.SetStateAction<boolean>>;
  handleClose: () => void;
  pos: Position;
  refsArray: (
    | React.RefObject<HTMLDivElement>
    | React.RefObject<HTMLButtonElement>
  )[];
  highlightElement: RefType;
  setHighlightElement: React.Dispatch<React.SetStateAction<RefType>>;
  updateHighlightPosition: (ref: RefType) => void;
  tutorialText: () => JSX.Element;
}

const TutorialScreen: React.FC<TutorialScreenProps> = ({
  page,
  loaded,
  newStatus,
  setNewStatus,
  handleClose,
  pos,
  refsArray,
  highlightElement,
  setHighlightElement,
  updateHighlightPosition,
  tutorialText,
}) => {
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { auth } = useAuth();
  const [element, setElement] = useState<RefType>(highlightElement);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const nextStep = () => {
    const currentIndex = refsArray.findIndex((ref) => ref === element);
    if (currentIndex === refsArray.length - 1) {
      checkClose();
    }
    const nextIndex = (currentIndex + 1) % refsArray.length;
    const nextElement = refsArray[nextIndex];
    if (nextElement) {
      setElement(nextElement);
      if (nextElement.current) {
        const elementRect = nextElement.current.getBoundingClientRect();
        const isInView =
          elementRect.top >= 0 &&
          elementRect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight);

        if (!isInView) {
          nextElement.current.scrollIntoView({
            block: 'center',
          });
        }
      }
      setTimeout(() => {
        updateHighlightPosition(nextElement);
      }, 250);
    }
  };

  const checkClose = () => {
    if (page === 1) {
      user && changeUserStatus(user);
    } else if (page === 2) {
      user && removeUserData(user, 'new_users/metrics/');
    }
    setElement(refsArray[0]);
    setModalOpen(false);
    handleClose();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      if (loaded || !auth.currentUser) return;
      setUser(auth.currentUser);
      // check if user is new
      newUserStatus(auth.currentUser, page).then((status) => {
        setNewStatus(status);
        setModalOpen(status);
      });
    });
    return unsubscribe;
    // eslint-disable-next-line
  }, [auth, loaded]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (newStatus && event.key === 'Escape') {
        event.preventDefault();
        setElement(highlightElement);
        checkClose();
      }
    };
    if (newStatus) {
      document.addEventListener('keydown', handleKeyPress);
      updateHighlightPosition(highlightElement);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
    // eslint-disable-next-line
  }, [newStatus]);

  useEffect(() => {
    setHighlightElement(element);
    // eslint-disable-next-line
  }, [element]);

  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        setElement(element);
        updateHighlightPosition(element);
      }, 250);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }; // eslint-disable-next-line
  }, []);

  const isTop = (element: RefType) => {
    if (!element || !element.current) return false;
    const rect = element.current.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    return rect.top <= viewportHeight / 3;
  };

  const modalText = () => {
    let title = 'Welcome to Ecometrics';
    let content = (
      <Stack>
        <Typography variant="subtitle1" sx={{ mb: '20px' }}>
          The go-to solution for responsible and impactful investing.
        </Typography>
        <Typography variant="body1" sx={{ mb: '20px' }}>
          Whether you're a seasoned investor or just starting out, Ecometrics
          empowers you to make informed decisions that align with your values
          and financial goals.
        </Typography>
        <Typography variant="body1" sx={{ mb: '20px' }}>
          Ready to dive in? Feel free to skip the tutorial and get started right
          away, or take a moment to explore our platform and learn how we can
          help you invest with purpose.
        </Typography>
      </Stack>
    );
    if (page === 2) {
      title = 'Taking the next step';
      content = (
        <Stack>
          <Typography variant="body1" sx={{ mb: '20px' }}>
            Congratulations on reaching the metrics page. Here, you can analyze
            company data using our available frameworks or customize metrics to
            suit your needs.
          </Typography>
          <Typography variant="body1" sx={{ mb: '20px' }}>
            If you're a first timer, our following tutorial can help you get
            started. Otherwise, you can skip the tutorial to immediately access
            and compare the companies' metrics.
          </Typography>
        </Stack>
      );
    }
    return (
      <EcometricsDialog
        open={modalOpen}
        handleClose={() => {
          setModalOpen(false);
        }}
        title={title}
        actions={
          <Box
            display="flex"
            width="100%"
            justifyContent="space-around"
            sx={{ mb: '10px' }}
          >
            <Button variant="outlined" type="submit" onClick={checkClose}>
              Skip Tutorial
            </Button>
            <Button
              variant="contained"
              type="submit"
              onClick={() => {
                setModalOpen(false);
              }}
            >
              Getting Started
            </Button>
          </Box>
        }
      >
        {content}
      </EcometricsDialog>
    );
  };

  return modalOpen ? (
    modalText()
  ) : (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }}
      open={newStatus}
      onClick={nextStep}
    >
      {!loaded && (
        <Container
          sx={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 10,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          maxWidth="sm"
        >
          <l-ring size="40" stroke="5" speed="2" color="#fff" />
        </Container>
      )}
      <Box
        position="absolute"
        top={pos.top - 5}
        left={pos.left - 5}
        width={pos.width + 10}
        height={pos.height + 10}
        sx={{
          borderRadius: '10px',
          boxShadow: '0 0 0 99999px rgba(0, 0, 0, 0.7)',
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
        }}
      />
      <Box
        position="absolute"
        left="50%"
        display="flex"
        alignItems="center"
        sx={{
          [isTop(element) ? 'bottom' : 'top']: 10,
          p: 2,
          m: 0.5,
          color: 'black',
          backgroundColor: 'common.white',
          borderRadius: '10px',
          border: '2px solid',
          borderColor: 'primary.main',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.5s ease',
          transform: 'translateX(-50%)',
          flexDirection: 'column',
          width: isXsScreen ? '90%' : 'auto',
        }}
      >
        <Box marginRight={1}>
          <Typography variant="h5" color="primary.main" sx={{ mb: 1 }}>
            Step {refsArray.findIndex((ref) => ref === element) + 1} of{' '}
            {refsArray.length}
          </Typography>
          {tutorialText()}
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            checkClose();
          }}
        >
          <Typography variant="subtitle1" color="inherit">
            {refsArray.findIndex((ref) => ref === element) ===
            refsArray.length - 1
              ? 'End'
              : 'Skip'}{' '}
            Tutorial
          </Typography>
        </Button>
      </Box>
    </Backdrop>
  );
};

export default TutorialScreen;

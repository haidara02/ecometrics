import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { Auth, User, getAuth } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { app } from '../services/firebase';

/**
 * @type {object} UserContextType - object representing the context of the user provider.
 * @property {Auth} auth - Firebase user authentication interface.
 */
type UserContextType = {
  auth: Auth;
};

/**
 * Props for the UserProvider component.
 * @property {ReactNode} [children] - The child components to be wrapped by the UserProvider.
 */
interface UserProviderProps {
  children?: ReactNode;
}

/**
 * Context for managing user authentication in the application.
 */
const UserContext = createContext<UserContextType | null>(null);

/**
 * Custom hook to access the authentication context.
 * @returns {object} The authentication context.
 * @throws {Error} Throws an error if used outside of an UserProvider.
 */
export const useAuth = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useAuth must be used within an UserProvider');
  }
  return context;
};

/**
 * React functional component for wrapping and providing the whole app with management of user authentication.
 * @param {AlertProviderProps} props - The props for the UserProvider component.
 * @returns {ReactElement} - React element representing the UserProvider component.
 */
const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const auth: Auth = getAuth(app);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Function to redirect user based on authentication status and current location.
   */
  const redirectUser = useCallback(() => {
    const user: User | null = auth?.currentUser;
    console.log(user);
    if (user) {
      if (!user.emailVerified) {
        navigate('/verify');
      } else if (location.pathname === '/verify') {
        navigate('/');
      }
    } else if (
      user === null &&
      !['/auth/register', '/auth/login', '/forgot-password'].includes(
        location.pathname
      )
    ) {
      navigate('/auth/login');
    }
  }, [auth?.currentUser, location.pathname, navigate]);

  useEffect(() => {
    // check whether user is signing in or out
    const unsubscribe = auth.onAuthStateChanged(() => {
      redirectUser();
    });

    return unsubscribe;
  }, [auth, redirectUser]);

  return (
    <UserContext.Provider value={{ auth }}>{children}</UserContext.Provider>
  );
};

export default UserProvider;

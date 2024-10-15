import React, { ReactNode, createContext, useContext, useState } from 'react';
import AlertSnackbar from '../components/AlertSnackbar';
import { SeverityType } from '../components/AlertSnackbar';

/**
 * @type {object} AlertStateType - object representing the state of an alert.
 * @property {string} message - The message to display in the alert.
 * @property {SeverityType} severity - The severity of the alert.
 */
export type AlertStateType = {
  message: string;
  severity: SeverityType;
};

/**
 * @type {AlertStateType} - object representing the context of the alert provider.
 */
type AlertContextType = {
  showAlert: (alertState: AlertStateType) => void;
};

/**
 * Props for the AlertProvider component.
 * @property {ReactNode} [children] - The child components to be wrapped by the AlertProvider.
 */
interface AlertProviderProps {
  children?: ReactNode;
}

/**
 * Context for managing alerts in the application.
 */
const AlertContext = createContext<AlertContextType | undefined>(undefined);

/**
 * Custom hook to access the alert context.
 * @returns {object} The alert context.
 * @throws {Error} Throws an error if used outside of an AlertProvider.
 */
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

/**
 * React functional component for wrapping and providing the whole app with access to the AlertSnackbar state.
 * @param {AlertProviderProps} props - The props for the AlertProvider component.
 * @returns {ReactElement} - React element representing the AlertProvider component.
 */
const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [alertState, setAlertState] = useState<AlertStateType>({
    message: '',
    severity: 'info',
  });

  /**
   * Function to show an alert with the specified state.
   * @param {AlertStateType} state - The state of the alert to be displayed.
   */
  const showAlert = (state: AlertStateType): void => {
    setAlertState(state);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      <>
        <AlertSnackbar
          open={open}
          message={alertState.message}
          severity={alertState.severity}
          handleClose={handleClose}
        />
        {children}
      </>
    </AlertContext.Provider>
  );
};

export default AlertProvider;

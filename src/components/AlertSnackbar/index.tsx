import { Alert, Snackbar, Stack, Typography } from '@mui/material';
import React from 'react';
import { capitaliseSentence } from '../../utils/helpers';

/**
 * @type {SeverityType} - string representing severity of the alert.
 */
export type SeverityType = 'info' | 'success' | 'error' | 'warning';

/**
 * Props for the AlertSnackbar component.
 * @property {boolean} open - Whether the Snackbar is open or not.
 * @property {string} message - The message to display in the Snackbar.
 * @property {SeverityType} severity - The severity of the alert.
 * @property {function} handleClose - Function to handle closing the Snackbar.
 */
interface AlertSnackbarProps {
  open: boolean;
  message: string;
  severity: SeverityType;
  handleClose: () => void;
}

/**
 * Duration (in milliseconds) for which the alert Snackbar will be auto-hidden.
 */
const ALERT_AUTO_HIDE_DURATION: number = 5000;

/**
 * React functional component for displaying an alert in a Snackbar.
 * @param {AlertSnackbarProps} props - The props for the AlertSnackbar component.
 * @returns {ReactElement} React element representing the AlertSnackbar component.
 */
const AlertSnackbar: React.FC<AlertSnackbarProps> = ({
  open,
  message,
  severity,
  handleClose,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      autoHideDuration={ALERT_AUTO_HIDE_DURATION}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{
          width: '100%',
          border: `1px solid`,
          borderColor: `${severity}.main`,
          color: `${severity}.contrastText`,
          bgcolor: `${severity}.light`,
        }}
      >
        <Stack direction="row" alignItems="center" gap="20px">
          <Typography color={`${severity}.contrastText`} fontWeight="500">
            {capitaliseSentence(severity)}!
          </Typography>
          {message}
        </Stack>
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;

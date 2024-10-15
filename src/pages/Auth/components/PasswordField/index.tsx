import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Visibility from '@mui/icons-material/VisibilityRounded';
import VisibilityOff from '@mui/icons-material/VisibilityOffRounded';
import theme from '../../../../utils/theme';

/**
 * Props for the PasswordField component.
 * @typedef {object} PasswordFieldProps
 * @property {string} password - The password value.
 * @property {React.Dispatch<React.SetStateAction<string>>} setPassword - Function to update the password state.
 * @property {string} label - The label for the password field.
 * @property {string} name - The name attribute for the password field.
 * @property {boolean} [error] - Boolean indicating if there's an error in the password field.
 * @property {string} [errorMsg] - The error message to display.
 * @property {React.Dispatch<React.SetStateAction<string>>} [setErrorMsg] - Function to set the error message.
 * @property {React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>} [handleBlur] - Event handler for blur event.
 */
interface PasswordFieldProps {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  label: string;
  name: string;
  required?: boolean;
  error?: boolean;
  errorMsg?: string;
  setErrorMsg?: React.Dispatch<React.SetStateAction<string>>;
  handleBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

/**
 * React functional component for a password field with toggleable visibility.
 * @param {PasswordFieldProps} props - The props for the PasswordField component.
 * @returns {ReactElement} React element representing the PasswordField component.
 */
const PasswordField: React.FC<PasswordFieldProps> = ({
  password,
  setPassword,
  name,
  required,
  label,
  error,
  errorMsg,
  setErrorMsg,
  handleBlur,
}) => {
  // State to manage password visibility.
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
    if (errorMsg && setErrorMsg) setErrorMsg('');
  };

  useEffect(() => {
    if (!password && showPassword) setShowPassword(false);
  }, [password, showPassword]);

  const isXsScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Stack position="relative" padding="8px 0">
      <Typography
        fontWeight="500"
        sx={{
          fontSize: {
            xs: '12px',
            sm: '14px',
            md: '16px',
          },
        }}
      >
        {label}
      </Typography>
      <TextField
        variant="outlined"
        margin="dense"
        size={isXsScreen ? 'small' : 'medium'}
        required
        fullWidth
        error={!['', undefined].includes(errorMsg) || error}
        name={name}
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        value={password}
        onChange={handlePasswordChange}
        onBlur={handleBlur}
        InputProps={{
          endAdornment: (
            <>
              {password && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    sx={{ color: 'primary.main' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )}
            </>
          ),
        }}
      />
      {errorMsg && (
        <Typography
          variant="subtitle1"
          position="absolute"
          bottom="-3px"
          color="error.dark"
        >
          {errorMsg}
        </Typography>
      )}
    </Stack>
  );
};

export default PasswordField;

import React, { ChangeEvent } from 'react';
import {
  Stack,
  TextField,
  TextFieldProps,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { capitaliseSentence } from '../../utils/helpers';
import theme from '../../utils/theme';

/**
 * Custom props for the InputField component.
 * @property {string} name - The name of the input field.
 * @property {string} label - The label displayed for the input field.
 * @property {string} value - The current value of the input field.
 * @property {React.Dispatch<React.SetStateAction<string>>} setValue - Function to update the value of the input field.
 * @property {string} [autoFill] - Optional value to specify auto-fill behavior.
 * @property {string} [errorMsg] - Error message to display if input validation fails.
 * @property {React.Dispatch<React.SetStateAction<string>>} [setErrorMsg] - Function to update the error message.
 * @property {React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>} [handleBlur] - Function to handle blur event.
 */
interface CustomInputFieldProps {
  name: string;
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  autoFill?: string;
  errorMsg?: string;
  setErrorMsg?: React.Dispatch<React.SetStateAction<string>>;
  handleBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

/**
 * @type {InputFieldProps} - Combined props of custom and MUI text field props.
 */
type InputFieldProps = CustomInputFieldProps & TextFieldProps;

/**
 * React functional component for a custom text field.
 * @param {AlertSnackbarProps} props - The props for the InputField component.
 * @returns {ReactElement} React element representing the InputField component.
 */
const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  value,
  setValue,
  autoFill,
  errorMsg,
  setErrorMsg,
  handleBlur,
  required,
  ...textFieldProps
}) => {
  const handleValueChange = (event: ChangeEvent<HTMLInputElement>): void => {
    let eVal = event.target.value;
    if (name === 'name') eVal = capitaliseSentence(eVal);
    if (errorMsg && setErrorMsg) setErrorMsg('');
    setValue(eVal);
  };

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
        {label}{' '}
        {required && (
          <Typography component="span" color="warning.500" display="inline">
            *
          </Typography>
        )}
      </Typography>
      <TextField
        variant="outlined"
        margin="dense"
        size={isXsScreen ? 'small' : 'medium'}
        required
        fullWidth
        error={!!errorMsg}
        name={name}
        autoComplete={autoFill}
        value={value}
        onChange={handleValueChange}
        onBlur={handleBlur}
        {...textFieldProps}
      />
      <Typography
        variant="subtitle1"
        position="absolute"
        bottom="-3px"
        color="error.dark"
      >
        {errorMsg}
      </Typography>
    </Stack>
  );
};

export default InputField;

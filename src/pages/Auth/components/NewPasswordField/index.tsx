import React, { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import NotFulfilled from '@mui/icons-material/CloseRounded';
import Fulfilled from '@mui/icons-material/CheckRounded';
import { isPasswordValid } from '../../../../utils/helpers';
import PasswordField from '../PasswordField';

/**
 * Props for the NewPasswordField component.
 * @property {string} password - The password value.
 * @property {React.Dispatch<React.SetStateAction<string>>} setPassword - Function to update the password state.
 * @property {string} label - The label for the password field.
 */
interface NewPasswordFieldProps {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  label: string;
  required?: boolean;
}

/**
 * React functional component for a password field with validation requirements.
 * @param {NewPasswordFieldProps} props - The props for the NewPasswordField component.
 * @returns {ReactElement} React element representing the NewPasswordField component.
 */
const NewPasswordField: React.FC<NewPasswordFieldProps> = ({
  password,
  setPassword,
  label,
  required,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const [passReq, setPassReq] = useState<Record<string, boolean>>({
    '8 characters': false,
    'a number e.g. 0-9': false,
    'a symbol e.g. !@#$%^&*().?"\':{}|<>': false,
    'an uppercase and lowercase letter': false,
  });

  /**
   * Handles password requirements validation.
   * @param {string} pass - The password string to validate.
   */
  const handlePasswordRequirements = (pass: string) => {
    setPassReq({
      '8 characters': pass.length >= 8,
      'a number e.g. 0-9': /\d/.test(pass),
      'a symbol e.g. !@#$%^&*().?"\':{}|<>': /[!@#$%^&*().?"':{}|<>]/.test(
        pass
      ),
      'an uppercase and lowercase letter':
        /[A-Z]/.test(pass) && /[a-z]/.test(pass),
    });
  };

  const handleBlur = () => {
    setError(!isPasswordValid(password));
  };

  useEffect(() => {
    if ((!password && showPassword)) setShowPassword(false);
    handlePasswordRequirements(password);
  }, [password, showPassword]);

  return (
    <Stack position="relative" padding="8px 0">
      <PasswordField
        password={password}
        setPassword={setPassword}
        label={label}
        required={required || false}
        name="register-password"
        error={error}
        handleBlur={handleBlur}
      />
      {password && (
        <>
          <Typography
            variant="subtitle1"
            marginTop="-19px"
            color={isPasswordValid(password) ? 'success.dark' : 'error.dark'}
          >
            {isPasswordValid(password)
              ? 'Password is strong.'
              : 'Password must have at least:'}
          </Typography>
          {Object.keys(passReq).map((req, i) => (
            <Stack
              key={i}
              direction="row"
              alignItems="center"
              marginLeft="15px"
              color={passReq[req] ? 'success.dark' : 'error.dark'}
            >
              {passReq[req] ? (
                <Fulfilled sx={{ fontSize: '18px' }} />
              ) : (
                <NotFulfilled sx={{ fontSize: '18px' }} />
              )}
              <Typography variant="subtitle1" color="inherit">
                {req}
              </Typography>
            </Stack>
          ))}
        </>
      )}
    </Stack>
  );
};

export default NewPasswordField;

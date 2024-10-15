import React from 'react';

import {
  Box,
  Dialog,
  DialogContent,
  Typography,
  DialogActions,
} from '@mui/material';
import logo from '../../assets/logo.svg';

interface EcometricsDialogProps {
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  title?: string;
  actions?: JSX.Element;
}

const EcometricsDialog: React.FC<EcometricsDialogProps> = ({
  open,
  handleClose,
  children,
  title,
  actions,
}) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={handleClose}
      closeAfterTransition
    >
      <DialogContent>
        <Box width="100%" display="flex" justifyContent="center">
          <Box
            p="10px"
            component="img"
            src={logo}
            alt="Company Logo"
            width={100}
          />
        </Box>
        <Typography variant="h3" m="15px 0">
          {title}
        </Typography>
        {children}
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default EcometricsDialog;

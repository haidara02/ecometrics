import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Checkbox,
} from '@mui/material';
import React, { useState } from 'react';
import InputField from '../../../../components/InputField';

/**
 * Props for the NewFrameworkDialog component.
 * @property {boolen} isOpen - Flag indicating whether the dialog is open.
 * @property {function} handleClose - Callback function to handle closing the dialog.
 * @property {function} score - Callback function to create a new framework.
 */
interface NewFrameworkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFramework: (
    name: string,
    description: string,
    isPublic: boolean
  ) => void;
}

/**
 * React functional component representing a dialog for creating a new framework.
 * @param {NewFrameworkDialogProps} props - The props for the NewFrameworkDialog component.
 * @returns {ReactElement} React element representing the NewFrameworkDialog component.
 */
const NewFrameworkDialog: React.FC<NewFrameworkDialogProps> = ({
  isOpen,
  onClose,
  onCreateFramework,
}) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    onCreateFramework(
      formJson['framework-name'],
      formJson['framework-description'],
      formJson['framework-is-public']
    );
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setIsPublic(false);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) =>
          handleSubmit(event),
      }}
    >
      <DialogTitle>New Framework</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'neutral.600' }}>
          To create a new framework, please enter a name and description for the
          framework. The newly created framework will be created from the
          currently selected metrics and weightings.
        </DialogContentText>
        <InputField
          name="framework-name"
          label="Framework Name"
          value={name}
          setValue={setName}
          fullWidth
          required
        />
        <InputField
          name="framework-description"
          label="Description"
          value={description}
          setValue={setDescription}
          fullWidth
          multiline
          required
          rows={4}
        />
        <FormControl component="fieldset" variant="standard">
          <FormGroup>
            <FormControlLabel
              labelPlacement="end"
              control={
                <Checkbox
                  onChange={(event) => setIsPublic(event.target.checked)}
                  name="framework-is-public"
                  checked={isPublic}
                />
              }
              label="Public"
            />
          </FormGroup>
          <FormHelperText>
            A public framework will be viewable by all users on the platform.
          </FormHelperText>
        </FormControl>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: 'info.main' }}
            type="submit"
          >
            Create
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default NewFrameworkDialog;

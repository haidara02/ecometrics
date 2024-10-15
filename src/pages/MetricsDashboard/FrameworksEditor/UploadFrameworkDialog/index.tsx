import { Dialog, DialogTitle, DialogContent, Box, Button } from '@mui/material';
import { FC, useCallback } from 'react';
import { useAlert } from '../../../../context/AlertsContext';

interface UploadFrameworkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadFramework: (file: File) => void;
}

const UploadFrameworkDialog: FC<UploadFrameworkDialogProps> = ({
  isOpen,
  onClose,
  onUploadFramework,
}) => {
  const { showAlert } = useAlert();

  const uploadFile = useCallback(
    async (file: File | undefined) => {
      if (file) {
        if (file.type !== 'application/json') {
          showAlert({
            message: 'Please upload an appropriate JSON file.',
            severity: 'error',
          });
        } else {
          onUploadFramework(file);
        }
      }
    },
    [showAlert, onUploadFramework]
  );

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
    event.target.value = '';
  };

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      uploadFile(file);
      event.dataTransfer.clearData();
    },
    [uploadFile]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Upload Framework</DialogTitle>
      <DialogContent>
        <Box
          onDrop={onDrop}
          onDragOver={onDragOver}
          sx={{
            border: '1px dashed grey',
            padding: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Drag and drop a file here or
          <Button
            sx={{ ml: 1 }}
            component="label"
            variant="contained"
            color="primary"
          >
            Browse Files
            <input
              type="file"
              hidden
              onChange={handleFileUpload}
              accept="application/json"
            />
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFrameworkDialog;

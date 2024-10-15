import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useAlert } from '../../context/AlertsContext';
import Papa from 'papaparse';
import { DataImportType } from '../../services/types';
import { uploadData } from '../../services/firebase';
import { useCallback, useState } from 'react';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

/**
 * React component for uploading CSV files.
 * @returns {JSXElement} - JSX element representing the CSVUpload component.
 */
const CSVUpload = () => {
  const { showAlert } = useAlert();

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [openProgress, setOpenProgress] = useState<boolean>(false);

  const sleep = (delay: number) =>
    new Promise((resolve) => setTimeout(resolve, delay));
  /**
   * Handles the upload of data from a CSV file.
   * @param {string} name - The name of the uploaded file.
   * @param {DataImportType[]} csvData - The data extracted from the CSV file.
   */
  const handleUploadData = useCallback(
    async (name: string, csvData: DataImportType[]) => {
      setUploadProgress(0);
      setOpenProgress(true);
      await uploadData(csvData, setUploadProgress)
        .then(() => {
          setUploadProgress(100);
          showAlert({
            message: `CSV file uploaded: ${name}`,
            severity: 'success',
          });
          setOpenProgress(false);
        })
        .catch((error) => {
          showAlert({
            severity: 'error',
            message: `Error occurred uploading data: ${error}`,
          });
        });
    },
    [setUploadProgress, showAlert]
  );
  /**
   * Uploads the selected file.
   * @param {File | undefined} file - The file to be uploaded.
   */
  const uploadFile = useCallback(
    async (file: File | undefined) => {
      if (file) {
        if (file.type !== 'text/csv') {
          showAlert({
            message: 'Please upload a CSV file.',
            severity: 'error',
          });
        } else {
          return new Promise<void>((resolve, reject) => {
            Papa.parse(file, {
              complete: (results) =>
                handleUploadData(file.name, results.data as DataImportType[])
                  .then(() => resolve())
                  .catch((error) => {
                    showAlert({ severity: 'error', message: error });
                    reject(error);
                  }),
              header: true,
            });
          });
        }
      }
    },
    [showAlert, handleUploadData]
  );
  /**
   * Handles the file upload event.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The event triggered by file selection.
   */
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const files = event.target.files ?? [];
    if (files) {
      for (let file of Array.from(files)) {
        await uploadFile(file);
        await sleep(5000);
      }
    }
    event.target.value = '';
  };
  /**
   * Handles the drop event when a file is dropped onto the component.
   * @param {React.DragEvent<HTMLDivElement>} event - The event triggered by dragging files.
   */
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
    <Container
      onDrop={onDrop}
      onDragOver={onDragOver}
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
      maxWidth="sm"
    >
      <Dialog open={openProgress} fullWidth>
        <DialogTitle>Uploading...</DialogTitle>
        <DialogContent>
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{ height: '15px', borderRadius: '10px' }}
          />
          <Typography variant="h3" textAlign="center">
            {Math.round(uploadProgress)}%
          </Typography>
        </DialogContent>
      </Dialog>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{ height: '90vh', width: '90vw' }}
      >
        Upload file
        <VisuallyHiddenInput
          type="file"
          onChange={handleFileUpload}
          multiple={true}
        />
      </Button>
    </Container>
  );
};

export default CSVUpload;

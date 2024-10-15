import { Typography, Stack, TextField } from '@mui/material';
import { UserInstructionStyle } from './style';
import { useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

const UserInstructions = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion
      defaultExpanded
      onChange={toggleExpanded}
      sx={UserInstructionStyle}
      elevation={0}
    >
      <AccordionSummary
        expandIcon={expanded ? <RemoveIcon /> : <AddIcon />}
        aria-controls="instructions-panel-content"
        id="instructions-panel-header"
        aria-label={expanded ? 'Collapse instructions' : 'Expand instructions'}
      >
        <Typography variant="body1" fontWeight={600} color="primary.main">
          Instructions
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography sx={{ marginBottom: '10px' }}>
          Metrics are a measure of quantitative assessment drawn from EUROFIDAI.
          Metrics in Ecometrics have three pillars for environmental, social and
          governance impact.
        </Typography>
        <Typography sx={{ marginBottom: '30px' }}>
          Frameworks are a specific grouping of metrics. Frameworks give a
          unified view on metrics within certain categories.
        </Typography>
        <Stack direction="row" spacing={2} sx={{ marginBottom: '10px' }}>
          <InfoIcon
            fontSize="small"
            sx={{ color: 'neutral.main', width: '100px' }}
            aria-label="Information"
          />
          <Typography variant="body1">
            Hover over the tooltips to see each metric's description.
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ marginBottom: '10px' }}
        >
          <TextField
            type="number"
            size="small"
            sx={{
              m: '0 5px',
              bgcolor: 'common.white',
              input: { color: 'primary.main' },
              minWidth: '100px',
              maxWidth: '100px',
              maxHeight: '40px',
            }}
            placeholder="0.00"
            disabled
          />
          <Typography variant="body1">
            Adjust the weighting by typing a number between 0 and 1 inclusive to
            prioritise metrics according to your preferences.
          </Typography>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default UserInstructions;

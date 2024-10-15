import * as React from 'react';
import { PieChart, pieArcClasses } from '@mui/x-charts';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { Box, Typography, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { esgChartContainer, esgLabelStyle } from './style';
import theme, { greyScale } from '../../../utils/theme';

/**
 * Props for the EsgChart component.
 * @property {number} score - The Esg score.
 */
interface EsgChartProps {
  score: number;
}

/**
 * Height and width (in pixels) of the EsgChart component
 */
const size = {
  width: 200,
  height: 200,
};

/**
 * React functional component for the ESG label.
 * @param {number} score - The Esg score.
 * @returns {ReactElement} React element representing the EsgLabel component.
 */
const EsgLabel: React.FC<{ score: number }> = ({ score }) => {
  const { width, height, left, top } = useDrawingArea();
  const boxWidth = 200;
  const boxHeight = 200;
  return (
    <foreignObject
      x={left + width / 2 - boxWidth / 2}
      y={top + height / 2 - boxHeight / 2}
      width={boxWidth}
      height={boxHeight}
    >
      <Box sx={esgLabelStyle}>
        <Tooltip
          title={`
             Metrics are normalized to percentiles (0-100).
             ESG score is the weighted average of these normalized values, determined by
             user-assigned weightings. It assesses sustainability and ethical impact succinctly.
           `}
          placement="left-end"
        >
          <InfoIcon fontSize="small" sx={{ color: 'neutral.main' }} />
        </Tooltip>
        <Typography variant="h4" sx={{ color: 'primary.main' }}>
          ESG Score
        </Typography>
        <Typography
          variant="h1"
          sx={{ color: 'primary.main', fontSize: '3.7rem' }}
        >
          {score || ''}
        </Typography>
      </Box>
    </foreignObject>
  );
};

/**
 * React functional component for the ESG chart.
 * @param {EsgChartProps} props - The props for the EsgChart component.
 * @returns {ReactElement} React element representing the EsgChart component.
 */
const EsgChart: React.FC<EsgChartProps> = ({ score }) => {
  const data = [
    { value: score, color: theme.palette.warning.main },
    { value: 100 - score, color: greyScale.light },
  ];

  return (
    <Box sx={esgChartContainer}>
      <PieChart
        series={[{ data, innerRadius: 80, cornerRadius: 5 }]}
        {...size}
        tooltip={{ trigger: 'none' }}
        margin={{ right: 0 }}
        sx={{
          [`& .${pieArcClasses.root}`]: {
            strokeWidth: 0,
          },
        }}
      >
        <EsgLabel score={score} />
      </PieChart>
    </Box>
  );
};

export default EsgChart;

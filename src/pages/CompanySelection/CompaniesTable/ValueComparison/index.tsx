import { Box, Typography } from '@mui/material';
import React from 'react';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import HorizontalRuleRoundedIcon from '@mui/icons-material/HorizontalRuleRounded';
import { valueComparisonContainer } from './style';

/**
 * Props for the ValueComparison component.
 * @property {number} previousYrValue - The previous value.
 * @property {number} currentYrValue - The current value.
 */
interface ValueComparisonProps {
  previousYrValue: number;
  currentYrValue: number;
}

/**
 * React functional component representing a tag that shows the percentage differences between two values.
 * @param {ValueComparisonProps} props - The props for the ValueComparison component.
 * @returns {ReactElement} React element representing the ValueComparison component.
 */
const ValueComparison: React.FC<ValueComparisonProps> = ({
  previousYrValue,
  currentYrValue,
}) => {
  const percentageChange =
    ((currentYrValue - previousYrValue) / previousYrValue) * 100;
  const DEFAULT_ICON_FONT_SIZE = '15px';
  return (
    <Box width="50px">
      {previousYrValue !== 0 && (
        <Box sx={valueComparisonContainer(percentageChange)}>
          {percentageChange > 0 ? (
            <ArrowUpwardRoundedIcon
              sx={{ color: 'success.500', fontSize: DEFAULT_ICON_FONT_SIZE }}
            />
          ) : percentageChange < 0 ? (
            <ArrowDownwardRoundedIcon
              sx={{ color: 'error.500', fontSize: DEFAULT_ICON_FONT_SIZE }}
            />
          ) : (
            <HorizontalRuleRoundedIcon
              sx={{ color: 'gray', fontSize: DEFAULT_ICON_FONT_SIZE }}
            />
          )}
          <Typography
            variant="subtitle1"
            sx={{
              color:
                percentageChange > 0
                  ? 'success.500'
                  : percentageChange < 0
                    ? 'error.500'
                    : 'gray',
              fontSize: '11px',
              fontWeight: 'bold',
            }}
          >
            {Math.round(percentageChange)}%
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ValueComparison;

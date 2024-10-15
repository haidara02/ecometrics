import { Box } from '@mui/material';
import React from 'react';

/**
 * Props for the RatingBar component.
 * @property {number} value - The value of the rating bar (percentage).
 * @property {string} [height] - The height of the rating bar
 */
interface RatingBarProps {
  value: number;
  height?: string;
}

/**
 * Height (in pixels) for the rating bar.
 */
export const DEFAULT_RATING_BAR_HEIGHT = '10px';

/**
 * React functional component representing a rating bar.
 * @param {FilterButtonProps} props - The props for the RatingBar component.
 * @returns {ReactElement} React element representing the RatingBar component.
 */
const RatingBar: React.FC<RatingBarProps> = ({
  value,
  height = DEFAULT_RATING_BAR_HEIGHT,
}) => {
  return (
    <Box
      sx={{
        height: height,
        position: 'relative',
        bgcolor: 'secondary.50',
        borderRadius: 5,
        flexGrow: 1,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: `${value}%`,
          height: height,
          bgcolor: 'secondary.main',
          borderRadius: 5,
        }}
      />
    </Box>
  );
};

export default RatingBar;

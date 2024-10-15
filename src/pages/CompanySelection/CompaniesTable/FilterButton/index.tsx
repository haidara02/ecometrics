import { Button } from '@mui/material';
import React from 'react';

/**
 * Props for the FilterButton component.
 * @property {string | undefined} [selectedView] - The selected view for the FilterButton, if any.
 * @property {string} value - The text to be displayed on the FilterButton.
 * @property {function} handleClick - Function to handle click events on the FilterButton.
 */
interface FilterButtonProps {
  selectedView?: string | undefined;
  value: string;
  handleClick: (view: string) => void;
}

/**
 * React functional component representing a filter button for the MUI data grid.
 * @param {FilterButtonProps} props - The props for the FilterButton component.
 * @returns {ReactElement} React element representing the FilterButton component.
 */
const FilterButton: React.FC<FilterButtonProps> = ({
  selectedView,
  value,
  handleClick,
}) => {
  return (
    <Button
      onClick={() => handleClick(value)}
      variant={selectedView === value ? 'contained' : 'outlined'}
      sx={{ py: '7px' }}
    >
      {value}
    </Button>
  );
};

export default FilterButton;

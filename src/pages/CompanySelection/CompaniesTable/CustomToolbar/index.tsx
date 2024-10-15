import { ButtonGroup, useMediaQuery, useTheme } from '@mui/material';
import {
  GridSlotsComponentsProps,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import React from 'react';
import { gridToolBarContainerStyle, toolBarFilterStyle } from '../style';
import FilterButton from '../FilterButton';

/**
 * React functional component representing a custom toolbar for the MUI data grid.
 * @param {GridSlotsComponentsProps['toolbar']} props - The props for the CustomToolbar component.
 * @returns {ReactElement} React element representing the CustomToolbar component.
 */
const CustomToolbar: React.FC<
  NonNullable<GridSlotsComponentsProps['toolbar']>
> = (props) => {
  /**
   * Handles the click event for view button.
   * @param {string} view - The view to be set. ie. 'Selected', 'Unselected'
   */
  const handleViewButtonClick = (view: string) => {
    if (props.setSelectedView) {
      props.setSelectedView(view);
    }
  };
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <GridToolbarContainer sx={gridToolBarContainerStyle} ref={props.toolbarRef}>
      <GridToolbarQuickFilter variant="outlined" sx={toolBarFilterStyle} />
      <ButtonGroup
        variant="outlined"
        aria-label="view"
        disableElevation
        fullWidth={isXsScreen}
      >
        <FilterButton
          selectedView={props.selectedView}
          value="View All"
          handleClick={handleViewButtonClick}
        />
        <FilterButton
          selectedView={props.selectedView}
          value="Selected"
          handleClick={handleViewButtonClick}
        />
        <FilterButton
          selectedView={props.selectedView}
          value="Unselected"
          handleClick={handleViewButtonClick}
        />
      </ButtonGroup>
    </GridToolbarContainer>
  );
};

export default CustomToolbar;

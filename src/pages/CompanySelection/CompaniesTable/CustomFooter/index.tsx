import { Box } from '@mui/material';
import { GridFooter, GridSlotsComponentsProps } from '@mui/x-data-grid';
import React from 'react';

const CustomFooter: React.FC<
  NonNullable<GridSlotsComponentsProps['footer']>
> = (props) => {

  return (
    <Box ref={props.footerRef}>
    <GridFooter>
    </GridFooter>
    </Box>
  );
};

export default CustomFooter;

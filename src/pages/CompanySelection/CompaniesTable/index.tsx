import {
  Box,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridComparatorFn,
  GridFilterInputValueProps,
  GridFilterOperator,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import RatingBar from './RatingBar';
import CustomToolbar from './CustomToolbar';
import CustomFooter from './CustomFooter';
import ValueComparison from './ValueComparison';
import { dataGridStyle, esgRatingColumnStyle } from './style';
import OverflowTooltip from './OverflowTooltip';
import CustomMenu from './CustomMenu';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    selectedView: string;
    setSelectedView: React.Dispatch<React.SetStateAction<string>>;
  }
}

declare module '@mui/x-data-grid' {
  interface FooterPropsOverrides {
    footerRef: React.RefObject<HTMLDivElement>;
  }
}

/**
 * Comparator function for sorting by current value.
 */
const currentValueComparator: GridComparatorFn<any> = (v1, v2) => {
  const value1 = v1.currentValue || 0;
  const value2 = v2.currentValue || 0;
  return value1 - value2;
};

// might move this to service types.ts later (idk)
/**
 * @type {TableRowType} - Type representing a single row in the table.
 */
export type TableRowType = {
  id: number;
  company: string;
  esgRating: { currentValue: number; lastYearValue: number };
  headquarter_country: string;
};

/**
 * Props for the CompaniesTable component.
 * @property {TableRowType[]} data - Full list of all companies to be displayed.
 * @property {TableRowType[]} selectedCompanies - Companies on the table selected via the checkbox.
 * @property {React.Dispatch<React.SetStateAction<TableRowType[]>>} severity - Function to set the state of the selected companies
 */
interface CompaniesTableProps {
  data: TableRowType[];
  selectedCompanies: TableRowType[];
  setSelectedCompanies: React.Dispatch<React.SetStateAction<TableRowType[]>>;
  esgColumnRef: React.RefObject<HTMLDivElement>;
  toolbarRef: React.RefObject<HTMLDivElement>;
  footerRef: React.RefObject<HTMLDivElement>;
  cmpyColumnRef: React.RefObject<HTMLDivElement>;
}

const RatingInputValue: React.FC<GridFilterInputValueProps> = (props) => {
  const { item, applyValue } = props;

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const newValue = event.target.value;
    applyValue({ ...item, value: newValue });
  };

  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        pl: '20px',
      }}
    >
      <TextField value={item.value} onChange={handleInputChange} />
    </Box>
  );
};

const ratingOnlyOperators: GridFilterOperator<any>[] = [
  {
    label: 'equal',
    value: 'equal',
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }
      return (params) => {
        const currentValue = params.formattedValue?.currentValue || 0;
        const filterValue = parseFloat(filterItem.value);

        return currentValue === filterValue;
      };
    },
    InputComponent: RatingInputValue,
    InputComponentProps: {
      type: 'number',
      placeholder: '0',
    },
  },
  {
    label: 'above',
    value: 'above',
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }
      return (params) => {
        const currentValue = params.formattedValue?.currentValue || 0;
        const filterValue = parseFloat(filterItem.value);

        return currentValue > filterValue;
      };
    },
    InputComponent: RatingInputValue,
    InputComponentProps: {
      type: 'number',
      placeholder: '0',
    },
  },
  {
    label: 'below',
    value: 'below',
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }
      return (params) => {
        const currentValue = params.formattedValue?.currentValue || 0;
        const filterValue = parseFloat(filterItem.value);

        return currentValue < filterValue;
      };
    },
    InputComponent: RatingInputValue,
    InputComponentProps: {
      type: 'number',
      placeholder: '0',
    },
  },
  {
    label: '% change =',
    value: '% change =',
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }
      return (params) => {
        const currentValue = params.formattedValue?.currentValue || 0;
        const previousValue = params.formattedValue?.lastYearValue || null;
        if (previousValue != null) {
          const percentageChange =
            ((currentValue - previousValue) / previousValue) * 100;
          const filterValue = parseFloat(filterItem.value);

          return Math.round(percentageChange) === filterValue;
        }
        return false;
      };
    },
    InputComponent: RatingInputValue,
    InputComponentProps: {
      type: 'number',
      placeholder: '0',
    },
  },
  {
    label: '% change >',
    value: '% change >',
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }
      return (params) => {
        const currentValue = params.formattedValue?.currentValue || 0;
        const previousValue = params.formattedValue?.lastYearValue || null;
        if (previousValue != null) {
          const percentageChange =
            ((currentValue - previousValue) / previousValue) * 100;
          const filterValue = parseFloat(filterItem.value);

          return Math.round(percentageChange) > filterValue;
        }
        return false;
      };
    },
    InputComponent: RatingInputValue,
    InputComponentProps: {
      type: 'number',
      placeholder: '0',
    },
  },
  {
    label: '% change <',
    value: '% change <',
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }
      return (params) => {
        const currentValue = params.formattedValue?.currentValue || 0;
        const previousValue = params.formattedValue?.lastYearValue || null;
        if (previousValue != null) {
          const percentageChange =
            ((currentValue - previousValue) / previousValue) * 100;
          const filterValue = parseFloat(filterItem.value);

          return Math.round(percentageChange) < filterValue;
        }
        return false;
      };
    },
    InputComponent: RatingInputValue,
    InputComponentProps: {
      type: 'number',
      placeholder: '0',
    },
  },
];

/**
 * React functional component representing a table for the MUI data grid.
 * @param {FilterButtonProps} props - The props for the CompaniesTable component.
 * @returns {ReactElement} React element representing the CompaniesTable component.
 */
const CompaniesTable: React.FC<CompaniesTableProps> = ({
  data,
  selectedCompanies,
  setSelectedCompanies,
  esgColumnRef,
  toolbarRef,
  cmpyColumnRef,
  footerRef,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedView, setSelectedView] = useState<string>('View All');
  const [filteredRows, setFilteredRows] = useState<TableRowType[]>(data);

  /**
   * Columns configuration for the data grid.
   */
  const columns: GridColDef[] = [
    {
      field: 'company',
      headerName: 'Company',
      headerClassName: 'table-header',
      flex: 2,
      editable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box
            sx={esgRatingColumnStyle}
            ref={
              params.rowNode.id === filteredRows[0].id ? cmpyColumnRef : null
            }
          >
            <OverflowTooltip text={params.value} />
          </Box>
        );
      },
    },
    {
      field: 'esgRating',
      headerName: 'ESG Rating',
      headerClassName: 'table-header',
      flex: 3,
      editable: false,
      sortComparator: currentValueComparator,
      filterOperators: ratingOnlyOperators,
      renderCell: (params) => (
        <Box
          sx={esgRatingColumnStyle}
          ref={params.rowNode.id === filteredRows[0].id ? esgColumnRef : null}
        >
          <Typography>{params.value.currentValue}</Typography>
          <RatingBar value={params.value.currentValue} />
          <ValueComparison
            previousYrValue={params.value.lastYearValue}
            currentYrValue={params.value.currentValue}
          />
        </Box>
      ),
    },
    {
      field: 'headquarter_country',
      headerName: 'Country',
      headerClassName: 'table-header',
      headerAlign: 'center',
      flex: 1,
      editable: false,
      filterable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          p="3px 10px"
          maxWidth="100%"
          bgcolor="primary.400"
          borderRadius="15px"
          m="0 auto"
        >
          <OverflowTooltip
            color="white"
            variant="subtitle2"
            text={params.value || 'Not provided'}
          />
        </Box>
      ),
    },
  ];

  useEffect(() => {
    // Update filtered rows based on the selected view
    if (selectedView === 'Selected') {
      setFilteredRows(selectedCompanies);
    } else if (selectedView === 'Unselected') {
      const unselectedRowData = data.filter(
        (row) =>
          !selectedCompanies.some((selectedRow) => selectedRow.id === row.id)
      );
      setFilteredRows(unselectedRowData);
    } else {
      // "View All", therefore reset to original data
      setFilteredRows(data);
    }
  }, [data, selectedCompanies, selectedView]);

  /**
   * Handles the change in row selection model.
   * @param {GridRowSelectionModel} ids - The ids of selected rows.
   */
  const onRowSelectionModelChange = (ids: GridRowSelectionModel) => {
    const selectedIds = new Set(ids);
    const selectedRowData = filteredRows.filter((row) =>
      selectedIds.has(row.id)
    );
    // To fix the issue of data grid requiring row id https://github.com/mui/mui-x/issues/2714
    // setTimeout doesn't work if triple clicked
    // setTimeout(() => {
    if (selectedView === 'Unselected') {
      setSelectedCompanies((prevSelectedCompanies) => [
        ...prevSelectedCompanies,
        ...selectedRowData,
      ]);
    } else {
      setSelectedCompanies(selectedRowData);
    }
    // }, 200);
  };

  return (
    <Box width="100%" height="100%">
      <DataGrid
        sx={dataGridStyle}
        columns={isMobile ? columns.slice(0, 2) : columns}
        rows={filteredRows}
        onRowSelectionModelChange={(ids) => onRowSelectionModelChange(ids)}
        isRowSelectable={(data) => data.id !== undefined}
        getRowId={(row) => row.id}
        autoPageSize
        pagination
        pageSizeOptions={[5]}
        checkboxSelection
        rowSelectionModel={
          selectedView !== 'Unselected'
            ? selectedCompanies.map((row) => row.id)
            : []
        }
        slots={{
          toolbar: CustomToolbar,
          footer: CustomFooter,
          columnMenu: CustomMenu,
        }}
        slotProps={{
          toolbar: {
            selectedView,
            setSelectedView,
            quickFilterProps: { debounceMs: 250 },
            toolbarRef: toolbarRef,
          },
          footer: {
            footerRef: footerRef,
          },
        }}
      />
    </Box>
  );
};

export default CompaniesTable;

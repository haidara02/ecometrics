import { Box, Chip, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridAlignment, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { metricTableStyle } from './style';
import {
  FrameworkMetricsType,
  MetricsByCompanyAndYearsReturnType,
  MetricsNameTypes,
} from '../../../services/types';
import { mapMetricName } from '../../../services/enums';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Props for the MetricsTable component.
 * @property {MetricsByCompanyAndYearsReturnType[]} data - data to be displayed in the metrics table.
 */

interface MetricsTableProps {
  data: MetricsByCompanyAndYearsReturnType[];
  weightings: FrameworkMetricsType;
}

/**
 * Object representing a row in the metrics table.
 * @property {number} id - The unique identifier for the row.
 * @property {string} metricName - The name of the metric.
 */
export type RowData = {
  id: number;
  info: { name: string; provider_name: string };
  weighting: number;
  [key: string]:
    | string
    | number
    | boolean
    | { name: string; provider_name: string };
};

/**
 * Component for an overlay if no data is present.
 * @returns {React.ReactElement} - React element representing the CustomNoRowsOverlay component.
 */
const CustomNoRowsOverlay = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    }}
  >
    <Typography variant="h4" color="#667085">
      No Data.
    </Typography>
    <Typography variant="h6" color="#667085" sx={{ textAlign: 'center' }}>
      Please select the years and metrics or framework you want to view after
      opening the green dropdown.
    </Typography>
  </Box>
);

/**
 * Formats metrics data into rows for the table.
 * @param {MetricsByCompanyAndYearsReturnType[]} data - Metrics data to format.
 * TO-DO
 * @returns {RowData[]} - Formatted rows for the table.
 */
const formatRows = (
  data: MetricsByCompanyAndYearsReturnType[],
  weightings: FrameworkMetricsType
): RowData[] => {
  const metricsMap: {
    [key: string]: {
      values: { [subKey: string]: number };
      provider_name: string;
    };
  } = {};

  // Iterate over each company's metrics
  data.forEach((companyData) => {
    Object.keys(companyData.years).forEach((year) => {
      Object.entries(companyData.years[parseInt(year)]).forEach(
        ([metric, info]) => {
          const metricName = metric;
          if (!metricsMap[metricName]) {
            metricsMap[metricName] = { values: {}, provider_name: '' };
          }
          // Viewing a single company needs the years
          // Comparing multiple companies needs each company name
          const subKey = data.length === 1 ? year : companyData.company_name;
          metricsMap[metricName].values[subKey] = info.value;
          metricsMap[metricName].provider_name = info.provider_name;
        }
      );
    });
  });

  // Turn into RowData format
  const result: RowData[] = Object.entries(metricsMap).map(
    ([metricName, info], index) => {
      const row: RowData = {
        id: index,
        info: {
          name: mapMetricName(metricName),
          provider_name: info.provider_name,
        },
        weighting: weightings[metricName as MetricsNameTypes] ?? 0,
      };
      Object.entries(info.values).forEach(([key, value]) => {
        row[key] = value;
      });
      return row;
    }
  );

  return result;
};

/**
 * Maps column names to column definitions for the table.
 * @param {string[] | number[]} columnNames - Names of the columns.
 * @returns {GridColDef[]} - Column definitions for the table.
 */
const mapColumns = (columnNames: string[] | number[]) => {
  return columnNames.map((columnName) =>
    createColumn({
      align: 'center',
      headerAlign: 'center',
      field: columnName.toString(),
      headerName: columnName.toString(),
      flex: 1,
    })
  );
};

type ColumnData = {
  field: string;
  headerName: string;
  flex: number;
  maxWidth?: number;
  minWidth?: number;
  align?: GridAlignment;
  headerAlign?: GridAlignment;
  renderCell?: (params: any) => React.ReactElement;
};

const createColumn = (data: ColumnData) => {
  const col = {
    ...data,
    headerClassName: 'metricTableHeader',
    editable: false,
    filterable: false,
    disableColumnMenu: true,
  };
  return col;
};

/**
 * React functional component for displaying metrics data in a table.
 * @param {MetricsTableProps} props - The props for the MetricsTable component.
 * @returns {React.ReactElement} - React element representing the MetricsTable component.
 */
const MetricsTable: React.FC<MetricsTableProps> = ({ data, weightings }) => {
  // Get all company names
  const companyNames = data.map((item) => item.company_name);

  // Get all selected years that have metrics data
  const years: number[] = [];
  data.forEach((company) => {
    Object.keys(company.years).forEach((year) => {
      if (!years.includes(parseInt(year))) {
        years.push(parseInt(year));
      }
    });
  });
  years.sort();

  const rows: RowData[] = formatRows(data, weightings);

  const columns: GridColDef[] = [
    ...(data.every((item) => Object.keys(item.years).length !== 0)
      ? [
          createColumn({
            field: 'info',
            headerName: 'Metric Name',
            flex: 3,
            maxWidth: 500,
            minWidth: 115,
            renderCell: (params) => {
              return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ pr: 1 }}>{params.value.name}</Typography>
                  </Box>
                  <Tooltip
                    title={`Provider: ${params.value.provider_name}`}
                    placement="right"
                  >
                    <InfoIcon fontSize="small" sx={{ color: 'neutral.main' }} />
                  </Tooltip>
                </Box>
              );
            },
          }),
          createColumn({
            field: 'weighting',
            headerName: 'Weighting',
            flex: 0.5,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
              <Chip
                label={params.value.toFixed(1)}
                size="small"
                color="primary"
                sx={{ bgcolor: 'primary.500' }}
              />
            ),
          }),
        ]
      : []),
    ...(data.length === 1 ? mapColumns(years) : mapColumns(companyNames)),
  ];

  // const columns: GridColDef[] = [
  //   {
  //     field: 'metricName',
  //     headerName: 'Metric Name',
  //     flex: 3,
  //     maxWidth: 500,
  //     minWidth: 115,
  //     renderCell: (params) => <Typography>{params.value}</Typography>,
  //   },
  //   {
  //     field: 'metricWeighting',
  //     headerName: 'Weighting',
  //     flex: 0.5,
  //   },
  //   ...(data.length === 1 ? mapColumns(years) : mapColumns(companyNames)),
  // ];

  return (
    <Box width="100%" height="100%">
      <DataGrid
        sx={metricTableStyle}
        rows={rows}
        columns={columns}
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
        }}
        disableRowSelectionOnClick
        columnHeaderHeight={35}
        pagination
        autoPageSize
        pageSizeOptions={[5]}
      />
    </Box>
  );
};

export default MetricsTable;

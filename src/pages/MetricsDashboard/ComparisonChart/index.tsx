import React, { useEffect, useState } from 'react';
import { PieChart, pieArcLabelClasses, pieArcClasses } from '@mui/x-charts';
import { Box, Typography, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Interface representing data for a company in the comparison chart.
 * @property {string} label - The company name.
 * @property {number} value - The ESG score of the company.
 */
interface CompanyData {
  label: string;
  value: number;
}

/**
 * Props for the ComparisonChart component.
 * @property {CompanyData[]} data - An array of company data objects.
 */
interface ComparisonChartProps {
  data: CompanyData[];
}

/**
 * Height and width (in pixels) of the ComparisonChart component
 */
const size = {
  width: 200,
  height: 200,
};

/**
 * React functional component for the metric comparison chart.
 * @param {ComparisonChartProps} props - The props for the ComparisonChart component.
 * @returns {ReactElement} React element representing the ComparisonChart component.
 */
const ComparisonChart: React.FC<ComparisonChartProps> = ({ data }) => {
  const [totalScore, setTotalScore] = useState<number>(0);

  useEffect(() => {
    setTotalScore(data.reduce((total, curr) => total + curr.value, 0));
  }, [data]);

  return (
    <Box
      sx={{
        minWidth: '150px',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        alignItems: 'center',
      }}
    >
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
      <Typography variant="h6" sx={{ color: 'primary.main' }}>
        Company ESG scores
      </Typography>
      <PieChart
        series={[
          {
            data,
            innerRadius: 0,
            outerRadius: 90,
            paddingAngle: 0,
            arcLabel: (item) => `${item.value}`,
            arcLabelMinAngle: 1,
            cornerRadius: 5,
            valueFormatter: (item) =>
              `${Math.round((item.value / totalScore) * 1000) / 10}%`,
          },
        ]}
        {...size}
        margin={{ right: 0 }}
        slotProps={{
          legend: { hidden: true },
        }}
        tooltip={{
          trigger: 'item',
        }}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: 'white',
            fontSize: 14,
          },
          [`& .${pieArcClasses.root}`]: {
            strokeWidth: 0,
          },
        }}
      />
    </Box>
  );
};

export default ComparisonChart;

import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import NavBar, { NAVBAR_HEIGHT } from '../../components/Navbar';
import FrameworksEditor from './FrameworksEditor';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  getCompanyData,
  getCompanyMetricsParsedByYears,
  getEsgScoreCalculation,
} from '../../services/firebase';
import MetricsTable from './MetricsTable';
import EsgChart from './EsgChart';
import {
  CompanyCollectionType,
  CompanyMetricsParsedByYearsReturnType,
  FrameworkMetricsType,
  MetricsByCompanyAndYearsReturnType,
  MetricsNameTypes,
  MetricsToInfoType,
} from '../../services/types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAlert } from '../../context/AlertsContext';
import { useAuth } from '../../context/UserContext';
import { ring } from 'ldrs';
import ComparisonChart from './ComparisonChart';
import TutorialScreen, {
  Position,
  RefType,
  initialPosition,
} from '../../components/TutorialScreen';
// import { User } from '@firebase/auth';

/**
 * Interface for the state object representing location.
 * @property {string} company - The name of the company.
 */
interface LocationState {
  company: string;
}

/**
 * Interface for location data.
 * @property {LocationState} state - The state object representing location.
 */
interface Location {
  state: LocationState;
}

/**
 * Props for the MetricsDashboard component.
 * @property {Location} [location] - The location data.
 */
interface MetricsDashboardProps {
  location?: Location;
}

/**
 * React functional component for a metrics dashboard.
 * @param {MetricsDashboardProps} props - The props for the MetricsDashboard component.
 * @returns {ReactElement} - React element representing the MetricsDashboard component.
 */
const MetricsDashboard: React.FC<MetricsDashboardProps> = () => {
  const theme = useTheme();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { auth } = useAuth();

  const [newStatus, setNewStatus] = useState<boolean>(false);
  const [highlightElement, setHighlightElement] = useState<RefType>(null);
  const [highlightPosition, setHighlightPosition] =
    useState<Position>(initialPosition);

  // references
  const dropdownRef = useRef<HTMLDivElement>(null);
  const yearsRef = useRef<HTMLDivElement>(null);
  const frameworksRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dataRef = useRef<HTMLButtonElement>(null);

  const refsArray = [dropdownRef, yearsRef, frameworksRef, buttonRef, dataRef];

  const updateHighlightPosition = (ref: RefType) => {
    if (!ref || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    const isFrameworks = ref === frameworksRef && metricsRef.current;
    const top = rect.top;
    const bottom = rect.bottom;
    const left = rect.left;
    const width = isFrameworks
      ? metricsRef.current.getBoundingClientRect().right - rect.left
      : rect.width;
    const height = rect.height;
    setHighlightPosition({ top, bottom, left, width, height });
  };

  const tutorialText = () => {
    let text = '';
    let endText = 'Please click anywhere to continue.';
    let content = null;
    if (highlightElement === dropdownRef) {
      text = `First select a framework from the dropdown menu. Information about each 
      framework will be displayed when you hover over it. This selection will 
      automatically assign certain metrics for you.`;
    } else if (highlightElement === yearsRef) {
      text = `Choose the year(s) for which you would like to view the data.`;
    } else if (highlightElement === frameworksRef) {
      text = `Customize the selected metrics and their respective weightings 
      according to your preferences. Additionally, feel free to search and choose from among available metrics to meet your needs.`;
    } else if (highlightElement === buttonRef) {
      text = `Press the update button to view the ESG score based on your selected metrics.`;
    } else if (highlightElement === dataRef) {
      text = `ESG Data will be displayed below the Frameworks Editor.`;
      endText =
        'That concludes this tutorial. You can access this tutorial again by selecting the question mark icon located in our navigation bar.';
    }
    return (
      <Box>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {text}
        </Typography>
        {content && content}
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {endText}
        </Typography>
      </Box>
    );
  };

  const companyId: string[] = decodeURIComponent(
    searchParams.get('company') || '4295882451'
  ).split(',');

  const isComparison: boolean = companyId.length > 1;
  const [loading, setLoading] = useState(true);
  const [metricsData, setMetricsData] = useState<
    MetricsByCompanyAndYearsReturnType[]
  >([{ company_name: '', years: {} }]);
  const [score, setScore] = useState<
    {
      label: string;
      value: number;
    }[]
  >([{ label: '', value: 0 }]);
  const [companyName, setCompanyName] = useState<string[]>([]);
  const [companyMetricsByYear, setCompanyMetricsByYear] = useState<
    MetricsByCompanyAndYearsReturnType[]
  >([]);
  const [metricWeightings, setMetricWeightings] =
    useState<FrameworkMetricsType>({});
  const handleClose = () => {
    setHighlightElement(dropdownRef);
    setNewStatus(false);
  };
  const handleChange = async (
    years: number[],
    frameworkMetrics: FrameworkMetricsType
  ) => {
    if (Object.keys(frameworkMetrics).length === 0) {
      showAlert({
        severity: 'warning',
        message: 'Please select a framework.',
      });
      return;
    } else if (years.length === 0) {
      showAlert({
        severity: 'warning',
        message: 'Please select at least one year.',
      });
      return;
    }

    let metricsDataTemp: MetricsByCompanyAndYearsReturnType[] = [];
    let scoreTemp: {
      label: string;
      value: number;
    }[] = [];

    companyMetricsByYear.forEach((company) => {
      const data: MetricsByCompanyAndYearsReturnType = {
        company_name: company.company_name,
        years: {},
      };

      data.years = years.reduce((res, key) => {
        res[key] = Object.keys(company.years[key])
          .filter((metric) => Object.keys(frameworkMetrics).includes(metric))
          .reduce((metrics, metric) => {
            metrics[metric as MetricsNameTypes] = {
              value: company.years[key][metric as MetricsNameTypes]?.value ?? 0,
              provider_name:
                company.years[key][metric as MetricsNameTypes]?.provider_name ??
                '',
            };
            return metrics;
          }, {} as MetricsToInfoType);
        return res;
      }, {} as CompanyMetricsParsedByYearsReturnType);

      metricsDataTemp.push(data);
      getEsgScoreCalculation(data.years, frameworkMetrics).then((dataScore) => {
        scoreTemp.push({ label: data.company_name, value: dataScore });
      });
    });

    setMetricsData(metricsDataTemp);
    setScore(scoreTemp);
    setMetricWeightings(frameworkMetrics);
  };

  const fetchCompanyData = useCallback(async () => {
    const companyData: CompanyCollectionType[] = [];
    const companyDataPromises: Promise<CompanyCollectionType | void>[] = [];
    const companyMetricsPromises: Promise<any>[] = [];
    for (let company of companyId) {
      companyDataPromises.push(
        getCompanyData(parseInt(company))
          .then((data): void => {
            companyData.push(data);
          })
          .catch((error) => {
            showAlert({ severity: 'error', message: error.message });
            navigate('/');
          })
      );
      companyMetricsPromises.push(
        getCompanyMetricsParsedByYears(parseInt(company))
      );
    }
    await Promise.all(companyDataPromises);
    setCompanyName(companyData.map((data) => data.company_name));
    setScore(
      companyData.map((data) => ({ label: data.company_name, value: 0 }))
    );

    Promise.all(companyMetricsPromises).then((metrics) => {
      setCompanyMetricsByYear(
        metrics.map((metric, i) => ({
          company_name: companyData[i].company_name,
          metrics: [],
          years: metric,
        }))
      );
    });
  }, [companyId, navigate, showAlert]);

  // all data loaded
  useEffect(() => {
    if (
      loading &&
      companyName.length > 0 &&
      score[0].label !== '' &&
      companyMetricsByYear.length > 0
    ) {
      console.log(companyMetricsByYear);
      setLoading(false);
    }
  }, [companyName, score, loading, companyMetricsByYear]);

  useEffect(() => {
    ring.register();
    const unsubscribe = auth.onAuthStateChanged(() => {
      if (loading) {
        fetchCompanyData();
      }
    });
    return unsubscribe;
  }, [auth, fetchCompanyData, loading]);

  return (
    <Box height={`calc(100vh - ${NAVBAR_HEIGHT})`}>
      <TutorialScreen
        page={2}
        loaded={!loading}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        handleClose={handleClose}
        pos={highlightPosition}
        refsArray={refsArray}
        highlightElement={dropdownRef}
        setHighlightElement={setHighlightElement}
        updateHighlightPosition={updateHighlightPosition}
        tutorialText={tutorialText}
      />
      <NavBar newStatus={newStatus} setNewStatus={setNewStatus} />
      {loading ? (
        <Container
          sx={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          maxWidth="sm"
        >
          <l-ring
            size="40"
            stroke="5"
            speed="2"
            color={theme.palette.info.main}
          />
        </Container>
      ) : (
        <>
          <Stack sx={[{ px: { md: 8, xs: 4 }, pt: 8, pb: 4 }]} spacing={2}>
            <Typography variant="h1">Metrics</Typography>
            <Typography variant="h2" color="info.main">
              {companyName.map((name, index) => (
                <React.Fragment key={index}>
                  {name}
                  {index !== companyName.length - 1 && (
                    <Box component="span" sx={{ color: 'info.contrastText' }}>
                      {' vs '}
                    </Box>
                  )}
                </React.Fragment>
              ))}
            </Typography>
          </Stack>
          <FrameworksEditor
            onChange={handleChange}
            companiesData={companyMetricsByYear}
            isComparison={isComparison}
            dropdownRef={dropdownRef}
            yearsRef={yearsRef}
            frameworksRef={frameworksRef}
            metricsRef={metricsRef}
            buttonRef={buttonRef}
          />
          <Box ref={dataRef}>
            <Grid container alignItems="flex-start">
              <Grid
                item
                xs={12}
                sm={12}
                md={10}
                sx={{
                  order: { xs: 2, sm: 2, md: 1 },
                }}
              >
                <MetricsTable
                  data={metricsData}
                  weightings={metricWeightings}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={2}
                sx={{
                  order: { xs: 1, sm: 1, md: 2 },
                }}
              >
                {isComparison ? (
                  <ComparisonChart data={score} />
                ) : (
                  <EsgChart score={score[0].value} />
                )}
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
};

export default MetricsDashboard;

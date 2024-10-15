import {
  Box,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Stack,
  Tooltip,
  Collapse,
  IconButton,
  Avatar,
  SelectChangeEvent,
  useTheme,
  Divider,
  Menu,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddIcon from '@mui/icons-material/Add';
import { ring } from 'ldrs';
import SearchSelector from './SearchSelector';
import { FC, useEffect, useRef, useState } from 'react';
import NewFrameworkDialog from './NewFrameworkDialog';
import ReplayIcon from '@mui/icons-material/Replay';
import {
  FrameworkMetricsType,
  FrameworksReturnType,
  MetricsByCompanyAndYearsReturnType,
  MetricsDescriptionReturnType,
  MetricsNameTypes,
  MetricsToBoolType,
} from '../../../services/types';
import {
  addFramework,
  downloadFramework,
  getFrameworks,
  getMetricDescription,
  uploadFramework,
} from '../../../services/firebase';
import { useAuth } from '../../../context/UserContext';
import { getNumberArrayFromKeys } from '../../../utils/helpers';
import { metricDisabledDefault } from '../../../utils/default';
import { useAlert } from '../../../context/AlertsContext';
import UserInstructions from './UserInstructions';
import UploadFrameworkDialog from './UploadFrameworkDialog';

/**
 * Props for the FrameworksEditor component.
 * @property {function} onChange - Function called when years or metrics change.
 * @property {number[]} availableYears - The available years to select.
 */
interface FrameworksEditorProps {
  onChange: (years: number[], metrics: FrameworkMetricsType) => void;
  isComparison: boolean;
  companiesData: MetricsByCompanyAndYearsReturnType[];
  dropdownRef: React.RefObject<HTMLDivElement>;
  yearsRef: React.RefObject<HTMLDivElement>;
  frameworksRef: React.RefObject<HTMLDivElement>;
  metricsRef: React.RefObject<HTMLDivElement>;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const frameworkActions = {
  create: <AddIcon color="primary" />,
  reset: <ReplayIcon color="primary" />,
  download: <DownloadIcon color="primary" />,
  upload: <UploadFileIcon color="primary" />,
};

/**
 * Functional component for editing frameworks.
 * @param {FrameworksEditorProps} props - The props for the FrameworksEditor component.
 * @returns {React.ReactElement} - React element representing the FrameworksEditor component.
 */
const FrameworksEditor: FC<FrameworksEditorProps> = ({
  onChange,
  isComparison,
  companiesData,
  dropdownRef,
  yearsRef,
  frameworksRef,
  metricsRef,
  buttonRef,
}) => {
  const theme = useTheme();
  const { auth } = useAuth();
  const { showAlert } = useAlert();
  const frameworkMetricsRef = useRef();
  const otherMetricsRef = useRef();

  const [isLoading, setIsLoading] = useState(true);
  const [isMetricsEditorOpen, setIsMetricsEditorOpen] = useState(true);
  const [isNewFrameworkDialogOpen, setIsNewFrameworkDialogOpen] =
    useState(false);
  const [isUploadFrameworkDialogOpen, setIsUploadFrameworkDialogOpen] =
    useState(false);
  const [frameworks, setFrameworks] = useState<FrameworksReturnType>({});

  const [years, setYears] = useState<number[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);

  const [metricDescriptions, setMetricDescriptions] =
    useState<MetricsDescriptionReturnType>({});

  const [selectedMetrics, setSelectedMetrics] = useState<FrameworkMetricsType>(
    {} as FrameworkMetricsType
  );
  const [originalMetrics, setOriginalMetrics] = useState<FrameworkMetricsType>(
    {} as FrameworkMetricsType
  );
  const [frameworkMetrics, setFrameworkMetrics] = useState<string[]>([]);
  const [otherMetrics, setOtherMetrics] = useState<string[]>([]);
  const [isDisabledMetrics, setIsDisabledMetrics] = useState<MetricsToBoolType>(
    {}
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isFrameworkActionsOpen = Boolean(anchorEl);
  const [currentFramework, setCurrentFramework] = useState<string>('');

  useEffect(() => {
    const availableYears =
      companiesData.length === 1
        ? getNumberArrayFromKeys(companiesData[0].years).reverse() // single company
        : companiesData // comparison table
            .map((data) => getNumberArrayFromKeys(data.years))
            .reduce((result, curr) => {
              return result.filter((year) => curr.includes(year));
            }) // gets all years common to all companies
            .filter(
              (year) =>
                companiesData
                  .map((data) => Object.keys(data.years[year]))
                  .reduce((result, curr) =>
                    result.filter((metric) => curr.includes(metric))
                  ).length !== 0
            ) // then also filters those years for ones that have at least one metric shared across all companies
            .reverse();

    setYears(availableYears);
  }, [companiesData]);

  useEffect(() => {
    ring.register();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && Object.keys(metricDescriptions).length === 0) {
        getFrameworks(user.uid).then((data) => {
          setFrameworks(data);
        });
        getMetricDescription().then((data) => {
          setMetricDescriptions(data);
          setOtherMetrics(Object.keys(data));
        });
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  useEffect(() => {
    if (
      isLoading &&
      Object.keys(frameworks).length !== 0 &&
      Object.keys(metricDescriptions).length !== 0
    ) {
      setIsLoading(false);
    }
  }, [frameworks, metricDescriptions, isLoading]);

  useEffect(() => {
    const disabled: MetricsToBoolType = { ...metricDisabledDefault };

    selectedYears.forEach((year) => {
      companiesData
        .map((company) => Object.keys(company.years[year as number]))
        .reduce((result, curr) =>
          result.filter((metric) => curr.includes(metric))
        )
        .forEach((metric) => (disabled[metric as MetricsNameTypes] = true));
    });

    setIsDisabledMetrics({ ...disabled });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYears]);

  const handleFrameworkChange = (event: SelectChangeEvent<string>) => {
    const frameworkId = event.target.value;
    const metrics = frameworks[frameworkId].metrics;
    setCurrentFramework(frameworkId);

    setSelectedMetrics({ ...metrics } || {});
    setOriginalMetrics({ ...metrics } || {});
    const newFrameworkMetrics = Object.keys({ ...metrics } || {});
    setFrameworkMetrics(newFrameworkMetrics);
    setOtherMetrics(
      Object.keys(metricDescriptions).filter(
        (metric) => !newFrameworkMetrics?.includes(metric)
      )
    );

    (frameworkMetricsRef.current as any).resetSelection({ ...metrics });
    (otherMetricsRef.current as any).resetSelection({});
  };

  const handleSelectedMetricsChange = (
    metric: MetricsNameTypes,
    weighting?: number
  ) => {
    if (weighting !== undefined) {
      setSelectedMetrics({ ...selectedMetrics, [metric]: weighting });
    } else {
      delete selectedMetrics[metric];
      setSelectedMetrics(selectedMetrics);
    }
  };

  const handleSelectedYearsChange = (year: number) => {
    if (isComparison) {
      setSelectedYears([year]);
    } else {
      if (selectedYears.includes(year)) {
        setSelectedYears(
          selectedYears.filter((selectedYear) => selectedYear !== year)
        );
      } else {
        setSelectedYears(selectedYears.concat(year));
      }
    }
  };

  const handleFrameworkAction = (action: string) => {
    handleCloseFrameworkActions();
    switch (action) {
      case 'create':
        setIsNewFrameworkDialogOpen(true);
        break;
      case 'edit':
        break;
      case 'reset':
        handleResetFramework();
        break;
      case 'download':
        handleDownloadFramework();
        break;
      case 'upload':
        setIsUploadFrameworkDialogOpen(true);
        break;
      default:
        break;
    }
  };

  const handleCloseFrameworkActions = () => {
    setAnchorEl(null);
  };

  const handleClickFrameworkAction = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCreateFramework = (
    name: string,
    description: string,
    isPublic: boolean
  ) => {
    if (auth.currentUser) {
      addFramework(
        auth.currentUser.uid,
        name,
        description,
        selectedMetrics,
        isPublic
      );
      getFrameworks(auth.currentUser.uid).then((data) => {
        setFrameworks(data);
      });

      showAlert({
        severity: 'success',
        message: `Framework "${name}" successfully created.`,
      });
    }
  };

  const handleResetFramework = () => {
    setSelectedMetrics({ ...originalMetrics });
    (frameworkMetricsRef.current as any).resetSelection({ ...originalMetrics });
    (otherMetricsRef.current as any).resetSelection({});
    showAlert({
      severity: 'success',
      message: 'Framework reset successfully.',
    });
  };

  const handleDownloadFramework = () => {
    downloadFramework(frameworks[currentFramework]).then(() =>
      showAlert({
        severity: 'success',
        message: 'Framework downloaded successfully',
      })
    );
  };

  const handleUploadFramework = async (file: File) => {
    if (auth.currentUser) {
      uploadFramework(auth.currentUser.uid, file).then(() =>
        showAlert({
          message: 'Framework uploaded successfully',
          severity: 'success',
        })
      );

      getFrameworks(auth.currentUser.uid).then((data) => {
        setFrameworks(data);
      });
    }
  };

  return (
    <Stack>
      <Box sx={{ p: 3, bgcolor: 'common.white' }}>
        <Stack direction="column">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 1,
              flexDirection: {
                xs: 'column',
                sm: 'column',
                md: 'row',
              },
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ minWidth: 360 }} flexGrow={1} ref={dropdownRef}>
                <FormControl fullWidth>
                  <InputLabel>Framework</InputLabel>
                  <Select
                    sx={{
                      bgcolor: 'background.default',
                      color: 'primary.main',
                      '& .MuiSelect-icon': {
                        color: 'neutral.main',
                      },
                    }}
                    label="Framework"
                    defaultValue=""
                    onChange={handleFrameworkChange}
                  >
                    {Object.keys(frameworks).map((id) => {
                      const { name, description } = frameworks[id];
                      return (
                        <MenuItem
                          key={id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                          value={id}
                        >
                          <Tooltip title={description} placement="right" arrow>
                            <Box sx={{ width: '100%' }}>{name}</Box>
                          </Tooltip>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: { xs: 'space-between' } }}
            >
              <Button
                sx={{ lineHeight: '130%' }}
                variant="contained"
                onClick={handleClickFrameworkAction}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Framework Options
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={isFrameworkActionsOpen}
                onClose={handleCloseFrameworkActions}
                elevation={0}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {Object.entries(frameworkActions).map(([action, icon]) => {
                  const items = [
                    <MenuItem
                      key={action}
                      onClick={() => handleFrameworkAction(action)}
                      disableRipple
                      disabled={
                        currentFramework === '' &&
                        !['create', 'upload'].includes(action)
                      }
                    >
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText>
                        {action.charAt(0).toUpperCase() + action.slice(1)}
                      </ListItemText>
                    </MenuItem>,
                  ];

                  if (action === 'download') {
                    items.unshift(<Divider sx={{ my: 0.5 }} />);
                  }

                  return items;
                })}
              </Menu>
              <Button
                ref={buttonRef}
                variant="contained"
                onClick={() =>
                  onChange(
                    selectedYears,
                    Object.fromEntries(
                      Object.entries(selectedMetrics).filter(
                        ([metric, _]) =>
                          isDisabledMetrics[metric as MetricsNameTypes]
                      )
                    )
                  )
                }
                sx={{ bgcolor: 'info.main', lineHeight: '130%' }}
              >
                Update ESG Score
              </Button>
            </Stack>
          </Box>
          <Collapse in={isMetricsEditorOpen}>
            <UserInstructions />
            <Box
              sx={{
                flexGrow: 1,
                pt: 3,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {isLoading ? (
                <l-ring
                  size="40"
                  stroke="5"
                  speed="2"
                  color={theme.palette.info.main}
                ></l-ring>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3} md={2}>
                    <Box ref={yearsRef}>
                      <SearchSelector
                        searchCategory="years"
                        searchItems={years}
                        onChange={handleSelectedYearsChange}
                        hideSearch
                        isComparison={isComparison}
                        emptyMessage="No years that contain metric data for all selected companies."
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={9} md={5}>
                    <Box ref={frameworksRef}>
                      <SearchSelector
                        searchCategory="framework metrics"
                        searchItems={frameworkMetrics}
                        itemTooltips={metricDescriptions}
                        itemDefaultValues={selectedMetrics}
                        hasValues
                        onChange={handleSelectedMetricsChange}
                        ref={frameworkMetricsRef}
                        emptyMessage="Select a framework to view related metrics."
                        showItemCondition={(item?: string | number) => {
                          if (!item || typeof item === 'number') return false;
                          return (
                            isDisabledMetrics[item as MetricsNameTypes] || false
                          );
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={5}>
                    <Box ref={metricsRef}>
                      <SearchSelector
                        searchCategory="other metrics"
                        searchItems={otherMetrics}
                        itemTooltips={metricDescriptions}
                        itemDefaultValues={selectedMetrics}
                        hasValues
                        onChange={handleSelectedMetricsChange}
                        ref={otherMetricsRef}
                        showItemCondition={(item?: string | number) => {
                          if (!item || typeof item === 'number') return false;
                          return (
                            isDisabledMetrics[item as MetricsNameTypes] || false
                          );
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Collapse>
        </Stack>
      </Box>
      <Box sx={{ mt: -2.5, alignSelf: 'center' }}>
        <Avatar sx={{ bgcolor: 'secondary.main' }}>
          <IconButton
            onClick={() => setIsMetricsEditorOpen(!isMetricsEditorOpen)}
          >
            <ExpandMoreIcon
              sx={{
                transform: isMetricsEditorOpen
                  ? 'rotate(180deg)'
                  : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
              htmlColor="white"
            />
          </IconButton>
        </Avatar>
      </Box>
      <NewFrameworkDialog
        isOpen={isNewFrameworkDialogOpen}
        onClose={() => setIsNewFrameworkDialogOpen(false)}
        onCreateFramework={handleCreateFramework}
      />
      <UploadFrameworkDialog
        isOpen={isUploadFrameworkDialogOpen}
        onClose={() => setIsUploadFrameworkDialogOpen(false)}
        onUploadFramework={handleUploadFramework}
      />
    </Stack>
  );
};

export default FrameworksEditor;

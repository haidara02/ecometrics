import React, { useEffect, useRef, useState } from 'react';
import { Typography, Box, Button, Container, useTheme } from '@mui/material';

import NavBar, { NAVBAR_HEIGHT } from '../../components/Navbar';
import SearchIcon from '@mui/icons-material/Search';
import CompaniesTable, { TableRowType } from './CompaniesTable';
import {
  companiesContentContainer,
  companyContentHeader,
  metricsViewButton,
} from './style';
import { getAllCompaniesTableData } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../context/AlertsContext';
import { useAuth } from '../../context/UserContext';
import { ring } from 'ldrs';
import ValueComparison from './CompaniesTable/ValueComparison';
import TutorialScreen, {
  Position,
  RefType,
  initialPosition,
} from '../../components/TutorialScreen';

/**
 * React functional component for company selection on the data grid.
 * @returns {ReactElement} React element representing the CompanySelection component.
 */
const CompanySelection: React.FC = () => {
  const theme = useTheme();
  const { showAlert } = useAlert();
  const { auth } = useAuth();
  const [newStatus, setNewStatus] = useState<boolean>(false);
  const [companyData, setCompanyData] = useState<TableRowType[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<TableRowType[]>(
    []
  );

  const [highlightElement, setHighlightElement] = useState<RefType>(null);
  const [loaded, setLoaded] = useState(false);
  const [highlightPosition, setHighlightPosition] =
    useState<Position>(initialPosition);

  //references
  const buttonRef = useRef<HTMLButtonElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const esgColumnRef = useRef<HTMLDivElement>(null);
  const cmpyColumnRef = useRef<HTMLDivElement>(null);

  const refsArray = [
    gridRef,
    cmpyColumnRef,
    esgColumnRef,
    toolbarRef,
    buttonRef,
  ];

  const updateHighlightPosition = (ref: RefType) => {
    if (!ref || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const isColumn =
      (ref === esgColumnRef || ref === cmpyColumnRef) &&
      toolbarRef.current &&
      gridRef.current &&
      footerRef.current;
    const top = isColumn
      ? toolbarRef.current.getBoundingClientRect().bottom
      : rect.top;
    const bottom = rect.bottom;
    const left = rect.left;
    const width = rect.width;
    const height = isColumn
      ? gridRef.current.getBoundingClientRect().height -
        (toolbarRef.current.getBoundingClientRect().height +
          footerRef.current.getBoundingClientRect().height)
      : rect.height;
    setHighlightPosition({ top, bottom, left, width, height });
  };

  const tutorialText = () => {
    let text = '';
    let endText = 'Please click anywhere to continue.';
    let content = null;

    if (highlightElement === esgColumnRef) {
      text =
        "The dashboard also provides concise summaries like the ESG rating of each company, which represents the mean of the company's metric values for the most recent available year.";
      content = (
        <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
          <ValueComparison previousYrValue={10} currentYrValue={12} />
          <Typography variant="subtitle1" sx={{ ml: 1, color: 'common.black' }}>
            Comparator tags at the end indicate percentage changes in a
            company's score compared to the last available year.
          </Typography>
        </Box>
      );
    } else if (highlightElement === gridRef) {
      text =
        'Above is the companies dashboard, featuring a curated list of diverse enterprises.';
    } else if (highlightElement === cmpyColumnRef) {
      text = `To check the metrics of these companies, just select one or more from the list in the companies column to activate the "${
        selectedCompanies.length > 1 ? 'Compare metrics' : 'View metrics'
      }" button.`;
    } else if (highlightElement === toolbarRef) {
      text =
        'The toolbar enables you to filter the list of companies by their names.';
    } else if (highlightElement === buttonRef) {
      text =
        'Once one or more companies are selected, you can view or compare companies metrics with the highlighted button.';
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

  /**
   * Fetches company data on component mount.
   */
  useEffect(() => {
    ring.register();
    updateHighlightPosition(gridRef);
    const unsubscribe = auth.onAuthStateChanged(() => {
      if (loaded || !auth.currentUser) return;
      getAllCompaniesTableData(() =>
        showAlert({
          severity: 'error',
          message: 'Error getting list of companies.',
        })
      ).then((rows) => {
        setCompanyData(rows);
      });
    });
    return unsubscribe; // eslint-disable-next-line
  }, [auth, loaded, showAlert]);

  /**
   * Handles the click event to view metrics for selected companies.
   * @param {TableRowType[]} selectedCompanies - Companies on the table selected via the checkbox.
   */
  useEffect(() => {
    if (companyData.length > 0) setLoaded(true);
  }, [companyData]);

  const handleClose = () => {
    setHighlightElement(gridRef);
    setNewStatus(false);
  };

  const navigate = useNavigate();
  const handleViewMetrics = (selectedCompanies: TableRowType[]) => {
    // Redirect to metrics page with selected companies
    navigate({
      pathname: `/metrics-dashboard`,
      search: `?company=${encodeURIComponent(
        selectedCompanies.map((company) => company.id).join(',')
      )}`,
    });
  };

  return (
    <Box height={`calc(100vh - ${NAVBAR_HEIGHT})`}>
      <TutorialScreen
        page={1}
        loaded={loaded}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        handleClose={handleClose}
        pos={highlightPosition}
        refsArray={refsArray}
        highlightElement={gridRef}
        setHighlightElement={setHighlightElement}
        updateHighlightPosition={updateHighlightPosition}
        tutorialText={tutorialText}
      />
      {!loaded ? (
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
          <NavBar newStatus={newStatus} setNewStatus={setNewStatus} />
          <Box sx={companiesContentContainer}>
            <Box sx={companyContentHeader}>
              <Box>
                <Box display="flex" alignItems="center" flexWrap={'wrap'}>
                  <Typography variant="h1" mr={1} mb={1}>
                    Companies
                  </Typography>
                  <Box bgcolor="secondary.50" borderRadius={8} paddingX={1}>
                    <Typography variant="body1" p={1} color="secondary.900">
                      {companyData.length}
                      {companyData.length === 1 ? ' company' : ' companies'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Button
                ref={buttonRef}
                variant="contained"
                disabled={
                  !(selectedCompanies.length > 0) &&
                  highlightElement !== buttonRef
                }
                aria-label="view-metrics"
                sx={metricsViewButton}
                onClick={() => handleViewMetrics(selectedCompanies)}
              >
                <SearchIcon fontSize="inherit" />
                <Typography
                  variant="subtitle1"
                  color="inherit"
                  sx={{ ml: '8px' }}
                >
                  {selectedCompanies.length > 1
                    ? 'Compare metrics'
                    : 'View metrics'}
                </Typography>
              </Button>
            </Box>
            <Typography variant="subtitle1">
              Keep track of companies and their ESG performance.
            </Typography>

            <Box width="100%" height="100%" ref={gridRef}>
              <CompaniesTable
                data={companyData}
                selectedCompanies={selectedCompanies}
                setSelectedCompanies={setSelectedCompanies}
                esgColumnRef={esgColumnRef}
                toolbarRef={toolbarRef}
                cmpyColumnRef={cmpyColumnRef}
                footerRef={footerRef}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CompanySelection;

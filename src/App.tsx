import { BrowserRouter, Routes, Route } from 'react-router-dom';

import UserProfile from './pages/UserPage';
import CompanySelection from './pages/CompanySelection';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { useThemeContext } from './context/ThemeContextProvider';
import AlertProvider from './context/AlertsContext';
import UserProvider from './context/UserContext';
import MetricsDashboard from './pages/MetricsDashboard';
import CSVUpload from './pages/CSVUpload';

function App() {
  const { theme } = useThemeContext();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AlertProvider>
          <UserProvider>
            <Routes>
              <Route path="/" element={<CompanySelection />} />
              <Route path="/auth/:action" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify" element={<VerifyEmail />} />
              <Route path="/metrics-dashboard" element={<MetricsDashboard />} />
              <Route path="/user/profile" element={<UserProfile />} />
              <Route path="/csv-upload" element={<CSVUpload />} />
            </Routes>
          </UserProvider>
        </AlertProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

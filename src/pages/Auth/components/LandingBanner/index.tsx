import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import logo from '../../../../assets/logo-alt.svg';
import {
  authHeroContainer,
  authHeroContentContainer,
  blueCircleDecoration,
  whiteCircleDecoration,
} from './style';

/**
 * Props for the LandingBanner component.
 * @property {string} heading - The heading text to be displayed in the banner.
 */
interface LandingBannerProps {
  heading: string;
}

/**
 * React functional component for displaying a heading, description, and logo.
 * @param {LandingBannerProps} props - The props for the LandingBanner component.
 * @returns {ReactElement} React element representing the LandingBanner component.
 */
const LandingBanner: React.FC<LandingBannerProps> = ({ heading }) => {
  return (
    <Box sx={authHeroContainer}>
      <Container maxWidth="xs" sx={authHeroContentContainer}>
        <Typography fontSize="60px" fontWeight="500" color="white">
          {heading}
        </Typography>
        <Typography fontSize="18px" color="white">
          EcoMetrics streamlines sustainable investing. Stay current with the
          latest ESG data and make informed decisions with our intuitive
          platform.
        </Typography>
        <Box p="20px" component="img" src={logo} alt="Company Logo" />
      </Container>
      <Box sx={whiteCircleDecoration} />
      <Box sx={blueCircleDecoration} />
    </Box>
  );
};

export default LandingBanner;

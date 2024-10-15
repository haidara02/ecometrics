import { Tooltip, Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import React, { useEffect, useRef, useState } from 'react';

type OverflowTooltipType = {
  text: string;
  color?: string;
  variant?: Variant;
};
const OverflowTooltip: React.FC<OverflowTooltipType> = ({
  text,
  variant,
  color,
}) => {
  const [hoverStatus, setHover] = useState<boolean>(false);

  const textElementRef = useRef<HTMLDivElement>(null);

  const compareSize = () => {
    if (!textElementRef?.current) return;
    const compare =
      textElementRef.current.scrollWidth > textElementRef.current.clientWidth;
    setHover(compare);
  };

  // compare once and add resize listener on "componentDidMount"
  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
    return () => {
      window.removeEventListener('resize', compareSize);
    };
  }, []);

  return (
    <Tooltip title={text} disableHoverListener={!hoverStatus}>
      <Typography
        ref={textElementRef}
        overflow="hidden"
        textOverflow="ellipsis"
        color={color}
        variant={variant}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};

export default OverflowTooltip;

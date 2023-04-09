import { Box, Typography } from "@mui/material";
import React from "react";

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Property({
  label,
  value,
  vertical,
} = {}) {

  return (
    <Box display='flex' flexDirection={vertical ? 'column' : 'row'} sx={{ width: '100%' }} >
      <Typography color='textSecondary'>
        {label}
      </Typography>
      <Box flexGrow={vertical ? 0 : 1} textAlign={vertical ? 'left' : 'right'}>
        {value}
      </Box>
    </Box>
  );

}

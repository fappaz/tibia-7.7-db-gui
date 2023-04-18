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
      <Typography color='textSecondary' variant='body2'>
        {label}
      </Typography>
      {
        !vertical && <Box p={1}/>
      }
      <Box
        display='flex'
        flexGrow={vertical ? 0 : 1}
        justifyContent={vertical ? 'center' : 'flex-end'}
        textAlign={ vertical ? 'start' : 'end' }

      >
        <Typography variant='body2'>
          {value}
        </Typography>
      </Box>
    </Box>
  );

}

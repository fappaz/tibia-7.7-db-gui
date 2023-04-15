import { Box, Grid } from "@mui/material";
import React from "react";
import Title from "./text/Title";

const topBarHeight = 64;

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function StandardPage({
  title,
  children,
  contentProps,
} = {}) {

  return (
    <Box
      id='page-root'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: `calc(100% - ${topBarHeight}px)`,
        p: 3,
      }}
    >
      {
        !!title && (
          <Box mb={2}>
            <Title>{title}</Title>
          </Box>
        )
      }

      <div id='page-content' style={{ flexGrow: 1 }} {...contentProps}>
        {children}
      </div>
    </Box>
  )
}

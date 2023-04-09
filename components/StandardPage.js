import { Box, Grid } from "@mui/material";
import React from "react";
import Title from "./text/Title";

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
    <div id='page-root' style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box mb={2}>
        <Title>{title}</Title>
      </Box>

      <div id='page-content' style={{ flexGrow: 1 }} {...contentProps}>
        {children}
      </div>
    </div>
  )
}

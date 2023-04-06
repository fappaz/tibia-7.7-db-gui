import { Grid } from "@mui/material";
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
} = {}) {

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Title>{title}</Title>
      </Grid>

      <Grid item xs={12}>
        {children}
      </Grid>
    </Grid>
  )
}

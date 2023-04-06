import { Typography } from "@mui/material";
import React from "react";

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Title({
  children,
} = {}) {

  return (
    <Typography variant="h6">{children}</Typography>
  );

}

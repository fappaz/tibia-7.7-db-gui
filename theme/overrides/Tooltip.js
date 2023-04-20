// ----------------------------------------------------------------------

export default function Tooltip(theme) {
  return {
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.grey[800]
        },
        arrow: {
          color: theme.palette.grey[800]
        }
      }
    }
  };
}

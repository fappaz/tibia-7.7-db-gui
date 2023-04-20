// ----------------------------------------------------------------------

export default function Select(theme) {
  return {
    MuiSelect: {
      defaultProps: {
        InputLabelProps: {
          shrink: true,
        },
        variant: 'outlined',
      },
    },
  };
}

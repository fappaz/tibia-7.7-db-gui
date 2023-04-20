// ----------------------------------------------------------------------

export default function TextField(theme) {
  return {
    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          shrink: true,
        },
        variant: 'outlined',
        fullWidth: true,
      },
    },
  };
}

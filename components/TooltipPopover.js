import { Tooltip, styled, tooltipClasses } from "@mui/material";

/**
 * From MUI example: https://mui.com/material-ui/react-tooltip/#customization
 * 
 * Notes:
 * 
 * - If the child is a custom component, you need to forward the ref with `React.forwardRef` (see [MUI docs](https://mui.com/material-ui/react-tooltip/#customization)).
 * - The child must be a single element, not a list of elements.
 * - The child cannot be a "primitive" text node.
 * 
 * @usage
 * <TooltipPopover title={<Typography>This is a tooltip</Typography>}>
 *  <span>Hover here</span>
 * </TooltipPopover>
 * 
 */
const TooltipPopover = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    arrow
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: '100%',
    // backgroundColor: '#f5f5f9',
    // color: 'rgba(0, 0, 0, 0.87)',
    // fontSize: theme.typography.pxToRem(12),
    // border: '1px solid #dadde9',
  },
}));

/** For the lack of a better name */
export default TooltipPopover;
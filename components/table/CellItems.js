import { Box, Link } from "@mui/material";
import PageLink from "next/link";

/**
 * @typedef ItemLink
 * @property {string} path The relative URL path to the item (e.g.: '/creatures/dragon').
 * @property {boolean} [newTab] (optional) If true, the link will open in a new tab.
 */

/**
 * @typedef CellItem
 * @property {ItemLink} [link] (optional) If provided, the label will be displayed as a link.
 * @property {string} label The label to display.
 * @property {string} [value] A value to be displayed inside parentheses after the label.
 */

/**
 * 
 * @param {Object} props The props.
 * @param {CellItem[]} [props.items] The items.
 * @returns {import("react").ReactNode}
 */
export default function CellItems({
  items = [],
} = {}) {

  return (
    <Box display='block'>
      {
        items.map((item, index) => {
          const { link, label, value } = item;
          if (!item) return <></>;
          return (
            <span key={`item-${index}`}>
              {
                link ? (
                  <Link
                    component={PageLink}
                    href={link.path}
                    {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {label}
                  </Link>
                ) : (
                  label
                )
              }

              {
                value ? ` (${value})` : ''
              }

              {index < items.length - 1 ? ', ' : ''}
            </span>
          );
        })
      }
    </Box>
  );
}
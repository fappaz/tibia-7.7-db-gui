import { useState } from "react";
import { Box } from "@mui/material";

/**
 * 
 * @param {Object} props The props.
 * @param {import("react").ReactNode[]} [props.children] The content of the tab.
 * @param {Number} props.activeTabIndex The current active tab index.
 * @param {Number} [props.tabsHeight] (optional) The tabs height, in pixels. (default: 32)
 * @param {Number} props.index This tab's index.
 * @returns {import("react").ReactNode}
 */
export default function TabContent({
  children,
  activeTabIndex,
  index,
  tabsHeight = 32,
  ...other
} = {}) {
  
  return (
    <Box
      role="tabpanel"
      hidden={activeTabIndex !== index}
      id={`tab-${index}`}
      sx={{
        // height: '100%',
        height: `calc(100% - ${tabsHeight}px)`,
      }}
      {...other}
    >
      {activeTabIndex === index && (
        <Box sx={{ height: '100%' }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

/**
 * 
 * @param {Number} initialTabIndex The initial tab index.
 * @returns {activeTabIndex: Number, setActiveTabIndex: Function }
 */
export function useTabContent(initialTabIndex = 0) {
  
  const [activeTabIndex, setActiveTabIndex] = useState(initialTabIndex);

  return {
    activeTabIndex,
    setActiveTabIndex,
  }
}
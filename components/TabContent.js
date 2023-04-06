import { useState } from "react";
import { Box } from "@mui/material";

/**
 * 
 * @param {Object} props The props.
 * @param {import("react").ReactNode[]} [props.children] The content of the tab.
 * @param {Number} props.activeTabIndex The current active tab index.
 * @param {Number} props.index This tab's index.
 * @returns {import("react").ReactNode}
 */
export function TabContent({ children, activeTabIndex, index, ...other } = {}) {
  
  return (
    <div
      role="tabpanel"
      hidden={activeTabIndex !== index}
      id={`tab-${index}`}
      {...other}
    >
      {activeTabIndex === index && (
        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

/**
 * 
 * @param {Number} initialTabIndex The initial tab index.
 * @returns {activeTabIndex: Number, handleTabChange: Function }
 */
export function useTabContent(initialTabIndex = 0) {
  
  const [activeTabIndex, setActiveTabIndex] = useState(initialTabIndex);

  const handleTabChange = (event, newValue) => {
    setActiveTabIndex(newValue);
  };

  return {
    activeTabIndex,
    handleTabChange,
  }
}
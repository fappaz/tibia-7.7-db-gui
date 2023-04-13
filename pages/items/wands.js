import { objects } from "../../database/database.json";
import { getWandAndRodColumns } from "../../components/table/ObjectColumns";
import ObjectsTable from "../../components/table/ObjectsTable";
import StandardPage from "../../components/StandardPage";
import TabContent, { useTabContent } from "../../components/TabContent";
import { Box, Tabs, Tab } from "@mui/material";

/**\
 * @TODO (future) use constants
 * @TODO (future) move each to their own file?
 * */
const tabs = [
  {
    title: 'Wands',
    professionId: 8,
  },
  {
    title: 'Rods',
    professionId: 16,
  },
];

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function WandsAndRodItems({

} = {}) {

  const { activeTabIndex, setActiveTabIndex } = useTabContent(0);

  return (
    <StandardPage title='Wands and Rods'>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTabIndex} onChange={(e, tabIndex) => setActiveTabIndex(tabIndex)}>
          {
            tabs.map((tab, index) => (
              <Tab
                id={`tab-${index}`}
                key={`tab-${index}`}
                label={tab.title}
              />
            ))
          }
        </Tabs>
      </Box>
      {
        tabs.map((tab, index) => (
          <TabContent activeTabIndex={activeTabIndex} index={index} key={`tab-panel-${index}`}>
            <ObjectsTable
              data={objects.filter(({ attributes }) => (attributes || {}).Professions === tab.professionId)}
              typeColumns={getWandAndRodColumns()}
            />
          </TabContent>
        ))
      }
    </StandardPage>
  );
}

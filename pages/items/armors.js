import { objects } from "../../database/database.json";
import { getArmorColumns } from "../../components/table/ObjectColumns";
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
    title: 'Helmets',
    bodyPositionId: 1,
  },
  {
    title: 'Armors',
    bodyPositionId: 4,
  },
  {
    title: 'Legs',
    bodyPositionId: 7,
  },
  {
    title: 'Boots',
    bodyPositionId: 8,
  },
];

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function ArmorItems({

} = {}) {

  const { activeTabIndex, setActiveTabIndex } = useTabContent(0);

  return (
    <StandardPage title='Armor items'>
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
              data={objects.filter(({ attributes }) => (attributes || {}).BodyPosition === tab.bodyPositionId)}
              typeColumns={getArmorColumns()}
            />
          </TabContent>
        ))
      }
    </StandardPage>
  );
}

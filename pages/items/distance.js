import { objects } from "../../database/database.json";
import { getBowsColumns, getAmmoColumns, getThrowableColumns } from "../../components/table/ObjectColumns";
import ObjectsTable from "../../components/table/ObjectsTable";
import ObjectFlags from "../../api/objects/flags";
import StandardPage from "../../components/StandardPage";
import { Box, Tabs, Tab } from "@mui/material";
import TabContent, { useTabContent } from "../../components/TabContent";

/** @TODO (future) move each to their own file? */
const tabs = [
  {
    title: 'Bows',
    data: objects.filter(({ flags }) => (flags || []).includes(ObjectFlags.Bow)),
    columns: getBowsColumns(),
  },
  {
    title: 'Ammo',
    data: objects.filter(({ flags }) => (flags || []).includes(ObjectFlags.Ammo)),
    columns: getAmmoColumns(),
  },
  {
    title: 'Throwables',
    data: objects.filter(({ flags }) => (flags || []).includes(ObjectFlags.Throw)),
    columns: getThrowableColumns(),
  },
];

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function DistanceItems({

} = {}) {

  const { activeTabIndex, setActiveTabIndex } = useTabContent(0);

  return (
    <StandardPage title='Distance items'>
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
              data={tab.data}
              typeColumns={tab.columns}
            />
          </TabContent>
        ))
      }
    </StandardPage>
  );
}
import { objects } from "../../database/database.json";
import { getWeaponColumns } from "../../components/table/ObjectColumns";
import ObjectsTable from "../../components/table/ObjectsTable";
import StandardPage from "../../components/StandardPage";
import { TabContent, useTabContent } from "../../components/TabContent";
import { Box, Tabs, Tab } from "@mui/material";

/**\
 * @TODO (future) use constants
 * @TODO (future) move each to their own file?
 * */
const tabs = [
  {
    title: 'All',
  },
  {
    title: 'Sword',
    weaponTypeId: 1,
  },
  {
    title: 'Club',
    weaponTypeId: 2,
  },
  {
    title: 'Axe',
    weaponTypeId: 3,
  },
];

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function WeaponItems({

} = {}) {

  const { activeTabIndex, handleTabChange } = useTabContent(0);

  return (
    <StandardPage title='Weapons'>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTabIndex} onChange={handleTabChange}>
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
              data={objects.filter(({ attributes }) => tab.weaponTypeId ? (attributes || {}).WeaponType === tab.weaponTypeId : (attributes || {}).WeaponType >= 1)}
              typeColumns={getWeaponColumns()}
            />
          </TabContent>
        ))
      }
    </StandardPage>
  );
}

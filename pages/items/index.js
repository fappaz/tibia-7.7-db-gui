import objects from "../../database/objects.json";
import flags from "../../api/objects/flags";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import StandardPage from "../../components/StandardPage";
import Table, { getCustomColumns, columnModel, defaultColumns, defaultTableProps, columnsByType, weaponColumns, shieldsColumns, foodColumns, runesColumns, throwablesColumns, armorItemsColumns, amuletsAndRingsColumns, weaponsColumns, distanceWeaponsColumns, ammoColumns, wandsColumns } from "../../components/items/Table";
import { useTranslation } from "react-i18next";
import TabContent, { useTabContent } from "../../components/TabContent";
import { Box, Card, Tabs, Tab } from "@mui/material";
import { types as itemTypes, subtypes as itemSubtypes } from "../../api/objects/types";

/** @TODO (future) move each to their own file? */
const tables = {
  ammo: {
    filter: itemTypes.ammo.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.ammo.id] }),
    sortModel: [{ field: columnModel.ammoAttack.field, sort: 'asc' }]
  },
  amulets: {
    filter: itemTypes.amulets.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.amulets.id] }),
  },
  armors: {
    filter: itemSubtypes.armors.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.armors.id] }),
    sortModel: [{ field: columnModel.armor.field, sort: 'asc' }]
  },
  axes: {
    filter: itemSubtypes.axes.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.weapons.id] }),
    sortModel: [{ field: columnModel.attack.field, sort: 'asc' }]
  },
  boots: {
    filter: itemSubtypes.boots.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.armors.id] }),
    sortModel: [{ field: columnModel.armor.field, sort: 'asc' }]
  },
  bows: {
    filter: itemTypes.bows.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.bows.id] }),
  },
  clubs: {
    filter: itemSubtypes.clubs.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.weapons.id] }),
    sortModel: [{ field: columnModel.attack.field, sort: 'asc' }]
  },
  food: {
    filter: itemTypes.food.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.food.id] }),
  },
  helmets: {
    filter: itemSubtypes.helmets.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.armors.id] }),
    sortModel: [{ field: columnModel.armor.field, sort: 'asc' }]
  },
  legs: {
    filter: itemSubtypes.legs.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.armors.id] }),
    sortModel: [{ field: columnModel.armor.field, sort: 'asc' }]
  },
  rings: {
    filter: itemTypes.rings.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.rings.id] }),
  },
  rods: {
    filter: itemSubtypes.rods.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.wands.id] }),
    sortModel: [{ field: columnModel.minimumLevel.field, sort: 'asc' }]
  },
  runes: {
    filter: itemTypes.runes.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.runes.id] }),
  },
  shields: {
    filter: itemTypes.shields.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.shields.id] }),
    sortModel: [{ field: columnModel.shieldDefense.field, sort: 'asc' }]
  },
  swords: {
    filter: itemSubtypes.swords.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.weapons.id] }),
    sortModel: [{ field: columnModel.attack.field, sort: 'asc' }]
  },
  throwables: {
    filter: itemTypes.throwables.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.throwables.id] }),
    sortModel: [{ field: columnModel.throwableAttack.field, sort: 'asc' }]
  },
  wands: {
    filter: itemSubtypes.wands.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.wands.id] }),
    sortModel: [{ field: columnModel.minimumLevel.field, sort: 'asc' }]
  },
  weapons: {
    filter: itemTypes.weapons.filter,
    columns: getCustomColumns({ columnsToInsert: columnsByType[itemTypes.weapons.id] }),
    sortModel: [{ field: columnModel.attack.field, sort: 'asc' }]
  },
};

const supportedRoutes = {
  weapons: {
    tabs: [
      { id: 'all', table: tables.weapons },
      { id: 'axes', table: tables.axes },
      { id: 'clubs', table: tables.clubs },
      { id: 'swords', table: tables.swords },
    ]
  },
  wands: {
    id: 'wandsAndRods',
    tabs: [
      { id: 'wands', table: tables.wands },
      { id: 'rods', table: tables.rods },
    ]
  },
  distance: {
    tabs: [
      { id: 'bows', table: tables.bows },
      { id: 'ammo', table: tables.ammo },
      { id: 'throwables', table: tables.throwables },
    ]
  },
  shields: {
    tabs: [
      { id: 'shields', table: tables.shields },
    ]
  },
  armors: {
    id: 'armorItems',
    tabs: [
      { id: 'helmets', table: tables.helmets },
      { id: 'armors', table: tables.armors },
      { id: 'legs', table: tables.legs },
      { id: 'boots', table: tables.boots },
    ]
  },
  jewelry: {
    tabs: [
      { id: 'amulets', table: tables.amulets },
      { id: 'rings', table: tables.rings },
    ]
  },
  amulets: {
    tabs: [
      { id: 'amulets', table: tables.amulets },
    ]
  },
  rings: {
    tabs: [
      { id: 'rings', table: tables.rings },
    ]
  },
  runes: {
    tabs: [
      { id: 'runes', table: tables.runes },
    ]
  },
  food: {
    tabs: [
      { id: 'food', table: tables.food },
    ]
  },
};

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Items({

} = {}) {

  const router = useRouter();
  const { t } = useTranslation();
  const { type: typeId } = router.query;

  const [type, setType] = useState();

  useEffect(() => {
    const fallbackGroup = {
      tabs: [
        {
          id: 'all',
          table: {
            filter: () => true,
            columns: [...defaultColumns],
          }
        }
      ],
    };
    const type = supportedRoutes[typeId] || fallbackGroup;
    type.id = type.id || typeId || 'all';
    setType(type);
  }, [typeId]);

  /** @TODO (future) show a loading wheel */
  if (!type) return <>{t('loading')}</>;

  return (
    <StandardPage title={t(`items.types.${type.id}`)}>
      <Card sx={{ height: '100%', pb: 2 }}>
        {
          type.tabs.length > 1 ? (
            <ItemsTabs tabs={type.tabs} />
          ) : (
            <ItemTable
              rows={objects.filter(type.tabs[0].table.filter)}
              columns={type.tabs[0].table.columns}
              sortModel={type.tabs[0].table.sortModel}
            />
          )
        }
      </Card>
    </StandardPage>
  );
}

function ItemsTabs({
  tabs,
  defaultTabIndex = 0,
} = {}) {

  const { activeTabIndex, setActiveTabIndex } = useTabContent(defaultTabIndex);
  const { t } = useTranslation();

  useEffect(() => {
    if (activeTabIndex < 0 || (tabs||[]).length < 0) return;
    if (activeTabIndex >= tabs.length) setActiveTabIndex(0);
  }, [activeTabIndex, tabs]);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTabIndex} onChange={(e, tabIndex) => setActiveTabIndex(tabIndex)}>
          {
            tabs.map((tab, index) => (
              <Tab
                id={`tab-${index}`}
                key={`tab-${index}`}
                label={t(`items.types.${tab.id}`)}
              />
            ))
          }
        </Tabs>
      </Box>
      {
        tabs.map((tab, index) => {
          return (
            <TabContent activeTabIndex={activeTabIndex} index={index} key={`tab-panel-${index}`}>
              <ItemTable
                rows={objects.filter(tab.table.filter)}
                columns={tab.table.columns}
                sortModel={tab.table.sortModel}
              />
            </TabContent>
          );
        })
      }
    </>
  );
}

function ItemTable({
  rows,
  columns,
  sortModel,
} = {}) {

  return (
    <Table
      rows={rows}
      columns={columns}
      /** @TODO (future) Find a better way to merge this */
      tableProps={{
        ...defaultTableProps,
        initialState: {
          ...defaultTableProps.initialState,
          sorting: {
            ...defaultTableProps.initialState.sorting,
            sortModel,
          }
        }
      }}
    />
  );
}
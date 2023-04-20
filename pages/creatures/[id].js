import { useRouter } from "next/router";
import creatures from "../../database/creatures.json";
import objects from "../../database/objects.json";
import { useState, useEffect } from "react";
import { Box, Card, Divider, Grid, Link, List, ListItem, ListItemText, TextField, Tab, Tabs, Typography, Tooltip } from "@mui/material";
import StandardPage from "../../components/StandardPage";
import TabContent, { useTabContent } from "../../components/TabContent";
import LocationMap from "../../components/LocationMap";
import { round } from "../../utils/Math";
import ItemsTable, { getCustomColumns, columnModel, defaultTableProps } from "../../components/items/Table";
import i18n from "../../api/i18n";
import { useTranslation } from "react-i18next";
import DetailsCard from "../../components/creatures/DetailsCard";

const getColumnHeaderI18n = (field) => i18n.t(`creatures.table.columns.${field}.header`);
const getFlagI18n = (flag) => i18n.t(`creatures.flags.${flag}`);

const tabs = [
  { name: getColumnHeaderI18n('drops') },
  { name: getColumnHeaderI18n('spawns') },
  { name: i18n.t('rawData') },
];

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Creature({

} = {}) {

  const router = useRouter();
  const { id, tab } = router.query;
  const [creature, setCreature] = useState(null);
  const { activeTabIndex, setActiveTabIndex } = useTabContent(0);
  const { t } = useTranslation();

  useEffect(function onQueryChanged() {
    if (!id) return;
    let creature = creatures.find(creature => `${creature.id}` === `${id}`);
    if (!creature) creature = creatures.find(creature => creature.name.toLowerCase() === `${id}`.toLowerCase());
    setCreature(creature);

    if (!tab) return;
    const tabIndex = tabs.findIndex(({ name }) => name.toUpperCase() === `${tab}`.toUpperCase()) || 0;
    setActiveTabIndex(tabIndex);
  }, [id, tab]);

  if (!creature) return <>{t('loading')}</>;

  return (
    <StandardPage title={`${creature.name.charAt(0).toUpperCase()}${creature.name.slice(1)}`}>
      <Grid container spacing={2} sx={{ height: '100%'}}>
        <Grid item xs={12} md={3} lg={2}>
          <DetailsCard creature={creature} showExternalLinks />
        </Grid>

        <Grid item xs={12} md={9} lg={10}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTabIndex} onChange={(event, tabIndex) => setActiveTabIndex(tabIndex)}>
              {
                tabs.map(({ name }, index) => <Tab key={`tab-${index}`} id={`tab-${index}`} label={name} />)
              }
            </Tabs>
          </Box>

          <TabContent activeTabIndex={activeTabIndex} index={0}>
            <Drops creature={creature} />
          </TabContent>

          <TabContent activeTabIndex={activeTabIndex} index={1}>
            <Spawns creature={creature}/>
          </TabContent>

          <TabContent activeTabIndex={activeTabIndex} index={2}>
            <RawData object={creature} />
          </TabContent>
        </Grid>
      </Grid>
    </StandardPage>
  );

}

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
function Spawns({
  creature,
} = {}) {

  const { t } = useTranslation();

  const markers = creature.spawns.map(spawn => ({
    coordinates: spawn.coordinates,
    label: t(`creatures.marker.tooltip`, { coordinates: spawn.coordinates.join(','), amount: spawn.amount, name: creature.name, minutes: round(spawn.interval / 60, 1) }),
    summary: t(`creatures.marker.quickAccessSummary`, { amount: spawn.amount, minutes: round(spawn.interval / 60, 1) }),
  }));

  const quickAccessMarkers = markers.map(marker => ({ ...marker, label: marker.summary })).sort((a, b) => {
    /** Sort by 'z,x,y' asc */
    const format = c => c.toString().padStart(5, '0');
    const aString = a.coordinates.map(format);
    const aFormatted = `${aString[2]},${aString[0]},${aString[1]}`;
    const bString = b.coordinates.map(format);
    const bFormatted = `${bString[2]},${bString[0]},${bString[1]}`;
    return aFormatted.localeCompare(bFormatted);
  });

  return (
    <Box style={{ height: '68vh' }}>
      <LocationMap
        markers={markers}
        quickAccess={{
          title: t('creatures.table.columns.spawns.value', { amount: creature.spawns.reduce((total, spawn) => total + spawn.amount, 0), placesCount: creature.spawns.length }),
          items: quickAccessMarkers,
        }}
        coordinates={quickAccessMarkers.length ? quickAccessMarkers[0].coordinates : undefined}
      />
    </Box>
  );
}

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
function Drops({
  creature,
} = {}) {

  const items = creature.drops.map(drop => objects.find(object => object.id === drop.item.id)).filter(Boolean);

  return (
    <ItemsTable
      rows={items}
      columns={getCustomColumns({ columnsToInsert: [columnModel.dropRate(creature.id)] })}
      /** @TODO (future) Find a better way to merge this */
      tableProps={{
        ...defaultTableProps,
        initialState: {
          ...defaultTableProps.initialState,
          sorting: {
            ...defaultTableProps.initialState.sorting,
            sortModel: [{ field: 'dropRate', sort: 'desc' }],
          },
          columns: {
            ...defaultTableProps.initialState.columns,
            columnVisibilityModel: {
              ...defaultTableProps.initialState.columns.columnVisibilityModel,
              dropFrom: false,
            },
          },
        },
      }}
    />
  );
}

/**
 * @TODO move to its own file?
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
function RawData({
  object,
} = {}) {

  const { t } = useTranslation();

  return (
    <>
      <TextField
        label={t('json')}
        multiline
        rows={17}
        value={JSON.stringify(object, null, 2)}
        variant='outlined'
        disabled
        fullWidth
      />
    </>
  );
}
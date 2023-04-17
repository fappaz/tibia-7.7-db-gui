import { useRouter } from "next/router";
import database from "../../database/database.json";
import { useState, useEffect } from "react";
import { getTibiaWikiUrl } from "../../utils/TibiaWiki";
import { Box, Card, Divider, Grid, Link, List, ListItem, ListItemText, TextField, Tab, Tabs, Typography, Tooltip } from "@mui/material";
import PageLink from "next/link";
import StandardPage from "../../components/StandardPage";
import TabContent, { useTabContent } from "../../components/TabContent";
import LocationMap from "../../components/LocationMap";
import Property from "../../components/Property";
import { getCreaturePage } from "../../utils/TibiaWebsite";
import { round } from "../../utils/Math";
import ItemsTable, { getCustomColumns, columnModel, defaultTableProps } from "../../components/items/Table";
import Image from 'next/image';
import i18n from "../../api/i18n";
import flags from "../../api/creatures/flags";
import { useTranslation } from "react-i18next";

const getColumnHeaderI18n = (field) => i18n.t(`creatures.table.columns.${field}.header`);
const getFlagI18n = (flag) => i18n.t(`creatures.flags.${flag}`);

const tabs = [
  { name: getColumnHeaderI18n('spawns') },
  { name: getColumnHeaderI18n('drops') },
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
    let creature = database.creatures.find(creature => `${creature.id}` === `${id}`);
    if (!creature) creature = database.creatures.find(creature => creature.name.toLowerCase() === `${id}`.toLowerCase());
    setCreature(creature);

    if (!tab) return;
    const tabIndex = tabs.findIndex(({ name }) => name.toUpperCase() === `${tab}`.toUpperCase()) || 0;
    setActiveTabIndex(tabIndex);
  }, [id, tab]);

  if (!creature) return <>{t('loading')}</>;

  return (
    <StandardPage title={`${creature.name.charAt(0).toUpperCase()}${creature.name.slice(1)}`}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3} lg={2}>
          <Details creature={creature} />
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
            <Spawns
              creature={creature}
            />
          </TabContent>

          <TabContent activeTabIndex={activeTabIndex} index={1}>
            <Drops creature={creature} />
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
    <Box style={{ height: '30rem' }}>
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
function Details({
  creature,
} = {}) {

  const { t } = useTranslation();

  return (
    <Card sx={{ px: 2 }}>
      <List dense>
        <ListItem disableGutters sx={{ py: 2 }}>
          <Image
            src={`/images/sprites/creatures/${creature.id}.gif`}
            alt={creature.id}
            width={creature.dat.sprite.width * 32}
            height={creature.dat.sprite.height * 32}
            style={{ objectPosition: 'center' }}
          />
        </ListItem>
        <Divider />
        {
          [
            { label: getColumnHeaderI18n('id'), value: creature.id },
            { label: getColumnHeaderI18n('experience'), value: creature.experience },
            { label: getColumnHeaderI18n('hitpoints'), value: creature.attributes.hitpoints },
            { label: getColumnHeaderI18n('attack'), value: creature.attributes.attack },
            { label: getColumnHeaderI18n('defense'), value: creature.attributes.defense },
            { label: getColumnHeaderI18n('armor'), value: creature.attributes.armor },
            {},
            { label: getColumnHeaderI18n('summonCost'), value: creature.summonCost },
            { label: getFlagI18n(flags.SeeInvisible), value: creature.flags.includes(flags.SeeInvisible) ? t('yes') : t('no') },
            { label: getFlagI18n(flags.DistanceFighting), value: creature.flags.includes(flags.DistanceFighting) ? t('yes') : t('no') },
            { label: getFlagI18n(flags.Unpushable), value: creature.flags.includes(flags.Unpushable) ? t('yes') : t('no') },
            { label: getFlagI18n(flags.KickBoxes), value: creature.flags.includes(flags.KickBoxes) ? t('yes') : t('no') },
            { label: getFlagI18n(flags.KickCreatures), value: creature.flags.includes(flags.KickCreatures) ? t('yes') : t('no') },
            { label: getColumnHeaderI18n('immunities'), value: creature.flags.filter(flag => [flags.NoBurning, flags.NoPoison, flags.NoEnergy, flags.NoLifeDrain, flags.NoParalyze].includes(flag)).map(flag => getFlagI18n(flag)).join(', ') || t('none') },
          ].map((property, index) => (
            <div key={index}>
              {
                property.label ? (
                  <ListItem disableGutters>
                    <Property label={property.label} value={property.value} />
                  </ListItem>
                ) : (
                  <Divider />
                )
              }
            </div>
          ))
        }
        <Divider />
        <ListItem disableGutters>
          <Link
            component={PageLink}
            href={getTibiaWikiUrl(creature.name)}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Typography variant='caption'>{t('externalPages.tibiaWiki')}</Typography>
          </Link>
        </ListItem>
        <ListItem disableGutters>
          <Link
            component={PageLink}
            href={getCreaturePage(creature.name)}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Typography variant='caption'>{t('externalPages.tibia')}</Typography>
          </Link>
        </ListItem>
      </List>
    </Card>
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

  const items = creature.drops.map(drop => database.objects.find(object => object.id === drop.item.id)).filter(item => item);
  const tableProps = {...defaultTableProps};
  tableProps.initialState.sorting.sortModel = [{ field: 'dropRate', sort: 'desc' }];
  tableProps.initialState.columns.columnVisibilityModel.dropFrom = false;

  return (
    <ItemsTable
      rows={items}
      columns={getCustomColumns({ columnsToInsert: [columnModel.dropRate(creature.id)] })}
      tableProps={tableProps}
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
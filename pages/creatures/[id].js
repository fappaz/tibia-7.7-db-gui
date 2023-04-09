import { useRouter } from "next/router";
import database from "../../database/database.json";
import { useState, useEffect } from "react";
import { getTibiaWikiUrl } from "../../utils/TibiaWiki";
import { Box, Card, Divider, Grid, Link, List, ListItem, ListItemText, TextField, Tab, Tabs, Typography } from "@mui/material";
import PageLink from "next/link";
import StandardPage from "../../components/StandardPage";
import { TabContent, useTabContent } from "../../components/TabContent";
import LocationMap from "../../components/LocationMap";
import Property from "../../components/Property";
import { getCreaturePage } from "../../utils/TibiaWebsite";
import { round } from "../../utils/Math";
import ObjectsTable from "../../components/table/ObjectsTable";

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Creature({

} = {}) {

  const router = useRouter();
  const { id } = router.query;
  const [creature, setCreature] = useState(null);
  const { activeTabIndex, handleTabChange } = useTabContent(0);

  useEffect(function onPageMount() {
    if (!id) return;
    let creature = database.creatures.find(creature => `${creature.id}` === `${id}`);
    if (!creature) creature = database.creatures.find(creature => creature.name.toLowerCase() === `${id}`.toLowerCase());
    setCreature(creature);
  }, [id]);

  if (!creature) return <>Loading creature "{id}"...</>;

  const markers = creature.spawns.map(spawn => ({
    coordinates: spawn.coordinates,
    label: `${spawn.amount}x every ${spawn.interval} seconds - ${spawn.coordinates.join(', ')}`,
    summary: `${spawn.amount}x (${spawn.interval} s)`,
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
    <StandardPage title={`${creature.name.charAt(0).toUpperCase()}${creature.name.slice(1)}`}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3} lg={2}>
          <Details creature={creature} />
        </Grid>

        <Grid item xs={12} md={9} lg={10}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTabIndex} onChange={handleTabChange}>
              <Tab id={`tab-spawns`} label={`Spawns`} />
              <Tab id={`tab-drops`} label={`Drops`} />
              <Tab id={`tab-json`} label={`JSON`} />
            </Tabs>
          </Box>

          <TabContent activeTabIndex={activeTabIndex} index={0}>

            <Box style={{ height: '30rem' }}>
              <LocationMap
                markers={markers}
                quickAccess={{
                  title: `${creature.spawns.reduce((total, spawn) => total + spawn.amount, 0)} found in ${creature.spawns.length} places`,
                  items: quickAccessMarkers,
                }}
                coordinates={quickAccessMarkers[0].coordinates}
              />
            </Box>
          </TabContent>

          <TabContent activeTabIndex={activeTabIndex} index={1}>
            <Drops creature={creature} />
          </TabContent>

          <TabContent activeTabIndex={activeTabIndex} index={2}>
            <Json object={creature} />
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
export function Details({
  creature,
} = {}) {

  return (
    <Card sx={{ px: 2 }}>
      <List dense>
        {
          [
            { label: 'ID', value: creature.id },
            { label: 'Experience', value: creature.experience },
            { label: 'Hitpoints', value: creature.attributes.hitpoints },
            { label: 'Attack', value: creature.attributes.attack },
            { label: 'Defense', value: creature.attributes.defense },
            { label: 'Armor', value: creature.attributes.armor },
            {},
            { label: 'Summon cost', value: creature.summonCost },
            { label: 'See invisible', value: creature.flags.includes('SeeInvisible') ? 'yes' : 'no' },
            { label: 'Keep distance', value: creature.flags.includes('KeepDistance') ? 'yes' : 'no' },
            { label: 'Pushable', value: creature.flags.includes('Unpushable') ? 'no' : 'yes' },
            { label: 'Pushes boxes', value: creature.flags.includes('KickBoxes') ? 'yes' : 'no' },
            { label: 'Pushes creatures', value: creature.flags.includes('KickCreatures') ? 'yes' : 'no' },
            /** format immunities */
            { label: 'Immunities', value: creature.flags.filter(flag => ['NoBurning', 'NoPoison', 'NoEnergy', 'NoLifeDrain', 'NoParalyze'].includes(flag)).join(', ') },
          ].map((property, index) => (
            <div key={index}>
              {
                property.value ? (
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
            <Typography variant='caption'>TibiaWiki</Typography>
          </Link>
        </ListItem>
        <ListItem disableGutters>
        </ListItem>
        <Link
          component={PageLink}
          href={getCreaturePage(creature.name)}
          target='_blank'
          rel='noopener noreferrer'
        >
        <Typography variant='caption'>Official website</Typography>
        </Link>
      </List>
    </Card>
  );
}

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export function Drops({
  creature,
} = {}) {
  
  const items = creature.drops.map(drop => database.objects.find(object => object.id === drop.item.id)).filter(item => item);

  return (
    <ObjectsTable
      data={items}
      typeColumns={[
        {
          field: 'dropRate', headerName: 'Drop rate',
          valueGetter: (params) => {
            const drop = params.row.dropFrom.find(drop => drop.creature.id === creature.id);
            if (!drop) return 0;
            return round((drop.rate + 1) / 10, 3);
          },
          renderCell: (params) => `${params.value}%`,
        },
      ]}
    />
  );
}


/**
 * @TODO move to its own file?
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export function Json({
  object,
} = {}) {

  return (
    <>
      <TextField
        label='JSON'
        multiline
        rows={18}
        value={JSON.stringify(object, null, 2)}
        variant='outlined'
        disabled
        fullWidth
      />
    </>
  );
}

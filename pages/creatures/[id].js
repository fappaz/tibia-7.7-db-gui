import { useRouter } from "next/router";
import database from "../../database/database.json";
import { useState, useEffect } from "react";
import { getTibiaWikiUrl } from "../../utils/TibiaWiki";
import { Box, Divider, Grid, Link, List, ListItem, ListItemButton, ListItemText, TextField, Tab, Tabs, Typography } from "@mui/material";
import PageLink from "next/link";
import StandardPage from "../../components/StandardPage";
import TibiaMap from "../../components/tibiamap";
import { TabContent, useTabContent } from "../../components/TabContent";

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
  const { activeTabIndex, handleTabChange } = useTabContent(1);

  useEffect(function onPageMount() {
    if (!id) return;
    setCreature(database.creatures.find(creature => `${creature.id}` === `${id}`));
  }, [id]);

  if (!creature) return <>Loading creature "{id}"...</>;

  return (
    <StandardPage
      title={
        <div style={{ display: 'flex' }}>
          {`${creature.name} (`}
          <Link
            component={PageLink}
            href={getTibiaWikiUrl(creature.name)}
            target='_blank'
            rel='noopener noreferrer'
          >
            TibiaWiki
          </Link>
          {`)`}
        </div>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={3} lg={2}>
          <Details />
        </Grid>

        <Grid item xs={12} md={9} lg={10}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTabIndex} onChange={handleTabChange}>
              <Tab id={`tab-drops`} label={`Drops`} />
              <Tab id={`tab-spawns`} label={`Spawns`} />
              <Tab id={`tab-json`} label={`JSON`} />
            </Tabs>
          </Box>

          <TabContent activeTabIndex={activeTabIndex} index={0}>
            <Drops />
          </TabContent>

          <TabContent activeTabIndex={activeTabIndex} index={1}>
            <LocationMap
              markers={creature.spawns.map(spawn => ({
                coordinates: spawn.coordinates,
                quickAccess: { label: `${spawn.amount}x (${spawn.interval} s)` },
                label: `${spawn.amount}x every ${spawn.interval} seconds - ${spawn.coordinates.join(', ')}`
              }))}
              quickAccessTitle={`${creature.spawns.reduce((total, spawn) => total + spawn.amount, 0)} found in ${creature.spawns.length} places`}
            />
            {/* <LocationMap markers={[
              { coordinates: [0, 0, 7], label: '0, 0, 7', amount: 0, interval: 0 },
              { coordinates: [0, 1000, 7], label: '0, 1000, 7', amount: 0, interval: 0 },
              { coordinates: [1000, 0, 7], label: '1000, 0, 7', amount: 0, interval: 0 },
              { coordinates: [2560, 0, 7], label: '2560, 0, 7', amount: 0, interval: 0 },
              { coordinates: [0, 2048, 7], label: '0, 2048, 7', amount: 0, interval: 0 },
            ].map(spawn => ({ coordinates: spawn.coordinates, label: `${spawn.amount}x every ${spawn.interval} seconds - ${spawn.coordinates.join(', ')}` }))} /> */}
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

} = {}) {

  return (
    <>
      Details @TODO
    </>
  );
}

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export function Drops({

} = {}) {

  return (
    <>
      Drops @TODO
    </>
  );
}

/**
 * @TODO move to its own file
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export function LocationMap({
  markers = [],
  mapProps = {},
  quickAccessTitle,
} = {}) {

  const [activeMarker, setActiveMarker] = useState([...markers].length > 0 ? markers[0] : undefined);

  return (
    <>
      <Box
        style={{
          display: 'flex',
          height: '30rem',
        }}
      >
        <MarkersQuickAccess markers={markers} onSelect={setActiveMarker} selected={activeMarker} title={quickAccessTitle} />
        <Box p={1} flexGrow={1}>
          <TibiaMap center={activeMarker.coordinates} markers={markers} {...mapProps} />
        </Box>
      </Box>
    </>
  );
}


/**
 * @TODO move to its own file
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export function MarkersQuickAccess({
  markers = [],
  selected = {},
  onSelect,
  title,
} = {}) {

  return (
    <div style={{ overflow: 'auto' }}>
      { !!title && <Typography variant='caption'>{title}</Typography> }
      <List>
        <Divider />
        {
          markers
            .sort((a,b) => {
              /** Sort by 'z,x,y' asc */
              const format = c => c.toString().padStart(5, '0');
              const aString = a.coordinates.map(format);
              const aFormatted = `${aString[2]},${aString[0]},${aString[1]}`;
              const bString = b.coordinates.map(format);
              const bFormatted = `${bString[2]},${bString[0]},${bString[1]}`;
              return aFormatted.localeCompare(bFormatted);
            })
            .map((marker, index) => (
              <div key={index}>
                <ListItem disablePadding>
                  <ListItemButton selected={JSON.stringify(selected.coordinates) === JSON.stringify(marker.coordinates)} onClick={() => onSelect(marker)}>
                    <ListItemText primary={marker?.quickAccess?.label} secondary={`${index+1}. ${marker.coordinates.join(',')}`} />
                  </ListItemButton>
                </ListItem>

                <Divider />
              </div>
            )
          )
        }
      </List>
    </div>
  );
}


/**
 * @TODO move to its own file
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

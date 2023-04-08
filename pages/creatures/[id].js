import { useRouter } from "next/router";
import database from "../../database/database.json";
import { useState, useEffect } from "react";
import { getTibiaWikiUrl } from "../../utils/TibiaWiki";
import { Box, Divider, Grid, Link, List, ListItem, ListItemButton, ListItemText, TextField, Tab, Tabs } from "@mui/material";
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
        <Grid item xs={12} md={3}>
          <Details />
        </Grid>

        <Grid item xs={12} md={9}>
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
            <LocationMap markers={creature.spawns.map(spawn => ({ coordinates: spawn.coordinates, label: `${spawn.amount}x every ${spawn.interval} seconds` }))} />
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
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export function LocationMap({
  markers = [],
  mapProps = {},
} = {}) {

  const [activeMarker, setActiveMarker] = useState(markers.length > 0 ? markers[0] : null);
  const position = activeMarker?.coordinates ? activeMarker.coordinates.slice(0, 2) : undefined;
  const floor = activeMarker?.coordinates ? activeMarker.coordinates.slice(2, 3)[0] : undefined;
  return (
    <>
      <Box
        style={{
          display: 'flex',
          height: '30rem',
        }}
      >
        <MarkersQuickAccess markers={markers} onSelect={setActiveMarker} selected={activeMarker} />
        <Box p={1} flexGrow={1}>
          <TibiaMap center={position} floor={floor} markers={markers} {...mapProps} />
        </Box>
      </Box>
    </>
  );
}


/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export function MarkersQuickAccess({
  markers = [],
  selected = {},
  onSelect,
} = {}) {

  return (
    <List sx={{ overflow: 'auto' }}>
      {
        markers.map((marker, index) => (
          <div key={index}>
            <ListItem disablePadding>
              <ListItemButton selected={JSON.stringify(selected.coordinates) === JSON.stringify(marker.coordinates)} onClick={() => onSelect(marker)}>
                <ListItemText primary={marker.coordinates.join(', ')} />
              </ListItemButton>
            </ListItem>

            <Divider />
          </div>
        ))
      }
    </List>
  );
}


/**
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

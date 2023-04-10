import { Box, Grid, Link, Tab, Tabs } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import database from "../../database/database.json";
import CellItems from '../../components/table/CellItems';
import TibiaMap from '../../components/tibiamap';
import { round } from '../../utils/Math';
import PageLink from "next/link";
import StandardPage from "../../components/StandardPage";
import Image from 'next/image';
import { TabContent, useTabContent } from "../../components/TabContent";
import { useState } from "react";

const creatures = database.creatures;

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Creatures({

} = {}) {

  const { activeTabIndex, setActiveTabIndex } = useTabContent(0);

  return (
    <StandardPage title='Creatures' contentProps={{ style: { height: '72vh' } }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTabIndex} onChange={(event, tabIndex) => setActiveTabIndex(tabIndex)}>
          <Tab id={`tab-table`} label={`Table`} />
          <Tab id={`tab-spawns`} label={`Spawns`} />
        </Tabs>
      </Box>

      <TabContent activeTabIndex={activeTabIndex} index={0}>
        <Table creatures={creatures} />
      </TabContent>

      <TabContent activeTabIndex={activeTabIndex} index={1}>
        <Spawns creatures={creatures} />
      </TabContent>
    </StandardPage>
  );

}

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export function Table({
  creatures,
} = {}) {

  return (
    <Box style={{ height: '70vh' }}>
      <DataGrid
        rows={creatures}
  
        columns={[
          {
            field: "id", headerName: "Image", renderCell: (params) => (
              <Image src={`/images/sprites/${params.row.outfit.id}.gif`} alt={params.row.id} width={32} height={32} />
            )
          },
  
          {
            field: "name", headerName: "Name", width: 130,
            renderCell: (params) => (
              <Link
                component={PageLink}
                href={`/creatures/${params.row.id}`}
              >
                {params.row.name}
              </Link>
            )
          },
  
          { field: "experience", headerName: "Exp", valueGetter: (params) => params.row.experience },
          { field: "hitpoints", headerName: "HP", valueGetter: (params) => params.row.attributes.hitpoints },
          { field: "attack", headerName: "Attack", valueGetter: (params) => params.row.attributes.attack || '' },
          { field: "defense", headerName: "Defense", valueGetter: (params) => params.row.attributes.defense || '' },
          { field: "armor", headerName: "Armor", valueGetter: (params) => params.row.attributes.armor },
  
          // {
          //   /** @TODO (future) replace with a horizontal  with the item image, name, rate and amount */
          //   field: "drops", headerName: "Drops", flex: 1, valueGetter: (params) => params.row.drops.sort((a, b) => b.rate - a.rate),
          //   renderCell: (params) => {
          //     const drops = params.row.drops.map(drop => ({
          //       label: drop ? `${(drop.amount > 1) ? `${drop.amount} ` : ''}${drop.item.name}` : 'AAAAAAAAAAAAAAAAAAAAAAA',
          //       link: { path: `/item/${drop.item.id}` }, value: `${round((drop.rate + 1) / 10, 3)}%`
          //     }));
          //     return <CellItems items={drops} />;
          //   }
          // },
  
          {
            field: "spawns", headerName: "Spawns", width: 140, valueGetter: (params) => params.row.spawns.reduce((total, spawn) => total + spawn.amount, 0),
            renderCell: (params) => (
              params.value > 0 && (
                <Link
                  component={PageLink}
                  href={`/creatures/${params.row.id}?tab=spawns`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {`${params.row.spawns.reduce((total, spawn) => total + spawn.amount, 0)} in ${params.row.spawns.length} places`}
                </Link>
              )
            )
          },
  
          { field: "summonCost", headerName: "Summon cost", valueGetter: (params) => params.row.summonCost || '' },
  
          { field: "flags", headerName: "Flags", flex: 1, valueGetter: (params) => params.row.flags.join(', ') },
        ]}
        getRowHeight={() => 'auto'}
  
        initialState={{
          columns: {
            columnVisibilityModel: {
              flags: false,
            },
          },
          sorting: {
            sortModel: [{ field: 'experience', sort: 'asc' }],
          },
        }}
  
        slots={{
          toolbar: GridToolbar
        }}
  
        disableVirtualization
      />
    </Box>
  );
}

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export function Spawns({
  creatures,
} = {}) {

  const [creature, setCreature] = useState(null);
  const markers = creature ? getSpawnMarkers(creature) : creatures.reduce((markers, creature) => [...markers, ...getSpawnMarkers(creature)], []);
  const coordinates = markers[0].coordinates;

  return (
    <Grid container spacing={2} style={{ height: '74vh' }}>
      <Grid item xs={12} md={4} lg={2}>
        <DataGrid
          rows={creatures}

          columns={[

            {
              field: "id", headerName: "Image", renderCell: (params) => (
                <Image src={`/images/sprites/${params.row.outfit.id}.gif`} alt={params.row.id} width={32} height={32} />
              )
            },

            {
              field: "name", headerName: "Name", flex: 1,
              renderCell: (params) => (
                <Link
                  component={PageLink}
                  href={`/creatures/${params.row.id}`}
                >
                  {params.row.name}
                </Link>
              )
            },
          ]}
          getRowHeight={() => 'auto'}

          initialState={{
            sorting: {
              sortModel: [{ field: 'name', sort: 'asc' }],
            },
          }}

          slots={{
            toolbar: GridToolbar
          }}

          onRowClick={(params) => {
            setCreature(params.row)
          }}
        />
      </Grid>

      <Grid item xs={12} md={8} lg={10}>
        <TibiaMap
          center={coordinates}
          markers={markers}
          zoom={3}
        />
      </Grid>
    </Grid>
  );
}

function getSpawnMarkers(creature) {
  return creature.spawns.map(spawn => ({
    coordinates: spawn.coordinates,
    label: `${spawn.amount}x ${creature.name} (${spawn.interval}s)`,
    icon: {
      url: `/images/sprites/${creature.outfit.id}-0.png`,
      width: 32,
      height: 32,
    },
  }));
};
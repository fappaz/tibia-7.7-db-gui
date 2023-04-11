import { Box, Grid } from "@mui/material";
import StandardPage from "../../components/StandardPage";
import { largeCoordinatesToAutomapCoordinates } from "../../utils/TibiaMaps";
import { useRouter } from "next/router";
import database from "../../database/database.json";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import TibiaMap from '../../components/tibiamap';
import { useState, useEffect } from "react";
import CellItems from "../../components/table/CellItems";

const quests = database.quests;
const questChestMarkers = quests.filter(quest => quest.type === 'chest').sort((a, b) => a.id - b.id).map(quest => {
  const coordinates = largeCoordinatesToAutomapCoordinates(quest.coordinates);
  return {
    coordinates,
    label: `Quest ${quest.id} - ${coordinates.join(',')}. Rewards: ${quest.rewards.items.map(item => item.name).join(', ')}`,
    icon: {
      // url: '/images/icons/chest.png'
      color: 'yellow',
    }
  };
});

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function QuestMap({

} = {}) {

  const router = useRouter();
  const { id } = router.query;
  const [quest, setQuest] = useState(null);

  useEffect(function onQueryChanged() {
    if (!id) return;
    const quest = quests.find(quest => `${quest.id}` === `${id}`);
    setCreature(quest);
  }, [id]);

  const coordinates = quest? largeCoordinatesToAutomapCoordinates(quest.coordinates) : questChestMarkers.find(marker => marker.coordinates[2] === 7).coordinates;

  return (
    <StandardPage title='Quests'>
      <Grid container spacing={2} style={{ height: '74vh'}}>
        <Grid item xs={12} md={4}>
          <DataGrid
            rows={quests}

            columns={[

              { field: "id", headerName: "ID", width: 70, valueGetter: (params) => params.row.id },
              { field: "type", headerName: "Type", width: 70, valueGetter: (params) => params.row.type },
              { field: "location", headerName: "Location", width: 120, valueGetter: (params) => largeCoordinatesToAutomapCoordinates(params.row.coordinates).join(',') },

              {
                field: "rewards", headerName: "Rewards", flex: 1,
                renderCell: (params) => {
                  const rewards = params.row.rewards.items.map(item => ({
                    label: item.name,
                    link: { path: `/item/${item.id}`, newTab: true },
                  }));
                  return <CellItems items={rewards} />;
                }
              },
            ]}
            getRowHeight={() => 'auto'}

            initialState={{
              columns: {
                columnVisibilityModel: {
                  type: false,
                },
              },
              sorting: {
                sortModel: [{ field: 'id', sort: 'asc' }],
              },
            }}

            slots={{
              toolbar: GridToolbar
            }}

            onRowClick={(params) => {
              setQuest(params.row)
            }}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <TibiaMap
            center={coordinates}
            markers={questChestMarkers} 
            // onMarkerClicked={(event, marker) => {}}
          />
        </Grid>
      </Grid>
    </StandardPage>
  );
}
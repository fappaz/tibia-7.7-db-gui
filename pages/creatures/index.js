import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import database from "../../database/database.json";
import CellItems from '../../components/table/CellItems';
import { round } from '../../utils/Math';

const creatures = database.creatures.filter(creature => creature.id && !['gamemaster'].includes(creature.id));

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Creatures({
  
} = {}) {

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <DataGrid
        rows={creatures}

        columns={[
          { field: "id", headerName: "ID", width: 130 },
          { field: "name", headerName: "Name", width: 130 },
          
          /** Uncomment this to see all flags of all creatures (test purposes) */
          { field: "flags", headerName: "Flags", flex: 1, valueGetter: (params) => params.row.flags.join(', ') },
      
          { field: "experience", headerName: "Exp", valueGetter: (params) => params.row.experience },
          { field: "hitpoints", headerName: "HP", valueGetter: (params) => params.row.attributes.hitpoints },
          { field: "attack", headerName: "Attack", valueGetter: (params) => params.row.attributes.attack },
          { field: "defense", headerName: "Defense", valueGetter: (params) => params.row.attributes.defense },
          { field: "armor", headerName: "armor", valueGetter: (params) => params.row.attributes.armor },


          {
            /** @TODO (future) replace with a horizontal  with the item image, name, rate and amount */
            field: "drops", headerName: "Drops", flex: 1, valueGetter: (params) => params.row.drops.sort((a, b) => b.rate - a.rate),
            renderCell: (params) => {
              const drops = params.row.drops.map(drop => ({
                label: `${(drop.amount > 1) ? `${drop.amount} ` : ''}${drop.item.name}`,
                link: { path: `/item/${drop.item.id}` }, value: `${round((drop.rate + 1) / 10, 3)}%`
              }));
              return <CellItems items={drops} />;
            }
          },
        ]}
        getRowHeight={() => 'auto'}

        initialState={{
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

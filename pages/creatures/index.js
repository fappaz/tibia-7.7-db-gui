import { Box, Link } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { creatures } from "../../database/database.json";
import CellItems from '../../components/table/CellItems';
import { round } from '../../utils/Math';
import PageLink from "next/link";

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Creatures({
  
} = {}) {

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <DataGrid
        rows={creatures.filter(creature => creature.id && !['gamemaster'].includes(creature.id))}

        columns={[
          // { field: "id", headerName: "ID", width: 130 },
          /** @TODO (future) show images */
          
          {
            field: "name", headerName: "Name", width: 130,
            renderCell: (params) => (
              <Link
                component={PageLink}
                href={`/creature/${params.row.id}`}
              >
                {params.row.name}
              </Link>
            )
          },

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

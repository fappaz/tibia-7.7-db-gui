import { Box, Link } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { spells } from "../../database/database.json";
import CellItems from '../../components/table/CellItems';
import PageLink from "next/link";
import { getTibiaWikiUrl } from '../../utils/TibiaWiki';

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Spells({

} = {}) {

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <DataGrid
        rows={spells.map(spell => ({ ...spell, id: spell.name }))}

        columns={[

          {
            field: "name", headerName: "Name", width: 130,
            renderCell: (params) => (
              <Link
                component={PageLink}
                href={getTibiaWikiUrl(params.row.name)}
                target='_blank'
                rel='noopener noreferrer'
              >
                {params.row.name}
              </Link>
            )
          },
          { field: "vocations", headerName: "Vocations", flex: 1, valueGetter: (params) => params.row.vocations.join(', ') },
          { field: "minLevel", headerName: "Min. level", valueGetter: (params) => params.row.minimumLevel },

          {
            field: "taughtBy", headerName: "Taught by", flex: 1, valueGetter: (params) => params.row.taughtBy.sort((a, b) => a.price - b.price),
            renderCell: (params) => {
              /** @TODO (future) use this line instead once the NPCs page is implemented */
              // const npcs = params.row.taughtBy.map(npc => ({ label: npc.name, link: { path: `/npcs/${npc.id}` }, value: npc.price }));
              const npcs = params.row.taughtBy.map(npc => ({ label: npc.name, link: { path: getTibiaWikiUrl(npc.name), newTab: true }, value: npc.price }));
              return <CellItems items={npcs} />;
            }
          },
        ]}
        getRowHeight={() => 'auto'}

        initialState={{
          sorting: {
            sortModel: [{ field: 'minLevel', sort: 'asc' }],
          },
        }}

        slots={{
          toolbar: GridToolbar
        }}
      />
    </Box>
  );

}

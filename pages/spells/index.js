import { Box, Link } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { spells } from "../../database/database.json";
import CellItems from '../../components/table/CellItems';
import StandardPage from '../../components/StandardPage';
import PageLink from "next/link";
import { getTibiaWikiUrl } from '../../utils/TibiaWiki';

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Spells({

} = {}) {

  return (
    <StandardPage title='Spells' contentProps={{ style: { height: '72vh' } }}>
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
          
          // { field: "vocations", headerName: "Vocations", flex: 1, valueGetter: (params) => params.row.vocations.join(', ') },
          { field: "knight", headerName: "Knight", valueGetter: (params) => params.row.vocations.includes('Knight'), renderCell: (params) => params.value ? 'Yes' : '' },
          { field: "paladin", headerName: "Paladin", valueGetter: (params) => params.row.vocations.includes('Paladin'), renderCell: (params) => params.value ? 'Yes' : '' },
          { field: "druid", headerName: "Druid", valueGetter: (params) => params.row.vocations.includes('Druid'), renderCell: (params) => params.value ? 'Yes' : '' },
          { field: "sorcerer", headerName: "Sorcerer", valueGetter: (params) => params.row.vocations.includes('Sorcerer'), renderCell: (params) => params.value ? 'Yes' : '' },
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
    </StandardPage>
  );

}

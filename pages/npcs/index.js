import { Box, Link, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { npcs } from "../../database/database.json";
import CellItems from '../../components/table/CellItems';
import StandardPage from '../../components/StandardPage';
import PageLink from "next/link";
import { largeCoordinatesToAutomapCoordinates } from '../../utils/TibiaMaps';
import { getTibiaWikiUrl } from '../../utils/TibiaWiki';
import TibiaMap from "../../components/tibiamap";


/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Npcs({

} = {}) {

  return (
    
    <StandardPage title='NPCs' contentProps={{ style: { height: '72vh' } }}>
      <DataGrid
        rows={npcs}

        columns={[
          // { field: "id", headerName: "ID", width: 130 },
          /** @TODO (future) show images */

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

          {
            field: "location", headerName: "Location", width: 130,
            valueGetter: (params) => largeCoordinatesToAutomapCoordinates(params.row.location.coordinates),
            renderCell: (params) => (
              <Link
                component={PageLink}
                href={`/map?at=${params.value}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                {params.value.join(',')}
              </Link>
            )
          },

          {
            /** @TODO (future) replace with a horizontal with the item image, name and amount */
            field: "buyOffers", headerName: "Buy offers", flex: 1, valueGetter: (params) => params.row.buyOffers.sort((a, b) => a.item.name.localeCompare(b.item.name)),
            renderCell: (params) => {
              const offers = params.row.buyOffers.map(offer => ({
                label: offer.item.name,
                link: { path: `/item/${offer.item.id}` },
                value: offer.price,
              }));
              return <CellItems items={offers} />;
            }
          },

          {
            /** @TODO (future) replace with a horizontal with the item image, name and amount */
            field: "sellOffers", headerName: "Sell offers", flex: 1, valueGetter: (params) => params.row.sellOffers.sort((a, b) => a.item.name.localeCompare(b.item.name)),
            renderCell: (params) => {
              const offers = params.row.sellOffers.map(offer => ({
                label: offer.item.name,
                link: { path: `/item/${offer.item.id}` },
                value: offer.price,
              }));
              return <CellItems items={offers} />;
            }
          },

          {
            field: "teachSpells", headerName: "Teach spells", flex: 1, valueGetter: (params) => params.row.teachSpells.sort((a, b) => a.name.localeCompare(b.name)),
            renderCell: (params) => {
              const offers = params.row.teachSpells.map(spell => ({
                label: spell.name,
                /** @TODO slugify instead of encode */
                link: { path: `/spell/${encodeURIComponent(spell.name)}` },
                value: spell.price,
              }));
              return <CellItems items={offers} />;
            }
          },

          {
            /** @TODO (future) replace with a horizontal with the item image, name and amount */
            field: "questRewards", headerName: "Quest rewards", flex: 1, valueGetter: (params) => params.row.questRewards.sort((a, b) => a.item.name.localeCompare(b.item.name)),
            renderCell: (params) => {
              const offers = params.row.questRewards.map(offer => ({
                label: offer.item.name,
                link: { path: `/item/${offer.item.id}` },
              }));
              return <CellItems items={offers} />;
            }
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
      />
    </StandardPage>
  );

}

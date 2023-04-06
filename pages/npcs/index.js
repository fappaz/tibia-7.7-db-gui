import { Box, Link } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { npcs } from "../../database/database.json";
import CellItems from '../../components/table/CellItems';
import PageLink from "next/link";
import { getTibiaMapsUrl } from '../../utils/TibiaMaps';
import { URL as TibiaWikiUrl } from '../../utils/TibiaWiki';


/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Npcs({

} = {}) {

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
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
                href={`${TibiaWikiUrl}/${params.row.name.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join('_')}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                {params.row.name}
              </Link>
            )
          },

          {
            field: "location", headerName: "Location", width: 130,
            renderCell: (params) => (
              <Link
                component={PageLink}
                href={getTibiaMapsUrl(params.row.location.coordinates)}
                target='_blank'
                rel='noopener noreferrer'
              >
                Map
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
    </Box>
  );

}

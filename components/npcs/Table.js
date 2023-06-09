import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Image from "next/image";
import PageLink from "next/link";
import React from "react";
import CellItems from "../table/CellItems";
import { Box, Link } from "@mui/material";
import i18n from "../../api/i18n";
import { getTibiaWikiUrl } from "../../utils/TibiaWiki";
import { insertArrayAt } from "../../utils/Array";
import DetailsCard from "../items/DetailsCard";
import objects from "../../database/objects.json";


/** specific */
const context = 'npcs';
const getColumnHeaderI18n = (field) => i18n.t(`${context}.table.columns.${field}.header`);

/**
 * @typedef {Object.<string, import("@mui/x-data-grid").ColDef>} ColumnModel
 */
export const columnModel = {
  /** specific */
  animatedSprite: {
    field: "animatedSprite", headerName: getColumnHeaderI18n("sprite"),
    renderCell: (params) => (
      <Box pr={2} display='flex' justifyContent='center' alignItems='end' sx={{ width: '100%' }}>
        <Image src={`/images/sprites/npcs/${params.row.id}.gif`} alt={params.row.name} width={32} height={32} />
      </Box>
    )
  },

  sprite: {
    field: "sprite", headerName: getColumnHeaderI18n("sprite"),
    renderCell: (params) => (
      <Box pr={2} display='flex' justifyContent='center' alignItems='end' sx={{ width: '100%' }}>
        <Image src={`/images/sprites/npcs/${params.row.id}-0.png`} alt={params.row.name} width={32} height={32} />
      </Box>
    )
  },

  name: {
    field: "name", headerName: getColumnHeaderI18n('name'), width: 130,
    renderCell: (params) => (
      <Link
        component={PageLink}
        href={`/npcs/${params.row.id}`}
      >
        {params.row.name}
      </Link>
    )
  },

  coordinates: {
    field: "coordinates", headerName: getColumnHeaderI18n('coordinates'), width: 130,
    valueGetter: (params) => params.row.location.coordinates,
    renderCell: (params) => (
      <Link
        component={PageLink}
        href={`/map?at=${params.value}`}
      >
        {params.value.join(',')}
      </Link>
    )
  },

  buyOffers: {
    /** @TODO (future) replace with a horizontal with the item image, name and amount */
    field: "buyOffers", headerName: getColumnHeaderI18n('buyOffers'), flex: 1, valueGetter: (params) => params.row.buyOffers.sort((a, b) => a.item.name.localeCompare(b.item.name)),
    renderCell: (params) => {
      const offers = params.row.buyOffers.map(offer => ({
        label: offer.item.name,
        link: { path: `/items/${offer.item.id}` },
        value: offer.price,
        data: objects.find(object => object.id === offer.item.id),
      }));
      return <CellItems items={offers} renderTooltipContent={({ cellItem }) => <DetailsCard item={cellItem.data} />} />;
    }
  },

  sellOffers: {
    /** @TODO (future) replace with a horizontal with the item image, name and amount */
    field: "sellOffers", headerName: getColumnHeaderI18n('sellOffers'), flex: 1, valueGetter: (params) => params.row.sellOffers.sort((a, b) => a.item.name.localeCompare(b.item.name)),
    renderCell: (params) => {
      const offers = params.row.sellOffers.map(offer => ({
        label: offer.item.name,
        link: { path: `/items/${offer.item.id}` },
        value: offer.price,
        data: objects.find(object => object.id === offer.item.id),
      }));
      return <CellItems items={offers} renderTooltipContent={({ cellItem }) => <DetailsCard item={cellItem.data} />} />;
    }
  },

  teachSpells: {
    field: "teachSpells", headerName: getColumnHeaderI18n('teachSpells'), flex: 1, valueGetter: (params) => params.row.teachSpells.sort((a, b) => a.name.localeCompare(b.name)),
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

  questRewards: {
    /** @TODO (future) replace with a horizontal with the item image, name and amount */
    field: "questRewards", headerName: getColumnHeaderI18n('questRewards'), flex: 1, valueGetter: (params) => params.row.questRewards.sort((a, b) => a.item.name.localeCompare(b.item.name)),
    renderCell: (params) => {
      const offers = params.row.questRewards.map(reward => ({
        label: reward.item.name,
        link: { path: `/items/${reward.item.id}` },
        data: objects.find(object => object.id === reward.item.id),
      }));
      return <CellItems items={offers} renderTooltipContent={({ cellItem }) => <DetailsCard item={cellItem.data} />} />;
    }
  },

  /** Columns that depend on variables outside the table, therefore are functions that return columns */
  price: (itemId, offerType = 'buyOffers') => ({
    field: 'price', headerName: getColumnHeaderI18n('price'),
    valueGetter: (params) => {
      const offer = params.row[offerType].find(offer => offer.item.id === itemId);
      return offer ? offer.price : '';
    },
  }),
};

/**
 * Insert an array into another array at a given index. 
 * Useful for when inserting columns into the table after other important default columns.
 * @param {Object[]} [originalColumns] The original columns. Default is the defaultColumns.
 * @param {Object[]} columnsToInsert The columns to be inserted at the given index.
 * @param {Number} index The index to insert the columns at. Default is 2.
 * @returns {Object[]} The new array.
 */
export function getCustomColumns({
  originalColumns = defaultColumns,
  columnsToInsert = [],
  index = 2,
} = {}) {
  return insertArrayAt(originalColumns, index, columnsToInsert);
}

/**
 * @type {import("@mui/x-data-grid").ColDef[]} The default columns.
 */
export const defaultColumns = [
  /** specific */
  columnModel.sprite,
  columnModel.name,
  columnModel.coordinates,
  columnModel.buyOffers,
  columnModel.sellOffers,
  columnModel.teachSpells,
  columnModel.questRewards,
];

/**
 * @type {import("@mui/x-data-grid").DataGridProps} The default table props.
 */
export const defaultTableProps = {
  /** specific */
  initialState: {
    sorting: {
      sortModel: [{ field: 'name', sort: 'asc' }],
    },
    columns: {
      columnVisibilityModel: {}
    }
  },
  getRowHeight: () => 'auto',
  slots: {
    toolbar: GridToolbar
  },
  slotProps: {
    toolbar: {
      showQuickFilter: true,
    },
  },
}

/**
 * 
 * @param {Object} props The props.
 * @param {Npc[]} props.rows The rows.
 * @param {import("@mui/x-data-grid").ColDef[]} props.columns The columns.
 * @param {import("@mui/x-data-grid").DataGridProps} [props.tableProps] The table props.
 * @returns {import("react").ReactNode}
 */
export default function Table({
  rows = [],
  columns = defaultColumns,
  tableProps = defaultTableProps,
} = {}) {

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      {...tableProps}
    />
  );
}

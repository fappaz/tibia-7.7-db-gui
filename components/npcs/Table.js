import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Image from "next/image";
import PageLink from "next/link";
import React from "react";
import CellItems from "../table/CellItems";
import { Link } from "@mui/material";
import i18n from "../../api/i18n";
import { getTibiaWikiUrl } from "../../utils/TibiaWiki";


/** specific */
const context = 'npcs';
const getColumnHeaderI18n = (field) => i18n.t(`contexts.${context}.table.columns.${field}.header`);

/**
 * @typedef {Object.<string, import("@mui/x-data-grid").ColDef>} ColumnModel
 */
export const columnModel = {
  /** specific */
  sprite: {
    field: "sprite", headerName: getColumnHeaderI18n("sprite"),
    renderCell: (params) => (
      <Image src={`/images/sprites/${params.row.outfit.id}-0.png`} alt={params.row.name} width={32} height={32} />
    )
  },

  name: {
    field: "name", headerName: getColumnHeaderI18n('name'), width: 130,
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

  coordinates: {
    field: "coordinates", headerName: getColumnHeaderI18n('coordinates'), width: 130,
    valueGetter: (params) => params.row.location.coordinates,
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

  buyOffers: {
    /** @TODO (future) replace with a horizontal with the item image, name and amount */
    field: "buyOffers", headerName: getColumnHeaderI18n('buyOffers'), flex: 1, valueGetter: (params) => params.row.buyOffers.sort((a, b) => a.item.name.localeCompare(b.item.name)),
    renderCell: (params) => {
      const offers = params.row.buyOffers.map(offer => ({
        label: offer.item.name,
        link: { path: `/item/${offer.item.id}` },
        value: offer.price,
      }));
      return <CellItems items={offers} />;
    }
  },

  sellOffers: {
    /** @TODO (future) replace with a horizontal with the item image, name and amount */
    field: "sellOffers", headerName: getColumnHeaderI18n('sellOffers'), flex: 1, valueGetter: (params) => params.row.sellOffers.sort((a, b) => a.item.name.localeCompare(b.item.name)),
    renderCell: (params) => {
      const offers = params.row.sellOffers.map(offer => ({
        label: offer.item.name,
        link: { path: `/item/${offer.item.id}` },
        value: offer.price,
      }));
      return <CellItems items={offers} />;
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
      const offers = params.row.questRewards.map(offer => ({
        label: offer.item.name,
        link: { path: `/item/${offer.item.id}` },
      }));
      return <CellItems items={offers} />;
    }
  },
};

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

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Image from "next/image";
import PageLink from "next/link";
import React from "react";
import CellItems from "../table/CellItems";
import { round } from "../../utils/Math";
import { Link } from "@mui/material";
import i18n from "../../api/i18n";

/** specific */
const context = 'creatures';
const getColumnHeaderI18n = (field) => i18n.t(`${context}.table.columns.${field}.header`);

/**
 * @typedef {Object.<string, import("@mui/x-data-grid").ColDef>} ColumnModel
 */
export const columnModel = {
  /** specific */
  id: { field: "id", headerName: getColumnHeaderI18n('id'), valueGetter: (params) => params.row.id },

  animatedSprite: {
    field: "animatedSprite", headerName: getColumnHeaderI18n("sprite"),
    renderCell: (params) => (
      <Image src={`/images/sprites/${params.row.outfit.id}.gif`} alt={params.row.name} width={32} height={32} />
    )
  },

  sprite: {
    field: "sprite", headerName: getColumnHeaderI18n("sprite"),
    renderCell: (params) => (
      <Image src={`/images/sprites/${params.row.outfit.id}-0.png`} alt={params.row.name} width={32} height={32} />
    )
  },
  
  name: {
    field: "name", headerName: getColumnHeaderI18n("name"), width: 130,
    renderCell: (params) => (
      <Link
        component={PageLink}
        href={`/creatures/${params.row.id}`}
      >
        {params.row.name}
      </Link>
    )
  },
  
  experience: { field: "experience", headerName: getColumnHeaderI18n('experience'), valueGetter: (params) => params.row.experience },
  hitpoints: { field: "hitpoints", headerName: getColumnHeaderI18n('hitpoints'), valueGetter: (params) => params.row.attributes.hitpoints },
  attack: { field: "attack", headerName: getColumnHeaderI18n('attack'), valueGetter: (params) => params.row.attributes.attack || '' },
  defense: { field: "defense", headerName: getColumnHeaderI18n('defense'), valueGetter: (params) => params.row.attributes.defense || '' },
  armor: { field: "armor", headerName: getColumnHeaderI18n('armor'), valueGetter: (params) => params.row.attributes.armor },
  
  drops: {
    /** @TODO (future) replace with a horizontal  with the item image, name, rate and amount */
    field: "drops", headerName: getColumnHeaderI18n('drops'), flex: 1, valueGetter: (params) => params.row.drops.sort((a, b) => b.rate - a.rate),
    renderCell: (params) => {
      const drops = params.row.drops.map(drop => ({
        label: drop ? `${(drop.amount > 1) ? `${drop.amount} ` : ''}${drop.item.name}` : '',
        link: { path: `/item/${drop.item.id}` }, value: `${round((drop.rate + 1) / 10, 3)}%`
      }));
      return <CellItems items={drops} />;
    }
  },
  
  spawns: {
    field: "spawns", headerName: getColumnHeaderI18n('spawns'), width: 140, valueGetter: (params) => params.row.spawns.reduce((total, spawn) => total + spawn.amount, 0),
    renderCell: (params) => (
      params.value > 0 && (
        <Link
          component={PageLink}
          href={`/creatures/${params.row.id}?tab=spawns`}
          target='_blank'
          rel='noopener noreferrer'
        >
          {i18n.t('creatures.table.columns.spawns.value', { amount: params.value, placesCount: params.row.spawns.length })}
        </Link>
      )
    )
  },
  
  summonCost: { field: "summonCost", headerName: getColumnHeaderI18n('summonCost'), valueGetter: (params) => params.row.summonCost || '' },
  
  flags: { field: "flags", headerName: getColumnHeaderI18n('flags'), flex: 1, valueGetter: (params) => params.row.flags.join(', ') },
};

/**
 * @type {import("@mui/x-data-grid").ColDef[]} The default columns.
 */
export const defaultColumns = [
  /** specific */
  columnModel.animatedSprite,
  columnModel.name,
  columnModel.experience,
  columnModel.hitpoints,
  columnModel.attack,
  columnModel.defense,
  columnModel.armor,
  columnModel.drops,
  columnModel.spawns,
  columnModel.summonCost,
  columnModel.flags,
];

/**
 * @type {import("@mui/x-data-grid").DataGridProps} The default table props.
 */
export const defaultTableProps = {
  /** specific */
  initialState: {
    columns: {
      columnVisibilityModel: {
        flags: false,
      },
    },
    sorting: {
      sortModel: [{ field: 'experience', sort: 'asc' }],
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
 * @param {Creature[]} props.rows The rows.
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

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Image from "next/image";
import PageLink from "next/link";
import React from "react";
import CellItems from "../table/CellItems";
import { round } from "../../utils/Math";
import { Box, Link, Tooltip } from "@mui/material";
import i18n from "../../api/i18n";
import { insertArrayAt } from "../../utils/Array";
import DetailsCard from "../items/DetailsCard";
import objects from "../../database/objects.json";

/** specific */
const context = 'creatures';
const getColumnHeaderI18n = (field) => i18n.t(`${context}.table.columns.${field}.header`);
const getValueI18n = (field, variables = {}) => i18n.t([`${context}.table.columns.${field}.value`, `${context}.attributes.${field}.values.${variables?.value}`, field], variables);

/**
 * @typedef {Object.<string, import("@mui/x-data-grid").ColDef>} ColumnModel
 */
export const columnModel = {
  /** specific */
  id: { field: "id", headerName: getColumnHeaderI18n('id'), valueGetter: (params) => params.row.id },

  animatedSprite: {
    field: "animatedSprite", headerName: getColumnHeaderI18n("sprite"),
    renderCell: (params) => (
      <Box pr={2} display='flex' justifyContent='center' alignItems='end' sx={{ width: '100%' }}>
        <Image src={`/images/sprites/creatures/${params.row.id}.gif`} alt={params.row.name} width={32 * params.row.dat.sprite.width} height={32 * params.row.dat.sprite.height} />
      </Box>
    )
  },

  sprite: {
    field: "sprite", headerName: getColumnHeaderI18n("sprite"),
    renderCell: (params) => (
      <Box pr={2} display='flex' justifyContent='center' alignItems='end' sx={{ width: '100%' }}>
        <Image src={`/images/sprites/creatures/${params.row.id}-0.png`} alt={params.row.name} width={32 * params.row.dat.sprite.width} height={32 * params.row.dat.sprite.height} />
      </Box>
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
        link: { path: `/items/${drop.item.id}` }, value: `${round((drop.rate + 1) / 10, 3)}%`,
        data: objects.find(object => object.id === drop.item.id),
      }));
      return <CellItems items={drops} renderTooltipContent={({ cellItem }) => <DetailsCard item={cellItem.data} />} />;
    }
  },
  
  spawns: {
    field: "spawns", headerName: getColumnHeaderI18n('spawns'), width: 140, valueGetter: (params) => params.row.spawns.reduce((total, spawn) => total + spawn.amount, 0),
    renderCell: (params) => (
      params.value > 0 && (
        <Link
          component={PageLink}
          href={`/creatures/${params.row.id}?tab=spawns`}
        >
          {i18n.t('creatures.table.columns.spawns.value', { amount: params.value, placesCount: params.row.spawns.length })}
        </Link>
      )
    )
  },
  
  summonCost: { field: "summonCost", headerName: getColumnHeaderI18n('summonCost'), valueGetter: (params) => params.row.summonCost || '' },
  
  flags: { field: "flags", headerName: getColumnHeaderI18n('flags'), flex: 1, valueGetter: (params) => params.row.flags.join(', ') },

  /** Columns that depend on variables outside the table, therefore are functions that return columns */
  dropRate: (itemId) => ({
    field: 'dropRate', headerName: getColumnHeaderI18n('dropRate'),
    valueGetter: (params) => {
      const drop = params.row.drops.find(drop => drop.item.id === itemId);
      if (!drop) return 0;
      return round((drop.rate + 1) / 10, 3);
    },
    renderCell: (params) => (
      <Tooltip title={i18n.t(`items.table.columns.dropRate.tooltip`, { count: round(100 / params.value, 0) })}>
        <span>
          {getValueI18n(`dropRate`, { value: params.value })}
        </span>
      </Tooltip>
    ),
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

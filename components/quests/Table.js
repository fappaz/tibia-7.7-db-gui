import PageLink from "next/link";
import React from "react";
import { Link } from "@mui/material";
import i18n from "../../api/i18n";
import CellItems from "../table/CellItems";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DetailsCard from "../items/DetailsCard";
import objects from "../../database/objects.json";

/** specific */
const context = 'quests';
const getColumnHeaderI18n = (field) => i18n.t(`${context}.table.columns.${field}.header`);

/**
 * @typedef {Object.<string, import("@mui/x-data-grid").ColDef>} ColumnModel
 */
export const columnModel = {
  /** specific */
  id: {
    field: 'id', headerName: getColumnHeaderI18n('id'), width: 70,
  },

  rewards: {
    field: "rewards", headerName: getColumnHeaderI18n("rewards"), flex: 1, valueGetter: params => params.row.rewards.items.map(item => item.name).join(', '),
    renderCell: (params) => {
      const rewards = params.row.rewards.items.map(item => ({
        label: item.name,
        link: { path: `/items/${item.id}` },
        data: objects.find(object => object.id === item.id),
      }));
      return <CellItems items={rewards} renderTooltipContent={({ cellItem }) => <DetailsCard item={cellItem.data} />} />;
    }
  },

  coordinates: {
    field: 'coordinates', headerName: getColumnHeaderI18n('coordinates'), flex: 1, valueGetter: params => params.row.coordinates.join(','),
    renderCell: (params) => (
      <Link
        component={PageLink}
        href={`/map?at=${params.value}`}
      >
        {params.value}
      </Link>
    )
  },
};

/**
 * @type {import("@mui/x-data-grid").ColDef[]} The default columns.
 */
export const defaultColumns = [
  /** specific */
  columnModel.id,
  columnModel.rewards,
  columnModel.coordinates,
];

/**
 * @type {import("@mui/x-data-grid").DataGridProps} The default table props.
 */
export const defaultTableProps = {
  /** specific */
  initialState: {
    sorting: {
      sortModel: [{ field: 'id', sort: 'asc' }],
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
 * @param {Quest[]} props.rows The rows.
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
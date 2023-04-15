import PageLink from "next/link";
import React from "react";
import { Link } from "@mui/material";
import i18n from "../../api/i18n";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";


/** specific */
const context = 'landmarks';
const getColumnHeaderI18n = (field) => i18n.t(`${context}.table.columns.${field}.header`);

/**
 * @typedef {Object.<string, import("@mui/x-data-grid").ColDef>} ColumnModel
 */
export const columnModel = {
  /** specific */
  name: {
    field: 'name', headerName: getColumnHeaderI18n('name'), flex: 1,
  },
  coordinates: {
    field: 'coordinates', headerName: getColumnHeaderI18n('coordinates'), flex: 1, valueGetter: params => params.row.coordinates.join(','),
    renderCell: (params) => (
      <Link
        component={PageLink}
        href={`/map?at=${params.value}`}
      >
        {params.row.name}
      </Link>
    )
  },
};

/**
 * @type {import("@mui/x-data-grid").ColDef[]} The default columns.
 */
export const defaultColumns = [
  /** specific */
  columnModel.name,
  columnModel.coordinates,
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
 * @param {Landmark[]} props.rows The rows.
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
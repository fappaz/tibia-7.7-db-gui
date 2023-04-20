import PageLink from "next/link";
import React from "react";
import { Link } from "@mui/material";
import i18n from "../../api/i18n";
import CellItems from "../table/CellItems";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { getTibiaWikiUrl } from '../../utils/TibiaWiki';


/** specific */
const context = 'spells';
const getColumnHeaderI18n = (field) => i18n.t(`${context}.table.columns.${field}.header`);

/**
 * @typedef {Object.<string, import("@mui/x-data-grid").ColDef>} ColumnModel
 */
export const columnModel = {
  name: {
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

  knight: { field: "knight", headerName: getColumnHeaderI18n('knight'), valueGetter: (params) => params.row.vocations.includes('Knight'), renderCell: (params) => params.value ? i18n.t('yes') : '' },
  paladin: { field: "paladin", headerName: getColumnHeaderI18n('paladin'), valueGetter: (params) => params.row.vocations.includes('Paladin'), renderCell: (params) => params.value ? i18n.t('yes') : '' },
  druid: { field: "druid", headerName: getColumnHeaderI18n('druid'), valueGetter: (params) => params.row.vocations.includes('Druid'), renderCell: (params) => params.value ? i18n.t('yes') : '' },
  sorcerer: { field: "sorcerer", headerName: getColumnHeaderI18n('sorcerer'), valueGetter: (params) => params.row.vocations.includes('Sorcerer'), renderCell: (params) => params.value ? i18n.t('yes') : '' },
  minimumLevel: { field: "minimumLevel", headerName: getColumnHeaderI18n('minimumLevel'), valueGetter: (params) => params.row.minimumLevel },

  taughtBy: {
    field: "taughtBy", headerName: getColumnHeaderI18n("taughtBy"), flex: 1, valueGetter: (params) => params.row.taughtBy.sort((a, b) => a.price - b.price),
    renderCell: (params) => {
      const npcs = params.row.taughtBy.map(npc => ({ label: npc.name, link: { path: `/npcs/${npc.id}` }, value: npc.price }));
      return <CellItems items={npcs} />;
    }
  },
};

/**
 * @type {import("@mui/x-data-grid").ColDef[]} The default columns.
 */
export const defaultColumns = [
  /** specific */
  columnModel.name,
  columnModel.knight,
  columnModel.paladin,
  columnModel.druid,
  columnModel.sorcerer,
  columnModel.minimumLevel,
  columnModel.taughtBy,
];

/**
 * @type {import("@mui/x-data-grid").DataGridProps} The default table props.
 */
export const defaultTableProps = {
  /** specific */
  initialState: {
    columns: {
      columnVisibilityModel: {
        id: false,
      },
    },
    sorting: {
      sortModel: [{ field: 'minLevel', sort: 'asc' }],
    },
  },
  getRowHeight: () => 'auto',
  getRowId: (row) => row.name,
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
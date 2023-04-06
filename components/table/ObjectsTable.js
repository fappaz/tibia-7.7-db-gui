import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import getObjectColumns from "./ObjectColumns";

/**
 * @param {Object} props The props.
 * @param {Object[]} props.data The table data.
 * @param {import("@mui/x-data-grid").GridColDef[]} props.typeColumns The columns specific for the object type.
 * @returns {import("react").ReactNode}
 */
export default function ObjectsTable({
  data = [],
  typeColumns = [],
  tableProps = {},
} = {}) {

  /** @TODO fix layout */
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <DataGrid
        rows={data}

        columns={getObjectColumns(typeColumns)}

        getRowHeight={() => 'auto'}

        slots={{
          toolbar: GridToolbar
        }}

        disableVirtualization

        initialState={{
          columns: {
            columnVisibilityModel: {
              attributes: false,
              flags: false,
            },
          },
          sorting: {
            sortModel: [{ field: typeColumns.length > 0 ? typeColumns[0].field : 'name', sort: 'asc' }],
          },
        }}
        {...tableProps}
      />
    </Box>
  );

}
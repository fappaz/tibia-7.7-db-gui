import database from "../../database/database.json";
import { getBowsColumns, getAmmoColumns, getThrowableColumns } from "../../components/table/ObjectColumns";
import ObjectsTable from "../../components/table/ObjectsTable";
import ObjectFlags from "../../api/objects/flags";
import StandardPage from "../../components/StandardPage";
import { Grid } from "@mui/material";

/** @TODO (future) move each to their own file? */
const tables = [
  {
    title: 'Bows',
    data: database.objects.filter(({ flags }) => (flags || []).includes(ObjectFlags.Bow)),
    columns: getBowsColumns(),
  },
  {
    title: 'Ammo',
    data: database.objects.filter(({ flags }) => (flags || []).includes(ObjectFlags.Ammo)),
    columns: getAmmoColumns(),
  },
  {
    title: 'Throwables',
    data: database.objects.filter(({ flags }) => (flags || []).includes(ObjectFlags.Throw)),
    columns: getThrowableColumns(),
  },
];

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function DistanceItems({

} = {}) {

  return (
    <StandardPage>
      <Grid container spacing={3}>
        {
          tables.map((table, index) => (
            <Grid item xs={12} key={`table-${index}`}>
              <StandardPage title={table.title}>
                <ObjectsTable
                  data={table.data}
                  typeColumns={table.columns}
                />
              </StandardPage>
            </Grid>
          ))
        }
      </Grid>
    </StandardPage>
  );
}

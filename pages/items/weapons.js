import database from "../../database/database.json";
import { getWeaponColumns } from "../../components/table/ObjectColumns";
import ObjectsTable from "../../components/table/ObjectsTable";
import ObjectAttributes from "../../api/objects/attributes";

const weapons = database.objects.filter(({ attributes }) => (attributes||{}).WeaponType >= 1);
const typeColumns = getWeaponColumns();
/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Equips({
  
} = {}) {

  return (
    <ObjectsTable
      data={weapons}
      typeColumns={[
        ...typeColumns,
        { field: "type", headerName: "Type", valueGetter: (params) => ObjectAttributes.WeaponType.values[params.row.attributes.WeaponType] },
      ]}
    />
  );

}

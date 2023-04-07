import { objects } from "../../database/database.json";
import { getFoodColumns } from "../../components/table/ObjectColumns";
import ObjectsTable from "../../components/table/ObjectsTable";
import StandardPage from "../../components/StandardPage";


/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function WandsAndRodItems({

} = {}) {


  return (
    <StandardPage title='Food'>
      <ObjectsTable
        data={objects.filter(({ attributes }) => (attributes || {Nutrition:0}).Nutrition > 0)}
        typeColumns={getFoodColumns()}
      />
    </StandardPage>
  );
}

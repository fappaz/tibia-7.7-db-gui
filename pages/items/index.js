import { objects } from "../../database/database.json";
import ObjectsTable from "../../components/table/ObjectsTable";
import StandardPage from "../../components/StandardPage";

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Items({
  
} = {}) {

  return (
    <StandardPage title='All items'>
      <ObjectsTable
        data={objects}
      />
    </StandardPage>
  );

}

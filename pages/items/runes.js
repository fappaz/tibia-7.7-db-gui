import { objects } from "../../database/database.json";
import ObjectsTable from "../../components/table/ObjectsTable";
import StandardPage from "../../components/StandardPage";

const BLANK_RUNE_ID = 3147;
const BLANK_RUNE_MEANING = 40;

/**
 * @TODO fix name
 * @TODO add type columns: usage level, cast level, charges, type, etc.
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function RuneItems({

} = {}) {

  return (
    <StandardPage title='Food'>
      <ObjectsTable
        data={objects.filter(({ attributes, flags }) => (flags||[]).includes('Rune') || (attributes||{}).Meaning === BLANK_RUNE_MEANING)}
      />
    </StandardPage>
  );
}

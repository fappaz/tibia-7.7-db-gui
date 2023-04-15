import database from "../../database/database.json";
import StandardPage from '../../components/StandardPage';
import SpellsTable from "../../components/spells/Table";
import { useTranslation } from "react-i18next";

const spells = database.spells;

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Npcs({

} = {}) {

  const { t } = useTranslation();

  return (
    
    <StandardPage title={t('spells.name')}>
      <SpellsTable rows={spells} />
    </StandardPage>
  );

}

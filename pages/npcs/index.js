import { npcs } from "../../database/database.json";
import StandardPage from '../../components/StandardPage';
import NpcsTable from "../../components/npcs/Table";
import { useTranslation } from "react-i18next";

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Npcs({

} = {}) {

  const { t } = useTranslation();

  return (
    
    <StandardPage title={t('contexts.npcs.name')} contentProps={{ style: { height: '72vh' } }}>
      <NpcsTable rows={npcs} />
    </StandardPage>
  );

}

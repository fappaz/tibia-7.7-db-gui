import npcs from "../../database/npcs.json";
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
    
    <StandardPage title={t('npcs.name')}>
      <NpcsTable rows={npcs} />
    </StandardPage>
  );

}

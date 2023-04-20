import { Card } from "@mui/material";
import spells from "../../database/spells.json";
import StandardPage from '../../components/StandardPage';
import SpellsTable from "../../components/spells/Table";
import { useTranslation } from "react-i18next";

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Npcs({

} = {}) {

  const { t } = useTranslation();

  return (
    
    <StandardPage title={t('spells.name')}>
      <Card sx={{ height: '100%' }}>
        <SpellsTable rows={spells} />
      </Card>
    </StandardPage>
  );

}

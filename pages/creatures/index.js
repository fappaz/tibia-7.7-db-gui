import { Box } from "@mui/material";
import database from "../../database/database.json";
import StandardPage from "../../components/StandardPage";
import CreaturesTable from "../../components/creatures/Table";
import { useTranslation } from "react-i18next";

const creatures = database.creatures;

/**
 * 
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Creatures({

} = {}) {

  const { t } = useTranslation();

  return (
    <StandardPage title={t('contexts.creatures.name')} contentProps={{ style: { height: '72vh' } }}>
      <CreaturesTable rows={creatures} />
    </StandardPage>
  );

}
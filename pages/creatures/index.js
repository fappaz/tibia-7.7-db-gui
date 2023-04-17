import { Box } from "@mui/material";
import creatures from "../../database/creatures.json";
import StandardPage from "../../components/StandardPage";
import CreaturesTable from "../../components/creatures/Table";
import { useTranslation } from "react-i18next";

/**
 * 
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Creatures({

} = {}) {

  const { t } = useTranslation();

  return (
    <StandardPage title={t('creatures.name')}>
      <CreaturesTable rows={creatures} />
    </StandardPage>
  );

}
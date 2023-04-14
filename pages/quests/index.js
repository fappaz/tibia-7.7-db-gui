import { Grid } from "@mui/material";
import StandardPage from "../../components/StandardPage";
import { useRouter } from "next/router";
import database from "../../database/database.json";
import TibiaMap from '../../components/tibiamap';
import { useState, useEffect } from "react";
import QuestsTable from "../../components/quests/Table";
import { useTranslation } from "react-i18next";

const quests = database.quests;
const questChestMarkers = quests.filter(quest => quest.type === 'chest').sort((a, b) => a.id - b.id).map(quest => {
  const coordinates = quest.coordinates;
  return {
    coordinates,
    label: `Quest ${quest.id} - ${coordinates.join(',')}. Rewards: ${quest.rewards.items.map(item => item.name).join(', ')}`,
    icon: {
      // url: '/images/icons/chest.png'
      color: 'yellow',
    }
  };
});

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function QuestMap({

} = {}) {

  const router = useRouter();
  const { id } = router.query;
  const [quest, setQuest] = useState(null);
  const { t } = useTranslation();

  useEffect(function onQueryChanged() {
    if (!id) return;
    const quest = quests.find(quest => `${quest.id}` === `${id}`);
    setQuest(quest);
  }, [id]);

  const coordinates = quest? quest.coordinates : questChestMarkers.find(marker => marker.coordinates[2] === 7).coordinates;

  return (
    <StandardPage title={t('contexts.quests.name')} >
      <Grid container spacing={2} style={{ height: '74vh'}}>
        <Grid item xs={12} md={4}>
          <QuestsTable
            rows={quests}
            tableProps={{
              onRowClick: (params) => setQuest(params.row),
            }}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <TibiaMap
            center={coordinates}
            markers={questChestMarkers} 
          />
        </Grid>
      </Grid>
    </StandardPage>
  );
}
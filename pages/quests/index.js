import { Grid } from "@mui/material";
import StandardPage from "../../components/StandardPage";
import { useRouter } from "next/router";
import quests from "../../database/quests.json";
import TibiaMap from '../../components/tibiamap';
import { useState, useEffect } from "react";
import QuestsTable, { defaultTableProps } from "../../components/quests/Table";
import { useTranslation } from "react-i18next";
import i18n from "../../api/i18n";

const questChestMarkers = quests.filter(quest => quest.type === 'chest').sort((a, b) => a.id - b.id).map(quest => {
  const coordinates = quest.coordinates;
  return {
    coordinates,
    label: i18n.t(`quests.marker.tooltip`, { id: quest.id, coordinates: coordinates.join(', '), rewardsCount: quest.rewards.items.length }),
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
    <StandardPage title={t('quests.name')} >
      <Grid container spacing={2} style={{ height: '100%'}}>
        <Grid item xs={12} md={4}>
          <QuestsTable
            rows={quests}
            tableProps={{
              ...defaultTableProps,
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
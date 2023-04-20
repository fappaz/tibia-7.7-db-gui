import { useRouter } from "next/router";
import npcs from "../../database/npcs.json";
import { useState, useEffect } from "react";
import { Box, Grid, TextField, Tab, Tabs } from "@mui/material";
import StandardPage from "../../components/StandardPage";
import TabContent, { useTabContent } from "../../components/TabContent";
import i18n from "../../api/i18n";
import { useTranslation } from "react-i18next";
import DetailsCard from "../../components/npcs/DetailsCard";
import objects from "../../database/objects.json";
import ItemsTable, { getCustomColumns, columnModel, defaultTableProps } from "../../components/items/Table";
import TibiaMap from '../../components/tibiamap';

const getColumnHeaderI18n = (field) => i18n.t(`npcs.table.columns.${field}.header`);
const getFlagI18n = (flag) => i18n.t(`npcs.flags.${flag}`);

const tabs = [
  { name: getColumnHeaderI18n('buyOffers') },
  { name: getColumnHeaderI18n('sellOffers') },
  // { name: getColumnHeaderI18n('teachSpells') },
  // { name: getColumnHeaderI18n('questsRewards') },
  { name: i18n.t('rawData') },
];

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Npc({

} = {}) {

  const router = useRouter();
  const { id, tab } = router.query;
  const [npc, setNpc] = useState(null);
  const { activeTabIndex, setActiveTabIndex } = useTabContent(0);
  const { t } = useTranslation();

  useEffect(function onQueryChanged() {
    if (!id) return;
    let npc = npcs.find(npc => `${npc.id}` === `${id}`);
    if (!npc) npc = npcs.find(npc => npc.name.toLowerCase() === `${id}`.toLowerCase());
    setNpc(npc);

    if (!tab) return;
    const tabIndex = tabs.findIndex(({ name }) => name.toUpperCase() === `${tab}`.toUpperCase()) || 0;
    setActiveTabIndex(tabIndex);
  }, [id, tab]);

  if (!npc) return <>{t('loading')}</>;

  return (
    <StandardPage title={`${npc.name.charAt(0).toUpperCase()}${npc.name.slice(1)}`}>
      <Grid container spacing={2} sx={{ height: '100%'}}>
        <Grid item xs={12} md={3}>
          <Box display='flex' flexDirection='column' sx={{ height: '100%' }} >
            <DetailsCard npc={npc} showExternalLinks />
            <Box flexGrow={1} mt={2}>
              <TibiaMap center={npc.location.coordinates} zoom={2} />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTabIndex} onChange={(event, tabIndex) => setActiveTabIndex(tabIndex)}>
              {
                tabs.map(({ name }, index) => <Tab key={`tab-${index}`} id={`tab-${index}`} label={name} />)
              }
            </Tabs>
          </Box>

          <TabContent activeTabIndex={activeTabIndex} index={0}>
            <BuyOffers npc={npc} />
          </TabContent>

          <TabContent activeTabIndex={activeTabIndex} index={1}>
            <SellOffers npc={npc} />
          </TabContent>

          <TabContent activeTabIndex={activeTabIndex} index={2}>
            <RawData object={npc} />
          </TabContent>
        </Grid>
      </Grid>
    </StandardPage>
  );

}

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
function BuyOffers({
  npc,
} = {}) {

  const items = npc.buyOffers.map(offer => objects.find(object => object.id === offer.item.id)).filter(Boolean);

  return (
    <ItemsTable
      rows={items}
      columns={getCustomColumns({ columnsToInsert: [columnModel.price(npc.id, 'buyOffer')] })}
    />
  );
}

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
function SellOffers({
  npc,
} = {}) {

  const items = npc.sellOffers.map(offer => objects.find(object => object.id === offer.item.id)).filter(Boolean);

  return (
    <ItemsTable
      rows={items}
      columns={getCustomColumns({ columnsToInsert: [columnModel.price(npc.id, 'sellOffer')] })}
    />
  );
}

/**
 * @TODO move to its own file?
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
function RawData({
  object,
} = {}) {

  const { t } = useTranslation();

  return (
    <>
      <TextField
        label={t('json')}
        multiline
        rows={17}
        value={JSON.stringify(object, null, 2)}
        variant='outlined'
        disabled
        fullWidth
      />
    </>
  );
}
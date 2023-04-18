import { useRouter } from "next/router";
import objects from "../../database/objects.json";
import creatures from "../../database/creatures.json";
import npcs from "../../database/npcs.json";
import { useState, useEffect } from "react";
import { Box, Grid, Tab, Tabs, TextField } from "@mui/material";
import StandardPage from "../../components/StandardPage";
import CreaturesTable, { columnModel as itemsColumnModel, defaultTableProps as itemsDefaultTableProps, getCustomColumns as itemsGetCustomColumns } from "../../components/creatures/Table";
import NpcsTable, { columnModel as npcsColumnModel, defaultTableProps as npcsDefaultTableProps, getCustomColumns as npcsGetCustomColumns } from "../../components/npcs/Table";
import TabContent, { useTabContent } from "../../components/TabContent";
import { useTranslation } from "react-i18next";
import i18n from "../../api/i18n";
import DetailsCard from "../../components/items/DetailsCard";

const getColumnHeaderI18n = (field) => i18n.t(`items.table.columns.${field}.header`);
const tabs = [
  { name: i18n.t('creatures.table.columns.drops.header') },
  { name: getColumnHeaderI18n('buyFrom') },
  { name: getColumnHeaderI18n('sellTo') },
  { name: i18n.t('rawData') },
];

/**
 * @TODO i18n
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Item({

} = {}) {

  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const { activeTabIndex, setActiveTabIndex } = useTabContent(0);
  const { t } = useTranslation();

  useEffect(function onPageMount() {
    if (!id) return;
    let item = objects.find(item => `${item.id}` === `${id}`);
    if (!item) item = objects.find(item => item.name.toLowerCase() === `${id}`.toLowerCase());
    setItem(item);
  }, [id]);

  if (!item) return <>{t('loading')}</>;

  return (
    <StandardPage title={`${item.name.charAt(0).toUpperCase()}${item.name.slice(1)}`}>
      <Grid container spacing={2} sx={{ height: '100%'}} >
        <Grid item xs={12} md={3} lg={2}>
          <DetailsCard item={item} showExternalLinks showEmptyValues />
        </Grid>

        <Grid item xs={12} md={9} lg={10}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTabIndex} onChange={(event, tabIndex) => setActiveTabIndex(tabIndex)}>
              {
                tabs.map(({ name }, index) => <Tab id={`tab-${index}`} label={name} />)
              }
            </Tabs>
          </Box>

          <TabContent activeTabIndex={activeTabIndex} index={0}>
            <Drops item={item} />
          </TabContent>

          <TabContent activeTabIndex={activeTabIndex} index={1}>
            <NpcOffers item={item} offerType={offerTypes.buyFrom.itemProp} />
          </TabContent>

          <TabContent activeTabIndex={activeTabIndex} index={2}>
            <NpcOffers item={item} offerType={offerTypes.sellTo.itemProp} />
          </TabContent>

          <TabContent activeTabIndex={activeTabIndex} index={3}>
            <RawData object={item} />
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
function Drops({
  item,
} = {}) {

  const creatureIds = item.dropFrom.map(drop => drop.creature.id);
  const filteredCreatures = creatures.filter(creature => creatureIds.includes(creature.id));

  return (
    <CreaturesTable
      rows={filteredCreatures}
      columns={itemsGetCustomColumns({ columnsToInsert: [itemsColumnModel.dropRate(item.id)] })}
      /** @TODO (future) Find a better way to merge this */
      tableProps={{
        ...itemsDefaultTableProps,
        initialState: {
          sorting: {
            sortModel: [{ field: 'dropRate', sort: 'desc' }]
          },
          columns: {
            columnVisibilityModel: {
              drops: false,
            }
          }
        },
      }}
    />
  );
}

const offerTypes = {
  buyFrom: {
    itemProp: 'buyFrom',
    npcProp: 'sellOffers',
  },
  sellTo: {
    itemProp: 'sellTo',
    npcProp: 'buyOffers',
  },
};

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
function NpcOffers({
  item,
  offerType = offerTypes.buyFrom,
} = {}) {

  const npcIds = item[offerTypes[offerType].itemProp].map(offer => offer.npc.id);
  const filteredNpcs = npcs.filter(npc => npcIds.includes(npc.id));

  return (
    <NpcsTable
      rows={filteredNpcs}
      columns={npcsGetCustomColumns({ columnsToInsert: [npcsColumnModel.price(item.id, offerTypes[offerType].npcProp)] })}
      tableProps={{
        ...npcsDefaultTableProps,
        initialState: {
          sorting: {
            sortModel: [{ field: 'price', sort: 'asc' }]
          },
          columns: {
            columnVisibilityModel: {
              buyOffers: false,
              sellOffers: false,
              teachSpells: false,
              questRewards: false,
            }
          }
        },
      }}
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

  return (
    <>
      <TextField
        label='JSON'
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
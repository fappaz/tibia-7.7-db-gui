import { useRouter } from "next/router";
import database from "../../database/database.json";
import { useState, useEffect } from "react";
import { getTibiaWikiUrl } from "../../utils/TibiaWiki";
import { Box, Card, Divider, Grid, Link, List, ListItem, Tab, Tabs, TextField, Typography } from "@mui/material";
import PageLink from "next/link";
import Image from "next/image";
import StandardPage from "../../components/StandardPage";
import CreaturesTable, { columnModel } from "../../components/creatures/Table";
import { round } from "../../utils/Math";
import TabContent, { useTabContent } from "../../components/TabContent";
import Property from "../../components/Property";
import { useTranslation } from "react-i18next";

const objects = database.objects;
const creatures = database.creatures;

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
          <Details item={item} />
        </Grid>

        <Grid item xs={12} md={9} lg={10}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTabIndex} onChange={(event, tabIndex) => setActiveTabIndex(tabIndex)}>
              <Tab id={`tab-drops`} label={`Drops`} />
              <Tab id={`tab-buy-from`} label={`Buy from`} />
              <Tab id={`tab-sell-to`} label={`Sell to`} />
              <Tab id={`tab-json`} label={`JSON`} />
            </Tabs>
          </Box>

          <TabContent activeTabIndex={activeTabIndex} index={0}>
            <Drops item={item} />
          </TabContent>

          <TabContent activeTabIndex={activeTabIndex} index={1}>
            @TODO
          </TabContent>

          <TabContent activeTabIndex={activeTabIndex} index={2}>
            @TODO
          </TabContent>

          <TabContent activeTabIndex={activeTabIndex} index={3}>
            <Json object={item} />
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
function Details({
  item,
} = {}) {

  return (
    <Card sx={{ px: 2 }}>
      <List dense>
        <ListItem disableGutters >
          <Image
            src={`/images/sprites/${item.id}.gif`}
            alt={item.id}
            width={32}
            height={32}
            style={{ objectPosition: 'center' }}
          />
        </ListItem>
        <Divider />
        {
          [
            { label: 'ID', value: item.id },
            { label: 'Weight', value: `${item.attributes.Weight} oz.` },

          ].map((property, index) => (
            <div key={index}>
              {
                property.value ? (
                  <ListItem disableGutters>
                    <Property label={property.label} value={property.value} />
                  </ListItem>
                ) : (
                  <Divider />
                )
              }
            </div>
          ))
        }
        <Divider />
        <ListItem disableGutters>
          <Link
            component={PageLink}
            href={getTibiaWikiUrl(item.name)}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Typography variant='caption'>TibiaWiki</Typography>
          </Link>
        </ListItem>
      </List>
    </Card>
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
      columns={[
        columnModel.sprite,
        columnModel.name,
        {
          field: 'dropRate',
          headerName: 'Drop rate',
          width: 150,
          valueGetter: ({ row }) => {
            const drop = row.drops.find(drop => drop.item.id === item.id);
            return drop ? round((drop.rate + 1) / 10) : 0;
          },
          renderCell: ({ value }) => `${value}%`,
        },
        columnModel.experience,
        columnModel.hitpoints,
        columnModel.attack,
        columnModel.defense,
        columnModel.armor,
        columnModel.drops,
      ]}
      tableProps={{
        initialState: {
          sorting: {
            sortModel: [{ field: 'dropRate', sort: 'desc' }],
          },
        }
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
function Json({
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
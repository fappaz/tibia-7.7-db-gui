import React from "react";
import { columnModel, defaultColumns } from "./Table";
import { Box, Card, Divider, Link, List, ListItem, Typography } from "@mui/material";
import Property from "../Property";
import PageLink from "next/link";
import { get } from "lodash";
import { getTibiaWikiUrl } from "../../utils/TibiaWiki";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { getCreaturePage } from "../../utils/TibiaWebsite";



/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function DetailsCard({
  creature,
  showExternalLinks,
  summaryOnly,
} = {}) {

  const { t } = useTranslation();

  if (!columnModel) return <></>;

  const columns = [
    columnModel.experience,
    columnModel.hitpoints,
    columnModel.attack,
    columnModel.defense,
    columnModel.armor,
    null,
    columnModel.seeInvisible,
    columnModel.distanceFighting,
    columnModel.unpushable,
    columnModel.kickBoxes,
    columnModel.kickCreatures,
    columnModel.immunities,
  ];
  const summaryColumns = [
    columnModel.experience,
    columnModel.hitpoints,
    columnModel.attack,
    columnModel.defense,
    columnModel.armor,
  ];
  const visibleColumns = summaryOnly ? summaryColumns : columns;

  return (
    <Card>
      <List dense>
        <ListItem>
          <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' textAlign='center' py={1} sx={{ width: '100%' }}>
            <Image src={`/images/sprites/creatures/${creature.id}.gif`} alt={creature.name} width={32 * creature.dat.sprite.width} height={32 * creature.dat.sprite.height} />
          </Box>
        </ListItem>

        <Divider />
        {
          visibleColumns.map((column, index) => {
            if (!column) return <Divider key={`divider-${index}`} />;
            const { field, headerName, valueGetter, valueFormatter, renderCell } = column;
            const params = {
              row: creature,
              value: get(creature, field),
            };
            if (valueGetter) params.value = valueGetter(params);
            if (valueFormatter) params.value = valueFormatter(params);
            if (renderCell) params.value = renderCell(params);
            return (
              <div key={`creature-${field}`}>
                <ListItem disableGutters key={`creature-${field}`} sx={{ px: 2 }} >
                  <Property label={headerName} value={params.value || '-'} />
                </ListItem>
              </div>
            )
          })
        }

        {
          !!showExternalLinks && (
            <>
              <Divider />
              <ListItem disableGutters sx={{ px: 2 }}>
                <Link
                  component={PageLink}
                  href={getTibiaWikiUrl(creature.name)}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Typography variant='caption'>{t('externalPages.tibiaWiki')}</Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ px: 2 }}>
                <Link
                  component={PageLink}
                  href={getCreaturePage(creature.name)}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Typography variant='caption'>{t('externalPages.tibia')}</Typography>
                </Link>
              </ListItem>
            </>
          )
        }
      </List>
    </Card>
  );

}
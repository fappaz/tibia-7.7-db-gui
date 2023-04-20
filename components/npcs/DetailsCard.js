import React from "react";
import { columnModel } from "./Table";
import { Box, Card, Divider, Link, List, ListItem, Typography } from "@mui/material";
import Property from "../Property";
import PageLink from "next/link";
import { get } from "lodash";
import { getTibiaWikiUrl } from "../../utils/TibiaWiki";
import { useTranslation } from "react-i18next";
import Image from "next/image";


/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function DetailsCard({
  npc,
  showExternalLinks,
} = {}) {

  const { t } = useTranslation();

  if (!columnModel) return <></>;

  const visibleColumns = [
    columnModel.coordinates,
  ];

  return (
    <Card>
      <List dense>
        <ListItem>
          <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' textAlign='center' py={1} sx={{ width: '100%' }}>
            <Image src={`/images/sprites/npcs/${npc.id}.gif`} alt={npc.name} width={32 * npc.dat.sprite.width} height={32 * npc.dat.sprite.height} />
          </Box>
        </ListItem>

        <Divider />
        {
          visibleColumns.map((column, index) => {
            if (!column) return <Divider key={`divider-${index}`} />;
            const { field, headerName, valueGetter, valueFormatter, renderCell } = column;
            const params = {
              row: npc,
              value: get(npc, field),
            };
            if (valueGetter) params.value = valueGetter(params);
            if (valueFormatter) params.value = valueFormatter(params);
            if (renderCell) params.value = renderCell(params);
            return (
              <div key={`npc-${field}`}>
                <ListItem disableGutters key={`npc-${field}`} sx={{ px: 2 }} >
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
                  href={getTibiaWikiUrl(npc.name)}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Typography variant='caption'>{t('externalPages.tibiaWiki')}</Typography>
                </Link>
              </ListItem>
            </>
          )
        }
      </List>
    </Card>
  );

}
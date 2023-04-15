import React from "react";
import { defaultColumns, getCustomColumns, columnsByType, columnModel } from "./Table";
import { getItemTypeId } from "../../api/objects/types";
import { Box, Card, Divider, Link, List, ListItem, Typography } from "@mui/material";
import Property from "../Property";
import PageLink from "next/link";
import { get } from "lodash";
import { getTibiaWikiUrl } from "../../utils/TibiaWiki";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { getItemDescription } from "../../api/objects/description";

const hiddenColumns = [
  columnModel.sprite.field,
  columnModel.name.field,
  columnModel.dropFrom.field,
  columnModel.buyFrom.field,
  columnModel.sellTo.field,
  columnModel.quests.field,
  columnModel.attributes.field,
  columnModel.flags.field,
];

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function DetailsCard({
  item,
} = {}) {

  const type = getItemTypeId(item);
  const typeSpecificColumns = type ? columnsByType[type] : [];
  const columns = getCustomColumns({ columnsToInsert: typeSpecificColumns, index: 3 }).filter(column => !hiddenColumns.includes(column.field));
  const { t } = useTranslation();

  if (!columns) return <></>;

  return (
    <Card>
      <List>
        <ListItem>
          <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' textAlign='center' py={1} sx={{ width: '100%' }}>
            <Image src={`/images/sprites/${item.id}.gif`} alt={item.name} width={32} height={32} />
            <Typography sx={{pt: 2}} variant='caption'>
              {
                getItemDescription(item).split('\n').map((line, index) => (
                  <div key={`item-description-${index}`}>
                    {line}
                  </div>
                ))
              }
            </Typography>
          </Box>
        </ListItem>
        <Divider />
        {
          columns.map((column, index) => {
            const { field, headerName, valueGetter, valueFormatter, renderCell } = column;
            const params = {
              row: item,
              value: get(item, field),
            };
            if (valueGetter) params.value = valueGetter(params);
            if (valueFormatter) params.value = valueFormatter(params);
            if (renderCell) params.value = renderCell(params);
            return (
              <div key={`item-${field}`}>
                <ListItem disableGutters key={`item-${field}`} sx={{ px: 2 }} >
                  <Property label={headerName} value={params.value || '-'} />
                </ListItem>
              </div>
            )
          })
        }
        <Divider />
        <ListItem disableGutters sx={{ px: 2 }} >
          <Link
            component={PageLink}
            href={getTibiaWikiUrl(item.name)}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Typography variant='caption'>{t('externalPages.tibiaWiki')}</Typography>
          </Link>
        </ListItem>
      </List>
    </Card>
  );

}
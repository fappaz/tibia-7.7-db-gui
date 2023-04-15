import React from "react";
import { defaultColumns, getCustomColumns, columnsByType, columnModel } from "./Table";
import { getItemTypeId } from "../../api/objects/types";
import { Card, Divider, Link, List, ListItem, Typography } from "@mui/material";
import Property from "../Property";
import PageLink from "next/link";
import { get } from "lodash";
import { getTibiaWikiUrl } from "../../utils/TibiaWiki";
import { useTranslation } from "react-i18next";

const dividerIndexes = [1];
const hiddenColumns = [
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
    <Card sx={{ px: 2 }}>
      <List>
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
                <ListItem disableGutters key={`item-${field}`}>
                  <Property label={headerName} value={params.value || '-'} />
                </ListItem>
                {
                  dividerIndexes.includes(index + 1) && <Divider />
                }
              </div>
            )
          })
        }
        <Divider />
        <ListItem disableGutters>
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
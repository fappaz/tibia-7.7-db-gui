import React from "react";
import { Card, Divider, Grid, List, ListItem, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * 
 * @usage
```js
getRankingSurroundings(listAlreadyOrdered, indexOfInterest, { addGap: true, maxSurroundingItems: 1 })
  .map(item => ({
    ... item,
    ...( item.data ? {
      data: {
        // Configure the data to be displayed in the list.
        label: item.data.name,
        value: item.data.attributes.Nutrition
      }
    } : null)
  }
  ))
;
...
<AttributeRanking ranking={ranking} />
```
 * @param {Object} props The props.
 * @param {Array<import("../utils/ranking").RankingSurrounding>} props.ranking The ranking.
 * @returns {import("react").ReactNode}
 */
export default function AttributeRanking({
  ranking = [],
  header = '',
} = {}) {

  const { t } = useTranslation();

  return (
    <Card>
      <List dense>
        {
          !!header && (
            <>
              <ListItem><Typography variant='subtitle2'>{header}</Typography></ListItem>
              <Divider />
            </>
          )
        }

        {
          ranking.map((item, index) => {
            const { position, positionRelativeToItem, data } = item;

            return (
              <ListItem
                key={`item-${index}`}
                divider
                sx={(theme) => ({
                  ...(data ? null : ({ backgroundColor: theme.palette.grey[100] })),
                })
                }
              >
                {
                  data ? (
                    <Grid container spacing={1}>
                      <Grid item alignSelf='center'>
                        <Typography variant='body2' color='textSecondary'>{t('components.attributeRanking.list.position', { position: position + 1 })}</Typography>
                      </Grid>

                      <Grid item alignSelf='center'>
                        <Typography variant={positionRelativeToItem === 0 ? 'subtitle2' : 'body2'}>
                          {`${data.label}: ${data.value}`}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography variant='caption' color='textSecondary'>{t('components.attributeRanking.list.gap')}</Typography>
                  )
                }
              </ListItem>
            )
          })
        }
      </List>
    </Card>
  );

}

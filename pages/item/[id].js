import { useRouter } from "next/router";
import database from "../../database/database.json";
import { useState, useEffect } from "react";
import { getTibiaWikiUrl } from "../../utils/TibiaWiki";
import { Grid, Link, TextField } from "@mui/material";
import PageLink from "next/link";
import Image from "next/image";
import StandardPage from "../../components/StandardPage";

const objects = database.objects;

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Item({

} = {}) {

  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);

  useEffect(function onPageMount() {
    if (!id) return;
    let item = objects.find(item => `${item.id}` === `${id}`);
    if (!item) item = objects.find(item => item.name.toLowerCase() === `${id}`.toLowerCase());
    setItem(item);
  }, [id]);

  if (!item) return <>Loading item "{id}"...</>;

  return (
    <StandardPage
      title={
        <div style={{ display: 'flex' }}>
          <Image src={`/images/sprites/${item.id}.gif`} alt={item.id} width={32} height={32} />
          {`${item.name} (`}
          <Link
            component={PageLink}
            href={getTibiaWikiUrl(item.name)}
            target='_blank'
            rel='noopener noreferrer'
          >
            TibiaWiki
          </Link>
          {`)`}
        </div>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>

        </Grid>
        <Grid item xs={12}>
          <TextField
            label='JSON'
            multiline
            rows={20}
            value={JSON.stringify(item, null, 2)}
            variant='outlined'
            disabled
            fullWidth
          />
        </Grid>
      </Grid>
    </StandardPage>
  );

}

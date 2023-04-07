import { useRouter } from "next/router";
import { objects } from "../../database/database.json";
import { useState, useEffect } from "react";
import { getTibiaWikiUrl } from "../../utils/TibiaWiki";
import { Grid, Link, TextField } from "@mui/material";
import PageLink from "next/link";
import Image from "next/image";

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
    setItem(objects.find(item => item.id === parseInt(id)));
  }, [id]);

  if (!item) return <>Loading item "{id}"...</>;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Image src={`/images/sprites/${item.id}.gif`} alt={item.id} width={32} height={32} />
          <Link
            component={PageLink}
            href={getTibiaWikiUrl(item.name.split)}
            target='_blank'
            rel='noopener noreferrer'
          >
            Temporary link to "{item.name}" on TibiaWiki
          </Link>
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
    </>
  );

}

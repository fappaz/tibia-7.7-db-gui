import { useRouter } from "next/router";
import { creatures } from "../../database/database.json";
import { useState, useEffect } from "react";
import { URL as TibiaWikiUrl } from "../../utils/TibiaWiki";
import { Grid, Link, TextField } from "@mui/material";
import PageLink from "next/link";

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Creature({

} = {}) {

  const router = useRouter();
  const { id } = router.query;
  const [creature, setCreature] = useState(null);

  useEffect(function onPageMount() {
    if (!id) return;
    setCreature(creatures.find(creature => creature.id === id));
  }, [id]);

  if (!creature) return <>Loading creature "{id}"...</>;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Link
          component={PageLink}
          href={`${TibiaWikiUrl}/${creature.name.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join('_')}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          Temporary link to "{creature.name}" on TibiaWiki
        </Link>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label='JSON'
          multiline
          rows={20}
          value={JSON.stringify(creature, null, 2)}
          variant='outlined'
          disabled
          fullWidth
        />
      </Grid>
    </Grid>
  );

}

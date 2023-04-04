import { useRouter } from "next/router";
import database from "../../database/database.json";
import { useState, useEffect } from "react";
import { URL as TibiaWikiUrl } from "../../utils/TibiaWiki";
import { Link } from "@mui/material";
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
    setCreature(database.creatures.find(creature => creature.id === id));
  }, [id]);

  if (!creature) return <>Loading creature "{id}"...</>;

  return (
    <>
      <Link
        component={PageLink}
        href={`${TibiaWikiUrl}/${creature.name.replace(' ', '_')}`}
        target='_blank'
        rel='noopener noreferrer'
      >
        Temporary link to "{creature.name}" on TibiaWiki
      </Link>
      {JSON.stringify(creature)}
    </>
  );

}

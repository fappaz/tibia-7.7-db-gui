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
export default function Item({

} = {}) {

  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);

  useEffect(function onPageMount() {
    if (!id) return;
    setItem(database.objects.find(item => item.id === parseInt(id)));  
  }, [id]);
  
  if (!item) return <>Loading item "{id}"...</>;

  return (
    <>
    <Link
        component={PageLink}
        href={`${TibiaWikiUrl}/${item.name.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join('_')}`}
        target='_blank'
        rel='noopener noreferrer'
      >
        Temporary link to "{item.name}" on TibiaWiki
      </Link>
      {JSON.stringify(item)}
    </>
  );

}

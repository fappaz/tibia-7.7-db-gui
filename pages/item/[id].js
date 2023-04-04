import { useRouter } from "next/router";
import database from "../../database/database.json";
import { useState, useEffect } from "react";

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
  
  if (!item) return <>Loading item {id}...</>;

  return (
    <>
      {JSON.stringify(item)}
    </>
  );

}

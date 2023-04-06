import { objects } from "../../database/database.json";
import { getAmuletColumns, getRingColumns, getShieldColumns } from "../../components/table/ObjectColumns";
import ObjectsTable from "../../components/table/ObjectsTable";
import ObjectFlags from "../../api/objects/flags";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import StandardPage from "../../components/StandardPage";

/** @TODO (future) move each to their own file? */
const types = {
  amulets: {
    title: 'Amulets',
    filter: ({ attributes }) => (attributes||{}).BodyPosition === 2,
    typeColumns: getAmuletColumns(),
  },
  rings: {
    title: 'Rings',
    filter: ({ attributes }) => (attributes||{}).BodyPosition === 9,
    typeColumns: getRingColumns(),
  },
  shields: {
    title: 'Shields',
    filter: ({ flags }) => (flags||[]).includes(ObjectFlags.Shield),
    typeColumns: getShieldColumns(),
  },
};

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Items({
  
} = {}) {

  const router = useRouter();
  const { type } = router.query;

  const [typeSettings, setTypeSettings] = useState();

  useEffect(() => {
    const typeSettings = types[type];
    if (!typeSettings) return;

    setTypeSettings(typeSettings);
  }, [type]);

  /** @TODO (future) show a loading wheel */
  if (!typeSettings) return <>Loading...</>;
  
  const data = objects.filter(typeSettings.filter);

  return (
    <StandardPage title={typeSettings.title}>
      <ObjectsTable
        data={data}
        typeColumns={typeSettings.typeColumns}
      />
    </StandardPage>
  );

}

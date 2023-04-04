import database from "../../database/database.json";
import { getArmorColumns, getAmuletColumns, getRingColumns, getWeaponColumns, getWandAndRodColumns, getBowsColumns, getAmmoColumns, getThrowableColumns, getShieldColumns } from "../../components/table/ObjectColumns";
import ObjectsTable from "../../components/table/ObjectsTable";
import ObjectFlags from "../../api/objects/flags";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

/** @TODO (future) move each to their own file? */
const types = {
  helmets: {
    filter: ({ attributes }) => (attributes||{}).BodyPosition === 1,
    typeColumns: getArmorColumns(),
  },
  amulets: {
    filter: ({ attributes }) => (attributes||{}).BodyPosition === 2,
    typeColumns: getAmuletColumns(),
  },
  armors: {
    filter: ({ attributes }) => (attributes||{}).BodyPosition === 4,
    typeColumns: getArmorColumns(),
  },
  legs: {
    filter: ({ attributes }) => (attributes||{}).BodyPosition === 7,
    typeColumns: getArmorColumns(),
  },
  boots: {
    filter: ({ attributes }) => (attributes||{}).BodyPosition === 8,
    typeColumns: getArmorColumns(),
  },
  rings: {
    filter: ({ attributes }) => (attributes||{}).BodyPosition === 9,
    typeColumns: getRingColumns(),
  },
  axes: {
    filter: ({ attributes }) => (attributes||{}).WeaponType === 3,
    typeColumns: getWeaponColumns(),
  },
  clubs: {
    filter: ({ attributes }) => (attributes||{}).WeaponType === 2,
    typeColumns: getWeaponColumns(),
  },
  swords: {
    filter: ({ attributes }) => (attributes||{}).WeaponType === 1,
    typeColumns: getWeaponColumns(),
  },
  wands: {
    filter: ({ attributes }) => (attributes||{}).Professions === 8,
    typeColumns: getWandAndRodColumns(),
  },
  rods: {
    filter: ({ attributes }) => (attributes||{}).Professions === 16,
    typeColumns: getWandAndRodColumns(),
  },
  bows: {
    filter: ({ flags }) => (flags||[]).includes(ObjectFlags.Bow),
    typeColumns: getBowsColumns(),
  },
  ammo: {
    filter: ({ flags }) => (flags||[]).includes(ObjectFlags.Ammo),
    typeColumns: getAmmoColumns(),
  },
  throwables: {
    filter: ({ flags }) => (flags||[]).includes(ObjectFlags.Throw),
    typeColumns: getThrowableColumns(),
  },
  shields: {
    filter: ({ flags }) => (flags||[]).includes(ObjectFlags.Shield),
    typeColumns: getShieldColumns(),
  },
}

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Items({
  
} = {}) {

  const router = useRouter();
  const { type } = router.query;

  const [data, setData] = useState([]);
  const [typeColumns, setTypeColumns] = useState([]);

  useEffect(() => {
    const { filter, typeColumns } = types[type] || {};
    if (!filter) return;

    setData(database.objects.filter(filter));
    setTypeColumns(typeColumns);
  }, [type]);

  /** @TODO (future) show a loading wheel */
  if (!data.length) return <>Loading...</>;

  return (
    <ObjectsTable data={data} typeColumns={typeColumns} />
  );

}

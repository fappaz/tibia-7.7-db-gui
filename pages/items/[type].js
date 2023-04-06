import database from "../../database/database.json";
import { getArmorColumns, getAmuletColumns, getRingColumns, getWeaponColumns, getWandAndRodColumns, getBowsColumns, getAmmoColumns, getThrowableColumns, getShieldColumns } from "../../components/table/ObjectColumns";
import ObjectsTable from "../../components/table/ObjectsTable";
import ObjectFlags from "../../api/objects/flags";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import StandardPage from "../../components/StandardPage";

/** @TODO (future) move each to their own file? */
const types = {
  helmets: {
    title: 'Helmets',
    filter: ({ attributes }) => (attributes||{}).BodyPosition === 1,
    typeColumns: getArmorColumns(),
  },
  amulets: {
    title: 'Amulets',
    filter: ({ attributes }) => (attributes||{}).BodyPosition === 2,
    typeColumns: getAmuletColumns(),
  },
  armors: {
    title: 'Armors',
    filter: ({ attributes }) => (attributes||{}).BodyPosition === 4,
    typeColumns: getArmorColumns(),
  },
  legs: {
    title: 'Legs',
    filter: ({ attributes }) => (attributes||{}).BodyPosition === 7,
    typeColumns: getArmorColumns(),
  },
  boots: {
    title: 'Boots',
    filter: ({ attributes }) => (attributes||{}).BodyPosition === 8,
    typeColumns: getArmorColumns(),
  },
  rings: {
    title: 'Rings',
    filter: ({ attributes }) => (attributes||{}).BodyPosition === 9,
    typeColumns: getRingColumns(),
  },
  axes: {
    title: 'Axes',
    filter: ({ attributes }) => (attributes||{}).WeaponType === 3,
    typeColumns: getWeaponColumns(),
  },
  clubs: {
    title: 'Clubs',
    filter: ({ attributes }) => (attributes||{}).WeaponType === 2,
    typeColumns: getWeaponColumns(),
  },
  swords: {
    title: 'Swords',
    filter: ({ attributes }) => (attributes||{}).WeaponType === 1,
    typeColumns: getWeaponColumns(),
  },
  wands: {
    title: 'Wands',
    filter: ({ attributes }) => (attributes||{}).Professions === 8,
    typeColumns: getWandAndRodColumns(),
  },
  rods: {
    title: 'Rods',
    filter: ({ attributes }) => (attributes||{}).Professions === 16,
    typeColumns: getWandAndRodColumns(),
  },
  bows: {
    title: 'Bows',
    filter: ({ flags }) => (flags||[]).includes(ObjectFlags.Bow),
    typeColumns: getBowsColumns(),
  },
  ammo: {
    title: 'Ammo',
    filter: ({ flags }) => (flags||[]).includes(ObjectFlags.Ammo),
    typeColumns: getAmmoColumns(),
  },
  throwables: {
    title: 'Throwables',
    filter: ({ flags }) => (flags||[]).includes(ObjectFlags.Throw),
    typeColumns: getThrowableColumns(),
  },
  shields: {
    title: 'Shields',
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

  const [typeSettings, setTypeSettings] = useState();

  useEffect(() => {
    const typeSettings = types[type];
    if (!typeSettings) return;

    setTypeSettings(typeSettings);
  }, [type]);

  /** @TODO (future) show a loading wheel */
  if (!typeSettings) return <>Loading...</>;
  
  const data = database.objects.filter(typeSettings.filter);

  return (
    <StandardPage title={typeSettings.title}>
      <ObjectsTable data={data} typeColumns={typeSettings.typeColumns} />
    </StandardPage>
  );

}

import Image from 'next/image';
import CellItems from './CellItems';
import { getTibiaMapsUrl } from '../../utils/TibiaMaps';
import { round } from '../../utils/Math';
import ObjectFlags from '../../api/objects/flags';
import ObjectAttributes from '../../api/objects/attributes';

/**
 * 
 * @param {import('@mui/x-data-grid').GridColDef[]} typeColumns The columns specific for the object type.
 * @returns {import('@mui/x-data-grid').GridColDef[]} All the object columns for the table.
 */
export default function getObjectColumns(typeColumns = []) {

  return [
    {
      field: "id", headerName: "Image", renderCell: (params) => (
        <Image src={`/images/${params.row.id}.gif`} alt={params.row.id} width={32} height={32} />
      )
    },
    { field: "name", headerName: "Name", width: 130 },

    
    ...typeColumns,
    
    /** Uncomment this to see all attributes and flags of all objects (test purposes) */
    // { field: "attributes", headerName: "Attributes", flex: 1, valueGetter: (params) => Object.entries(params.row.attributes).map(([key, value]) => `${key}: ${value}`).join(', ') },
    // { field: "flags", headerName: "Flags", flex: 1, valueGetter: (params) => params.row.flags.join(', ') },

    { field: "weight", headerName: "Weight (oz)", valueGetter: (params) => params.row.attributes.Weight / 100 },
    {
      field: "dropFrom", headerName: "Drop from", flex: 1, valueGetter: (params) => params.row.dropFrom.sort((a, b) => a.rate - b.rate),
      renderCell: (params) => {
        const drops = params.row.dropFrom.map(drop => ({ label: drop.creature.name, link: { path: `/creatures/${drop.creature.id}` }, value: `${round((drop.rate + 1) / 10, 3)}%` }));
        return <CellItems items={drops} />;
      }
    },
    {
      field: "buyFrom", headerName: "Buy from", flex: 1, valueGetter: (params) => params.row.buyFrom.sort((a, b) => a.price - b.price),
      renderCell: (params) => {
        const offers = params.row.buyFrom.map(offer => ({ label: offer.npc.name, link: { path: `/npcs/${offer.npc.id}` }, value: offer.price }));
        return <CellItems items={offers} />;
      }
    },
    {
      field: "sellTo", headerName: "Sell to", flex: 1, valueGetter: (params) => params.row.sellTo.sort((a, b) => a.price - b.price),
      renderCell: (params) => {
        const offers = params.row.sellTo.map(offer => ({ label: offer.npc.name, link: { path: `/npcs/${offer.npc.id}` }, value: offer.price }));
        return <CellItems items={offers} />;
      }
    },
    {
      field: "quests", headerName: "Quests", flex: 1, valueGetter: (params) => params.row.questRewards,
      renderCell: (params) => {
        const quests = params.row.questRewards.map(questReward => {
          if (questReward.npc) return { label: questReward.npc.name, path: `/npcs/${questReward.npc.id}` };
          if (questReward.chest) return { label: `map`, link: { path: getTibiaMapsUrl(questReward.chest.coordinates), newTab: true } };
          return null;
        });
        return <CellItems items={quests} />;
      }
    },
  ]

}

/**
 * 
 * @returns {import('@mui/x-data-grid').GridColDef[]} Relevant columns for this type of object.
 */
export const getWeaponColumns = () => {
  const twoHandedBodyPositionId = 0;
  return [
    { field: "attack", headerName: "Attack", valueGetter: (params) => params.row.attributes.WeaponAttackValue },
    { field: "defense", headerName: "Defense", valueGetter: (params) => params.row.attributes.WeaponDefendValue },
    {
      field: "notes", headerName: "Notes", valueGetter: (params) => {
        const flags = params.row.flags;
        const attributes = params.row.attributes;
        const notes = [];
        if (attributes.BodyPosition === twoHandedBodyPositionId) notes.push(`2 handed`);
        if (flags.includes(ObjectFlags.WearOut) || flags.includes(ObjectFlags.Expire)) {
          if (attributes.TotalExpireTime) notes.push(`Expires in ${attributes.TotalExpireTime} seconds`);
          if (attributes.TotalUses) notes.push(`Breaks after ${attributes.TotalUses} use(s)`);
        }
        return notes.join(', ');
      }
    },
  ];
}

/**
 * 
 * @returns {import('@mui/x-data-grid').GridColDef[]} Relevant columns for this type of object.
 */
export const getArmorColumns = () => {
  return [
    { field: "armor", headerName: "Armor", valueGetter: (params) => params.row.attributes.ArmorValue },
  ];
}

/**
 * 
 * @returns {import('@mui/x-data-grid').GridColDef[]} Relevant columns for this type of object.
 */
export const getWandAndRodColumns = () => {
  return [
    { field: "minimumLevel", headerName: "Min. Level", valueGetter: (params) => params.row.attributes.MinimumLevel },
    { field: "vocation", headerName: "Vocation", valueGetter: (params) => ObjectAttributes.Professions.values[params.row.attributes.Professions] },
    { field: "range", headerName: "Range", valueGetter: (params) => params.row.attributes.WandRange },
    { field: "manaConsumption", headerName: "Mana", valueGetter: (params) => params.row.attributes.WandManaConsumption },
    { field: "strength", headerName: "Strength", valueGetter: (params) => params.row.attributes.WandAttackStrength },
    { field: "damageType", headerName: "Damage type", valueGetter: (params) => ObjectAttributes.WandDamageType.values[params.row.attributes.WandDamageType] },
  ];
}

/**
 * 
 * @returns {import('@mui/x-data-grid').GridColDef[]} Relevant columns for this type of object.
 */
export const getBowsColumns = () => {
  return [
    { field: "range", headerName: "Range", valueGetter: (params) => params.row.attributes.BowRange },
    { field: "ammo", headerName: "Ammo type", valueGetter: (params) => ObjectAttributes.BowAmmoType.values[params.row.attributes.BowAmmoType] },
  ];
}

/**
 * 
 * @returns {import('@mui/x-data-grid').GridColDef[]} Relevant columns for this type of object.
 */
export const getAmmoColumns = () => {
  return [
    { field: "type", headerName: "AmmoType", valueGetter: (params) => ObjectAttributes.AmmoType.values[params.row.attributes.AmmoType] },
    { field: "attack", headerName: "Attack", valueGetter: (params) => params.row.attributes.AmmoAttackValue },
    { field: "specialEffect", headerName: "Effect", valueGetter: (params) => ObjectAttributes.AmmoSpecialEffect.values[params.row.attributes.AmmoSpecialEffect] },
  ];
}

/**
 * 
 * @returns {import('@mui/x-data-grid').GridColDef[]} Relevant columns for this type of object.
 */
export const getThrowableColumns = () => {
  return [
    { field: "range", headerName: "Range", valueGetter: (params) => params.row.attributes.ThrowRange },
    { field: "attack", headerName: "Attack", valueGetter: (params) => params.row.attributes.ThrowAttackValue },
    { field: "breakChance", headerName: "Break chance", valueGetter: (params) => `${params.row.attributes.ThrowFragility}%` },
  ];
}

/**
 * 
 * @returns {import('@mui/x-data-grid').GridColDef[]} Relevant columns for this type of object.
 */
export const getShieldColumns = () => {
  return [
    { field: "defense", headerName: "Defense", valueGetter: (params) => params.row.attributes.ShieldDefendValue },
  ];
}

/**
 * 
 * @returns {import('@mui/x-data-grid').GridColDef[]} Relevant columns for this type of object.
 */
export const getAmuletColumns = () => {
  return [
    /** @TODO figure out the values for ProtectionDamageTypes */
    // { field: "protection", headerName: "Protection", valueGetter: (params) => params.row.attributes.ProtectionDamageTypes ? ObjectAttributes.ProtectionDamageTypes.values[params.row.attributes.ProtectionDamageTypes] : '' },
    { field: "damageReduction", headerName: "Damage reduction", valueGetter: (params) => params.row.attributes.DamageReduction ? `${params.row.attributes.DamageReduction}%` : '' },
    { field: "uses", headerName: "Uses", valueGetter: (params) => params.row.attributes.TotalUses ? params.row.attributes.TotalUses : '' },
  ];
}

/**
 * 
 * @returns {import('@mui/x-data-grid').GridColDef[]} Relevant columns for this type of object.
 */
export const getRingColumns = () => {
  return [
    /** @TODO figure out the values for ProtectionDamageTypes */
    // { field: "protection", headerName: "Protection", valueGetter: (params) => params.row.attributes.ProtectionDamageTypes ? ObjectAttributes.ProtectionDamageTypes.values[params.row.attributes.ProtectionDamageTypes] : '' },
    /** @TODO move this to a column called "effect" or similar */
    // { field: "damageReduction", headerName: "Damage reduction", valueGetter: (params) => params.row.attributes.DamageReduction ? `${params.row.attributes.DamageReduction}%` : '' },
    { field: "uses", headerName: "Uses", valueGetter: (params) => params.row.attributes.TotalUses ? params.row.attributes.TotalUses : '' },
    { field: "expiration", headerName: "Expiration", valueGetter: (params) => params.row.attributes.TotalExpireTime ? `${params.row.attributes.TotalExpireTime} seconds` : '' },
    /** @TODO figure out the values for SkillModification */
    // { field: "skillBoost", headerName: "Skill boost", valueGetter: (params) => params.row.flags.includes(ObjectFlags.SkillBoost) ? `${params.row.attributes.SkillModification > 1 ? `${params.row.attributes.SkillModification} ` : ''}${ObjectAttributes.SkillModification.values[params.row.attributes.SkillModification]}` : '' },
  ];
}

// const objectTypes = [
//   ObjectFlags.Weapon,
//   ObjectFlags.Clothes, // means 2 handed weapons too
//   ObjectFlags.Armor,
//   ObjectFlags.SkillBoost,

//   ObjectFlags.Throw,
//   ObjectFlags.Expire,
//   ObjectFlags.Key,
//   ObjectFlags.WearOut,
//   ObjectFlags.Protection,
//   ObjectFlags.Wand,
//   ObjectFlags.Rune,
//   ObjectFlags.Ammo,
//   ObjectFlags.Shield,
//   ObjectFlags.Bow,
// ];
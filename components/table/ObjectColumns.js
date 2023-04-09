import Image from 'next/image';
import CellItems from './CellItems';
import { round } from '../../utils/Math';
import { largeCoordinatesToAutomapCoordinates } from '../../utils/TibiaMaps';
import { getTibiaWikiUrl } from '../../utils/TibiaWiki';
import ObjectFlags from '../../api/objects/flags';
import ObjectAttributes from '../../api/objects/attributes';
import { Link } from "@mui/material";
import PageLink from "next/link";

/**
 * @TODO (future) each type columns should be its own file
 */

/**
 * 
 * @param {import('@mui/x-data-grid').GridColDef[]} typeColumns The columns specific for the object type.
 * @returns {import('@mui/x-data-grid').GridColDef[]} All the object columns for the table.
 */
export default function getObjectColumns(typeColumns = []) {

  return [
    {
      field: "id", headerName: "Image", renderCell: (params) => (
        <Image src={`/images/sprites/${params.row.id}.gif`} alt={params.row.id} width={32} height={32} />
      )
    },
    {
      field: "name", headerName: "Name", width: 130,
      renderCell: (params) => (
        <Link
          component={PageLink}
          href={`/item/${params.row.id}`}
        >
          {params.row.name}
        </Link>
      )
    },

    ...typeColumns,

    { field: "attributes", headerName: "Attributes", flex: 1, valueGetter: (params) => Object.entries(params.row.attributes||{}).map(([key, value]) => `${key}: ${value}`).join(', ') },
    { field: "flags", headerName: "Flags", flex: 1, valueGetter: (params) => (params.row.flags||[]).join(', ') },

    { field: "weight", headerName: "Weight (oz)", valueGetter: (params) => (params.row.attributes||{Weight:0}).Weight / 100 },
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
        /** @TODO (future) use this line instead once the NPCs page is implemented */
        // const offers = params.row.buyFrom.map(offer => ({ label: offer.npc.name, link: { path: `/npcs/${offer.npc.id}` }, value: offer.price }));
        const offers = params.row.buyFrom.map(offer => ({ label: offer.npc.name, link: { path: getTibiaWikiUrl(offer.npc.name), newTab: true }, value: offer.price }));
        return <CellItems items={offers} />;
      }
    },
    {
      field: "sellTo", headerName: "Sell to", flex: 1, valueGetter: (params) => params.row.sellTo.sort((a, b) => a.price - b.price),
      renderCell: (params) => {
        /** @TODO (future) use this line instead once the NPCs page is implemented */
        // const offers = params.row.sellTo.map(offer => ({ label: offer.npc.name, link: { path: `/npcs/${offer.npc.id}` }, value: offer.price }));
        const offers = params.row.sellTo.map(offer => ({ label: offer.npc.name, link: { path: getTibiaWikiUrl(offer.npc.name), newTab: true }, value: offer.price }));
        return <CellItems items={offers} />;
      }
    },
    {
      field: "quests", headerName: "Quests", flex: 1, valueGetter: (params) => params.row.questRewards,
      renderCell: (params) => {
        const quests = params.row.questRewards.map(questReward => {
          /** @TODO (future) use this line instead once the NPCs page is implemented */
          // if (questReward.npc) return { label: questReward.npc.name, link: { path: `/npcs/${questReward.npc.id}` } };
          if (questReward.npc) return { label: questReward.npc.name, link: { path: getTibiaWikiUrl(questReward.npc.name), newTab: true } };
          if (questReward.chest) return { label: `map`, link: { path: `/map?at=${largeCoordinatesToAutomapCoordinates(questReward.chest.coordinates)}`} };
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
    { field: "type", headerName: "Type", valueGetter: (params) => ObjectAttributes.WeaponType.values[params.row.attributes.WeaponType] },
    {
      field: "notes", headerName: "Notes", valueGetter: (params) => {
        const flags = params.row.flags;
        const { TotalExpireTime, TotalUses } = flags;
        const { BodyPosition } = params.row.attributes;
        const notes = [];
        if (BodyPosition === twoHandedBodyPositionId) notes.push(`2 handed`);
        if (flags.includes(ObjectFlags.WearOut) || flags.includes(ObjectFlags.Expire)) {
          if (TotalExpireTime) notes.push(`Expires in ${TotalExpireTime} seconds`);
          if (TotalUses) notes.push(`Breaks after ${TotalUses} use(s)`);
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
    { field: "attack", headerName: "Attack", valueGetter: (params) => params.row.attributes.AmmoAttackValue },
    { field: "type", headerName: "Type", valueGetter: (params) => ObjectAttributes.AmmoType.values[params.row.attributes.AmmoType] },
    { field: "specialEffect", headerName: "Effect", valueGetter: (params) => ObjectAttributes.AmmoSpecialEffect.values[params.row.attributes.AmmoSpecialEffect] },
  ];
}

/**
 * 
 * @returns {import('@mui/x-data-grid').GridColDef[]} Relevant columns for this type of object.
 */
export const getThrowableColumns = () => {
  return [
    { field: "attack", headerName: "Attack", valueGetter: (params) => params.row.attributes.ThrowAttackValue },
    { field: "range", headerName: "Range", valueGetter: (params) => params.row.attributes.ThrowRange },
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
    {
      field: "effects", headerName: "Effects", flex: 1, valueGetter: (params) => {
        const { DamageReduction, ProtectionDamageTypes, ArmorValue } = params.row.attributes;
        if (DamageReduction) {
          const protectionType = ObjectAttributes.ProtectionDamageTypes.values[ProtectionDamageTypes] || ProtectionDamageTypes;
          if (!protectionType) return '';
          return `+${DamageReduction}% ${protectionType} protection`;
        } else if (ArmorValue) {
          return `+${ArmorValue} armor`;
        }
        return '';
      }
    },
    { field: "uses", headerName: "Uses", valueGetter: (params) => params.row.attributes.TotalUses ? params.row.attributes.TotalUses : '' },
  ];
}

/**
 * 
 * @returns {import('@mui/x-data-grid').GridColDef[]} Relevant columns for this type of object.
 */
export const getRingColumns = () => {
  return [
    {
      field: "effects", headerName: "Effects", flex: 1, valueGetter: (params) => {
        const { DamageReduction, ProtectionDamageTypes, SkillModification, SkillNumber } = params.row.attributes;
        if (DamageReduction) {
          const protectionType = ObjectAttributes.ProtectionDamageTypes.values[ProtectionDamageTypes] || ProtectionDamageTypes;
          if (!protectionType) return '';
          return `+${DamageReduction}% ${protectionType} protection`;
        } else if (SkillModification) {
          /** @TODO (future) figure out why life ring is SkillModification = 3, and ring of healing is SkillModification: 1 */
          return `${SkillModification > 1 ? `+${SkillModification} ` : ''}${ObjectAttributes.SkillNumber.values[SkillNumber]}`;
        }
        return '';
      }
    },
    { field: "uses", headerName: "Uses", valueGetter: (params) => params.row.attributes.TotalUses ? params.row.attributes.TotalUses : '' },
    { field: "expiration", headerName: "Expiration", valueGetter: (params) => params.row.attributes.TotalExpireTime ? `${params.row.attributes.TotalExpireTime} seconds` : '' },
  ];
}


/**
 * 
 * @returns {import('@mui/x-data-grid').GridColDef[]} Relevant columns for this type of object.
 */
export const getFoodColumns = () => {
  return [
    { field: "nutrition", headerName: "Nutrition", valueGetter: (params) => params.row.attributes.Nutrition },
    { field: "weightNutritionRatio", headerName: "Weight x nutrition ratio", valueGetter: (params) => round(params.row.attributes.Nutrition / params.row.attributes.Weight, 2) },
    { field: "cumulative", headerName: "Cumulative", valueGetter: (params) => params.row.flags.Cumulative ? 'Yes' : 'No' },
  ];
}
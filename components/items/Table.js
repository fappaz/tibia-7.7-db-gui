import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Image from "next/image";
import PageLink from "next/link";
import React from "react";
import CellItems from "../table/CellItems";
import { Link, Tooltip } from "@mui/material";
import i18n from "../../api/i18n";
import attributes from "../../api/objects/attributes";
import flags from "../../api/objects/flags";
import { types, subtypes } from "../../api/objects/types";
import { getTibiaWikiUrl } from "../../utils/TibiaWiki";
import { round } from "../../utils/Math";
import { get } from "lodash";
import { insertArrayAt } from "../../utils/Array";


/** specific */
const context = 'items';
const getColumnHeaderI18n = (field) => i18n.t(`${context}.table.columns.${field}.header`);
const getValueI18n = (field, variables = {}) => i18n.t([`${context}.table.columns.${field}.value`, `${context}.attributes.${field}.values.${variables?.value}`, field], variables);

/**
 * @typedef {Object.<string, import("@mui/x-data-grid").ColDef>} ColumnModel
 */
export const columnModel = {
  /** specific */
  sprite: {
    field: "sprite", headerName: getColumnHeaderI18n("sprite"),
    renderCell: (params) => (
      <Image src={`/images/sprites/objects/${params.row.id}.gif`} alt={params.row.name} width={32} height={32} />
    )
  },

  name: {
    field: "name", headerName: getColumnHeaderI18n('name'), width: 130,
    renderCell: (params) => (
      <Link
        component={PageLink}
        href={`/item/${params.row.id}`}
      >
        {params.row.name}
      </Link>
    )
  },

  id: { field: "id", headerName: getColumnHeaderI18n('id') },
  
  attributes: { field: "attributes", headerName: getColumnHeaderI18n('attributes'), flex: 1, valueGetter: (params) => Object.entries(params.row.attributes || {}).map(([key, value]) => `${key}: ${value}`).join(', ') },
  
  flags: { field: "flags", headerName: getColumnHeaderI18n('flags'), flex: 1, valueGetter: (params) => (params.row.flags || []).join(', ') },
  
  weight: { 
    field: "weight", headerName: getColumnHeaderI18n('weight'), valueGetter: (params) => (params.row.attributes || { Weight: 0 }).Weight / 100,
    renderCell: (params) => getValueI18n('weight', { value: params.value }),
  },
  
  dropFrom: {
    field: "dropFrom", headerName: getColumnHeaderI18n('dropFrom'), flex: 1, valueGetter: (params) => params.row.dropFrom.sort((a, b) => a.rate - b.rate),
    renderCell: (params) => {
      const drops = params.row.dropFrom.map(drop => ({
        label: drop.creature.name, 
        link: {
          path: `/creatures/${drop.creature.id}`
        },
        value: getValueI18n('dropFrom', { value: round((drop.rate + 1) / 10, 3) }),
      }));
      return <CellItems items={drops} />;
    }
  },
  
  buyFrom: {
    field: "buyFrom", headerName: getColumnHeaderI18n('buyFrom'), flex: 1, valueGetter: (params) => params.row.buyFrom.sort((a, b) => a.price - b.price),
    renderCell: (params) => {
      /** @TODO (future) use this line instead once the NPCs page is implemented */
      // const offers = params.row.buyFrom.map(offer => ({ label: offer.npc.name, link: { path: `/npcs/${offer.npc.id}` }, value: offer.price }));
      const offers = params.row.buyFrom.map(offer => ({ label: offer.npc.name, link: { path: getTibiaWikiUrl(offer.npc.name), newTab: true }, value: offer.price }));
      return <CellItems items={offers} />;
    }
  },
  
  sellTo: {
    field: "sellTo", headerName: getColumnHeaderI18n('sellTo'), flex: 1, valueGetter: (params) => params.row.sellTo.sort((a, b) => a.price - b.price),
    renderCell: (params) => {
      /** @TODO (future) use this line instead once the NPCs page is implemented */
      // const offers = params.row.sellTo.map(offer => ({ label: offer.npc.name, link: { path: `/npcs/${offer.npc.id}` }, value: offer.price }));
      const offers = params.row.sellTo.map(offer => ({ label: offer.npc.name, link: { path: getTibiaWikiUrl(offer.npc.name), newTab: true }, value: offer.price }));
      return <CellItems items={offers} />;
    }
  },
  
  quests: {
    field: "quests", headerName: getColumnHeaderI18n('quests'), flex: 1, valueGetter: (params) => params.row.questRewards,
    renderCell: (params) => {
      const quests = params.row.questRewards.map(questReward => {
        /** @TODO (future) use this line instead once the NPCs page is implemented */
        // if (questReward.npc) return { label: questReward.npc.name, link: { path: `/npcs/${questReward.npc.id}` } };
        if (questReward.npc) return { label: questReward.npc.name, link: { path: getTibiaWikiUrl(questReward.npc.name), newTab: true } };
        if (questReward.chest) return { label: `map`, link: { path: `/map?at=${questReward.chest.coordinates}` } };
        return null;
      });
      return <CellItems items={quests} />;
    }
  },

  /** Columns for weapons (WeaponType > 0) */
  attack: { field: "attack", headerName: getColumnHeaderI18n('attack'), valueGetter: (params) => params.row.attributes.WeaponAttackValue },
  defense: { field: "defense", headerName: getColumnHeaderI18n('defense'), valueGetter: (params) => params.row.attributes.WeaponDefendValue },
  weaponType: { field: "weaponType", headerName: getColumnHeaderI18n('weaponType'), valueGetter: (params) => i18n.t(`items.attributes.WeaponType.values.${params.row.attributes.WeaponType}`) },
  isTwoHanded: { field: "isTwoHanded", headerName: getColumnHeaderI18n('isTwoHanded'), valueGetter: (params) => params.row.attributes.BodyPosition === 0 ? i18n.t('yes') : '' },
  expireOrUses: { field: "expireOrUses", headerName: getColumnHeaderI18n('expireOrUses'), valueGetter: (params) => {
    const attributes = get(params, 'row.attributes', {});
    const { TotalExpireTime = 0, TotalUses = 0 } = attributes; 
    if (TotalExpireTime > 0) return i18n.t(`items.attributes.TotalExpireTime.value`, { value: TotalExpireTime, timeUnit: i18n.t('timeUnits.seconds') });  
    if (TotalUses > 0) return i18n.t(`items.attributes.TotalUses.value`, { value: TotalUses });  
    return '';
  }},
  weaponNotes: { field: "weaponNotes", headerName: getColumnHeaderI18n('notes'), valueGetter: (params) => {
    const notes = [];
    const attributes = get(params, 'row.attributes', {});
    const { BodyPosition = 0, TotalExpireTime = 0, TotalUses = 0 } = attributes; 
    if (BodyPosition === 0) notes.push(i18n.t('items.attributes.BodyPosition.values.0'));
    if (TotalExpireTime > 0) notes.push(i18n.t(`items.attributes.TotalExpireTime.value`, { value: TotalExpireTime, timeUnit: i18n.t('timeUnits.seconds') }));  
    if (TotalUses > 0) notes.push(i18n.t(`items.attributes.TotalUses.value`, { value: TotalUses }));
    return notes.join(', ');
  }},

  /** Columns for wands and rods (WandRange > 0) */
  minimumLevel: { field: "minimumLevel", headerName: getColumnHeaderI18n('minimumLevel'), valueGetter: (params) => params.row.attributes.MinimumLevel },
  vocation: { field: "vocation", headerName: getColumnHeaderI18n('vocation'), valueGetter: (params) => i18n.t(`items.attributes.Professions.values.${params.row.attributes.Professions}`) },
  wandRange: { field: "wandRange", headerName: getColumnHeaderI18n('wandRange'), valueGetter: (params) => params.row.attributes.WandRange, renderCell: (params) => getValueI18n('wandRange', { value: params.value }) },
  wandManaConsumption: { field: "wandManaConsumption", headerName: getColumnHeaderI18n('wandManaConsumption'), valueGetter: (params) => params.row.attributes.WandManaConsumption },
  wandAttackStrength: { field: "wandAttackStrength", headerName: getColumnHeaderI18n('wandAttackStrength'), valueGetter: (params) => params.row.attributes.WandAttackStrength },
  wandDamageType: { field: "wandDamageType", headerName: getColumnHeaderI18n('wandDamageType'), valueGetter: (params) => i18n.t(`items.attributes.WandDamageType.values.${params.row.attributes.WandDamageType}`) },

  /** Columns for distance weapons (BowRange or BowAmmoType > 0 ) */
  bowRange: { field: "bowRange", headerName: getColumnHeaderI18n('bowRange'), valueGetter: (params) => params.row.attributes.BowRange, renderCell: (params) => getValueI18n('bowRange', { value: params.value } )  },
  bowAmmo: { field: "bowAmmo", headerName: getColumnHeaderI18n('bowAmmo'), valueGetter: (params) => i18n.t(`items.attributes.BowAmmoType.values.${params.row.attributes.BowAmmoType}`) },

  /** Columns for shields (flag === Shield) */
  shieldDefense: { field: "shieldDefense", headerName: getColumnHeaderI18n('shieldDefense'), valueGetter: (params) => params.row.attributes.ShieldDefendValue },

  /** Columns for armor items (ArmorValue > 0 && BodyPosition > 0) */
  armor: { field: "armor", headerName: getColumnHeaderI18n('armor'), valueGetter: (params) => params.row.attributes.ArmorValue },
  bodyPosition: { field: "bodyPosition", headerName: getColumnHeaderI18n('bodyPosition'), valueGetter: (params) => {
    const { BodyPosition = -1 } = get(params, 'row.attributes', {});
    if (BodyPosition >= 0) return i18n.t(`items.attributes.BodyPosition.values.${params.row.attributes.BodyPosition}`);
    const itemFlags = get(params, 'row.flags', []);
    if (itemFlags.includes(flags.Shield)) return i18n.t('items.flags.Shield');
    if (itemFlags.includes(flags.Weapon)) return i18n.t('items.flags.Weapon');
    return '';
   }},

  /** Columns for amulets (BodyPosition === 2) and rings (BodyPosition === 9) */
  effects: {
    field: "effects", headerName: getColumnHeaderI18n('effects'), flex: 1, valueGetter: (params) => {
      const effects = [];
      const attributes = get(params, 'row.attributes', {});
      const { DamageReduction = 0, ProtectionDamageTypes = 0, ArmorValue = 0, SkillModification = 0, SkillNumber = 0 } = attributes;
      if (DamageReduction) {
        const protectionType = i18n.t([`items.attributes.ProtectionDamageTypes.values.${ProtectionDamageTypes}`, `${ProtectionDamageTypes}`]);
        if (!protectionType) return '';
        effects.push(getValueI18n('effectDamageReduction', { value: DamageReduction, type: protectionType }));
      } 
      
      if (ArmorValue) effects.push(getValueI18n('effectArmor', { value: ArmorValue }));
      
      if (SkillModification) {
        const sign = SkillModification > 1 ? '+' : '';
        /** @TODO (future) figure out why life ring is SkillModification = 3, and ring of healing is SkillModification: 1 */
        const value = SkillModification > 1 ? SkillModification : '';
        const skill = i18n.t([`items.attributes.SkillNumber.values.${SkillNumber}`, `${SkillNumber}`]);
        effects.push(getValueI18n('skillModification', { sign, value, skill }));
      }
      
      return effects.join(', ');
    }
  },
  uses: { field: "uses", headerName: getColumnHeaderI18n('uses'), valueGetter: (params) => params.row.attributes.TotalUses ||  '' },
  expire: { field: "expire", headerName: getColumnHeaderI18n('expire'), valueGetter: (params) => params.row.attributes.TotalExpireTime, renderCell: params => params.value ? getValueI18n('expire', { value: params.value, timeUnit: i18n.t('timeUnits.seconds') }) : '' },

  /** Columns for ammo (AmmoType > 0) */
  ammoAttack: { field: "ammoAttack", headerName: getColumnHeaderI18n('ammoAttack'), valueGetter: (params) => params.row.attributes.AmmoAttackValue },
  ammoType: { field: "ammoType", headerName: getColumnHeaderI18n('ammoType'), valueGetter: (params) => i18n.t(`items.attributes.AmmoType.values.${params.row.attributes.AmmoType}`) },
  ammoSpecialEffect: { field: "ammoSpecialEffect", headerName: getColumnHeaderI18n('ammoSpecialEffect'), valueGetter: (params) => i18n.t(`items.attributes.AmmoSpecialEffect.values.${params.row.attributes.AmmoSpecialEffect}`) },

  /** Columns for throwable (ThrowRange > 0) */
  throwableAttack: { field: "throwableAttack", headerName: getColumnHeaderI18n('throwableAttack'), valueGetter: (params) => params.row.attributes.ThrowAttackValue },
  throwableRange: { field: "throwableRange", headerName: getColumnHeaderI18n('throwableRange'), valueGetter: (params) => params.row.attributes.ThrowRange, renderCell: params => getValueI18n('throwableRange', { value: params.value }) },
  throwableBreakChance: { field: "throwableBreakChance", headerName: getColumnHeaderI18n('throwableBreakChance'), valueGetter: (params) => params.row.attributes.ThrowFragility, renderCell: params => getValueI18n('throwableBreakChance', { value: params.value }) },

  /** Columns for food (flag === Food) */
  nutrition: { field: "nutrition", headerName: getColumnHeaderI18n('nutrition'), valueGetter: (params) => params.row.attributes.Nutrition },
  weightNutritionRatio: { field: "weightNutritionRatio", headerName: getColumnHeaderI18n('weightNutritionRatio'), valueGetter: (params) => round(params.row.attributes.Nutrition / params.row.attributes.Weight, 2) },
  cumulative: { field: "cumulative", headerName: getColumnHeaderI18n('cumulative'), valueGetter: (params) => params.row.flags.Cumulative ? t('yes') : t('no') },

  /** @TODO add columns for runes (flag === rune || meaning === 40) */

  /** Columns that depend on variables outside the table, therefore are functions that return columns */
  dropRate: (creatureId) => ({
    field: 'dropRate', headerName: getColumnHeaderI18n('dropRate'),
    valueGetter: (params) => {
      const drop = params.row.dropFrom.find(drop => drop.creature.id === creatureId);
      if (!drop) return 0;
      return round((drop.rate + 1) / 10, 3);
    },
    renderCell: (params) => (
      <Tooltip title={i18n.t(`items.table.columns.dropRate.tooltip`, { count: round(100 / params.value, 0) })}>
        <span>
          {getValueI18n(`dropRate`, { value: params.value })}
        </span>
      </Tooltip>
    ),
  }),
};

/**
 * @type {import("@mui/x-data-grid").ColDef[]} The default columns.
 */
export const defaultColumns = [
  /** specific */
  columnModel.sprite,
  columnModel.name,
  columnModel.bodyPosition,
  columnModel.weight,
  columnModel.dropFrom,
  columnModel.buyFrom,
  columnModel.sellTo,
  columnModel.quests,
  columnModel.attributes,
  columnModel.flags,
];

/**
 * @type {Object.<string, import("@mui/x-data-grid").ColDef[]>} The columns for each item type.
 */
export const columnsByType = {
  [types.ammo.id]: [
    columnModel.ammoAttack,
    columnModel.ammoType,
    columnModel.ammoSpecialEffect,
  ],
  [types.weapons.id]: [
    columnModel.attack,
    columnModel.defense,
    columnModel.weaponType,
    columnModel.weaponNotes,
  ],
  [types.wands.id]: [
    columnModel.minimumLevel,
    columnModel.vocation,
    columnModel.wandRange,
    columnModel.wandManaConsumption,
    columnModel.wandAttackStrength,
    columnModel.wandDamageType,
  ],
  [types.bows.id]: [
    columnModel.bowRange,
    columnModel.bowAmmo,
  ],
  [types.shields.id]: [
    columnModel.shieldDefense,
  ],
  [types.armors.id]: [
    columnModel.armor,
  ],
  [types.amulets.id]: [
    columnModel.effects,
    columnModel.uses,
    columnModel.expire,
  ],
  [types.rings.id]: [
    columnModel.effects,
    columnModel.uses,
    columnModel.expire,
  ],
  [types.throwables.id]: [
    columnModel.throwableAttack,
    columnModel.throwableRange,
    columnModel.throwableBreakChance,
  ],
  [types.food.id]: [
    columnModel.nutrition,
    columnModel.weightNutritionRatio,
    columnModel.cumulative,
  ],
  [types.runes.id]: [],
};

/**
 * @type {import("@mui/x-data-grid").DataGridProps} The default table props.
 */
export const defaultTableProps = {
  /** specific */
  initialState: {
    columns: {
      columnVisibilityModel: {
        id: false,
        attributes: false,
        flags: false,
        bodyPosition: false,
      },
    },
    sorting: {
      sortModel: [{ field: 'name', sort: 'asc' }],
    },
  },
  getRowHeight: () => 'auto',
  slots: {
    toolbar: GridToolbar
  },
  slotProps: {
    toolbar: {
      showQuickFilter: true,
    },
  },
  style: {
    height: '100%',
  }
}

/**
 * Insert an array into another array at a given index. 
 * Useful for when inserting columns into the table after other important default columns.
 * @param {Object[]} [originalColumns] The original columns. Default is the defaultColumns.
 * @param {Object[]} columnsToInsert The columns to be inserted at the given index.
 * @param {Number} index The index to insert the columns at. Default is 2.
 * @returns {Object[]} The new array.
 */
export function getCustomColumns({
  originalColumns = defaultColumns,
  columnsToInsert = [],
  index = 2
} = {}) {
  return insertArrayAt(originalColumns, index, columnsToInsert);
}

/**
 * 
 * @param {Object} props The props.
 * @param {Item[]} props.rows The rows.
 * @param {import("@mui/x-data-grid").ColDef[]} props.columns The columns.
 * @param {import("@mui/x-data-grid").DataGridProps} [props.tableProps] The table props.
 * @returns {import("react").ReactNode}
 */
export default function Table({
  rows = [],
  columns = defaultColumns,
  tableProps = defaultTableProps,
} = {}) {

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      {...tableProps}
    />
  );
}

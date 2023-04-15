import flags from "./flags";

export const types = {
  ammo: {
    id: 'ammo',
    filter: (item) => (item.attributes?.AmmoType || 0) > 0,
  },
  amulets: {
    id: 'amulets',
    filter: (item) => item.attributes?.BodyPosition === 2,
  },
  armors: {
    id: 'armors',
    filter: (item) => [1,4,7,8].includes(item.attributes?.BodyPosition),
  },
  bows: {
    id: 'bows',
    filter: (item) => (item.attributes?.BowRange || 0) > 0,
  },
  food: {
    id: 'food',
    filter: (item) => (item.flags || []).includes(flags.Food),
  },
  rings: {
    id: 'rings',
    filter: (item) => item.attributes?.BodyPosition === 9,
  },
  runes: {
    id: 'runes',
    /** @TODO (future) creature a constant for meanings (e.g.: Meaning 40 = blank rune) */
    filter: (item) => (item.flags || []).includes(flags.Rune) || item.attributes?.Meaning === 40, 
  },
  shields: {
    id: 'shields',
    filter: (item) => (item.flags || []).includes(flags.Shield),
  },
  throwables: {
    id: 'throwables',
    filter: (item) => (item.attributes?.ThrowRange || 0) > 0,
  },
  wands: {
    id: 'wands',
    filter: (item) => (item.attributes?.WandRange || 0) > 0,
  },
  weapons: {
    id: 'weapons',
    filter: (item) => (item.attributes?.WeaponType || 0) > 0,
  },
};

export const subtypes = {
  axes: {
    id: 'axes',
    filter: (item) => item.attributes?.WeaponType === 3,
  },
  armors: {
    id: 'armors',
    filter: (item) => item.attributes?.BodyPosition === 4,
  },
  boots: {
    id: 'boots',
    filter: (item) => item.attributes?.BodyPosition === 8,
  },
  clubs: {
    id: 'clubs',
    filter: (item) => item.attributes?.WeaponType === 2,
  },
  helmets: {
    id: 'helmets',
    filter: (item) => item.attributes?.BodyPosition === 1,
  },
  legs: {
    id: 'legs',
    filter: (item) => item.attributes?.BodyPosition === 7,
  },
  swords: {
    id: 'swords',
    filter: (item) => item.attributes?.WeaponType === 1,
  },
  rods: {
    id: 'rods',
    filter: (item) => (item.attributes?.WandRange || 0) > 0 && item.attributes?.Professions === 16,
  },
  wands: {
    id: 'wands',
    filter: (item) => (item.attributes?.WandRange || 0) > 0 && item.attributes?.Professions === 8,
  },
};

export function getItemTypeId(item) {
  const type = Object.values(types).find((type) => type.filter(item));
  return type?.id;
}

export function getItemSubtypeId(item) {
  const subtype = Object.values(subtypes).find((type) => type.filter(item));
  return subtype?.id;
}
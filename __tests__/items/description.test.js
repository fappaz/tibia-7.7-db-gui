import { getItemDescription } from "../../api/objects/description";

describe('description', () => {

  const assertions = [
    {
      description: 'should return description for an armor item',
      expected: 'You see a crown helmet (Arm:7).\nIt weighs 29.50 oz.',
      item: {
        name: 'crown helmet',
        article: 'a',
        attributes: {
          ArmorValue: 7,
          Weight: 2950,
        },
        flags: [],
      },
    },
    {
      description: 'should return description for a shield',
      expected: 'You see a dwarven shield (Def:26).\nIt weighs 55.00 oz.',
      item: {
        name: 'dwarven shield',
        article: 'a',
        attributes: {
          ShieldDefendValue: 26,
          Weight: 5500,
        },
        flags: [],
      },
    },
    {
      description: 'should return description for a weapon item',
      expected: 'You see an axe (Atk:12 Def:6).\nIt weighs 40.00 oz.',
      item: {
        name: 'axe',
        article: 'an',
        attributes: {
          WeaponAttackValue: 12,
          WeaponDefendValue: 6,
          Weight: 4000,
        },
        flags: [],
      },
    },
    {
      description: 'should return description for a bag container',
      expected: 'You see a backpack (Vol:20).\nIt weighs 18.00 oz.',
      item: {
        name: 'backpack',
        article: 'a',
        attributes: {
          Capacity: 20,
          Weight: 1800,
        },
        flags: [],
      },
    },
    {
      description: 'should return description for a wand',
      expected: 'You see a wand of inferno.\nIt can only be wielded by sorcerers of level 33 or higher.\nIt weighs 30.50 oz.\nIt unleashes the very fires of hell.',
      item: {
        name: 'wand of inferno',
        article: 'a',
        attributes: {
          MinimumLevel: 33,
          Professions: 8,
          Weight: 3050,
        },
        flags: [],
        description: 'It unleashes the very fires of hell',
      },
    },
    {
      description: 'should return description for a brand-new expirable item',
      expected: 'You see an energy ring that is brand-new.\nIt weighs 0.80 oz.',
      item: {
        name: 'energy ring',
        article: 'an',
        attributes: {
          TotalExpireTime: 600,
          Weight: 80,
        },
        flags: [],
      },
    },
    {
      description: 'should return description for an item with charges',
      expected: 'You see a stone skin amulet that has 5 charges left.\nIt weighs 7.00 oz.',
      item: {
        name: 'stone skin amulet',
        article: 'a',
        attributes: {
          TotalUses: 5,
          Weight: 700,
        },
        flags: [],
      },
    },
    {
      description: 'should return description for an item with no article',
      expected: 'You see meat.\nIt weighs 13.00 oz.',
      item: {
        name: 'meat',
        attributes: {
          Weight: 1300,
        },
        flags: [],
      },
    },
    // {
    //   /** Not implemented because it's not necessary for now */
    //   description: 'should return description for an expirable item',
    //   expected: 'You see a ring of healing that has energy for 5 minutes left.\nIt weighs 0.80 oz.',
    //   item: {
    //     name: 'ring of healing',
    //     article: 'a',
    //     attributes: {
    //       TotalExpireTime: 300,
    //       Weight: 80,
    //     },
    //     flags: [],
    //   },
    // },
    // {
    //   /** To be implemented soon */
    //   description: 'should return description for a rune item',
    //   expected: 'You see a spell rune for magic level 15. It\'s an "adori vita vis"-spell (1x).It weighs 1.20 oz.',
    //   item: {
    //     name: 'spell rune',
    //     article: 'a',
    //     attributes: {
    //       TotalExpireTime: 300,
    //       RuneMagicLevel: 15,
    //       RuneSpellName: 'adori vita vis',
    //       RuneChargeCount: 1,
    //       Weight: 120,
    //     },
    //     flags: [],
    //   },
    // },
  ];

  assertions.forEach(({ description, item, expected }) => {
    it(description, () => {
      expect(getItemDescription(item)).toBe(expected);
    });
  });
});
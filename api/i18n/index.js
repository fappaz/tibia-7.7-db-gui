import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const defaultLanguages = {
  "en": {
    translation: {
      appTitle: 'Tibia 7.70 database',
      components: {
        dataGrid: {
          search: 'Search',
          /** @TODO add other i18n, see: https://mui.com/x/react-data-grid/localization/ */
        }
      },
      creatures: {
        flags: {
          SeeInvisible: 'See invisible',
          DistanceFighting: 'Keep distance',
          Unpushable: 'Unpushable',
          KickBoxes: 'Pushes boxes',
          KickCreatures: 'Pushes creatures',
          NoBurning: 'Fire',
          NoPoison: 'Poison',
          NoEnergy: 'Energy',
          NoLifeDrain: 'Life drain',
          NoParalyze: 'Paralyze',
        },
        marker: {
          tooltip: '[{{coordinates}}] {{amount}}x {{- name}} every {{minutes}} minute(s)',
          quickAccessSummary: '{{amount}}x ({{minutes}} min)',
        },
        name: 'Creatures',
        table: {
          columns: {
            id: { header: 'ID', },
            experience: { header: 'Exp', },
            hitpoints: { header: 'HP', },
            attack: { header: 'Attack', },
            defense: { header: 'Defense', },
            armor: { header: 'Armor', },
            drops: { header: 'Drops', },
            summonCost: { header: 'Summon cost', },
            flags: { header: 'Flags', },
            name: { header: 'Name', },
            spawns: { header: 'Spawns', value: '{{amount}} in {{placesCount}} places' },
            sprite: { header: 'Sprite', },
            immunities: { header: 'Immunities' },
            dropRate: { header: 'Drop rate', value: '{{value}}%', tooltip: '1 every {{count}}' },
          }
        }
      },
      items: {
        attributes: {
          AmmoSpecialEffect: {
            label: 'Special effect',
            values: {
              '0': 'Physical',
              '1': 'Poison',
              '2': 'Fire',
            }
          },
          AmmoType: {
            label: 'Type',
            values: {
              '1': 'Bolt',
              '2': 'Arrow',
            }
          },
          BodyPosition: {
            label: 'Body position',
            values: {
              '0': '2 handed',
              '1': 'Helmet',
              '2': 'Amulet',
              '3': 'Bag',
              '4': 'Armor',
              '7': 'Legs',
              '8': 'Boots',
              '9': 'Ring',
            }
          },
          BowAmmoType: {
            id: 'Ammo type',
            values: {
              '1': 'Bolt',
              '2': 'Arrow',
            }
          },
          Professions: {
            label: 'Vocations',
            /** The values are bit flags */
            values: {
              '1': 'no vocation',
              '2': 'knight',
              '4': 'paladin',
              '8': 'sorcerer',
              '16': 'druid',
            }
          },
          ProtectionDamageTypes: {
            id: 'Protection',
            values: {
              '2': 'Poison',
              '4': 'Fire',
              '8': 'Energy',
              '17': 'Physical',
              '256': 'Life drain',
              '287': 'Fire, Energy, Earth, Ice, Holy, Death, Physical',
              '512': 'Mana drain',
            }
          },
          SkillNumber: {
            label: 'Skill',
            /**
             * Values 12, 15, 17, 18, 19, 23 and 24 are missing.
             * Some of them are conditions, such as "Poisoning", "Burning", "Electrified" (and "light"?) - see https://otland.net/threads/7-7-realots-7-7-cipsoft-files-virgin.244562/page-59#post-2707667
             */
            values: {
              '0': 'Experience',
              '1': 'Magic level',
              '2': 'Health',
              '3': 'Mana',
              '4': 'Move speed',
              '5': 'Capacity',
              '6': 'Shielding',
              '7': 'Distance fighting',
              '8': 'Sword fighting',
              '9': 'Club fighting',
              '10': 'Axe fighting',
              '11': 'Fist fighting',
              '14': 'Regeneration',
              '16': 'Stealth', // maybe Illusion is the proper term
              '20': 'Anti-drunk',
              '21': 'Mana shield',
              '22': 'Soul',
            }
          },
          TotalExpireTime: {
            label: 'Expire time',
            value: 'Expires in {{value}} {{timeUnit}}',
          },
          TotalUses: {
            label: 'Uses',
            value: 'Breaks after {{value}} use(s)',
          },
          WandDamageType: {
            label: 'Element',
            values: {
              '2': 'Earth',
              '4': 'Fire',
              '8': 'Energy',
            }
          },
          WeaponType: {
            label: 'Weapon type',
            values: {
              '1': 'Sword',
              '2': 'Club',
              '3': 'Axe',
            }
          },
        },
        flags: {
          Shield: 'Shield',
          Weapon: 'Weapon',
        },
        name: 'Items',
        table: {
          columns: {
            sprite: { header: 'Sprite', },
            id: { header: 'ID', },
            name: { header: 'Name', },
            weight: { header: 'Weight', value: '{{value}} oz.' },
            dropFrom: { header: 'Drop from', value: '{{value}}%' },
            buyFrom: { header: 'Buy from', },
            sellTo: { header: 'Sell to', },
            quests: { header: 'Quests', },
            attributes: { header: 'Attributes', },
            flags: { header: 'Flags', },
            dropRate: { header: 'Drop rate', value: '{{value}}%', tooltip: '1 every {{count}}' },
            attack: { header: 'Attack', },
            defense: { header: 'Defense', },
            shieldDefense: { header: 'Defense', },
            weaponType: { header: 'Weapon type', },
            isTwoHanded: { header: 'Two handed?', },
            expireOrUses: { header: 'Expire', },
            armor: { header: 'Armor', },
            bodyPosition: { header: 'Body position', },
            minimumLevel: { header: 'Min. level', },
            vocation: { header: 'Vocation', },
            wandRange: { header: 'Range', value: '{{value}} squares' },
            wandManaConsumption: { header: 'Mana consumption' },
            wandAttackStrength: { header: 'Strength' },
            wandDamageType: { header: 'Damage type' },
            bowRange: { header: 'Range', value: '{{value}} squares' },
            bowAmmo: { header: 'Ammo type' },
            effects: { header: 'Effects' },
            uses: { header: 'Uses' },
            expire: { header: 'Expire', value: '{{value}} {{timeUnit}}' },
            effectDamageReduction: { header: 'Damage reduction', value: '{{value}}% {{type}} protection' },
            effectArmor: { header: 'Armor', value: '{{value}} armor' },
            skillModification: { header: 'Skill bonus', value: '{{sign}}{{value}} {{skill}}' },
            ammoAttack: { header: 'Attack' },
            ammoType: { header: 'Type' },
            ammoSpecialEffect: { header: 'Element' },
            throwableAttack: { header: 'Attack' },
            throwableRange:  { header: 'Range', value: '{{value}} squares' },
            throwableBreakChance: { header: 'Break chance', value: '{{value}}%' },
            nutrition: { header: 'Nutrition' },
            weightNutritionRatio: { header: 'Weight x nutrition ratio' },
            cumulative: { header: 'Cumulative' },
            notes: { header: 'Notes' },
          },
        },
        types: {
          all: 'All',
          ammo: 'Ammo',
          amulets: 'Amulets',
          amuletsAndRings: 'Amulets and rings',
          armors: 'Armors',
          armorItems: 'Armor items',
          axes: 'Axes',
          boots: 'Boots',
          bows: 'Bows',
          clubs: 'Clubs',
          distanceWeapons: 'Distance weapons',
          helmets: 'Helmets',
          jewelry: 'Jewelry',
          legs: 'Legs',
          rings: 'Rings',
          rods: 'Rods',
          runes: 'Runes',
          shields: 'Shields',
          swords: 'Swords',
          throwables: 'Throwables',
          wands: 'Wands',
          wandsAndRods: 'Wands and rods',
          weapons: 'Weapons',
        }
      },
      landmarks: {
        name: 'Landmarks',
        marker: { tooltip: '[{{coordinates}}] {{- name}}' },
        table: {
          columns: {
            name: { header: 'Landmark', },
            coordinates: { header: 'Coordinates', },
          }
        }
      },
      npcs: {
        name: 'NPCs',
        marker: { tooltip: '[{{coordinates}}] NPC {{- name}}' },
        table: {
          columns: {
            sprite: { header: 'Sprite', },
            name: { header: 'Name', },
            coordinates: { header: 'Coordinates', },
            buyOffers: { header: 'Buy offers', },
            sellOffers: { header: 'Sell offers', },
            teachSpells: { header: 'Teach spells', },
            questRewards: { header: 'Quest rewards', },
            price: { header: 'price', },
          }
        }
      },
      quests: {
        name: 'Quests',
        marker: { tooltip: '[{{coordinates}}] Quest {{id}}, {{rewardsCount}} reward(s)' },
        table: {
          columns: {
            id: { header: 'ID', },
            rewards: { header: 'Rewards', },
            coordinates: { header: 'Coordinates', },
          }
        }
      },
      spells: {
        name: 'Spells',
        table: {
          columns: {
            id: { header: 'ID', },
            name: { header: 'Name', },
            knight: { header: 'Knight', },
            paladin: { header: 'Paladin', },
            druid: { header: 'Druid', },
            sorcerer: { header: 'Sorcerer', },
            minimumLevel: { header: 'Min. level', },
            taughtBy: { header: 'Taught by', },
          }
        }
      },

      externalPages: {
        tibiaWiki: 'TibiaWiki',
        tibia: 'Tibia.com',
      },
      json: 'JSON',
      loading: 'Loading...',
      no: 'No',
      none: 'None',
      pages: {
        amulets: {
          title: 'Amulets',
        },
        armorItems: {
          title: 'Armor items',
        },
        distanceWeapons: {
          title: 'Distance weapons',
        },
        map: {
          title: 'Map',
          markerTypeTooltip: 'Showing {{count}} {{type}}',
          actions: {
            showAll: 'Show all markers',
            hideAll: 'Hide all markers',
          }
        },
        rings: {
          title: 'Rings',
        },
        runes: {
          title: 'Runes',
        },
        shields: {
          title: 'Shields',
        },
        spells: {
          title: 'Spells',
        },
        wandsAndRods: {
          title: 'Wands and Rods',
        },
        weapons: {
          title: 'Weapons',
        },
      },
      rawData: 'Raw data',
      timeUnits: {
        seconds: 'seconds',
        minutes: 'minutes',
        hours: 'hours',
      },
      yes: 'Yes'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: defaultLanguages,
    lng: 'en',
    interpolation: {
      escapeValue: false,
    }
  })
  ;

export default i18n;
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const defaultLanguages = {
  "en": {
    translation: {
      appTitle: 'Tibia 7.70 database',
      components: {
        dataGrid: {
          search: 'Search',
          /** @TODO add other i18n */
        }
      },
      contexts: {
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
          marker: { tooltip: '[{{coordinates}}] {{count}}x {{- name}} every {{minutes}} minute(s)' },
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
              spawns: { header: 'Spawns', value: '{{count}} in {{placesCount}} places' },
              sprite: { header: 'Sprite', },
              immunities: { header: 'Immunities' }
            }
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
            }
          }
        },
        quests: {
          name: 'Quests',
          marker: { tooltip: '[{{coordinates}}] {{rewardsCount}} reward(s)' },
          table: {
            columns: {
              id: { header: 'ID', },
              rewards: { header: 'Rewards', },
              coordinates: { header: 'Coordinates', },
            }
          }
        },
      },
      externalPages: {
        tibiaWiki: 'TibiaWiki',
        tibia: 'Tibia.com',
      },
      json: 'JSON',
      loading: 'Loading...',
      no: 'No',
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
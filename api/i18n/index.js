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
        },
        searchBox: {
          label: 'Search (Ctrl + K)',
          options: {
            secondaryText: '/{{- type}}/{{- id}}',
          }
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
            bodyPosition: { header: 'Equip Slot', },
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
          all: 'All items',
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
      map: {
        name: 'Map',
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
            price: { header: 'Price', },
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
      runes: {
        name: 'Runes',
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
  },
  "pt-BR": {
    translation: {
      appTitle: 'Banco de dados - Tibia 7.70',
      components: {
        dataGrid: {
          search: 'Buscar',
        },
        searchBox: {
          label: 'Buscar (Ctrl + K)',
          options: {
            secondaryText: '/{{- type}}/{{- id}}',
          }
        }
      },
      creatures: {
        flags: {
          SeeInvisible: 'Vê invisibilidade',
          DistanceFighting: 'Mantém distsância',
          Unpushable: 'Imóvel',
          KickBoxes: 'Move caixas',
          KickCreatures: 'Move criaturas',
          NoBurning: 'Fogo',
          NoPoison: 'Veneno',
          NoEnergy: 'Energia',
          NoLifeDrain: 'Suga vida',
          NoParalyze: 'Paralisia',
        },
        marker: {
          tooltip: '[{{coordinates}}] {{amount}}x {{- name}} a cada {{minutes}} minuto(s)',
          quickAccessSummary: '{{amount}}x ({{minutes}} min)',
        },
        name: 'Criaturas',
        table: {
          columns: {
            id: { header: 'ID', },
            experience: { header: 'Exp', },
            hitpoints: { header: 'HP', },
            attack: { header: 'Ataque', },
            defense: { header: 'Defesa', },
            armor: { header: 'Armadura', },
            drops: { header: 'Itens', },
            summonCost: { header: 'Custo para invocar', },
            flags: { header: 'Flags', },
            name: { header: 'Nome', },
            spawns: { header: 'Spawns', value: '{{amount}} in {{placesCount}} places' },
            sprite: { header: 'Sprite', },
            immunities: { header: 'Imunidades' },
            dropRate: { header: 'Chance de cair', value: '{{value}}%', tooltip: '1 every {{count}}' },
          }
        }
      },
      items: {
        attributes: {
          AmmoSpecialEffect: {
            label: 'Efeitos',
            values: {
              '0': 'Physical',
              '1': 'Poison',
              '2': 'Fire',
            }
          },
          AmmoType: {
            label: 'Tipo de munição',
            values: {
              '1': 'Bolt',
              '2': 'Arrow',
            }
          },
          BodyPosition: {
            label: 'Slot no corpo',
            values: {
              '0': '2 mãos',
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
            id: 'Tipo de munição',
            values: {
              '1': 'Bolt',
              '2': 'Arrow',
            }
          },
          Professions: {
            label: 'Profissões',
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
            id: 'Proteção',
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
              '14': 'Regeneração',
              '16': 'Ilusão / stealth', // maybe Illusion is the proper term
              '20': 'Sóbrio',
              '21': 'Mana shield',
              '22': 'Soul',
            }
          },
          TotalExpireTime: {
            label: 'Expiração',
            value: 'Expira em {{value}} {{timeUnit}}',
          },
          TotalUses: {
            label: 'Usos',
            value: 'Quebra após {{value}} uso(s)',
          },
          WandDamageType: {
            label: 'Elemento',
            values: {
              '2': 'Terra',
              '4': 'Fogo',
              '8': 'Energia',
            }
          },
          WeaponType: {
            label: 'Tipo de arma',
            values: {
              '1': 'Espada',
              '2': 'Clava',
              '3': 'Machado',
            }
          },
        },
        flags: {
          Shield: 'Escudo',
          Weapon: 'Arma',
        },
        name: 'Itens',
        table: {
          columns: {
            sprite: { header: 'Sprite', },
            id: { header: 'ID', },
            name: { header: 'Nome', },
            weight: { header: 'Peso', value: '{{value}} oz.' },
            dropFrom: { header: 'Cai de', value: '{{value}}%' },
            buyFrom: { header: 'Compra de', },
            sellTo: { header: 'Vende para', },
            quests: { header: 'Quests', },
            attributes: { header: 'Atributos', },
            flags: { header: 'Flags', },
            dropRate: { header: 'Chance de cair', value: '{{value}}%', tooltip: '1 a cada {{count}}' },
            attack: { header: 'Ataque', },
            defense: { header: 'Defesa', },
            shieldDefense: { header: 'Defesa', },
            weaponType: { header: 'Tipo de arma', },
            isTwoHanded: { header: '2 mãoes?', },
            expireOrUses: { header: 'Expiração', },
            armor: { header: 'Armadura', },
            bodyPosition: { header: 'Posição no corpo', },
            minimumLevel: { header: 'Nível mínimo', },
            vocation: { header: 'Profissão', },
            wandRange: { header: 'Alcance', value: '{{value}} quadrados' },
            wandManaConsumption: { header: 'Custo de mana' },
            wandAttackStrength: { header: 'Força' },
            wandDamageType: { header: 'Tipo de dano' },
            bowRange: { header: 'Alcance', value: '{{value}} quadrados' },
            bowAmmo: { header: 'Tipo de munição' },
            effects: { header: 'Efeitos' },
            uses: { header: 'Usos' },
            expire: { header: 'Expiração', value: '{{value}} {{timeUnit}}' },
            effectDamageReduction: { header: 'Resistência a dano', value: '{{value}}% de proteção a {{type}}' },
            effectArmor: { header: 'Armadura', value: '{{value}} de armadura' },
            skillModification: { header: 'Bônus de skill', value: '{{sign}}{{value}} de {{skill}}' },
            ammoAttack: { header: 'Ataque' },
            ammoType: { header: 'Tipo' },
            ammoSpecialEffect: { header: 'Elemento' },
            throwableAttack: { header: 'Ataque' },
            throwableRange:  { header: 'Alcance', value: '{{value}} quadrados' },
            throwableBreakChance: { header: 'Chance de quebrar', value: '{{value}}%' },
            nutrition: { header: 'Saciedade' },
            weightNutritionRatio: { header: 'Peso x nutrição' },
            cumulative: { header: 'Acumulativo' },
            notes: { header: 'Observações' },
          },
        },
        types: {
          all: 'Todos',
          ammo: 'Munição',
          amulets: 'Amuletos',
          amuletsAndRings: 'Amuletos e anéis',
          armors: 'Armaduras',
          armorItems: 'Itens de armaduras',
          axes: 'Machados',
          boots: 'Botas',
          bows: 'Arcos',
          clubs: 'Clavas',
          distanceWeapons: 'Armas de longo alcance',
          helmets: 'Elmos / capacetes',
          jewelry: 'Jóias',
          legs: 'Calças',
          rings: 'Anéis',
          rods: 'Varinhas para Druid',
          runes: 'Runas',
          shields: 'Escudos',
          swords: 'Espadas',
          throwables: 'Arremessáveis',
          wands: 'Varinhas para Sorcerer',
          wandsAndRods: 'Varas para magos',
          weapons: 'Armas brancas',
        }
      },
      landmarks: {
        name: 'Locais',
        marker: { tooltip: '[{{coordinates}}] {{- name}}' },
        table: {
          columns: {
            name: { header: 'Local', },
            coordinates: { header: 'Coordenadas', },
          }
        }
      },
      npcs: {
        name: 'NPCs',
        marker: { tooltip: '[{{coordinates}}] NPC {{- name}}' },
        table: {
          columns: {
            sprite: { header: 'Sprite', },
            name: { header: 'Nome', },
            coordinates: { header: 'Coordenadas', },
            buyOffers: { header: 'Compra', },
            sellOffers: { header: 'Vende', },
            teachSpells: { header: 'Magias a ensinar', },
            questRewards: { header: 'Recompensa de quests', },
            price: { header: 'Preço', },
          }
        }
      },
      quests: {
        name: 'Quests',
        marker: { tooltip: '[{{coordinates}}] Quest {{id}}, {{rewardsCount}} recompensa(s)' },
        table: {
          columns: {
            id: { header: 'ID', },
            rewards: { header: 'Recompensas', },
            coordinates: { header: 'Coordenadas', },
          }
        }
      },
      spells: {
        name: 'Magias',
        table: {
          columns: {
            id: { header: 'ID', },
            name: { header: 'Nome', },
            knight: { header: 'Knight', },
            paladin: { header: 'Paladin', },
            druid: { header: 'Druid', },
            sorcerer: { header: 'Sorcerer', },
            minimumLevel: { header: 'Nível mínimo', },
            taughtBy: { header: 'Ensinado por', },
          }
        }
      },

      externalPages: {
        tibiaWiki: 'TibiaWiki',
        tibia: 'Tibia.com',
      },
      json: 'JSON',
      loading: 'Carregando...',
      no: 'Não',
      none: 'Nenhum',
      pages: {
        amulets: {
          title: 'Amuletos',
        },
        armorItems: {
          title: 'Items de armaduras',
        },
        distanceWeapons: {
          title: 'Armas de longo alcance',
        },
        map: {
          title: 'Mapa',
          markerTypeTooltip: 'Mostrando {{count}} {{type}}',
          actions: {
            showAll: 'Mostrar todos os marcadores',
            hideAll: 'Esconder todos os marcadores',
          }
        },
        rings: {
          title: 'Anéis',
        },
        runes: {
          title: 'Runas',
        },
        shields: {
          title: 'Escudos',
        },
        spells: {
          title: 'Magias',
        },
        wandsAndRods: {
          title: 'Varas para magos',
        },
        weapons: {
          title: 'Armas brancas',
        },
      },
      rawData: 'Dados brutos',
      timeUnits: {
        seconds: 'segundos',
        minutes: 'minutos',
        hours: 'horas',
      },
      yes: 'Sim',
    }
  },
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
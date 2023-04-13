const fs = require('fs');
const GmudParser = require('../../utils/gmud/GmudParser.js');

/**
 * @TODO (future)
 * - Support parameters (e.g.: source path, target path, etc)
 * - Add jsdoc
 * */

/** @TODO (future) use from utils/TibiaMaps instead */
/** 
 * These are values for version 13.x because that's what the maps in this app are based of at the moment.
 * Once the maps for version 7.70 are generated, use these values instead:
const MIN_X = 31872;
const MIN_Y = 31488;
 */
const MIN_X = 31744;
const MIN_Y = 30976;

const creaturesRaw = fs.readdirSync('./mon')
  .filter(file => file.endsWith('.mon'))
  .map(file => fs.readFileSync(`./mon/${file}`, 'utf8'))
  ;

let spawnsRaw = '';
try {
  spawnsRaw = fs.readFileSync('monster.db', 'utf8');
} catch (error) {
  console.error(`Failed to load file "monster.db". Did you move file "tibia-game.tarball/dat/monster.db" to the same folder as this script?`, error);
}

const creatures = creaturesRaw.map(creatureRaw => {
  const gmudObject = GmudParser.parse(creatureRaw);
  const { Outfit, Strategy, Flags, Skills, Inventory, RaceNumber, ...creature } = gmudObject;

  try {
    creature.id = RaceNumber;
    creature.Outfit = GmudParser.parseOutfitFunction(`(${Outfit.arg0},${Outfit.arg1})`);

    if (Strategy) {
      creature.Strategy = {
        id: Strategy.arg0,
        /** @TODO (future) set as props instead of array */
        /** 
         * Posts with info about the parameters:
         * - https://otland.net/threads/7-7-realots-7-7-cipsoft-files-virgin.244562/page-57#post-2685315
         * - https://otland.net/threads/7-7-realots-7-7-cipsoft-files-virgin.244562/page-57#post-2685321
         * - https://otland.net/threads/7-7-realots-7-7-cipsoft-files-virgin.244562/page-57#post-2685512
         * 
         */
        params: [Strategy.arg1, Strategy.arg2, Strategy.arg3]
      };
    }

    creature.Flags = (Flags || []).map(flag => flag.id);

    creature.Skills = (Skills || []).map(skill => ({
      id: skill.id.arg0,
      /** @TODO (future) set as props instead of array */
      params: [skill.id.arg1, skill.id.arg2, skill.id.arg3, skill.id.arg4, skill.id.arg5, skill.id.arg6],
    }));

    creature.Inventory = (Inventory || []).map(item => ({
      itemId: item.id.arg0,
      amount: item.id.arg1,
      /** @TODO might be better to save the dropRate as percentage. See https://otland.net/threads/7-7-realots-7-7-cipsoft-files-virgin.244562/page-57#post-2685520 and https://otland.net/threads/7-7-realots-7-7-cipsoft-files-virgin.244562/page-52#post-2648558 */
      dropRate: item.id.arg2,
    }));

    creature.spawns = [];
  } catch (error) {
    console.error(`Failed to parse creature: `, gmudObject, error);
  }

  return creature;
});

appendSpawns(spawnsRaw);
function appendSpawns(text) {

  const regex = /^(?!\s*#)\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/gm;
  const matches = text.matchAll(regex);
  Array.from(matches, (match, index) => {
    const [, id, x, y, z, radius, amount, interval] = match;
    const creatureIndex = creatures.findIndex(creature => creature.id === parseInt(id));
    if (creatureIndex < 0) return;
    const coordinates = [parseInt(x), parseInt(y), parseInt(z)];
    creatures[creatureIndex].spawns.push({
      coordinates,
      radius: parseInt(radius),
      amount: parseInt(amount),
      interval: parseInt(interval),
    });
  });
}


fs.writeFileSync('creatures.gmud.json', JSON.stringify(creatures, null, 2));

const fs = require('fs');
const GmudParser = require('../../utils/gmud/GmudParser.js');

/**
 * @TODO (future)
 * - Support parameters (e.g.: source path, target path, etc)
 * - Add jsdoc
 * */

const creaturesRaw = fs.readdirSync('./mon')
  .filter(file => file.endsWith('.mon'))
  .map(file => fs.readFileSync(`./mon/${file}`, 'utf8') + '\nid = "' + file.replace('.mon', '') + '"')
;

const creatures = creaturesRaw.map(creatureRaw => {
  const gmudObject = GmudParser.parse(creatureRaw);
  const { Outfit, Strategy, Flags, Skills, Inventory, ...creature } = gmudObject;

  try {
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
        params: [Strategy.arg1,Strategy.arg2,Strategy.arg3]
      };
    }

    creature.Flags = (Flags||[]).map(flag => flag.id);

    creature.Skills = (Skills||[]).map(skill => ({
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
  } catch (error) {
    console.error(`Failed to parse creature: `, gmudObject, error);
  }

  return creature;
});

fs.writeFileSync('creatures.gmud.json', JSON.stringify(creatures, null, 2));
const { saveGif, exportGifFramesToPng, buildFilterFramesByDirections } = require('../utils/Sprite');
const path = require('path');

/** @TODO (future) turn this into a script in the package.json */

const creatures = require('../database/creatures.json');
const npcs = require('../database/npcs.json');
const objects = require('../database/objects.json');
const originalSpritesDir = '../api/sprites/images';
const targetSpritesDir = '../public/images/sprites';
const objectSpritesDir = path.join(targetSpritesDir, 'objects');
const creatureSpritesDir = path.join(targetSpritesDir, 'creatures');
const npcSpritesDir = path.join(targetSpritesDir, 'npcs');

/**
 * For each data type (object, creature, npc), saves a gif file with all the frames 
 * and exports the first frame to a png file.
 * */
async function run() {
  console.log(`Generating sprites for ${objects.length} objects...`);
  for (const object of objects) {
    try {
      const gifPath = path.join(objectSpritesDir, `${object.id}.gif`);
      await saveGif(object.dat, originalSpritesDir, gifPath);
      await exportGifFramesToPng(gifPath, objectSpritesDir, object.id, [0]);
    } catch (error) {
      console.error(`Failed to generate sprite for object ${object.id} (${object.name}). Reason:`, error);
    }
  }

  console.log(`Generating sprites for ${creatures.length} creatures...`);
  const throwerCreatureIds = [93, 96, 97, 98];
  for (const creature of creatures) {
    try {
      /**
       * Manually fixing the outfit of "thrower" creatures
       * (flamethrower, plaguethrower, shredderthrower, magicthrower).
       * @TODO (future) fix this when parsing the GMUD, so the database will have the correct data too.
       */
      if (throwerCreatureIds.includes(creature.id)) {
        creature.dat.sprite.width = 2;
        creature.dat.sprite.height = 2;
        creature.dat.sprite.spriteIds = [4627, 4626, 4625, 4624];
      }
  
      const gifPath = path.join(creatureSpritesDir, `${creature.id}.gif`);
      await saveGif(creature.dat, originalSpritesDir, gifPath, { outfit: creature.outfit, filterFrames: buildFilterFramesByDirections(['down']) });
      await exportGifFramesToPng(gifPath, creatureSpritesDir, creature.id, [0]);
      
      // const fluxKontextSpritesPath = path.join(targetSpritesDir, 'creatures-flux-kontext');
      // const gifPath = path.join(fluxKontextSpritesPath, `${creature.id}.gif`);
      // await saveGif(creature.dat, originalSpritesDir, gifPath, { outfit: creature.outfit, filterFrames: buildFilterFramesByDirections(['down', 'up']) });
      // await exportGifFramesToPng(gifPath, fluxKontextSpritesPath, creature.id, [0, 1, 2, 3, 4, 5]);
    } catch (error) {
      console.error(`Failed to generate sprite for creature ${creature.id} (${creature.name}). Reason:`, error);      
    }
  }

  console.log(`Generating sprites for ${npcs.length} NPCs...`);
  for (const npc of npcs) {
    try {
      /**
       * Manually fixing the outfit of NPCs below.
       * @TODO (future) fix this when parsing the GMUD, so the database will have the correct data too.
       */
      if (npc.id === 'cobra') npc.dat = creatures.find(creature => creature.id === 81).dat;
      if (npc.id === 'frans') npc.dat = objects.find(object => object.id === 3207).dat;
      if (npc.id === 'oracle') npc.dat = objects.find(object => object.id === 2031).dat;
      if (npc.id === 'gatekeeper') npc.dat = objects.find(object => object.id === 2031).dat;
  
      const gifPath = path.join(npcSpritesDir, `${npc.id}.gif`);
      await saveGif(npc.dat, originalSpritesDir, gifPath, { outfit: npc.outfit, filterFrames: buildFilterFramesByDirections(['down']) });
      await exportGifFramesToPng(gifPath, npcSpritesDir, npc.id, [0]);
    } catch (error) {
      console.error(`Failed to generate sprite for NPC ${npc.id} (${npc.name}). Reason:`, error);      
    }
  }
}

try {
  console.log(`Generating sprites based on the databases in "database/*.json"...`);
  run();
} catch (error) {
  console.error(error);
}
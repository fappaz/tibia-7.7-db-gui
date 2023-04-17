const { saveGif, exportGifFramesToPng, buildFilterFramesByDirections } = require('../utils/Sprite');
const path = require('path');

const database = require('../database/database.json');
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
  console.log(`Generating sprites for ${database.objects.length} objects...`);
  for (const object of database.objects) {
    try {
      const gifPath = path.join(objectSpritesDir, `${object.id}.gif`);
      await saveGif(object.dat, originalSpritesDir, gifPath);
      await exportGifFramesToPng(gifPath, objectSpritesDir, object.id, [0]);
    } catch (error) {
      console.error(`Failed to generate sprite for object ${object.id} (${object.name}). Reason:`, error);
    }
  }

  console.log(`Generating sprites for ${database.creatures.length} creatures...`);
  const throwerCreatureIds = [93, 96, 97, 98];
  for (const creature of database.creatures) {
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
    } catch (error) {
      console.error(`Failed to generate sprite for creature ${creature.id} (${creature.name}). Reason:`, error);      
    }
  }

  console.log(`Generating sprites for ${database.npcs.length} NPCs...`);
  for (const npc of database.npcs) {
    try {
      /**
       * Manually fixing the outfit of NPCs below.
       * @TODO (future) fix this when parsing the GMUD, so the database will have the correct data too.
       */
      if (npc.id === 'cobra') npc.dat = database.creatures.find(creature => creature.id === 81).dat;
      if (npc.id === 'frans') npc.dat = database.objects.find(object => object.id === 3207).dat;
      if (npc.id === 'oracle') npc.dat = database.objects.find(object => object.id === 2031).dat;
      if (npc.id === 'gatekeeper') npc.dat = database.objects.find(object => object.id === 2031).dat;
  
      const gifPath = path.join(npcSpritesDir, `${npc.id}.gif`);
      await saveGif(npc.dat, originalSpritesDir, gifPath, { outfit: npc.outfit, filterFrames: buildFilterFramesByDirections(['down']) });
      await exportGifFramesToPng(gifPath, npcSpritesDir, npc.id, [0]);
    } catch (error) {
      console.error(`Failed to generate sprite for NPC ${npc.id} (${npc.name}). Reason:`, error);      
    }
  }
}

try {
  console.log(`Generating sprites based on the current "database.json"...`);
  run();
} catch (error) {
  console.error(error);
}
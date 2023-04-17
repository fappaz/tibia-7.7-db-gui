const originalCreaturesGmud = require('../api/creatures/creatures.gmud.json');
const originalNpcsGmud = require('../api/npcs/npcs.gmud.json');
const originalObjectsGmud = require('../api/objects/objects.gmud.json');
const originalDatObjectsGmud = require('../api/dat/dat.gmud.json');
const { saveGif, exportGifFramesToPng, buildFilterFramesByDirections } = require('../utils/Sprite');
const path = require('path');

const creaturesGmud = [...originalCreaturesGmud];
const npcsGmud = [...originalNpcsGmud];
const objectsGmud = [...originalObjectsGmud];
const datObjectsGmud = [...originalDatObjectsGmud];

/**
 * All conversions that can't be resolved automatically with the original files 
 * are being manually fixed here.
 * 
 * @TODO the fixes should be applied when parsing to Gmud, so the app can have the correct data too.
 */
// Adding sprite IDs to the "thrower" creatures (flamethrower, plaguethrower, shredderthrower, magicthrower)
const throwerCreatureIds = [93, 96, 97, 98];
throwerCreatureIds.forEach(creatureId => {
  const datIndex = datObjectsGmud.findIndex(datObject => datObject.id === creatureId);
  if (datIndex === -1) return;
  datObjectsGmud[datIndex].sprite.width = 2;
  datObjectsGmud[datIndex].sprite.height = 2;
  datObjectsGmud[datIndex].sprite.spriteIds = [4627, 4626, 4625, 4624];
});

// Adding outfit ID (datId) to the NPCs below
const npcSpriteFixes = [
  { id: 'cobra', datId: 81 },
  { id: 'frans', datId: 3207 },
  { id: 'oracle', datId: 2031 },
  { id: 'gatekeeper', datId: 2031 },
];
npcSpriteFixes.forEach(({ id, datId }) => {
  const datIndex = datObjectsGmud.findIndex(datObject => datObject.id === datId);
  if (datIndex === -1) return;
  const npcIndex = npcsGmud.findIndex(npc => npc.id === id);
  if (npcIndex === -1) return;
  npcsGmud[npcIndex].Outfit.id = datId;
});

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
  for (const objectGmud of objectsGmud) {
    const datObjectMatches = datObjectsGmud.filter((datGmud) => datGmud.id === objectGmud.TypeID && !datGmud.flags.ground && !datGmud.flags.blocksMissile && datGmud.type !== 'outfit' && !datGmud.flags.clip && !datGmud.flags.blocking && !datGmud.flags.immovable && datGmud.sprite.spriteIds.reduce((sum, id) => sum + id, 0) > 0);
    if (datObjectMatches.length === 0) continue;
    const datObjectGmud = datObjectMatches[0];

    const gifPath = path.join(objectSpritesDir, `${datObjectGmud.id}.gif`);
    await saveGif(datObjectGmud, originalSpritesDir, gifPath);
    await exportGifFramesToPng(gifPath, objectSpritesDir, datObjectGmud.id, [0]);
  }
  
  for (const creatureGmud of creaturesGmud) {
    let datObjectGmud = datObjectsGmud.find((datGmud) => datGmud.id === creatureGmud.Outfit.id && datGmud.type === 'outfit');
    if (!datObjectGmud) {
      const datObjectMatches = datObjectsGmud.filter((datGmud) => datGmud.id === creatureGmud.id).sort((a, b) => a.type === 'outfit' ? -1 : 1);
      if (datObjectMatches.length <= 0) continue;
      datObjectGmud = datObjectMatches[0];
    };

    const gifPath = path.join(creatureSpritesDir, `${creatureGmud.id}.gif`);
    await saveGif(datObjectGmud, originalSpritesDir, gifPath, { outfit: creatureGmud.Outfit, filterFrames: buildFilterFramesByDirections(['down']) });
    await exportGifFramesToPng(gifPath, creatureSpritesDir, creatureGmud.id, [0]);
  }
  
  for (const npcGmud of npcsGmud) {
    const datObjectMatches = datObjectsGmud.filter((datGmud) => datGmud.id === npcGmud.Outfit.id).sort((a, b) => a.type === 'outfit' ? -1 : 1);
    if (datObjectMatches.length === 0) continue;
    const datObjectGmud = datObjectMatches[0];

    const gifPath = path.join(npcSpritesDir, `${npcGmud.id}.gif`);
    await saveGif(datObjectGmud, originalSpritesDir, gifPath, { outfit: npcGmud.Outfit, filterFrames: buildFilterFramesByDirections(['down']) });
    await exportGifFramesToPng(gifPath, npcSpritesDir, npcGmud.id, [0]);
  }
}

try {
  run();
} catch (error) {
  console.error(error);
}
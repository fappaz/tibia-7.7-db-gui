const fs = require('fs');
const { createCanvas, Image } = require('canvas');
const GIFEncoder = require('gifencoder');
const creaturesGmud = require('../api/creatures/creatures.gmud.json');
const npcsGmud = require('../api/npcs/npcs.gmud.json');
const objectsGmud = require('../api/objects/objects.gmud.json');
const datObjectsGmud = require('../api/dat/dat.gmud.json');
const mapQuestsGmud = require('../api/map/mapQuests.gmud.json');

const database = {
  creatures: [],
  npcs: [],
  objects: [],
  // spells: [],
  // quests: [],
};

const spritesDirPath = '../api/sprites/images';
const gifsOutputDirPath = '../public/images';
database.objects = datObjectsGmud.filter(o => ['item'].includes(o.type) && !o.flags.immovable).map((datObject) => {
  const objectGmud = objectsGmud.find((objectGmud) => objectGmud.TypeID === datObject.id);
  if (!objectGmud ) return null;
  if ((objectGmud.Flags||[]).includes('Unmove')) return null;
  
  createGif(datObject.sprite.spriteIds.map(ids=>`${spritesDirPath}/${ids}.png`), `${gifsOutputDirPath}/${datObject.id}.gif`);

  return {
    id: datObject.id,
    name: objectGmud.Name,
    article: objectGmud.Article,
    flags: objectGmud.Flags,
    attributes: objectGmud.Attributes,
    buyFrom: [],
    sellTo: [],
    dropFrom: [],
    questRewards: [],
  }
}).filter((object) => object);


const behaviourOfferToOffer = ({ itemId, amount, price }, { id, Name }, objectProp) => {
  const itemIndex = database.objects.findIndex(o => o.id === itemId);
  if (itemIndex < 0) return null;
  const item = database.objects[itemIndex];
  database.objects[itemIndex][objectProp].push({
    npc: { id, name: Name }, price,
  });
  const offer = {
    item: {
      id: item.id,
      name: item.name,
    },
    price,
  };
  return offer;
};
database.npcs = npcsGmud.map((npcGmud) => {
  const { Home, Behaviours } = npcGmud;
  const location = { coordinates: Home };
  const buyOffers = Behaviours.buyOffers.map(offer => behaviourOfferToOffer(offer, npcGmud, 'sellTo')).filter(o => o);
  const sellOffers = Behaviours.sellOffers.map(offer => behaviourOfferToOffer(offer, npcGmud, 'buyFrom')).filter(o => o);
  const questRewards = [...new Set(Behaviours.questRewardItemIds)].map(itemId => {
    const itemIndex = database.objects.findIndex(o => o.id === itemId);
    if (itemIndex < 0) return null;
    const item = database.objects[itemIndex];
    database.objects[itemIndex].questRewards.push({
      npc: { id: npcGmud.id, name: npcGmud.Name },
    });
    return {
      item: {
        id: item.id,
        name: item.name,
      },
    }
  }).filter(o => o);

  return {
    id: npcGmud.id,
    name: npcGmud.Name,
    sex: npcGmud.Sex,
    race: npcGmud.Race,
    outfit: npcGmud.Outfit,
    location,
    buyOffers,
    sellOffers,
    questRewards,
  };
});

database.creatures = creaturesGmud.map((creatureGmud) => {
  const creature = {
    id: creatureGmud.id,
    name: creatureGmud.Name,
    article: creatureGmud.Article,
    raceNumber: creatureGmud.RaceNumber,
    experience: creatureGmud.Experience,
    summonCost: creatureGmud.SummonCost,
    attributes: {
      attack: creatureGmud.Attack,
      defense: creatureGmud.Defend,
      armor: creatureGmud.Armor,
    },
    outfit: creatureGmud.Outfit,
    flags: creatureGmud.Flags,
  };
  
  const hitpointsSkill = creatureGmud.Skills.find(skill => skill.id === 'HitPoints');
  const hitpoints = hitpointsSkill ? hitpointsSkill.params[0] : 0;
  creature.attributes.hitpoints = hitpoints;

  const drops = creatureGmud.Inventory.map((inventory) => {
    const itemIndex = database.objects.findIndex(o => o.id === inventory.itemId);
    if (itemIndex < 0) return null;
    const item = database.objects[itemIndex];
    const drop = {
      item: {
        id: item.id,
        name: item.name,
      },
      rate: inventory.dropRate,
      amount: inventory.amount,
    };
    database.objects[itemIndex].dropFrom.push({
      creature: {
        id: creature.id,
        name: creature.name,
      },
      rate: inventory.dropRate,
      amount: inventory.amount,
    });
    return drop;
  });

  creature.drops = drops;

  return creature;
});

mapQuestsGmud.forEach((mapSector) => {
  mapSector.questTiles.forEach((tile) => {
    const questId = tile.objects.reduce((questId, object) => object.chestQuestNumber);
    tile.objects.filter(o=>o.itemId).forEach((object) => {
      const { itemId } = object;
      const itemIndex = database.objects.findIndex(q => q.id === itemId);
      if (itemIndex < 0) return;
      database.objects[itemIndex].questRewards.push({
        chest: {
          coordinates: tile.coordinates,
          questId,
        }
      });
    });
  });
});

async function createGif(sprites, targetPath, { delay = 200, repeat = 0, quality = 10 } = {}) {

  const [width, height] = [32, 32];
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');


  const encoder = new GIFEncoder(width, height); 
  encoder.createWriteStream({ repeat, delay, quality }).pipe(fs.createWriteStream(targetPath));
  encoder.start();
  encoder.setTransparent(0xff00ff);

  for (const frame of sprites) {
    if (!fs.existsSync(frame)) {
      console.warn(`File not found: ${frame}`);
      continue;
    }

    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = (error) => {
        console.error(`Error loading image: ${frame}`, error);
        reject(error);
      };
      image.src = frame;
    });
    context.fillStyle = '#ff00ff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    encoder.addFrame(context);
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  encoder.finish();
}

fs.writeFileSync('database.json', JSON.stringify(database, null, 2));

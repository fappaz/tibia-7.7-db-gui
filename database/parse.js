const fs = require('fs');
const creaturesGmud = require('../api/creatures/creatures.gmud.json');
const npcsGmud = require('../api/npcs/npcs.gmud.json');
const objectsGmud = require('../api/objects/objects.gmud.json');
const datObjectsGmud = require('../api/dat/dat.gmud.json');
const mapQuestsGmud = require('../api/map/mapQuests.gmud.json');
const { saveGif, exportGifFramesToPng } = require('../utils/Sprite');

const database = {
  creatures: [],
  npcs: [],
  objects: [],
  quests: [],

  /**
   * Retrieved from NPC 'Loria'
   * @TODO add minimumLevel
   * */
  spells: [
    { name: "find person", words: "exiva 'name'", vocations:[], taughtBy: [] }, 
    { name: "light", words: "utevo lux", vocations:[], taughtBy: [] }, 
    { name: "light healing", words: "exura", vocations:[], taughtBy: [] }, 
    { name: "light magic missile", words: "adori", vocations:[], taughtBy: [] }, 
    { name: "antidote", words: "exana pox", vocations:[], taughtBy: [] }, 
    { name: "intense healing", words: "exura gran", vocations:[], taughtBy: [] }, 
    { name: "poison field", words: "adevo grav pox", vocations:[], taughtBy: [] }, 
    { name: "great light", words: "utevo gran lux", vocations:[], taughtBy: [] }, 
    { name: "fire field", words: "adevo grav flam", vocations:[], taughtBy: [] }, 
    { name: "heavy magic missile", words: "adori gran", vocations:[], taughtBy: [] }, 
    { name: "magic shield", words: "utamo vita", vocations:[], taughtBy: [] }, 
    { name: "fireball", words: "adori flam", vocations:[], taughtBy: [] }, 
    { name: "energy field", words: "adevo grav vis", vocations:[], taughtBy: [] }, 
    { name: "destroy field", words: "adito grav", vocations:[], taughtBy: [] }, 
    { name: "fire wave", words: "exevo flam hur", vocations:[], taughtBy: [] }, 
    { name: "ultimate healing", words: "exura vita", vocations:[], taughtBy: [] }, 
    { name: "great fireball", words: "adori gran flam", vocations:[], taughtBy: [] }, 
    { name: "fire bomb", words: "adevo mas flam", vocations:[], taughtBy: [] }, 
    { name: "firebomb", words: "adevo mas flam", vocations:[], taughtBy: [] }, 
    { name: "energy beam", words: "exevo vis lux", vocations:[], taughtBy: [] }, 
    { name: "creature illusion", words: "utevo res ina 'creature'", vocations:[], taughtBy: [] }, 
    { name: "poison wall", words: "adevo mas grav pox", vocations:[], taughtBy: [] }, 
    { name: "explosion", words: "adevo mas hur", vocations:[], taughtBy: [] }, 
    { name: "fire wall", words: "adevo mas grav flam", vocations:[], taughtBy: [] }, 
    { name: "great energy beam", words: "exevo gran vis lux", vocations:[], taughtBy: [] }, 
    { name: "invisible", words: "utana vid", vocations:[], taughtBy: [] }, 
    { name: "summon creature", words: "utevo res 'creature'", vocations:[], taughtBy: [] }, 
    { name: "energy wall", words: "adevo mas grav vis", vocations:[], taughtBy: [] }, 
    { name: "energy wave", words: "exevo mort hur", vocations:[], taughtBy: [] }, 
    { name: "sudden death", words: "adori vita vis", vocations:[], taughtBy: [] }, 
  ],
};

const spritesDirPath = '../api/sprites/images';
const spritesOutputDirPath = '../public/images/sprites';
database.objects = datObjectsGmud.filter(o => ['item'].includes(o.type) && !o.flags.immovable).map((datObject) => {
  const objectGmud = objectsGmud.find((objectGmud) => objectGmud.TypeID === datObject.id);
  if (!objectGmud ) return null;
  if ((objectGmud.Flags||[]).includes('Unmove')) return null;
  
  saveGif(datObject, spritesDirPath, `${spritesOutputDirPath}/${datObject.id}.gif`);

  return {
    id: datObject.id,
    name: objectGmud.Name,
    article: objectGmud.Article,
    flags: objectGmud.Flags || [],
    attributes: objectGmud.Attributes || {},
    buyFrom: [],
    sellTo: [],
    dropFrom: [],
    questRewards: [],
  }
}).filter((object) => object);

/** Save one gif frame to jpg so it can be used as non-animated icons (e.g.: map markers) */
datObjectsGmud.filter(o => ['outfit'].includes(o.type)).forEach(async (datOutfit) => {
  const creatureGmud = creaturesGmud.find((creatureGmud) => `${creatureGmud.Outfit.id}` === `${datOutfit.id}`);
  if (!creatureGmud ) return null;
  
  const gifPath = `${spritesOutputDirPath}/${datOutfit.id}.gif`;
  await saveGif(datOutfit, spritesDirPath, gifPath);
  await exportGifFramesToPng(gifPath, spritesOutputDirPath, datOutfit.id, [0]);
});

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
  const teachSpells = Behaviours.teachSpells.map(teachSpell => {
    const spellIndex = database.spells.findIndex(o => o.name === teachSpell.name);
    if (spellIndex < 0) return null;
    const spell = database.spells[spellIndex];
    /** @TODO this is not being pushed to the database correctly */
    database.spells[spellIndex].taughtBy.push[{ id: npcGmud.id, name: npcGmud.Name, price: teachSpell.price }];
    if (!spell.vocations.includes(teachSpell.vocation)) database.spells[spellIndex].vocations.push(teachSpell.vocation);
    return {
      name: teachSpell.name,
      price: teachSpell.price,
    }
  }).filter(o => o);
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
    teachSpells,
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
    spawns: creatureGmud.spawns,
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

  creature.outfit.dat = datObjectsGmud.find(o => ['outfit'].includes(o.type) && o.id === creature.id);

  return creature;
});

mapQuestsGmud.forEach((mapSector) => {
  mapSector.questTiles.forEach((tile) => {
    const { chestQuestNumber: questId } = tile.objects.find(object => object.chestQuestNumber) || {};
    const rewardItems = tile.objects.filter(o=>o.itemId).map((object) => {
      const { itemId } = object;
      const itemIndex = database.objects.findIndex(q => q.id === itemId);
      if (itemIndex < 0) return;
      database.objects[itemIndex].questRewards.push({
        chest: {
          coordinates: tile.coordinates,
          questId,
        }
      });
      return database.objects[itemIndex];
    }).filter(o=>o).map(item => ({ id: item.id, name: item.name }));

    if (database.quests.findIndex(quest=>`${quest.id}` === `${questId}`) >= 0) return;
    database.quests.push({
      id: questId,
      coordinates: tile.coordinates,
      type: 'chest',
      rewards: {
        items: rewardItems,
      },
    })
  });
});

fs.writeFileSync('database.json', JSON.stringify(database, null, 2));

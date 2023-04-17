const fs = require('fs');
const creaturesGmud = require('../api/creatures/creatures.gmud.json');
const npcsGmud = require('../api/npcs/npcs.gmud.json');
const objectsGmud = require('../api/objects/objects.gmud.json');
const datObjectsGmud = require('../api/dat/dat.gmud.json');
const mapQuestsGmud = require('../api/map/mapQuests.gmud.json');

const database = {
  creatures: [],
  npcs: [],
  objects: [],
  quests: [],

  /**
   * Retrieved from NPC 'Loria'
   * @TODO add minimumLevel and description
   * */
  spells: [
    { name: "find person", words: "exiva 'name'", vocations: [], taughtBy: [] },
    { name: "light", words: "utevo lux", vocations: [], taughtBy: [] },
    { name: "light healing", words: "exura", vocations: [], taughtBy: [] },
    { name: "light magic missile", words: "adori", vocations: [], taughtBy: [] },
    { name: "antidote", words: "exana pox", vocations: [], taughtBy: [] },
    { name: "intense healing", words: "exura gran", vocations: [], taughtBy: [] },
    { name: "poison field", words: "adevo grav pox", vocations: [], taughtBy: [] },
    { name: "great light", words: "utevo gran lux", vocations: [], taughtBy: [] },
    { name: "fire field", words: "adevo grav flam", vocations: [], taughtBy: [] },
    { name: "heavy magic missile", words: "adori gran", vocations: [], taughtBy: [] },
    { name: "magic shield", words: "utamo vita", vocations: [], taughtBy: [] },
    { name: "fireball", words: "adori flam", vocations: [], taughtBy: [] },
    { name: "energy field", words: "adevo grav vis", vocations: [], taughtBy: [] },
    { name: "destroy field", words: "adito grav", vocations: [], taughtBy: [] },
    { name: "fire wave", words: "exevo flam hur", vocations: [], taughtBy: [] },
    { name: "ultimate healing", words: "exura vita", vocations: [], taughtBy: [] },
    { name: "great fireball", words: "adori gran flam", vocations: [], taughtBy: [] },
    { name: "fire bomb", words: "adevo mas flam", vocations: [], taughtBy: [] },
    { name: "firebomb", words: "adevo mas flam", vocations: [], taughtBy: [] },
    { name: "energy beam", words: "exevo vis lux", vocations: [], taughtBy: [] },
    { name: "creature illusion", words: "utevo res ina 'creature'", vocations: [], taughtBy: [] },
    { name: "poison wall", words: "adevo mas grav pox", vocations: [], taughtBy: [] },
    { name: "explosion", words: "adevo mas hur", vocations: [], taughtBy: [] },
    { name: "fire wall", words: "adevo mas grav flam", vocations: [], taughtBy: [] },
    { name: "great energy beam", words: "exevo gran vis lux", vocations: [], taughtBy: [] },
    { name: "invisible", words: "utana vid", vocations: [], taughtBy: [] },
    { name: "summon creature", words: "utevo res 'creature'", vocations: [], taughtBy: [] },
    { name: "energy wall", words: "adevo mas grav vis", vocations: [], taughtBy: [] },
    { name: "energy wave", words: "exevo mort hur", vocations: [], taughtBy: [] },
    { name: "sudden death", words: "adori vita vis", vocations: [], taughtBy: [] },
  ],
};

console.log(`Analysing ${objectsGmud.length} objects...`);
for (const objectGmud of objectsGmud) {
  const datObjectMatches = datObjectsGmud
    .filter((datGmud) => datGmud.id === objectGmud.TypeID 
      && !datGmud.flags.ground
      && !datGmud.flags.blocksMissile
      && datGmud.type !== 'outfit'
      && !datGmud.flags.clip
      && !datGmud.flags.blocking
      && !datGmud.flags.immovable
      && datGmud.sprite.spriteIds.reduce((sum, id) => sum + id, 0) > 0
    )
  ;
  if (datObjectMatches.length === 0) continue;
  const datObjectGmud = datObjectMatches[0];

  const object = {
    id: objectGmud.TypeID,
    name: objectGmud.Name,
    article: objectGmud.Article,
    description: objectGmud.Description,
    flags: objectGmud.Flags || [],
    attributes: objectGmud.Attributes || {},
    buyFrom: [],
    sellTo: [],
    dropFrom: [],
    questRewards: [],
    dat: datObjectGmud,
  };
  database.objects.push(object);
}

console.log(`Analysing ${npcsGmud.length} NPCs...`);
const parseBehaviourToOffer = ({ itemId, amount, price }, { id, Name }, objectProp) => {
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
for (const npcGmud of npcsGmud) {
  const datObjectMatches = datObjectsGmud.filter((datGmud) => datGmud.id === npcGmud.Outfit.id).sort((a, b) => a.type === 'outfit' ? -1 : 1);
  if (datObjectMatches.length === 0) continue;
  const datObjectGmud = datObjectMatches[0];

  const { Home, Behaviours } = npcGmud;
  const location = { coordinates: Home };
  const buyOffers = Behaviours.buyOffers.map(offer => parseBehaviourToOffer(offer, npcGmud, 'sellTo')).filter(o => o);
  const sellOffers = Behaviours.sellOffers.map(offer => parseBehaviourToOffer(offer, npcGmud, 'buyFrom')).filter(o => o);
  const teachSpells = Behaviours.teachSpells.map(teachSpell => {
    const spellIndex = database.spells.findIndex(o => o.name === teachSpell.name);
    if (spellIndex < 0) return null;
    const spell = database.spells[spellIndex];
    database.spells[spellIndex].taughtBy.push({ id: npcGmud.id, name: npcGmud.Name, price: teachSpell.price });
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

  const npc = {
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
  npc.dat = datObjectGmud;

  database.npcs.push(npc);
}

console.log(`Analysing ${creaturesGmud.length} creatures...`);
for (const creatureGmud of creaturesGmud) {
  let datObjectGmud = datObjectsGmud.find((datGmud) => datGmud.id === creatureGmud.Outfit.id && datGmud.type === 'outfit');
  if (!datObjectGmud) {
    const datObjectMatches = datObjectsGmud.filter((datGmud) => datGmud.id === creatureGmud.id).sort((a, b) => a.type === 'outfit' ? -1 : 1);
    if (datObjectMatches.length <= 0) continue;
    datObjectGmud = datObjectMatches[0];
  };

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
  creature.dat = datObjectGmud;

  database.creatures.push(creature);
}

console.log(`Analysing ${mapQuestsGmud.length} map sectors...`);
mapQuestsGmud.forEach((mapSector) => {
  mapSector.questTiles.forEach((tile) => {
    const { chestQuestNumber: questId } = tile.objects.find(object => object.chestQuestNumber) || {};
    const rewardItems = tile.objects.filter(o => o.itemId).map((object) => {
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
    }).filter(o => o).map(item => ({ id: item.id, name: item.name }));

    if (database.quests.findIndex(quest => `${quest.id}` === `${questId}`) >= 0) return;
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

const databaseOutputPath = 'database.json';
fs.writeFileSync(databaseOutputPath, JSON.stringify(database, null, 2));
console.log(`Database generated at "${databaseOutputPath}". Make sure to also generate the sprites.`);
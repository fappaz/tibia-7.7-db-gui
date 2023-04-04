const fs = require('fs');
const GmudParser = require('../../utils/gmud/GmudParser.js');
const dir = './npc';

/**
 * @TODO (future)
 * - Support parameters (e.g.: source path, target path, etc)
 * - Add jsdoc
 *
 * */

const npcsRaw = fs.readdirSync(dir)
  .filter(file => file.endsWith('.npc'))
  .map(file => {
    /** Injecting the NDB imports into the file content */
    let content = fs.readFileSync(`${dir}/${file}`, 'utf8');
    const NDB_REGEX = /^\@\"(.+?)\"$/gm;
    let match;
    while (match = NDB_REGEX.exec(content)) {
      const ndbFilename = match[1];
      const ndbFilePath = `${dir}/${ndbFilename}`;
      console.log(`NPC file "${file}" having NDB replaced with "${ndbFilePath}"...`);

      const ndbContent = fs.readFileSync(ndbFilePath, 'utf8');
      content = content.replace(match[0], ndbContent);
    }
    return content + '\nid = ' + file.replace('.npc', '');
  })
;

const npcs = npcsRaw.map(npcRaw => {
  const npc = {};
  try {
    const lines = npcRaw.split('\n').map(line => line.trim()).filter(line => line.length > 0 && line.at(0) !== '#');
    let behaviours = null;
    for (const line of lines) {
      if (behaviours) {
        if (line === '}') {
          try {
            behaviours.summary = buildBehaviourSummary(behaviours.lines);
          } catch (error) {
            console.error(`Failed to get behaviours summary from npc: `, npc.Name, error);
          }
          npc.Behaviours = behaviours.summary;
          behaviours = null;
        } else {
          behaviours.lines.push(line.trim());
        }
        continue;
      }

      const separatorIndex = line.indexOf('=');
      const [key, value] = [line.substring(0, separatorIndex), line.substring(separatorIndex + 1)].map(part => part.trim());
      if (key === 'Name') {
        npc[key] = value.replaceAll(/"/g, '');
      } else if (key === 'Outfit') {
        npc[key] = GmudParser.parseOutfitFunction(value);
      } else if (key === 'Home') {
        npc[key] = GmudParser.parseLocation(value);
      } else if (key === 'Behaviour') {
        behaviours = {
          lines: [],
          summary: {},
        };
      } else {
        npc[key] = parseInt(value) || value.replaceAll(/"/g, '');
        if (npc[key] === '0') npc[key] = parseInt(value);
      }
    }
  } catch (error) {
    console.error(`Failed to parse GMUD object: `, npcRaw, error);
    throw error;
  }

  return npc;
});

function buildBehaviourSummary(lines) {
  const summary = {
    buyOffers: [],
    sellOffers: [],
    questRewardItemIds: [],
  };
  const sellOfferTopicIds = [];
  const buyOfferTopicIds = [];

  const behaviours = [];
  for (const line of lines) {
    const attributorIndex = line.indexOf('->');
    const [conditionsArgs, functionArgs] = [line.substring(0, attributorIndex), line.substring(attributorIndex + 2)].map(part => part.trim());

    const behaviour = { conditionsArgs, functionArgs };
    if (functionArgs.match(/DeleteMoney/)) {
      const match = conditionsArgs.match(/Topic=(\d+)/i);
      if (match) sellOfferTopicIds.push(match[1]);
    }
    if (functionArgs.match(/CreateMoney/)) {
      const match = conditionsArgs.match(/Topic=(\d+)/i);
      if (match) buyOfferTopicIds.push(match[1]);
    }
    if (functionArgs.match(/SetQuestValue/)) {
      const match = functionArgs.match(/Create\((\d+)/i);
      if (match) summary.questRewardItemIds.push(parseInt(match[1]));
    }
    behaviours.push(behaviour);
  }

  for (const behaviour of behaviours) {
    const { conditionsArgs, functionArgs } = behaviour;
    const topicMatch = functionArgs.match(/Topic=(\d+)/i);
    const record = {};

    const typeMatch = functionArgs.match(/Type=(\d+)/i);
    if (typeMatch) record.itemId = parseInt(typeMatch[1]);

    /** @TODO support Amount=%1 */
    const amountMatch = functionArgs.match(/Amount=([\d*]+),/i);
    if (amountMatch) record.amount = parseInt(amountMatch[1]);

    /** @TODO support Price=10*%1 */
    const priceMatch = functionArgs.match(/Price=([\d*]+),/i);
    if (priceMatch) record.price = parseInt(priceMatch[1]);

    if (record.itemId && record.price && topicMatch) {
      if (sellOfferTopicIds.includes(topicMatch[1])) {
        summary.sellOffers.push(record);
      } else if (buyOfferTopicIds.includes(topicMatch[1])) {
        summary.buyOffers.push(record);
      }
    }
  }

  return summary;
}

fs.writeFileSync('npcs.gmud.json', JSON.stringify(npcs, null, 2));
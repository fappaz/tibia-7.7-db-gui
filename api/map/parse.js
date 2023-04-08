const fs = require('fs');
const GmudParser = require('../../utils/gmud/GmudParser.js');
const TibiaMaps = require('../../utils/TibiaMaps.js');

/**
 * @TODO (future)
 * - Support parameters (e.g.: source path, target path, etc)
 * - Add jsdoc
 * 
 * */

const TILE_REGEX = /^\s*([\d]+)-([\d]+):\s*([\w,\s]+)?(Content.+$)/gm;

/**
 * Flatten the provided rootObject and its children recursively.
 * @param {GmudObject} rootObject the root object that should be flatten along with all its children.
 * @param {string} childrenPropertyName the name of the property that stores the children.
 * @param {int} startingUniqueId the starting unique ID for the first element.
 * @returns {list} a list of all objects at the same depth level.
 */
function flatten(rootObject, childrenPropertyName, startingUniqueId = 1) {
  const list = [];
  let uniqueId = startingUniqueId;
  flatten(rootObject);
  return list;
  function flatten(parent) {
    let children = parent[childrenPropertyName];
    parent._id = uniqueId++;
    if (children && children.length > 0) {
      parent._childrenIds = [];
      children.forEach(child => {
        child._parentId = parent._id;
        flatten(child);
        parent._childrenIds.push(child._id);
      });
    }
    list.push(copyObjectWithoutChildren(parent));
  }

  function copyObjectWithoutChildren(parent) {
    let { [childrenPropertyName]: children, ...childlessObject } = parent;
    return childlessObject;
  }
}

const mapQuests = fs.readdirSync('./origmap')
  .filter(file => file.endsWith('.sec'))
  .map(file => {
    const content = fs.readFileSync(`./origmap/${file}`, 'utf8');
    const filename = file.replace('.sec', '');
    const sectors = filename.split('-').map(value => parseInt(value));
    const tiles = [];

    let match;
    while (match = TILE_REGEX.exec(content)) {
      const [, relativeX, relativeY, rawTileFlags, tileContent] = match;
      if (!tileContent.includes('ChestQuestNumber')) continue;
      const coordinates = TibiaMaps.mapSectorToCoordinates(sectors[0], sectors[1], sectors[2], parseInt(relativeX), parseInt(relativeY));
      const rawGmudString = `Coordinates = "${coordinates.join(',')}"\nTiles = {0 ${tileContent}}`;

      const gmudObject = GmudParser.parse(rawGmudString);

      const flatList = flatten(gmudObject.Tiles[0], 'Content');//.filter(item => item.id > 0);
      const modelObjects = GmudParser.parseGmudMapObjectsToModelObjects(flatList, 1);
      const tileFlags = rawTileFlags ? rawTileFlags.split(',').filter(flag => flag.trim().length > 0) : undefined;
      const tile = {
        coordinates,
        objects: modelObjects,
        flags: tileFlags,
      };
      tiles.push(tile);
    }

    if (tiles.length === 0) return;
    return { filename, sectors, coordinates: TibiaMaps.mapSectorToCoordinates(sectors[0], sectors[1], sectors[2]), questTiles: tiles };
  })
  .filter(o => o);
;

fs.writeFileSync('mapQuests.gmud.json', JSON.stringify(mapQuests, null, 2));
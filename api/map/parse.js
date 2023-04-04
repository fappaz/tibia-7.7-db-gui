const fs = require('fs');
const GmudParser = require('../../utils/gmud/GmudParser.js');

/**
 * @TODO (future)
 * - Support parameters (e.g.: source path, target path, etc)
 * - Add jsdoc
 * 
 * */

// cipfried ta +13x, +39y que doublet (talvez no 1002-1006-07)
// fandom minX,minY = 124.00, 121.00
// maps minX,minY = 31744,30976

// tom sign north: 1002-1006-07/20-02 = 32084,32194,7 = 125.84,125.194,7
// tom sign east : 1002-1006-07/24-11 = 32088,32203,7 = 125.88,125.203,7
// doublet       : 1002-1005-08/16-21 = 32080,32181,8 = 125.84,125.181,8`
const SECTOR_X_MIN = 996;
const SECTOR_X_MAX = 1043;
const SECTOR_Y_MIN = 984;
const SECTOR_Y_MAX = 1031;
const SECTOR_Z_MIN = 0;
const SECTOR_Z_MAX = 15;
const SECTOR_LENGTH = 32;
const MIN_X = 31872; // 128 more than today
const MIN_Y = 31488; // 512 more than today
const TILE_REGEX = /^\s*([\d]+)-([\d]+):\s*([\w,\s]+)?(Content.+$)/gm;

function mapSectorToCoordinates(sectorX, sectorY, sectorZ, relativeX = 0, relativeY = 0) {
  const x = (sectorX - SECTOR_X_MIN) * SECTOR_LENGTH + relativeX + MIN_X;
  const y = (sectorY - SECTOR_Y_MIN) * SECTOR_LENGTH + relativeY + MIN_Y;
  const z = sectorZ;
  return [x, y, z];
}

function coordinatesToMapSector(x, y, z) {
  const sectorX = Math.floor((x - MIN_X) / SECTOR_LENGTH + SECTOR_X_MIN);
  const relativeX = (x - MIN_X) % SECTOR_LENGTH;
  const sectorY = Math.floor((y - MIN_Y) / SECTOR_LENGTH + SECTOR_Y_MIN);
  const relativeY = (y - MIN_Y) % SECTOR_LENGTH;
  const sectorZ = z;

  return {
    sectorX: sectorX,
    sectorY: sectorY,
    sectorZ: sectorZ,
    relativeX: relativeX,
    relativeY: relativeY
  };
}

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

/**
 * @TODO (future) maybe /origmap is better?
 */
const mapQuests = fs.readdirSync('./map')
  .filter(file => file.endsWith('.sec'))
  .map(file => {
    const content = fs.readFileSync(`./map/${file}`, 'utf8');
    const filename = file.replace('.sec', '');
    const sectors = filename.split('-').map(value => parseInt(value));
    const tiles = [];

    let match;
    while (match = TILE_REGEX.exec(content)) {
      const [, relativeX, relativeY, rawTileFlags, tileContent] = match;
      if (!tileContent.includes('ChestQuestNumber')) continue;
      const coordinates = mapSectorToCoordinates(sectors[0], sectors[1], sectors[2], parseInt(relativeX), parseInt(relativeY));
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
    return { filename, sectors, coordinates: mapSectorToCoordinates(sectors[0], sectors[1], sectors[2]), questTiles: tiles };
  })
  .filter(o => o);
;

fs.writeFileSync('mapQuests.gmud.json', JSON.stringify(mapQuests, null, 2));
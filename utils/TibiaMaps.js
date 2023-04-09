
export const getTibiaMapsUrl = (coordinates = []) => `https://tibiamaps.io/map#${coordinates.join(',')}:1`;

/** version 13.x */
export const AUTOMAP_WIDTH = 2560;
export const AUTOMAP_HEIGHT = 2048;

// cipfried is +13x, +39y away from doublet (maybe at 1002-1006-07)
// fandom minX,minY = 124.00, 121.00
// maps minX,minY = 31744,30976

// tom sign north: 1002-1006-07/20-02 = 32084,32194,7 = 125.84,125.194,7
// tom sign east : 1002-1006-07/24-11 = 32088,32203,7 = 125.88,125.203,7
// doublet       : 1002-1005-08/16-21 = 32080,32181,8 = 125.84,125.181,8`
/** Retrieved from `dat/map.dat` */
const SECTOR_X_MIN = 996;
const SECTOR_X_MAX = 1043;
const SECTOR_Y_MIN = 984;
const SECTOR_Y_MAX = 1031;
const SECTOR_Z_MIN = 0;
const SECTOR_Z_MAX = 15;
const SECTOR_LENGTH = 32;
// v 7.70:
// const MIN_X = 31872; // 128 more than today
// const MIN_Y = 31488; // 512 more than today
// v 13.x:
const MIN_X = 31744;
const MIN_Y = 30976;
/** i.e.: how much smaller the map in version 7.70 was compared to current version 13.x */
const VERSION_7_70_WIDTH_DELTA = 128;
const VERSION_7_70_HEIGHT_DELTA = 512;

/**
 * @deprecated TibiaMaps used to use coordinates like `124.76,121.76,7`, but now it uses like `32437,31729,7`
 * @param {number[]} coordinates The coordinates
 * @returns {string[]} The coordinates in a format that TibiaMaps can use
 */
export const coordinatesToTibiaMapsCoordinates = (coordinates = []) => {
  const [x, y, z] = coordinates;

  const shortX = (Math.floor((x - TIBIA_MAPS_ABSOLUTE_MIN_X) / TIBIA_MAPS_MAX_INCREMENT) + TIBIA_MAPS_RELATIVE_MIN_X).toFixed(0);
  const shortY = (Math.floor((y - TIBIA_MAPS_ABSOLUTE_MIN_Y) / TIBIA_MAPS_MAX_INCREMENT) + TIBIA_MAPS_RELATIVE_MIN_Y).toFixed(0);
  const shortXDecimals = Math.floor((x - TIBIA_MAPS_ABSOLUTE_MIN_X) % TIBIA_MAPS_MAX_INCREMENT).toFixed(0);
  const shortYDecimals = Math.floor((y - TIBIA_MAPS_ABSOLUTE_MIN_Y) % TIBIA_MAPS_MAX_INCREMENT).toFixed(0);
  // return `${shortX}.${shortXDecimals},${shortY}.${shortYDecimals},${z}`;
  return [`${shortX}.${shortXDecimals}`, `${shortY}.${shortYDecimals}`, `${z}`];
};

export function mapSectorToCoordinates(sectorX, sectorY, sectorZ, relativeX = 0, relativeY = 0) {
  const x = (sectorX - SECTOR_X_MIN) * SECTOR_LENGTH + relativeX + MIN_X;
  const y = (sectorY - SECTOR_Y_MIN) * SECTOR_LENGTH + relativeY + MIN_Y;
  const z = sectorZ;
  return [x, y, z];
}

export function coordinatesToMapSector(x, y, z) {
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

export function pixelsToLatLng([x, y, z], [width, height]) {
  return [height - y, x, z];
}

export function latLngToPixels([lat, lng, z], [width, height]) {
  return [lng, height - lat, z];
}

export function largeCoordinatesToAutomapCoordinates([x, y, z]) {
  return [x - MIN_X, y - MIN_Y, z];
}

/** Retrieved from `dat/map.dat` */
export const landmarks = [
  { id: "AbDendriel", name: "Ab'Dendriel", largeCoordinates: [32661,31687,7], },
  { id: "Amazons", name: "Amazon Camp", largeCoordinates: [32839,31925,7], },
  { id: "Ankrahmun", name: "Ankrahmun", largeCoordinates: [33162,32802,7], },
  { id: "Banuta", name: "Banuta", largeCoordinates: [32812,32559,7], },
  { id: "Camp", name: "Camp", largeCoordinates: [32655,32208,7], },
  { id: "Carlin", name: "Carlin", largeCoordinates: [32341,31789,7], },
  { id: "Chor", name: "Chor", largeCoordinates: [32956,32843,7], },
  { id: "Cormaya", name: "Cormaya", largeCoordinates: [33302,31970,7], },
  { id: "Darashia", name: "Darashia", largeCoordinates: [33224,32428,7], },
  { id: "Desert", name: "Desert", largeCoordinates: [32653,32117,7], },
  { id: "DragonIsle", name: "Dragon Isle", largeCoordinates: [32781,31603,7], },
  { id: "Drefia", name: "Drefia", largeCoordinates: [32996,32417,7], },
  { id: "Edron", name: "Edron", largeCoordinates: [33191,31818,7], },
  { id: "Efreet", name: "Efreet", largeCoordinates: [33053,32622,6], },
  { id: "Elvenbane", name: "Elvenbane", largeCoordinates: [32590,31657,7], },
  { id: "Eremo", name: "Eremo", largeCoordinates: [33323,31883,7], },
  { id: "Fibula", name: "Fibula", largeCoordinates: [32176,32437,7], },
  { id: "FibulaDungeon", name: "Fibula Dungeon", largeCoordinates: [32189,32426,9], },
  { id: "Fieldofglory", name: "Field of glory", largeCoordinates: [32430,31671,7], },
  { id: "Folda", name: "Folda", largeCoordinates: [32046,31582,7], },
  { id: "Ghostlands", name: "Ghostlands", largeCoordinates: [32223,31831,7], },
  { id: "Ghostship", name: "Ghostship", largeCoordinates: [33325,32173,6], },
  { id: "Greenshore", name: "Greenshore", largeCoordinates: [32273,32053,7], },
  { id: "Havoc", name: "Havoc", largeCoordinates: [32783,32243,6], },
  { id: "HellsGate", name: "Hell's Gate", largeCoordinates: [32675,31648,10], },
  { id: "Hills", name: "Hills", largeCoordinates: [32553,31827,6], },
  { id: "Home", name: "Home", largeCoordinates: [32316,31942,7], },
  { id: "Kazordoon", name: "Kazordoon", largeCoordinates: [32632,31916,8], },
  { id: "KingsIsle", name: "KingsIsle", largeCoordinates: [32174,31940,7], },
  { id: "Marid", name: "Marid", largeCoordinates: [33103,32539,6], },
  { id: "Minoroom", name: "Mino room", largeCoordinates: [32139,32109,11], },
  { id: "Minocity", name: "Mintwallin", largeCoordinates: [32404,32124,15], },
  { id: "Mists", name: "Mists", largeCoordinates: [32854,32333,6], },
  { id: "Necropolis", name: "Necropolis", largeCoordinates: [32786,31683,14], },
  { id: "NewbieStart", name: "Newbie Start", largeCoordinates: [32097,32219,7], },
  { id: "Northport", name: "Northport", largeCoordinates: [32486,31610,7], },
  { id: "Oasis", name: "Oasis", largeCoordinates: [33132,32661,7], },
  { id: "Orc", name: "Orc", largeCoordinates: [32901,31771,7], },
  { id: "PortHope", name: "PortHope", largeCoordinates: [32623,32753,7], },
  { id: "Rookgaard", name: "Rookgaard", largeCoordinates: [32097,32207,7], },
  { id: "Senja", name: "Senja", largeCoordinates: [32125,31667,7], },
  { id: "Shadowthorn", name: "Shadowthorn", largeCoordinates: [33086,32157,7], },
  { id: "Sternum", name: "Sternum", largeCoordinates: [32463,32077,7], },
  { id: "Stonehome", name: "Stonehome", largeCoordinates: [33319,31766,7], },
  { id: "Swamp", name: "Swamp", largeCoordinates: [32724,31976,6], },
  { id: "Thais", name: "Thais", largeCoordinates: [32369,32215,7], },
  { id: "Trapwood", name: "Trapwood", largeCoordinates: [32709,32901,8], },
  { id: "Trollcaves", name: "Troll caves", largeCoordinates: [32493,32259,8], },
  { id: "Vega", name: "Vega", largeCoordinates: [32027,31692,7], },
  { id: "Venore", name: "Venore", largeCoordinates: [32955,32076,6], },
  { id: "VenoreDragons", name: "Venore Dragons", largeCoordinates: [32793,32155,8], },
  { id: "VeteranStart", name: "Veteran Start", largeCoordinates: [32369,32241,7], },
];
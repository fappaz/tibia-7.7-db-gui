
export const getTibiaMapsUrl = (coordinates = []) => `https://tibiamaps.io/map#${coordinates.join(',')}:1`;

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

/** i.e.: how much smaller the map in version 7.7 was compared to current version 13.x */
const VERSION_7_70_WIDTH_DELTA = 128;
const VERSION_7_70_HEIGHT_DELTA = 512;

// v 7.7:
// export const MIN_X = 31872; // 128 more than today
// export const MIN_Y = 31488; // 512 more than today

// v 13.x:
export const MIN_X = 31744;
export const MIN_Y = 30976;
// export const MIN_X = 0;
// export const MIN_Y = 0;
export const AUTOMAP_WIDTH = 2560;
export const AUTOMAP_HEIGHT = 2048;
export const MAX_X = MIN_X + AUTOMAP_WIDTH;
export const MAX_Y = MIN_Y + AUTOMAP_HEIGHT;

export const mapMiddle = [(MIN_X + MAX_X) / 2, (MIN_Y + MAX_Y) / 2, 7];

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

export function pixelsToLatLng([x, y, z]) {
  const lat = MAX_Y * 2 - y - AUTOMAP_HEIGHT;
  const lng = x;
  return [lat, lng, z];
}

export function latLngToPixels([lat, lng, z]) {
  const x = lng;
  const y = MAX_Y * 2 - lat - AUTOMAP_HEIGHT;
  return [x, y, z];
}

/** Retrieved from `dat/map.dat` */
export const landmarks = [
  { id: "AbDendriel", name: "Ab'Dendriel", coordinates: [32661,31687,7], },
  { id: "Amazons", name: "Amazon Camp", coordinates: [32839,31925,7], },
  { id: "Ankrahmun", name: "Ankrahmun", coordinates: [33162,32802,7], },
  { id: "Banuta", name: "Banuta", coordinates: [32812,32559,7], },
  { id: "Camp", name: "Camp", coordinates: [32655,32208,7], },
  { id: "Carlin", name: "Carlin", coordinates: [32341,31789,7], },
  { id: "Chor", name: "Chor", coordinates: [32956,32843,7], },
  { id: "Cormaya", name: "Cormaya", coordinates: [33302,31970,7], },
  { id: "Darashia", name: "Darashia", coordinates: [33224,32428,7], },
  { id: "Desert", name: "Desert", coordinates: [32653,32117,7], },
  { id: "DragonIsle", name: "Dragon Isle", coordinates: [32781,31603,7], },
  { id: "Drefia", name: "Drefia", coordinates: [32996,32417,7], },
  { id: "Edron", name: "Edron", coordinates: [33191,31818,7], },
  { id: "Efreet", name: "Efreet", coordinates: [33053,32622,6], },
  { id: "Elvenbane", name: "Elvenbane", coordinates: [32590,31657,7], },
  { id: "Eremo", name: "Eremo", coordinates: [33323,31883,7], },
  { id: "Fibula", name: "Fibula", coordinates: [32176,32437,7], },
  { id: "FibulaDungeon", name: "Fibula Dungeon", coordinates: [32189,32426,9], },
  { id: "Fieldofglory", name: "Field of Glory", coordinates: [32430,31671,7], },
  { id: "Folda", name: "Folda", coordinates: [32046,31582,7], },
  { id: "Ghostlands", name: "Ghostlands", coordinates: [32223,31831,7], },
  { id: "Ghostship", name: "Ghostship", coordinates: [33325,32173,6], },
  { id: "Greenshore", name: "Greenshore", coordinates: [32273,32053,7], },
  { id: "Havoc", name: "Havoc", coordinates: [32783,32243,6], },
  { id: "HellsGate", name: "Hell's Gate", coordinates: [32675,31648,10], },
  { id: "Hills", name: "Hills", coordinates: [32553,31827,6], },
  { id: "Home", name: "Home", coordinates: [32316,31942,7], },
  { id: "Kazordoon", name: "Kazordoon", coordinates: [32632,31916,8], },
  { id: "KingsIsle", name: "Kings Isle", coordinates: [32174,31940,7], },
  { id: "Marid", name: "Marid", coordinates: [33103,32539,6], },
  { id: "Minoroom", name: "Mino room", coordinates: [32139,32109,11], },
  { id: "Minocity", name: "Mintwallin", coordinates: [32404,32124,15], },
  { id: "Mists", name: "Mists", coordinates: [32854,32333,6], },
  { id: "Necropolis", name: "Necropolis", coordinates: [32786,31683,14], },
  { id: "NewbieStart", name: "Newbie Start", coordinates: [32097,32219,7], },
  { id: "Northport", name: "Northport", coordinates: [32486,31610,7], },
  { id: "Oasis", name: "Oasis", coordinates: [33132,32661,7], },
  { id: "Orc", name: "Orc Fortress", coordinates: [32901,31771,7], },
  { id: "PortHope", name: "PortHope", coordinates: [32623,32753,7], },
  { id: "Rookgaard", name: "Rookgaard", coordinates: [32097,32207,7], },
  { id: "Senja", name: "Senja", coordinates: [32125,31667,7], },
  { id: "Shadowthorn", name: "Shadowthorn", coordinates: [33086,32157,7], },
  { id: "Sternum", name: "Mount Sternum", coordinates: [32463,32077,7], },
  { id: "Stonehome", name: "Stonehome", coordinates: [33319,31766,7], },
  { id: "Swamp", name: "Swamp", coordinates: [32724,31976,6], },
  { id: "Thais", name: "Thais", coordinates: [32369,32215,7], },
  { id: "Trapwood", name: "Trapwood", coordinates: [32709,32901,8], },
  { id: "Trollcaves", name: "Troll caves", coordinates: [32493,32259,8], },
  { id: "Vega", name: "Vega", coordinates: [32027,31692,7], },
  { id: "Venore", name: "Venore", coordinates: [32955,32076,6], },
  { id: "VenoreDragons", name: "Venore Dragons", coordinates: [32793,32155,8], },
  { id: "VeteranStart", name: "Veteran Start", coordinates: [32369,32241,7], },
];
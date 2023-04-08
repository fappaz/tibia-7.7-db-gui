
export const getTibiaMapsUrl = (coordinates = []) => `https://tibiamaps.io/map#${coordinates.join(',')}:1`;

// cipfried is +13x, +39y away from doublet (maybe at 1002-1006-07)
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

  const shortX = ( Math.floor((x - TIBIA_MAPS_ABSOLUTE_MIN_X) / TIBIA_MAPS_MAX_INCREMENT) + TIBIA_MAPS_RELATIVE_MIN_X ).toFixed(0);
  const shortY = ( Math.floor((y - TIBIA_MAPS_ABSOLUTE_MIN_Y) / TIBIA_MAPS_MAX_INCREMENT) + TIBIA_MAPS_RELATIVE_MIN_Y ).toFixed(0);
  const shortXDecimals = Math.floor( (x - TIBIA_MAPS_ABSOLUTE_MIN_X) % TIBIA_MAPS_MAX_INCREMENT ).toFixed(0);
  const shortYDecimals = Math.floor( (y - TIBIA_MAPS_ABSOLUTE_MIN_Y) % TIBIA_MAPS_MAX_INCREMENT ).toFixed(0);
  // return `${shortX}.${shortXDecimals},${shortY}.${shortYDecimals},${z}`;
  return [`${shortX}.${shortXDecimals}`,`${shortY}.${shortYDecimals}`,`${z}`];
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
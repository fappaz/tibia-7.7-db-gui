
export const getTibiaMapsUrl = (coordinates = []) => `https://tibiamaps.io/map#${coordinates.join(',')}:1`;

const SECTOR_X_MIN = 996;
const SECTOR_X_MAX = 1043;
const SECTOR_Y_MIN = 984;
const SECTOR_Y_MAX = 1031;
const SECTOR_Z_MIN = 0;
const SECTOR_Z_MAX = 15;
const SECTOR_LENGTH = 32;
const MIN_X = 31872; // 128 more than today
const MIN_Y = 31488; // 512 more than today

/**
 * @deprecated TibiaMaps used to use coordinates like `124.76,121.76,7`, but now it uses like `32437,31729,7`
 * @param {number[]} coordinates The coordinates
 * @returns {string[]} The coordinates in a format that TibiaMaps can use
 */
export const coordinatesToTibiaMapsCoordinates = (coordinates = []) => {
  const [x, y, z] = coordinates;
  const TIBIA_MAPS_ABSOLUTE_MIN_X = 31744;
  const TIBIA_MAPS_ABSOLUTE_MIN_Y = 30976;
  const TIBIA_MAPS_RELATIVE_MIN_X = 124;
  const TIBIA_MAPS_RELATIVE_MIN_Y = 121;
  const TIBIA_MAPS_MAX_INCREMENT = 256;
  const DELTA_X = MIN_X - TIBIA_MAPS_ABSOLUTE_MIN_X;
  const DELTA_Y = MIN_Y - TIBIA_MAPS_ABSOLUTE_MIN_Y;

  const shortX = ( Math.floor((x - TIBIA_MAPS_ABSOLUTE_MIN_X) / TIBIA_MAPS_MAX_INCREMENT) + TIBIA_MAPS_RELATIVE_MIN_X ).toFixed(0);
  const shortY = ( Math.floor((y - TIBIA_MAPS_ABSOLUTE_MIN_Y) / TIBIA_MAPS_MAX_INCREMENT) + TIBIA_MAPS_RELATIVE_MIN_Y ).toFixed(0);
  const shortXDecimals = Math.floor( (x - TIBIA_MAPS_ABSOLUTE_MIN_X) % TIBIA_MAPS_MAX_INCREMENT ).toFixed(0);
  const shortYDecimals = Math.floor( (y - TIBIA_MAPS_ABSOLUTE_MIN_Y) % TIBIA_MAPS_MAX_INCREMENT ).toFixed(0);
  // return `${shortX}.${shortXDecimals},${shortY}.${shortYDecimals},${z}`;
  return [`${shortX}.${shortXDecimals}`,`${shortY}.${shortYDecimals}`,`${z}`];
};
const fs = require('fs');
const Jimp = require('jimp');

/**
 * @TODO (future)
 * - Support parameters (e.g.: source path, target path, etc)
 * - Add jsdoc
 * - Replace `let` with `const` where applicable
 * */

const INTEGER_BYTES = 4;
const SHORT_BYTES = 2;

const FILE_HEADER_BYTES_COUNT = INTEGER_BYTES;
const SPRITE_HEADER_BYTES_COUNT = 3;
const SPRITES_COUNT_BYTES_COUNT = SHORT_BYTES;

const SPRITE_WIDTH = 32;
const SPRITE_HEIGHT = 32;

const readSprite = (fd, spriteId) => {
  let sprite = { id: spriteId };
  let startingPosition;

  startingPosition = FILE_HEADER_BYTES_COUNT + SPRITES_COUNT_BYTES_COUNT + (spriteId - 1) * INTEGER_BYTES;
  let address = readBytes(fd, [INTEGER_BYTES], startingPosition)[0];
  startingPosition = address + SPRITE_HEADER_BYTES_COUNT;

  let totalPixelsCount = readBytes(fd, [SHORT_BYTES], startingPosition)[0]; startingPosition += SHORT_BYTES;
  let colouredPixelIndex = 0;
  let pixelIndex = 0;
  let png = new Jimp(SPRITE_WIDTH, SPRITE_HEIGHT, 0x00000000);

  while (pixelIndex < totalPixelsCount) {
    let transparentPixelsCountUntilColouredPixel = readBytes(fd, [SHORT_BYTES], startingPosition)[0]; startingPosition += SHORT_BYTES;
    let colouredPixelsCountUntilTransparentPixel = readBytes(fd, [SHORT_BYTES], startingPosition)[0]; startingPosition += SHORT_BYTES;
    colouredPixelIndex += transparentPixelsCountUntilColouredPixel;

    for (let i = 0; i < colouredPixelsCountUntilTransparentPixel; i++) {
      let [red, green, blue] = readBytes(fd, [1, 1, 1], startingPosition); startingPosition += 3;
      let x = Math.floor(colouredPixelIndex % SPRITE_WIDTH);
      let y = Math.floor(colouredPixelIndex / SPRITE_HEIGHT);

      red = (red == 0 ? (green == 0 ? (blue == 0 ? 1 : red) : red) : red);

      png.setPixelColour(Jimp.rgbaToInt(red, green, blue, 255), x, y);
      colouredPixelIndex++;
    }

    pixelIndex += (SHORT_BYTES + SHORT_BYTES) + (SPRITE_HEADER_BYTES_COUNT) * colouredPixelsCountUntilTransparentPixel;
  }

  sprite.png = png;
  return sprite;
};

const readSprites = (spriteFilePath, datObjects, listener) => {
  const fd = fs.openSync(spriteFilePath, 'r'); // fileDescription

  let spriteIds = [];
  datObjects.forEach(datObject => {
    datObject.sprite.spriteIds.forEach(spriteId => {
      if (spriteIds.indexOf(spriteId) < 0) {
        let sprite = readSprite(fd, spriteId);
        if (listener) listener(sprite);
        spriteIds.push(spriteId);
      }
    });
  });

};

function readBytes(fd, buffers, startingPosition = null) {
  let totalBytesCount = buffers.reduce((a, b) => a + b, 0);
  let buffer = Buffer.alloc(totalBytesCount);
  let byteGroups = [];
  let pos = 0;
  fs.readSync(fd, buffer, 0, buffer.length, startingPosition);
  buffers.forEach(byteCount => {
    let value = buffer.readUIntLE(pos, byteCount);
    byteGroups.push(value);
    pos += byteCount;
  });
  return byteGroups;
}

async function generateImages() {
  const SPRITE_PATH = './Tibia.spr';
  const PNGS_TARGET_PATH = './images';
  const FIRST_VALID_SPRITE_ID = 1;
  const LAST_VALID_SPRITE_ID = 10961;
  const file = fs.openSync(SPRITE_PATH, 'r');
  /** @TODO investigate why it sometimes it writes 0 bytes to some files when doing 8k+ at once */
  for (let i = FIRST_VALID_SPRITE_ID; i <= LAST_VALID_SPRITE_ID; i++) {
    const sprite = readSprite(file, i);
    const base64 = await sprite.png.getBase64Async(Jimp.MIME_PNG);
    if (`${base64}`.length < 20) {
      console.warn(`Item ${i} base 64 is too short:`, base64);
      continue;
    }
    sprite.png.write(`${PNGS_TARGET_PATH}/${i}.png`);
  }
}

generateImages();
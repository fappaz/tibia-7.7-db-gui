const fs = require('fs');

/**
 * @TODO (future)
 * - Support parameters (e.g.: source path, target path, etc)
 * - Add jsdoc
 * - Replace `let` with `const` where applicable
 * */

let bytesRead = 0;
const readData = (filePath, listener) => {

  let dat = {};
  let fd = fs.openSync(filePath, 'r'); // fileDescription
  let fileSize = fs.statSync(filePath).size;
  const INTEGER_BYTES = 4;
  const SHORT_BYTES = 2;
  bytesRead = 0;

  // Read header
  [dat.signature, dat.maxItemId, dat.maxOutfitId, dat.maxEffectId, dat.maxMissileId] = readBytes(fd, [INTEGER_BYTES, SHORT_BYTES, SHORT_BYTES, SHORT_BYTES, SHORT_BYTES]);
  dat.signature = dat.signature.toString(16);

  /**
   * Dat should be:
   *  maxEffectId:25
      maxItemId:5089
      maxMissileId:15
      maxOutfitId:254
      signature:"439d5a33"
   */

  // console.log(dat);

  const ID_OFFSET = 100; // first item has id = 100
  let spriteIndex = 1;
  let id = ID_OFFSET;
  let value = 0;
  const OBJECT_TYPES = [
    { type: 'item', maxId: dat.maxItemId },
    { type: 'outfit', maxId: dat.maxOutfitId },
    { type: 'effect', maxId: dat.maxEffectId },
    { type: 'missile', maxId: dat.maxMissileId },
  ];
  let objectTypeIndex = 0;

  while (bytesRead < fileSize) {

    if (id > OBJECT_TYPES[objectTypeIndex].maxId) {
      objectTypeIndex++;
      id = 1;
    }

    let gameObject = {
      id: id,
      flags: {},
      type: OBJECT_TYPES[objectTypeIndex].type,
    };

    try {
      do {
        value = readBytes(fd, [1])[0];
        switch (value) {
          case 0x00: // ground
            gameObject.flags.ground = true;
            gameObject.flags.groundSpeed = readBytes(fd, [SHORT_BYTES])[0]; // ground speed
            break;
          case 0x01: // clip
            gameObject.flags.clip = true;
            break;
          case 0x02: // bottom
            gameObject.flags.bottom = true;
            break;
          case 0x03: // top
            gameObject.flags.top = true;
            break;
          case 0x04: // container
            gameObject.flags.container = true;
            break;
          case 0x05: // stackable
            gameObject.flags.stackable = true;
            break;
          case 0x06: // corpse (force use)
            gameObject.flags.corpse = true;
            break;
          case 0x07: // usable
            gameObject.flags.usable = true;
            break;
          case 0x08: // writable
            gameObject.flags.writable = true;
            gameObject.flags.writableLength = readBytes(fd, [SHORT_BYTES])[0]; // maxTextLenght
            break;
          case 0x09: // readable
            gameObject.flags.readable = true;
            gameObject.flags.readableLength = readBytes(fd, [SHORT_BYTES])[0]; // maxTextLenght
            break;
          case 0x0A: // fluid container
            gameObject.flags.fluid = true;
            break;
          case 0x0B: // splash
            gameObject.flags.splash = true;
            break;
          case 0x0C: // blocking
            gameObject.flags.blocking = true;
            break;
          case 0x0D: // not movable
            gameObject.flags.immovable = true;
            break;
          case 0x0E: // blocks missile
            gameObject.flags.blocksMissile = true;
            break;
          case 0x0F: // blocks path
            gameObject.flags.blocksPath = true;
            break;
          case 0x10: // pickupable
            gameObject.flags.pickupable = true;
            break;
          case 0x11: // hangable
            gameObject.flags.hangable = true;
            break;
          case 0x12: // horizontal
            gameObject.flags.horizontal = true;
            break;
          case 0x13: // vertical
            gameObject.flags.vertical = true;
            break;
          case 0x14: // rotatable
            gameObject.flags.rotatable = true;
            break;
          case 0x15: // light info
            gameObject.flags.hasLight = true;
            gameObject.flags.lightLevel = readBytes(fd, [SHORT_BYTES])[0]; // light level
            gameObject.flags.lightColor = readBytes(fd, [SHORT_BYTES])[0]; // light color
            break;
          case 0x16: // don't hide
            gameObject.flags.dontHide = true;
            break;
          case 0x17: // translucent
            gameObject.flags.floorChange = true;
            break;
          case 0x18: // draw offset
            gameObject.flags.hasOffset = true;
            gameObject.flags.offsetX = readBytes(fd, [SHORT_BYTES])[0]; // X
            gameObject.flags.offsetY = readBytes(fd, [SHORT_BYTES])[0]; // Y
            break;
          case 0x19: // height (elevation)
            gameObject.flags.hasHeight = true;
            gameObject.flags.height = readBytes(fd, [SHORT_BYTES])[0]; // height
            break;
          case 0x1A: // lying object
            gameObject.flags.layer = true;
            break;
          case 0x1B: // idle animated
            gameObject.flags.idleAnimated = true;
            break;
          case 0x1C: // minimap
            gameObject.flags.minimap = true;
            gameObject.flags.minimapColor = readBytes(fd, [SHORT_BYTES])[0]; // color
            break;
          case 0x1D: // actions
            gameObject.flags.actioned = true;
            gameObject.flags.actions = readBytes(fd, [SHORT_BYTES])[0];
            /**
             * Supported help bytes:
             * 
             *  0x4C - is ladder
                0x4D - is sewer
                0x4E - is rope spot
                0x4F - is switch
                0x50 - is door
                0x51 - is door with lock
                0x52 - is stairs, doesn't seem to work on all stairs. use is floor change
                0x53 - is mail box
                0x54 - is depot
                0x55 - is trash
                0x56 - is hole
                0x57 - is special description
                0x58 - is read only
             */
            break;
          case 0x1E: // full ground
            gameObject.flags.groundItem = true;
            break;
          case 0xFF: // end of flags
            break;
          default:
            // Unknown byte
            break;
        }

      } while (value != 0xff);

      // Reads sprite
      let sprite = {};
      [sprite.width, sprite.height] = readBytes(fd, [1, 1]);
      if (sprite.width > 1 || sprite.height > 1) {
        sprite.cropImage = readBytes(fd, [1])[0];
      } else {
        sprite.cropImage = -1;
      }
      /**
       * blendFramesCount = used in outfits where colour can be "blended" into a sprite
       * 
       * To understand a repeat, consider a wall.
       * It may have an x repeat of 4. This means that when you draw the wall, 
       * cycle through the x repeat sprites each time you move one tile right. 
       * So the pattern would look like this. 1234123412341234. 
       * if x repeat had == 2, then the pattern would be 1212121212. 
       * If x repeat = 2 and y repeat = 2, such is the case for a table, you would have gotten something that looked like this:
          11 12
          21 22
       */
      [sprite.blendFramesCount, sprite.repeatX, sprite.repeatY, sprite.repeatZ, sprite.animationsCount] = readBytes(fd, [1, 1, 1, 1, 1]);
      let spriteCount = sprite.width * sprite.height * sprite.blendFramesCount * sprite.repeatX * sprite.repeatY * sprite.repeatZ * sprite.animationsCount;
      sprite.spriteIds = readBytes(fd, Array(spriteCount).fill(SHORT_BYTES));
      spriteIndex += spriteCount;
      sprite.index = spriteIndex;

      gameObject.sprite = sprite;
      if (listener) listener(gameObject);
      id++;

    } catch (error) {
      console.log(error);
      break;
    }
  }

  // console.log(JSON.stringify(dat));
}

function readBytes(fd, buffers, startingPosition = null) {
  let totalBytesCount = buffers.reduce((a, b) => a + b, 0);
  let buffer = Buffer.alloc(totalBytesCount);
  let byteGroups = [];
  let pos = 0;
  bytesRead += fs.readSync(fd, buffer, 0, buffer.length, startingPosition);
  buffers.forEach(byteCount => {
    let value = buffer.readUIntLE(pos, byteCount);
    byteGroups.push(value);
    pos += byteCount;
  });
  return byteGroups;
}

async function generateDat() {
  const filePath = "./Tibia.dat";
  const datObjects = [];
  readData(filePath, (gameObject) => {
    // console.log((gameObject));
    datObjects.push(gameObject);
  });
  
  const json = JSON.stringify(datObjects);
  fs.writeFileSync('dat.gmud.json', json);
}

generateDat();
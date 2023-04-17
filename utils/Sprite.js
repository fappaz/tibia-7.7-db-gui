const fs = require('fs');
const { createCanvas, Image } = require('canvas');
const gifFrames = require('gif-frames');
const GIFEncoder = require('gifencoder');
const path = require('path');

const OUTFIT_COLORS = ["#ffffff","#ffd4bf","#ffe9bf","#ffffbf","#e9ffbf","#d4ffbf","#bfffbf","#bfffd4","#bfffe9","#bfffff","#bfe9ff","#bfd4ff","#bfbfff","#d4bfff","#e9bfff","#ffbfff","#ffbfe9","#ffbfd4","#ffbfbf","#dadada","#bf9f8f","#bfaf8f","#bfbf8f","#afbf8f","#9fbf8f","#8fbf8f","#8fbf9f","#8fbfaf","#8fbfbf","#8fafbf","#8f9fbf","#8f8fbf","#9f8fbf","#af8fbf","#bf8fbf","#bf8faf","#bf8f9f","#bf8f8f","#b6b6b6","#bf7f5f","#bf9f5f","#bfbf5f","#9fbf5f","#7fbf5f","#5fbf5f","#5fbf7f","#5fbf9f","#5fbfbf","#5f9fbf","#5f7fbf","#5f5fbf","#7f5fbf","#9f5fbf","#bf5fbf","#bf5f9f","#bf5f7f","#bf5f5f","#919191","#bf6a3f","#bf943f","#bfbf3f","#94bf3f","#6abf3f","#3fbf3f","#3fbf6a","#3fbf94","#3fbfbf","#3f94bf","#3f6abf","#3f3fbf","#6a3fbf","#943fbf","#bf3fbf","#bf3f94","#bf3f6a","#bf3f3f","#6d6d6d","#ff5500","#ffaa00","#ffff00","#a9ff00","#54ff00","#00ff00","#00ff55","#00ffaa","#00ffff","#00a9ff","#0055ff","#0000ff","#5400ff","#aa00ff","#fe00ff","#ff00a9","#ff0055","#ff0000","#484848","#bf3f00","#bf7f00","#bfbf00","#7fbf00","#3fbf00","#00bf00","#00bf3f","#00bf7f","#00bfbf","#007fbf","#003fbf","#0000bf","#3f00bf","#7f00bf","#bf00bf","#bf007f","#bf003f","#bf0000","#242424","#7f2a00","#7f5500","#7f7f00","#547f00","#2a7f00","#007f00","#007f2a","#007f55","#007f7f","#00547f","#002a7f","#00007f","#2a007f","#55007f","#7f007f","#7f0054","#7f002a","#7f0000"];

const OUTFIT_PART_LAYER_COLORS = [
  { part: 'head', color: '#ffff00' },
  { part: 'body', color: '#ff0000' },
  { part: 'legs', color: '#00ff00' },
  { part: 'feet', color: '#0000ff' },
];

const creatureDirections = ['up', 'right', 'down', 'left'];

const buildFilterFramesByDirections = (directions = ['down']) => {
  const filterIndexes = directions.map(direction => typeof direction === 'number' ? direction : creatureDirections.indexOf(direction));
  const filterFrames = ({ dat, outfit, directionIndex, moveIndex }) => {
    const shouldIncludeFrame = dat.type !== 'outfit' || dat.sprite.repeatX <= 1 || filterIndexes.some(index => index === directionIndex);
    // console.log(`Should ${shouldIncludeFrame ? '' : 'NOT '}include frame for { directionIndex, moveIndex}: `, { directionIndex, moveIndex});
    return shouldIncludeFrame;
  };
  return filterFrames;
}

/**
 * @TODO (future) fix some creatures
 *    - spit nettle: some frames are blank
 *    - smuggler, hunter, warlock: wrong colors
 *    - slime: black outline in one of the frames
 *    - black sheep, spider: holes in the sprite
 * @TODO (future) fix sprite of creatures with no outfit id (throwers)
 * @TODO (future) instead of saving the gif, it should return the animations or frames, so the caller can decide which ones to use (useful to save just the creature walking down, for instance)
 * @TODO (future) consider a more modern library, such as https://www.npmjs.com/package/gifwrap
 * @param {Dat} dat The dat object.
 * @param {string} srcPath The path to the sprite images folder.
 * @param {string} targetPath The target path where the gif should be saved.
 * @param {Object} options Options.
 * @param {number} options.delay The delay between frames in milliseconds.
 * @param {number} options.repeat The number of times to repeat the animation. 0 = repeat forever (default), -1 = no repeat.
 * @param {number} options.quality The quality of the gif. 10 = best (default), 1 = worst.
 * @param {number} options.unitWidth The width of each unit in the sprite. Default is 32.
 * @param {number} options.unitHeight The height of each unit in the sprite. Default is 32.
 * @param {string} options.transparentColor The transparent color in the gif. Default is pink pink ('#ff00ff').
 * @param {Outfit} [options.outfit] The outfit to apply to the creature, if any.
 * @param {function} [options.filterFrames] A function that receives relevant data about the frame and should return true if the frame should be included in the gif. If not provided, all frames will be included.
 * @returns {Promise<void>} A promise that resolves when the gif is saved.
 */
async function saveGif(dat, srcPath, targetPath, {
  delay = 300,
  repeat = 0,
  quality = 1,
  unitWidth = 32,
  unitHeight = 32,
  transparentColor = '#ff00ff',
  outfit = {},
  filterFrames,
} = {}) {

  // create canvas with the right size
  const sprite = dat.sprite;
  const width = unitWidth * sprite.width;
  const height = unitHeight * sprite.height;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  // create gif encoder with right parameters
  const encoder = new GIFEncoder(width, height);
  encoder.createWriteStream({ repeat, delay, quality }).pipe(fs.createWriteStream(targetPath));
  encoder.start();
  encoder.setTransparent(parseInt(transparentColor.replace('#', ''), 16));
  
  const directionsCount = sprite.repeatX;
  // const movesCount = sprite.animationsCount;

  let partIndex = 0;
  let partColumn = sprite.width;
  let partRow = sprite.height;
  let layerIndex = 0;

  // let repeatXIndex = 0;
  let directionIndex = 0;
  let moveIndex = 0;

  while (partIndex < sprite.spriteIds.length) {

    // move the "plotter" to the correct coordinates
    const x = (partColumn - 1) * unitWidth;
    const y = (partRow - 1) * unitHeight;
    const isTopLayer = layerIndex === (sprite.blendFramesCount - 1);

    // console.log(`move ${moveIndex}, direction: ${directionIndex}, part ${partIndex}, layer ${layerIndex}`);

    // draw the sprite
    const imageSrc = path.join(srcPath, `${sprite.spriteIds[partIndex]}.png`);
    if (fs.existsSync(imageSrc)) {
      const image = new Image();
      await new Promise((resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = (error) => {
          console.warn(`Error loading image: "${imageSrc}". This could be on purpose though, as sometimes the sprite has an ID of 0.`, error);
        };
        image.src = imageSrc;
      });

      if (image.src) {
        const isOverlayLayer = isTopLayer && sprite.blendFramesCount > 1;
        if (isOverlayLayer) {
          const overlayCanvas = createCanvas(image.width, image.height);
          const overlayContext = overlayCanvas.getContext('2d');
          overlayContext.drawImage(image, 0, 0);

          /** @TODO skip this if it's an item overlay (e.g.: shines on a ring in use) ? */
          const imageData = overlayContext.getImageData(0, 0, image.width, image.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] === 0) continue;
            
            const r = data[i].toString(16).padStart(2, '0');
            const g = data[i + 1].toString(16).padStart(2, '0');
            const b = data[i + 2].toString(16).padStart(2, '0');
            const rgb = `#${r}${g}${b}`;
            
            const layer = OUTFIT_PART_LAYER_COLORS.find(layer => layer.color === rgb);
            if (!layer) continue;
            
            const partColor = outfit.parts[layer.part];
            if (!partColor) continue;

            const newColor = OUTFIT_COLORS[partColor];
            if (!newColor) continue;

            // parse new color from hex string to an array of 3 numbers
            const newColorRgb = newColor.replace('#', '').match(/.{1,2}/g).map(hex => parseInt(hex, 16));
            data[i] = newColorRgb[0];
            data[i + 1] = newColorRgb[1];
            data[i + 2] = newColorRgb[2];
          }
          overlayContext.putImageData(imageData, 0, 0);
          
          // draw overlay image with multiply blend mode, then back to normal mode
          context.globalCompositeOperation = 'multiply';
          context.drawImage(overlayCanvas, x, y, unitWidth, unitHeight);
          context.globalCompositeOperation = 'source-over';
          
        } else {
          context.drawImage(image, x, y, unitWidth, unitHeight);
        }
      }
    };

    // move to the next position
    partIndex++;
    partColumn--;
    if (partColumn <= 0) {
      partColumn = sprite.width;
      partRow--;
      if (partRow <= 0) {
        partRow = sprite.height;

        // if the current layer is the top layer, save the frame and clear the canvas
        if (isTopLayer) {
          // console.log(`Frame is complete`);
          // if there's a frame filter and the current frame is not in the filter, skip it
          if (!filterFrames || filterFrames({ dat, outfit, directionIndex, moveIndex })) {
            // console.log(`Adding frame {directionIndex, moveIndex}: `, {directionIndex, moveIndex} );
            encoder.addFrame(context);
          } 
          context.clearRect(0, 0, canvas.width, canvas.height);
          layerIndex = 0;
          
          directionIndex++;
          if (directionIndex >= directionsCount) {
            directionIndex = 0;
            moveIndex++;
          }
        } else {
          layerIndex++;
        }
      }
    }
  }
}

/**
 * 
 * @TODO jsdoc
 * @param {*} srcPath 
 * @param {*} targetDirPath 
 * @param {*} frames 
 */
async function exportGifFramesToPng(srcPath, targetDirPath, filenamePrefix, frames) {
  try {
    if (!fs.existsSync(srcPath)) return;
    const frameData = await gifFrames({ url: srcPath, frames: frames || 'all', outputType: 'png' });
    for (let i = 0; i < frameData.length; i++) {
      const frame = frameData[i];
      const filepath = path.join(targetDirPath, `${filenamePrefix}-${frames ? frames[i] : i}.png`);
      await frame.getImage().pipe(fs.createWriteStream(filepath));
    }
  } catch (error) {
    console.error(`Failed to save frames "${frames}" from "${srcPath}" to "${targetDirPath}/${filenamePrefix}.png"`, error);
  }
}

module.exports = {
  saveGif,
  exportGifFramesToPng,
  buildFilterFramesByDirections,
};
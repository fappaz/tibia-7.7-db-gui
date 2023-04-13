const fs = require('fs');
const { createCanvas, Image } = require('canvas');
const GIFEncoder = require('gifencoder');
const gifFrames = require('gif-frames');

/**
 * @TODO (future) fix background color in some sprites (e.g.: dragon, lion, etc)
 * @TODO (future) apply outfit colors
 * @TODO (future) fix sprite of creatures with no outfit id (throwers)
 * @TODO (future) instead of saving the gif, it should return the animations or frames, so the caller can decide which ones to use (useful to save just the creature walking down, for instance)
 * @TODO jsdoc
 * @param {Dat} dat The dat object.
 * @param {string} srcPath The path to the sprite images folder.
 * @param {string} targetPath The target path where the gif should be saved.
 * @param {Object} param3 Options.
 */
async function saveGif(dat, srcPath, targetPath, {
  delay = 300,
  repeat = 0,
  quality = 10,
  unitWidth = 32,
  unitHeight = 32,
  transparentColor = 0xff00ff,
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
  encoder.setTransparent(transparentColor);

  const animations = [];

  let spriteIdIndex = 0;
  for (let animationIndex = 0; animationIndex < sprite.animationsCount; animationIndex++) {
    animations[animationIndex] = [];

    for (let repeatXIndex = 0; repeatXIndex < sprite.repeatX; repeatXIndex++) {
      animations[animationIndex][repeatXIndex] = [];

      let partColumn = sprite.width;
      let partRow = sprite.height;
      for (let partIndex = 0; partIndex < sprite.width * sprite.height; partIndex++) {
        if (partColumn <= 0) {
          partColumn = sprite.width;
          partRow--;
        }
        const x = (partColumn - 1) * unitWidth;
        const y = (partRow - 1) * unitHeight;
        partColumn--;
        const spriteId = sprite.spriteIds[spriteIdIndex];
        const imageFile = `${srcPath}/${sprite.spriteIds[spriteIdIndex]}.png`;

        animations[animationIndex][repeatXIndex][partIndex] = { x, y, imageFile };

        // console.log(`${sprite.spriteIds[spriteIdIndex]}, // ${['still','rightfoot','leftfoot'][animationIndex]}, ${['up','right','down','left'][repeatXIndex]}, ${['bottomright','bottomleft','topright','topleft'][partIndex]}`);
        spriteIdIndex++;
      }
    }

  }
  // console.log(JSON.stringify(animations));

  const repeatXIndexFilter = dat.type === 'outfit' ? [2] : null;
  for (const animation of animations) {
    context.fillStyle = `#${transparentColor.toString(16)}`;
    context.fillRect(0, 0, width, height);

    for (i = 0; i < animation.length; i++) {
      if (repeatXIndexFilter && !repeatXIndexFilter.includes(i)) continue;
      const repeatXItem = animation[i];

      for (const part of repeatXItem) {
        
        const image = new Image();
        if (fs.existsSync(part.imageFile)) {
          await new Promise((resolve, reject) => {
            image.onload = () => resolve(image);
            image.onerror = (error) => {
              console.warn(`Error loading image: "${part.imageFile}". This could be on purpose though, as sometimes the sprite has an ID of 0.`, error);
            };
            image.src = part.imageFile;
          });
        };
        if (image.src) {
          context.drawImage(image, part.x, part.y, unitWidth, unitHeight);
        }
      };
      encoder.addFrame(context);
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

  }

  encoder.finish();
}

/**
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
      const filepath = `${targetDirPath}/${filenamePrefix}-${frames[i]}.png`;
      await frame.getImage().pipe(fs.createWriteStream(filepath));
    }
  } catch (error) {
    console.error(`Failed to save frames "${frames}" from "${srcPath}" to "${targetDirPath}/${filenamePrefix}.png"`, error);
  }
}

module.exports = {
  saveGif,
  exportGifFramesToPng,
};
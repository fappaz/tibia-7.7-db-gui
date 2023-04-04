const fs = require('fs');

/**
 * @TODO (future)
 * - Support parameters (e.g.: source path, target path, etc)
 * - Add jsdoc
 * 
 * */

let objectsRaw = '';
try {
  objectsRaw = fs.readFileSync('objects.srv', 'utf8');
} catch (error) {
  console.error(`Failed to load file "objects.srv". Did you move file "tibia-game.tarball/dat/objects.srv" to the same folder as this script?`, error);  
}

const objects = parseTextToJSON(objectsRaw);
fs.writeFileSync('objects.gmud.json', JSON.stringify(objects));

function parseTextToJSON(text) {

  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const result = [];
  let currentItem = {};
  for (let i = 0; i < lines.length; i++) {

    const line = lines[i];
    const separatorIndex = line.indexOf('=');
    const [key, value] = [line.substring(0, separatorIndex), line.substring(separatorIndex + 1)].map(part => part.trim());
    try {
      if (key === 'TypeID') {
        if (Object.keys(currentItem).length > 0) {
          if (!currentItem.Name) {
            currentItem = {};
          } else {
            result.push(currentItem);
          }
        }
        currentItem = { TypeID: parseInt(value) };
      } else if (key === 'Name') {
        currentItem[key] = value.replaceAll(/"/g, '');
        if (currentItem.Name.startsWith('a ') || currentItem.Name.startsWith('an ')) {
          const spaceIndex = currentItem.Name.indexOf(' ');
          const [article, name] = [currentItem.Name.substring(0, spaceIndex), currentItem.Name.substring(spaceIndex + 1)].map(part => part.trim());
          currentItem.Article = article;
          currentItem.Name = name;
        }
      } else if (key === 'Description') {
        currentItem[key] = value.replaceAll(/"/g, '');
      } else if (key === 'Flags') {
        currentItem[key] = value.replaceAll(/[{}]/g, '').split(',').map(flag => flag.trim());
      } else if (key === 'Attributes') {
        currentItem[key] = value.replaceAll(/[{}]/g, '').split(',').reduce((attrs, attr) => {
          const [attrKey, attrValue] = attr.split('=', 2).map(part => part.trim());
          attrs[attrKey] = parseInt(attrValue) || attrValue.replaceAll(/"/g, '');
          if (attrs[attrKey] === '0') attrs[attrKey] = parseInt(attrValue);
          return attrs;
        }, {});
      }
    } catch (error) {
      console.log(`Value: "${value}"`, error);
    }
  }
  if (Object.keys(currentItem).length > 0) {
    result.push(currentItem);
  }
  return result;
}

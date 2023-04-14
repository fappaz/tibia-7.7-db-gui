export const URL = `https://www.tibia.com`;

/**
 * 
 * @param {string} creatureName The creature name, in lower case without spaces.
 * @returns {string} The link to the creature page on the official website.
 */
export const getCreaturePage = (creatureName) => `${URL}/library/?subtopic=creatures&race=${creatureName.replace(' ','')}`;
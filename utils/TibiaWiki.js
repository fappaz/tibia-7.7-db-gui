export const URL = `https://tibia.fandom.com/wiki`;

export const getTibiaWikiUrl = (name) => `${URL}/${name.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join('_')}`;
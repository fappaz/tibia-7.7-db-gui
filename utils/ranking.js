
/**
 * @typedef {Object} RankingSurrounding
 * @property {Number} position - The position of the item in the ranking
 * @property {Number} positionRelativeToItem - The position of the item relative to the item of interest
 * @property {Object} data - The data of the item
 */

/**
 * Get the ranking surroundings of an item
 * @param {Array} ranking - The ranking to get the surroundings from
 * @param {Number} indexOfInterest - The index of the item of interest
 * @param {Object} options - Options
 * @param {Boolean} options.addGap - Whether to add a gap (empty object) between the first and the previous to interest and the last and the next to interest if the position difference is greater than 1
 * @param {Number} options.maxSurroundingItems - The maximum number of items surrounding the item of interest to return
 * @returns {Array<RankingSurrounding>} The ranking surroundings
 */
export function getRankingSurroundings(ranking = [], indexOfInterest, {
  addGap,
  maxSurroundingItems = 1,
  // maxEdgeItems = 1,  /** @TODO (future) support this? */
} = {}) {
  if (!ranking.length) return [];

  let rankingSurroundings = ranking.map((data, index) => {
    const isTop = index === 0;
    const isBottom = index === ranking.length - 1;
    const isInterest = index === indexOfInterest;
    const isSurrounding = Math.abs(index - indexOfInterest) <= maxSurroundingItems;
    const keepItem = isTop || isBottom || isInterest || isSurrounding;
    if (!keepItem) return null;
    return {
      position: index,
      positionRelativeToItem: index - indexOfInterest,
      data,
    }
  }).filter(Boolean);

  if (addGap && rankingSurroundings.length > 1) {
    // Add gap after the first item if the difference between the first and the previous to interest is greater than 1
    if (Math.abs(rankingSurroundings[0].position - rankingSurroundings[1].position) > 1) {
      rankingSurroundings.splice(1, 0, {});
    }
    
    // Add gap before the last item if the difference between the last and the next to interest is greater than 1
    if (Math.abs(rankingSurroundings[rankingSurroundings.length - 1].position - rankingSurroundings[rankingSurroundings.length - 2].position) > 1) {
      rankingSurroundings.splice(rankingSurroundings.length - 1, 0, {});
    }
  }
    
  return rankingSurroundings;
}
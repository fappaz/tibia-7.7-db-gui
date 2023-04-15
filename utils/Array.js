/**
 * Insert an array into another array at a given index.
 * @param {Object[]} array The original array.
 * @param {Object[]} arrayToInsert The array to be inserted at the given index.
 * @param {Number} index The index where the array will be inserted.
 * @returns {Object[]} The new array.
 */
export function insertArrayAt(array, index, arrayToInsert) {
  return [
    ...array.slice(0, index),
    ...arrayToInsert,
    ...array.slice(index)
  ];
}
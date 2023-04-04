/**
 * Round a number.
 * 
 * @example
 * 
 * round(123.688689)     // 124
 * round(123.688689, 0)  // 124
 * round(123.688689, 1)  // 123.7
 * round(123.688689, 2)  // 123.69
 * round(123.688689, -2) // 100
 * 
 * @param {number} value The number to be rounded.
 * @param {number} precision How many decimals a.k.a precision.
 * @returns {number} The number rounded.
 */
export const round = (value, precision) => {
  if (Number.isInteger(precision)) {
    const shift = Math.pow(10, precision);
    return Math.round(value * shift) / shift;
  } else {
    return Math.round(value);
  }
};
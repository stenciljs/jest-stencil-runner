/**
 * Deep equal comparison of two values.
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @returns True if the values are equal, false otherwise.
 */
export function deepEqual(a: any, b: any) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    const arrA = Array.isArray(a),
      arrB = Array.isArray(b);
    let i, length, key;

    if (arrA && arrB) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) if (!deepEqual(a[i], b[i])) return false;
      return true;
    }

    if (arrA != arrB) return false;

    const dateA = a instanceof Date,
      dateB = b instanceof Date;
    if (dateA != dateB) return false;
    if (dateA && dateB) return a.getTime() == b.getTime();

    const regexpA = a instanceof RegExp,
      regexpB = b instanceof RegExp;
    if (regexpA != regexpB) return false;
    if (regexpA && regexpB) return a.toString() == b.toString();

    const keys = Object.keys(a);
    length = keys.length;

    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0; ) {
      key = keys[i];
      if (!deepEqual(a[key], b[key])) return false;
    }

    return true;
  }

  return a !== a && b !== b;
};

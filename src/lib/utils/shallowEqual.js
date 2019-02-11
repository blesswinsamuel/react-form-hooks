// const hasOwn = Object.prototype.hasOwnProperty
//
// function is(x, y) {
//   if (x === y) {
//     return x !== 0 || y !== 0 || 1 / x === 1 / y
//   } else {
//     return false
//     // return x !== x && y !== y
//   }
// }
//
// export default function shallowEqual(objA, objB) {
//   if (is(objA, objB)) return true
//
//   if (
//     typeof objA !== 'object' ||
//     objA === null ||
//     typeof objB !== 'object' ||
//     objB === null
//   ) {
//     return false
//   }
//
//   const keysA = Object.keys(objA)
//   const keysB = Object.keys(objB)
//
//   if (keysA.length !== keysB.length) return false
//
//   for (let i = 0; i < keysA.length; i++) {
//     if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
//       return false
//     }
//   }
//
//   return true
// }

const shallowEqual = (a, b) => {
  if (a === b) {
    return true
  }
  if (typeof a !== 'object' || !a || typeof b !== 'object' || !b) {
    return false
  }
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) {
    return false
  }
  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(b)
  for (let idx = 0; idx < keysA.length; idx++) {
    const key = keysA[idx]
    if (!bHasOwnProperty(key) || a[key] !== b[key]) {
      return false
    }
  }
  return true
}

export default shallowEqual

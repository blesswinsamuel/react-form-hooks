const hasOwnProperty = Object.prototype.hasOwnProperty

export default function shallowEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) {
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
  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i]
    if (!hasOwnProperty.call(b, keysA[i]) || a[key] !== b[key]) {
      return false
    }
  }
  return true
}

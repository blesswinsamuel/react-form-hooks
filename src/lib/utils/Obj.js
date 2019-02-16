const isObject = function(value) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
  // return (!!value) && (value.constructor === Object)
}

const indexRegex = /^\[(\d+)]$/
const isIndex = k => indexRegex.test(k)

export function getProperty(obj, key) {
  const parts = key.replace(/\[(\w+)]/g, '.$1') // convert indexes to properties
    .replace(/^\./, '')  // strip a leading dot
    .split('.')
  let curObj = obj
  for (let i = 0; i < parts.length; ++i) {
    const k = parts[i]
    if (curObj === undefined || curObj === null) {
      return undefined
    }
    if (typeof curObj === 'string') {
      return undefined
    }
    if (k in curObj) {
      curObj = curObj[k]
    } else {
      return undefined
    }
  }
  return curObj
}

export function setProperty(obj, key, value) {
  if (obj === null) {
    return obj
  }
  if (!isObject(obj)) {
    return obj
  }

  const path = key.replace(/\[(\w+)]/g, '.$1') // convert indexes to properties
    .replace(/^\./, '')  // strip a leading dot
    .split('.')
  const newObj = { ...obj }
  let nested = newObj

  for (let i = 0; nested != null && i < path.length; ++i) {
    const key = path[i]
    let newValue = value

    if (i !== path.length - 1) {
      const objValue = nested[key]
      newValue = isObject(objValue)
        ? (Array.isArray(objValue) ? [...objValue] : { ...objValue })
        : (isIndex(path[i + 1]) ? [] : {})
    }

    nested[key] = newValue
    nested = nested[key]
  }
  return newObj
}

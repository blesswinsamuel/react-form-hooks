const isObject = function(a) {
  return (!!a) && (a.constructor === Object)
}

const isArray = function(a) {
  return (!!a) && (a.constructor === Array)
}

const isEmptyObject = (val) => {
  return Object.keys(val).length === 0
}

const isEmptyArray = (val) => {
  return val.length === 0
}

export function dotify(object, mapFn = v => v) {
  function recurse(obj, path = '', acc = {}) {
    if (isArray(obj) && !isEmptyArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const newPath = `${path}[${i}]`
        acc[newPath] = mapFn(obj[i])
        recurse(obj[i], newPath, acc)  // it's a nested object, so do it again
      }
    } else if (isObject(obj) && !isEmptyObject(obj)) { // object
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          const newPath = [path, key].filter(x => x).join('.')
          acc[newPath] = mapFn(obj[key])
          recurse(obj[key], newPath, acc)
        }
      }
    } else if (path === '') {
      return obj
    } else {
      acc[path] = mapFn(obj)
    }
    return acc
  }

  return recurse(object)
}

export function nestify(object, mapFn = v => v) {
  const indexRegex = /^\[(\d+)]$/
  const isIndex = k => indexRegex.test(k)

  const fill = (acc, keyParts, value) => {
    const k = keyParts.shift().replace(indexRegex, '$1') // 1st element returned and is also removed from keyParts

    if (keyParts.length > 0) {
      acc[k] = acc[k] || (isIndex(keyParts[0]) ? [] : {})

      fill(acc[k], keyParts, value)
    } else {
      acc[k] = mapFn(value)
    }
  }

  if (isArray(object) || !isObject(object)) {
    return mapFn(object)
  }

  const result = Object.keys(object).every(isIndex) ? [] : {}
  for (const path in object) {
    if (object.hasOwnProperty(path)) {
      const keyPath = path
        .replace(/(?<!^)(\[\d+])/g, '.$1') // convert indexes to properties
      const keyParts = keyPath.split('.')
      fill(result, keyParts, object[path])
    }
  }

  return result
}

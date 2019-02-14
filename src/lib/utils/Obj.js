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

export function dotify(object) {
  function recurse(obj, path = '', acc = {}) {
    if (isArray(obj) && !isEmptyArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        recurse(obj[i], `${path}[${i}]`, acc)  // it's a nested object, so do it again
      }
    } else if (isObject(obj) && !isEmptyObject(obj)) { // object
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          recurse(obj[key], [path, key].filter(x => x).join('.'), acc)
        }
      }
    } else if (path === '') {
      return obj
    } else {
      acc[path] = obj
    }
    return acc
  }

  return recurse(object)
}

export function nestify(object, mapFn = v => v) {
  function recurse(obj, path, acc = {}) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const keyParts = key.split('.')
        for (let i = 0, last = acc; i < keyParts.length; i++) {
          const keyPart = keyParts[i]
          if (!last[keyPart]) {
            last[keyPart] = {}
          }
          if (i === keyParts.length - 1) {
            last[keyPart] = mapFn(obj[key])
          }
          last = last[keyPart]
        }
      }
    }
  }

  return recurse(object)
}

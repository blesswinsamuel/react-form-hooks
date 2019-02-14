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
  function recurse(obj, path = [], acc = {}) {
    if (isArray(obj) && !isEmptyArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        recurse(obj[i], path.concat(`[${i}]`), acc)  // it's a nested object, so do it again
      }
    } else if (isObject(obj) && !isEmptyObject(obj)) { // object
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          recurse(obj[key], path.concat(key), acc)
        }
      }
    } else {
      acc[path.join('.')] = obj
    }
    return acc
  }

  // console.log("REC", recurse(object))

  return recurse(object)
}

export function nestify(object, mapFn = v => v) {
  function recurse(obj, current, acc = {}) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const keyParts = key.split('.')
        recurse()
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

const isObject = function(value: any) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
  // return (!!value) && (value.constructor === Object)
}

const isIndex = (k: string) => /^(\d+)$/.test(k)

export function getProperty(obj: { [key: string]: any }, key: string): any {
  const parts = key
    .replace(/\[(\w+)]/g, '.$1') // convert indexes to properties
    .replace(/^\./, '') // strip a leading dot
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

export function setProperty(obj: any, key: string, value: any): any {
  if (obj === null) {
    return obj
  }
  if (!isObject(obj)) {
    return obj
  }

  const path = key
    .replace(/\[(\w+)]/g, '.$1') // convert indexes to properties
    .replace(/^\./, '') // strip a leading dot
    .split('.')
  const newObj = { ...obj }
  let nested = newObj

  for (let i = 0; nested != null && i < path.length; ++i) {
    const key = path[i]
    let newValue = value

    if (i !== path.length - 1) {
      const objValue = nested[key]
      if (isObject(objValue)) {
        newValue = Array.isArray(objValue) ? [...objValue] : { ...objValue }
      } else {
        newValue = isIndex(path[i + 1]) ? [] : {}
      }
    }

    nested[key] = newValue
    nested = nested[key]
  }
  return newObj
}

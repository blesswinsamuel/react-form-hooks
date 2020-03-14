import { getProperty, setProperty } from './property'

const obj1 = {
  name: {
    firstname: 'john',
    lastname: 'doe',
  },
  array: [1, 2],
  nestedArray: [[10, 20]],
  arrayEmpty: [],
  obj: [
    {
      title: 'abc',
      description: 'desc',
    },
    1,
    {},
    null,
    'str',
  ],
  objEmpty: {},
  email: 'asdf@dsa.com',
  checkAlways: 'present',
}

describe('getProperty', () => {
  const getPropertyTests: any[][] = [
    [obj1, 'name.firstname', 'john'],
    [obj1, 'array[0]', 1],
    [obj1, 'arrayEmpty', []],
    [obj1, 'obj[0].title', 'abc'],
    [obj1, 'obj[0].nonexisting', undefined],
    [obj1, 'obj[10].nonexisting', undefined],
    [obj1, 'obj[3].nonexisting', undefined],
    [obj1, 'obj[3]', null],
    [obj1, 'obj[4]', 'str'],
    [obj1, 'obj[4].nonexisting', undefined],
  ]

  test.each(getPropertyTests)('getProperty works', (obj, field, expected) => {
    expect(getProperty(obj, field)).toEqual(expected)
  })
})

describe('setProperty', () => {
  const setPropertyPrimitiveTests: [object, string, any, string, any][] = [
    [obj1, 'name.firstname', 'j', 'name', { firstname: 'j', lastname: 'doe' }],
    [obj1, 'array[0]', 12, 'array', [12, 2]],
    [obj1, 'arrayEmpty', [1, 2], 'arrayEmpty', [1, 2]],
    [obj1, 'obj[0].nonexisting', 5, 'obj[0].nonexisting', 5],
    [obj1, 'new.field', 1, 'new', { field: 1 }],
    [obj1, 'new.field[0].value', 1, 'new', { field: [{ value: 1 }] }],
  ]
  test.each(setPropertyPrimitiveTests)(
    'setProperty works',
    (obj, field, value, testField, expectedValue) => {
      const newObj = setProperty(obj, field, value)
      expect(getProperty(newObj, testField)).toEqual(expectedValue)
      expect(getProperty(obj, 'checkAlways')).toEqual('present')
    }
  )

  const referenceTests: [object, string, any, string][] = [
    [obj1, 'name.firstname', 'don', 'name'],
    [obj1, 'array[0]', 12, 'array'],
    [obj1, 'arrayEmpty', [1, 2], 'arrayEmpty'],
    [obj1, 'obj[0].title', 'abcd', 'obj[0]'],
  ]
  test.each(referenceTests)(
    'setProperty referential works',
    (obj, field, value, checkField) => {
      const initialValue = getProperty(obj, checkField)
      const newObj = setProperty(obj, field, value)
      const newValue = getProperty(newObj, checkField)
      expect(getProperty(newObj, field)).toEqual(value)
      expect(obj).not.toBe(newObj)
      expect(initialValue).not.toBe(newValue)
      expect(getProperty(obj, 'checkAlways')).toEqual('present')
    }
  )

  const typeTests: any[][] = [
    [obj1, 'name.firstname', 'john', 'name'],
    [obj1, 'array[0]', 1, 'array'],
    [obj1, 'arrayEmpty', [], 'arrayEmpty'],
    [obj1, 'obj[0].title', 'abc', 'obj[0]'],
  ]
  test.each(typeTests)(
    'setProperty type works',
    (obj, field, value, checkField) => {
      const initialValue = getProperty(obj, checkField)
      const newObj = setProperty(obj, field, value)
      const newValue = getProperty(newObj, checkField)
      expect(getProperty(newObj, field)).toEqual(value)
      expect(obj).not.toBe(newObj)
      expect(initialValue).not.toBe(newValue)
      expect(initialValue).toEqual(newValue)
      expect(getProperty(obj, 'checkAlways')).toEqual('present')
    }
  )

  it('woks when called on bad values', () => {
    let newObj
    newObj = setProperty(null, 'abc', 12)
    expect(newObj).toEqual({ abc: 12 })
    newObj = setProperty(undefined, 'abc', 12)
    expect(newObj).toEqual({ abc: 12 })
    newObj = setProperty({}, 'abc', 12)
    expect(newObj).toEqual({ abc: 12 })
    newObj = setProperty(1, 'abc', 12)
    expect(newObj).toEqual({ abc: 12 })
    newObj = setProperty([], 'abc', 12)
    expect(newObj).toEqual({ abc: 12 })
    newObj = setProperty('', 'abc', 12)
    expect(newObj).toEqual({ abc: 12 })
    newObj = setProperty('mystr', 'abc', 12)
    expect(newObj).toEqual({
      '0': 'm',
      '1': 'y',
      '2': 's',
      '3': 't',
      '4': 'r',
      abc: 12,
    })
  })
})

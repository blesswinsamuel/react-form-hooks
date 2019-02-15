import React from 'react'
import { getProperty, setProperty } from './Obj'

const obj1 = {
  name: {
    firstname: 'dan',
    lastname: 'abramov',
  },
  array: [1, 2],
  nestedArray: [
    [10, 20],
  ],
  arrayEmpty: [],
  obj: [
    {
      title: 'abc',
      description: 'desc',
    },
    1,
    {},
    null,
    'str'
  ],
  objEmpty: {},
  email: 'asdf@dsa.com',
  checkAlways: 'present',
}

const getPropertyTests = [
  [obj1, 'name.firstname', 'dan'],
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

test.each(getPropertyTests)(
  'getProperty works',
  (obj, field, expected) => {
    expect(getProperty(obj, field)).toEqual(expected)
  },
)

const setPropertyPrimitiveTests = [
  [obj1, 'name.firstname', 'don'],
  [obj1, 'array[0]', 12],
  [obj1, 'arrayEmpty', [1, 2]],
  [obj1, 'obj[0].title', 'abcd'],
]

test.each(setPropertyPrimitiveTests)(
  'setProperty works',
  (obj, field, value) => {
    const newObj = setProperty(obj, field, value)
    expect(getProperty(newObj, field)).toEqual(value)
    expect(getProperty(obj, 'checkAlways')).toEqual('present')
  },
)

const setPropertyReferenceTests = [
  [obj1, 'name.firstname', 'don', 'name'],
  [obj1, 'array[0]', 12, 'array'],
  [obj1, 'arrayEmpty', [1, 2], 'arrayEmpty'],
  [obj1, 'obj[0].title', 'abcd', 'obj[0]'],
]

test.each(setPropertyReferenceTests)(
  'setProperty referential works',
  (obj, field, value, checkField) => {
    const initialValue = getProperty(obj, checkField)
    const newObj = setProperty(obj, field, value)
    const newValue = getProperty(newObj, checkField)
    expect(getProperty(newObj, field)).toEqual(value)
    expect(obj).not.toBe(newObj)
    expect(initialValue).not.toBe(newValue)
    expect(getProperty(obj, 'checkAlways')).toEqual('present')
  },
)

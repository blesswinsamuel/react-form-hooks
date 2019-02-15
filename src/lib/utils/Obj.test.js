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
    null
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
]

test.each(getPropertyTests)(
  'getProperty works',
  (obj, field, expected) => {
    expect(getProperty(obj, field)).toEqual(expected)
  },
)

const setPropertyTests = [
  [obj1, 'name.firstname', 'don'],
  [obj1, 'array[0]', 12],
  [obj1, 'arrayEmpty', [1, 2]],
  [obj1, 'obj[0].title', 'abcd'],
]

test.each(setPropertyTests)(
  'setProperty works',
  (obj, field, value) => {
    const newObj = setProperty(obj, field, value)
    expect(getProperty(obj, field)).toEqual(value)
    expect(getProperty(obj, 'checkAlways')).toEqual('present')
  },
)

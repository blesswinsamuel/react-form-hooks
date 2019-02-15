import React from 'react'
import { dotify, nestify } from './Obj'

const tests = [
  [
    {
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
      ],
      objEmpty: {},
      email: 'asdf@dsa.com',
    },
    {
      name: {
        firstname: 'dan',
        lastname: 'abramov',
      },
      'name.firstname': 'dan',
      'name.lastname': 'abramov',
      array: [1, 2],
      'array[0]': 1,
      'array[1]': 2,
      nestedArray: [
        [10, 20],
      ],
      'nestedArray[0]': [10, 20],
      'nestedArray[0][0]': 10,
      'nestedArray[0][1]': 20,
      'arrayEmpty': [],
      obj: [
        {
          title: 'abc',
          description: 'desc',
        },
        1,
        {},
      ],
      'obj[0]': {
        title: 'abc',
        description: 'desc',
      },
      'obj[0].title': 'abc',
      'obj[0].description': 'desc',
      'obj[1]': 1,
      'obj[2]': {},
      'objEmpty': {},
      'email': 'asdf@dsa.com',
    },
  ],
  ['test', 'test'],
  [[1, 2], { '[0]': 1, '[1]': 2 }],
]

test.each(tests)(
  'dotify works',
  (input, expected) => {
    expect(dotify(input)).toEqual(expected)
  },
)

test.each(tests)(
  'nestify works',
  (expected, input) => {
    expect(nestify(input)).toEqual(expected)
  },
)

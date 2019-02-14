import React from 'react';
import {dotify,nestify} from './Obj';

const nested = {
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
  ],
  objEmpty: {},
  email: 'asdf@dsa.com',
}

const dotted = {
  'name.firstname': 'dan',
  'name.lastname': 'abramov',
  'array[0]': 1,
  'array[1]': 2,
  'nestedArray[0][0]': 10,
  'nestedArray[0][1]': 20,
  "arrayEmpty": [],
  'obj[0].title': 'abc',
  'obj[0].description': 'desc',
  'objEmpty': {},
  'email': 'asdf@dsa.com',
}

test.each([
  [nested, dotted],
  ["test", "test"],
  [[1, 2], {'[0]': 1, "[1]": 2 }]
])(
  'dotify works',
  (input, expected) => {
    expect(dotify(input)).toEqual(expected)
  }
)

it('nestify works', () => {
  expect(nestify(dotted)).toEqual(nested);
});

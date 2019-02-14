import React from 'react';
import {dotify,nestify} from './Obj';

const nested = {
  name: {
    firstname: 'dan',
    lastname: 'abramov',
  },
  array: [1, 2],
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
  "arrayEmpty": [],
  'obj[0].title': 'abc',
  'obj[0].description': 'desc',
  'objEmpty': {},
  'email': 'asdf@dsa.com',
}

it('dotify works', () => {
  expect(dotify(nested)).toEqual(dotted);
});

it('nestify works', () => {
  expect(nestify(dotted)).toEqual(nested);
});

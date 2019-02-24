const examples = [
  {
    text: 'Getting Started',
    link: '/examples/getting-started',
  },
  {
    text: 'Basic Form',
    link: '/examples/basic',
  },
  {
    text: 'Field types example',
    link: '/examples/field-types',
  },
  {
    text: 'Nested Fields',
    link: '/examples/nested',
  },
]

const recipes = [
  {
    text: 'FormField.js',
    link: '/recipes/form-field',
  },
  {
    text: 'ArrayFormField.js',
    link: '/recipes/array-form-field',
  },
  {
    text: 'FormFooter.js',
    link: '/recipes/form-footer',
  },
  {
    text: 'Components.js',
    link: '/recipes/components',
  },
]

const menu = [
  {
    text: 'Getting Started',
    link: '/getting-started',
  },
  {
    text: 'API',
    link: '/api',
  },
  {
    text: 'Examples',
    link: '/examples',
    children: examples,
  },
  {
    text: 'Recipes',
    link: '/recipes',
    children: recipes,
  },
  {
    text: 'GitHub',
    href: 'https://github.com/blesswinsamuel/react-form-hooks',
  },
]

module.exports = { examples, recipes, menu, default: menu }

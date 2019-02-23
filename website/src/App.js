/* eslint import/no-webpack-loader-syntax: off */
import React from 'react'
import { Link, Router } from '@reach/router'
import { Layout } from './components'
import NotFound from './components/NotFound'
import Home from './Home'
import Markdown from './components/Markdown'
import Example from './components/Example'
import Recipe from './components/Recipe'

const examples = [
  {
    text: 'Getting Started (hooks)',
    link: '/examples/plain-hooks',
    component: require('./examples/GettingStartedHooks').default,
    code: require('!raw-loader!./examples/GettingStartedHooks'),
  },
  {
    text: 'Getting Started (render props)',
    link: '/examples/plain-render-props',
    component: require('./examples/GettingStartedRenderProps').default,
    code: require('!raw-loader!./examples/GettingStartedRenderProps'),
  },
  {
    text: 'Basic Form (hooks)',
    link: '/examples/basic',
    component: require('./examples/BasicHooks').default,
    code: require('!raw-loader!./examples/BasicHooks'),
  },
  {
    text: 'Basic Form (render props)',
    link: '/examples/renderprops',
    component: require('./examples/BasicRenderProps').default,
    code: require('!raw-loader!./examples/BasicRenderProps'),
  },
  {
    text: 'Field types example',
    link: '/examples/field-types',
    component: require('./examples/FieldTypesExample').default,
    code: require('!raw-loader!./examples/FieldTypesExample'),
  },
  {
    text: 'Nested Fields',
    link: '/examples/nested',
    component: require('./examples/NestedForm').default,
    code: require('!raw-loader!./examples/NestedForm'),
  },
]

const recipes = [
  {
    text: 'FormField.js',
    link: '/recipes/form-field',
    code: require('!raw-loader!./recipes/FormField'),
  },
  {
    text: 'ArrayFormField.js',
    link: '/recipes/array-form-field',
    code: require('!raw-loader!./recipes/ArrayFormField'),
  },
  {
    text: 'FormFooter.js',
    link: '/recipes/form-footer',
    code: require('!raw-loader!./recipes/FormFooter'),
  },
  {
    text: 'Components.js',
    link: '/recipes/components',
    code: require('!raw-loader!./recipes/Components'),
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

const ExamplesIndex = ({ examples }) => {
  return (
    <>
      <h1>Examples</h1>
      <ul>
        {examples.map((example, i) => (
          <li key={i}>
            <Link to={example.link}>{example.text}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

const RecipesIndex = ({ recipes }) => {
  return (
    <>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe, i) => (
          <li key={i}>
            <Link to={recipe.link}>{recipe.text}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

const App = () => {
  return (
    <Layout menu={menu}>
      <Router>
        <Home path="/" />
        <Markdown
          path="/getting-started"
          input={require('!raw-loader!./docs/GettingStarted.md')}
        />
        <Markdown path="/api" input={require('!raw-loader!./docs/API.md')} />
        <ExamplesIndex
          examples={examples}
          path="/examples"
        />
        {examples.map((example, i) => (
          <Example
            key={i}
            path={example.link}
            title={example.text}
            component={example.component}
            code={example.code}
          />
        ))}
        <RecipesIndex
          recipes={menu.find(menu => menu.link === '/recipes').children}
          path="/recipes"
        />
        {recipes.map((recipe, i) => (
          <Recipe
            key={i}
            path={recipe.link}
            title={recipe.text}
            code={recipe.code}
          />
        ))}
        <NotFound default />
      </Router>
    </Layout>
  )
}

export default App

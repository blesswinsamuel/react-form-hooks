/* eslint import/no-webpack-loader-syntax: off */
import React from 'react'
import { Link, Router } from '@reach/router'
import { Layout } from './components'
import NotFound from './components/NotFound'
import Home from './Home'
import Markdown from './components/Markdown'
import Example from './components/Example'

const examples = [
  {
    text: 'Plain example (hooks)',
    link: '/examples/plain-hooks',
    component: require('./examples/PlainHooks').default,
    code: require('!raw-loader!./examples/PlainHooks'),
  },
  {
    text: 'Plain example (render props)',
    link: '/examples/plain-render-props',
    component: require('./examples/PlainRenderProps').default,
    code: require('!raw-loader!./examples/PlainRenderProps'),
  },
  {
    text: 'Basic Form',
    link: '/examples/basic',
    component: require('./examples/BasicForm').default,
    code: require('!raw-loader!./examples/BasicForm'),
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
  {
    text: 'Using render props',
    link: '/examples/renderprops',
    component: require('./examples/RenderProps').default,
    code: require('!raw-loader!./examples/RenderProps'),
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
    children: examples.map(example => ({
      text: example.text,
      link: example.link,
    })),
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
          examples={menu.find(menu => menu.link === '/examples').children}
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
        <NotFound default />
      </Router>
    </Layout>
  )
}

export default App

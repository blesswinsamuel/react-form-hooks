/* eslint import/no-webpack-loader-syntax: off */
import React from 'react'
import { Link, Router } from '@reach/router'
import { Layout } from './components'
import NotFound from './components/NotFound'
import Home from './Home'
import Markdown from './components/Markdown'
import Example from './components/Example'

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
    children: [
      { text: 'Basic Form', link: '/examples/basic' },
      { text: 'Simple Form', link: '/examples/simple' },
      { text: 'Nested Fields', link: '/examples/nested' },
      { text: 'Using render props', link: '/examples/renderprops' },
    ],
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
        <Example
          path="/examples/basic"
          title="Basic Example"
          component={require('./examples/BasicForm').default}
          code={require('!raw-loader!./examples/BasicForm')}
        />
        <Example
          path="/examples/simple"
          title="Simple Form"
          component={require('./examples/SimpleForm').default}
          code={require('!raw-loader!./examples/SimpleForm')}
        />
        <Example
          path="/examples/nested"
          title="Nested Form"
          component={require('./examples/NestedForm').default}
          code={require('!raw-loader!./examples/NestedForm')}
        />
        <Example
          path="/examples/renderprops"
          title="Form using render props"
          component={require('./examples/RenderProps').default}
          code={require('!raw-loader!./examples/RenderProps')}
        />
        <NotFound default />
      </Router>
    </Layout>
  )
}

export default App

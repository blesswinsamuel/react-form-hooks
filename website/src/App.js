/* eslint import/no-webpack-loader-syntax: off */
import React from 'react'
import { Link, Router } from '@reach/router'
import NestedForm from './examples/NestedForm'
import SimpleForm from './examples/SimpleForm'
import BasicForm from './examples/BasicForm'
import { Layout } from './components'
import NotFound from './components/NotFound'
import Home from './components/Home'
import RenderProps from './examples/RenderProps'
import gettingStartedDoc from '!raw-loader!./docs/GettingStarted.md'
import apiDoc from '!raw-loader!./docs/API.md'
import Markdown from './components/Markdown'

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
        <Markdown path="/getting-started" input={gettingStartedDoc} />
        <Markdown path="/api" input={apiDoc} />
        <ExamplesIndex
          examples={menu.find(menu => menu.link === '/examples').children}
          path="/examples"
        />
        <BasicForm path="/examples/basic" />
        <SimpleForm path="/examples/simple" />
        <NestedForm path="/examples/nested" />
        <RenderProps path="/examples/renderprops" />
        <NotFound default />
      </Router>
    </Layout>
  )
}

export default App

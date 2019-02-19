import React from 'react'
import { Link, Router } from '@reach/router'
import NestedForm from './examples/NestedForm'
import SimpleForm from './examples/SimpleForm'
import Example from './examples/Example'
import { Layout } from './components'
import NotFound from './components/NotFound'
import Home from './components/Home'

const menu = [
  {
    text: 'Examples',
    link: '/examples',
    children: [
      {
        text: 'Simple',
        link: '/examples/simple',
      },
      {
        text: 'Nested',
        link: '/examples/nested',
      },
      {
        text: 'Example',
        link: '/examples/example',
      },
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
        <ExamplesIndex examples={menu[0].children} path="/examples" />
        <SimpleForm path="/examples/simple" />
        <NestedForm path="/examples/nested" />
        <Example path="/examples/example" />
        <NotFound default />
      </Router>
    </Layout>
  )
}

export default App

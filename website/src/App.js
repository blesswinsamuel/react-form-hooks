import React from 'react'
import { Link, Router } from '@reach/router'
import NestedForm from './examples/NestedForm'
import SimpleForm from './examples/SimpleForm'
import Basic from './examples/Basic'
import { Layout } from './components'
import NotFound from './components/NotFound'
import Home from './components/Home'

const menu = [
  {
    text: 'Examples',
    link: '/examples',
    children: [
      { text: 'Basic', link: '/examples/basic' },
      { text: 'Simple', link: '/examples/simple' },
      { text: 'Nested', link: '/examples/nested' },
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
        <Basic path="/examples/basic" />
        <SimpleForm path="/examples/simple" />
        <NestedForm path="/examples/nested" />
        <NotFound default />
      </Router>
    </Layout>
  )
}

export default App

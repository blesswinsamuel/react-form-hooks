import React from 'react'
import { Link, Router } from '@reach/router'
import NestedForm from './examples/NestedForm'
import SimpleForm from './examples/SimpleForm'
import Example from './examples/Example'
import { Layout } from './components'

const menu = [
  {
    text: 'Examples',
    children: [
      {
        text: 'Simple',
        link: '/simple',
      },
      {
        text: 'Nested',
        link: '/nested',
      },
      {
        text: 'Example',
        link: '/example',
      },
    ],
  },
]

const App = () => {
  return (
    <Layout menu={menu}>
      <header className="navbar">
        <nav className="navbar-section">
          <Link to="/simple" className="btn btn-link">
            Simple
          </Link>
          <Link to="/nested" className="btn btn-link">
            Nested
          </Link>
          <Link to="/example" className="btn btn-link">
            Example
          </Link>
        </nav>
      </header>

      <Router>
        <SimpleForm path="/simple" />
        <NestedForm path="/nested" />
        <Example path="/example" />
      </Router>
    </Layout>
  )
}

export default App

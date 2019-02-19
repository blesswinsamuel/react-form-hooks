import React from 'react'
import { Link, Router } from '@reach/router'
import NestedForm from './NestedForm'
import SimpleForm from './SimpleForm'
import Example from './Example'

const App = () => {
  return (
    <div>
      <header className="navbar">
        <nav className="navbar-section">
          <Link to="/simple" className="btn btn-link">Simple</Link>
          <Link to="/nested" className="btn btn-link">Nested</Link>
          <Link to="/example" className="btn btn-link">Example</Link>
        </nav>
      </header>

      <Router>
        <SimpleForm path="/simple"/>
        <NestedForm path="/nested"/>
        <Example path="/example"/>
      </Router>
    </div>
  )
}

export default App

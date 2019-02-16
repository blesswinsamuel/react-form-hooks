import React from 'react'
import { Link, Router } from '@reach/router'
import NestedForm from './NestedForm'
import SimpleForm from './SimpleForm'

const App = () => {
  return (
    <div>
      <header className="navbar">
        <nav className="navbar-section">
          <Link to="/simple" className="btn btn-link">Simple</Link>
          <Link to="/nested" className="btn btn-link">Nested</Link>
        </nav>
      </header>

      <Router>
        <SimpleForm path="/simple"/>
        <NestedForm path="/nested"/>
      </Router>
    </div>
  )
}

export default App

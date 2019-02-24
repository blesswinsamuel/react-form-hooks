import React from 'react'
import { Link } from 'gatsby'
import 'spectre.css/dist/spectre.css'
import 'spectre.css/dist/spectre-icons.css'
import 'spectre.css/dist/spectre-exp.css'
import "prismjs/themes/prism-okaidia.css"

import './layout.css'

import Nav from './Nav'
import { menu } from '../../menu'

export default function Layout({ children }) {
  return (
    <div className="docs-container">
      <div className={'docs-sidebar'}>
        <div className="docs-brand">
          <Link className="docs-logo" to="/">
            <h2>React Form Hooks</h2>
            <small className="label label-secondary text-bold">DOCS</small>
          </Link>
        </div>
        <div className="docs-nav">
          <Nav menu={menu} />
        </div>
      </div>

      <div className="docs-content">
        <div className="docs-content-inner">{children}</div>
      </div>
    </div>
  )
}

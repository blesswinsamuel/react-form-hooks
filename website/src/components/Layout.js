import React from 'react'
import { Link } from '@reach/router'
import Nav from './Nav'

export default function Layout({ children, menu }) {
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

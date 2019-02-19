import React from 'react'
import Nav from './Nav'

export default function Layout({ children, menu }) {
  return (
    <div className="docs-container">
      <div className="docs-sidebar" style={{ maxWidth: '200px' }}>
        <div className="docs-brand">
          <a className="docs-logo" href="/">
            <h2>React Form Hooks</h2>
            <small className="label label-secondary text-bold">DOCS</small>
          </a>
        </div>
        <Nav menu={menu} />
      </div>
      <div className="content">{children}</div>
    </div>
  )
}

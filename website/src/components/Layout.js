import React, { useState } from 'react'
import { Link } from '@reach/router'
import Nav from './Nav'

export default function Layout({ children, menu }) {
  const [sidebarActive, setSidebarActive] = useState(false)
  return (
    <div className="docs-container off-canvas off-canvas-sidebar-show">
      <div
        className="c-hand off-canvas-toggle btn btn-primary btn-action"
        onClick={() => setSidebarActive(true)}
      >
        <i className="icon icon-menu" />
      </div>

      <div
        className={
          'docs-sidebar off-canvas-sidebar' + (sidebarActive ? ' active' : '')
        }
        onClick={() => setSidebarActive(false)}
      >
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

      <div
        className="c-hand off-canvas-overlay"
        onClick={() => setSidebarActive(false)}
      />


      <div className="off-canvas-content">
        <div className="docs-content">{children}</div>
      </div>
    </div>
  )
}

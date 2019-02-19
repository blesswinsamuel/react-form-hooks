import React from 'react'
import { Link } from '@reach/router'

export default function NotFound() {
  return (
    <div className="empty">
      <p className="empty-title h5">404</p>
      <p className="empty-subtitle">
        Page not found.
      </p>
      <div className="empty-action">
        <Link to='/' className="btn btn-primary">Go to Home</Link>
      </div>
    </div>
  )
}

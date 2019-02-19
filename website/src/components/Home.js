import React from 'react'
import { Link } from '@reach/router'

export default function Home() {
  return (
    <div className="hero hero-sm text-center">
      <div className="hero-body">
        <h1>React Form Hooks</h1>
        <p>Create forms in React with hooks</p>
        <Link to='/examples' className='btn btn-primary'>Examples</Link>
      </div>
    </div>
  )
}

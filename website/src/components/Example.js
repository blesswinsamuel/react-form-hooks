import React from 'react'
import Code from './Code'

export default function Example({ title, component: Component, code }) {
  return (
    <div>
      <h1>{title}</h1>
      <div style={{ paddingBottom: 16 }}>
        <Component />
      </div>
      {code && (
        <>
          <h2>Code</h2>
          <Code language="jsx" value={code} />
        </>
      )}
    </div>
  )
}

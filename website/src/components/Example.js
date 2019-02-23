import React from 'react'
import Code from './Code'

export default function Example({ title, component: Component, code }) {
  return (
    <div>
      <h1>{title}</h1>
      <div style={{ paddingBottom: 16 }}>
        <Component />
      </div>
      <p>
        <strong>TIP:</strong> Open react developer tools, go to preferences
        and enable Highlight updates and then start typing on the form inputs to
        see which components update.
      </p>
      {code && (
        <>
          <h2>Code</h2>
          <Code language="jsx" value={code} />
        </>
      )}
    </div>
  )
}

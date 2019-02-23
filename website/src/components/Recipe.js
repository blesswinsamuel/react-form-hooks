import React from 'react'
import Code from './Code'

export default function Recipe({ title, code }) {
  return (
    <div>
      <h1>{title}</h1>
      {code && <Code language="jsx" value={code} />}
    </div>
  )
}

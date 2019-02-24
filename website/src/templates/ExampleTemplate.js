import React from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'

export default function ExampleTemplate({ title, Component, code }) {
  return (
    <Layout>
      <SEO title={`${title} | React Form Hooks Docs`} />

      <h1>{title}</h1>
      <div style={{ paddingBottom: 16 }}>
        {Component && <Component />}
      </div>
      <p>
        <strong>TIP:</strong> Open react developer tools, go to preferences
        and enable Highlight updates and then start typing on the form inputs to
        see which components update.
      </p>
      {code && (
        <>
          <h2>Code</h2>
          {code}
        </>
      )}
    </Layout>
  )
}

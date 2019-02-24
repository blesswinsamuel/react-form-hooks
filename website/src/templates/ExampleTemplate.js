import React from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { graphql } from 'gatsby'

const exampleMap = {
  BasicExample: require('../examples/BasicExample').default,
  FieldTypesExample: require('../examples/FieldTypesExample').default,
  GettingStarted: require('../examples/GettingStarted').default,
  NestedForm: require('../examples/NestedForm').default,
}

export default function ExampleTemplate({ data }) {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark

  const Component = exampleMap[frontmatter.id]

  return (
    <Layout>
      <SEO title={`${frontmatter.title} | React Form Hooks Docs`} />

      <h1>{frontmatter.title}</h1>

      <div style={{ paddingBottom: 16 }}>{Component && <Component />}</div>
      <p>
        <strong>TIP:</strong> Open react developer tools, go to preferences and
        enable Highlight updates and then start typing on the form inputs to see
        which components update.
      </p>
      <h2>Code</h2>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        id
        path
        title
      }
    }
  }
`

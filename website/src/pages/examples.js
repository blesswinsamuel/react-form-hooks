import React from 'react'
import { graphql, Link, useStaticQuery } from 'gatsby'
import Layout from '../components/Layout'
import { getMenu } from '../utils'

const examplesQuery = graphql`
  query ExamplesMenu {
    examples: allMarkdownRemark(
      filter: { fields: { parentDir: { eq: "examples" } } }
      sort: { fields: frontmatter___order }
    ) {
      ...MenuResult
    }
  }
`

const ExamplesIndex = () => {
  const data = useStaticQuery(examplesQuery)
  return (
    <Layout>
      <h1>Examples</h1>
      <ul>
        {getMenu(data.examples).map((example, i) => (
          <li key={i}>
            <Link to={example.link}>{example.text}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default ExamplesIndex

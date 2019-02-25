import React from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { graphql } from 'gatsby'

export default function RecipeTemplate({ data }) {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark

  return (
    <Layout>
      <SEO title={`${frontmatter.title} | React Form Hooks Docs`} />

      <h1>{frontmatter.title}</h1>

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

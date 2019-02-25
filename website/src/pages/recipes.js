import React from 'react'
import { graphql, Link, useStaticQuery } from 'gatsby'
import Layout from '../components/Layout'
import { getMenu } from '../utils'

const recipesQuery = graphql`
  query RecipesMenu {
    recipes: allMarkdownRemark(
      filter: { fields: { parentDir: { eq: "recipes" } } }
      sort: { fields: frontmatter___order }
    ) {
      ...MenuResult
    }
  }
`

const RecipesIndex = () => {
  const data = useStaticQuery(recipesQuery)
  return (
    <Layout>
      <h1>Recipes</h1>
      <ul>
        {(getMenu(data.recipes) || []).map((example, i) => (
          <li key={i}>
            <Link to={example.link}>{example.text}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default RecipesIndex

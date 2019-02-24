import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/Layout'
import { recipes } from '../../menu'

const RecipesIndex = ({}) => {
  return (
    <Layout>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe, i) => (
          <li key={i}>
            <Link to={recipe.link}>{recipe.text}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default RecipesIndex

import React from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'

export default function RecipeTemplate({ title, code }) {
  return (
    <Layout>
      <SEO title={`${title} | React Form Hooks Docs`} />

      <h1>{title}</h1>
    </Layout>
  )
}

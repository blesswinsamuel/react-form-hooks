import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/Layout'

const ExamplesIndex = ({ examples = [] }) => {
  return (
    <Layout>
      <h1>Examples</h1>
      <ul>
        {examples.map((example, i) => (
          <li key={i}>
            <Link to={example.link}>{example.text}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default ExamplesIndex

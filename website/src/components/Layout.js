import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'
import 'spectre.css/dist/spectre.css'
import 'spectre.css/dist/spectre-icons.css'
import 'spectre.css/dist/spectre-exp.css'
import 'prismjs/themes/prism-okaidia.css'

import './layout.css'

import Nav from './Nav'

export const menuResultFragment = graphql`
  fragment MenuResult on MarkdownRemarkConnection {
    edges {
      node {
        frontmatter {
          path
          title
        }
      }
    }
  }
`

const menuQuery = graphql`
  query Menu {
    docs: allMarkdownRemark(
      filter: { fields: { parentDir: { eq: "docs" } } }
      sort: { fields: frontmatter___order }
    ) {
      ...MenuResult
    }
    recipes: allMarkdownRemark(
      filter: { fields: { parentDir: { eq: "recipes" } } }
      sort: { fields: frontmatter___order }
    ) {
      ...MenuResult
    }
    examples: allMarkdownRemark(
      filter: { fields: { parentDir: { eq: "examples" } } }
      sort: { fields: frontmatter___order }
    ) {
      ...MenuResult
    }
  }
`

export default function Layout({ children }) {
  const data = useStaticQuery(menuQuery)
  console.log(data)

  const getMenu = menu => {
    if (!menu) return null
    return menu.edges.map(item => {
      return {
        link: item.node.frontmatter.path,
        text: item.node.frontmatter.title,
      }
    })
  }

  const menu = [
    ...getMenu(data.docs),
    {
      text: 'Examples',
      link: '/examples',
      children: getMenu(data.examples),
    },
    {
      text: 'Recipes',
      link: '/recipes',
      children: getMenu(data.recipes),
    },
    {
      text: 'GitHub',
      href: 'https://github.com/blesswinsamuel/react-form-hooks',
    },
  ]
  return (
    <div className="docs-container">
      <div className={'docs-sidebar'}>
        <div className="docs-brand">
          <Link className="docs-logo" to="/">
            <h2>React Form Hooks</h2>
            <small className="label label-secondary text-bold">DOCS</small>
          </Link>
        </div>
        <div className="docs-nav">
          <Nav menu={menu} />
        </div>
      </div>

      <div className="docs-content">
        <div className="docs-content-inner">{children}</div>
      </div>
    </div>
  )
}

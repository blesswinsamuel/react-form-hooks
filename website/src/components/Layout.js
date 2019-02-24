import React from 'react'
import { Link } from '@reach/router'
import 'spectre.css/dist/spectre.css'
import 'spectre.css/dist/spectre-icons.css'
import 'spectre.css/dist/spectre-exp.css'
import "prismjs/themes/prism-okaidia.css"

import './layout.css'

import Nav from './Nav'

const examples = [
  {
    text: 'Getting Started',
    link: '/examples/getting-started',
  },
  {
    text: 'Basic Form',
    link: '/examples/basic',
  },
  {
    text: 'Field types example',
    link: '/examples/field-types',
  },
  {
    text: 'Nested Fields',
    link: '/examples/nested',
  },
]

const recipes = [
  {
    text: 'FormField.js',
    link: '/recipes/form-field',
  },
  {
    text: 'ArrayFormField.js',
    link: '/recipes/array-form-field',
  },
  {
    text: 'FormFooter.js',
    link: '/recipes/form-footer',
  },
  {
    text: 'Components.js',
    link: '/recipes/components',
  },
]

const menu = [
  {
    text: 'Getting Started',
    link: '/getting-started',
  },
  {
    text: 'API',
    link: '/api',
  },
  {
    text: 'Examples',
    link: '/examples',
    children: examples,
  },
  {
    text: 'Recipes',
    link: '/recipes',
    children: recipes,
  },
  {
    text: 'GitHub',
    href: 'https://github.com/blesswinsamuel/react-form-hooks',
  },
]

export default function Layout({ children }) {
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

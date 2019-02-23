import React from 'react'
import Code from './Code'
const ReactMarkdown = require('react-markdown')

function flatten(text, child) {
  return typeof child === 'string'
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text)
}

function HeadingRenderer({ children, level }) {
  const text = React.Children.toArray(children).reduce(flatten, '')
  const slug = text.toLowerCase().replace(/\W+/g, '-')
  return React.createElement(
    'h' + level,
    { id: slug },
    <>
      <a className="anchor" aria-hidden="true" href={`#${slug}`}>
        #
      </a>
      {children}
    </>
  )
}

export default function Markdown({ input }) {
  return (
    <ReactMarkdown
      source={input}
      renderers={{
        code: Code,
        heading: HeadingRenderer,
      }}
      className="markdown-body"
    />
  )
}

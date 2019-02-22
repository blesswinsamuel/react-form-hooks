import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { ocean } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default function Code({ language, value }) {
  return (
    <SyntaxHighlighter
      language={language}
      data-lang={language}
      className="code"
      style={ocean}
    >
      {value}
    </SyntaxHighlighter>
  )
}

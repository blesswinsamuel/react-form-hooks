import React from 'react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { cb as style } from 'react-syntax-highlighter/dist/esm/styles/prism'

// export default function CodeWithPreview({ language, value }) {
//   const [state, setState] = useState(0)
//   const style = Object.values(styles)[state]
//   return (
//     <>
//       <button onClick={() => setState(state => state + 1)}>
//         Style {state}
//       </button>
//       <Code {...{ language, value, style }} />
//     </>
//   )
// }

export default function Code({ language, value }) {
  return (
    <SyntaxHighlighter
      language={language}
      data-lang={language}
      className="code syntax-highlighter"
      style={style}
    >
      {value}
    </SyntaxHighlighter>
  )
}

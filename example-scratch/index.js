import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App'
import 'spectre.css'

// const render = () => {
//   ReactDOM.render(
//     <AppContainer errorReporter={({ error }) => { throw error; }}>
//       <App />
//     </AppContainer>,
//     document.getElementById('root')
//   )
// }

const render = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

render()

if (module.hot) {
  module.hot.accept('./App', render)
}
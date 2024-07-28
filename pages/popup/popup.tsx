import React from 'react'
import ReactDOM from 'react-dom/client'

const App = () => {
  return <div>Hello, world!</div>
}

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(root).render(<App />)

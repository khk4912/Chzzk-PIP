import React from 'react'
import ReactDOM from 'react-dom'

export function Test (): JSX.Element {
  return <div>Test</div>
}

ReactDOM.render(<Test />, document.getElementById('root'))

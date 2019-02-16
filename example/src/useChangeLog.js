/**
 `useChangeLog` - dev-mode helper hook to let you
 know why a memoized component re-rendered!
 Usage example:
 const YourComponent = React.memo((props) => {
  // Just drop this fella into your memo component's body.
  useChangeLog(props);
  return <div>Hello World</div>
});
 */

import { useEffect, useRef } from 'react'

const useChangeLog = props => {
  if (process.env.NODE_ENV === 'production') {
    return
  }

  const staleProps = useRef(props)

  useEffect(() => {
    const changedProps = Object.keys(props)
      .map(key => {
        const hasChanged = props[key] !== staleProps.current[key]

        if (!hasChanged) {
          return null
        }

        return {
          prop: key,
          from: getPrintableValue(staleProps.current[key]),
          to: getPrintableValue(props[key]),
        }
      })
      .filter(prop => !!prop)

    if (changedProps.length) {
      console.log('▬▬▬ UPDATE TRIGGERED ▬▬▬')
      console.table(changedProps)
    }
    const unChangedProps = Object.keys(props)
      .map(key => {
        const hasChanged = props[key] !== staleProps.current[key]

        if (hasChanged) {
          return null
        }

        return {
          prop: key,
          from: getPrintableValue(staleProps.current[key]),
          to: getPrintableValue(props[key]),
        }
      })
      .filter(prop => !!prop)
    if (unChangedProps.length) {
      console.log('▬▬▬ UNNECESSARY UPDATE TRIGGERED ▬▬▬')
      console.table(unChangedProps)
    }

    staleProps.current = props
  })
}

const getPrintableValue = val => {
  switch (typeof val) {
    case 'function':
      return '[function]'

    case 'number':
    case 'string':
    default:
      return val
  }
}

export default useChangeLog

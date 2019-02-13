import { useEffect, useRef, useState } from 'react'

const isEqual = (a, b) => {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

export default function useFormField(form, fieldId, opts = {}) {
  const { registerField, changeFieldValue, touchField, initFieldAndGetState } = form.fieldActions

  // value: null, touched: false, dirty: false, error: null
  const ref = useRef()
  const getRef = () => {
    if (!ref.current) {
      ref.current = Symbol()
    }

    return ref.current
  }
  const [fieldState, setFieldState] = useState(() => initFieldAndGetState(fieldId, getRef(), opts))
  const subscribedValues = state => [state.value, state.touched, state.error, state.dirty]
  const updateState = (newState) => {
    setFieldState(prevState => {
      if (isEqual(subscribedValues(prevState), subscribedValues(newState))) {
        return prevState
      }
      console.log('CHANGE ' + fieldId)
      return newState
    })
  }
  useEffect(() => registerField(fieldId, getRef(), updateState), [])

  console.warn(fieldId, fieldState)

  const input = {
    id: fieldId,
    value: fieldState.value,
    onChange: changeFieldValue(fieldId),
    onBlur: touchField(fieldId),
  }
  const meta = {
    error: fieldState.error,
    touched: fieldState.touched,
    dirty: fieldState.dirty,
  }
  return { input, meta }
}

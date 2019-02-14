import { useEffect, useRef, useState } from 'react'
import isEqual from './utils/isEqual'

export default function useFormField(form, fieldId, opts = {}, subscribeTo) { // rename to useFieldState
  const { registerField, changeFieldValue, touchField, initFieldAndGetState } = form.fieldActions

  const ref = useRef()
  const getRef = () => {
    if (!ref.current) {
      ref.current = Symbol()
    }

    return ref.current
  }
  const [fieldState, setFieldState] = useState(() => initFieldAndGetState(fieldId, getRef(), opts))
  const subscribedValues = subscribeTo || (state => [state.value, state.touched, state.error, state.dirty])
  const updateState = (newState) => {
    setFieldState(prevState => {
      if (isEqual(subscribedValues(prevState), subscribedValues(newState))) {
        return prevState
      }
      return newState
    })
  }
  useEffect(() => registerField(fieldId, getRef(), updateState), [])

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

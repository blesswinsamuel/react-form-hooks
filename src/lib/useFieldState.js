import { useEffect, useRef, useState } from 'react'
import isEqual from './utils/isEqual'

export default function useFieldState(form, fieldId, opts = {}, subscribeTo) { // rename to useFieldState
  const { registerField, initAndGetFieldState } = form.fieldActions

  const ref = useRef()
  const getRef = () => {
    if (!ref.current) {
      ref.current = Symbol()
    }

    return ref.current
  }
  const [fieldState, setFieldState] = useState(() => initAndGetFieldState(fieldId, getRef(), opts))
  const subscribedValues = subscribeTo || (state => [state.value, state.touched, state.error, state.dirty])
  const updateState = (newState) => {
    setFieldState(prevState => {
      if (isEqual(subscribedValues(prevState), subscribedValues(newState))) {
        return prevState
      }
      return newState
    })
  }
  useEffect(() => registerField(fieldId, getRef(), updateState), [fieldId])

  return fieldState
}

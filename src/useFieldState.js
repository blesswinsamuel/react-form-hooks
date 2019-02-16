import { useEffect, useRef, useState } from 'react'
import isEqual from './utils/isEqual'

export default function useFieldState(form, fieldId, opts = {}, subscribeTo) { // rename to useFieldState
  const { initField, destroyField, getFieldState } = form.fieldActions

  const ref = useRef()
  const getRef = () => {
    if (!ref.current) {
      ref.current = Symbol()
    }

    return ref.current
  }
  const [fieldState, setFieldState] = useState(() => {
    initField(fieldId, getRef(), opts)
    return getFieldState(fieldId)
  })
  const subscribedValues = subscribeTo || (state => [state.value, state.touched, state.error, state.dirty])
  const updateState = () => {
    const newState = getFieldState(fieldId)
    setFieldState(prevState => {
      if (isEqual(subscribedValues(prevState), subscribedValues(newState))) {
        return prevState
      }
      // console.log("FIELD CHANGED", fieldId, prevState, newState)
      return newState
    })
  }
  useEffect(() => {
    let didUnsubscribe = false

    const checkForUpdates = () => {
      if (didUnsubscribe) return

      updateState()
    }
    // console.log('REGISTER_FIELD', fieldId)
    initField(fieldId, getRef(), opts)
    checkForUpdates()

    const unsubscribe = form.subscribe(checkForUpdates)

    return () => {
      // console.log('DESTROY_FIELD', fieldId)
      didUnsubscribe = true
      destroyField(fieldId, getRef())
      unsubscribe()
    }
  }, [form, fieldId])

  return fieldState
}

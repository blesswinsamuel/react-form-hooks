import { useEffect, useRef, useState } from 'react'
import shallowEqual from './utils/shallowEqual'
import { FieldState, Form } from './types'

export default function useFieldState(
  form: Form,
  fieldId: string,
  mapState: (state: FieldState) => FieldState = s => s,
  opts = {}
) {
  const { initField, destroyField, getFieldState } = form.fieldActions

  const ref = useRef(null)
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
  const updateState = () => {
    const newState = getFieldState(fieldId)
    setFieldState(prevState => {
      const newMappedState = mapState(newState)
      if (shallowEqual(prevState, newMappedState)) {
        return prevState
      }
      // console.log("FIELD CHANGED", fieldId, prevState, newState)
      return newMappedState
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

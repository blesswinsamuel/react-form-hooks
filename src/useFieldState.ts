import { useEffect, useRef, useState } from 'react'
import shallowEqual from './utils/shallowEqual'
import { FieldState, Form } from './types'

export default function useFieldState<TValues, TResult = FieldState>(
  form: Form<TValues>,
  fieldId: string,
  mapState: (state: FieldState) => TResult = (s: FieldState) => s as any,
  opts = {}
): TResult {
  if (!form) {
    throw new Error(
      'react-form-hooks requires the form instance ' +
        'created using useForm() to be passed to useFieldState as 1st argument'
    )
  }
  if (!fieldId) {
    throw new Error(
      'react-form-hooks requires the id of the field ' +
        'to be passed to useFieldState as 2nd argument'
    )
  }

  const { initField, destroyField, getFieldState } = form.fieldActions

  const getMappedFieldState = () => mapState(getFieldState(fieldId))

  const ref = useRef<symbol | null>(null)
  const getRef = () => {
    if (!ref.current) {
      ref.current = Symbol()
    }

    return ref.current
  }
  const [fieldState, setFieldState] = useState(() => {
    initField(fieldId, getRef(), opts)
    return getMappedFieldState()
  })
  const prevFieldState = useRef(fieldState)
  const updateState = () => {
    const newState = getMappedFieldState()
    if (!shallowEqual(newState, prevFieldState.current)) {
      // console.log("FIELD CHANGED", fieldId, prevFieldState.current, newState)
      setFieldState(newState)
      prevFieldState.current = newState
    }
  }

  useEffect(() => {
    initField(fieldId, getRef(), opts)
    return () => destroyField(fieldId, getRef())
  }, [form, fieldId])

  useEffect(() => {
    updateState()
    return form.subscribe(updateState)
  }, [form, fieldId])

  return fieldState
}

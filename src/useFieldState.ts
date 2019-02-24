import { useCallback, useEffect, useRef, useState } from 'react'
import shallowEqual from './utils/shallowEqual'
import { FieldOptions, FieldState, Form } from './types'

const defaultMapState = (s: FieldState) => s as any

export default function useFieldState<V, TResult = FieldState>(
  form: Form<V>,
  fieldId: string,
  mapState: (state: FieldState) => TResult = defaultMapState,
  opts: FieldOptions = {}
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

  const {
    setFieldOptions,
    unsetFieldOptions,
    initializeField,
    destroyField,
    getFieldState,
  } = form.fieldActions

  const { validate } = opts

  const getMappedFieldState = useCallback(
    () => mapState(getFieldState(fieldId)),
    [mapState, getFieldState, fieldId]
  )

  const ref = useRef<symbol | null>(null)
  const getRef = () => {
    if (!ref.current) {
      ref.current = Symbol()
    }

    return ref.current
  }
  const [fieldState, setFieldState] = useState(() => {
    setFieldOptions(fieldId, getRef(), opts)
    initializeField(fieldId)
    return getMappedFieldState()
  })
  const prevFieldState = useRef(fieldState)
  const updateState = useCallback(() => {
    const newState = getMappedFieldState()
    if (!shallowEqual(newState, prevFieldState.current)) {
      // console.log('FIELD CHANGED', fieldId, prevFieldState.current, newState)
      setFieldState(newState)
      prevFieldState.current = newState
    }
  }, [getMappedFieldState, prevFieldState, setFieldState])

  useEffect(() => {
    setFieldOptions(fieldId, getRef(), { validate })
    return () => unsetFieldOptions(fieldId, getRef())
  }, [form, fieldId, ref, validate])

  useEffect(() => {
    initializeField(fieldId)
    return () => destroyField(fieldId)
  }, [form, fieldId])

  useEffect(() => {
    updateState()
    return form.subscribe(updateState)
  }, [form, fieldId, updateState])

  return fieldState
}

import { useEffect, useRef, useState } from 'react'

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
  useEffect(() => registerField(fieldId, getRef(), setFieldState, opts, subscribedValues), [])

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

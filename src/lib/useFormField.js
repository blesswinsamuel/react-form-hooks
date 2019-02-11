import { useEffect, useRef, useState } from 'react'

export default function useFormField(form, fieldId, opts = {}) {
  const { mapValueFn, validate } = opts
  const { registerField, changeFieldValue, touchField } = form.fieldActions

  // value: null, touched: false, dirty: false, error: null
  const [fieldState, setFieldState] = useState({  })
  const ref = useRef(Symbol())
  const subscribeTo = state => [state.value, state.touched, state.error, state.dirty]
  useEffect(() => registerField(fieldId, ref, validate, mapValueFn, setFieldState, subscribeTo), [])

  console.log(fieldId, fieldState)

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

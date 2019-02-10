import { useContext, useEffect } from 'react'

export default function useFormField(form, fieldId, mapValueFn, validate) {
  const formCtx = useContext(form.Context)
  const {
    changeFieldValue,
    registerField,
    initField,
    touchField,
    getMeta,
    getValue,
  } = formCtx.fieldActions(fieldId)

  // Register field on mount
  useEffect(() => registerField(validate, mapValueFn), [])

  // Set error on component mount
  useEffect(initField, [])

  const input = {
    id: fieldId,
    value: getValue(formCtx.values),
    onChange: changeFieldValue,
    onBlur: touchField,
  }
  const meta = getMeta(formCtx.meta)
  return {
    form: formCtx,
    input,
    meta,
  }
}

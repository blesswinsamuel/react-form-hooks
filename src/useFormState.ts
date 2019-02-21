import { useEffect, useRef, useState } from 'react'
import shallowEqual from './utils/shallowEqual'
import { Form, FormState } from './types'

export default function useFormState<TValues, TResult = FormState<TValues>>(
  form: Form<TValues>,
  mapState: (state: FormState<TValues>) => TResult = s => s as any
): TResult {
  if (!form) {
    throw new Error(
      'react-form-hooks requires the form instance ' +
        'created using useForm() to be passed to useFormState as 1st argument'
    )
  }
  const { getFormState } = form.formActions

  const getMappedFormState = () => mapState(getFormState())

  const [formState, setFormState] = useState(getMappedFormState)
  const prevFormState = useRef(formState)
  const updateState = () => {
    const newState = getMappedFormState()
    if (!shallowEqual(newState, prevFormState.current)) {
      setFormState(newState)
      prevFormState.current = newState
    }
  }

  useEffect(() => {
    updateState()
    return form.subscribe(updateState)
  }, [form])

  return formState
}

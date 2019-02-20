import { useEffect, useRef, useState } from 'react'
import shallowEqual from './utils/shallowEqual'
import { Form, FormState } from './types'

const NULL_FORM_ERROR_MESSAGE =
  'react-form-hooks requires the form instance created using useForm() to be passed to useFormState as 1st argument'

export default function useFormState<TResult>(
  form: Form,
  mapState: (state: FormState) => TResult | FormState = s => s
) {
  if (!form) {
    throw new Error(NULL_FORM_ERROR_MESSAGE)
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

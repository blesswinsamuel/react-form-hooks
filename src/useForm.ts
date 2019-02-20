import { useEffect, useRef } from 'react'
import createForm from './createForm'
import { Form, FormOptions } from './types'

export default function useForm<TValues>(opts: FormOptions<TValues> = {}) {
  const form = useRef<Form<TValues> | null>(null)
  const { initialValues } = opts

  function getForm(): Form<TValues> {
    if (!form.current) {
      form.current = createForm(opts)
    }

    return form.current!
  }

  const prevInitialValues = useRef(initialValues)
  useEffect(() => {
    const { resetFormValues } = getForm().formActions
    if (prevInitialValues.current !== initialValues) {
      resetFormValues(initialValues)
    }
    prevInitialValues.current = initialValues
  }, [initialValues])

  return getForm()
}

import { useEffect, useRef } from 'react'
import createForm from './createForm'
import { FormOptions } from './types'

export default function useForm(opts: FormOptions = {}) {
  const form = useRef(null)
  const { initialValues } = opts

  const getForm = () => {
    if (!form.current) {
      form.current = createForm(opts)
    }

    return form.current
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

import { useEffect, useRef } from 'react'
import createForm from './createForm'

export default function useForm(opts = {}) {
  const form = useRef()
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

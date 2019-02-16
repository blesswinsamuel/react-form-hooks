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

  const firstUpdate = useRef(true)
  useEffect(() => {
    const { resetFormValues } = getForm().formActions
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }

    resetFormValues(initialValues)
  }, [initialValues])

  return getForm()
}

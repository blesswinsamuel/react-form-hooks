import { useEffect, useRef } from 'react'
import createForm from './createForm'

export default function useForm(opts) {
  const form = useRef()

  const prevInitialValues = useRef(opts.initialValues)

  useEffect(() => {
    if (opts.initialValues === prevInitialValues.current) {
      return
    }

    if (opts.initialValues && opts.initialValues !== prevInitialValues.current) {
      form.current.formActions.initializeForm(opts.initialValues)
    }
    prevInitialValues.current = opts.initialValues
  })

  const getForm = () => {
    if (!form.current) {
      form.current = createForm(opts)
    }

    return form.current
  }

  return getForm()
}

import { useEffect, useRef } from 'react'
import createForm from './createForm'
import usePrevious from './utils/usePrevious'

export default function useForm(opts) {
  const form = useRef()

  const prevInitialValues = usePrevious(opts.initialValues)

  useEffect(() => {
    if (opts.initialValues === prevInitialValues) {
      return
    }

    if (opts.initialValues && opts.initialValues !== prevInitialValues) {
      form.current.formActions.initialize(opts.initialValues)
    }
  })

  const getForm = () => {
    if (!form.current) {
      form.current = createForm(opts)
    }

    return form.current
  }

  return getForm()
}

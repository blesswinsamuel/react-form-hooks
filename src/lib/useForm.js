import { useContext } from 'react'

import { handleFormSubmit } from './formHandlers'

export default function useForm(form, onSubmit) {
  const formCtx = useContext(form.Context)

  const submitHandler = fn =>
    handleFormSubmit(() => {
      if (Object.values(formCtx.meta).some(meta => meta.error)) {
        formCtx.formActions.touchAll()
        return
      }
      return fn(formCtx.values)
    })

  const submitForm = submitHandler(onSubmit)

  return {
    ...formCtx,
    dirty: Object.values(formCtx.meta).some(meta => meta.dirty),
    touched: Object.values(formCtx.meta).some(meta => meta.touched),
    error:
      Object.values(formCtx.meta).some(meta => meta.touched && meta.error) &&
      'Form has validation errors',
    submitForm,
    submitHandler,
  }
}

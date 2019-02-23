import React from 'react'
import { useFormState, FormState } from 'react-form-hooks'

import { FormStateAndButton } from './Components'

export default function FormFooter({ form, resetToNewValues }) {
  const { anyError, anyDirty, anyTouched, values } = useFormState(
    form,
    state => ({
      anyError: state.anyError,
      anyDirty: state.anyDirty,
      anyTouched: state.anyTouched,
      values: state.values,
    }),
  )

  // console.log('FORM_STATE_UPDATE', { anyError, anyDirty, anyTouched, values })
  return (
    <FormStateAndButton
      {...{ anyError, anyDirty, anyTouched, values }}
      resetToInitial={() => form.formActions.resetFormValues()}
      resetToNew={resetToNewValues}
    />
  )
}


export const FormFooterRP = ({ form, resetToNewValues }) => {
  return (
    <FormState
      form={form}
      render={formState => {
        const { anyError, anyDirty, anyTouched, values, errors } = formState

        // console.log('FORM_STATE_UPDATE', { anyError, anyDirty, anyTouched, values })
        return (
          <FormStateAndButton
            {...{ anyError, anyDirty, anyTouched, values, errors }}
            resetToInitial={() => form.formActions.resetFormValues()}
            resetToNew={resetToNewValues}
          />
        )
      }}
    />
  )
}

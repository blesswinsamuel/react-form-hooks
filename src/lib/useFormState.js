// import { createSelector } from 'reselect'
import { useEffect, useState } from 'react'
import isEqual from './utils/isEqual'

export default function useFormState(form, subscribeTo) {
  const { registerForm, getFormState } = form.formActions

  const [formState, setFormState] = useState(() => getFormState())
  const subscribedValues = subscribeTo || (state => [state.values, state.anyTouched, state.anyError, state.anyDirty])
  const updateState = (newState) => {
    setFormState(prevState => {
      if (isEqual(subscribedValues(prevState), subscribedValues(newState))) {
        return prevState
      }
      return newState
    })
  }
  useEffect(() => registerForm(updateState), [])

  return formState
}

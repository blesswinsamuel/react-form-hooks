// import { createSelector } from 'reselect'
import { useEffect, useState } from 'react'
import isEqual from './utils/isEqual'

export default function useFormState(form, subscribeTo) {
  const { getFormState } = form.formActions

  const [formState, setFormState] = useState(() => getFormState())
  const subscribedValues = subscribeTo || (state => [state.values, state.anyTouched, state.anyError, state.anyDirty])
  const updateState = () => {
    const newState = getFormState()
    setFormState(prevState => {
      if (isEqual(subscribedValues(prevState), subscribedValues(newState))) {
        return prevState
      }
      return newState
    })
  }

  useEffect(() => {
    let didUnsubscribe = false

    const checkForUpdates = () => {
      if (didUnsubscribe) return

      updateState()
    }
    checkForUpdates()

    const unsubscribe = form.subscribe(checkForUpdates)

    return () => {
      didUnsubscribe = true
      unsubscribe()
    }
  }, [form])

  return formState
}

import { useEffect, useState } from 'react'
import shallowEqual from './utils/shallowEqual'
import { Form, FormState } from './types'

export default function useFormState(
  form: Form,
  mapState: (state: FormState) => FormState = s => s
) {
  const { getFormState } = form.formActions

  const [formState, setFormState] = useState(() => getFormState())
  const updateState = () => {
    const newState = getFormState()
    setFormState(prevState => {
      const newMappedState = mapState(newState)
      if (shallowEqual(prevState, newMappedState)) {
        return prevState
      }
      return newMappedState
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

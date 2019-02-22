import { ReactElement } from 'react'
import {
  FieldState as FieldStateType,
  Form,
  FormOptions,
  FormState as FormStateType,
} from '../types'
import useFormState from '../useFormState'
import useFieldState from '../useFieldState'

export type FormStateProps<V, R> = {
  form: Form<V>
  mapState: (state: FormStateType<V>) => R
  render: (state: R) => ReactElement
}

export const FormState = <V, R>({
  form,
  mapState,
  render,
}: FormStateProps<V, R>) => {
  const formState = useFormState(form, mapState)
  return render(formState)
}

export type FieldStateProps<V, R> = {
  form: Form<V>
  fieldId: string
  mapState: (state: FieldStateType) => R
  opts: FormOptions<V>
  render: (state: R) => ReactElement
}

export const FieldState = <V, R>({
  form,
  fieldId,
  mapState,
  opts,
  render,
}: FieldStateProps<V, R>) => {
  const fieldState = useFieldState(form, fieldId, mapState, opts)
  return render(fieldState)
}

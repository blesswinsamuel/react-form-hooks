import React, { ReactNode } from 'react'
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
  mapState?: (state: FormStateType<V>) => R
  render: (state: R) => ReactNode
}

export const FormState = <V, R>({
  form,
  mapState,
  render,
}: FormStateProps<V, R>) => {
  const formState = useFormState(form, mapState)
  return React.createElement(React.Fragment, null, render(formState))
}

export type FieldStateProps<V, R> = {
  form: Form<V>
  id: string
  mapState?: (state: FieldStateType) => R
  opts?: FormOptions<V>
  render: (state: R) => ReactNode
}

export const FieldState = <V, R>({
  form,
  id,
  mapState,
  opts,
  render,
}: FieldStateProps<V, R>) => {
  const fieldState = useFieldState(form, id, mapState, opts)
  return React.createElement(React.Fragment, null, render(fieldState))
}

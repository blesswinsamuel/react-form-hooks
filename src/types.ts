import { Unsubscribe } from 'redux'

export type FormOptions<TValues> = {
  initialValues: TValues
}

export type FieldState = {
  value: any
  error: any
  touched: boolean
  dirty: boolean
}

export type FormState<TValues> = {
  anyTouched: boolean
  anyDirty: boolean
  anyError: boolean
  values: TValues
}

export type FieldOptions = {
  validate?: (val: any) => boolean | string
}

export type Form<TValues> = {
  subscribe(listener: () => void): Unsubscribe
  formActions: {
    resetFormValues: (newInitialValues?: any) => void
    submitHandler: (fn: (val: any) => any) => (event?: Event) => any
    getFormState: () => FormState<TValues>
  }
  fieldActions: {
    initField: (fieldId: string, ref: symbol, opts?: FieldOptions) => void
    destroyField: (fieldId: string, ref: symbol) => void
    changeFieldValue: (fieldId: string, value: any) => void
    touchField: (fieldId: string) => void
    getFieldState: (fieldId: string) => FieldState
  }
}


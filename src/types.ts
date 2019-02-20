import { Unsubscribe } from 'redux'

export type FormOptions = {
  initialValues?: object
}

export type FieldState = {
  error: any
  touched: boolean
  dirty: boolean
}

export type FormState = {
  anyTouched: boolean
  anyDirty: boolean
  anyError: boolean
  values: any
}

export type Form = {
  subscribe(listener: () => void): Unsubscribe
  formActions: {
    resetFormValues: (newInitialValues: any) => void
    submitHandler: (fn: (val: any) => void) => void
    getFormState: () => FormState
  }
  fieldActions: {
    initField: (fieldId: string, ref: Symbol, opts: any) => void
    destroyField: (fieldId: string, ref: Symbol) => void
    changeFieldValue: (fieldId: string, value: any) => void
    touchField: (fieldId: string) => void
    getFieldState: (fieldId: string) => FieldState
  }
}


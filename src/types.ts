export type FormOptions<V> = {
  initialValues: V
}

export type FieldState = {
  value: any
  error: any
  touched: boolean
  dirty: boolean
}

export type FormState<V> = {
  anyTouched: boolean
  allTouched: boolean
  anyDirty: boolean
  anyError: boolean
  errors: {[fieldId: string]: any}
  values: V
}

export type FieldOptions = {
  validate?: (val: any) => boolean | string
}

export type Form<V> = {
  subscribe(listener: () => void): () => void
  formActions: {
    resetFormValues: (newInitialValues?: any) => void
    submitHandler: (fn: (val: any) => any) => (event?: Event) => any
    getFormState: () => FormState<V>
  }
  fieldActions: {
    setFieldOptions: (fieldId: string, ref: symbol, opts?: FieldOptions) => void
    unsetFieldOptions: (fieldId: string, ref: symbol) => void
    initializeField: (fieldId: string) => void
    destroyField: (fieldId: string) => void
    changeFieldValue: (fieldId: string, value: any) => void
    touchField: (fieldId: string) => void
    getFieldState: (fieldId: string) => FieldState
  }
}

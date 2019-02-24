import { handleFormSubmit } from './formHandlers'
import { getProperty, setProperty } from './utils/property'
import { FieldOptions, FieldState, Form, FormOptions, FormState } from './types'
import createStore from './utils/redux'

export enum ActionTypes {
  INIT_FORM_VALUES = '@@form/INIT_FORM_VALUES',
  CHANGE_FIELD_VALUE = '@@form/CHANGE_FIELD_VALUE',
  INIT_FIELD = '@@form/INIT_FIELD',
  DESTROY_FIELD = '@@form/DESTROY_FIELD',
  TOUCH_FIELD = '@@form/TOUCH_FIELD',
}

type InitFormValuesAction<V> = {
  type: typeof ActionTypes.INIT_FORM_VALUES
  values: V
}
type ChangeFieldValueAction = {
  type: typeof ActionTypes.CHANGE_FIELD_VALUE
  field: string
  value: any
  error: any
}
type InitFieldAction = {
  type: typeof ActionTypes.INIT_FIELD
  field: string
  error: any
}
type DestroyFieldAction = {
  type: typeof ActionTypes.DESTROY_FIELD
  field: string
}
type TouchFieldAction = { type: typeof ActionTypes.TOUCH_FIELD; field: string }

type FieldAction = ChangeFieldValueAction | InitFieldAction | TouchFieldAction
type FormAction<V> = InitFormValuesAction<V> | FieldAction | DestroyFieldAction

type ReduxFieldStates = { [fieldId: string]: ReduxFieldState }
type ReduxFormErrors = { [fieldId: string]: any }
type ReduxState<V> = {
  formValues: V
  formErrors: ReduxFormErrors
  fieldState: ReduxFieldStates
}

type ReduxFieldState = { touched: boolean; dirty: boolean }

function fieldReducer(
  state: ReduxFieldState,
  action: FieldAction
): ReduxFieldState {
  switch (action.type) {
    case ActionTypes.INIT_FIELD:
      return { touched: false, dirty: false }
    case ActionTypes.CHANGE_FIELD_VALUE:
      return { ...state, dirty: true }
    case ActionTypes.TOUCH_FIELD:
      return { ...state, touched: true }
  }
}

function fieldState(
  state: ReduxFieldStates,
  action: FormAction<any>
): ReduxFieldStates {
  switch (action.type) {
    case ActionTypes.INIT_FIELD:
    case ActionTypes.CHANGE_FIELD_VALUE:
    case ActionTypes.TOUCH_FIELD:
      return {
        ...state,
        [action.field]: fieldReducer(state[action.field], action),
      }
    case ActionTypes.DESTROY_FIELD:
      const { [action.field]: _, ...remaining } = state
      return remaining
    default:
      return state
  }
}

function formErrors<V>(state: ReduxFormErrors, action: FormAction<V>) {
  switch (action.type) {
    case ActionTypes.INIT_FIELD:
    case ActionTypes.CHANGE_FIELD_VALUE:
      const newError = action.error || undefined
      return state[action.field] === newError
        ? state
        : { ...state, [action.field]: newError }
    case ActionTypes.DESTROY_FIELD:
      const { [action.field]: _, ...remaining } = state
      return remaining
    default:
      return state
  }
}

function formValues<V>(state: V, action: FormAction<V>) {
  switch (action.type) {
    case ActionTypes.INIT_FORM_VALUES:
      return action.values
    case ActionTypes.CHANGE_FIELD_VALUE:
      return setProperty(state, action.field, action.value)
    default:
      return state
  }
}

function formReducer<V>(
  state: ReduxState<V>,
  action: FormAction<V>
): ReduxState<V> {
  return {
    formValues: formValues(state.formValues, action),
    formErrors: formErrors(state.formErrors, action),
    fieldState: fieldState(state.fieldState, action),
  }
}

export default function createForm<V>(
  { initialValues }: FormOptions<V> = { initialValues: {} as any }
): Form<V> {
  const store = createStore<ReduxState<V>, FormAction<V>>(formReducer, {
    formValues: initialValues,
    formErrors: {},
    fieldState: {},
  })

  const fieldRefs: { [fieldId: string]: any } = {} // any = { [ref: symbol]: FieldOptions }

  const validateField = (fieldId: string, value: any) => {
    if (!fieldRefs[fieldId]) {
      return undefined
    }
    const validate =
      Object.getOwnPropertySymbols(fieldRefs[fieldId])
        .map(ref => fieldRefs[fieldId][ref])
        .map(x => x.validate)
        .find(x => !!x) || ((): any => undefined)
    return validate(value)
  }

  // State selectors
  const getFieldValue = (fieldId: string) => {
    return getProperty(store.getState().formValues, fieldId) || ''
  }

  const getFieldState = (fieldId: string): FieldState => ({
    ...store.getState().fieldState[fieldId],
    error: store.getState().formErrors[fieldId],
    value: getFieldValue(fieldId),
  })

  const getFormState = (): FormState<V> => {
    const state = store.getState()
    return {
      values: state.formValues,
      errors: state.formErrors,
      anyError: Object.values(state.formErrors).some(field => !!field),
      anyTouched: Object.values(state.fieldState).some(field => field.touched),
      anyDirty: Object.values(state.fieldState).some(field => field.dirty),
    }
  }

  // Field handlers
  const setFieldOptions = (
    fieldId: string,
    ref: symbol,
    opts: FieldOptions = {}
  ) => {
    const { validate } = opts
    if (!fieldRefs[fieldId]) {
      fieldRefs[fieldId] = {}
    }
    fieldRefs[fieldId][ref] = {
      validate,
    }
  }
  const unsetFieldOptions = (fieldId: string, ref: symbol) => {
    delete fieldRefs[fieldId][ref]
  }

  const initializeField = (fieldId: string) => {
    const value = getFieldValue(fieldId)
    const error = validateField(fieldId, value)
    store.dispatch({
      type: ActionTypes.INIT_FIELD,
      field: fieldId,
      error: error,
    })
  }

  const destroyField = (fieldId: string) => {
    store.dispatch({
      type: ActionTypes.DESTROY_FIELD,
      field: fieldId,
    })
  }

  const changeFieldValue = (fieldId: string, value: any) => {
    store.dispatch({
      type: ActionTypes.CHANGE_FIELD_VALUE,
      field: fieldId,
      value: value,
      error: validateField(fieldId, value),
    })
    return value
  }

  const touchField = (fieldId: string) => {
    store.dispatch({ type: ActionTypes.TOUCH_FIELD, field: fieldId })
  }

  // Form handlers
  const resetFormValues = (newInitialValues?: V) => {
    if (newInitialValues) {
      initialValues = newInitialValues
    }
    store.dispatch({
      type: ActionTypes.INIT_FORM_VALUES,
      values: initialValues,
    })
    Object.keys(fieldRefs).forEach(fieldId => {
      initializeField(fieldId)
    })
  }

  const touchAll = () => {
    Object.keys(fieldRefs).forEach(fieldId => {
      touchField(fieldId)
    })
  }

  const submitHandler: (fn: (val: any) => any) => (event?: Event) => any = fn =>
    handleFormSubmit(() => {
      const state = getFormState()
      if (state.anyError) {
        touchAll()
        return
      }
      return fn(state.values)
    })

  return {
    subscribe: store.subscribe,
    formActions: {
      resetFormValues,
      submitHandler,
      getFormState,
    },
    fieldActions: {
      setFieldOptions,
      unsetFieldOptions,
      initializeField,
      destroyField,
      changeFieldValue,
      touchField,
      getFieldState,
    },
  }
}

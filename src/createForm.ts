import { handleFormSubmit } from './formHandlers'
import { getProperty, setProperty } from './utils/property'
import { FieldOptions, FieldState, Form, FormOptions } from './types'
import createStore from './utils/redux'

const INIT_FORM_VALUES = 'INIT_FORM_VALUES'
const CHANGE_FIELD_VALUE = 'CHANGE_FIELD_VALUE'
const INIT_FIELD = 'INIT_FIELD'
const TOUCH_FIELD = 'TOUCH_FIELD'

type InitFormValues = {
  type: typeof INIT_FORM_VALUES
  field: string
  values: object
}
type ChangeFieldValue = {
  type: typeof CHANGE_FIELD_VALUE
  field: string
  value: any
  error: any
}
type InitField = { type: typeof INIT_FIELD; field: string; error: any }
type TouchField = { type: typeof TOUCH_FIELD; field: string }

export type Action = InitFormValues | ChangeFieldValue | InitField | TouchField
export type FieldAction = ChangeFieldValue | InitField | TouchField

type ReduxFieldStates = { [fieldId: string]: ReduxFieldState }
type ReduxState<TValues> = { formValues: TValues; fieldState: ReduxFieldStates }

type Diff<T, U> = T extends U ? never : T
type ObjectDiff<T, U> = Pick<T, Diff<keyof T, keyof U>>
type ReduxFieldState = ObjectDiff<FieldState, { value: any }>

function fieldReducer(
  state: ReduxFieldState,
  action: FieldAction
): ReduxFieldState {
  switch (action.type) {
    case INIT_FIELD:
      return {
        error: action.error,
        touched: false,
        dirty: false,
      }
    case CHANGE_FIELD_VALUE:
      return {
        ...state,
        error: action.error,
        dirty: true,
      }
    case TOUCH_FIELD:
      return {
        ...state,
        touched: true,
      }
  }
}

function fieldState(
  state: ReduxFieldStates,
  action: Action
): ReduxFieldStates {
  switch (action.type) {
    case INIT_FIELD:
    case CHANGE_FIELD_VALUE:
    case TOUCH_FIELD:
      return {
        ...state,
        [action.field]: fieldReducer(state[action.field], action),
      }
    default:
      return state
  }
}

function formValues<TValues>(state: TValues, action: Action) {
  switch (action.type) {
    case INIT_FORM_VALUES:
      return action.values
    case CHANGE_FIELD_VALUE:
      return setProperty(state, action.field, action.value)
    default:
      return state
  }
}

function formReducer<TValues>(state: ReduxState<TValues>, action: any): ReduxState<TValues> {
  return {
    formValues: formValues(state.formValues, action),
    fieldState: fieldState(state.fieldState, action),
  }
}

export default function createForm<TValues>(
  { initialValues }: FormOptions<TValues> = { initialValues: {} as any }
): Form<TValues> {
  const store = createStore<ReduxState<TValues>>(formReducer, {
    formValues: initialValues,
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

  const getFieldState = (fieldId: string) => {
    return {
      ...store.getState().fieldState[fieldId],
      value: getFieldValue(fieldId),
    }
  }

  const getFormState = () => {
    const state = store.getState()
    return {
      values: state.formValues,
      anyTouched: Object.values(state.fieldState).some(field => field.touched),
      anyError: Object.values(state.fieldState).some(field => !!field.error),
      anyDirty: Object.values(state.fieldState).some(field => field.dirty),
    }
  }

  // Field handlers
  const initializeField = (fieldId: string) => {
    const value = getFieldValue(fieldId)
    const error = validateField(fieldId, value)
    store.dispatch({ type: INIT_FIELD, field: fieldId, error: error })
  }

  const initField = (fieldId: string, ref: symbol, opts: FieldOptions = {}) => {
    const { validate } = opts
    if (!fieldRefs[fieldId]) {
      fieldRefs[fieldId] = {}
    }
    fieldRefs[fieldId][ref] = {
      validate,
    }
    initializeField(fieldId)
  }
  const destroyField = (fieldId: string, ref: symbol) => {
    delete fieldRefs[fieldId][ref]
  }

  const changeFieldValue = (fieldId: string, value: any) => {
    store.dispatch({
      type: CHANGE_FIELD_VALUE,
      field: fieldId,
      value: value,
      error: validateField(fieldId, value),
    })
  }

  const touchField = (fieldId: string) => {
    store.dispatch({ type: TOUCH_FIELD, field: fieldId })
  }

  // Form handlers
  const resetFormValues = (newInitialValues?: any) => {
    if (newInitialValues) {
      initialValues = newInitialValues
    }
    store.dispatch({ type: INIT_FORM_VALUES, values: initialValues })
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
      initField,
      destroyField,
      changeFieldValue,
      touchField,
      getFieldState,
    },
  }
}

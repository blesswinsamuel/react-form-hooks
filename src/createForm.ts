import { combineReducers, createStore } from 'redux'
import { handleFormSubmit } from './formHandlers'
import { getProperty, setProperty } from './utils/property'
import { FieldOptions, FieldState, Form, FormOptions } from './types'

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

// @ts-ignore
function fieldReducer(state: FieldState = {}, action: Action): FieldState {
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
  state: { [fieldId: string]: FieldState } = {},
  action: Action
): { [field: string]: FieldState } {
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

function formValues(state = {}, action: Action) {
  switch (action.type) {
    case INIT_FORM_VALUES:
      return action.values
    case CHANGE_FIELD_VALUE:
      return setProperty(state, action.field, action.value)
    default:
      return state
  }
}

const formReducer = combineReducers({
  formValues,
  fieldState,
})

// @ts-ignore
export default function createForm({ initialValues }: FormOptions = {}): Form {
  const store = createStore(
    formReducer,
    { formValues: initialValues },
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
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

  // Actions
  const initFieldAction = (fieldId: string) => {
    const value = getFieldValue(fieldId)
    return {
      type: INIT_FIELD,
      field: fieldId,
      value: value,
      error: validateField(fieldId, value),
    }
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
  const initField = (fieldId: string, ref: symbol, opts: FieldOptions = {}) => {
    const { validate } = opts
    if (!fieldRefs[fieldId]) {
      fieldRefs[fieldId] = {}
    }
    fieldRefs[fieldId][ref] = {
      validate,
    }
    store.dispatch(initFieldAction(fieldId))
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
    if (
      newInitialValues &&
      !(newInitialValues.target && newInitialValues.target instanceof Element)
    ) {
      initialValues = newInitialValues
    }
    store.dispatch({ type: INIT_FORM_VALUES, values: initialValues })
    Object.keys(fieldRefs).forEach(fieldId => {
      store.dispatch(initFieldAction(fieldId))
    })
  }

  const touchAll = () => {
    Object.keys(fieldRefs).forEach(fieldId => {
      touchField(fieldId)
    })
  }

  const submitHandler: (fn: (val: any) => any) => (event: Event) => any = fn =>
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

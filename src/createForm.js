import { combineReducers, createStore } from 'redux'
import { handleFormSubmit } from './formHandlers'
import { getProperty, setProperty } from './utils/Obj'

const INIT_FORM_VALUES = 'INIT_FORM_VALUES'
const CHANGE_FIELD_VALUE = 'CHANGE_FIELD_VALUE'
const INIT_FIELD = 'INIT_FIELD'
const TOUCH_FIELD = 'TOUCH_FIELD'

function fieldReducer(state = {}, action) {
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
    default:
      return state
  }
}

function fieldState(state = {}, action) {
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

function formValues(state = {}, action) {
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

export default function createForm({ initialValues }) {
  const store = createStore(formReducer, { formValues: initialValues }, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  const fieldRefs = {}

  const validateField = (fieldId, value) => {
    if (!fieldRefs[fieldId]) {
      return undefined;
      // throw new Error(`Field "${fieldId}" is not registered`)
    }
    const validate = Object.getOwnPropertySymbols(fieldRefs[fieldId])
        .map(ref => fieldRefs[fieldId][ref])
        .map(x => x.validate)
        .find(x => !!x)
      || (() => null)
    return validate(value)
  }

  // Actions
  const initFieldAction = (fieldId) => {
    const value = getFieldValue(fieldId)
    return {
      type: INIT_FIELD,
      field: fieldId,
      value: value,
      error: validateField(fieldId, value),
    }
  }

  // State selectors
  const getFieldValue = (fieldId) => {
    return getProperty(store.getState().formValues, fieldId) || ''
  }

  const getFieldState = (fieldId) => {
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
  const initField = (fieldId, ref, opts) => {
    const { validate } = opts || {}
    if (!fieldRefs[fieldId]) {
      fieldRefs[fieldId] = {}
    }
    fieldRefs[fieldId][ref] = {
      validate,
    }
    store.dispatch(initFieldAction(fieldId))
  }
  const destroyField = (fieldId, ref) => {
    delete fieldRefs[fieldId][ref]
  }

  const changeFieldValue = (fieldId) => (value) => {
    store.dispatch({
      type: CHANGE_FIELD_VALUE,
      field: fieldId,
      value: value,
      error: validateField(fieldId, value)
    })
  }

  const touchField = (fieldId) => () => {
    store.dispatch({ type: TOUCH_FIELD, field: fieldId })
  }

  // Form handlers
  const initializeForm = (newInitialValues) => {
    if (newInitialValues) {
      initialValues = newInitialValues
    }
    store.dispatch({ type: INIT_FORM_VALUES, values: initialValues })
    Object.keys(fieldRefs).forEach((fieldId) => {
      store.dispatch(initFieldAction(fieldId))
    })
  }

  const touchAll = () => {
    Object.keys(fieldRefs).forEach((fieldId) => {
      touchField(fieldId)()
    })
  }

  const submitHandler = fn =>
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
      initializeForm,
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

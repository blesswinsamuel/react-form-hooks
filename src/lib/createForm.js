import { createStore, combineReducers } from 'redux'
import { handleFormSubmit } from './formHandlers'
import { getProperty, setProperty } from './utils/Obj'

const CHANGE_FIELD_VALUE = 'CHANGE_FIELD_VALUE'
const INIT_FIELD = 'INIT_FIELD'
const TOUCH_FIELD = 'TOUCH_FIELD'

function fieldReducer(state = {}, action) {
  switch (action.type) {
    case INIT_FIELD:
      return {
        value: action.value,
        error: action.error,
        touched: false,
        dirty: false,
      }
    case CHANGE_FIELD_VALUE:
      return {
        ...state,
        value: action.value,
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
    case INIT_FIELD:
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
      throw new Error(`Field "${fieldId}" is not registered`)
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
    const value = getProperty(store.getState().formValues, fieldId) || ''
    return {
      type: INIT_FIELD,
      field: fieldId,
      value: value,
      error: validateField(fieldId, value),
    }
  }

  // State selectors
  const getFieldState = (fieldId) => {
    return store.getState().fieldState[fieldId]
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
  const registerField = (fieldId, ref, setFieldState) => {
    console.log("REGISTER_FIELD", fieldId)
    const unsubscribe = store.subscribe(() => {
      setFieldState(getFieldState(fieldId))
    })
    return () => {
      console.log("DESTROY_FIELD", fieldId)
      delete fieldRefs[fieldId][ref]
      unsubscribe()
    }
  }

  const initAndGetFieldState = (fieldId, ref, { validate } = {}) => {
    if (!fieldRefs[fieldId]) {
      fieldRefs[fieldId] = {}
    }
    fieldRefs[fieldId][ref] = {
      validate,
    }
    store.dispatch(initFieldAction(fieldId))
    return getFieldState(fieldId)
  }

  const changeFieldValue = (fieldId) => (value) => {
    store.dispatch({ type: CHANGE_FIELD_VALUE, field: fieldId, value: value, error: validateField(fieldId, value) })
  }

  const touchField = (fieldId) => () => {
    store.dispatch({ type: TOUCH_FIELD, field: fieldId })
  }

  // Form handlers
  const registerForm = (setFormState) => {
    const unsubscribe = store.subscribe(() => {
      setFormState(getFormState())
    })
    return () => {
      unsubscribe()
    }
  }

  const initializeForm = (newInitialValues) => {
    if (newInitialValues) {
      initialValues = newInitialValues
    }
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
    formActions: {
      registerForm,
      initializeForm,
      submitHandler,
      touchAll,
      getFormState,
    },
    fieldActions: {
      registerField,
      changeFieldValue,
      touchField,
      initAndGetFieldState,
    },
  }
}

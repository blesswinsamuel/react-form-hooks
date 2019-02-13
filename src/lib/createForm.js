import { createStore } from 'redux'
import { handleFormSubmit } from './formHandlers'

const CHANGE_FIELD_VALUE = 'CHANGE_FIELD_VALUE'
const INIT_FIELD = 'INIT_FIELD'
const TOUCH_FIELD = 'TOUCH_FIELD'
const RESET_FORM = 'RESET_FORM'

function getProperty(obj, key) {
  const parts = key.replace(/\[(\w+)]/g, '.$1') // convert indexes to properties
    .replace(/^\./, '')  // strip a leading dot
    .split('.')
  let curObj = obj
  for (let i = 0, n = parts.length; i < n; ++i) {
    const k = parts[i]
    if (curObj === undefined) {
      return undefined
    }
    if (k in curObj) {
      curObj = curObj[k]
    } else {
      return
    }
  }
  return curObj
}

function convert(state) {
  const r = {}
  for (const key in state) {
    if (state.hasOwnProperty(key)) {
      const k = key.split('.')[0]
      r[k] = state[key].value
    }
  }
  return r
}

function formReducer(state = {}, action) {
  switch (action.type) {
    case RESET_FORM:
      return state
    case INIT_FIELD:
      return {
        ...state,
        [action.field]: {
          value: action.value,
          error: action.error,
          touched: false,
          dirty: false,
        },
      }
    case CHANGE_FIELD_VALUE:
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          value: action.value,
          error: action.error,
          dirty: true,
        },
      }
    case TOUCH_FIELD:
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          touched: true,
        },
      }
    default:
      return state
  }
}

export default function createForm({ initialValues }) {
  const store = createStore(formReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  const fieldRefs = {}
  // const formRefs = {}

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

  const initField = (fieldId) => {
    const value = getProperty(initialValues, fieldId) || ''
    return {
      type: INIT_FIELD,
      field: fieldId,
      value: value,
      error: validateField(fieldId, value),
    }
  }

  const getFieldState = (fieldId) => {
    return store.getState()[fieldId]
  }

  const getFormState = () => {
    const state = store.getState()
    return {
      values: {},
      anyTouched: Object.values(state).some(field => field.touched),
      anyError: Object.values(state).some(field => !!field.error),
      anyDirty: Object.values(state).some(field => field.dirty),
    }
  }

  const initFieldAndGetState = (fieldId, ref, { validate } = {}) => {
    if (!fieldRefs[fieldId]) {
      fieldRefs[fieldId] = {}
    }
    fieldRefs[fieldId][ref] = {
      validate,
    }
    store.dispatch(initField(fieldId))
    return getFieldState(fieldId)
  }

  const registerField = (fieldId, ref, setFieldState) => {
    const unsubscribe = store.subscribe(() => {
      setFieldState(getFieldState(fieldId))
    })
    return () => {
      delete fieldRefs[fieldId][ref]
      unsubscribe()
    }
  }

  const registerForm = (ref, setFormState) => {
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
      store.dispatch(initField(fieldId))
    })
  }

  const touchAll = () => {
    Object.keys(fieldRefs).forEach((fieldId) => {
      store.dispatch({ type: TOUCH_FIELD, field: fieldId })
    })
  }

  const changeFieldValue = (fieldId) => (value) => {
    store.dispatch({ type: CHANGE_FIELD_VALUE, field: fieldId, value: value, error: validateField(fieldId, value) })
  }

  const touchField = (fieldId) => () => {
    store.dispatch({ type: TOUCH_FIELD, field: fieldId })
  }

  const submitHandler = fn =>
    handleFormSubmit(() => {
      const state = store.getState()
      if (Object.values(state).some(field => field.error)) {
        touchAll()
        return
      }
      return fn(convert(state))
    })

  return {
    formActions: {
      registerForm,
      touchAll,
      submitHandler,
      initializeForm,
      getFormState,
    },
    fieldActions: {
      registerField,
      changeFieldValue,
      touchField,
      initFieldAndGetState,
    },
  }
}

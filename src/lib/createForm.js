import { createStore } from 'redux'
import { handleFormSubmit } from './formHandlers'
import { dotify, nestify } from './utils/Obj'

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

function formReducer(state = {}, action) {
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

export default function createForm({ initialValues }) {
  console.log(initialValues)
  let flattenedInitialValues = dotify(initialValues)
  console.log(flattenedInitialValues)
  const store = createStore(formReducer, flattenedInitialValues, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
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
    const value = flattenedInitialValues[fieldId] || ''
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
      values: nestify(state, state => state.value),
      anyTouched: Object.values(state).some(field => field.touched),
      anyError: Object.values(state).some(field => !!field.error),
      anyDirty: Object.values(state).some(field => field.dirty),
    }
  }

  const initAndGetFieldState = (fieldId, ref, { validate } = {}) => {
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
      flattenedInitialValues = dotify(initialValues)
    }
    Object.keys(fieldRefs).forEach((fieldId) => {
      store.dispatch(initField(fieldId))
    })
  }

  const touchAll = () => {
    Object.keys(fieldRefs).forEach((fieldId) => {
      touchField(fieldId)()
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
      touchAll,
      submitHandler,
      initializeForm,
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

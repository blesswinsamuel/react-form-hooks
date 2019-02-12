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

const isEqual = (a, b) => {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

export default function createForm({ initialValues }) {
  const store = createStore(formReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  const fieldRefs = {}

  const validateField = (fieldId, value) => {
    if (!fieldRefs[fieldId]) {
      console.error(`Field "${fieldId}" is not registered`)
    }
    const validate = Object.values(fieldRefs[fieldId] || {}).map(x => x.validate).find(x => !!x)
      || (() => null)
    return validate(value)
  }

  const initField = (fieldId, { mapValueFn, validate } = {}) => {
    const value = getProperty(initialValues, fieldId) || ''
    return {
      type: INIT_FIELD,
      field: fieldId,
      value: value,
      error: validateField(fieldId, value),
    }
  }

  const registerField = (fieldId, ref, validate, mapValueFn, setFieldState, subscribeTo) => {
    if (!fieldRefs[fieldId]) {
      fieldRefs[fieldId] = {}
    }
    fieldRefs[fieldId][ref] = {
      validate, mapValueFn, setFieldState,
    }
    const unsubscribe = store.subscribe(() => {
      setFieldState(prevState => {
        const newState = store.getState()[fieldId] || {}
        if (!isEqual(subscribeTo(prevState), subscribeTo(newState))) {
          return newState
        }
        return prevState
      })
    })
    store.dispatch(initField(fieldId))
    return () => {
      delete fieldRefs[fieldId][ref]
      unsubscribe()
    }
  }

  const initialize = (newInitialValues) => {
    initialValues = newInitialValues
    resetForm()
  }

  const getFieldState = (fieldId, { mapValueFn, validate } = {}) => {
    if (!store.getState()[fieldId]) {
      store.dispatch(initField(fieldId, { mapValueFn, validate }))
    }
    return store.getState()[fieldId]
  }

  const resetForm = () => {
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

  const getFieldValue = (fieldId) => {
    const state = store.getState()
    return state[fieldId] && state[fieldId].value
  }

  const getValues = () => {

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
      initialize,
      resetForm,
      touchAll,
      submitHandler,
    },
    fieldActions: {
      registerField,
      changeFieldValue,
      touchField,
      getFieldState,
      getFieldValue,
    },
  }
}

// const emptyObj = {}
// const formProvider = Provider => {
//   return function FormProvider(props) {
//     const { children, values: initialValues = emptyObj } = props
//     const previousInitialValues = usePrevious(initialValues) || initialValues
//     const [state, setState] = useState({
//       values: initialValues,
//       meta: emptyObj,
//     })
//     const resetForm = () =>
//       setState({
//         values: initialValues,
//         meta: computeErrors(initialValues, emptyObj),
//       })
//     // Reset form when initialValues changes
//     useEffect(() => {
//       if (initialValues !== previousInitialValues) {
//         resetForm()
//       }
//     }, [initialValues])
//
//     return (
//       <Provider
//         value={{
//           values: state.values,
//           meta: state.meta,
//           registeredFields: registeredFields.current,
//           setState,
//         }}
//       >
//         {children}
//       </Provider>
//     )
//   }
// }

import React, { useEffect, useRef, useState } from 'react'
import set from 'lodash/fp/set'
import getOr from 'lodash/fp/getOr'
import { usePrevious } from './effects'
import { combineReducers, createStore } from 'redux'

const SET_FIELD_VALUE = Symbol()
const SET_FIELD_TOUCHED = Symbol()
const RESET_FORM = Symbol()

function formState(state = {}, action) {
  switch (action.type) {
    case RESET_FORM:
      return state
    case SET_FIELD_VALUE:
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          value: action.value,
          error: action.error,
          dirty: true,
        },
      }
    case SET_FIELD_TOUCHED:
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

const formReducer = combineReducers({
  state: formState,
})

export default function createForm() {
  const store = createStore(formReducer)
  const Context = React.createContext({})

  return {
    Context,
    Provider: formProvider(Context.Provider),
  }
}

const emptyObj = {}
const formProvider = Provider => {
  return function FormProvider(props) {
    const { children, values: initialValues = emptyObj } = props
    const previousInitialValues = usePrevious(initialValues) || initialValues
    const [state, setState] = useState({
      values: initialValues,
      meta: emptyObj,
    })
    const resetForm = () =>
      setState({
        values: initialValues,
        meta: computeErrors(initialValues, emptyObj),
      })
    // Reset form when initialValues changes
    useEffect(() => {
      if (initialValues !== previousInitialValues) {
        resetForm()
      }
    }, [initialValues])

    const registeredFields = useRef({})
    const getRegisteredFieldForId = fieldId => {
      const { validate = () => undefined, mapValue = v => v } =
      registeredFields.current[fieldId] || {}
      return { validate, mapValue }
    }

    const computeErrors = (values, meta) => {
      return Object.keys(registeredFields.current).reduce((acc, fieldId) => {
        const fieldMeta = getOr({}, fieldId, meta)
        const value = getOr('', fieldId, values)
        return set(
          fieldId,
          {
            ...fieldMeta,
            error: getRegisteredFieldForId(fieldId).validate(value, values),
          },
          acc,
        )
      }, meta)
    }
    const touchAll = () => {
      setState(({ values = {}, meta = {} }) => ({
        values: values,
        meta: Object.keys(registeredFields.current).reduce(
          (acc, fieldId) =>
            set(
              fieldId,
              {
                ...fieldActions(fieldId).getMeta(acc),
                touched: true,
              },
              acc,
            ),
          meta,
        ),
      }))
    }

    const fieldActions = fieldId => {
      const getMeta = meta => getOr({}, fieldId, meta)
      const getValue = values => getOr('', fieldId, values)
      const getRegisteredField = () => getRegisteredFieldForId(fieldId)
      return {
        getMeta,
        getValue,
        registerField: (validate, mapValue) => {
          if (!registeredFields.current[fieldId]) {
            registeredFields.current[fieldId] = {}
          }
          const registeredField = registeredFields.current[fieldId]
          if (!registeredField.validate) {
            registeredField.validate = validate
          }
          if (!registeredField.mapValue) {
            registeredField.mapValue = mapValue
          }
        },

        initField: () => {
          // update validation error value to state
          setState(({ values = {}, meta = {} }) => ({
            values: values,
            meta: set(
              fieldId,
              {
                ...getMeta(meta),
                error: getRegisteredField().validate(getValue(values), values),
              },
              meta,
            ),
          }))
        },

        changeFieldValue: val => {
          const registeredField = getRegisteredField()
          setState(({ values = {}, meta = {} }) => {
            const newValues = set(
              fieldId,
              registeredField.mapValue(val, values),
              values,
            )
            return {
              values: newValues,
              meta: computeErrors(
                newValues,
                set(
                  fieldId,
                  {
                    ...getMeta(meta),
                    dirty: true,
                  },
                  meta,
                ),
              ),
            }
          })
        },

        touchField: () => {
          setState(({ values = {}, meta = {} }) => ({
            values: values,
            meta: set(
              fieldId,
              {
                ...getMeta(meta),
                touched: true,
              },
              meta,
            ),
          }))
        },
      }
    }

    return (
      <Provider
        value={{
          values: state.values,
          meta: state.meta,
          registeredFields: registeredFields.current,
          setState,
          fieldActions,
          formActions: { resetForm, touchAll },
        }}
      >
        {children}
      </Provider>
    )
  }
}

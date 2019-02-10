import React, { useContext, useEffect, useState, useRef } from 'react'
import set from 'lodash/fp/set'
import getOr from 'lodash/fp/getOr'
import { handleFormSubmit } from './formHandlers'
import { usePrevious } from './effects'

export function makeForm() {
  const Context = React.createContext({})

  return {
    Context,
    Provider: formProvider(Context.Provider),
    useForm: useForm(Context),
    useFormField: useFormField(Context),
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
          acc
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
              acc
            ),
          meta
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
              meta
            ),
          }))
        },

        changeFieldValue: val => {
          const registeredField = getRegisteredField()
          setState(({ values = {}, meta = {} }) => {
            const newValues = set(
              fieldId,
              registeredField.mapValue(val, values),
              values
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
                  meta
                )
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
              meta
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

const useForm = Context => onSubmit => {
  const form = useContext(Context)

  const submitHandler = fn =>
    handleFormSubmit(() => {
      if (Object.values(form.meta).some(meta => meta.error)) {
        form.formActions.touchAll()
        return
      }
      return fn(form.values)
    })

  const submitForm = submitHandler(onSubmit)

  return {
    ...form,
    dirty: Object.values(form.meta).some(meta => meta.dirty),
    touched: Object.values(form.meta).some(meta => meta.touched),
    error:
      Object.values(form.meta).some(meta => meta.touched && meta.error) &&
      'Form has validation errors',
    submitForm,
    submitHandler,
  }
}

const useFormField = Context => (fieldId, mapValueFn, validate) => {
  const form = useContext(Context)
  const {
    changeFieldValue,
    registerField,
    initField,
    touchField,
    getMeta,
    getValue,
  } = form.fieldActions(fieldId)

  // Register field on mount
  useEffect(() => registerField(validate, mapValueFn), [])

  // Set error on component mount
  useEffect(initField, [])

  const input = {
    id: fieldId,
    value: getValue(form.values),
    onChange: changeFieldValue,
    onBlur: touchField,
  }
  const meta = getMeta(form.meta)
  return {
    form,
    input,
    meta,
  }
}

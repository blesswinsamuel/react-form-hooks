import { get, isEqual, set } from 'lodash'

const DEFAULT_VALUE = null

export default class Form {
  constructor ({
                 initialValues,
                 setFormState,
                 getFormState,
                 onSubmit,
                 onSubmitSuccess = response => response,
                 onSubmitFailure = error => error.response
               }) {
    this.initialValues = initialValues
    this.submitting = false
    this.setFormState = setFormState
    this.getFormState = getFormState
    this.onSubmit = onSubmit
    this.onSubmitSuccess = onSubmitSuccess
    this.onSubmitFailure = onSubmitFailure
    this.subscriptions = {}

    this.formApi = {
      getValues: this.getValues,
      getErrors: this.getValues,
      hasErrors: this.hasErrors,
      submitForm: this.submitForm,

      touchAll: () => {
        this.setFormState({ anyTouched: true })
        Object.keys(this.subscriptions).forEach(field => this.setFieldState(field)({ touched: true }))
      },

      resetForm: () => {
        this.setValues(this.initialValues)
      }
    }
  }

  registerField = (field) => (fieldProps) => {
    // fieldProps = { setFormState, getFormState, validator }
    this.subscriptions[field] = [...(this.subscriptions[field] || []), fieldProps]

    return () => this.subscriptions[field].pop()
  }

  setFieldState = (field) => (state) => {
    if (this.subscriptions[field]) {
      this.subscriptions[field].map(subscription => subscription.setFieldState(state))
    }
  }

  validate = (field) => (value, values) => {
    if (this.subscriptions[field]) {
      const errors = this.subscriptions[field].map(subscription => subscription.validate(value, values))
      if (errors.length === 0) return undefined
      return errors[0]
    }
  }

  getValues = () => this.getFormState().values
  getErrors = () => this.getFormState().errors
  hasErrors = () => Object.values(this.getErrors()).filter(x => typeof x !== 'undefined').length !== 0

  getValue = (field, allValues = this.getValues()) => get(allValues, field, DEFAULT_VALUE)
  getError = (field) => this.getErrors()[field]

  getFieldApi = (field) => ({
    getValue: () => this.getValue(field),
    setValue: (value) => this.setValue(field, value),
    getError: () => this.getError(field),
    setTouched: () => {
      this.setFormState({ anyTouched: true })
      this.setFieldState(field)({ touched: true })
    }
  })

  submitForm = async (event) => {
    if (event) event.preventDefault()
    this.formApi.touchAll()

    if (!this.hasErrors()) {
      return await Promise.resolve(this.submitFormAsync())
    }
    this.setFormState({ submitError: 'Please check for errors.' })
  }

  submitFormAsync = async () => {
    this.setFormState({ submitting: true, submitError: null, submitResponse: null })
    try {
      const response = await this.onSubmit(this.getValues())
      this.setFormState({ submitting: false, submitError: null })
      return this.onSubmitSuccess(response)
    } catch (error) {
      const errorMessage = (error.data && error.data.message) || error.statusText
      this.setFormState({ submitting: false, submitResponse: null, submitError: errorMessage })
      return this.onSubmitFailure(error)
    }
  }

  setValue = (field, value) => {
    const values = Object.assign({}, this.getValues())
    set(values, field, value)

    const error = this.validate(field)(value, values)
    const errors = { ...this.getErrors(), [field]: error }

    this.setFormState({ values, errors, anyDirty: true })
    this.setFieldState(field)({ value, error, dirty: true })
  }

  setValues = (values) => {
    const errors = Object.keys(this.subscriptions).reduce((acc, field) => ({
      ...acc,
      [field]: this.validate(field)(this.getValue(field, values), values)
    }), {})

    this.setFormState({ values, errors, anyDirty: false, anyTouched: false })
    Object.keys(this.subscriptions).forEach(field =>
      this.setFieldState(field)({ value: this.getValue(field, values), error: errors[field], dirty: false, touched: false })
    )
  }
}

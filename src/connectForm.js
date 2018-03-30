import React from 'react';
import PropTypes from 'prop-types';

import { get, isEqual, set } from 'lodash';

const DEFAULT_VALUE = null

class Form {
  constructor({
    initialValues,
    setFormState,
    getFormState,
    onSubmit,
    onSubmitSuccess = response => response,
    onSubmitFailure = error => { throw error }
  }) {
    this.initialValues = initialValues
    this.submitting = false
    this.setFormState = setFormState
    this.getFormState = getFormState
    this.onSubmit = onSubmit
    this.onSubmitSuccess = onSubmitSuccess
    this.onSubmitFailure = onSubmitFailure
    this.fieldState = {}
    this.subscriptions = {}
  }

  setValues = (values) => {
    const errors = Object.keys(this.subscriptions).reduce((acc, field) => ({
      ...acc,
      [field]: this.validate(field)(this.getValue(field, values), values)
    }), {})

    this.setFormState({ values, errors, dirty: false, touched: false })
    Object.keys(this.subscriptions).forEach(field =>
      this.updateField(field)({ value: this.getValue(field, values), error: errors[field], dirty: false, touched: false })
    )
  }

  registerField = (field) => (fieldProps) => {
    // fieldProps = { setFormState, getFormState, validator }
    if (this.subscriptions[field]) this.subscriptions[field].push(fieldProps)
    else this.subscriptions[field] = [fieldProps]

    return () => this.subscriptions[field].pop()
  }

  updateField = (field) => (state) => {
    if (this.subscriptions[field])
      this.subscriptions[field].map(subscription => subscription.setFieldState(state))
  }

  validate = (field) => (value, values) => {
    if (this.subscriptions[field]) {
      const errors = this.subscriptions[field].map(subscription => subscription.validate(value, values))
      if (errors.length === 0) return undefined;
      return errors[0]
    }
  }

  getValues = () => this.getFormState().values
  getValue = (field, allValues = this.getValues()) => get(allValues, field, DEFAULT_VALUE)
  setValue = (field) => value => {
    const values = Object.assign({}, this.getValues())
    set(values, field, value)
    return values
  }

  getErrors = () => this.getFormState().errors
  getError = (field) => this.getErrors()[field]
  setError = (field) => error => ({ ...this.getErrors(), [field]: error })
  hasErrors = () => Object.values(this.getErrors()).filter(x => typeof x !== 'undefined').length !== 0

  handleChange = (field) => (onChange = val => val) => (event) => {
    this.changeField(field, onChange(event, this.getValues()))
  }

  handleBlur = (field) => (onBlur = val => val) => (event) => {
    // const value = onBlur(event, this.values)
    // const error = this.validate(field)(value, this.values)
    this.setFormState({ anyTouched: true })
    this.updateField(field)({ touched: true })
  }

  resetForm = () => {
    this.setValues(this.initialValues)
  }

  touchAll = () => {
    this.setFormState({ anyTouched: true })
    Object.keys(this.subscriptions).forEach(field => this.updateField(field)({ touched: true }))
  }

  submitForm = async (event) => {
    if (event) event.preventDefault()
    this.touchAll()

    if (!this.hasErrors()) {
      return await Promise.resolve(this.submitFormAsync())
    }
  }

  submitFormAsync = async () => {
    console.log("hello")
    this.setFormState({ submitting: true });
    try {
      const response = await this.onSubmit(this.getValues())
      if(!this.unmounted) this.setFormState({ submitResponse: response, submitting: false, error: null, submitSucceeded: true });
      return this.onSubmitSuccess(response);
    } catch (error) {
      if(!this.unmounted) this.setFormState({ error: error.message, submitting: false, submitSucceeded: false });
      throw this.onSubmitFailure(error);
    }
  }

  changeField = (field, value) => {
    const values = this.setValue(field)(value)
    
    const error = this.validate(field)(value, values)
    const errors = this.setError(field)(error)

    this.setFormState({ values, errors, anyDirty: true })
    this.updateField(field)({ value, error, dirty: true });
  }
}

const connectForm = ComposedForm =>
class ReactForm extends React.Component {
  static displayName = `connectForm(${getDisplayName(ComposedForm)})`;

  static propTypes = {
    onSubmit: PropTypes.func,
    defaultValues: PropTypes.object,
    values: PropTypes.object,
  }

  static childContextTypes = {
    form: PropTypes.object,
  }

  getChildContext = () => ({
    form: this.form
  })

  constructor(props, context) {
    super(props, context)
    this.form = new Form({
      initialValues: { ...props.defaultValues, ...props.values },
      onSubmit: props.onSubmit,
      setFormState: this.setState.bind(this),
      getFormState: () => this.state,
    })
    this.state = {
      submitting: false,
      submitSucceeded: false,
      submitResponse: null,

      values: {},
      errors: {},

      anyTouched: false,
      anyDirty: false,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState || this.props !== nextProps) return true
    return false
  }

  componentDidMount() {
    this.form.setValues(this.form.initialValues)
  }

  componentWillReceiveProps(next) {
    if (next.values !== this.props.values) {
      this.form.setValues({ ...next.defaultValues, ...next.values })
    }
  }

  render() {
    return <ComposedForm {...this.props}
      onSubmit={this.form.submitForm}
      resetForm={this.form.resetForm}

      {...this.state}

      setValue={this.form.changeField}
      getValues={this.form.getValues}
      getErrors={this.form.getErrors}
      hasErrors={this.form.hasErrors}
    />
  }
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default connectForm;

import React from 'react';
import PropTypes from 'prop-types';

import { get, isEqual, set } from 'lodash';

const DEFAULT_VALUE = null

class Form {
  constructor(initialValues) {
    this.values = initialValues
    this.errors = {}
    this.fieldState = {}
    this.validators = {}
    this.subscriptions = {}
  }

  initialize = (values) => {
    this.values = values
    this.errors = Object.keys(this.fieldState).reduce(
      (acc, field) => ({ ...acc, [field]: this.validate(field)(this.getValue(field), this.values) })
    , {})

    Object.keys(this.subscriptions).forEach(field =>
      this.updateField(field)({ dirty: false, touched: false })
    )
  }

  registerField = (field, { validate = () => undefined }) => (fn) => {
    if (this.subscriptions[field]) this.subscriptions[field].push(fn)
    else this.subscriptions[field] = [fn]

    this.validators[field] = validate
    this.setError(field)(this.validate(field)(this.getValue(field), this.values))

    this.updateField(field)({ dirty: false, touched: false })
    return () => this.subscriptions[field].pop()
  }

  updateField = (field) => (state) => {
    const newState = {
      value: this.getValue(field),
      error: this.getError(field),
      ...state
    }
    this.fieldState[field] = newState
    if (this.subscriptions[field])
      this.subscriptions[field].forEach(fn => fn(newState))
  }

  getValues = () => this.values

  getValue = (field) => get(this.values, field, DEFAULT_VALUE)
  setValue = (field) => value => set(this.values, field, value)

  getError = (field) => this.errors[field]
  setError = (field) => error => this.errors = ({ ...this.errors, [field]: error })
  hasErrors = () => Object.values(this.errors).filter(x => typeof x !== 'undefined').length !== 0

  validate = (field) => (this.validators[field] || (() => undefined))

  handleChange = (field) => (onChange = val => val) => (event) => {
    this.changeField(field, onChange(event, this.values))
  }

  handleBlur = (field) => (onBlur = val => val) => (event) => {
    // const value = onBlur(event, this.values)
    // const error = this.validate(field)(value, this.values)

    this.updateField(field)({ touched: true })
  }

  resetForm = () => {
    if (this.props.resetForm) this.props.resetForm()
    this.initialize(this.props)
  }

  touchAll = () => {
    Object.keys(this.subscriptions).forEach(field => this.updateField(field)({ touched: true }))
  }

  submitForm = (event) => {
    if(event) event.preventDefault()
    this.touchAll()

    if (!this.hasErrors())
      return this.props.onSubmit(this.values)
  }

  changeField = (field, value) => {
    const error = this.validate(field)(value, this.values)
    this.setValue(field)(value)
    this.setError(field)(error)

    this.updateField(field)({ dirty: true });
  }
}

const form = ComposedForm =>
class ReactForm extends React.Component {
  static displayName = `form(${getDisplayName(ComposedForm)})`;

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
    this.form = new Form({ ...props.defaultValues, ...props.values })
  }

  shouldComponentUpdate(nextProps, nextState) {
    // if (this.state === nextState && this.props === nextProps) return false
    // const diff = (a, b) => Object.keys(a).reduce((result, key) => isEqual(a[key], b[key]) ? result : result.concat(key), [])
    // console.groupCollapsed('FORM')
    // console.log("stateDiff", diff(this.state, nextState))
    // console.log("propsDiff", diff(this.props, nextProps))
    // console.log("state", this.state, nextState)
    // console.log("props", this.props, nextProps)
    // console.groupEnd()
    

    if (this.state !== nextState || this.props !== nextProps) return true
    return false
  }

  componentWillReceiveProps(next) {
    if (next.values !== this.props.values) {
      this.form.initialize({ ...next.defaultValues, ...next.values })
    }
  }

  render() {
    return <ComposedForm {...this.props}
      onSubmit={this.form.submitForm}
      setValue={this.form.changeField}
      getValues={this.form.getValues}
      getErrors={this.form.getErrors}
      hasErrors={this.form.hasErrors}
      resetForm={this.form.resetForm}
    />
  }
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default form;

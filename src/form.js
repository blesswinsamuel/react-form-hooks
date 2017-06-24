import React from 'react';
import PropTypes from 'prop-types';

import { get, isEqual, set } from 'lodash';

const DEFAULT_VALUE = null

class Form {
  registerField = (field, { validate = () => undefined }) => (fn) => {
    if (this.subscriptions[field]) this.subscriptions[field].push(fn)
    else this.subscriptions[field] = [fn]

    this.fields[field] = { validate }
    this.setError(field)(this.validate(field)(this.getValue(field), this.values))

    this.updateField(field)({ dirty: false, touched: false })
    return () => this.subscriptions[field].pop()
  }
}

const form = ComposedForm =>
class Form extends React.Component {
  static displayName = `form(${getDisplayName(ComposedForm)})`;

  static propTypes = {
    onSubmit: PropTypes.func,
    defaultValues: PropTypes.object,
    values: PropTypes.object,
  }

  static childContextTypes = {
    form: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)
    this.values = { ...props.defaultValues, ...props.values }
    this.errors = {}
    this.fields = {}
    this.subscriptions = {}
    this.form = {
      registerField: this.registerField,
      handleChange: this.handleChange,
      handleBlur: this.handleBlur,
      getValue: this.getValue,
      getError: this.getError,
      getValues: this.getValues,
    }
    this.state = {
      anyDirty: false,
      anyTouched: false,
    }
  }

  getChildContext = () => ({
    form: this.form
  })

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
      this.initializeForm(next)
    }
  }

  registerField = (field, { validate = () => undefined }) => (fn) => {
    if (this.subscriptions[field]) this.subscriptions[field].push(fn)
    else this.subscriptions[field] = [fn]

    this.fields[field] = { validate }
    this.setError(field)(this.validate(field)(this.getValue(field), this.values))

    this.updateField(field)({ dirty: false, touched: false })
    return () => this.subscriptions[field].pop()
  }

  initializeForm = (props) => {
    this.updateForm({ anyDirty: false, anyTouched: false })
    this.values = { ...props.defaultValues, ...props.values }
    this.errors = Object.keys(this.fields).reduce(
      (acc, field) => ({ ...acc, [field]: this.validate(field)(this.getValue(field), this.values) })
    , {})

    Object.keys(this.subscriptions).forEach(field =>
      this.updateField(field)({ dirty: false, touched: false })
    )
  }

  updateForm = (state) => {
    this.setState(state)
  }

  updateField = (field) => (state) => {
    if (this.subscriptions[field])
      this.subscriptions[field].forEach(fn => fn({
        value: this.getValue(field),
        error: this.getError(field),
        ...state
      }))
  }

  getValues = () => this.values

  getValue = (field) => get(this.values, field, DEFAULT_VALUE)
  setValue = (field) => value => set(this.values, field, value)

  getError = (field) => this.errors[field]
  setError = (field) => error => this.errors = ({ ...this.errors, [field]: error })
  hasErrors = () => Object.values(this.errors).filter(x => typeof x !== 'undefined').length !== 0

  validate = (field) => (this.fields[field] ? this.fields[field].validate : () => undefined)

  handleChange = (field) => (onChange = val => val) => (event) => {
    this.changeField(field, onChange(event, this.values))
  }

  handleBlur = (field) => (onBlur = val => val) => (event) => {
    // const value = onBlur(event, this.values)
    // const error = this.validate(field)(value, this.values)

    this.updateForm({ anyTouched: true })
    this.updateField(field)({ touched: true })
  }

  resetForm = () => {
    if (this.props.resetForm) this.props.resetForm()
    this.initializeForm(this.props)
  }

  touchAll = () => {
    this.updateForm({ anyTouched: true })
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

    this.updateForm({ anyDirty: true })
    this.updateField(field)({ dirty: true });
  }

  render() {
    return <ComposedForm {...this.props}
      onSubmit={this.submitForm}
      setValue={this.changeField}
      getValues={this.getValues}
      getErrors={this.getErrors}
      hasErrors={this.hasErrors}
      resetForm={this.resetForm}
    />
  }
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default form;

import React from 'react';
import PropTypes from 'prop-types';

import { isEqual } from 'lodash';

export const formField = ComposedField =>
class FormField extends React.Component {
  static displayName = `formField(${getDisplayName(ComposedField)})`;

  constructor(props, context) {
    super(props, context);
    this.form = this.context.form
    this.state = {
      value: this.form.getValue(this.props.name),
      touched: false,
      dirty: false,
      error: this.form.getError(this.props.name)
    }
  }

  static contextTypes = {
    form: PropTypes.object
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
  }

  shouldComponentUpdate(nextProps, nextState) {
    // if (this.state === nextState && this.props === nextProps) return false
    // const diff = (a, b) => Object.keys(a).reduce((result, key) => isEqual(a[key], b[key]) ? result : result.concat(key), [])
    // console.groupCollapsed('FIELD', nextProps.name)
    // console.log("stateDiff", diff(this.state, nextState))
    // console.log("propsDiff", diff(this.props, nextProps))
    // console.log(this.form.getValues())
    // console.log("state", this.state, nextState)
    // console.log("props", this.props, nextProps)
    // console.groupEnd()

    if (this.state !== nextState || this.props !== nextProps) return true
    return false
  }

  componentDidMount() {
    const { name, ...otherProps } = this.props
    this.unregisterField = this.form.registerField(name, otherProps)((state) => this.setState(state))
  }

  componentWillUnmount() {
    this.unregisterField()
  }

  handleChange = (onChange) => this.form.handleChange(this.props.name)(onChange)

  handleBlur = (onBlur) => this.form.handleBlur(this.props.name)(onBlur)

  render() {
    // eslint-disable-next-line
    const { name: field, validate, onChange, onBlur, ...rest } = this.props
    const { value, touched, dirty, error } = this.state

    return (
      <ComposedField
        onChange={this.handleChange(onChange)}
        onBlur={this.handleBlur(onBlur)}
        value={value}
        name={field}
        meta={{ error, dirty, touched }}
        {...rest}
      />
    )
  }
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default formField;

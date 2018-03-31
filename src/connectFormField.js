import React from 'react'
import PropTypes from 'prop-types'
import { wrapDisplayName } from 'recompose'

export const connectFormField = ComposedField =>
  class FormField extends React.PureComponent {
    static displayName = wrapDisplayName(ComposedField, 'connectFormField');

    constructor (props, context) {
      super(props, context)
      const { name } = this.props
      this.form = this.context.form
      this.fieldApi = this.form.getFieldApi(name)
      this.state = {
        value: this.fieldApi.getValue(),
        touched: false,
        dirty: false,
        error: this.fieldApi.getError()
      }
    }

    static contextTypes = {
      form: PropTypes.object
    }

    static propTypes = {
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
    }

    static defaultProps = {
      onChange: v => v,
    }

    componentDidMount () {
      const { name, validate = () => undefined } = this.props
      this.unregisterField = this.form.registerField(name)({
        setFieldState: this.setState.bind(this),
        getFieldState: () => this.state,
        validate
      })
    }

    componentWillUnmount () {
      this.unregisterField()
    }

    handleChange = (event) => {
      this.fieldApi.setValue(this.props.onChange(event, this.form.getValues()))
    }

    handleBlur = (event) => {
      this.fieldApi.setTouched()
    }

    render () {
      const { value, touched, dirty, error } = this.state

      return (
        <ComposedField
          fieldState={{ error, dirty, touched }}
          fieldApi={this.fieldApi}
          {...this.props}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={value}
        />
      )
    }
  }

export default connectFormField

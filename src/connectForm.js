import React from 'react'
import PropTypes from 'prop-types'
import { wrapDisplayName } from 'recompose'
import { pick } from 'lodash'

import Form from './FormContext'

const connectForm = ({ connectedStates = [], onSubmit } = {}) => ComposedForm =>
  class ReactForm extends React.Component {
    static displayName = wrapDisplayName(ComposedForm, 'connectForm')

    static propTypes = {
      onSubmit: PropTypes.func.isRequired,
      defaultValues: PropTypes.object,
      values: PropTypes.object
    }

    static defaultProps = {
      onSubmit
    }

    static childContextTypes = {
      form: PropTypes.object
    }

    getChildContext = () => ({
      form: this.form
    })

    constructor (props, context) {
      super(props, context)
      this.form = new Form({
        initialValues: { ...props.defaultValues, ...props.values },
        onSubmit: props.onSubmit,
        onSubmitSuccess: props.onSubmitSuccess,
        onSubmitFailure: props.onSubmitFailure,
        setFormState: (...args) => !this.unmounted && this.setState(...args),
        getFormState: () => this.state
      })
      this.state = {
        submitting: false,

        values: {},
        errors: {},

        anyTouched: false,
        anyDirty: false
      }
    }

    shouldComponentUpdate (nextProps, nextState) {
      const equalState = connectedStates
        .map(stateName => this.state[stateName] === nextState[stateName])
        .every(x => x === true)

      if (!equalState || this.props !== nextProps) return true
      return false
    }

    componentDidMount () {
      this.form.setValues(this.form.initialValues)
    }

    componentWillReceiveProps (next) {
      if (next.values !== this.props.values) {
        this.form.setValues({ ...next.defaultValues, ...next.values })
      }
    }

    componentWillUnmount () {
      this.unmounted = true
    }

    render () {
      const formState = pick(this.state, connectedStates)

      return <ComposedForm {...this.props}
                           formApi={this.form.formApi}
                           formState={formState}
      />
    }
  }

export default connectForm

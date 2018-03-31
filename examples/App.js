import React from 'react';
import moment from 'moment'
import classNames from 'classnames'

// import Select from 'react-select';
import { connectForm, connectFormField } from 'react-form';
import { get, isEqual, set } from 'lodash'

export const FormContext = React.createContext();

class FormProvider extends React.Component {
  static defaultProps = {
    validate: () => null
  }

  constructor(props) {
    super(props)
    this.state = {
      submitting: false,

      values: { ...props.defaultValues, ...props.values },
      meta: {},
    }
  }

  getValue = field => get(this.state.values, field)

  setValue = (field, value) => {
    this.setState(state => {
      const values = Object.assign({}, state.values)
      set(values, field, value)
      console.log(values)

      const meta = Object.assign({}, state.meta)
      const error = this.props.validate(values)
      meta[field] = {
        ...meta[field],
        error: error,
        dirty: true,
      }

      return { values, meta }
    })
  }

  setTouched = field => {
    const meta = Object.assign({}, this.state.meta)
    meta[field] = {
      ...meta[field],
      touched: true,
    }

    this.setState({ meta })
  }

  setError = (field, error) => {
    const meta = Object.assign({}, this.state.meta)
    meta[field] = {
      ...meta[field],
      error: error,
    }

    this.setState({ meta })
  }

  hasErrors = () => Object.values(this.state.meta).some(v => v.errors)

  touchAll = () => {
    const meta = Object.keys(this.state.meta).reduce(key => this.state.meta[key] = {
      ...meta[field],
      touched: true
    })
    this.setState({ meta })
  }

  submitForm = async (event) => {
    if (event) event.preventDefault()
    this.touchAll()

    if (!this.hasErrors()) {
      return await Promise.resolve(this.submitFormAsync())
    }
    this.setState({ submitError: 'Please check for errors.' })
  }

  submitFormAsync = async () => {
    this.setFormState({ submitting: true, submitError: null, submitResponse: null })
    try {
      const response = await this.props.onSubmit(this.state.values)
      this.setState({ submitting: false, submitError: null })
      return this.props.onSubmitSuccess(response)
    } catch (error) {
      const errorMessage = (error.data && error.data.message) || error.statusText
      this.setFormState({ submitting: false, submitResponse: null, submitError: errorMessage })
      return this.props.onSubmitFailure(error)
    }
  }


  render() {
    return (
      <FormContext.Provider value={{
        ...this.state,
        getValue: this.getValue,
        setValue: this.setValue,
        setError: this.setError,
        setTouched: this.setTouched,
        submitForm: this.submitForm,
      }}>
        {this.props.children}
      </FormContext.Provider>
    )
  }
}

export function withForm (Component) {
  return function FormComponent (props) {
    return (
      <FormContext.Consumer>
        {context => <Component {...props} {...context} />}
      </FormContext.Consumer>
    )
  }
}

class FormField extends React.Component {
  render() {
    return (
      <FormContext.Consumer>
        {this.renderControl}
      </FormContext.Consumer>
    )
  }

  handleChange = (context) => value => {
    const {name, validate = v => null, onChange = v => v} = this.props
    const error = validate(value)
    if (error) context.setError(name, error)
    return context.setValue(name, onChange(value, context))
  }

  renderControl = (context) => {
    const {name, label, component, validate, ...props} = this.props
    return (
      <DecoratedControl
        name={name}
        label={label}
        component={component}
        value={context.getValue(name)}
        meta={context.meta[name]}
        {...props}
        onChange={this.handleChange(context)}
        onBlur={() => context.setTouched(name)}
      />
    )
  }
}

const DecoratedControl = ({ meta: { error, touched, dirty } = {}, label, name, component: Control, ...rest }) => (
  <div className={classNames('form-group', error && 'has-error')}>
    {label && <label className="form-label" htmlFor={name}>{label}</label>}
    <div style={{ position: 'relative' }}>
      <Control id={name} {...rest} />
      <div style={{ position: 'absolute', top: 0, right: 0, padding: 6, opacity: 0.3, pointerEvents: 'none' }}>
        {touched && <span className="label label-primary">Touched</span>}
        {dirty && <span className="label label-warning" style={{ marginLeft: 3 }}>Dirty</span>}
      </div>
    </div>
    {error && <div className="form-input-hint">{error}</div>}
  </div>
)

class App extends React.Component {
  state = {
    values: {}
  }

  defaultValues = {
    'myfield': '123', 'email': 'asdf@dsa.com', date1: '2020-05-02T18:30:00.000Z'
  }

  changeValues = () => this.setState({ values: this.defaultValues })

  onSubmit = values => console.log("> onSubmit -> ", values)

  render() {
    return (
      <div className="container">
        <FormProvider
          defaultValues={this.defaultValues}
          values={this.state.values}
          onSubmit={this.onSubmit}
        >
          <ConnectedMyForm />
        </FormProvider>
        <Button onClick={this.changeValues}>Reset to default values</Button>
      </div>
    );
  }
}

const Code = (props) => <pre className="code" data-lang="JSON"><code>{props.children}</code></pre>

const Button = (props) => <button className="btn btn-primary" style={{ margin: 3 }} {...props} />

const Input = ({ onChange, value, ...otherProps }) => (
  <input
    className="form-input"
    onChange={e => onChange(e.target.value)}
    value={value || ''}
    {...otherProps}
  />
)

const DatePicker = ({ onChange, value, ...otherProps }) => (
  <Input
    type="date"
    value={value && moment(value).format('YYYY-MM-DD')}
    onChange={(value) => {
      if (!value) return onChange(null);
      return onChange(moment(value).toISOString());
    }}
    {...otherProps}
  />
)

const TimePicker = (props) => <Input type="time" {...props} />

const DateTimePicker = (props) => <Input type="datetime-local" {...props} />

// var options = [
//  { value: 'one', label: 'One' },
//  { value: 'two', label: 'Two' }
// ];

// const Dropdown = ({ onChange, value, ...otherProps }) => (
//  <Select
//    name="form-field-name"
//    value="one"
//    options={options}
//    onChange={(val) => {
//      console.log(val)
//      onChange(val)
//    }}
//    {...otherProps}
//  />
// )
/*-- END HELPERS --*/

const MyForm = ({ values, submitForm, setValue, resetForm, anyDirty, anyTouched }) => (
  <form onSubmit={submitForm}>
    <FormField
      name="myfield" label="My field"
      validate={(value, allValues) => {
        console.log(" validation -> ", value, allValues)
        return (/\d/.test(value)) ? 'should not contain a number' : undefined
      }}
      onChange={(value, allValues) => {
        console.log(" onChange -> ", value, allValues)
        return value.toUpperCase()
      }}
      component={Input}
    />
    <FormField
      name="email" label="Email"
      validate={(value, allValues) => {
        console.log(" validation -> ", value, allValues)
        return (/\d/.test(value)) ? 'should not contain a number' : undefined
      }}
      component={Input}
    />
    <FormField name="date1" label="Date1" component={DatePicker} />
    <FormField name="date2" label="Date2" component={DatePicker} />
    <FormField name="time" label="Time" component={TimePicker} />
    <FormField name="conn1" label="Conn1" component={Input} onChange={(v, ctx) => { ctx.setValue('conn2', v); return v }} />
    <FormField name="conn2" label="Conn2" component={Input} />
    <FormField name="same" label="Same1" component={Input} />
    <FormField name="same" label="Same2" component={Input} />

    <FormField name="datetime" component={DateTimePicker} />
    
    {console.log(`FORM RERENDER`)}
    <Code>{JSON.stringify(values, null, 2)}</Code>

    {anyDirty && <div>Form Dirty</div>}
    {anyTouched && <div>Form Touched</div>}
    <Button type="submit">Submit</Button>
    <Button onClick={resetForm}>Reset</Button>
  </form>
)

const ConnectedMyForm = withForm(MyForm)

export default App;

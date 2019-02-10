import React from 'react';
import classNames from 'classnames'

// import Select from 'react-select';
import * as form from '@blesswinsamuel/react-form';
console.log(form)
const Form = null
const Field = null
const moment = null

export function withForm (Component) {
  return function FormComponent (props) {
    return (
      <Form render={renderProps => <Component {...renderProps} {...props} />} />
    )
  }
}

class FormField extends React.Component {
  render() {
    return (
      <Field validate={this.props.validate} field={this.props.name}>
        {this.renderControl}
      </Field>
    )
  }

  handleChange = (context) => e => {
    const {onChange = v => v} = this.props
    context.setValue(onChange(e))
  }

  handleBlur = (context) => e => {
    context.setTouched()
    if (this.props.onBlur) {
      this.props.onBlur(e)
    }
  }

  renderControl = (context) => {
    const {name, label, component, validate, ...props} = this.props
    const { value, error, warning, success, touched, dirty } = context
    console.log(error)
    return (
      <DecoratedControl
        name={name}
        label={label}
        component={component}
        {...props}
        value={value}
        state={{error, warning, success, touched, dirty}}
        onChange={this.handleChange(context)}
        onBlur={this.handleBlur(context)}
      />
    )
  }
}

const DecoratedControl = ({ state: { error, touched, dirty } = {}, label, name, component: Control, ...rest }) => (
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
        {/* <ConnectedMyForm defaultValues={this.defaultValues}
          values={this.state.values}
          onSubmit={this.onSubmit}/> */}
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
      validate={(value) => {
        console.log(" validation -> ", value)
        return { error: (/\d/.test(value)) && 'should not contain a number' }
      }}
      onChange={(value) => {
        console.log(" onChange -> ", value)
        return value.toUpperCase()
      }}
      component={Input}
    />
    <FormField
      name="email" label="Email"
      validate={(value) => {
        console.log(" validation -> ", value)
        return { error: (/\d/.test(value)) && 'should not contain a number' }
      }}
      component={Input}
    />
    <FormField name="date1" label="Date1" component={DatePicker} />
    <FormField name="date2" label="Date2" component={DatePicker} />
    <FormField name="time" label="Time" component={TimePicker} />
    <FormField name="conn1" label="Conn1" component={Input} onChange={(v) => { setValue('conn2', v); return v }} />
    <FormField name="conn2" label="Conn2" component={Input} validate={(value) => {
      console.log(" validation -> ", value)
      return { error: (/\d/.test(value)) && 'should not contain a number' }
    }}/>
    <FormField name="same" label="Same1" component={Input} validate={(value) => {
      console.log(" validation -> ", value)
      return { error: (/\d/.test(value)) && 'should not contain a number' }
    }}/>
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

// const ConnectedMyForm = withForm(MyForm)

export default App;

import React from 'react'

const moment = null

export const Code = props => (
  <pre className="code" data-lang="JSON">
    <code>{props.children}</code>
  </pre>
)

export const Button = props => (
  <button className="btn btn-primary" style={{ margin: 3 }} {...props} />
)

export const Input = ({ onChange, value, ...otherProps }) => (
  <input
    className="form-input"
    onChange={e => onChange(e.target.value)}
    value={value || ''}
    {...otherProps}
  />
)

export const DatePicker = ({ onChange, value, ...otherProps }) => (
  <Input
    type="date"
    value={value && moment(value).format('YYYY-MM-DD')}
    onChange={value => {
      if (!value) return onChange(null)
      return onChange(moment(value).toISOString())
    }}
    {...otherProps}
  />
)

export const TimePicker = props => <Input type="time" {...props} />

export const DateTimePicker = props => (
  <Input type="datetime-local" {...props} />
)

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

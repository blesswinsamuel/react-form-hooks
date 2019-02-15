import React from 'react'
import { handleStringChange } from './lib/formHandlers'

export const Code = props => (
  <pre className="code" data-lang="JSON">
    <code>{props.children}</code>
  </pre>
)

export const Button = props => (
  <button type="button" className="btn btn-primary" style={{ margin: 3 }} {...props} />
)

export const Input = ({ onChange, value, ...otherProps }) => (
  <input
    className="form-input"
    onChange={handleStringChange(onChange)}
    value={value}
    {...otherProps}
  />
)

function formatDate(date) {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

export const DatePicker = ({ value, onChange, ...otherProps }) => (
  <Input
    type="date"
    value={value ? formatDate(value, 'YYYY-MM-DD') : ''}
    onChange={value => {
      if (!value) return onChange(null) // for clear button
      return onChange(new Date(value).toISOString()) // set in utc as timezone is stripped in the server
    }}
    {...otherProps}
  />
)

// function formatTime(time) {
//   return time + ':00'
// }

export const TimePicker = props => <Input type="time" {...props} />

function formatDateTime(date) {
  return date.replace('Z', '')
}

export const DateTimePicker = ({ value, onChange, ...otherProps }) => (
  <Input
    type="datetime-local"
    value={value ? formatDateTime(value) : ''}
    onChange={value => {
      if (!value) return onChange(null) // for clear button
      return onChange(new Date(value).toISOString()) // set in utc as timezone is stripped in the server
    }}
    {...otherProps}
  />
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

export const ArrayInput = ({ onChange, id, value, renderField }) => {
  const addItem = () => onChange([...value, null])
  const deleteItem = index => () => {
    console.log("asdasdas")
    console.log(value.filter((val, i) => index !== i))
    return onChange(value.filter((val, i) => index !== i))
  }
  return (
    <>
      {((value && Array.isArray(value) && value) || []).map((v, i) => {
        return (
          <div key={i} style={{ position: 'relative', paddingBottom: '12px' }}>
            <div>{renderField(`${id}[${i}]`, i)}</div>
            <Button
              style={{ position: 'absolute', top: 0, right: 0 }}
              onClick={deleteItem(i)}
            >Delete</Button>
          </div>
        )
      })}
      <Button type="dashed" onClick={addItem} style={{ width: '100%' }}>
        Add
      </Button>
    </>
  )
}

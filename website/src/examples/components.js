import React, { useLayoutEffect, useRef } from 'react'

export function handleStringChange(handler) {
  return event => handler(event.target.value)
}

export const Code = props => (
  <pre className="code" data-lang="JSON">
    <code>{props.children}</code>
  </pre>
)

export const Button = props => (
  <button
    type="button"
    className="btn btn-primary"
    style={{ margin: 3 }}
    {...props}
  />
)

export const Input = ({ onChange, value, ...otherProps }) => {
  const cursorStart = useRef(null)
  const cursorEnd = useRef(null)
  const inputRef = useRef(null)
  useLayoutEffect(() => {
    if (cursorStart.current && cursorEnd.current) {
      inputRef.current.setSelectionRange(cursorStart.current, cursorEnd.current)
    }
  }, [value])

  return (
    <input
      ref={inputRef}
      className="form-input"
      onChange={e => {
        cursorStart.current = e.target.selectionStart
        cursorEnd.current = e.target.selectionEnd
        return handleStringChange(onChange)(e)
      }}
      value={value}
      {...otherProps}
    />
  )
}

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

export const FormFooter = ({
  anyTouched,
  anyDirty,
  anyError,
  values,
  resetToInitial,
  resetToNew,
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <Code>{JSON.stringify(values, null, 2)}</Code>

      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          padding: 6,
          pointerEvents: 'none',
        }}
      >
        {anyTouched && (
          <span className="label label-primary">Form Touched</span>
        )}
        {anyDirty && (
          <span className="label label-warning" style={{ marginLeft: 3 }}>
            Form Dirty
          </span>
        )}
        {anyError && (
          <span className="label label-error" style={{ marginLeft: 6 }}>
            Form Invalid
          </span>
        )}
      </div>
      <Button disabled={anyError || !anyDirty} type="submit">
        Submit
      </Button>
      {resetToInitial && (
        <Button onClick={resetToInitial}>Reset to initial values</Button>
      )}
      {resetToNew && (
        <Button onClick={resetToNew}>Reset to new initial values</Button>
      )}
    </div>
  )
}

import React from 'react'
import classNames from 'classnames'
import { useFormField } from './lib'

function getErrorString(error) {
  if (!error) {
    return null
  }
  if (typeof error === 'string') {
    return error
  }
  if (
    error.request &&
    error.request.data &&
    typeof error.request.data === 'string'
  ) {
    return error.request.data
  }
  if (error.response && error.response.data) {
    const rd = error.response.data
    if (typeof rd === 'string') {
      return rd
    } else if (rd.message && typeof rd.message === 'string') {
      return rd.message
    }
  }
  if (error.message) {
    return error.message
  }
  if (error.errors) {
    return error.errors.map(e => e.message).join('. ')
  }
}

const Field = ({
  form,
  id,
  component: InputComponent,
  validate,
  InputProps,
  label,
  InputLabelProps,
  render = v => v,
}) => {
  const { input, meta } = form
    ? useFormField(form, id, { validate })
    : { input: { id }, meta: {} }
  const { touched, dirty, error } = meta

  console.log("FIELD_STATE_UPDATE", id, { value: input.value, ...meta })

  const showError = touched && error

  return (
    <div className={classNames('form-group', showError && 'has-error')}>
      {label && (
        <div className="col-3 col-sm-12">
          <label className="form-label" htmlFor={id} {...InputLabelProps}>
            {label}
          </label>
        </div>
      )}
      <div className="col-9 col-sm-12" style={{ position: 'relative' }}>
        {render(<InputComponent {...input} {...InputProps} />)}
        {showError && <div className="form-input-hint">{getErrorString(error)}</div>}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: 6,
            opacity: 0.3,
            pointerEvents: 'none',
          }}
        >
          {touched && <span className="label label-primary">Touched</span>}
          {dirty && (
            <span className="label label-warning" style={{ marginLeft: 3 }}>
              Dirty
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Field

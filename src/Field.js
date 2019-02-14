import React from 'react'
import classNames from 'classnames'
import { useFieldState } from './lib'

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
                 onChange = v => v,
                 label,
                 InputLabelProps,
                 render = v => v,
               }) => {
  const fieldState = form ? useFieldState(form, id, { validate }) : {}
  const { changeFieldValue, touchField } = form.fieldActions
  const { value, touched, dirty, error } = fieldState

  console.log('FIELD_STATE_UPDATE', id, fieldState)

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
        {render(
          <InputComponent
            id={id}
            value={value}
            onChange={value => changeFieldValue(id)(onChange(value))}
            onBlur={touchField(id)}
            {...InputProps}
          />,
        )}
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

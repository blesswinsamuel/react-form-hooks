import React, {useRef, useMemo, useCallback} from 'react'
import classNames from 'classnames'
import { useFieldState } from 'react-form-hooks'
import { Button } from './components'

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
}

const Field = ({
                 id,
                 label,
                 InputLabelProps,
                 error,
                 touched,
                 dirty,
                 children,
               }) => {
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
        {children}
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

const FormField = ({
                     form,
                     id,
                     component: InputComponent,
                     validate,
                     InputProps,
                     onChange = v => v,
                     subscribeTo,
                     label,
                     InputLabelProps,
                   }) => {
  const fieldState = useFieldState(form, id, subscribeTo, { validate })
  const { changeFieldValue, touchField } = form.fieldActions
  const { value, touched, dirty, error } = fieldState

  // console.log('FIELD_STATE_UPDATE', id, fieldState)

  return (
    <Field
      id={id}
      label={label}
      InputLabelProps={InputLabelProps}
      error={getErrorString(error)}
      touched={touched}
      dirty={dirty}
    >
      <InputComponent
        id={id}
        value={value}
        onChange={value => changeFieldValue(id, onChange(value))}
        onBlur={() => touchField(id)}
        {...InputProps}
      />
    </Field>
  )
}

export const ArrayInput = ({ form, onChange, onBlur, id, value, renderField }) => {
  const { getFieldState } = form.fieldActions
  const fieldRefs = useRef()
  const addItem = useCallback(() => {
    fieldRefs.current = [...fieldRefs.current, Math.max(...fieldRefs.current, 0) + 1]
    return onChange([...(getFieldState(id).value || []), null])
  }, [])
  const deleteItem = index => () => {
    fieldRefs.current = fieldRefs.current.filter((_, i) => index !== i)
    return onChange((getFieldState(id).value || []).filter((_, i) => index !== i))
  }
  const getFieldRef = (i) => {
    if (!fieldRefs.current) {
      fieldRefs.current = value.map((_, i) => i + 1)
    }

    return fieldRefs.current[i]
  }
  return (
    <>
      {value.map((_, i) => {
        return (
          <div key={getFieldRef(i)} style={{ position: 'relative', paddingBottom: '12px' }}>
            <div>{renderField(`${id}[${i}]`, i)}</div>
            <Button
              style={{ position: 'absolute', top: 0, right: 0 }}
              onClick={deleteItem(i)}
            >Delete</Button>
          </div>
        )
      })}
      <Button onClick={addItem} style={{ width: '100%' }}>
        Add
      </Button>
    </>
  )
}

const ArrayFormField = ({ InputProps, ...props }) => {
  return (
    <FormField
      subscribeTo={state => [state.value && state.value.length, state.touched, state.error, state.dirty]}
      component={ArrayInput}
      InputProps={{
        form: props.form,
        ...InputProps,
      }}
      {...props}
    />
  )
}

export default Field
export { FormField, ArrayFormField }

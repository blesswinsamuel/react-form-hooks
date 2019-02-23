import React from 'react'

import { useForm, useFormState, useFieldState } from 'react-form-hooks'

function MyForm() {
  const form = useForm({ initialValues: {} })
  const onSubmit = values => console.log(values)
  return (
    <form onSubmit={form.formActions.submitHandler(onSubmit)}>
      <FormField
        form={form}
        id="firstname"
        label="First name"
        component={Input}
        validate={value => /\d/.test(value) && 'should not contain a number'}
        onChange={value => value.toUpperCase()}
      />
      <FormField
        form={form}
        id="lastname"
        label="Last name"
        component={Input}
        validate={value => /\d/.test(value) && 'should not contain a number'}
        onChange={value => value.toLowerCase()}
      />

      <FormStateAndButton form={form} />
    </form>
  )
}

const FormStateAndButton = ({ form }) => {
  const { anyError, anyDirty, anyTouched, values } = useFormState(form)

  return (
    <>
      <pre>{JSON.stringify(values, null, 2)}</pre>

      {anyError && <div>Form Error</div>}
      {anyDirty && <div>Form Dirty</div>}
      {anyTouched && <div>Form Touched</div>}
      <button type="submit">Submit</button>
      <button onClick={() => form.formActions.resetFormValues()}>Reset</button>
    </>
  )
}

const FormField = ({
  form,
  id,
  component: InputComponent,
  validate,
  InputProps,
  onChange = v => v,
  mapState,
  label,
  InputLabelProps,
}) => {
  const fieldState = useFieldState(form, id, mapState, { validate })
  const { changeFieldValue, touchField } = form.fieldActions
  const { value, touched, dirty, error } = fieldState

  return (
    <div>
      {label && (
        <label htmlFor={id} {...InputLabelProps}>
          {label}
        </label>
      )}
      <InputComponent
        id={id}
        value={value}
        onChange={value => changeFieldValue(id, onChange(value))}
        onBlur={() => touchField(id)}
        {...InputProps}
      />
      {touched && error && <div className="form-input-hint">{error}</div>}
      {dirty && <div>Field Modified</div>}
    </div>
  )
}

const Input = ({ onChange, value, ...otherProps }) => (
  <input
    onChange={handleStringChange(onChange)}
    value={value}
    {...otherProps}
  />
)

function handleStringChange(handler) {
  return event => handler(event.target.value)
}

export default MyForm

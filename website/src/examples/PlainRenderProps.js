import React from 'react'

import { useForm, FormState, FieldState } from 'react-form-hooks'

function MyForm() {
  const form = useForm({ initialValues: {} })
  const onSubmit = values => console.log(values)
  return (
    <form onSubmit={form.formActions.submitHandler(onSubmit)}>
      <FieldState
        form={form}
        id="firstname"
        options={{
          validate: value => /\d/.test(value) && 'should not contain a number',
        }}
        render={({ value, touched, error, dirty }) => {
          return (
            <div>
              <label htmlFor="firstname">First name</label>
              <input
                id={'firstname'}
                value={value}
                onChange={e =>
                  form.fieldActions.changeFieldValue(
                    'firstname',
                    e.target.value
                  )
                }
                onBlur={() => form.fieldActions.touchField('firstname')}
              />
              {touched && error && (
                <div className="form-input-hint">{error}</div>
              )}
              {dirty && <div>Field Modified</div>}
            </div>
          )
        }}
      />
      <FieldState
        form={form}
        id="lastname"
        options={{
          validate: value => /\d/.test(value) && 'should not contain a number',
        }}
        render={({ value, touched, error, dirty }) => {
          return (
            <div>
              <label htmlFor="lastname">Last name</label>
              <input
                id={'lastname'}
                value={value}
                onChange={e =>
                  form.fieldActions.changeFieldValue('lastname', e.target.value)
                }
                onBlur={() => form.fieldActions.touchField('lastname')}
              />
              {touched && error && (
                <div className="form-input-hint">{error}</div>
              )}
              {dirty && <div>Field Modified</div>}
            </div>
          )
        }}
      />

      <FormState
        form={form}
        render={({ anyError, anyDirty, anyTouched, values }) => {
          return (
            <>
              <pre>{JSON.stringify(values, null, 2)}</pre>

              {anyError && <div>Form Error</div>}
              {anyDirty && <div>Form Dirty</div>}
              {anyTouched && <div>Form Touched</div>}
              <button type="submit">Submit</button>
              <button onClick={() => form.formActions.resetFormValues()}>
                Reset
              </button>
            </>
          )
        }}
      />
    </form>
  )
}

export default MyForm

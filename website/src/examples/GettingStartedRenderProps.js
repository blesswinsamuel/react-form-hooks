import React from 'react'

import { useForm, FormState, FieldState } from 'react-form-hooks'

/**
 This is an example where everything is defined in a single component.
 This may be fine for getting started. But it can become cumbersome to manage
 especially when working with large number of inputs.

 Check the BasicRenderProps example for a sample pattern to reuse code.
 */
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
        render={({ value, touched, error, dirty }) => (
          <div>
            <label htmlFor="firstname">First name</label>
            <input
              id={'firstname'}
              value={value}
              onChange={e =>
                form.fieldActions.changeFieldValue('firstname', e.target.value)
              }
              onBlur={() => form.fieldActions.touchField('firstname')}
            />
            {touched && error && <div className="form-input-hint">{error}</div>}
            {dirty && <div>Field Modified</div>}
          </div>
        )}
      />
      <FieldState
        form={form}
        id="lastname"
        options={{
          validate: value => /\d/.test(value) && 'should not contain a number',
        }}
        render={({ value, touched, error, dirty }) => (
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
            {touched && error && <div className="form-input-hint">{error}</div>}
            {dirty && <div>Field Modified</div>}
          </div>
        )}
      />

      <FormState
        form={form}
        render={({ anyError, anyDirty, anyTouched, values }) => (
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
        )}
      />
    </form>
  )
}

export default MyForm

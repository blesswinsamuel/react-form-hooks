import React, { useState } from 'react'
import { Button, Code, Input } from './components'
import { FormState, useForm } from 'react-form-hooks'
import { FormField } from './Field'

const RenderPropsForm = () => {
  const [values, setValues] = useState({
    name: 'John',
    email: 'john@example.com',
  })
  const form = useForm({ initialValues: values })
  const changeValues = () =>
    setValues({
      name: 'Doe',
      email: 'doe@example.com',
    })
  return (
    <div className="container">
      <form
        className="form-horizontal"
        onSubmit={form.formActions.submitHandler(values =>
          console.log('FORM SUBMIT', values)
        )}
      >
        <FormField
          form={form}
          id="name"
          label="Name"
          component={Input}
          validate={value => /\d/.test(value) && 'should not contain a number'}
          onChange={value => value.toUpperCase()}
        />
        <FormField
          form={form}
          id="email"
          label="Email"
          component={Input}
          validate={value =>
            !/^\S+@\S+\.\S+$/.test(value) && 'should be a valid email'
          }
        />

        <FormState
          form={form}
          render={state => {
            const { anyError, anyDirty, anyTouched, values } = state
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
                    <span
                      className="label label-warning"
                      style={{ marginLeft: 3 }}
                    >
                      Form Dirty
                    </span>
                  )}
                  {anyError && (
                    <span
                      className="label label-error"
                      style={{ marginLeft: 6 }}
                    >
                      Form Invalid
                    </span>
                  )}
                </div>
                <Button disabled={anyError || !anyDirty} type="submit">
                  Submit
                </Button>
                <Button onClick={() => form.formActions.resetFormValues()}>
                  Reset to initial values
                </Button>
                <Button onClick={changeValues}>Reset to new initial values</Button>
              </div>
            )
          }}
        />
      </form>
    </div>
  )
}

export default RenderPropsForm

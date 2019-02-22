import React from 'react'

import { useForm, useFormState } from 'react-form-hooks'
import { Button, Code, Input } from './components'
import { FormField } from './Field'

export default function BasicForm() {
  const form = useForm({ initialValues: {} })
  const onSubmit = values => console.log(values)
  return (
    <form
      className="form-horizontal"
      onSubmit={form.formActions.submitHandler(onSubmit)}
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

      <FormStateAndButton form={form} />
    </form>
  )
}

const FormStateAndButton = ({ form }) => {
  const { anyError, anyDirty, anyTouched, values } = useFormState(form)

  return (
    <>
      <Code>{JSON.stringify(values, null, 2)}</Code>

      {anyError && <div>Form Error</div>}
      {anyDirty && <div>Form Dirty</div>}
      {anyTouched && <div>Form Touched</div>}
      <Button type="submit">Submit</Button>
      <Button onClick={form.formActions.resetFormValues}>Reset</Button>
    </>
  )
}

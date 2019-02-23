import React from 'react'
import { useForm } from 'react-form-hooks'

import { Input } from '../recipes/Components'
import FormFooter from '../recipes/FormFooter'
import FormField from '../recipes/FormField'

export default function BasicHooks() {
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

      <FormFooter form={form} />
    </form>
  )
}

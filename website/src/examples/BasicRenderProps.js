import React, { useState } from 'react'
import { useForm } from 'react-form-hooks'

import { Input } from '../recipes/Components'
import { FormFieldRP } from '../recipes/FormField'
import { FormFooterRP } from '../recipes/FormFooter'

/**
 * Notice a different FormField and FormFooter component used here.
 */
export default function BasicRenderProps() {
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
    <form
      className="form-horizontal"
      onSubmit={form.formActions.submitHandler(values =>
        console.log('FORM SUBMIT', values)
      )}
    >
      <FormFieldRP
        form={form}
        id="name"
        label="Name"
        component={Input}
        validate={value => /\d/.test(value) && 'should not contain a number'}
        onChange={value => value.toUpperCase()}
      />
      <FormFieldRP
        form={form}
        id="email"
        label="Email"
        component={Input}
        validate={value =>
          !/^\S+@\S+\.\S+$/.test(value) && 'should be a valid email'
        }
      />

      <FormFooterRP form={form} resetToNewValues={changeValues} />
    </form>
  )
}

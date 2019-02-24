import React, { useState } from 'react'
import { useForm } from 'react-form-hooks'

import {
  DatePicker,
  DateTimePicker,
  Input,
  TimePicker,
} from '../recipes/Components'
import FormField from '../recipes/FormField'
import FormFooter from '../recipes/FormFooter'

export default function FieldTypesExample() {
  const [values, setValues] = useState({
    myfield: '123',
    email: 'form@email.me',
    date1: '2020-05-02T00:00:00.000Z',
  })
  const changeValues = () =>
    setValues({
      myfield: '1234',
      email: 'changed@email.me',
      date1: '2020-05-02T18:30:00.000Z',
    })

  const form = useForm({ initialValues: values })

  const onSubmit = values => alert(JSON.stringify(values, null, 2))
  return (
    <form
      className="form-horizontal"
      onSubmit={form.formActions.submitHandler(onSubmit)}
    >
      <FormField
        form={form}
        id="myfield"
        label="My field"
        component={Input}
        validate={value => /\d/.test(value) && 'should not contain a number'}
        onChange={value => value.toUpperCase()}
      />
      <FormField
        form={form}
        id="email"
        label="Email"
        component={Input}
        validate={value => /\d/.test(value) && 'should not contain a number'}
      />
      <FormField form={form} id="date1" label="Date1" component={DatePicker} />
      <FormField form={form} id="date2" label="Date2" component={DatePicker} />
      <FormField form={form} id="time" label="Time" component={TimePicker} />
      <FormField
        form={form}
        id="conn1"
        label="Conn1"
        component={Input}
        onChange={v => {
          form.fieldActions.changeFieldValue('conn2', v)
          return v
        }}
      />
      <FormField
        form={form}
        id="conn2"
        label="Conn2"
        component={Input}
        validate={value => /\d/.test(value) && 'should not contain a number'}
      />
      <FormField
        form={form}
        id="same"
        label="Same1"
        component={Input}
        validate={value => /\d/.test(value) && 'should not contain a number'}
      />
      <FormField form={form} id="same" label="Same2" component={Input} />

      <FormField form={form} id="datetime" component={DateTimePicker} />

      <FormFooter form={form} resetToNewValues={changeValues} />
    </form>
  )
}

import React, { useCallback, useState } from 'react'
import {
  DatePicker,
  DateTimePicker,
  FormFooter,
  Input,
  TimePicker,
} from './components'
import { useForm, useFormState } from 'react-form-hooks'
import { FormField } from './Field'

const FieldTypesExample = () => {
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
  const onSubmit = useCallback(
    values => console.log('> onSubmit -> ', values),
    []
  )

  const form = useForm({ initialValues: values })
  console.log('FORM_RERENDER')
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
        validate={value => {
          console.log(' validation -> ', value)
          return /\d/.test(value) && 'should not contain a number'
        }}
        onChange={value => {
          console.log(' onChange -> ', value)
          return value.toUpperCase()
        }}
      />
      <FormField
        form={form}
        id="email"
        label="Email"
        component={Input}
        validate={value => {
          console.log(' validation -> ', value)
          return /\d/.test(value) && 'should not contain a number'
        }}
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
          console.log(v)
          form.fieldActions.changeFieldValue('conn2', v)
          return v
        }}
      />
      <FormField
        form={form}
        id="conn2"
        label="Conn2"
        component={Input}
        validate={value => {
          console.log(' validation -> ', value)
          return /\d/.test(value) && 'should not contain a number'
        }}
      />
      <FormField
        form={form}
        id="same"
        label="Same1"
        component={Input}
        validate={value => {
          console.log(' validation -> ', value)
          return /\d/.test(value) && 'should not contain a number'
        }}
      />
      <FormField form={form} id="same" label="Same2" component={Input} />

      <FormField form={form} id="datetime" component={DateTimePicker} />

      <FormStateAndButton form={form} resetToNewValues={changeValues} />
    </form>
  )
}

const FormStateAndButton = ({ form, resetToNewValues }) => {
  const { anyError, anyDirty, anyTouched, values } = useFormState(form)

  console.log('FORM_STATE_UPDATE', { anyError, anyDirty, anyTouched, values })
  return (
    <FormFooter
      {...{ anyError, anyDirty, anyTouched, values }}
      resetToInitial={() => form.formActions.resetFormValues()}
      resetToNew={resetToNewValues}
    />
  )
}

export default FieldTypesExample

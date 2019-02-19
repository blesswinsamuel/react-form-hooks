import React, { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Code,
  DatePicker,
  DateTimePicker,
  Input,
  TimePicker,
} from './components'
import { useForm, useFormState } from 'react-form-hooks'
import { FormField } from './Field'

const SimpleForm = () => {
  const [values, setValues] = useState({
    myfield: '123',
    email: 'form@email.me',
    date1: '2020-05-02T18:30:00.000Z',
  })
  const changeValues = () => setValues({
    myfield: '1234',
    email: 'changed@email.me',
    date1: '2020-05-02T18:30:00.000Z',
  })
  const onSubmit = useCallback(
    values => console.log('> onSubmit -> ', values),
    []
  )
  return (
    <div className="container">
      <MyForm
        defaultValues={values}
        onSubmit={onSubmit}
      />
      <Button onClick={changeValues}>Reset to default values</Button>
    </div>
  )
}

const MyForm = ({ defaultValues, onSubmit }) => {
  const form = useForm({ initialValues: defaultValues })
  console.log('FORM_RERENDER')
  return useMemo(
    () => (
      <form
        className="form-horizontal"
        onSubmit={form.formActions.submitHandler(onSubmit)}
      >
        <FormFields form={form} />

        <FormStateAndButton form={form} />
      </form>
    ),
    [onSubmit]
  )
}

const FormStateAndButton = ({ form }) => {
  const { anyError, anyDirty, anyTouched, values } = useFormState(
    form,
    state => [state.anyError, state.anyDirty, state.anyTouched, state.values]
  )

  console.log('FORM_STATE_UPDATE', { anyError, anyDirty, anyTouched, values })
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

const FormFields = ({ form }) => {
  return (
    <>
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
    </>
  )
}

export default SimpleForm

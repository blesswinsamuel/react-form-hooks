import React, { useRef, useState } from 'react'
import { Button, DateTimePicker, Input, TimePicker } from './components'
import { createForm, useForm } from './lib'
import Field from './Field'

const App = () => {
  const [values, setValues] = useState({})
  const defaultValues = {
    myfield: '123',
    email: 'asdf@dsa.com',
    date1: '2020-05-02T18:30:00.000Z',
  }
  const changeValues = () => setValues(defaultValues)
  const onSubmit = values => console.log('> onSubmit -> ', values)
  return (
    <div className="container">
      <MyForm
        defaultValues={defaultValues}
        values={values}
        onSubmit={onSubmit}
      />
      <Button onClick={changeValues}>Reset to default values</Button>
    </div>
  )
}

const MyForm = ({ defaultValues, ...props }) => {
  const form = useRef(createForm())
  const { Provider } = form.current
  return (
    <Provider values={defaultValues}>
      <Form form={form.current} {...props}>
        <FormFields form={form.current}/>
      </Form>
    </Provider>
  )
}

const Form = ({ form, onSubmit, children }) => {
  const { m } = useForm(form)
  return (
    <form className="form-horizontal" onSubmit={onSubmit}>
      {children}

      {/*{console.log(`FORM RERENDER`)}*/}
      {/*<Code>{JSON.stringify(values, null, 2)}</Code>*/}

      {/*{anyDirty && <div>Form Dirty</div>}*/}
      {/*{anyTouched && <div>Form Touched</div>}*/}
      {/*<Button type="submit">Submit</Button>*/}
      {/*<Button onClick={resetForm}>Reset</Button>*/}
    </form>
  )
}

const FormFields = ({ form }) => {
  // const {
  //     values,
  //     submitForm,
  //     setValue,
  //     resetForm,
  //     anyDirty,
  //     anyTouched
  // } = form
  return (
    <>
      <Field
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
      <Field
        form={form}
        id="email"
        label="Email"
        component={Input}
        validate={value => {
          console.log(' validation -> ', value)
          return /\d/.test(value) && 'should not contain a number'
        }}
      />
      {/*<Field form={form} id="date1" label="Date1" component={DatePicker} />*/}
      {/*<Field form={form} id="date2" label="Date2" component={DatePicker} />*/}
      <Field form={form} id="time" label="Time" component={TimePicker}/>
      <Field
        form={form}
        id="conn1"
        label="Conn1"
        component={Input}
        onChange={v => {
          // setValue("conn2", v);
          return v
        }}
      />
      <Field
        form={form}
        id="conn2"
        label="Conn2"
        component={Input}
        validate={value => {
          console.log(' validation -> ', value)
          return /\d/.test(value) && 'should not contain a number'
        }}
      />
      <Field
        form={form}
        id="same"
        label="Same1"
        component={Input}
        validate={value => {
          console.log(' validation -> ', value)
          return /\d/.test(value) && 'should not contain a number'
        }}
      />
      <Field form={form} id="same" label="Same2" component={Input}/>

      <Field form={form} id="datetime" component={DateTimePicker}/>
    </>
  )
}

export default App

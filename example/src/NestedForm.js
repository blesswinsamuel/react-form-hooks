import React, { useCallback, useMemo, useState } from 'react'
import { Button, Code, Input } from './components'
import { useForm, useFormState } from 'react-form-hooks'
import { FormField, ArrayFormField } from './Field'

const NestedForm = () => {
  const [values, setValues] = useState({})
  const defaultValues = {
    name: {
      firstname: 'dan',
      lastname: 'abramov',
    },
    items: [1, 2],
    itemsObj: [
      {
        title: 'abc',
        description: 'desc',
      },
    ],
    email: 'asdf@dsa.com',
  }
  const changeValues = () => setValues(defaultValues)
  const onSubmit = useCallback(values => console.log('> onSubmit -> ', values), [])
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

const MyForm = ({ defaultValues, onSubmit }) => {
  const form = useForm({ initialValues: defaultValues })
  console.log('FORM_RERENDER')
  return useMemo(() => (
    <form className="form-horizontal" onSubmit={form.formActions.submitHandler(onSubmit)}>
      <FormFields form={form}/>

      <FormStateAndButton form={form}/>
    </form>
  ), [])
}

const FormStateAndButton = ({ form }) => {
  const { anyError, anyDirty, anyTouched, values } = useFormState(form, state => [state.anyError, state.anyDirty, state.anyTouched, state.values])

  // console.log('FORM_STATE_UPDATE', { anyError, anyDirty, anyTouched, values })
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
        id="name.firstname"
        label="Firstname"
        component={Input}
        validate={value => {
          return /\d/.test(value) && 'should not contain a number'
        }}
        onChange={value => {
          return value.toUpperCase()
        }}
      />
      <FormField
        form={form}
        id="name.lastname"
        label="Lastname"
        component={Input}
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
      <ArrayFormField
        form={form}
        id="items"
        label="Items"
        validate={value => {
          return value.length < 2 && 'should have more than 1 items'
        }}
        InputProps={{
          renderField: (id, index) => (
            <FormField
              form={form}
              id={id}
              label={`Item ${index}`}
              component={Input}
              validate={value => {
                return value <= 10 && 'should be greater than 10'
              }}
              InputProps={{
                type: 'number',
              }}
            />
          ),
        }}
      />
      <ArrayFormField
        form={form}
        id="itemsObj"
        label="Items Object"
        InputProps={{
          renderField: (id, index) => (
            <>
              <FormField
                form={form}
                id={`${id}.title`}
                label={`Title ${index}`}
                component={Input}
              />
              <FormField
                form={form}
                id={`${id}.description`}
                label={`Description ${index}`}
                component={Input}
              />
            </>
          ),
        }}
      />
    </>
  )
}

export default NestedForm

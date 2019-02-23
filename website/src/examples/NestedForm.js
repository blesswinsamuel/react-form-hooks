import React, { useCallback, useState } from 'react'
import { FormFooter, Input } from './components'
import { useForm, useFormState } from 'react-form-hooks'
import { ArrayFormField, FormField } from './Field'

const NestedForm = () => {
  const [values, setValues] = useState({})
  const defaultValues = {
    name: {
      firstname: 'John',
      lastname: 'Doe',
    },
    items: [1, 2],
    itemsObj: [
      {
        title: 'My title',
        description: 'My desc',
      },
    ],
    email: 'form@email.me',
  }
  const changeValues = () => setValues(defaultValues)
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

      <FormStateAndButton form={form} resetToNewValues={changeValues} />
    </form>
  )
}

const FormStateAndButton = ({ form, resetToNewValues }) => {
  const { anyError, anyDirty, anyTouched, values } = useFormState(
    form,
    state => ({
      anyError: state.anyError,
      anyDirty: state.anyDirty,
      anyTouched: state.anyTouched,
      values: state.values,
    })
  )

  // console.log('FORM_STATE_UPDATE', { anyError, anyDirty, anyTouched, values })
  return (
    <FormFooter
      {...{ anyError, anyDirty, anyTouched, values }}
      resetToInitial={() => form.formActions.resetFormValues()}
      resetToNew={resetToNewValues}
    />
  )
}

export default NestedForm

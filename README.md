# React Form Hooks

> Minimal form library using React hooks and subscriptions.

[![NPM](https://img.shields.io/npm/v/react-form-hooks.svg?style=flat-square)](https://www.npmjs.com/package/react-form-hooks)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![bundlephobia minified](https://flat.badgen.net/bundlephobia/min/react-form-hooks)](https://bundlephobia.com/result?p=react-form-hooks)
[![bundlephobia minified + gzip](https://flat.badgen.net/bundlephobia/minzip/react-form-hooks)](https://bundlephobia.com/result?p=react-form-hooks)

## Features

- No Dependencies.
- Minimal API - provides 3 hooks - `useForm`, `useFormState`, `useFieldState` and 2 render prop helper components which use the `use{Form|Field}State` hooks.
- Blazing Fast - re-render only when it needs to.
- Tiny Size - under 3KB gzipped.

## Install

```bash
npm install --save react-form-hooks@next
```

`react-form-hooks` is alpha quality as of now. So, there may be bugs hidden in the hooks (no pun intended) and the APIs are likely to change till it reaches a stable version.

## Usage

### Using hooks

```jsx
import React from 'react'
import ReactDOM from 'react-dom'

import { useForm, useFieldState, useFormState } from 'react-form-hooks'

function MyForm() {
  const form = useForm({ initialValues: {} })
  const onSubmit = values => console.log(values)
  return (
    <form onSubmit={form.formActions.submitHandler(onSubmit)}>
      <FormField
        form={form}
        id="firstname"
        label="First name"
        component={Input}
        validate={value => /\d/.test(value) && 'should not contain a number'}
        onChange={value => value.toUpperCase()}
      />
      <FormField
        form={form}
        id="lastname"
        label="Last name"
        component={Input}
        validate={value => /\d/.test(value) && 'should not contain a number'}
        onChange={value => value.toLowerCase()}
      />

      <FormStateAndButton form={form} />
    </form>
  )
}

const FormStateAndButton = ({ form }) => {
  const { anyError, anyDirty, anyTouched, values } = useFormState(form)

  return (
    <>
      <code>{JSON.stringify(values, null, 2)}</code>

      {anyError && <div>Form Error</div>}
      {anyDirty && <div>Form Dirty</div>}
      {anyTouched && <div>Form Touched</div>}
      <button type="submit">Submit</button>
      <button onClick={() => form.formActions.resetFormValues()}>Reset</button>
    </>
  )
}

const FormField = ({
  form,
  id,
  component: InputComponent,
  validate,
  InputProps,
  onChange = v => v,
  mapState,
  label,
  InputLabelProps,
}) => {
  const fieldState = useFieldState(form, id, mapState, { validate })
  const { changeFieldValue, touchField } = form.fieldActions
  const { value, touched, dirty, error } = fieldState

  return (
    <div>
      {label && (
        <label htmlFor={id} {...InputLabelProps}>
          {label}
        </label>
      )}
      <InputComponent
        id={id}
        value={value}
        onChange={value => changeFieldValue(id, onChange(value))}
        onBlur={() => touchField(id)}
        {...InputProps}
      />
      {touched && error && <div className="form-input-hint">{error}</div>}
      {dirty && <div>Field Modified</div>}
    </div>
  )
}

const Input = ({ onChange, value, ...otherProps }) => (
  <input
    onChange={handleStringChange(onChange)}
    value={value}
    {...otherProps}
  />
)

function handleStringChange(handler) {
  return event => handler(event.target.value)
}

ReactDOM.render(<MyForm />, document.getElementById('root'))
```

### Using render props

```jsx
import React, { useState } from 'react'
import { Button, Code, Input } from './components'
import { FormState, useForm } from 'react-form-hooks'
import { FormField } from './Field'

const MyForm = () => {
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

                <div>
                  {anyTouched && (<span>Form Touched</span>)}
                  {anyDirty && (<span>Form Dirty</span>)}
                  {anyError && (<span>Form Invalid</span>)}
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

ReactDOM.render(<MyForm />, document.getElementById('root'))
```

## Documentation

- [API](docs/API.md)
- [Examples](website/src/examples)

## License

MIT © [blesswinsamuel](https://github.com/blesswinsamuel)

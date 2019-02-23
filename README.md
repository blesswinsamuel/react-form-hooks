# React Form Hooks

> Form library using React hooks and subscriptions.

[![NPM](https://img.shields.io/npm/v/react-form-hooks.svg?style=flat-square)](https://www.npmjs.com/package/react-form-hooks)
![Actions Status](https://wdp9fww0r9.execute-api.us-west-2.amazonaws.com/production/badge/blesswinsamuel/react-form-hooks?style=flat-square)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Coverage Status](https://img.shields.io/coveralls/github/blesswinsamuel/react-form-hooks.svg?style=flat-square)](https://coveralls.io/github/blesswinsamuel/react-form-hooks?branch=master)
[![bundlephobia minified](https://img.shields.io/bundlephobia/min/react-form-hooks.svg?style=flat-square)](https://bundlephobia.com/result?p=react-form-hooks)
[![bundlephobia minified + gzip](https://img.shields.io/bundlephobia/minzip/react-form-hooks.svg?style=flat-square)](https://bundlephobia.com/result?p=react-form-hooks)

## Features

- No Dependencies.
- Minimal API. Provides 3 hooks - `useForm`, `useFormState`, `useFieldState` and 2 wrapper components (which accepts a render prop) around `use{Form|Field}State` hooks.
- Blazing Fast. Allows you to re-render form inputs only if necessary.
- Tiny Size. ~2KB gzipped.

## Install

```bash
npm install --save react-form-hooks
```

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
      <pre>{JSON.stringify(values, null, 2)}</pre>

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
import React from 'react'

import { useForm, FormState, FieldState } from 'react-form-hooks'

function MyForm() {
  const form = useForm({ initialValues: {} })
  const onSubmit = values => console.log(values)
  return (
    <form onSubmit={form.formActions.submitHandler(onSubmit)}>
      <FieldState
        form={form}
        id="firstname"
        options={{validate: value => /\d/.test(value) && 'should not contain a number'}}
        render={({ value, touched, error, dirty }  ) => {
          return (
            <div>
              <label htmlFor='firstname'>
                First name
              </label>
              <input
                id={'firstname'}
                value={value}
                onChange={e => form.fieldActions.changeFieldValue('firstname', e.target.value)}
                onBlur={() => form.fieldActions.touchField('firstname')}
              />
              {touched && error && <div className="form-input-hint">{error}</div>}
              {dirty && <div>Field Modified</div>}
            </div>
          )
        }}
      />
      <FieldState
        form={form}
        id="lastname"
        options={{validate: value => /\d/.test(value) && 'should not contain a number'}}
        render={({ value, touched, error, dirty }  ) => {
          return (
            <div>
              <label htmlFor='lastname'>
                Last name
              </label>
              <input
                id={'lastname'}
                value={value}
                onChange={e => form.fieldActions.changeFieldValue('lastname', e.target.value)}
                onBlur={() => form.fieldActions.touchField('lastname')}
              />
              {touched && error && <div className="form-input-hint">{error}</div>}
              {dirty && <div>Field Modified</div>}
            </div>
          )
        }}
      />

      <FormState form={form} render={({ anyError, anyDirty, anyTouched, values }) => {
        return (
          <>
            <pre>{JSON.stringify(values, null, 2)}</pre>

            {anyError && <div>Form Error</div>}
            {anyDirty && <div>Form Dirty</div>}
            {anyTouched && <div>Form Touched</div>}
            <button type="submit">Submit</button>
            <button onClick={() => form.formActions.resetFormValues()}>Reset</button>
          </>
        )
      }} />
    </form>
  )
}

ReactDOM.render(<MyForm />, document.getElementById('root'))
```

## Documentation

- [API](docs/API.md)
- [Examples](website/src/examples)

## License

MIT © [blesswinsamuel](https://github.com/blesswinsamuel)

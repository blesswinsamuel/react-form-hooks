# React Form Hooks

> Minimal form library using React hooks

[![NPM](https://img.shields.io/npm/v/react-form-hooks.svg?style=flat-square)](https://www.npmjs.com/package/react-form-hooks)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![bundlephobia minified](https://flat.badgen.net/bundlephobia/min/react-form-hooks)](https://bundlephobia.com/result?p=react-form-hooks)
[![bundlephobia minified + gzip](https://flat.badgen.net/bundlephobia/minzip/react-form-hooks)](https://bundlephobia.com/result?p=react-form-hooks)

> This library is currently experimental and is a Work In Progress. The API is likely to change frequently till it reaches a stable version. Not to be used in production.

## Install

```bash
npm install --save react-form-hooks
```

## Goals

- No Dependencies (currently has redux as dependency. This can be avoided)
- [Minimal](https://www.youtube.com/watch?v=4anAwXYqLG8) API - provides 3 hooks - `useForm`, `useFormState`, `useFieldState`
- Blazing Fast - re-render only when it needs to
- Tiny Size - under 4KB gzipped (could be even smaller once redux is removed)

## Roadmap

- [x] MVP
- [ ] Add unit tests
- [ ] Documentation
- [ ] Recipes
- [ ] Remove redux dependency

## Usage

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
  const { anyError, anyDirty, anyTouched, values } = useFormState(
    form,
    state => [state.anyError, state.anyDirty, state.anyTouched, state.values]
  )

  return (
    <>
      <code>{JSON.stringify(values, null, 2)}</code>

      {anyError && <div>Form Error</div>}
      {anyDirty && <div>Form Dirty</div>}
      {anyTouched && <div>Form Touched</div>}
      <button type="submit">Submit</button>
      <button onClick={form.formActions.resetFormValues}>Reset</button>
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
  subscribeTo,
  label,
  InputLabelProps,
}) => {
  const fieldState = useFieldState(form, id, subscribeTo, { validate })
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

## Documentation

- [API](./docs/API.md)

## License

MIT © [blesswinsamuel](https://github.com/blesswinsamuel)

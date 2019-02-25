---
path: /getting-started
title: Getting Started
order: 1
---

# Getting Started

## Install

```bash
yarn add react-form-hooks
```

## Usage

This library provides 3 hooks - `useForm`, `useFormState` and `useFieldState`.

Start by importing the `useForm`, `useFormState` and `useFieldState` hooks from `react-form-hooks`:

```jsx{2}
import React from 'react';
import { useForm, useFormState, useFieldState } from 'react-form-hooks';

function ExampleForm() {
  // ...
}
```

Declare a form:

```jsx{5}
import React from 'react';
import { useForm, useFormState, useFieldState } from 'react-form-hooks';

function ExampleForm() {
  const form = useForm()
```

To listen for state changes to any field, use `useFormState` hook:

```jsx{4,5}
function ExampleForm() {
  const form = useForm()

  const formState = useFormState(form)
  const { anyError, anyDirty, anyTouched, values, errors } = formState
```

To listen for state changes to a particular field (`name` field for example), use `useFieldState` hook:

```jsx{4}
  const formState = useFormState(form)
  const { anyError, anyDirty, anyTouched, values, errors } = formState

  const nameState = useFieldState(form, 'name')
```

Now, define the form to be rendered. `form.formActions` object has a `submitHandler` function which validates all fields
and prevents submitting the form if there are any validation errors. The function passed to `submitHandler`
accepts the form values object performs the actual form submission like posting to an API endpoint.

```jsx{5-7}
  const nameState = useFieldState(form, 'name')

  const onSubmit = values => alert(JSON.stringify(values, null, 2))
  return (
    <form onSubmit={form.formActions.submitHandler(onSubmit)}>
      {/* ... */}
    </form>
  )
```

Now, define the form inputs inside the form element. 
For `onChange` prop, use `changeFieldValue(fieldId, newValue)` function from `form.fieldActions` object.
For `onBlur` prop, use `touchField(fieldId)` function from `form.fieldActions` object.
For `value` prop, use `value` returned from `useFieldState` hook.

```jsx{3-10}
  return (
    <form onSubmit={form.formActions.submitHandler(onSubmit)}>
      <input
        id="name"
        onChange={e =>
          form.fieldActions.changeFieldValue('name', e.target.value)
        }
        onBlur={() => form.fieldActions.touchField('name')}
        value={nameState.value}
      />
    </form>
  )
```

Finally, add the submit button. to reset the form, `resetFormValues` function can be used from `form.formActions` object.
`formState` returned from `useFormState` hook above can also be used for styling the submit button differently
when there is no change to the form or adding an error message when there is an error in some of the fields. 

```jsx{11-12}
  return (
    <form onSubmit={form.formActions.submitHandler(onSubmit)}>
      <input
        id="name"
        onChange={e =>
          form.fieldActions.changeFieldValue('name', e.target.value)
        }
        onBlur={() => form.fieldActions.touchField('name')}
        value={nameState.value}
      />
      <button disabled={!anyDirty} type="submit">Submit</button>
      <button onClick={() => form.formActions.resetFormValues()}>Reset</button>
    </form>
  )
```

For the completed form, check `GettingStarted.js` file in `website/src/examples` directory.

For more options that can be passed to the hooks, check the API documentation.

Note that this is a straightforward implementation where everything is defined in a single component.
This is fine for getting started. But when building forms with many form fields, it can be cumbersome
to manage the boilerplate (like listening for state for each field by defining `useFieldState` and then passing
`onChange`, `onBlur`, etc..).
Also, when using hooks, the component hosting the hook will be re-rendered
whenever the values has be updated like the field and form state here.
Also, the form would perform better if the hooks are moved to their own components and then reused.

For a better approach where most of the boilerplate is reused, it is better to move `useFieldState` to a
common component and then reused. Check `BasicExample.ts` in `website/src/examples` directory for
and example implementing this approach.

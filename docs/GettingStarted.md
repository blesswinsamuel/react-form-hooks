# Getting Started

## Install

```bash
yarn add react-form-hooks
```

## Usage

There are two ways to use this library:

- [Using hooks](#using-hooks)
- [Using components which accepts a render prop](#using-render-prop)

### Using hooks

This library provides 3 hooks - `useForm`, `useFormState` and `useFieldState`.

Start by importing the `useForm`, `useFormState` and `useFieldState` hooks from `react-form-hooks`:

```jsx
import React from 'react';
import { useForm, useFormState, useFieldState } from 'react-form-hooks';

function ExampleForm() {
  // ...
}
```

Declare a form:

```jsx
import React from 'react';
import { useForm, useFormState, useFieldState } from 'react-form-hooks';

function ExampleForm() {
  const form = useForm()
```

To listen for state changes to any field, use `useFormState` hook:

```jsx
  const formState = useFormState(form)
  const { anyError, anyDirty, anyTouched, values, errors } = formState
```

To listen for state changes to a particular field (`name` field for example), use `useFieldState` hook:

```jsx
  const nameState = useFieldState(form, 'name')
```

Now, define the form to be rendered. `form.formActions` object has a `submitHandler` function which validates all fields
and prevents submitting the form if there are any validation errors. The function passed to `submitHandler`
accepts the form values object performs the actual form submission like posting to an API endpoint.

```jsx
  const onSubmit = values => console.log(values)
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

```jsx
        <input
          id="name"
          onChange={e =>
            form.fieldActions.changeFieldValue('name', e.target.value)
          }
          onBlur={() => form.fieldActions.touchField('name')}
          value={nameState.value}
        />
```

Finally, add the submit button. to reset the form, `resetFormValues` function can be used from `form.formActions` object.
`formState` returned from `useFormState` hook above can also be used for styling the submit button differently
when there is no change to the form or adding an error message when there is an error in some of the fields. 

```jsx
      <button disabled={!anyDirty} type="submit">Submit</button>
      <button onClick={() => form.formActions.resetFormValues()}>Reset</button>
```

For the completed form, check `PlainHooks.js` file in `website/src/examples` directory.

For more options that can be passed to the hooks, check the API documentation.

Note that this is a straightforward implementation where everything is defined in a single component.
This is fine for getting started. But when building forms with many form fields, it can be cumbersome
to manage the boilerplate (like listening for state for each field by defining `useFieldState` and then passing
`onChange`, `onBlur`, etc..).
Also, when using hooks, the component hosting the hook will be re-rendered
whenever the values has be updated like the field and form state here.
Also, the form would perform better if the hooks are moved to their own components and then reused.

For a better approach where most of the boilerplate is reused, it is better to move `useFieldState` to a
common component and then reused. Check `BasicForm.ts` in `website/src/examples` directory for
and example implementing this approach.


### Using render prop

This library provides 2 components which accepts a 
[render prop](https://reactjs.org/docs/render-props.html) - `FormState` and `FieldState`.

`FormState` and `FieldState` components are wrappers around `useFormState` and `useFieldState` hooks
respectively. They accept the same arguments passed to the hooks, but as props. Along with the same props, 
they accept a render prop which is a function accepting the current form/field state and re-renders 
only the elements inside the render function as necessary.  

Check `PlainRenderProps.js` in `website/src/examples` directory for an example.

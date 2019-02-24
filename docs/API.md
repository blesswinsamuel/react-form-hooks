---
path: /api
title: API
---

# API

- [`useForm`](#useform)
- [`useFormState`](#useformstate)
- [`useFieldState`](#usefieldstate)
- [`form` object](#form-object)

## `useForm`

```jsx
const form = useForm({ initialValues })
```

Creates a new form and returns a form object.

We can also pass initial values to the form using:

```jsx
  const form = useForm({ initialValues: { name: 'John' } })
```

**Note**: By default, whenever `initialValues` changes, the form is reset to the new `initialValues`.
So, in the above snippet, if the component using `useForm` re-renders, a new object is created, causing the 
previous `initialValues` and the new `initialValues` to be different. This will reset the form.
To avoid this, create the `initialValues` in an `useRef`:

```jsx
  const initialValues = useRef({ name: 'John' })
  const form = useForm({ initialValues: initialValues.current })
```

Using this hook does **not** cause the component hosting it to re-render on state changes.

## `useFormState`

```jsx
const formState = useFormState(form, mapState?)
const { anyError, anyTouched, anyDirty, values } = formState
```

Accepts a form object (the value returned by [`useForm`](#useform) hook)
and returns the current form state.

The values in `formState` object are:

- `anyError` - `true` if any of the fields has an error.
- `anyTouched` - `true` if any of the fields is touched.
- `anyDirty` - `true` if any of the fields has been modified after the form is initialized.
- `values` - current values of the form.

When a field is updated, this hook will trigger a re-render if any of the above values changes.

`useFormState` hook also accepts a second argument `mapState` which is a function which allows to 
return a derived state and also control the state changes for which the form should re-render 
(similar to redux's `mapStateToProps`).

For example, if `mapState` is specified as `state => ({ anyError: state.anyError })`, 
it will causes re-render only when `anyError` value changes.

To determine if a re-render should be performed, 
previous return value of `mapState` function is compared with the new value.


## `useFieldState`

```jsx
const fieldState = useFieldState(form, id, mapState?, { validate }?)
const { error, touched, dirty, value } = fieldState
```

Accepts a form object (the value returned by [`useForm`](#useform) hook)
and a field id and returns the current field state.

The values in `fieldState` object are:

- `error` - error returned by `validate` function.
- `touched` - `true` if the field is touched.
- `dirty` - `true` if the field has been modified.
- `value` - current value of the field.

When the field is updated, this hook will trigger a re-render if any of the above values changes.

Similar to `useFormState` hook, `useFieldState` hook also accepts a third argument `mapState`, 
which is a function which allows to return a derived state and also control the state changes for which the form should re-render 
(similar to redux's `mapStateToProps`).

For example, if `mapState` is specified as `state => ({ value: state.value })`, 
it will causes re-render only when `value` changes. In this example, if a field is touched, it won't cause a re-render. 

To determine if a re-render should be performed, 
previous return value of `mapState` function is compared with the new value.

The fourth argument to `useFieldState` hook is used to specify any extra options for the field.
Currently, it accepts a `validate` function. `validate` function specified should take field value as argument and
it should return an error string if there is an error or should return a null/false/empty string value if there is no error.

## `form` object

`form` object returned by `useForm` hook has two objects described below.

```jsx
const { formActions, fieldActions } = form
```

### `formActions`

Functions in `formActions` object are used to manipulate the form state.

#### `resetFormValues`

```jsx
formActions.resetFormValues(newInitialState?)
```

Resets the form values to initial state. 
If `newInitialState` argument is specified, old `initialState` is replaced with `newInitialState`.
So that next time `resetFormValues` is called without an argument, the form is reset to the `newInitialState`.

#### `submitHandler`

```jsx
formActions.submitHandler(submitFn)
```

Accepts the function to be called when submitting the form.
The return value `submitHandler` function can be used to pass to form `onSubmit` prop.
Form is not submitted if the form is invalid (i.e., it has some errors). 
If the form has any errors, it sets all fields to touched state.


#### `getFormState`

```jsx
const formState = formActions.getFormState()
```

Returns the current state of the form. Same return values as `useFormState` hook.


### `fieldActions`

Functions in `fieldActions` object are used to manipulate field states.

#### `changeFieldValue`

```jsx
changeFieldValue(fieldId, value)
```

Change field value. Changes field value and sets dirty to true.

#### `touchField`
```jsx
touchField(fieldId)
```

Set field state to touched.

#### `getFieldState`
```jsx
getFieldState(fieldId)
```

Returns the current state of the field. Same return values as `useFieldState` hook.

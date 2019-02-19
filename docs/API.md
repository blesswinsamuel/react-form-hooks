# API

#### `useForm({ initialValues })` 
- Creates a new form and returns a form object.
- Accepts `initialValues` argument.
- If `initialValues` changes, the form is reset.
- Doesn't cause any re-renders unless `initialValues` changes.
- Returns
```js
{
  subscribe: store.subscribe(fn), // function will be called for all form state changes. Returns unsubscribe function.
  formActions: {
    resetFormValues(newInitialState), // newInitialState is optional
    submitHandler(submitFn), // return value can be used to pass to form onSubmit prop. Accepts the actual function to be called when submitting the form. Form is not submitted if the form is invalid (i.e., it has some errors). Also sets all fields to touched state.
    getFormState(), // returns form state
  },
  fieldActions: {
    initField(field, ref, opts), // Not to be used
    destroyField(field, ref), // Not to be used
    changeFieldValue(field, value), // Change field value. Changes field value and sets dirty to true.
    touchField(field), // Set field to touched
    getFieldState(field), // Get current field state
  },
}
```

#### `useFieldState(form, subscribeTo)`
- Listens for changes in the form state and re-renders whenever state changes.
- Arguments:
  - `form` - form object created using `useForm`
  - `subscribeTo(state)` - function which allows to control the state changes for which the form should rerender.
    Eg. passing `subscibeTo` as `state => [state.anyError]` causes re-render only when `anyError` state value changes.
- Returns an object - `{ anyError, anyDirty, anyTouched, values }`
  - `anyError` - `true` if any of the fields has an error.
  - `anyTouched` - `true` if any of the fields is touched.
  - `anyDirty` - `true` if any of the fields has been modified after the form is initialized.
  - `values` - current state of the form

#### `useFieldState(form, id, subscribeTo, { validate })`
- Listens for changes in field state and re-renders whenever field state changes.
- Arguments:
  - `form` - form object created using `useForm`
  - `id` - id of the field which is being listened to for state changes
  - `subscribeTo` - Similar to above
  - `validate` - function to validate the field

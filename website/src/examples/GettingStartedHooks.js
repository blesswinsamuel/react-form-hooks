import React, { useRef } from 'react'

import { useFieldState, useForm, useFormState } from 'react-form-hooks'

/**
 This is an example where everything is defined in a single component.
 This may be fine for starting out. But it can become cumbersome to manage
 especially when working with large number of inputs.
 Also, when using hooks, the component hosting the hook will be re-rendered
 whenever the values has be updated like the field and form state here.
 The form would perform better if the hooks are moved to their own components
 and then reused.

 Check the other examples here for patterns to reuse code.
 */
function MyForm() {
  // useRef is necessary here because otherwise, the form will be reset
  // when initialValues reference changes on re-render.
  const initialValues = useRef({ name: 'John' }).current
  const form = useForm({ initialValues })

  const formState = useFormState(form)
  const { anyError, anyDirty, anyTouched, values, errors } = formState

  const nameState = useFieldState(form, 'name')
  const ageState = useFieldState(form, 'age', undefined, {
    validate: value => value < 18 && 'age should be above 18',
  })
  const emailState = useFieldState(form, 'email', undefined, {
    validate: v => !/^\S+@\S+\.\S+$/.test(v) && 'should be a valid email',
  })

  const onSubmit = values => console.log(values)

  console.log('FORM RENDER', formState)
  return (
    <form onSubmit={form.formActions.submitHandler(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          onChange={e =>
            form.fieldActions.changeFieldValue(
              'name',
              e.target.value.toUpperCase()
            )
          }
          onBlur={() => form.fieldActions.touchField('name')}
          value={nameState.value}
        />
      </div>
      <div>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          onChange={e =>
            form.fieldActions.changeFieldValue(
              'age',
              e.target.value.toUpperCase()
            )
          }
          onBlur={() => form.fieldActions.touchField('age')}
          value={ageState.value}
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          onChange={e =>
            form.fieldActions.changeFieldValue('email', e.target.value)
          }
          onBlur={() => form.fieldActions.touchField('email')}
          value={emailState.value}
        />
      </div>

      <pre>{JSON.stringify(values, null, 2)}</pre>
      <pre>{JSON.stringify(errors, null, 2)}</pre>

      {anyError && <div>Form Error</div>}
      {anyDirty && <div>Form Dirty</div>}
      {anyTouched && <div>Form Touched</div>}
      <button type="submit">Submit</button>
      <button onClick={() => form.formActions.resetFormValues()}>Reset</button>
    </form>
  )
}

export default MyForm

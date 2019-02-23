import * as React from 'react'
import { act } from 'react-dom/test-utils'
import * as ReactDOM from 'react-dom'
import { useFieldState, useForm, useFormState } from './index'
import createForm from './createForm'

describe('react-form-hooks', () => {
  let reactRoot: HTMLDivElement

  beforeEach(() => {
    reactRoot = document.createElement('div')
    document.body.appendChild(reactRoot)
  })

  afterEach(() => {
    document.body.removeChild(reactRoot)
  })

  function render(element: React.ReactElement<any>) {
    act(() => {
      ReactDOM.render(element, reactRoot)
    })
  }

  function getText() {
    return reactRoot.textContent
  }

  describe('useForm', () => {
    it('renders', () => {
      const Component = () => {
        const form = useForm()
        return <div>{JSON.stringify(form.formActions.getFormState())}</div>
      }

      render(<Component />)

      expect(getText()).toEqual(
        JSON.stringify({
          values: {},
          errors: {},
          anyTouched: false,
          anyError: false,
          anyDirty: false,
        })
      )
    })

    it('renders on passing options', () => {
      const Component = () => {
        const form = useForm({ initialValues: { a: 1, b: 'abc' } })

        return <div>{JSON.stringify(form.formActions.getFormState())}</div>
      }

      render(<Component />)

      expect(getText()).toEqual(
        JSON.stringify({
          values: { a: 1, b: 'abc' },
          errors: {},
          anyTouched: false,
          anyError: false,
          anyDirty: false,
        })
      )
    })

    it('re-renders if the form values changes', () => {
      const Component = ({ values }: { values: object }) => {
        const form = useForm({ initialValues: values })
        const formState = useFormState(form)
        return <div>{JSON.stringify(formState)}</div>
      }

      render(<Component values={{ a: 1, b: 'abc' }} />)
      render(<Component values={{ a: 2, b: 'abcd' }} />)
      expect(getText()).toEqual(
        JSON.stringify({
          values: { a: 2, b: 'abcd' },
          errors: {},
          anyTouched: false,
          anyError: false,
          anyDirty: false,
        })
      )
    })
  })

  describe('useFormState', () => {
    const form = createForm({ initialValues: { a: 1, b: 'abc' } })

    // beforeEach(() => {
    //   form= createForm({ initialValues: { a: 1, b: 'abc' } })
    // })
    //
    // afterEach(() => {
    //   form= createForm({ initialValues: { a: 1, b: 'abc' } })
    // })

    it('renders with state from the form', () => {
      const Component = () => {
        const formState = useFormState(form)
        return <div>{JSON.stringify(formState)}</div>
      }

      render(<Component />)
      expect(getText()).toEqual(
        JSON.stringify({
          values: { a: 1, b: 'abc' },
          errors: {},
          anyTouched: false,
          anyError: false,
          anyDirty: false,
        })
      )
    })

    it('renders mapped value', () => {
      const Component = () => {
        const formState = useFormState<{ b: string }, string>(
          form,
          state => state.values['b']
        )
        return <div>{formState}</div>
      }

      render(<Component />)
      expect(getText()).toEqual('abc')
    })

    it('re-renders on state change', () => {
      let renderCount = 0
      const Component = () => {
        const formState = useFormState(
          form,
          state => state.values['a'] + ' ' + state.values['b']
        )
        return (
          <div>
            {formState} {++renderCount}
          </div>
        )
      }

      render(<Component />)
      act(() => {
        form.fieldActions.changeFieldValue('a', 10)
      })
      expect(getText()).toEqual('10 abc 2')
    })

    it('cancels subscription on unmount', () => {
      const Component = () => {
        const formState = useFormState(form)
        return <div>{JSON.stringify(formState.values)}</div>
      }

      render(<Component />)

      ReactDOM.unmountComponentAtNode(reactRoot)
    })

    it('throws error if form is not passed', () => {
      const Component = () => {
        // @ts-ignore
        const formState = useFormState()
        return <div>{JSON.stringify(formState.values)}</div>
      }

      jest.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => render(<Component />)).toThrowError(
        'react-form-hooks requires the form instance created using useForm() to be passed to useFormState as 1st argument'
      )
    })
  })

  describe('useFieldState', () => {
    const form = createForm({ initialValues: { a: 1, b: 'abc' } })

    it('renders with state from the form', () => {
      const Component = () => {
        const fieldState = useFieldState(form, 'a')
        return <div>{fieldState.value}</div>
      }

      render(<Component />)
      expect(getText()).toEqual('1')
    })

    it('renders mapped value', () => {
      const Component = () => {
        const fieldState = useFieldState(form, 'a', state => state.value)
        return <div>{fieldState}</div>
      }

      render(<Component />)
      expect(getText()).toEqual('1')
    })

    it('re-renders on state update', () => {
      let renderCount = 0
      const Component = () => {
        const fieldState = useFieldState(form, 'a')
        return (
          <div>
            {fieldState.value} {++renderCount}
          </div>
        )
      }

      render(<Component />)
      act(() => {
        form.fieldActions.changeFieldValue('a', 2)
      })
      expect(getText()).toEqual('2 2')
    })

    it('re-renders only necessary fields', () => {
      let renderCountA = 0
      let renderCountB = 0
      const FieldA = () => {
        const fieldState = useFieldState(form, 'a')
        return (
          <div>
            {fieldState.value} {++renderCountA}
          </div>
        )
      }
      const FieldB = () => {
        const fieldState = useFieldState(form, 'b')
        return (
          <div>
            {fieldState.value} {++renderCountB}
          </div>
        )
      }
      const Component = () => {
        return (
          <>
            <FieldA />
            <FieldB />
          </>
        )
      }

      render(<Component />)
      act(() => {
        form.fieldActions.changeFieldValue('a', 2)
      })
      expect(getText()).toEqual('2 2' + 'abc 1')
      act(() => {
        form.fieldActions.changeFieldValue('b', 'abcd')
      })
      expect(getText()).toEqual('2 2' + 'abcd 2')
    })

    it('cancels subscription on unmount', () => {
      const Component = () => {
        const fieldState = useFieldState(form, 'a')
        return <div>{fieldState.value}</div>
      }

      render(<Component />)

      ReactDOM.unmountComponentAtNode(reactRoot)
    })

    it('throws error if form is not passed', () => {
      const Component = () => {
        // @ts-ignore
        const fieldState = useFieldState()
        return <div>{fieldState.value}</div>
      }

      jest.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => render(<Component />)).toThrowError(
        'react-form-hooks requires the form instance created using useForm() to be passed to useFieldState as 1st argument'
      )
    })

    it('throws error if field id is not passed', () => {
      const Component = () => {
        // @ts-ignore
        const fieldState = useFieldState(form)
        return <div>{fieldState.value}</div>
      }

      jest.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => render(<Component />)).toThrowError(
        'react-form-hooks requires the id of the field to be passed to useFieldState as 2nd argument'
      )
    })
  })
})

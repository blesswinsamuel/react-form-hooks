import { FieldState, FormState, useForm } from '../index'
import * as React from 'react'
import { act } from 'react-dom/test-utils'
import * as ReactDOM from 'react-dom'

describe('renderprops', () => {
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

  describe('FormState', () => {
    it('renders', () => {
      const Component = () => {
        const form = useForm()
        return (
          <FormState
            form={form}
            render={state => <div>{JSON.stringify(state)}</div>}
          />
        )
      }
      render(<Component />)

      expect(getText()).toEqual(
        JSON.stringify({
          values: {},
          anyTouched: false,
          anyError: false,
          anyDirty: false,
        })
      )
    })
  })

  describe('FormState', () => {
    it('renders', () => {
      const Component = () => {
        const form = useForm({ initialValues: { a: 1 } })
        return (
          <FieldState
            form={form}
            id="a"
            render={state => <div>{JSON.stringify(state)}</div>}
          />
        )
      }
      render(<Component />)

      expect(getText()).toEqual(
        JSON.stringify({
          touched: false,
          dirty: false,
          error: undefined,
          value: 1,
        })
      )
    })
  })
})

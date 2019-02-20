import createForm from './createForm'

describe('createForm', () => {
  describe('formActions.getFormState', () => {
    it('works with no initialValues', () => {
      const form = createForm()
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: false,
        anyError: false,
        anyTouched: false,
        values: {},
      })
    })

    it('works with initialValues', () => {
      const form = createForm({ initialValues: { a: 1, b: 'abc' } })
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: false,
        anyError: false,
        anyTouched: false,
        values: { a: 1, b: 'abc' },
      })
    })
  })

  describe('formActions.resetFormValues', () => {
    it('works with no newInitialValues', () => {
      const form = createForm({ initialValues: { a: 1, b: 'abc' } })
      form.formActions.resetFormValues()
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: false,
        anyError: false,
        anyTouched: false,
        values: { a: 1, b: 'abc' },
      })
      expect(form.fieldActions.getFieldState('a')).toEqual({
        value: 1,
      })
    })

    it('works with newInitialValues', () => {
      const form = createForm({ initialValues: { a: 1, b: 'abc' } })
      form.formActions.resetFormValues({ a: 2, b: 'abcd' })
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: false,
        anyError: false,
        anyTouched: false,
        values: { a: 2, b: 'abcd' },
      })
      expect(form.fieldActions.getFieldState('a')).toEqual({
        value: 2,
      })
    })

    it('works after initField', () => {
      const form = createForm({ initialValues: { a: 1, b: 'abc' } })
      form.fieldActions.initField('a', Symbol(), {})
      form.formActions.resetFormValues({ a: 2, b: 'abcd' })
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: false,
        anyError: false,
        anyTouched: false,
        values: { a: 2, b: 'abcd' },
      })
      expect(form.fieldActions.getFieldState('a')).toEqual({
        value: 2,
        touched: false,
        dirty: false,
        error: undefined,
      })
    })

    it('works after changeFieldValue', () => {
      const form = createForm({ initialValues: { a: 1, b: 'abc' } })
      form.fieldActions.initField('a', Symbol(), {})
      form.fieldActions.changeFieldValue('a', 4)
      form.formActions.resetFormValues({ a: 2, b: 'abcd' })
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: false,
        anyError: false,
        anyTouched: false,
        values: { a: 2, b: 'abcd' },
      })
      expect(form.fieldActions.getFieldState('a')).toEqual({
        value: 2,
        touched: false,
        dirty: false,
        error: undefined,
      })
    })
  })

  describe('fieldActions.getFieldState', () => {
    it('works with no initialValues', () => {
      const form = createForm()
      expect(form.fieldActions.getFieldState('a')).toEqual({
        value: '',
      })
    })

    it('works with initialValues', () => {
      const form = createForm({ initialValues: { a: 1, b: 'abc' } })
      expect(form.fieldActions.getFieldState('a')).toEqual({
        value: 1,
      })
    })
  })

  describe('fieldActions.initField', () => {
    it('works with no initialValues', () => {
      const form = createForm()
      const aFieldRef = Symbol()
      const bFieldRef = Symbol()
      form.fieldActions.initField('a', aFieldRef)
      form.fieldActions.initField('b', bFieldRef)
      expect(form.fieldActions.getFieldState('a')).toEqual({
        value: '',
        error: undefined,
        dirty: false,
        touched: false,
      })
      expect(form.fieldActions.getFieldState('b')).toEqual({
        value: '',
        error: undefined,
        dirty: false,
        touched: false,
      })
      form.fieldActions.destroyField('a', aFieldRef)
      form.fieldActions.destroyField('b', bFieldRef)
    })

    it('works with initialValues', () => {
      const form = createForm({ initialValues: { a: 1, b: 'abc' } })
      const aFieldRef = Symbol()
      const bFieldRef = Symbol()
      form.fieldActions.initField('a', aFieldRef, {})
      form.fieldActions.initField('b', bFieldRef, {})
      expect(form.fieldActions.getFieldState('a')).toEqual({
        value: 1,
        error: undefined,
        dirty: false,
        touched: false,
      })
      expect(form.fieldActions.getFieldState('b')).toEqual({
        value: 'abc',
        error: undefined,
        dirty: false,
        touched: false,
      })
      form.fieldActions.destroyField('a', aFieldRef)
      form.fieldActions.destroyField('b', bFieldRef)
    })
  })

  describe('fieldActions.changeFieldValue', () => {
    it('works', () => {
      const form = createForm({ initialValues: { a: 1, b: 'abc' } })
      form.fieldActions.initField('a', Symbol(), {})
      form.fieldActions.initField('b', Symbol(), {})
      form.fieldActions.changeFieldValue('a', 2)
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: true,
        anyError: false,
        anyTouched: false,
        values: { a: 2, b: 'abc' },
      })
      expect(form.fieldActions.getFieldState('a')).toEqual({
        value: 2,
        error: undefined,
        dirty: true,
        touched: false,
      })
    })

    it('works before init', () => {
      const form = createForm({ initialValues: { a: 1, b: 'abc' } })
      form.fieldActions.changeFieldValue('a', 2)
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: true,
        anyError: false,
        anyTouched: false,
        values: { a: 2, b: 'abc' },
      })
      expect(form.fieldActions.getFieldState('a')).toEqual({
        value: 2,
        error: undefined,
        dirty: true,
      })
    })
  })

  describe('fieldActions.touchField', () => {
    it('works', () => {
      const form = createForm({ initialValues: { a: 1, b: 'abc' } })
      form.fieldActions.initField('a', Symbol(), {})
      form.fieldActions.initField('b', Symbol(), {})
      form.fieldActions.touchField('a')
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: false,
        anyError: false,
        anyTouched: true,
        values: { a: 1, b: 'abc' },
      })
      expect(form.fieldActions.getFieldState('a')).toEqual({
        value: 1,
        error: undefined,
        dirty: false,
        touched: true,
      })
    })
  })

  describe('formActions.submitHandler', () => {
    it('works', () => {
      const form = createForm({ initialValues: { a: 1, b: 'abc' } })
      form.fieldActions.initField('a', Symbol(), {})
      form.fieldActions.initField('b', Symbol(), {})
      const submitFn = jest.fn()
      form.formActions.submitHandler(submitFn)(new Event('test'))
      expect(submitFn).toHaveBeenCalledTimes(1)
      expect(submitFn).toHaveBeenLastCalledWith({ a: 1, b: 'abc' })
      // Fields not touched because no error
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: false,
        anyError: false,
        anyTouched: false,
        values: { a: 1, b: 'abc' },
      })
      expect(form.fieldActions.getFieldState('b')).toEqual({
        value: 'abc',
        error: undefined,
        dirty: false,
        touched: false,
      })
    })

    it('works with validate', () => {
      const form = createForm({ initialValues: { a: 1, b: 'abc' } })
      form.fieldActions.initField('a', Symbol(), {
        validate: (val: number) => val < 2 && 'should be greater than 2',
      })
      form.fieldActions.initField('b', Symbol(), {})
      const mockFn = jest.fn()
      form.formActions.submitHandler(mockFn)()
      expect(mockFn.mock.calls.length).toBe(0)
      // Fields touched because of error
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: false,
        anyError: true,
        anyTouched: true,
        values: { a: 1, b: 'abc' },
      })
      expect(form.fieldActions.getFieldState('a')).toEqual({
        value: 1,
        error: 'should be greater than 2',
        dirty: false,
        touched: true,
      })
      expect(form.fieldActions.getFieldState('b')).toEqual({
        value: 'abc',
        error: undefined,
        dirty: false,
        touched: true,
      })
    })
  })
})

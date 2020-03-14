import createForm from './createForm'

describe('createForm', () => {
  describe('formActions.getFormState', () => {
    it('works with no initialValues', () => {
      const form = createForm()
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: false,
        anyError: false,
        anyTouched: false,
        allTouched: false,
        errors: {},
        values: {},
      })
    })

    it('works with initialValues', () => {
      const form = createForm({ initialValues: { a: 1, b: 'abc' } })
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: false,
        anyError: false,
        anyTouched: false,
        allTouched: false,
        errors: {},
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
        allTouched: false,
        errors: {},
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
        allTouched: false,
        errors: {},
        values: { a: 2, b: 'abcd' },
      })
      expect(form.fieldActions.getFieldState('a')).toEqual({
        value: 2,
      })
    })

    it('works after initializeField', () => {
      const form = createForm({ initialValues: { a: 1, b: 'abc' } })
      form.fieldActions.initializeField('a')
      form.formActions.resetFormValues({ a: 2, b: 'abcd' })
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: false,
        anyError: false,
        anyTouched: false,
        allTouched: false,
        errors: { a: undefined },
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
      form.fieldActions.initializeField('a')
      form.fieldActions.setFieldOptions('a', Symbol(), {})
      form.fieldActions.changeFieldValue('a', 4)
      form.formActions.resetFormValues({ a: 2, b: 'abcd' })
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: false,
        anyError: false,
        anyTouched: false,
        allTouched: false,
        errors: {},
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

  describe('fieldActions.initializeField', () => {
    it('works with no initialValues', () => {
      const form = createForm()
      form.fieldActions.initializeField('a')
      form.fieldActions.initializeField('b')
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
      form.fieldActions.destroyField('a')
      form.fieldActions.destroyField('b')
    })

    it('works with initialValues', () => {
      const form = createForm({ initialValues: { a: 1, b: 'abc' } })
      form.fieldActions.initializeField('a')
      form.fieldActions.initializeField('b')
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
      form.fieldActions.destroyField('a')
      form.fieldActions.destroyField('b')
    })
  })

  describe('fieldActions.changeFieldValue', () => {
    it('works', () => {
      const form = createForm({ initialValues: { a: 1, b: 'abc' } })
      form.fieldActions.initializeField('a')
      form.fieldActions.initializeField('b')
      form.fieldActions.changeFieldValue('a', 2)
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: true,
        anyError: false,
        anyTouched: false,
        allTouched: false,
        errors: { a: undefined, b: undefined },
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
        allTouched: false,
        errors: { a: undefined, b: undefined },
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
      form.fieldActions.initializeField('a')
      form.fieldActions.initializeField('b')
      form.fieldActions.touchField('a')
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: false,
        anyError: false,
        anyTouched: true,
        allTouched: false,
        errors: { a: undefined, b: undefined },
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
      form.fieldActions.initializeField('a')
      form.fieldActions.initializeField('b')
      const submitFn = jest.fn()
      form.formActions.submitHandler(submitFn)(new Event('test'))
      expect(submitFn).toHaveBeenCalledTimes(1)
      expect(submitFn).toHaveBeenLastCalledWith({ a: 1, b: 'abc' })
      // Fields not touched because no error
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: false,
        anyError: false,
        anyTouched: false,
        allTouched: false,
        errors: { a: undefined, b: undefined },
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
      form.fieldActions.setFieldOptions('a', Symbol(), {
        validate: (val: number) => val < 2 && 'should be greater than 2',
      })
      form.fieldActions.setFieldOptions('b', Symbol())
      form.fieldActions.initializeField('a')
      form.fieldActions.initializeField('b')
      const mockFn = jest.fn()
      form.formActions.submitHandler(mockFn)()
      expect(mockFn).toHaveBeenCalledTimes(0)
      // Fields touched because of error
      expect(form.formActions.getFormState()).toEqual({
        anyDirty: false,
        anyError: true,
        anyTouched: true,
        allTouched: true,
        errors: { a: 'should be greater than 2', b: undefined },
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

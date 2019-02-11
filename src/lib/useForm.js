import { useRef } from 'react'
import createForm from './createForm'

export default function useForm(opts) {
  const form = useRef(createForm(opts))
  return form.current
}

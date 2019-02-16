export const handleFormSubmit = func => event => {
  event.preventDefault()
  return func()
}

export function handleStringChange(handler) {
  return event => handler(event.target.value)
}

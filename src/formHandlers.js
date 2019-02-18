export const handleFormSubmit = func => event => {
  if (event) {
    event.preventDefault()
  }
  return func()
}

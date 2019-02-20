export const handleFormSubmit = (func: () => any) => (event?: Event) => {
  if (event) {
    event.preventDefault()
  }
  return func()
}

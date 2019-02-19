export function handleStringChange(handler) {
  return event => handler(event.target.value)
}

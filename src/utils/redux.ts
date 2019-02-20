type Listener = () => void

export default function createStore<TState>(initialState: TState) {
  let state: TState = initialState
  let listeners: Listener[] = []

  function getState(): TState {
    return state
  }

  function setState(newState: TState): void {
    state = newState
    listeners.forEach(listener => listener())
  }

  function subscribe(listener: Listener): () => void {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }

  return { subscribe, getState, setState }
}

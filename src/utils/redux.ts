type Reducer<TState> = <TAction>(state: TState, action: TAction) => TState
type Listener = () => void

// Simplified version of createStore from Redux to keep the size small
export default function createStore<TState>(
  reducer: Reducer<TState>,
  initialState: TState
) {
  let state: TState = initialState
  let listeners: Listener[] = []

  function getState(): TState {
    return state
  }

  function dispatch<TAction>(action: TAction): void {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }

  function subscribe(listener: Listener): () => void {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }

  return { subscribe, getState, dispatch }
}

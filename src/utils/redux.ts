type Listener = () => void
export interface Action<T = any> {
  type: T
}
export interface AnyAction extends Action {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any
}
export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S,
  action: A
) => S

// Simplified version of createStore from Redux to keep the size small
export default function createStore<S = any, A extends Action = AnyAction>(
  reducer: Reducer<S, A>,
  initialState: S
) {
  let state: S = initialState
  let listeners: Listener[] = []

  function getState(): S {
    return state
  }

  function dispatch<T extends A>(action: T): T {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
    return action
  }

  function subscribe(listener: Listener): () => void {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }

  return { subscribe, getState, dispatch }
}

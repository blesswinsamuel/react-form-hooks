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

export interface Store<S, A> {
  subscribe(listener: Listener): () => void
  getState(): S
  dispatch<T extends A>(action: T): T
}

// Simplified version of createStore from Redux to keep the size small
export default function createStore<S = any, A extends Action = AnyAction>(
  reducer: Reducer<S, A>,
  initialState: S
): Store<S, A> {
  let state: S = initialState
  let listeners: Listener[] = []

  function getState(): S {
    return state
  }

  function dispatch<T extends A>(action: T): T {
    console.debug(`%cDISPATCH`, 'background:red;color:#fff', action)
    state = reducer(state, action)
    listeners.forEach(listener => listener())
    return action
  }

  function subscribe(listener: Listener): () => void {
    console.debug('%cSUBSCRIBE', 'color: green')
    listeners.push(listener)
    return () => {
      console.debug('%cUNSUBSCRIBE', 'color: red')
      listeners = listeners.filter(l => l !== listener)
    }
  }

  return { subscribe, getState, dispatch }
}

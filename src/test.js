import React, { useState, useEffect } from 'react'
import { act } from 'react-dom/test-utils';
import ReactDOM from 'react-dom'

let container

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null
})

function useCounter({ initialCount = 0, step = 1 } = {}) {
  const [count, setCount] = useState(initialCount)
  const increment = () => setCount(c => c + step)
  const decrement = () => setCount(c => c - step)
  return { count, increment, decrement }
}

function Counter() {
  const { count, increment, decrement } = useCounter({});
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => increment()}>
        Click me
      </button>
    </div>
  );
}

// how to use this:
test('renders counter', () => {
  // Test first render and effect
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // Test second render and effect
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
})

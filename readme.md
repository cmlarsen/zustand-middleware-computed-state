# Zustand Computed State Middleware

This is a dead simple middleware for adding computed state to state management library [Zustand](https://github.com/pmndrs/zustand).

```
npm install zustand-middleware-computed-state
-- or --
yarn add zustand-middleware-computed-state
```

The computed values are defined as a function passed as the second argument passed into the `computed(store, computedStore)` middleware. The resulting values will be merged into the store and accessible just like any other bit of Zustand state.

Since this computed state is updated on every state change, these should be kept light.

```javascript
import create from 'zustand'
import { computed } from 'zustand-middleware-computed-state'

const useState = create(computed(store, computedStore))
```

## Example

```javascript
import create from 'zustand'
import { computed } from 'zustand-middleware-computed-state'

const useStore = create(
  computed(
    (set) => ({
      count: 0,
      inc: () => set((state) => ({ count: state.count + 1 })),
    }),
    (state) => {
      function isEnough() {
        if (state.count > 100) {
          return 'Is enough'
        } else {
          return 'Is not enough'
        }
      }

      return {
        computedCount: state.count + 10,
        isEnough: isEnough(),
      }
    }
  )
)

function Counter() {
  const { count, computedCount, isEnough, inc } = useStore()

  return (
    <div>
      <button onClick={inc}>Increment</button>
      <div>count: {count}</div> {/* output: 1*/}
      <div>computedCount: {computedCount}</div> {/* output: 11*/}
      <div>isEnough: {isEnough}</div> {/* output: "Is not enough*/}
    </div>
  )
}
```

## TypeScript
code below demonstrates how you can use it with Typescript:
```typescript
import { create } from "zustand";
import { computed } from "zustand-middleware-computed-state";

type ComputedStore = {
  sum: number;
};

type Store = {
  x: number;
  y: number;
  incX: (by: number) => void
  incY: (by: number) => void
};

type SetType = (
  partial:
    | Store
    | Partial<Store>
    | ((state: Store) => Store | Partial<Store>),
  replace?: boolean | undefined
) => void;

type CombinedStore = State & ComputedStore;

function computedState(state: Store): ComputedStore {
  return {
    sum: state.x + state.y,
  };
}

const useSampleStore = create<CombinedStore>(
  computed<Store, ComputedStore>(
    (set: SetType) => ({
      x: 0,
      y: 0,
      incX: (by) => set(store => ({x: state.x + by})),
      incY: (by) => set(store => ({y: state.y + by}))
    }),
    computedState
  )
);

export default useSampleStore;

```

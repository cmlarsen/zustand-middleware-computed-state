import React from 'react'
import { cleanup, render } from '@testing-library/react'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { computed } from '../src'

const consoleError = console.error
afterEach(() => {
  cleanup()
  console.error = consoleError
})

interface Store {
  count: number;
  inc: () => void;
}

interface ComputedStore {
  computedCount: number;
}

it('returns initial computed state', async () => {
  const useStore = create<Store & ComputedStore>(
    computed<Store, ComputedStore>(
      (set) => ({
        count: 0,
        inc: () => set((state: any) => ({ count: state.count + 1 })),
      }),
      (state) => {
        return {
          computedCount: state.count + 10,
        }
      }
    )
  )

  function Counter() {
    const { count, computedCount } = useStore()

    return (
      <div>
        <div>count: {count}</div>
        <div>computedCount: {computedCount}</div>
      </div>
    )
  }

  const { findByText } = render(<Counter />)

  await findByText('count: 0')
  await findByText('computedCount: 10')
})
it('computed state updates when the state updates', async () => {
  const useStore = create<Store & ComputedStore>(
    computed<Store, ComputedStore>(
      (set) => ({
        count: 0,
        inc: () => set((state) => ({ count: state.count + 1 })),
      }),
      (state) => {
        return {
          computedCount: state.count + 10,
        }
      }
    )
  )

  function Counter() {
    const { count, computedCount, inc } = useStore()
    React.useEffect(inc, [inc])
    return (
      <div>
        <div>count: {count}</div>
        <div>computedCount: {computedCount}</div>
      </div>
    )
  }

  const { findByText } = render(<Counter />)

  await findByText('count: 1')
  await findByText('computedCount: 11')
})

it('computed state updates when state updated via API', async () => {
  const useStore = create<Store & ComputedStore>(
    computed<Store, ComputedStore>(
      (set) => ({
        count: 0,
        inc: () => set((state) => ({ count: state.count + 1 })),
      }),
      (state) => {
        return {
          computedCount: state.count + 10,
        }
      }
    )
  )
  useStore.setState({ count: 1 })

  function Counter() {
    const { count, computedCount } = useStore()

    return (
      <div>
        <div>count: {count}</div>
        <div>computedCount: {computedCount}</div>
      </div>
    )
  }

  const { findByText } = render(<Counter />)

  await findByText('count: 1')
  await findByText('computedCount: 11')
})

it('computed state updates when object shorthand', async () => {
  const useStore = create<Store & ComputedStore>(
    computed<Store, ComputedStore>(
      (set) => ({
        count: 0,
        inc: () => set({ count: 1 }),
      }),
      (state) => {
        return {
          computedCount: state.count + 10,
        }
      }
    )
  )

  function Counter() {
    const { count, computedCount, inc } = useStore()
    React.useEffect(inc, [inc])
    return (
      <div>
        <div>count: {count}</div>
        <div>computedCount: {computedCount}</div>
      </div>
    )
  }

  const { findByText } = render(<Counter />)

  await findByText('count: 1')
  await findByText('computedCount: 11')
})

it('computed state when composed with devtools middleware', async () => {
  const useStore = create(
    devtools<Store & ComputedStore>(
      computed<Store, ComputedStore>(
        (set) => ({
          count: 0,
          inc: () => set((state) => ({ count: state.count + 1 })),
        }),
        (state) => {
          return {
            computedCount: state.count + 10,
          }
        }
      )
    )
  )

  function Counter() {
    const { count, computedCount, inc } = useStore()
    React.useEffect(inc, [inc])
    return (
      <div>
        <div>count: {count}</div>
        <div>computedCount: {computedCount}</div>
      </div>
    )
  }

  const { findByText } = render(<Counter />)

  await findByText('count: 1')
  await findByText('computedCount: 11')
})

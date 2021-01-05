import {
  GetState,
  SetState,
  State,
  StateCreator,
  StoreApi,
} from 'zustand/index'

export declare type ComputedState<S extends State> = (state: S) => State

export const computed = <S extends State, C extends State>(
  create: StateCreator<S>,
  compute: (state: S) => C
) => (set: SetState<S>, get: GetState<S>, api: StoreApi<S>): S & C => {
  const setWithComputed: SetState<S> = (update, replace) => {
    set((state) => {
      const updated = typeof update === 'object' ? update : update(state)
      const computedState = compute({ ...state, ...updated })
      return { ...updated, ...computedState }
    }, replace)
  }
  api.setState = setWithComputed
  const state = create(setWithComputed, get, api)
  return { ...state, ...compute(state) }
}

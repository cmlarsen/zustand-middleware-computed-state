import {
  StateCreator,
  StoreApi,
} from 'zustand';

export declare type ComputedState<S> = (state: S) => S

export const computed =
  <S, C>(create: StateCreator<S>, compute: (state: S) => C) =>
    (set: StoreApi<S>['setState'], get: StoreApi<S>['getState'], api: StoreApi<S>): S & C => {
      const setWithComputed: StoreApi<S>['setState'] = (update, replace) => {
        set((state) => {
          const updated = typeof update === 'function' ? (update as (state: S) => Partial<S> | S)(state) : update;
          const computedState = compute({ ...state, ...updated } as S);
          return { ...updated, ...computedState };
        }, replace);
      };
      api.setState = setWithComputed;
      const state = create(setWithComputed, get, api);
      return { ...state, ...compute(state) };
    };

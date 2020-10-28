import {createContext, useContextSelector} from "use-context-selector";
import React, {Dispatch, useMemo, useReducer} from "react";
import { createSlice } from "@reduxjs/toolkit";

export const createLocalSlice = <T extends any>(initialState: T, reducers: any) => {
  const {reducer, actions} = createSlice({
    name: "local-slice",
    initialState,
    reducers,
  });

  const Context = createContext(
    (null as unknown) as { state: T; dispatch: Dispatch<any> }
  );

  const useDispatch = () =>
    useContextSelector(Context, (state) => state.dispatch);

  const useSelector = (selector: (state: T) => unknown) =>
    useContextSelector(Context, (state) => selector(state.state));

  const useSlice = (innerInitialState?: T) => {
    const [state, dispatch] = useReducer(
      reducer,
      innerInitialState || initialState
    );
    const Provider = useMemo(
      () => (props: any) => (
        <Context.Provider value={{state, dispatch}} {...props} />
      ),
      [state]
    );

    return {
      Provider,
      state,
      dispatch,
    };
  };

  return {
    actions,
    useDispatch,
    useSelector,
    useSlice,
  };
};
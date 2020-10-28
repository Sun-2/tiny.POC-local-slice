import React, {
  Dispatch,
  memo,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createContext, useContextSelector } from "use-context-selector";

const reducers = {
  increase: (state: any, action: PayloadAction) => {
    state.counter += 1;
  },
};

const createLocalSlice = <T extends any>(initialState: T, reducers: any) => {
  const { reducer, actions } = createSlice({
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
        <Context.Provider value={{ state, dispatch }} {...props} />
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

const { actions, useDispatch, useSelector, useSlice } = createLocalSlice(
  { counter: 0, redundant: 0 },
  {
    increase: (state, action) => {
      state.counter += 1;
    },
  }
);

const Compo = (props) => {
  const dispatch = useDispatch();
  const onClick = () => {
    // @ts-ignore
    dispatch(actions.increase());
  };
  return <button onClick={onClick}>Increase</button>;
};

const Value = () => {
  const value = useSelector((state) => state.counter);
  return <p>Value is: {value}</p>;
};

const Redundant = memo(() => {
  const value = useSelector((state) => state.redundant);
  console.log("REDUNTANT RENDER");

  return <p>Hi, I'm here. Rerenders: {value}</p>;
});

function App() {
  const { Provider, state } = useSlice();
  return (
    <>
      <Provider>
        <p>Hello! Counter is {state.counter}</p>
        <Compo />
        <Value />
        <Redundant />
      </Provider>
    </>
  );
}

export default App;

import React, { memo } from "react";
import { createLocalSlice } from "./createLocalSlice";

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
  console.log("REDUNDANT RENDER");

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

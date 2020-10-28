import React, {
  createContext,
  Dispatch, useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  counter: 0,
};
const slice = createSlice({
  name: "main",
  initialState,
  reducers: {
    increase: (state, action: PayloadAction) => {
      state.counter += 1;
    },
  },
});


const Ctx = createContext(null as any);

const Compo = (props: { dispatch: Dispatch<AnyAction> }) => {
  const dispatch = useContext(Ctx).dispatch;
  const onClick = () => {
    dispatch(slice.actions.increase());
  };
  return <button onClick={onClick}>Increase</button>;
};



function App() {
  const [token, setToken] = useState("");
  const [state, dispatch] = useReducer(slice.reducer, initialState);
  const ctxValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );

  /*useEffect(() => {
    (async () => {
      grecaptcha.ready(async () => {
        const token = await grecaptcha.execute(
          "6LfRbtwZAAAAAN1ai_N03a4bGB6NN2iK5ZeGciHE",
          {
            action: "submit",
          }
        );
        setToken("loading...");
        const resp = await fetch("http://localhost:3001/recaptcha-validate", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            token,
          }),
        });
        const json = await resp.json();
        setToken(JSON.stringify(json));
      });
    })();
  }, []);*/
  return (
    <>
      <Ctx.Provider value={ctxValue}>
        <p>Hello! Counter is {state.counter}</p>
        <Compo dispatch={dispatch} />
      </Ctx.Provider>
    </>
  );
}

export default App;

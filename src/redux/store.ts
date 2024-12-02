import { configureStore } from "@reduxjs/toolkit";
import { rootReducer, walletReducer } from "./reducer";

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

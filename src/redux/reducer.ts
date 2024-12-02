import { combineReducers } from "redux";
import { SET_WALLET } from "./actions";
import { BrowserWallet } from "@meshsdk/core";
import { initialStates, WalletAction } from "@/types/types";
import { stat } from "fs";

const initialState: initialStates = {
  wallet: undefined,
};

export const walletReducer = (state = initialState, action: WalletAction) => {
  switch (action.type) {
    case SET_WALLET:
      return {
        ...state,
        wallet: action.payload,
      };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  wallet: walletReducer,
});

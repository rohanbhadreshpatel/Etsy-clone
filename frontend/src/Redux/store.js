import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartRedux";
import purchaseReducer from "./purchaseRedux";

export default configureStore({
  reducer: {
    cart: cartReducer,
    // purchase: purchaseReducer,
  },
});

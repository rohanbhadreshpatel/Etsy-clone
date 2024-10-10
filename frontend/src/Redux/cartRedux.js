import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      const qty = action.payload.quantity;
      const prodDet = action.payload.itemDetails;
      prodDet.quantity = qty;
      state.products.push(prodDet);
      state.total = state.total + action.payload.price;
    },
  },
});

export const { addProduct } = cartSlice.actions;
export default cartSlice.reducer;

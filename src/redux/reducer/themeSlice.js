import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    color: { hover: "#dc2626", main: "#b91c1c", active: "#991b1b" }, // red
  },
  reducers: {
    changeColor: (state, action) => {
      state.color = action.payload;
    },
  },
});

export const { changeColor } = themeSlice.actions;
export default themeSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  personnels: {},
};

const fetchPersonnelsSlice = createSlice({
  name: "personnels",
  initialState,
  reducers: {
    fetchPersonnels: (state, action) => {
      state.personnels = action.payload;
    },
  },
});

export const { fetchPersonnels } = fetchPersonnelsSlice.actions;
export default fetchPersonnelsSlice.reducer;

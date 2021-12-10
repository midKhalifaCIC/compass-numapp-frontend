import { createSlice } from "@reduxjs/toolkit";

const AboutSlice = createSlice({
  name: "about",
  initialState: {
    showModal: false,
    modalLink: {},
  },
  reducers: {
    showModal: (state, action) => ({
      ...state,
      showModal: true,
      modalLink: action.payload,
    }),
    hideModal: (state) => ({ ...state, showModal: false }),
  },
});

export default AboutSlice.reducer;
export const { showModal, hideModal } = AboutSlice.actions;

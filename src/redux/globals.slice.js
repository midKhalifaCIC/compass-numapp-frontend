import { createSlice } from "@reduxjs/toolkit";
import { updateUser } from "./user.slice";
import { fetchQuestionnaire } from "./questionnaire.slice";
import { sendQuestionnaireResponse } from "./sharedActions";

const GlobalsSlice = createSlice({
  name: "globals",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(updateUser.fulfilled, () => ({
        loading: false,
        error: null,
      }))
      .addCase(updateUser.rejected, (_state, action) => ({
        loading: false,
        error: action.payload.error,
      }))
      .addCase(fetchQuestionnaire.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(fetchQuestionnaire.fulfilled, (state) => ({
        ...state,
        loading: false,
      }))
      .addCase(fetchQuestionnaire.rejected, (_state, action) => ({
        loading: false,
        error: action.payload.error,
      }))
      .addCase(sendQuestionnaireResponse.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(sendQuestionnaireResponse.fulfilled, (state) => ({
        ...state,
        loading: false,
      }))
      .addCase(sendQuestionnaireResponse.rejected, (_state, action) => ({
        loading: false,
        error: action.payload.error,
      }))
      .addDefaultCase((state) => ({ ...state }));
  },
});

export default GlobalsSlice.reducer;

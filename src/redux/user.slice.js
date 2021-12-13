import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import localStorage from "../services/localStorage/localStorage";
import loggedInClient from "../services/rest/loggedInClient";
import { deleteAll, sendQuestionnaireResponse } from "./sharedActions";

const updateUser = createAsyncThunk("user/UPDATE", async (user, thunkApi) => {
  // if no subjectId was passed, read it from the store
  // eslint-disable-next-line no-param-reassign
  const subjectId = user?.subjectId ?? thunkApi.getState().User.subjectId;
  try {
    const userData = await loggedInClient.getUserUpdate(subjectId);
    return thunkApi.fulfillWithValue(userData.data);
  } catch (err) {
    return thunkApi.rejectWithValue({
      error: {
        code: err.response?.status ?? "NETWORK_ERROR",
        message: err?.message,
        failedAction: "user/UPDATE",
      },
    });
  }
});

const logout = createAsyncThunk("user/LOGOUT", async () => {
  await localStorage.removeLastSubjectId();
});

const initialState = {
  subjectId: null,
  recipient_certificate_pem_string: null,
  accessToken: null,
  current_questionnaire_id: null,
  status: null,
  firstTime: true,
  additional_iterations_left: null,
  current_instance_id: null,
  current_interval: null,
  general_study_end_date: null,
  personal_study_end_date: null,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) =>
    builder
      .addCase(updateUser.fulfilled, (state, action) => ({
        ...state,
        ...action.payload,
      }))
      .addCase("persist/REHYDRATE", (state, action) => ({
        ...state,
        ...action.payload?.User,
      }))
      .addCase(deleteAll, () => ({ ...initialState }))
      .addCase(sendQuestionnaireResponse.fulfilled, (state, action) => ({
        ...state,
        newState: action.payload,
      }))
      .addDefaultCase((state) => ({ ...state })),
});

export default UserSlice.reducer;
export { updateUser, logout };

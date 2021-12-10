/* eslint-disable camelcase */
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import loggedInClient from "../services/rest/loggedInClient";

/**
 * shared actions used by multiple slices of the state
 */
// eslint-disable-next-line import/prefer-default-export
export const setAnswer = createAction("shared/SET_ANSWER");
export const deleteAll = createAction("shared/DELETE_ALL");

export const sendQuestionnaireResponse = createAsyncThunk(
  "shared/SEND_QUESTIONNAIRE_RESPONSE",
  async ({ body, triggerMap }, thunkApi) => {
    const {
      User: { subjectId, current_questionnaire_id, current_instance_id },
    } = thunkApi.getState();
    try {
      const response = await loggedInClient.sendQuestionnaire(
        body,
        triggerMap,
        subjectId,
        current_questionnaire_id,
        current_instance_id
      );

      return thunkApi.fulfillWithValue(response.data);
    } catch (err) {
      return thunkApi.rejectWithValue({
        error: {
          status: err.response?.status ?? "NETWORK_ERROR",
          message: err.message,
          failedAction: "shared/SEND_QUESTIONNAIRE_RESPONSE",
        },
      });
    }
  }
);

import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import localStorage from "../services/localStorage/localStorage";
import loggedInClient from "../services/rest/loggedInClient";
import {
  setAnswer,
  deleteAll,
  sendQuestionnaireResponse,
} from "./sharedActions";

/**
 * action which fetches the questionnaire from the backend
 */
const fetchQuestionnaire = createAsyncThunk(
  "questionnaire/FETCH",
  async ({ questionnaireID, subjectId, startDate, dueDate }) => {
    const response = await loggedInClient.getBaseQuestionnaire(
      questionnaireID,
      `Bearer: ${subjectId}`
    );
    const metadata = { ...response.data };
    delete metadata.item;
    return {
      questionnaire: response.data,
      FHIR: metadata,
      subjectId,
      startDate,
      dueDate,
    };
  }
);

const initialState = {
  itemMap: null,
  categories: null,
  FHIR: null,
  started: false,
  done: false,
  startDate: null,
  dueDate: null,
};

const QuestionnaireSlice = createSlice({
  name: "questionnaire",
  initialState,
  reducers: {
    DELETE_LOCAL_QUESTIONNAIRE: () => ({ ...initialState }),
    SET_ITEM_STATUS: (state, action) => {
      const { itemMap } = current(state);
      return {
        ...state,
        itemMap: {
          ...itemMap,
          [action.payload.linkId]: {
            ...itemMap[action.payload.linkId],
            done: action.payload.done,
          },
        },
      };
    },
    SET_QUESTIONNAIRE_STATUS: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(setAnswer, (state, action) => {
        const { itemMap } = current(state);
        let { answer } = action.payload;
        const { linkId, isAdditionalAnswer } = action.payload;
        // null empty string
        if (typeof answer === "string" && !answer) answer = null;
        if (!isAdditionalAnswer) {
          return {
            ...state,
            started: true,
            itemMap: {
              ...itemMap,
              // set the answer at index "linkId" of the itemMap
              [linkId]: { ...itemMap[linkId], done: true, answer },
              // mark the category as started
              [linkId.split(".")[0]]: {
                ...itemMap[linkId.split(".")[0]],
                started: true,
              },
            },
          };
        }
        localStorage.persistQuestionnaireItemMap(state.itemMap);
        return { ...state };
      })
      .addCase(
        fetchQuestionnaire.fulfilled,
        (
          state,
          { payload: { questionnaire, subjectId, FHIR, startDate, dueDate } }
        ) => ({
          ...state,
          categories: questionnaire.item,
          itemMap: generateQuestionnaireItemMap(questionnaire, subjectId),
          FHIR,
          startDate,
          dueDate,
        })
      )
      .addCase(REHYDRATE, (state, action) => ({
        ...state,
        ...action.payload?.Questionnaire,
      }))
      // reset when response was sent successfully
      .addCase(sendQuestionnaireResponse.fulfilled, () => ({
        ...initialState,
      }))
      .addCase(deleteAll, () => ({ ...initialState }))
      .addDefaultCase((state) => ({ ...state }));
  },
});

/**
 * creates an entry in the questionnaireItemMap and then iterates through
 * its sub items to do the same
 * @param  {any} item questionnaireItem
 */
const traverseItem = (item, questionnaireItemMap) => {
  // generates the item
  // eslint-disable-next-line no-param-reassign
  questionnaireItemMap[item.linkId] = {
    ...item,
    done: false,
    answer: null,
    type: item.type || "ignore",
    required: item.required || false,
  };

  // adds another answer object in case  we have an open-choice
  if (
    item.type === "open-choice" &&
    !questionnaireItemMap[item.linkId].answerOption.some(
      (e) => e.isOpenQuestionAnswer
    )
  ) {
    questionnaireItemMap[item.linkId].answerOption.push({
      isOpenQuestionAnswer: true,
      answer: null,
    });
  }

  // sets the started value to false if the item is category
  if (item.linkId.length === 1) {
    // eslint-disable-next-line no-param-reassign
    questionnaireItemMap[item.linkId].started = false;
  }
  // traverses the subitems
  if (item.item) {
    item.item.forEach((subItem) => traverseItem(subItem, questionnaireItemMap));
  }
};

/**
 * generates the questionnaireItemMap
 * @param  {any} questionnaire a FHIR questionnaire
 * @param  {any} subjectId subjectId of the user
 */
const generateQuestionnaireItemMap = (questionnaire, subjectId) => {
  const questionnaireItemMap = {};

  // triggers the item-generation
  if (questionnaire.item) {
    questionnaire.item.forEach((subItem) =>
      traverseItem(subItem, questionnaireItemMap)
    );
  }

  // persists the last known questionnaireId in the LocalStorage
  setTimeout(async () => {
    localStorage.persistLastQuestionnaireId(
      questionnaireItemMap.constructedId,
      subjectId
    );
  }, 0);

  return questionnaireItemMap;
};

export default QuestionnaireSlice.reducer;
export { fetchQuestionnaire };

export const {
  SET_ITEM_STATUS: setItemStatus,
  SET_QUESTIONNAIRE_STATUS: setQuestionnaireStatus,
  DELETE_LOCAL_QUESTIONNAIRE: deleteQuestionnaire,
} = QuestionnaireSlice.actions;

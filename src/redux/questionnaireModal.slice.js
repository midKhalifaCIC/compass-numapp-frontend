import { createSlice } from "@reduxjs/toolkit";

const QuestionnaireModalSlice = createSlice({
  name: "questionnaireModal",
  initialState: {
    showModal: false,
    showDatePicker: false,
    currentPageIndex: null,
    currentCategoryIndex: null,
  },
  reducers: {
    // open the questionnaire modal and show the given category
    SHOW_MODAL: (state, action) => ({
      ...state,
      showModal: true,
      currentPageIndex: 1,
      currentCategoryIndex: action.payload,
    }),
    HIDE_MODAL: (state) => ({
      ...state,
      showModal: false,
    }),
    SHOW_DATE_PICKER: (state) => ({
      ...state,
      showDatePicker: true,
    }),
    HIDE_DATE_PICKER: (state) => ({
      ...state,
      showDatePicker: false,
    }),
    SWITCH_CONTENT: (state, action) => {
      const {
        payload: { forward, numberOfPages },
      } = action;
      if (forward) {
        if (numberOfPages && numberOfPages === state.currentPageIndex) {
          return { ...state, showModal: false };
        }
        return { ...state, currentPageIndex: state.currentPageIndex + 1 };
      }
      return {
        ...state,
        currentPageIndex:
          state.currentPageIndex === 1 ? 1 : state.currentPageIndex - 1,
      };
    },
  },
  extraReducers: (builder) => builder.addDefaultCase((state) => ({ ...state })),
});

export default QuestionnaireModalSlice.reducer;
export const {
  SHOW_MODAL: showModal,
  HIDE_MODAL: hideModal,
  SHOW_DATE_PICKER: showDatePicker,
  HIDE_DATE_PICKER: hideDatePicker,
  SWITCH_CONTENT: switchContent,
} = QuestionnaireModalSlice.actions;

/* eslint-disable no-param-reassign */

// (C) Copyright IBM Deutschland GmbH 2021.  All rights reserved.

/***********************************************************************************************
imports
***********************************************************************************************/

// redux
/*-----------------------------------------------------------------------------------*/

import { composeWithDevTools } from "redux-devtools-extension";
import EncryptedStorage from "react-native-encrypted-storage";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

import { persistStore, persistReducer } from "redux-persist";

// reducers
/*-----------------------------------------------------------------------------------*/

import LoginReducer from "../screens/login/loginReducer";
import AboutReducer from "./about.slice";
import UserReducer from "./user.slice";
import GlobalsReducer from "./globals.slice";
import QuestionnaireReducer from "./questionnaire.slice";
import QuestionnaireModalReducer from "./questionnaireModal.slice";

// services
/*-----------------------------------------------------------------------------------*/

import localStorage from "../services/localStorage/localStorage";

/***********************************************************************************************
reducer
***********************************************************************************************/

const persistConfig = {
  key: "root",
  storage: EncryptedStorage,
  whitelist: ["User", "Questionnaire"],
};

const appReducer = combineReducers({
  Login: LoginReducer,
  About: AboutReducer,
  User: UserReducer,
  Globals: GlobalsReducer,
  Questionnaire: QuestionnaireReducer,
  QuestionnaireModal: QuestionnaireModalReducer,
});

const rootReducer = (state, action) => {
  // global actions that need to be available anywhere,
  // will be filtered out and executed by the rootReducer
  // (before the actual reducer is)

  if (action.type === "USER_LOGOUT") {
    state = undefined;
    localStorage.removeLastSubjectId();
  }

  if (action.type === "DELETE_ALL_LOCAL_DATA") {
    localStorage.clearAll();
  }

  if (action.type === "DELETE_LOCAL_QUESTIONNAIRE") {
    state.CheckIn.currentCategoryIndex = null;
    state.CheckIn.questionnaireItemMap = null;
    state.CheckIn.categories = null;
    state.CheckIn.categoriesLoaded = false;
    state.CheckIn.currentPageIndex = 1;

    const { subjectId } = state.CheckIn.user;
    localStorage.removeLastQuestionnaireId(subjectId);
    localStorage.removeCategories(subjectId);
    localStorage.removeQuestionnaireItemMap(subjectId);
  }
  return appReducer(state, action);
};

/***********************************************************************************************
middleware
***********************************************************************************************/

const middleware = [];
middleware.push(thunk);

// if (__DEV__ && process.env.NODE_ENV !== "test")
//   middleware.push(createLogger({ collapsed: true }));

const persistedReducer = persistReducer(persistConfig, rootReducer);

/***********************************************************************************************
export
***********************************************************************************************/

export const reduxStore = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);
export const persistor = persistStore(reduxStore);

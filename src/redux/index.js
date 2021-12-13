import store from "./store";
import * as userActions from "./user.slice";
import * as questionnaireActions from "./questionnaire.slice";
import * as questionnaireModalActions from "./questionnaireModal.slice";
import * as sharedActions from "./sharedActions";

export default store;
export {
  userActions,
  questionnaireActions,
  questionnaireModalActions,
  sharedActions,
};

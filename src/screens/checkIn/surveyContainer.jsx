/* eslint-disable camelcase */
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import SurveyScreen from "./surveyScreen";
import {
  userActions,
  sharedActions,
  questionnaireActions,
  questionnaireModalActions,
} from "../../redux";
import {
  UserProps,
  GlobalsProps,
  NavigationProps,
  QuestionnaireProps,
  QuestionnaireModalProps,
} from "../../prop-types";

class SurveyContainer extends Component {
  componentDidMount() {
    const {
      actions,
      questionnaire: { itemMap, categories },
      user: { subjectId, due_date, start_date, current_questionnaire_id },
    } = this.props;
    // fetch questionnaire from backend if not present in state
    if (!itemMap && !categories) {
      actions.fetchQuestionnaire({
        questionnaireID: current_questionnaire_id,
        subjectId,
        dueDate: due_date,
        startDate: start_date,
      });
    }
  }

  render() {
    const { actions, navigation, globals, questionnaire, questionnaireModal } =
      this.props;
    return (
      <SurveyScreen
        navigation={navigation}
        globals={globals}
        actions={actions}
        questionnaire={questionnaire}
        questionnaireModal={questionnaireModal}
        exportAndUploadQuestionnaireResponse={
          this.exportAndUploadQuestionnaireResponse
        }
      />
    );
  }
}

SurveyContainer.propTypes = {
  user: UserProps.isRequired,
  globals: GlobalsProps.isRequired,
  navigation: NavigationProps.isRequired,
  questionnaire: QuestionnaireProps.isRequired,
  questionnaireModal: QuestionnaireModalProps.isRequired,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
};

/***********************************************************************************************
redux
***********************************************************************************************/

const mapStateToProps = (state) => ({
  user: state.User,
  globals: state.Globals,
  questionnaire: state.Questionnaire,
  questionnaireModal: state.QuestionnaireModal,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...userActions,
      ...sharedActions,
      ...questionnaireActions,
      ...questionnaireModalActions,
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyContainer);

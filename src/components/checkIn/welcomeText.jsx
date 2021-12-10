// (C) Copyright IBM Deutschland GmbH 2021.  All rights reserved.

/***********************************************************************************************
imports
***********************************************************************************************/

import React, { PureComponent } from "react";
import { Text, View, StyleSheet } from "react-native";
import PropTypes from "prop-types";

import config from "../../config/configProvider";
import { formatDateString } from "../../services/utils";

let localStyle;

/***********************************************************************************************
component
***********************************************************************************************/

class WelcomeText extends PureComponent {
  /**
	* renders a welcome text composed of multiple strings (originating from 'src/config/textConfig.js)
	* and a formatted Date-string (representing the due date of the current questionnaire or the 
	* start date of the next one)
	* @constructor
	* @param  {object}      props
	* @param  {object}      props.user holds the userdata
	* @param  {object}      props.questionnaireError the return object should the sendQuestionnaire 
		function produce an error
	* @param  {boolean}     props.error401 true if the user was rejected by the backend
	* @param  {boolean}     props.noNewQuestionnaireAvailableYet true if there is currently no 
		questionnaire available
	*/

  // rendering
  /*-----------------------------------------------------------------------------------*/

  render() {
    const {
      error,
      noNewQuestionnaireAvailableYet,
      firstTime,
      status,
      dueDate,
      startDate,
    } = this.props;
    return (
      <View style={localStyle.wrapper}>
        {/* if there is no authentication error, no sending error and the participant ist still part of the study */}
        {status !== "off-study" && (
          <View>
            {/* title text: depends on the params 'firstTime' & 'noNewQuestionnaireAvailableYet'*/}
            <Text style={localStyle.welcomeText}>
              {(() => {
                if (firstTime) return config.text.survey.welcomeTitleFirstTime;
                if (noNewQuestionnaireAvailableYet)
                  return config.text.survey.noNewQuestionnaireAvailableYet;
                return config.text.survey.welcomeTitle;
              })()}
            </Text>

            {/* if this is a new user */}
            {firstTime && (
              <Text style={localStyle.infoText}>
                {config.text.survey.welcomeTextFirstTimeUser1}
                <Text style={{ ...localStyle.timeTextSmall }}>
                  {formatDateString(dueDate, true)}.
                </Text>
                {config.text.survey.welcomeTextFirstTimeUser2}
              </Text>
            )}

            {/* if this is not a first-time-user and NO new questionnaire is currently available */}
            {!firstTime && noNewQuestionnaireAvailableYet && (
              <Text style={localStyle.infoText}>
                {config.text.survey.noNewQuestionnaireAvailableYet}
              </Text>
            )}

            {/* if this is not a first-time-user and A questionnaire is currently available */}
            {!firstTime && !noNewQuestionnaireAvailableYet && (
              <View>
                <Text style={localStyle.infoText}>
                  {config.text.survey.welcomeTextUser}
                </Text>
                <Text style={{ ...localStyle.timeText }}>
                  {formatDateString(dueDate, true)}.
                </Text>
              </View>
            )}

            {/* if this is not a first-time-user and NO new questionnaire is currently available */}
            {!firstTime && noNewQuestionnaireAvailableYet && (
              <View>
                <Text style={localStyle.timeText}>
                  {config.text.survey.nextOne}
                </Text>
                <Text
                  style={{
                    ...localStyle.timeText,
                    ...localStyle.timeTextGreen,
                  }}
                >
                  {formatDateString(startDate, true)}.
                </Text>
              </View>
            )}

            {/* if this is a first-time-user and A questionnaire is currently available */}
            {firstTime && noNewQuestionnaireAvailableYet && (
              <View>
                <Text style={localStyle.timeText}>
                  {config.text.survey.nextOneNew}
                </Text>
                <Text
                  style={{
                    ...localStyle.timeText,
                    ...localStyle.timeTextGreen,
                  }}
                >
                  {formatDateString(startDate, true)}.
                </Text>
              </View>
            )}

            <Text style={localStyle.infoText}>
              {config.text.survey.furtherInfo}
            </Text>
          </View>
        )}

        {status === "off-study" && (
          <View>
            <Text style={localStyle.welcomeText}>
              {config.text.survey.endedStudyTitle}
            </Text>

            <Text style={localStyle.infoText}>
              {config.text.survey.endedStudyText}
            </Text>
          </View>
        )}

        {/* if the user update came back with an authentication error */}
        {error && error.failedAction === "user/UPDATE" && (
          <View>
            <Text
              style={{
                ...localStyle.welcomeText,
                ...localStyle.welcomeTextRed,
              }}
            >
              {config.text.survey.noUserTitle}
            </Text>

            <Text style={localStyle.infoText}>
              {config.text.survey.noUserText}
            </Text>
          </View>
        )}

        {/* if there occurred an error while transmitting a questionnaire */}
        {error && error.failedAction === "questionnaire/FETCH" && (
          <View>
            <Text
              style={{
                ...localStyle.welcomeText,
                ...localStyle.welcomeTextRed,
              }}
            >
              {config.text.survey.noQuestionnaireTitle}
            </Text>

            <Text style={localStyle.infoText}>
              {config.text.survey.noQuestionnaireText}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

WelcomeText.propTypes = {
  firstTime: PropTypes.bool.isRequired,
  status: PropTypes.oneOf(["on-study", "off-study", null]),
  startDate: PropTypes.string,
  dueDate: PropTypes.string,
  noNewQuestionnaireAvailableYet: PropTypes.bool.isRequired,
};

WelcomeText.defaultProps = {
  dueDate: null,
  startDate: null,
  status: null,
};

/***********************************************************************************************
local styling
***********************************************************************************************/

localStyle = StyleSheet.create({
  wrapper: {
    marginLeft: config.appConfig.scaleUiFkt(30),
    marginRight: config.appConfig.scaleUiFkt(30),
    marginBottom: config.appConfig.scaleUiFkt(25),
  },

  welcomeText: {
    ...config.theme.fonts.title,
    textAlign: "center",
    alignSelf: "center",
    color: config.theme.values.defaultTitleTextColor,
  },

  welcomeTextRed: {
    color: config.theme.colors.alert,
  },

  infoText: {
    marginTop: config.appConfig.scaleUiFkt(20),
    textAlign: "center",
    color: config.theme.values.defaultParagraphTextColor,
    alignSelf: "center",
    ...config.theme.fonts.body,
  },

  timeText: {
    marginTop: config.appConfig.scaleUiFkt(20),
    textAlign: "center",
    color: config.theme.colors.accent4,
    alignSelf: "center",
    ...config.theme.fonts.bold,
  },

  timeTextSmall: {
    ...config.theme.fonts.label,
  },

  timeTextGreen: {
    color: config.theme.values.defaultTimeSuccessColor,
  },
});

/***********************************************************************************************
export
***********************************************************************************************/

export default WelcomeText;

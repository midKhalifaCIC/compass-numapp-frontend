/* eslint-disable camelcase */
// (C) Copyright IBM Deutschland GmbH 2021.  All rights reserved.

/***********************************************************************************************
imports
***********************************************************************************************/

import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { StyleSheet, View, Text } from "react-native";
import Banner from "../../components/banner/banner";
import CheckInListView from "../../components/checkIn/checkInListView";
import CheckInTiles from "../../components/checkIn/checkInTiles";
import CheckInWelcomeText from "../../components/checkIn/welcomeText";
import ScrollIndicatorWrapper from "../../components/scrollIndicatorWrapper/scrollIndicatorWrapper";
import Spinner from "../../components/spinner/spinner";
import config from "../../config/configProvider";
import {
  GlobalsProps,
  NavigationProps,
  QuestionnaireProps,
  UserProps,
} from "../../prop-types";

let localStyle;

/***********************************************************************************************
component:
renders the checkIn-screen
***********************************************************************************************/

class CheckInScreen extends PureComponent {
  /**
   * @param  {object}   props
   * @param  {boolean}  props.loading if true, shows the loading screen
   * @param  {boolean}  props.error401 is true if there is a 401 error
   * @param  {object}   props.navigation the navigation object provided by 'react-navigation'
   * @param  {Function} props.updateUser function to update the user
   * @param  {boolean}  props.categoriesLoaded is set to true as soon as the questionnaire was completely loaded
   * @param  {object}   props.questionnaireError holds the las error object
   * @param  {Function} props.deleteLocalDataAndLogout deletes the local data and logs the user out
   */
  // rendering
  /*-----------------------------------------------------------------------------------*/

  render() {
    const {
      navigation,
      globals: { loading, error },
      updateUser,
      user: {
        firstTime,
        status,
        additional_iterations_left,
        start_date,
        due_date,
      },
      sendReport,
      exportAndUploadQuestionnaireResponse,
      deleteLocalDataAndLogout,
      questionnaire,
    } = this.props;
    const noNewQuestionnaireAvailableYet = new Date() < new Date(start_date);
    const categoriesLoaded =
      questionnaire.categories && questionnaire.categories.length > 0;
    return (
      <View style={localStyle.wrapper}>
        {/* loading spinner */}
        <Spinner visible={loading} testID="checkInSpinner" />

        {/* banner at the top */}
        <Banner
          nav={navigation}
          title={config.text.survey.titleCheckIn}
          subTitle={config.text.survey.subTitleCheckIn}
          updateUser={updateUser}
          isCheckIn
          noWayBack
          noRefresh={status === "off-study"}
          categoriesLoaded={categoriesLoaded}
        />

        {/*  center content */}
        <View style={{ ...localStyle.flexi, ...localStyle.wrapper }}>
          <ScrollIndicatorWrapper
            contentData={
              <View>
                {/* if there is a questionnaire and no 401-error */}
                {!error ? (
                  <View
                    style={{ ...localStyle.wrapper, ...localStyle.firstItem }}
                  >
                    {/* renders the listview item representing the questionnaire */}
                    <CheckInListView
                      status={status}
                      questionnaireStatus={questionnaire.status}
                      firstTime={firstTime}
                      navigation={navigation}
                      categoriesLoaded={categoriesLoaded}
                      dueDate={due_date}
                      noNewQuestionnaireAvailableYet={
                        noNewQuestionnaireAvailableYet
                      }
                      done={questionnaire.done}
                      started={questionnaire.started}
                    />
                    {/* welcome text with due-date information */}
                    <CheckInWelcomeText
                      error={error}
                      status={status}
                      noNewQuestionnaireAvailableYet={
                        noNewQuestionnaireAvailableYet
                      }
                      firstTime={firstTime}
                      dueDate={due_date}
                      startDate={start_date}
                      categoriesLoaded={categoriesLoaded}
                    />
                    {/* renders the button at the bottom */}
                    <CheckInTiles
                      iterationsLeft={additional_iterations_left}
                      loading={loading}
                      categoriesLoaded={categoriesLoaded}
                      sendReport={sendReport}
                      questionnaire={questionnaire}
                      deleteLocalDataAndLogout={deleteLocalDataAndLogout}
                      exportAndUploadQuestionnaireResponse={
                        exportAndUploadQuestionnaireResponse
                      }
                    />
                  </View>
                ) : (
                  <View
                    style={[
                      localStyle.wrapper,
                      localStyle.flexi,
                      localStyle.firstItem,
                    ]}
                  >
                    <Text style={localStyle.errorTitle}>
                      {config.text.survey.noQuestionnaireTitle}
                    </Text>

                    <Text style={localStyle.errorText}>
                      {config.text.survey.noQuestionnaireText}
                    </Text>
                    {/* <TouchableOpacity>
                      <Text>{config.text.globals.refr}</Text>
                    </TouchableOpacity> */}
                  </View>
                )}
              </View>
            }
          />
        </View>
      </View>
    );
  }
}

CheckInScreen.propTypes = {
  user: UserProps.isRequired,
  globals: GlobalsProps.isRequired,
  updateUser: PropTypes.func.isRequired,
  sendReport: PropTypes.func.isRequired,
  navigation: NavigationProps.isRequired,
  questionnaire: QuestionnaireProps.isRequired,
  deleteLocalDataAndLogout: PropTypes.func.isRequired,
  exportAndUploadQuestionnaireResponse: PropTypes.func.isRequired,
};

/***********************************************************************************************
localStyle
***********************************************************************************************/

localStyle = StyleSheet.create({
  wrapper: {
    height: "100%",
    flexDirection: "column",
    backgroundColor: config.theme.values.defaultBackgroundColor,
  },
  errorTitle: {
    textAlign: "center",
    alignSelf: "center",
    ...config.theme.fonts.title,
    color: config.theme.colors.alert,
  },
  errorText: {
    marginTop: config.appConfig.scaleUiFkt(20),
    textAlign: "center",
    alignSelf: "center",
    color: config.theme.values.defaultTitleTextColor,
  },
  firstItem: {
    marginTop: config.appConfig.scaleUiFkt(30),
  },

  flexi: {
    flex: 1,
  },
});

export default CheckInScreen;

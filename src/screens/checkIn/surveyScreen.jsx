// (C) Copyright IBM Deutschland GmbH 2021.  All rights reserved.

/***********************************************************************************************
imports
***********************************************************************************************/

import PropTypes from "prop-types";
import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ListItem } from "react-native-elements";
import Banner from "../../components/banner/banner";
import QuestionnaireModal from "../../components/modal/questionnaireModal";
import ScrollIndicatorWrapper from "../../components/scrollIndicatorWrapper/scrollIndicatorWrapper";
import Spinner from "../../components/spinner/spinner";
import config from "../../config/configProvider";
import {
  GlobalsProps,
  NavigationProps,
  QuestionnaireModalProps,
  QuestionnaireProps,
} from "../../prop-types";

let localStyle;

/***********************************************************************************************
component:
renders the survey screen
***********************************************************************************************/

class SurveyScreen extends Component {
  /**
   * @param  {object}   props
   * @param  {object}   props.actions holds actions for the component (./checkInActions.js)
   * @param  {object}   props.navigation the navigation object provided by 'react-navigation'
   * @param  {Array}	  props.categories array with an entry for each category
   * @param  {Function} props.exportAndUploadQuestionnaireResponse exports the questionnaire
   * @param  {object}   props.questionnaireItemMap object holding every item from the questionnaire
   */

  /**
   * depending on the state of the given category an accessibility hint is built from the strings defined in the config file
   * @param {*} category
   * @returns a string as accessibility hint
   */
  getAccessibilityHint = (category) => {
    const {
      questionnaire: { itemMap },
    } = this.props;
    let hint = config.text.accessibility.questionnaire.categoryCellHint;
    if (!itemMap[category.linkId].done && itemMap[category.linkId].started) {
      return (hint +=
        config.text.accessibility.questionnaire.category +
        config.text.accessibility.questionnaire.notFinished);
    }
    if (!itemMap[category.linkId].done && itemMap[category.linkId].started) {
      return (hint +=
        config.text.accessibility.questionnaire.category +
        config.text.accessibility.questionnaire.notStarted);
    }
    if (itemMap[category.linkId].done) {
      return (hint +=
        config.text.accessibility.questionnaire.category +
        config.text.accessibility.questionnaire.finished);
    }
    return (hint += "");
  };

  getCategoryChevronProps = (category) => {
    const {
      questionnaire: { itemMap },
    } = this.props;
    const categoryState = itemMap[category.linkId];
    if (categoryState.done) {
      return {
        name: "check",
        color: config.theme.values.defaultSurveyIconCompletedColor,
      };
    }
    if (categoryState.started) {
      return {
        name: "dots-horizontal",
        color: config.theme.values.defaultSurveyIconTouchedColor,
      };
    }
    return {
      name: "pencil-outline",
      color: config.theme.values.defaultSurveyIconUntouchedColor,
    };
  };

  /**
   * renders a list of level-1 questionnaire items (i.e. the main-categories) which - when clicked on - opens the questionnaireModal
   * with the the sub-questions from that category loaded
   */
  createListView = () => {
    const {
      actions,
      questionnaire: { categories },
    } = this.props;
    if (categories)
      return (
        <View style={localStyle.wrapper}>
          {/* maps a listItem onto each category */}
          {categories.map((category, index) => {
            // get additional properties based on the completion state of the category
            const chevronProps = this.getCategoryChevronProps(category);
            return (
              <ListItem
                key={category.linkId}
                containerStyle={localStyle.listItemContainer}
                onPress={() => actions.showModal(index)}
                accessibilityLabel={category.text}
                accessibilityRole={config.text.accessibility.types.button}
                accessibilityHint={this.getAccessibilityHint(category)}
              >
                {/* title */}
                <ListItem.Content>
                  <ListItem.Title style={localStyle.titleStyle}>
                    {category.text}
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron
                  type="material-community"
                  name={chevronProps.name}
                  size={12}
                  reverse
                  color={chevronProps.color}
                />
              </ListItem>
            );
          })}
        </View>
      );
    return <View />;
  };

  // rendering
  /*-----------------------------------------------------------------------------------*/

  render() {
    const {
      globals: { loading },
      actions,
      navigation,
      questionnaire,
      questionnaireModal,
      exportAndUploadQuestionnaireResponse,
    } = this.props;
    return loading || !questionnaire.categories ? (
      <Spinner visible testID="checkInSpinner" />
    ) : (
      <View style={{ ...localStyle.flexi, ...localStyle.wrapper }}>
        {/* render the top banner */}
        <Banner nav={navigation} title={config.text.survey.title} />

        {/* the questionnaire modal */}
        <QuestionnaireModal
          actions={actions}
          questionnaire={questionnaire}
          modalState={questionnaireModal}
        />

        <ScrollIndicatorWrapper
          contentData={
            <View style={{ ...localStyle.flexi, ...localStyle.wrapper }}>
              {/* creates the list items for the categories */}
              {this.createListView()}

              {/* renders a send-button at the bottom if the questionnaire is completed */}
              <View style={localStyle.bottom}>
                {questionnaire.done && (
                  <TouchableOpacity
                    accessibilityLabel={config.text.survey.send}
                    accessibilityRole={config.text.accessibility.types.button}
                    accessibilityHint={
                      config.text.accessibility.questionnaire.sendHint
                    }
                    onPress={() => exportAndUploadQuestionnaireResponse()}
                    style={{
                      ...localStyle.button,
                      ...localStyle.buttonComplete,
                    }}
                  >
                    <Text style={localStyle.buttonLabel}>
                      {config.text.survey.send}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          }
        />
      </View>
    );
  }
}

SurveyScreen.propTypes = {
  globals: GlobalsProps.isRequired,
  questionnaire: QuestionnaireProps.isRequired,
  questionnaireModal: QuestionnaireModalProps.isRequired,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  exportAndUploadQuestionnaireResponse: PropTypes.func,
  navigation: NavigationProps.isRequired,
};

SurveyScreen.defaultProps = {
  exportAndUploadQuestionnaireResponse: () => {},
};

/***********************************************************************************************
localStyle
***********************************************************************************************/

localStyle = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    backgroundColor: config.theme.values.defaultBackgroundColor,
  },

  flexi: {
    flex: 1,
  },

  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 36,
    height: "100%",
    marginTop: 20,
  },

  button: {
    ...config.theme.classes.buttonPrimary,
    bottom: 0,
    marginTop: 10,
    width: "80%",
    textAlign: "center",
  },

  buttonComplete: {
    backgroundColor:
      config.theme.values.defaultSendQuestionnaireButtonBackgroundColor,
  },

  buttonLabel: {
    ...config.theme.classes.buttonLabel,
  },

  listItemContainer: {
    width: "100%",
    borderBottomColor: config.theme.colors.accent3,
    borderBottomWidth: 1,
    backgroundColor: config.theme.values.defaultSurveyItemBackgroundColor,
  },

  titleStyle: {
    ...config.theme.fonts.title2,
    color: config.theme.values.defaultSurveyItemTitleColor,
  },
});

/***********************************************************************************************
export
***********************************************************************************************/

export default SurveyScreen;

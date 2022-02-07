import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Text, View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import localization from '../../../services/localization/localization';
import exportService from '../../../services/questionnaireAnalyzer/questionnaireAnalyzer';
import config from '../../../config/appConfig';
import SharedStyles, {
  calculateIndent,
  calculateFontSize,
  calculateLineHeight,
} from './sharedStyles';

/**
 *
 * @param {object} props
 * @param {QuestionnaireItem} props.item the item to be displayed as choice question
 * @param {Object<Function>} props.actions
 * @param {Object<string, QuestionnaireItem>} props.questionnaireItemMap the item map with all questions
 * @returns A choice element presented as either a dropdown, a list of radio buttons or a li checkboxes
 */
export default function choiceInput({ item, actions, questionnaireItemMap }) {
  // checks the dependencies of the item and renders it (if the dependencies check out)
  return this.getRenderStatusOfItem(item) ? (
    <View>
      {/* title */}
      <Text
        accessibilityLabel={item.text}
        accessibilityHint={
          localization.translate('accessibility').questionnaire.singleChoice
        }
        style={{
          ...SharedStyles.contentTitle,
          marginLeft: calculateIndent(item.linkId),
          fontSize: calculateFontSize(item.linkId),
          lineHeight: calculateLineHeight(item.linkId),
        }}
      >
        {item.text}
      </Text>

      {/* checks if the drop-down extension is available. */}
      {/* if yes, it will render it. */}
      {/* if not, the default way is chosen. */}
      {item.extension &&
      item.extension[0].valueCodeableConcept &&
      item.extension[0].valueCodeableConcept.coding &&
      item.extension[0].valueCodeableConcept.coding[0].code === 'drop-down' ? (
        <View>
          {/* renders the drop-down */}
          <Picker
            selectedValue={questionnaireItemMap[item.linkId].answer}
            onValueChange={(value) => {
              actions.setAnswer({
                linkId: item.linkId,
                answer: value,
              });
            }}
          >
            {item.answerOption.map((answerOption, index) => (
              <Picker.Item
                label={answerOption.valueString}
                value={answerOption.valueString}
                // eslint-disable-next-line react/no-array-index-key
                key={index}
              />
            ))}
          </Picker>
        </View>
      ) : (
        <View>
          {/* repeat: false */}
          {!item.repeats ? (
            <View>
              {/* renders a list of answers */}
              {item.answerOption.map((answerOption, index) => (
                <CheckBox
                  uncheckedIcon="circle-o"
                  checkedIcon="dot-circle-o"
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${item.linkId}.a_${index}`}
                  textStyle={localStyle.choiceText}
                  title={this.getItemTitle(answerOption)}
                  checkedColor={config.theme.colors.primary}
                  uncheckedColor={config.theme.colors.accent1}
                  containerStyle={{
                    ...localStyle.choice,
                    marginLeft: this.calculateIndent(item.linkId),
                  }}
                  onPress={() => {
                    actions.setAnswer({
                      linkId: item.linkId,
                      answer:
                        answerOption.valueCoding ||
                        answerOption.valueString ||
                        answerOption.valueInteger,
                    });
                  }}
                  onIconPress={() => {
                    actions.setAnswer({
                      linkId: item.linkId,
                      answer:
                        answerOption.valueCoding ||
                        answerOption.valueString ||
                        answerOption.valueInteger,
                    });
                  }}
                  checked={
                    exportService.codingEquals(
                      exportService.getCorrectlyFormattedAnswer(
                        questionnaireItemMap[item.linkId],
                      ),
                      answerOption.valueCoding,
                    ) ||
                    exportService.getCorrectlyFormattedAnswer(
                      questionnaireItemMap[item.linkId],
                    ) === answerOption.valueString ||
                    exportService.getCorrectlyFormattedAnswer(
                      questionnaireItemMap[item.linkId],
                    ) === answerOption.valueInteger
                  }
                />
              ))}
            </View>
          ) : (
            /* repeat: true */
            <View>
              {item.answerOption.map((answerOption, index) => (
                <CheckBox
                  title={this.getItemTitle(answerOption)}
                  checkedColor={config.theme.colors.primary}
                  uncheckedColor={config.theme.colors.accent1}
                  onPress={() => {
                    actions.setAnswer({
                      linkId: item.linkId,
                      answer:
                        answerOption.valueCoding ||
                        answerOption.valueString ||
                        answerOption.valueInteger,
                      repeats: true,
                    });
                  }}
                  onIconPress={() => {
                    actions.setAnswer({
                      linkId: item.linkId,
                      answer:
                        answerOption.valueCoding ||
                        answerOption.valueString ||
                        answerOption.valueInteger,
                      repeats: true,
                    });
                  }}
                  checked={
                    (questionnaireItemMap[item.linkId].answer &&
                      answerOption.valueCoding &&
                      questionnaireItemMap[item.linkId].answer.some(
                        (c) =>
                          c.code === answerOption.valueCoding.code &&
                          c.system === answerOption.valueCoding.system,
                      )) ||
                    (questionnaireItemMap[item.linkId].answer &&
                      questionnaireItemMap[item.linkId].answer.includes(
                        answerOption.valueString,
                      )) ||
                    (questionnaireItemMap[item.linkId].answer &&
                      questionnaireItemMap[item.linkId].answer.includes(
                        answerOption.valueInteger,
                      ))
                  }
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${item.linkId}.a_${index}`}
                  containerStyle={{
                    ...localStyle.choice,
                    marginLeft: calculateIndent(item.linkId),
                  }}
                  textStyle={localStyle.choiceText}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  ) : null;
}

const localStyle = StyleSheet.create({
  contentTitle: {},
  choiceText: {},
  choiceInput: {},
});

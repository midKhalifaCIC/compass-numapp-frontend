import React, { useState } from 'react';
import debounce from 'lodash.debounce';

import { View, Text } from 'react-native';
import { Input } from 'react-native-elements';
import localization from '../../../services/localization/localization';

import sharedStyles from './sharedStyles';

/********************************/
// Helper functions

/**
 * is used to determine what kind of keyboard should be used
 * @param  {QuestionnaireItem} item a questionnaire item (from props.categories)
 */
const getKeyboardType = (item) => {
  switch (item.type) {
    // numpad for integers
    case 'integer':
      return 'number-pad';
    // decimalPad for decimals
    case 'decimal':
      return 'decimal-pad';
    // and the rest
    default:
      return 'default';
  }
};

/**
 * debounce the update of the global state for slightly better performance;
 * instead of dispatching an action after each keystroke, we wait for 500ms
 *
 */
const reportChange = debounce((item, retVal, callback) => {
  switch (item.type) {
    case 'string':
      callback({ answerString: retVal, linkId: item.linkId });
      break;
    case 'integer':
      callback({ answerInteger: parseInt(retVal, 10), linkId: item.linkId });
      break;
    case 'decimal':
      callback({ answerDecimal: parseFloat(retVal), linkId: item.linkId });
  }
}, 500);

/**
 * Basic Input Component
 *
 * @param {object} props Component props
 * @param {QuestionnaireItem} props.item the item to display
 * @param {Function} props.setAnswer callback to update the global state«params
 * @param {String | Number} props.currentValue the current value of the answer for this item
 *
 * @returns {JSX.Component} Component
 */
function BasicInput({ item, setAnswer, currentValue }) {
  const [value, setValue] = useState(currentValue);

  // validate the input, store it in the state of this component and update global state
  const handleChange = (text) => {
    // holds the initial, unedited text - in case that no manipulation is needed
    let retVal = text;
    // filters anything that is not a number
    if (item.type === 'integer') {
      retVal = text
        .split('')
        .filter((a) => Number(a) || a === '0')
        .join('');
    }
    // only allows decimals
    else if (item.type === 'decimal') {
      retVal = text
        .split('')
        .filter((a) => Number(a) || a === '0' || a === '.' || a === ',')
        .join('')
        .replace(',', '.');

      const split = retVal.split('.');
      if (split.length - 1 > 1) retVal = `${split[0]}.${split[1]}`;
      if (retVal === '.') retVal = null;
    }

    // set value locally
    setValue(retVal);
    reportChange(item, retVal, setAnswer);
  };

  return (
    <View style={sharedStyles.modalInput}>
      {/* title */}
      <Text style={{ ...sharedStyles.contentTitle }}>{item.text}</Text>
      {/* input */}
      <Input
        containerStyle={sharedStyles.modalContainer}
        placeholder={localization.translate('login').inputPlaceholder}
        value={value || ''} // displays an empty string when a 'falsy' answer needs to be rendered
        keyboardType={getKeyboardType(item)}
        style={{ ...sharedStyles.alignmentWrapper }}
        maxLength={item.maxLength || null}
        multiline={!item.multiline}
        // accessibilityLabel={ }
        accessibilityHint={
          localization.translate('accessibility').questionnaire.textFieldHint
        }
        onChangeText={handleChange}
      />
    </View>
  );
}

export default BasicInput;

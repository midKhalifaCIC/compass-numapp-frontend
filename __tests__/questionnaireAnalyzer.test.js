import cloneDeep from 'lodash.clonedeep';

import questionnaireAnalyzer from '../src/services/questionnaireAnalyzer/questionnaireAnalyzer';

const questionnaire = require('../src/assets/files/questionnaire');
const itemMap = require('./files/itemMap.json');
const questionnaireResponse = require('./files/questionnaireResponse.json');

let questionnaireCopy, itemMapCopy, questionnaireResponseCopy;

// reset local copies before each test
beforeEach(() => {
  questionnaireCopy = cloneDeep(questionnaire.default);
  itemMapCopy = cloneDeep(itemMap);
  questionnaireResponseCopy = cloneDeep(questionnaireResponse);
});

describe('testing', () => {
  it('should generate the questionnaire response', () => {
    const responseObject = questionnaireAnalyzer.createResponseJSON(
      itemMapCopy,
      questionnaireCopy.item,
    );
    expect(responseObject).toBeTruthy();
  });

  it('empty questionnaire is not completed', () => {
    expect(
      questionnaireAnalyzer.checkCompletionStateOfMultipleItems(
        null,
        questionnaireCopy.item,
        itemMapCopy,
        () => {},
      ),
    ).toBe(false);
  });

  it('should succeed when question has been answered', () => {
    const item = itemMapCopy[1.1];
    item.answer = { answerString: 'some Answer' };
    expect(
      questionnaireAnalyzer.checkCompletionStateOfMultipleItems(
        [item],
        [],
        itemMapCopy,
        () => {},
      ),
    ).toBe(true);
  });

  it('should fail when question has not been answered', () => {
    const item = itemMapCopy[1.1];
    expect(
      questionnaireAnalyzer.checkCompletionStateOfMultipleItems(
        [item],
        [],
        itemMapCopy,
      ),
    ).toBe(false);
  });
});

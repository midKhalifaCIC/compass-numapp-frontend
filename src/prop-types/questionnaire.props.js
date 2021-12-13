import PropTypes from "prop-types";

const QuestionnaireItemProps = PropTypes.shape({
  answer: PropTypes.arrayOf({}),
  answerOption: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({ valueString: PropTypes.string }),
      PropTypes.shape({ valueDate: PropTypes.string }),
      PropTypes.shape({ valueTime: PropTypes.string }),
      PropTypes.shape({ valueInteger: PropTypes.number }),
      PropTypes.shape({ valueDecimal: PropTypes.number }),
      PropTypes.shape({ valueBoolean: PropTypes.bool }),
      PropTypes.shape({ valueDateTime: PropTypes.string }),
      PropTypes.shape({
        valueCoding: PropTypes.shape({
          code: PropTypes.string.isRequired,
          display: PropTypes.string.isRequired,
          system: PropTypes.string.isRequired,
        }),
      }),
    ])
  ),
  definition: PropTypes.string,
  done: PropTypes.bool,
  linkId: PropTypes.string.isRequired,
  required: PropTypes.bool,
  text: PropTypes.string.isRequired,
  type: PropTypes.string,
});

QuestionnaireItemProps.item = PropTypes.arrayOf(QuestionnaireItemProps);

const QuestionnaireItemMapProps = PropTypes.shape({
  QuestionnaireItemPropType: QuestionnaireItemProps,
  started: PropTypes.bool,
  done: PropTypes.bool,
  finished: PropTypes.bool,
  urk: PropTypes.string,
  constructedId: PropTypes.string,
  identifier: PropTypes.arrayOf(
    PropTypes.shape({
      use: PropTypes.string,
      system: PropTypes.string,
      value: PropTypes.string,
    })
  ),
});

const FHIRPropType = PropTypes.shape({});

export default PropTypes.shape({
  questionnaire: PropTypes.shape({
    item: PropTypes.arrayOf(QuestionnaireItemProps),
    url: PropTypes.string,
    version: PropTypes.string,
  }),
  itemMap: QuestionnaireItemMapProps,
  categories: PropTypes.arrayOf(QuestionnaireItemProps),
  FHIR: FHIRPropType,
  startDate: PropTypes.string,
  dueDate: PropTypes.string,
  started: PropTypes.bool,
  done: PropTypes.bool,
});

export { QuestionnaireItemMapProps };

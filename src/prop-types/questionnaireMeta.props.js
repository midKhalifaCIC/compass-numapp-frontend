import PropTypes from "prop-types";

export default PropTypes.shape({
  questionnaireID: PropTypes.string,
  instanceId: PropTypes.string,
  startDate: PropTypes.string,
  dueDate: PropTypes.string,
  started: PropTypes.bool,
  finished: PropTypes.bool,
  url: PropTypes.string,
  version: PropTypes.string,
});

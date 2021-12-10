import PropTypes from "prop-types";

export default PropTypes.shape({
  subjectId: PropTypes.string,
  recipient_certificate_pem_string: PropTypes.string,
  accessToken: PropTypes.string,
  current_questionnaire_id: PropTypes.string,
  status: PropTypes.oneOf(["on-study", "off-study"]),
  firstTime: PropTypes.bool,
  additional_iterations_left: PropTypes.number,
  current_instance_id: PropTypes.string,
  current_interval: PropTypes.number,
  general_study_end_date: PropTypes.string,
  personal_study_end_date: PropTypes.string,
});

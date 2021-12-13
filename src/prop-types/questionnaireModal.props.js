import PropTypes from "prop-types";

export default PropTypes.shape({
  showModal: PropTypes.bool,
  showDatePicker: PropTypes.bool,
  current_category_index: PropTypes.number,
  current_page_index: PropTypes.number,
});

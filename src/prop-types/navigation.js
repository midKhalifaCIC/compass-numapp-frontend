import PropTypes from "prop-types";

export default PropTypes.shape({
  navigate: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  route: PropTypes.shape({}),
});

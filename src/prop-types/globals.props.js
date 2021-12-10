import PropTypes from "prop-types";

export default PropTypes.shape({
  loading: PropTypes.bool,
  error: PropTypes.shape({
    value: PropTypes.string,
  }),
});

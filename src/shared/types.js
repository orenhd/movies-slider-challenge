import PropTypes from "prop-types";

export const MovieEntry = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    release: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
})
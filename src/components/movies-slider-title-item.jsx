import React from "react";
import classNames from 'classnames';
import PropTypes from "prop-types";

import styles from './movies-slider-title-item.scss';

const MoviesSliderTitleItem = (props) => {
    const { title, targetMovieIndex, isCurrent, itemClickHandler } = props;

    const moviesSliderTitleItemClass = classNames({
        [styles.moviesSliderTitleItem]: true,
        [styles.currentMovieItem]: isCurrent
    });

    return <li className={moviesSliderTitleItemClass}
        onClick={() => { itemClickHandler(targetMovieIndex) }}
    >
        <h1>{title}</h1>
    </li>
}

MoviesSliderTitleItem.propTypes = {
    title: PropTypes.string.isRequired,
    targetMovieIndex: PropTypes.number.isRequired,
    isCurrent: PropTypes.bool,
    itemClickHandler: PropTypes.func
}

export default MoviesSliderTitleItem;
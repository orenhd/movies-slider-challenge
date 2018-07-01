import React from "react";

import { MovieEntry } from '../shared/types';

import styles from './movies-slider-item.scss';

const MoviesSliderItem = (props) => {
    const { movieEntry } = props;

    return <li className={styles.moviesSliderItem} style={{ backgroundImage: `url('./dist/images/${movieEntry.image}')` }}>
        <div className={styles.movieItemInfo}>
            <h1>{movieEntry.title}</h1>
            <div className={styles.movieItemInfoDivider} />
            <h2>{movieEntry.release}</h2>
        </div>
    </li>
}

MoviesSliderItem.propTypes = {
    movieEntry: MovieEntry.isRequired
}

export default MoviesSliderItem;
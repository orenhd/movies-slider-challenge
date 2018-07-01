import React, { Component } from 'react';

import styles from './application.scss';

/* import components */
import AppHeader from '../components/app-header';
import MoviesSlider from '../components/movies-slider';

export default class Application extends Component {
    render() {
        return <div className={styles.application}>
            <AppHeader />
            <MoviesSlider />
        </div>;
    }
}

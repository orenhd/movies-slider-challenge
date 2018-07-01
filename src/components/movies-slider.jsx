import React, { PureComponent } from 'react';
import classNames from 'classnames';

import * as MoviesListService from '../services/movies-list.service';

import styles from './movies-slider.scss';

import MoviesSliderItem from './movies-slider-item';
import MoviesSliderTitleItem from './movies-slider-title-item';

const AUTO_NAVIGATE_WAITING_DURATION = 9000;

export default class MoviesSlider extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            moviesList: [],
            currentMovieIndex: 1,
            transitionDisabled: false,
            pointerEventsDisabled: false,
        };
    }

    /* Lifecycle Methods */
    componentDidMount = () => {
        MoviesListService.getMoviesList().then((moviesList) => {
            this.setState({ moviesList });
        });

        this.autoNavigateTimeout = setTimeout(this.handleRightNavigatorClick, AUTO_NAVIGATE_WAITING_DURATION); // init. auto navigate
    }

    /* Class Methods */

    handleSliderTransitionEnd = () => {
        const { moviesList, currentMovieIndex } = this.state;

        if (currentMovieIndex === 0 || currentMovieIndex === moviesList.length + 1)  {
            const targetIndex = currentMovieIndex === 0 ? moviesList.length : 1;
            this.setState({ transitionDisabled: true, currentMovieIndex: targetIndex });
        } else { // else - retain transition and pointer events and re-init. auto navigatr
            this.setState({ transitionDisabled: false, pointerEventsDisabled: false });

            if (this.autoNavigateTimeout) { clearTimeout(this.autoNavigateTimeout) }
            
            this.autoNavigateTimeout = setTimeout(this.handleRightNavigatorClick, AUTO_NAVIGATE_WAITING_DURATION);
        }
    }

    handleLeftNavigatorClick = () => {
        this.setState({ currentMovieIndex: this.state.currentMovieIndex - 1, pointerEventsDisabled: true });
    }

    handleRightNavigatorClick = () => {
        this.setState({ currentMovieIndex: this.state.currentMovieIndex + 1, pointerEventsDisabled: true });
    }
    
    handleTitleItemClick = (targetMovieIndex) => {
        this.setState({ currentMovieIndex: targetMovieIndex, pointerEventsDisabled: true });
    }

    render() {

        const { moviesList, currentMovieIndex } = this.state;

        if (!this.state.moviesList || !this.state.moviesList.length) return <p>Loading...</p>; // TODO: render a loader

        const moviesSliderItems = [
            { ...moviesList[moviesList.length - 1], id: `${moviesList[moviesList.length - 1].id}-clone` },
            ...moviesList, 
            { ...moviesList[0], id: `${moviesList[0].id}-clone` }
        ]

        const moviesSliderTitleItems = [
            { id: `${moviesList[moviesList.length - 3].id}-clone`, title: moviesList[moviesList.length - 3].title, targetMovieIndex: moviesList.length - 2, isCurrent: currentMovieIndex === moviesList.length - 2 },
            { id: `${moviesList[moviesList.length - 2].id}-clone`, title: moviesList[moviesList.length - 2].title, targetMovieIndex: moviesList.length - 1, isCurrent: currentMovieIndex === moviesList.length - 1 },
            { id: `${moviesList[moviesList.length - 1].id}-clone`, title: moviesList[moviesList.length - 1].title, targetMovieIndex: moviesList.length, isCurrent: (currentMovieIndex === 0 || currentMovieIndex === moviesList.length) },
            ...(moviesList.map((movieEntry, index) => { return {
                id: movieEntry.id,
                title: movieEntry.title, 
                targetMovieIndex: index + 1,
                isCurrent: currentMovieIndex === index + 1
            }})), 
            { id: `${moviesList[0].id}-clone`, title: moviesList[0].title, targetMovieIndex: 1, isCurrent: (currentMovieIndex === moviesList.length + 1 || currentMovieIndex === 1) },
            { id: `${moviesList[1].id}-clone`, title: moviesList[1].title, targetMovieIndex: 2, isCurrent: currentMovieIndex === 2 },
            { id: `${moviesList[2].id}-clone`, title: moviesList[2].title, targetMovieIndex: 3, isCurrent: currentMovieIndex === 3 }
        ]

        const moviesSliderClass = classNames({
            [styles.moviesSlider]: true,
            [styles.moviesSliderTransitionDisabled]: this.state.transitionDisabled,
            [styles.moviesSliderPointerEventsDisabled]: this.state.pointerEventsDisabled,
        });

        return <div className={moviesSliderClass}>
            <ul className={styles.moviesSliderItemsWrapper}
                style={{ width: `${(moviesList.length + 2) * 100}%`, transform: `translateX(${currentMovieIndex * -100 / (moviesList.length + 2)}%)` }}
                onTransitionEnd={this.handleSliderTransitionEnd}
            >
                {moviesSliderItems.map(movieEntry =>
                    <MoviesSliderItem key={movieEntry.id} movieEntry={movieEntry} />
                )}
            </ul>
            <ul className={styles.moviesSliderTitlesWrapper}
                style={{ width: `${(moviesList.length + 6) * 25}%`, transform: `translateX(${(currentMovieIndex + 0.5) * -100 / (moviesList.length + 6)}%)` }}
            >
                {moviesSliderTitleItems.map((movieTitleEntry) =>
                    <MoviesSliderTitleItem 
                        key={movieTitleEntry.id} 
                        title={movieTitleEntry.title}
                        targetMovieIndex={movieTitleEntry.targetMovieIndex} 
                        isCurrent={movieTitleEntry.isCurrent}
                        itemClickHandler={this.handleTitleItemClick}
                    />
                )}
            </ul>
            <div className={`${styles.moviesSliderNavigator} ${styles.moviesSliderNavigatorLeft}`}
                onClick={this.handleLeftNavigatorClick}
            >
                <i className='fas fa-chevron-left'></i></div>
            <div className={`${styles.moviesSliderNavigator} ${styles.moviesSliderNavigatorRight}`}
                onClick={this.handleRightNavigatorClick}
            >
                <i className='fas fa-chevron-right'></i>
            </div>
        </div>
    }
}
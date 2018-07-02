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
            currentTitlesCloneSet: 0,
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
        const { moviesList, currentMovieIndex, currentTitlesCloneSet } = this.state;

        if (currentMovieIndex === 0 || currentMovieIndex === moviesList.length + 1)  { // fix for items slider
            const targetIndex = currentMovieIndex === 0 ? moviesList.length : 1;
            this.setState({ transitionDisabled: true, currentMovieIndex: targetIndex, currentTitlesCloneSet: 0 });
        } else if (currentTitlesCloneSet !== 0) { // fix for titles slider
            this.setState({ transitionDisabled: true, currentTitlesCloneSet: 0 });
        }
    }

    handleTitlesSliderTransitionEnd = () => {
        const { transitionDisabled } = this.state;

        /* the titles slider triggers a transition on every step */
        this.setState({ transitionDisabled: false, pointerEventsDisabled: false });

        if (this.autoNavigateTimeout) { clearTimeout(this.autoNavigateTimeout) }
        
        this.autoNavigateTimeout = setTimeout(this.handleRightNavigatorClick, AUTO_NAVIGATE_WAITING_DURATION);
    }

    handleLeftNavigatorClick = () => {
        this.setState({ currentMovieIndex: this.state.currentMovieIndex - 1, pointerEventsDisabled: true });
    }

    handleRightNavigatorClick = () => {
        this.setState({ currentMovieIndex: this.state.currentMovieIndex + 1, pointerEventsDisabled: true });
    }
    
    handleTitleItemClick = (targetMovieIndex, targetTitlesCloneSet) => {
        this.setState({ currentMovieIndex: targetMovieIndex, currentTitlesCloneSet: targetTitlesCloneSet, pointerEventsDisabled: true });
    }

    render() {

        const { moviesList, currentMovieIndex, currentTitlesCloneSet } = this.state;

        if (!this.state.moviesList || !this.state.moviesList.length) return <p>Loading...</p>; // TODO: render a loader

        const moviesSliderItems = [
            { ...moviesList[moviesList.length - 1], id: `${moviesList[moviesList.length - 1].id}-clone` },
            ...moviesList, 
            { ...moviesList[0], id: `${moviesList[0].id}-clone` }
        ]

        let moviesSliderTitleItems = moviesList.map((movieEntry, index) => { 
            return {
                id: movieEntry.id,
                title: movieEntry.title, 
                targetMovieIndex: index + 1,
                targetTitlesCloneSet: 0,
                isCurrent: currentMovieIndex % moviesList.length === (index + 1)  % moviesList.length
            }
        });

        moviesSliderTitleItems = [...(moviesSliderTitleItems.map((movieTitleEntry) => { return {...movieTitleEntry, id: `${movieTitleEntry.id}-precede-clone`, targetTitlesCloneSet: -1 } })),
            ...moviesSliderTitleItems,
            ...(moviesSliderTitleItems.map((movieTitleEntry) => { return {...movieTitleEntry, id: `${movieTitleEntry.id}-follow-clone`, targetTitlesCloneSet: 1 } })),
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
                style={{ width: `${moviesList.length * 3 * 25}%`, transform: `translateX(${(currentMovieIndex + (moviesList.length * (currentTitlesCloneSet + 1)) - 2.5) * -100 / (moviesList.length * 3)}%)` }}
                onTransitionEnd={this.handleTitlesSliderTransitionEnd}
            >
                {moviesSliderTitleItems.map((movieTitleEntry) =>
                    <MoviesSliderTitleItem 
                        key={movieTitleEntry.id}
                        title={movieTitleEntry.title}
                        targetMovieIndex={movieTitleEntry.targetMovieIndex}
                        targetTitlesCloneSet={movieTitleEntry.targetTitlesCloneSet}
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
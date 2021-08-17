import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { renderChart, drawCanvasBars } from './logic/chart.js';
import './App.css';

const SearchFilter = (props) => {
  return (
    <div id="search-filter">
      <label htmlFor="general-filter">
        <span>Search by</span>
        <select id="filter-select">
          <option value="artist" selected>Artist</option>
          <option value="song">Song</option>
          <option value="album">Album</option>
        </select>
      </label>
      <br />
      <input type="text" id="filter-input" list="artist-datalist" placeholder="Search htmlFor..." />
      <button type="button" id="submit-button" className="button">Search</button>
    </div>
  )
}

const DayButton = (props) => {
  const { abbrevation, fullName, displayName } = props;
  return (
    <label htmlFor={abbrevation}>
      <input type="checkbox" name={abbrevation} id={abbrevation} value={fullName} />
      <span className="checkbox">{displayName}</span>
    </label>
  )
}

const DayFilter = (props) => {
  return (
    <div id="day-filters">
      <label>Filter by day of the week:</label>
      <div id="day-container">
        <DayButton abbrevation="mon" fullName="Monday" displayName="Mon" />
        <DayButton abbrevation="tues" fullName="Tuesday" displayName="Tue" />
        <DayButton abbrevation="wed" fullName="Wednesday" displayName="Wed" />
        <DayButton abbrevation="thurs" fullName="Thursday" displayName="Thu" />
        <DayButton abbrevation="fri" fullName="Friday" displayName="Fri" />
        <DayButton abbrevation="sat" fullName="Saturday" displayName="Sat" />
        <DayButton abbrevation="sun" fullName="Sunday" displayName="Sun" />
      </div>
    </div>
  )
}

const SongInfo = (props) => {
  return (
    <div id="song-info-container">
      <div id="temp-instructions">
        <span className="title">Click a point for more details!</span>
      </div>
      <div id="song-info" className="hide">
        <div>
          <span className="info artist"></span> - <span className="info song"></span>
        </div>
        <div className="info art">
          <img id="album-art"
            src="https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png" />
        </div>
        <div className="info album"></div>
        <div className="info date"></div>
        <div id="tagList"></div>
      </div>
      <div>
        <svg id="monthly-stats"></svg>
      </div>
    </div>
  )
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkTheme: true,
    };
  }
  componentDidMount() {
    renderChart();
  }

  toggleDarkTheme = () => {
    this.setState((prevState) => ({
      isDarkTheme: !prevState.isDarkTheme,
    }), () => {
      const body = document.getElementsByTagName('body')[0];
      body.className = (this.state.isDarkTheme) ? '' : 'light-theme';
      drawCanvasBars();
    });
  }

  render() {
    return (
      <div class="site-container">
        <div id="loading">
          <div className="lds-dual-ring"></div>
          <h2>Loading...</h2>
        </div>
        <div id="content-container">
          <div id="theme-switcher" onClick={this.toggleDarkTheme}>
            {
              (this.state.isDarkTheme) ?
                (<FontAwesomeIcon icon={faSun} />)
                :
                (<FontAwesomeIcon icon={faMoon} />)
            }
          </div>
          <div id="filters">
            <SearchFilter />
            <DayFilter />
            <button id="reset" className="button">Reset</button>
          </div>
          <SongInfo />
          <div id="main">
            <div id="title-bar">
              <div id="entries"><span id="entry-count"></span> entries</div>
              <span className="title">
                Jeffrey's Music Listening Times &nbsp;
              </span>
              <div id="date-navigation">
                <button id="left" className="arrow">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <button id="right" className="arrow">
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
                <select id="date-range">
                </select>
              </div>
            </div>
            <canvas id="canvas"></canvas>
            <svg id="main-graph"></svg>
          </div>
        </div>
        <datalist id="artist-datalist"></datalist>
        <datalist id="song-datalist"></datalist>
        <datalist id="album-datalist"></datalist>
      </div>
    );
  }
}

export default App;

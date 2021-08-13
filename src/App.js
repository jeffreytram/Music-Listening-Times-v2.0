import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { renderChart, drawCanvasBars } from './logic/chart.js';
import './App.css';

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
      <div>
        <div id="loading">
          <div className="lds-dual-ring"></div>
          <h2>Loading...</h2>
        </div>
        <div id="test-container">
          <div id="content-container">
            <div id="side-info">
              <div id="theme-switcher-container">
                <div id="theme-switcher" onClick={this.toggleDarkTheme}>
                  {
                    (this.state.isDarkTheme) ? 
                    (<FontAwesomeIcon icon={faSun}/>)
                    :
                    (<FontAwesomeIcon icon={faMoon}/>)
                  }
                </div>
              </div>
              <div id="filters">
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
                <div id="day-filters">
                  <label>Filter by day of the week:</label>
                  <div id="day-container">
                    <label htmlFor="mon">
                      <input type="checkbox" name="mon" id="mon" value="Monday" />
                      <span className="checkbox">Mon</span>
                    </label>
                    <label htmlFor="tues">
                      <input type="checkbox" name="tues" id="tues" value="Tuesday" />
                      <span className="checkbox">Tue</span>
                    </label>
                    <label htmlFor="wed">
                      <input type="checkbox" name="wed" id="wed" value="Wednesday" />
                      <span className="checkbox">Wed</span>
                    </label>
                    <label htmlFor="thurs">
                      <input type="checkbox" name="thurs" id="thurs" value="Thursday" />
                      <span className="checkbox">Thu</span>
                    </label>
                    <label htmlFor="fri">
                      <input type="checkbox" name="fri" id="fri" value="Friday" />
                      <span className="checkbox">Fri</span>
                    </label>
                    <label htmlFor="sat">
                      <input type="checkbox" name="sat" id="sat" value="Saturday" />
                      <span className="checkbox">Sat</span>
                    </label>
                    <label htmlFor="sun">
                      <input type="checkbox" name="sun" id="sun" value="Sunday" />
                      <span className="checkbox">Sun</span>
                    </label>
                  </div>
                </div>
                <button id="reset" className="button">Reset</button>
              </div>
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
            </div>
            <div id="main">
              <div id="title-bar">
                <div id="entries"><span id="entry-count"></span> entries</div>
                <span className="title">
                  Jeffrey's Music Listening Times &nbsp;
                </span>
                <div id="date-navigation">
                  <button id="left" className="arrow">
                    <FontAwesomeIcon icon={faArrowLeft}/>
                  </button>
                  <button id="right" className="arrow">
                    <FontAwesomeIcon icon={faArrowRight}/>
                  </button>
                  <select id="date-range">
                  </select>
                </div>
              </div>
              <canvas id="canvas"></canvas>
              <svg id="main-graph"></svg>
            </div>
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

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons'
import { setup, drawCanvasBars, changeDateRange, changeDataList, resetGraph } from './logic/chart.js';
import './App.css';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkTheme: true,
    };
  }
  componentDidMount() {
    setup();
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

  handleSearchByChange = () => {
    //change datalist
    const filterSelect = document.getElementById('filter-select');
    changeDataList(filterSelect.value);
  }

  render() {
    const SearchFilter = (props) => {
      return (
        <div id="search-filter">
          <label htmlFor="general-filter">
            <span><FontAwesomeIcon icon={faSearch} /> Search by </span>
            <select id="filter-select" onChange={this.handleSearchByChange}>
              <option value="artist" selected>Artist</option>
              <option value="song">Song</option>
              <option value="album">Album</option>
            </select>
          </label>
          <br />
          <input type="text" id="filter-input" list="artist-datalist" placeholder="Search for..." />
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
          <label><FontAwesomeIcon icon={faFilter} /> Filter by day of the week:</label>
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

    const Filters = (props) => {
      return (
        <div id="filters">
          <SearchFilter />
          <DayFilter />
          <button id="reset" className="button" onClick={resetGraph}>Reset</button>
          <div className="side-container">
            <div id="entries"><span id="entry-count"></span> entries</div>
            <DateNavigation />
          </div>
        </div>
      )
    }

    const handleDateChange = () => {
      const month = document.getElementById('month-select').value;
      const year = document.getElementById('year-select').value;
      const date = new Date(month + ' ' + year);
      changeDateRange(date);
    }

    const DateNavigation = (props) => {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const abbrev = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      return (
        <div id="date-navigation">
          <select id="month-select" onChange={handleDateChange}>
            {months.map((month, i) => {
              return (
                <option value={abbrev[i]}>{month}</option>
              )
            })}
          </select>
          <select id="year-select" onChange={handleDateChange}></select>
        </div>
      )
    }

    const SongInfo = (props) => {
      return (
        <div id="song-info-container">
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
        </div>
      )
    }
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
          <h1>Music Listening Times</h1>
          <Filters />
          <SongInfo />
          <div id="main">
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

import React from 'react';
import * as d3 from "d3";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon, faSearch, faFilter, faRedoAlt, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import Graph from './components/Graph';
import SearchForm from './components/SearchForm';
import SongInfo from './components/SongInfo';
import { setup, uploadedDataSetup, filterDay } from './logic/chart.js';
import { getNextMonth, getPrevMonth } from './logic/chart.js';
import './App.css';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkTheme: false,
      datasetBuckets: {},
      datasetMonth: [],
      filteredDatasetMonth: [],
      filterView: 'none',
      yearList: [],
      month: 0,
      year: 0,
      datalist: { artist: [], song: [], album: [] },
      datalistSetting: 'artist',
      dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
      newLoad: false,
      clickedPoint: -1,
    };
  }

  componentDidMount() {
    setup(this.setDatasetBuckets, this.setDatasetMonth, this.setYearList);
  }

  /**
   * Initializes the datasetBuckets state
   * @param {Object} bucket Object with attributes of data by month
   */
  setDatasetBuckets = (bucket) => {
    this.setState(() => ({
      datasetBuckets: bucket,
    }));
  }

  /**
   * Sets the state to the given month and year
   * @param {number} month The numerical month you use normally (1 = Janurary, 12 = December)
   * @param {number} year The numerical full year (ex: 2021)
   */
  setDatasetMonth = (month, year) => {
    this.setState((prevState) => ({
      datasetMonth: prevState.datasetBuckets[`${month} ${year}`],
      filteredDatasetMonth: prevState.datasetBuckets[`${month} ${year}`],
      filterView: 'none',
      dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
      month: month,
      year: year,
      newLoad: true,
      clickedPoint: -1,
    }), () => {
      if (this.state.datasetMonth) {
        this.setDatalist();
      }
    });
  }

  /**
   * Initializes the yearList state to use as select options
   * @param {Array} years the list of years
   */
  setYearList = (years) => {
    this.setState(() => ({
      yearList: years,
    }))
  }

  /**
   * Sets the artist, song, and album datalist for the current month
   */
  setDatalist = () => {
    const artistSet = new Set();
    const songSet = new Set();
    const albumSet = new Set();

    this.state.datasetMonth.forEach(d => {
      artistSet.add(d.Artist);
      songSet.add(d.SongTitle);
      albumSet.add(d.Album);
    });

    const ignoreCaseSort = (a, b) => {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    };
    const artistList = Array.from(artistSet).sort(ignoreCaseSort);
    const songList = Array.from(songSet).sort(ignoreCaseSort);
    const albumList = Array.from(albumSet).sort(ignoreCaseSort);

    this.setState(() => ({
      datalist: { artist: artistList, song: songList, album: albumList },
      newLoad: false,
    }));
  }

  /**
   * Sets the state for clickedPoint to the given point id
   * @param {number} id month point id
   */
  setClickedPoint = (id) => {
    this.setState(() => ({
      clickedPoint: id,
      filterView: 'select',
    }))
  }

  /**
   * 
   * @param {*} dataset 
   * @param {*} viewType 
   */
  setFilteredDatasetMonth = (dataset, viewType) => {
    this.setState(() => ({
      filteredDatasetMonth: dataset,
      filterView: viewType,
    }))
  }

  /**
   * Sets the application theme to the opposite theme
   */
  toggleDarkTheme = () => {
    this.setState((prevState) => ({
      isDarkTheme: !prevState.isDarkTheme,
    }));
  }

  /**
   * Sets the search type to the given parameter
   * @param {String} type the search type to set to ('artist', 'song', 'album')
   */
  setSearchType = (type) => {
    this.setState(() => ({
      datalistSetting: type,
    }));
  }

  /**
   * Handles the toggling of the day filter checkboxes
   * @param {Object} event 
   */
  toggleDayCheckbox = (event) => {
    const toggledDay = event.target.name;
    this.setState((prevState) => {
      return {
        dayFilter: {
          ...prevState.dayFilter,
          [toggledDay]: !prevState.dayFilter[toggledDay],
        },
        filterView: 'day',
      };
    }, () => {
      const filteredDataset = filterDay(this.state.dayFilter, this.state.datasetBuckets[`${this.state.month} ${this.state.year}`]);
      this.setState(() => ({
        filteredDatasetMonth: filteredDataset,
      }));
      // 
    });
  }

  handleFileUpload = (event) => {
    const fileList = event.target.files;
    const file = fileList[0];

    const fileReader = new FileReader();

    const parseFile = () => {
      var data = d3.csvParse(fileReader.result, function (d) {
        return d;
      });
      uploadedDataSetup(data, this.setDatasetBuckets, this.setDatasetMonth, this.setYearList);
    }

    fileReader.addEventListener("load", parseFile, false);
    if (file) {
      fileReader.readAsText(file);
    }
  }

  render() {
    const body = document.getElementsByTagName('body')[0];
    body.className = (this.state.isDarkTheme) ? '' : 'light-theme';

    const SearchFilter = (props) => {
      return (
        <div id="search-filter">
          <label htmlFor="general-filter">
            <span><FontAwesomeIcon icon={faSearch} /> Search by </span>
            <select id="filter-select" onChange={(event) => this.setSearchType(event.target.value)} value={this.state.datalistSetting}>
              <option value="artist">Artist</option>
              <option value="song">Song</option>
              <option value="album">Album</option>
            </select>
          </label>
          <br />
          <SearchForm
            setting={this.state.datalistSetting}
            setFilteredDatasetMonth={this.setFilteredDatasetMonth}
            data={this.state.datasetMonth}
            datalist={`${this.state.datalistSetting}-datalist`}
          />
        </div >
      )
    }

    const DayButton = (props) => {
      const { abbrevation, fullName, displayName } = props;
      return (
        <label htmlFor={abbrevation}>
          <input
            type="checkbox"
            name={abbrevation}
            id={abbrevation}
            value={fullName}
            checked={this.state.dayFilter[abbrevation]}
            onChange={this.toggleDayCheckbox}
          />
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
            <DayButton abbrevation="tue" fullName="Tuesday" displayName="Tue" />
            <DayButton abbrevation="wed" fullName="Wednesday" displayName="Wed" />
            <DayButton abbrevation="thu" fullName="Thursday" displayName="Thu" />
            <DayButton abbrevation="fri" fullName="Friday" displayName="Fri" />
            <DayButton abbrevation="sat" fullName="Saturday" displayName="Sat" />
            <DayButton abbrevation="sun" fullName="Sunday" displayName="Sun" />
          </div>
        </div>
      )
    }

    const handleMonthChange = (event) => {
      const month = event.target.value;
      this.setDatasetMonth(month, this.state.year);
    };

    const handleYearChange = (event) => {
      const year = event.target.value;
      this.setDatasetMonth(this.state.month, year);
    }

    const handleNextMonthChange = () => {
      const nextMonth = getNextMonth(this.state.month, this.state.year);
      const month = nextMonth.getMonth() + 1;
      const year = nextMonth.getFullYear();
      this.setDatasetMonth(month, year);
    }

    const handlePrevMonthChange = () => {
      const prevMonth = getPrevMonth(this.state.month, this.state.year);
      const month = prevMonth.getMonth() + 1;
      const year = prevMonth.getFullYear();
      this.setDatasetMonth(month, year);
    }

    const DateNavigation = (props) => {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const abbrev = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      const nextMonthDate = getNextMonth(this.state.month, this.state.year);
      const nextMonth = nextMonthDate.getMonth() + 1;
      const nextYear = nextMonthDate.getFullYear();

      const prevMonthDate = getPrevMonth(this.state.month, this.state.year);
      const prevMonth = prevMonthDate.getMonth() + 1;
      const prevYear = prevMonthDate.getFullYear();

      const nextDisabled = (this.state.datasetBuckets[`${nextMonth} ${nextYear}`]) ? '' : 'disabled-arrow';
      const prevDisabled = (this.state.datasetBuckets[`${prevMonth} ${prevYear}`]) ? '' : 'disabled-arrow';

      return (
        <div className="date-navigation">
          <FontAwesomeIcon icon={faCaretUp} className={`up-caret arrow ${prevDisabled}`} onClick={handlePrevMonthChange}
            title="Go to the previous month"
          />
          <FontAwesomeIcon icon={faCaretDown} className={`down-caret arrow ${nextDisabled}`} onClick={handleNextMonthChange}
            title="Go to the next month"
          />
          <select id="month-select" onChange={handleMonthChange} value={this.state.month}>
            {months.map((month, i) => {
              return (
                <option value={abbrev[i]}>{month}</option>
              )
            })}
          </select>
          <select id="year-select" onChange={handleYearChange} value={this.state.year}>
            {this.state.yearList.map((year) => {
              return (
                <option value={year}>{year}</option>
              )
            })}
          </select>
        </div>
      )
    }
    return (
      <div class="site-container" >
        <div id="loading">
          <div className="lds-dual-ring"></div>
          <h2>Loading...</h2>
        </div>
        <div id="content-container">
          <div id="theme-switcher" onClick={this.toggleDarkTheme}>
            {
              (this.state.isDarkTheme) ?
                (<FontAwesomeIcon icon={faMoon} />)
                :
                (<FontAwesomeIcon icon={faSun} />)
            }
          </div>
          <h1>Music Listening Times</h1>
          <input type="file" accept=".csv" id="input" onChange={this.handleFileUpload}></input>
          <div className="info-grid">
            <SearchFilter />
            <DayFilter />
            <button id="reset" className="button" onClick={() => this.setDatasetMonth(this.state.month, this.state.year)}><FontAwesomeIcon icon={faRedoAlt} flip="horizontal" /> Reset</button>
            <SongInfo
              clickedPoint={this.state.clickedPoint}
              setFilteredDatasetMonth={this.setFilteredDatasetMonth}
              setSearchType={this.setSearchType}
              setClickedPoint={this.setClickedPoint}
              data={this.state.datasetMonth}
            />
          </div>
          <div className="side-container">
            <div id="entries">{(this.state.filteredDatasetMonth) ? this.state.filteredDatasetMonth.length : 0} entries</div>
            <DateNavigation />
          </div>
          <div id="main">
            <Graph
              data={this.state.datasetMonth}
              filteredData={this.state.filteredDatasetMonth}
              filterView={this.state.filterView}
              newLoad={this.state.newLoad}
              setClickedPoint={this.setClickedPoint}
              setFilteredDatasetMonth={this.setFilteredDatasetMonth}
              sampleDate={new Date(`${this.state.month} 1 ${this.state.year}`)}
            />
          </div>
        </div>
        <datalist id="artist-datalist">
          {this.state.datalist.artist.map(option => {
            return <option>{option}</option>
          })}
        </datalist>
        <datalist id="song-datalist">
          {this.state.datalist.song.map(option => {
            return <option>{option}</option>
          })}
        </datalist>
        <datalist id="album-datalist">
          {this.state.datalist.album.map(option => {
            return <option>{option}</option>
          })}
        </datalist>
      </div>
    );
  }
}

export default App;

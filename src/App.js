import React from 'react';
import * as d3 from "d3";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon, faSearch, faFilter, faRedoAlt, faCaretUp, faCaretDown, faUpload } from '@fortawesome/free-solid-svg-icons'
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
      datasetBuckets: new Map(),
      dataset: [],
      entireDataset: [],
      filteredDataset: [],
      filterView: 'none',
      yearList: [],
      month: 0,
      year: 0,
      datalist: { artist: [], song: [], album: [] },
      datalistSetting: 'artist',
      dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
      newLoad: false,
      clickedPoint: -1,
      timePeriod: 'monthly',
      timeRange: [],
    };
  }

  componentDidMount() {
    setup(this.setDatasetBuckets, this.setDataset, this.setYearList);
  }

  /**
   * Initializes the datasetBuckets state
   * @param {Object} bucket Object with attributes of data by month
   * @param {Array} dataset The entire dataset
   * @param {Array} timeRange the bounds of the entire dataset
   */
  setDatasetBuckets = (bucket, dataset, timeRange) => {
    this.setState(() => ({
      datasetBuckets: bucket,
      entireDataset: dataset,
      timeRange: timeRange,
    }));
  }

  /**
   * Sets the state to the given month and year
   * @param {number} month The numerical month you use normally (1 = Janurary, 12 = December)
   * @param {number} year The numerical full year (ex: 2021)
   */
  setDataset = (month, year) => {
    let dataset = [];

    const { timePeriod, datasetBuckets } = this.state;

    if (timePeriod === 'monthly') {
      dataset = datasetBuckets.get(year)[month];
    } else if (timePeriod === 'yearly') {
      // get dataset for the year
      dataset = datasetBuckets.get(year).yearArr;
    }
    this.setState((prevState) => ({
      dataset: dataset,
      filteredDataset: dataset,
      filterView: 'none',
      dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
      month: month,
      year: year,
      newLoad: true,
      clickedPoint: -1,
    }), () => {
      if (this.state.dataset) {
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

    this.state.dataset.forEach(d => {
      artistSet.add(d.Artist);
      songSet.add(d.Song);
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
      dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
    }))
  }

  /**
   * Not used for day filter
   * @param {*} dataset 
   * @param {*} viewType 
   */
  setFilteredDataset = (dataset, viewType) => {
    this.setState(() => ({
      filteredDataset: dataset,
      filterView: viewType,
      dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
    }));
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
      const filteredDataset = filterDay(this.state.dayFilter, this.state.dataset);
      this.setState(() => ({
        filteredDataset: filteredDataset,
      }));
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
      uploadedDataSetup(data, this.setDatasetBuckets, this.setDataset, this.setYearList);
    }

    fileReader.addEventListener("load", parseFile, false);
    if (file) {
      fileReader.readAsText(file);
    }
  }

  setTimePeriod = (period) => {
    this.setState(() => ({
      timePeriod: period,
    }), () => {
      this.setDataset(this.state.month, this.state.year);
    });
  }

  render() {
    const {
      dataset, filteredDataset, entireDataset, datalist, datalistSetting, 
      dayFilter, filterView, month, year, timePeriod, timeRange, yearList, clickedPoint, 
      newLoad, isDarkTheme,
    } = this.state;

    const body = document.getElementsByTagName('body')[0];
    body.className = (isDarkTheme) ? '' : 'light-theme';


    const SearchFilter = (props) => {
      return (
        <div id="search-filter">
          <label htmlFor="general-filter">
            <span><FontAwesomeIcon icon={faSearch} /> Search by </span>
            <select id="filter-select" onChange={(event) => this.setSearchType(event.target.value)} value={datalistSetting}>
              <option value="artist">Artist</option>
              <option value="song">Song</option>
              <option value="album">Album</option>
            </select>
          </label>
          <br />
          <SearchForm
            setting={datalistSetting}
            setFilteredDataset={this.setFilteredDataset}
            data={dataset}
            datalist={`${datalistSetting}-datalist`}
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
            checked={dayFilter[abbrevation]}
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
      const newMonth = parseInt(event.target.value);
      this.setDataset(newMonth, year);
    };

    const handleYearChange = (event) => {
      const newYear = parseInt(event.target.value);
      this.setDataset(month, newYear);
    }

    const handleNextPeriodChange = (timePeriod) => {
      if (timePeriod === 'monthly') {
        const nextMonthDate = getNextMonth(month, year);
        const nextMonth = nextMonthDate.getMonth() + 1;
        const nextMonthYear = nextMonthDate.getFullYear();
        this.setDataset(nextMonth, nextMonthYear);
      } else if (timePeriod === 'yearly') {
        this.setDataset(month, parseInt(year) + 1);
      }
    }

    const handlePrevPeriodChange = (timePeriod) => {
      if (timePeriod === 'monthly') {
        const prevMonthDate = getPrevMonth(month, year);
        const prevMonth = prevMonthDate.getMonth() + 1;
        const prevYear = prevMonthDate.getFullYear();
        this.setDataset(prevMonth, prevYear);
      } else if (timePeriod === 'yearly') {
        this.setDataset(month, parseInt(year) - 1);
      }
    }

    const DateNavigation = (props) => {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const abbrev = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      const nextMonthDate = getNextMonth(month, year);
      const prevMonthDate = getPrevMonth(month, year);

      let nextDisabled;
      let prevDisabled;

      if (timePeriod === 'monthly') {
        nextDisabled = (nextMonthDate > timeRange[1]) ? 'disabled-arrow' : '';
        prevDisabled = (prevMonthDate < timeRange[0]) ? 'disabled-arrow' : '';
      } else if (timePeriod === 'yearly') {
        nextDisabled = (yearList.indexOf(parseInt(year) + 1) === -1) && 'disabled-arrow';
        prevDisabled = (yearList.indexOf(parseInt(year) - 1) === -1) && 'disabled-arrow';
      }


      return (
        <div className="date-navigation">
          <FontAwesomeIcon icon={faCaretUp} className={`up-caret arrow ${prevDisabled}`} onClick={() => handlePrevPeriodChange(timePeriod)}
            title={`Go to previous ${(timePeriod === 'monthly') ? 'month' : 'year'}`}
          />
          <FontAwesomeIcon icon={faCaretDown} className={`down-caret arrow ${nextDisabled}`} onClick={() => handleNextPeriodChange(timePeriod)}
            title={`Go to the next ${(timePeriod === 'monthly') ? 'month' : 'year'}`}
          />
          {(timePeriod === 'monthly') && (
            <select id="month-select" onChange={handleMonthChange} value={month}>
              {months.map((month, i) => {
                return (
                  <option value={abbrev[i]}>{month}</option>
                )
              })}
            </select>
          )}
          <select id="year-select" onChange={handleYearChange} value={year}>
            {yearList.map((year) => {
              return (
                <option value={year}>{year}</option>
              )
            })}
          </select>
        </div>
      )
    }

    const TimePeriodButton = ({ value }) => (
      <>
        <input id={value} type="radio" value={value} name="time-period" checked={timePeriod === value}
          onChange={() => this.setTimePeriod(value)}
        />
        <label for={value}>{value}</label>
      </>
    )

    return (
      <div class="site-container" >
        <div id="loading">
          <div className="lds-dual-ring"></div>
          <h2>Loading...</h2>
        </div>
        <div id="content-container">
          <div id="side-options-container" onClick={this.toggleDarkTheme}>
            <label for="file-upload" className="side-option button">
              <FontAwesomeIcon icon={faUpload} /> Import CSV
            </label>
            <input id="file-upload" type="file" accept=".csv" onChange={this.handleFileUpload}></input>
            <div className="button side-option">
              {
                (isDarkTheme) ?
                  (<FontAwesomeIcon icon={faMoon} />)
                  :
                  (<FontAwesomeIcon icon={faSun} />)
              }
            </div>
          </div>
          <h1>Music Listening Times</h1>
          <TimePeriodButton value="monthly" />
          <TimePeriodButton value="yearly" />
          <div className="info-grid">
            <SearchFilter />
            <DayFilter />
            <button id="reset" className="button" onClick={() => this.setDataset(month, year)}><FontAwesomeIcon icon={faRedoAlt} flip="horizontal" /> Reset</button>
            <SongInfo
              clickedPoint={clickedPoint}
              setFilteredDataset={this.setFilteredDataset}
              setSearchType={this.setSearchType}
              setClickedPoint={this.setClickedPoint}
              data={dataset}
              entireDataset={entireDataset}
              timePeriod={timePeriod}
            />
          </div>
          <div className="side-container">
            <div id="entries">{(filteredDataset) ? filteredDataset.length : 0} entries</div>
            <DateNavigation />
          </div>
          <div id="main">
            <Graph
              data={dataset}
              filteredData={filteredDataset}
              filterView={filterView}
              newLoad={newLoad}
              setClickedPoint={this.setClickedPoint}
              setFilteredDataset={this.setFilteredDataset}
              sampleDate={new Date(`${month} 1 ${year}`)}
              timePeriod={timePeriod}
            />
          </div>
        </div>
        <datalist id="artist-datalist">
          {datalist.artist.map(option => {
            return <option>{option}</option>
          })}
        </datalist>
        <datalist id="song-datalist">
          {datalist.song.map(option => {
            return <option>{option}</option>
          })}
        </datalist>
        <datalist id="album-datalist">
          {datalist.album.map(option => {
            return <option>{option}</option>
          })}
        </datalist>
      </div>
    );
  }
}

export default App;

import * as d3 from "d3";
import { updateContrastingColors } from './colors.js';
import { displayTags, displaySongInfo } from './song-info.js';

const width = 950;
const height = 540;
const padding = { left: 90, right: 40, top: 10, down: 60 };

let svg = {};
let xAxisG = {};
let yAxisG = {};

let filteredDatasetMonth = [];

let datasetLoaded = [];
let datasetMonth = [];
let buckets = {};
let yState = [];
let xScale = [];
let yScale = [];

//creating canvas, DOM element
let canvas = [];

/**
 * Sets yState from the first day to the last day of the month for the given date
 * @param {*} date 
 */
export function setYState(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  yState = [lastDay, firstDay];
  return yState;
}

/**
   * Switches the current month's data to the newly selected month's data
   * @param {array} range Array containing the upper date range, and lower date range
   */
function filterRange(range) {
  const lowerRange = range[1];
  let key = (lowerRange.getMonth() + 1) + ' ' + lowerRange.getFullYear()
  datasetMonth = buckets[key];
  filteredDatasetMonth = datasetMonth;
}

/**
 * Displays the length of the current month's data
 */
function displayNumEntries() {
  //display length of fitlered list
  document.getElementById("entry-count").innerHTML = filteredDatasetMonth.length;
}

/**
 * Sets the datalists to the current months data
 */
function setDataList() {
  const artistDataList = document.getElementById('artist-datalist');
  const songDataList = document.getElementById('song-datalist');
  const albumDataList = document.getElementById('album-datalist');

  artistDataList.innerHTML = '';
  songDataList.innerHTML = '';
  albumDataList.innerHTML = '';

  let artistSet = new Set();
  let songSet = new Set();
  let albumSet = new Set();
  datasetMonth.forEach(d => {
    artistSet.add(d.Artist);
    songSet.add(d.SongTitle);
    albumSet.add(d.Album);
  });
  const artistList = Array.from(artistSet).sort();
  const songList = Array.from(songSet).sort();
  const albumList = Array.from(albumSet).sort();

  const maxLength = Math.max(artistList.length, songList.length, albumList.length);
  let i = 0;
  while (i < maxLength) {
    if (i < artistList.length) {
      const option1 = document.createElement('option');
      option1.value = artistList[i];
      artistDataList.appendChild(option1);
    }
    if (i < songList.length) {
      const option2 = document.createElement('option');
      option2.value = songList[i];
      songDataList.appendChild(option2);
    }
    if (i < albumList.length) {
      const option3 = document.createElement('option');
      option3.value = albumList[i];
      albumDataList.appendChild(option3);
    }
    i++;
  }
}

/**
 * Handles filter functionality
 * @param {string} type the type of filter
 * @param {string} value the value to filter by
 * @param {array} dataset the data to filter
 * @returns the filtered dataset
 */
export function searchFilter(type, value, dataset) {
  const settings = ['song', 'artist', 'album'];
  const keys = ['SongTitle', 'Artist', 'Album'];
  for (let i = 0; i < settings.length; i++) {
    if (type === settings[i]) {
      return dataset.filter(d => d[keys[i]] === value);
    }
  }
  // search type not found;
  return [];
}

/**
 * Filters the current month's data by the given song's name
 * @param {string} song The song name to filter by
 */
function filterSong(song) {
  filteredDatasetMonth = datasetMonth.filter(d => d.SongTitle === song);
}

/**
 * Filters the current month's data by the given arist's name
 * @param {string} artist The artist's name to filter by
 */
function filterArtist(artist) {
  filteredDatasetMonth = datasetMonth.filter(d => d.Artist === artist);
}

/**
 * Filters the current month's data by the given album's name
 * @param {string} category The album's name to filter by
 */
 function filterAlbum(album) {
  filteredDatasetMonth = datasetMonth.filter(d => d.Album === album);
}

/**
 * Filters the current month's data by the given list of days
 * @param {Object} dayFilter
 * @param {Array} dataset
 */
export const filterDay = (dayFilter, dataset) => {
  let newDataset = [];
  // get the applied day filters from the object
  const weekList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const abbrevList = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  let daySelectedCount = 0;

  abbrevList.forEach((day, i) => {
    if (dayFilter[day]) {
      newDataset = newDataset.concat(dataset.filter(d => d.Day === weekList[i]));
      daySelectedCount++;
    }
  });
  //if no days selected, display all
  if (daySelectedCount > 0) {
    return newDataset;
  } else {
    return dataset;
  }
}

/**
 * Reset controller.
 * Clears all filters and selections, and updates the visualizaiton accordingly
 */
export function resetGraph() {
  displayNumEntries();
  updateCircles();
  drawCanvasBars();
  clearHighlight();
  clearDayFilters();
  clearInput();
}

/**
 * Resets the checkbox filters (day filters)
 */
function clearDayFilters() {
  const input = document.getElementsByTagName('input');
  const checkbox = Array.from(input).filter(input => input.type === "checkbox");
  Array.from(checkbox).forEach(function (cb) {
    cb.checked = false;
    let change = new Event('change');
    cb.dispatchEvent(change);
  });
}

/**
 * Resets the values in the text inputs
 */
function clearInput() {
  const filterInput = document.getElementById('filter-input');
  filterInput.value = '';
}

/**
 * Initial render of the current month's data
 */
function renderCircles() {
  //filtered selection
  var point = svg.selectAll('.point')
    .data(filteredDatasetMonth, d => d.ConvertedDateTime)

  var pointEnter = point.enter()
    .append('g')
    .attr('class', 'point')

  pointEnter.merge(point)
    .attr('transform', d => {
      var tx = xScale(d.Time);
      var ty = yScale(d.Date);
      return 'translate(' + [tx, ty] + ')';
    });

  //add circle to group
  pointEnter.append('circle')
    .attr('r', 3)
    .style('opacity', .3)
    .on("click", function (d) {
      clearDayFilters();
      displaySongInfo(d);
      displayTags(d);
      clearHighlight();
      singleHighlight(d3.select(this));
    });
}

/**
 * Updates the filtered data points accordingly
 * Points filtered out are more transparent. The other points are more opaque
 * @param {number} displaySize The radius size to set the filtered data points to
 * @param {number} viewOpacity The opaciity to set the filtered data points to
 */
function updateCircles(displaySize = 3, viewOpacity = .3) {
  //filtered selection
  var point = svg.selectAll('.point')
    .data(filteredDatasetMonth, d => d.ConvertedDateTime)

  point.select("circle")
    .attr('r', displaySize)
    .style('opacity', viewOpacity);

  //remove filtered out circles
  point.exit()
    .select("circle")
    .attr('r', 3)
    .style('opacity', .07);
}

/**
 * Renders the new month's data
 */
function updateCirclesRange(displaySize = 3, viewOpacity = .3) {
  //filtered selection
  var point = svg.selectAll('.point')
    .data(datasetMonth, d => d.ConvertedDateTime)

  var pointEnter = point.enter()
    .append('g')
    .attr('class', 'point')

  pointEnter.merge(point)
    .attr('transform', d => {
      var tx = xScale(d.Time);
      var ty = yScale(d.Date);
      return 'translate(' + [tx, ty] + ')';
    });

  //add circle to group
  pointEnter.append('circle')
    .attr('r', displaySize)
    .style('opacity', viewOpacity)
    .on("click", function (d) {
      clearDayFilters();
      displaySongInfo(d);
      displayTags(d);
      clearHighlight();
      singleHighlight(d3.select(this));
    });

  //remove filtered out circles
  point.exit().remove();
}

/**
 * Updates the yScale to the current yState
 */
function updateYAxis() {
  yScale.domain(yState);
  yAxisG.transition()
    .ease(d3.easePoly)
    .duration(750)
    .call(d3.axisLeft(yScale));
}

/**
 * Handles the changing of months
 * Updates all the data as needed and resets the filters
 * @param {Object} date The date to update to
 */
export function changeDateRange(date) {
  setYState(date);

  // Update chart
  updateYAxis();
  filterRange(yState);
  displayNumEntries();
  updateCirclesRange();
  drawCanvasBars();
  clearDayFilters();
  setDataList();
  updateOptionVisibility(date);
}

/**
 * Ables/disables the month options based on whether the option is a valid month
 * @param {Object} date Date object
 */
function updateOptionVisibility(date) {
  // update month option visibility
  const options = Array.from(document.getElementById('month-select').getElementsByTagName('option'));
  const validMonthsArr = getValidMonthArr(date);
  options.forEach((month, i) => {
    if (validMonthsArr[i]) {
      month.disabled = false;
    } else {
      month.disabled = true;
    }
  })
}

/**
 * Gets the valid months array for the year
 * @param {Object} date 
 * @returns valid month boolean array
 */
function getValidMonthArr(date) {
  let validMonthsArr = [];
  const year = date.getFullYear();
  for (let i = 1; i <= 12; i++) {
    if (buckets[i + ' ' + year]) {
      validMonthsArr.push(true);
    } else {
      validMonthsArr.push(false);
    }
  }
  return validMonthsArr;
}

/**
 * Switches the current datalist to the new one
 * @param {string} value The datalist to switch too
 */
export function changeDataList(value) {
  const filterInput = document.getElementById('filter-input');
  filterInput.setAttribute('list', value + '-datalist');
}

/**
 * highlights the given point
 * @param {Pt} dot The point to highlight
 */
function singleHighlight(dot) {
  // filterController('artist', dot._groups[0][0].__data__.Artist);
  dot.transition()
    .ease(d3.easePoly)
    .duration(750)
    .attr('r', 10)
    .style('opacity', .5)
    .attr('class', 'point')
    .attr('id', 'selected');
}

/**
 * Clears the highlight of the highlighted circle
 */
function clearHighlight() {
  svg.select('#selected')
    .attr('r', 3)
    .attr('class', 'point')
    .attr('id', '');
}

/**
 * creates an event listener filter
 * @param {string} type The type of filter
 * @param {HTML element} element The element too add the event listener to
 * @param {string} sourceValue Where the value to filter by comes from
 */
function addFilter(type, element, sourceValue) {
  element.addEventListener("click", function () {
    let filterValue;
    const select = document.getElementById('filter-select');
    const input = document.getElementById('filter-input');
    if (sourceValue === "input") {
      //filter value is the user input in text field
      filterValue = input.value;
      // filterController(select.value, filterValue);
    } else if (sourceValue === "info") {
      //filter value is the text displayed in the info
      filterValue = element.innerHTML;
      select.value = type;
      input.value = filterValue;
      // filterController(type, filterValue);
      changeDataList(type);
    }
  });
}

/**
 * Draws the single axis vertical bar visualization
 */
const drawCanvasBars = () => {
  const width = canvas.node().width;
  const height = canvas.node().height;

  //object with prop and methods used to render graphics in canvas element
  let context = canvas.node().getContext('2d');

  // clear canvas
  context.clearRect(0, 0, width, height);

  const style = getComputedStyle(document.body);
  const rgb = style.getPropertyValue('--default-rgb');

  for (let i = 0; i < filteredDatasetMonth.length; i++) {
    let d = filteredDatasetMonth[i];

    //draw rect
    context.fillStyle = `rgba(${rgb}, .1)`;
    context.fillRect(xScale(d.Time), 0, 3, height);
  }
}

/**
 * Loads the music data from the csv
 */
const loadData = () => {
  datasetLoaded = d3.csv('/lastfm-data-utf.csv').then((data) => {
    return data;
  });
}

/**
 * Processes the data into buckets
 * @param {Function} setDatasetBuckets 
 * @param {Function} setDatasetMonth 
 */
const preprocessData = (setDatasetBuckets, setDatasetMonth) => {
  //convert date string to data object
  let newDate = new Date();
  newDate.setHours(0, 0, 0, 0);
  let newDateMilis = newDate.getTime();

  //sorts all the data into buckets by the month and year
  datasetLoaded.then(dataset => {
    dataset.forEach(d => {
      d.Date = new Date(d.Date);
      //add to bucket
      let key = (d.Date.getMonth() + 1) + " " + d.Date.getFullYear();
      if (buckets[key] === undefined) {
        buckets[key] = [];
      }
      buckets[key].push(d);

      var parts = d.Time.split(/:/);
      var timePeriodMillis = (parseInt(parts[0], 10) * 60 * 60 * 1000) +
        (parseInt(parts[1], 10) * 60 * 1000)
      d.Time = new Date()
      d.Time.setTime(newDateMilis + timePeriodMillis);
    });

    setDatasetBuckets(buckets);

    const latestDate = dataset[0].Date;

    // intialization of global object to store the month's data we want to display
    datasetMonth = buckets[`${latestDate.getMonth() + 1} ${latestDate.getFullYear()}`];
    // intialization of global object to store the month's data we want to display

    filteredDatasetMonth = datasetMonth;
    // TODO: once React refactored, we no longer need the global filteredDatasetMonth variable

    setDatasetMonth(latestDate.getMonth() + 1, latestDate.getFullYear());
  });
}

const dateRangeInitialization = (setYearList) => {
  //Initial load of the data. Default view, no filter

  //initialize date range
  datasetLoaded.then(dataset => {
    const latestDate = dataset[0].Date;
    const earliestDate = dataset[dataset.length - 1].Date;

    latestDate.setDate(1);
    latestDate.setHours(0, 0, 0, 0);
    earliestDate.setDate(1);
    earliestDate.setHours(0, 0, 0, 0);

    let currDate = new Date(latestDate);

    const uniqueYears = new Set();
    while (currDate >= earliestDate) {
      const year = currDate.getFullYear();
      if (!uniqueYears.has(year)) {
        uniqueYears.add(year);
      }
      currDate.setMonth(currDate.getMonth() - 1);
    }
    setYearList(Array.from(uniqueYears));
  });
}

const setFilters = () => {
  datasetLoaded.then(dataset => {
    //song, artist, and album filter
    const submitFilter = document.getElementById('submit-button');
    addFilter(null, submitFilter, 'input');

    // let clickableFilters = ["album", "artist", "song"];
    // clickableFilters.forEach(type => {
    //   let clickable = document.getElementsByClassName(type);
    //   addFilter(type, clickable[0], "info");
    // });

    //multiple day filter event listener
    // let checkbox = document.getElementsByTagName('input');
    // checkbox = Array.from(checkbox).filter(input => input.type === "checkbox");
    // let checkedDays = [];
    // Array.from(checkbox).forEach(function (cb) {
    //   cb.addEventListener('change', function () {
    //     if (this.checked) {
    //       checkedDays.push(this.value);
    //     } else {
    //       checkedDays = checkedDays.filter(day => day !== this.value);
    //     }
    //     filterController("day", checkedDays);
    //   });
    // });

    //filter-input listener
    const filterInput = document.getElementById('filter-input');
    filterInput.addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
        submitFilter.dispatchEvent(new Event('click'));
      }
    });
  });
}

const finishedLoading = () => {
  //finished loading
  const loading = document.getElementById('loading');
  const content = document.getElementById('content-container');

  loading.style.display = 'none';
  content.style.display = 'block';
}

export const setup = (setDatasetBuckets, setDatasetMonth, setYearList) => {
  loadData();
  preprocessData(setDatasetBuckets, setDatasetMonth);
  dateRangeInitialization(setYearList);

  setFilters();
  finishedLoading();
}

export const getNextMonth = (month, year) => {
  // dont need to "add" a month since the date object's month indexes from
  return new Date(year, month, 1);
}

export const getPrevMonth = (month, year) => {
  // we subtract 1 for bc of month index from 0
  // we subtract another 1 to get the prev month
  return new Date(year, month - 2, 1);
}
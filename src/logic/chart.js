import * as d3 from "d3";
import { updateContrastingColors } from './colors.js';
import { getNextMonthDate, getPrevMonthDate } from './date.js'
import { displayTags, displaySongInfo } from './song-info.js';

const width = 950;
const height = 540;
const padding = { left: 90, right: 40, top: 10, down: 60 };

let filteredDatasetMonth = [];

let datasetMonth = [];
let buckets = {};
let yState = [];
let xScale = [];
let yScale = [];

//creating canvas, DOM element
let canvas = [];


/**
 * Draws the single axis vertical bar visualization
 */
export const drawCanvasBars = () => {
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

export const renderChart = () => {
  //Initialization

  //Where to add the graph to
  const svg = d3.select('#main-graph')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .classed('svg-content', true);

  canvas = d3.select('#canvas')
    .attr('width', width)
    .attr('height', 45);

  /**
   * Sets yState from the first day to the last day of the month for the given date
   * @param {*} date 
   */
  function setYState(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    yState = [lastDay, firstDay];
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
   */
  function filterController(type, value) {
    clearHighlight()
    if (type === "song") {
      filterSong(value);
      updateCircles(5, .5);
    } else if (type === "artist") {
      filterArtist(value);
      updateCircles(5, .5);
    } else if (type === "album") {
      filterAlbum(value);
      updateCircles(5, .5);
    } else if (type === "day") {
      filterDay(value);
      updateCircles(3, .3);
    }
    drawCanvasBars();
    displayNumEntries();
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
   * Filters the current month's data by the given list of days
   * @param {array} days The list of days to filter by
   */
  function filterDay(days) {
    let newDataset = [];
    days.forEach(function (day) {
      newDataset = newDataset.concat(datasetMonth.filter(d => d.Day === day));
    });
    //if no days selected, display all
    if (days.length > 0) {
      filteredDatasetMonth = newDataset;
    } else {
      filteredDatasetMonth = datasetMonth;
    }
  }

  /**
   * Filters the current month's data by the given album's name
   * @param {string} category The album's name to filter by
   */
  function filterAlbum(album) {
    filteredDatasetMonth = datasetMonth.filter(d => d.Album === album);
  }

  /**
   * Reset controller.
   * Clears all filters and selections, and updates the visualizaiton accordingly
   */
  function resetGraph() {
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
        hideInstructions();
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
        hideInstructions();
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
   * Hides the initial instructions
   */
  function hideInstructions() {
    const instructions = document.getElementById('temp-instructions');
    instructions.style.display = 'none';
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
  function changeDateRange(date) {
    setYState(date);

    // Update chart
    updateYAxis();
    filterRange(yState);
    displayNumEntries();
    updateCirclesRange();
    drawCanvasBars();
    clearDayFilters();
    setDataList();
  }

  /**
   * highlights the given point
   * @param {Pt} dot The point to highlight
   */
  function singleHighlight(dot) {
    filterController('artist', dot._groups[0][0].__data__.Artist);
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
        filterController(select.value, filterValue);
      } else if (sourceValue === "info") {
        //filter value is the text displayed in the info
        filterValue = element.innerHTML;
        select.value = type;
        input.value = filterValue;
        filterController(type, filterValue);
        changeDataList(type);
      }
    });
  }

  /**
   * Switches the current datalist to the new one
   * @param {string} value The datalist to switch too
   */
  function changeDataList(value) {
    const filterInput = document.getElementById('filter-input');
    filterInput.setAttribute('list', value + '-datalist');
  }

  //append x-axis
  var xAxisG = svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${height - padding.down})`)

  //append y-axis
  var yAxisG = svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${padding.left}, 0)`)

  //Initial load of the data. Default view, no filter

  d3.csv('/lastfm-data-utf.csv').then(dataset => {
    //convert date string to data object
    let newDate = new Date();
    newDate.setHours(0, 0, 0, 0);
    let newDateMilis = newDate.getTime();

    //sorts all the data into buckets by the month and year
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

    //initialize date range
    const latestDate = dataset[0].Date;
    const earliestDate = dataset[dataset.length - 1].Date;
    const select = document.getElementById('date-range');

    latestDate.setDate(1);
    latestDate.setHours(0, 0, 0, 0);
    earliestDate.setDate(1);
    earliestDate.setHours(0, 0, 0, 0);

    let currDate = new Date(latestDate);

    while (currDate >= earliestDate) {
      const formattedDate = `${currDate.toLocaleDateString()}`;
      const abbrevDate = `${currDate.toDateString().substring(4, 7)} ${currDate.getFullYear()}`;
      const option = new Option(abbrevDate, formattedDate);

      select.appendChild(option);

      currDate.setMonth(currDate.getMonth() - 1);
    }

    // Initialzation of global object to store state of the y-axis range
    setYState(latestDate);

    //cursor position vertical line
    let line = svg.append('path')
      .style('stroke', 'var(--secondary-color')
      .style('stroke-width', '3px')
      .style('stroke-dasharray', '4');

    svg
      .on('mousemove', function (event) {
        let mouse = d3.pointer(event);
        line.attr('d', function () {
          //d = 'M100,0 L100,460
          //move to 100,460 then line to 100,0
          let d = 'M' + mouse[0] + ',0 ';
          d += 'L' + mouse[0] + `,${height - padding.down}`;
          return d;
        });
      })
      .on('mouseover', function () {
        line.style('opacity', .4)
      })
      .on('mouseout', function () {
        line.style('opacity', 0);
      })

    //x-axis scale
    xScale = d3.scaleTime()
      .domain(d3.extent(dataset, d => d.Time))
      .range([padding.left, width - padding.right]);

    //y-axis scale
    yScale = d3.scaleTime()
      .domain(yState)
      .range([padding.top, height - padding.down]);

    //x-axis line
    var xAxis = d3.axisBottom(xScale)
      .ticks(d3.timeHour.every(2))
      .tickFormat(d3.timeFormat('%H:%M'));

    //y-axis line
    var yAxis = d3.axisLeft(yScale)

    xAxisG.call(xAxis);

    //append x-axis label
    svg.append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${(padding.left + width - padding.right) / 2}, ${height - padding.down / 4})`)
      .text('Time of Day (hrs:mins)');


    yAxisG.call(yAxis);

    //append y-axis label
    svg.append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${padding.left / 4}, ${(padding.top + height - padding.down) / 2}) rotate(-90)`)
      .text('Date');

    // intialization of global object to store the month's data we want to display
    datasetMonth = buckets[`${latestDate.getMonth() + 1} ${latestDate.getFullYear()}`];
    // intialization of global object to store the month's data we want to display
    filteredDatasetMonth = datasetMonth;

    setDataList();
    filterRange(yState);
    displayNumEntries();
    //render all data points
    renderCircles();
    drawCanvasBars();

    //song, artist, and album filter
    const submitFilter = document.getElementById('submit-button');
    addFilter(null, submitFilter, 'input');

    let clickableFilters = ["album", "artist", "song"];
    clickableFilters.forEach(type => {
      let clickable = document.getElementsByClassName(type);
      addFilter(type, clickable[0], "info");
    });

    //multiple day filter event listener
    let checkbox = document.getElementsByTagName('input');
    checkbox = Array.from(checkbox).filter(input => input.type === "checkbox");
    let checkedDays = [];
    Array.from(checkbox).forEach(function (cb) {
      cb.addEventListener('change', function () {
        if (this.checked) {
          checkedDays.push(this.value);
        } else {
          checkedDays = checkedDays.filter(day => day !== this.value);
        }
        filterController("day", checkedDays);
      });
    });

    //change date range
    let selectList = document.getElementById("date-range");
    selectList.addEventListener("change", function () {
      let selectedValue = selectList.options[selectList.selectedIndex].value;
      let date = new Date(selectedValue);
      changeDateRange(date);
    });

    //reset button
    let resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", function () {
      resetGraph();
    });

    //left/right buttons
    let nextButton = document.getElementById('right');
    nextButton.addEventListener("click", function () {
      const nextMonth = getNextMonthDate();
      if (nextMonth !== -1) changeDateRange(nextMonth);
    });
    let prevButton = document.getElementById('left');
    prevButton.addEventListener("click", function () {
      const prevMonth = getPrevMonthDate();
      if (prevMonth !== -1) changeDateRange(prevMonth);
    });

    //change datalist
    const filterSelect = document.getElementById('filter-select');
    filterSelect.addEventListener('change', function () {
      console.log(`datalist changed to: ${filterSelect.value}`);
      changeDataList(filterSelect.value);
    });

    //filter-input listener
    const filterInput = document.getElementById('filter-input');
    filterInput.addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
        submitFilter.dispatchEvent(new Event('click'));
      }
    });

    //theme switcher listener
    // const themeSwitcher = document.getElementById('theme-switcher');
    // themeSwitcher.addEventListener('click', function () {
    //   const body = document.getElementsByTagName('body');
    //   if (themeSwitcher.classList.contains('moon')) {
    //     themeSwitcher.innerHTML = (<FontAwesomeIcon icon={faSun}/>);
    //     body.className = 'light-theme';
    //     themeSwitcher.className = 'sun';
    //   } else {
    //     themeSwitcher.innerHTML = (<FontAwesomeIcon icon={faMoon}/>);
    //     body.className = '';
    //     themeSwitcher.className = 'moon';
    //   }

    //   style = getComputedStyle(document.body);
    //   rgb = style.getPropertyValue('--default-rgb');
    //   drawCanvasBars();
    //   updateContrastingColors();
    // })

    //finished loading
    const loading = document.getElementById('loading');
    const content = document.getElementById('content-container');

    loading.style.display = 'none';
    content.style.display = 'block';
  });
}

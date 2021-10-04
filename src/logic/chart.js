import * as d3 from "d3";

let datasetLoaded = [];
let buckets = {};

/**
 * Generates the yState for the month given a date in the month
 * @param {Date} date Date object whose date is in the month
 * @returns Array consisting of 2 elements: the last day and first day of the month
 */
export function generateYState(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const yState = [lastDay, firstDay];
  return yState;
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
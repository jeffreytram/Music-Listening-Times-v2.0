import * as d3 from "d3";

let datasetLoaded = [];

/**
 * Generates the yState for the month given a date in the month
 * @param {Date} date Date object whose date is in the month
 * @returns Array consisting of 2 elements: the last day and first day of the month
 */
export function generateYState(date, timePeriod) {
  if (timePeriod === 'monthly') {
    // get first day and last day of the month
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const yState = [lastDay, firstDay];
    return yState;
  } else if (timePeriod === 'yearly') {
    // get first day and last day of the year
    const year = date.getFullYear();
    const firstDay = new Date(`1 1 ${year}`);
    const lastDay = new Date(`1 1 ${year + 1}`);
    lastDay.setDate(lastDay.getDate() - 1);
    const yState = [lastDay, firstDay];
    return yState;
  } else {
    // get first data point and last data point
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
  const keys = ['Song', 'Artist', 'Album'];
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
 * @param {Function} changeDataset
 */
const examplePreprocessData = (dispatchData) => {
  datasetLoaded.then(dataset => {
    preprocessData(dataset, dispatchData);
  });
}

/**
 * Processes the data into buckets
 * @param {Function} dispatchData
 * @param {Function} changeDataset
 */
const preprocessData = (dataset, dispatchData) => {
  //sorts all the data into buckets by the month and year
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const dataMap = new Map();

  for (let i = 0; i < dataset.length; i++) {
    const d = dataset[i];

    // Some songs have blank RawDateTime's for some reason, skip these values
    if (!d.RawDateTime) {
      // remove the invalid data point from the dataset
      dataset.splice(i, 1);
      i--;
      continue;
    }

    d.ConvertedDateTime = new Date(d.RawDateTime);

    // minus 5 for BST -> EDT conversion
    // This conversion will be off by an hour or so during times of daylight savings transition
    // TODO: get user's timezone, allow user to input timezone to convert 
    d.ConvertedDateTime.setHours(d.ConvertedDateTime.getHours() - 5);
    d.Date = new Date(d.ConvertedDateTime.toDateString());
    d.Time = new Date().setHours(d.ConvertedDateTime.getHours(), d.ConvertedDateTime.getMinutes());
    d.Day = days[d.ConvertedDateTime.getDay()];

    const yearKey = (d.Date.getFullYear());
    if (!dataMap.has(yearKey)) {
      dataMap.set(yearKey, { yearArr: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] });
    }

    const yearData = dataMap.get(yearKey);
    const monthBucket = yearData[d.Date.getMonth() + 1];

    d.monthID = monthBucket.length;
    d.yearID = yearData.yearArr.length;
    d.ID = i;

    monthBucket.push(d);
    yearData.yearArr.push(d);
  }


  const latestDate = new Date(`${dataset[0].Date.getMonth() + 2} 1 ${dataset[0].Date.getFullYear()}`);
  const earliestDate = new Date(dataset[dataset.length - 1].Date);
  const timeRange = [earliestDate, latestDate];
  const yearList = getYearList(earliestDate, latestDate);

  latestDate.setHours(0, 0, 0, latestDate.getMilliseconds() - 1);
  earliestDate.setDate(1);

  const init = {
    datasetBuckets: dataMap,
    entireDataset: dataset,
    timeRange: timeRange,
    yearList: yearList,
  };

  dispatchData({
    type: 'init',
    init: init,
  })
}

/**
 * Initializes the date range (list of years)
 * @param {Function} setYearList Sets the year list to the given list
 */
const getYearList = (earliestDate, latestDate) => {
  const latestYear = latestDate.getFullYear();
  const earliestYear = earliestDate.getFullYear();

  let currYear = latestYear;

  let uniqueYears = [];
  while (currYear >= earliestYear) {
    uniqueYears.push(currYear);
    currYear -= 1;
  }
  return uniqueYears;
}

/**
 * Setup for the application
 * @param {Function} dispatchData
 */
export const setup = (dispatchData) => {
  loadData();
  examplePreprocessData(dispatchData);
}

export const uploadedDataSetup = (data, dispatchData) => {
  preprocessData(data, dispatchData);
}

/**
 * Gets the next month
 * @param {number} month The numerical month you use normally (1 = Janurary, 12 = December)
 * @param {number} year The numerical full year (ex: 2021)
 * @returns Next month as a Date object
 */
export const getNextMonth = (month, year) => {
  // dont need to "add" a month since the date object's month indexes from
  return new Date(year, month, 1);
}

/**
 * Gets the previous month
 * @param {number} month The numerical month you use normally (1 = Janurary, 12 = December)
 * @param {number} year The numerical full year (ex: 2021)
 * @returns Previous month as a Date object
 */
export const getPrevMonth = (month, year) => {
  // we subtract 1 for bc of month index from 0
  // we subtract another 1 to get the prev month
  return new Date(year, month - 2, 1);
}
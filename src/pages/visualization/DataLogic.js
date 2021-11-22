import { useReducer } from 'react';

function useData() {
  const [data, dispatchData] = useReducer(datasetReducer, initialState);

  return { data, dispatchData };
}

function datasetReducer(state, { type, nMonth, nYear, datasetBuckets, value, dataset, datalistSetting }) {
  switch (type) {
    // handle month time change while on monthly time period view
    case 'monthly-month-change': {
      const year = state.year;
      const newDataset = datasetBuckets.get(year)[nMonth];
      return {
        ...state,
        dataset: newDataset,
        filteredDataset: newDataset,
        month: nMonth,
        filterView: 'default',
        dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
        clickedPoint: -1,
      };
    }
    // handle year time change while on monthly time period view
    case 'monthly-year-change': {
      const month = state.month;
      const newDataset = datasetBuckets.get(nYear)[month];
      return {
        ...state,
        dataset: newDataset,
        filteredDataset: newDataset,
        year: nYear,
        filterView: 'default',
        dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
        clickedPoint: -1,
      };
    }
    // handle year time change while on yearly time period view
    // handle next/prev year change
    case 'year-change': {
      const newDataset = datasetBuckets.get(nYear)['yearArr'];
      return {
        ...state,
        dataset: newDataset,
        filteredDataset: newDataset,
        year: nYear,
        filterView: 'default',
        dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
        clickedPoint: -1,
      };
    }
    // handle click on monthly time period
    case 'change-to-monthly': {
      const month = state.month;
      const year = state.year;
      const newDataset = datasetBuckets.get(year)[month];
      return {
        ...state,
        dataset: newDataset,
        filteredDataset: newDataset,
        timePeriod: 'monthly',
        filterView: 'default',
        dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
        clickedPoint: -1,
      };
    }
    // handle click on yearly time period
    case 'change-to-yearly': {
      const year = state.year;
      const newDataset = datasetBuckets.get(year)['yearArr'];
      return {
        ...state,
        dataset: newDataset,
        filteredDataset: newDataset,
        timePeriod: 'yearly',
        filterView: 'default',
        dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
        clickedPoint: -1,
      };
    }
    // handle next/prev month arrow click
    case 'month-change': {
      const newDataset = datasetBuckets.get(nYear)[nMonth];
      return {
        ...state,
        dataset: newDataset,
        filteredDataset: newDataset,
        month: nMonth,
        year: nYear,
        filterView: 'default',
        dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
        clickedPoint: -1,
      };
    }

    // handle search filter
    case 'search': {
      const newFilteredDataset = searchFilter(datalistSetting, value, dataset);
      return {
        ...state,
        filteredDataset: newFilteredDataset,
        filterView: 'search',
        dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
      };
    }
    // handle day filter
    case 'day': {
      const newFilteredDataset = filterDay(state.dayFilter, dataset);
      return {
        ...state,
        filteredDataset: newFilteredDataset,
        filterView: 'day',
      };
    }

    // handle point click filter
    case 'select': {
      const newFilteredDataset = [value]
      return {
        filteredDataset: newFilteredDataset,
        filterView: 'select',
        dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
        clickedPoint: value.ID,
      }
    }

    // handle day button filter click
    case 'toggle-day-filter': {
      const day = value;
      const newDayFilter = { ...state.dayFilter, [day]: !state.dayFilter[day] };
      const newFilteredDataset = filterDay(newDayFilter, dataset);
      return {
        ...state,
        filteredDataset: newFilteredDataset,
        filterView: 'day',
        dayFilter: newDayFilter,
      };
    }

    // handle reset button
    case 'reset': {
      return {
        filteredDataset: state.dataset,
        filterView: 'default',
        dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
        clickedPoint: -1,
      };
    }
    default:
      return state;
  }
}

export default useData;

const initialState = {
  dataset: [],
  filteredDataset: [],
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  timePeriod: 'monthly',
  filterView: 'default',
  dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
  clickedPoint: -1,
}


/**
 * Handles filter functionality
 * @param {string} type the type of filter
 * @param {string} value the value to filter by
 * @param {array} dataset the data to filter
 * @returns the filtered dataset
 */
function searchFilter(type, value, dataset) {
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
const filterDay = (dayFilter, dataset) => {
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

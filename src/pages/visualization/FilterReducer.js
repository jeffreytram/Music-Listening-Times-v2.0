import { useReducer, useEffect } from 'react';

function useFilter(dataset) {
  const [filter, dispatchFilter] = useReducer(filterReducer, initialState(dataset));

  useEffect(() => {
    dispatchFilter({ type: 'default', dataset: dataset });
  }, [dataset]);

  return { filter, dispatchFilter };
}

export default useFilter;

function filterReducer(state, { type, value, dataset, datalistSetting }) {
  switch (type) {
    case 'default': {
      return {
        filteredDataset: dataset,
        filterView: 'default',
        dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
        clickedPoint: -1,
      }
    }
    case 'search': {
      const newFilteredDataset = searchFilter(datalistSetting, value, dataset);
      return {
        ...state,
        filteredDataset: newFilteredDataset,
        filterView: 'search',
        dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
      };
    }
    case 'day': {
      const newFilteredDataset = filterDay(state.dayFilter, dataset);
      return {
        ...state,
        filteredDataset: newFilteredDataset,
        filterView: 'day',
      };
    }
    case 'select': {
      const newFilteredDataset = [value]
      return {
        filteredDataset: newFilteredDataset,
        filterView: 'select',
        dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
        clickedPoint: value.ID,
      }
    }
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
    default:
      return state;
  }
}

const initialState = (dataset) => {
  return {
    filteredDataset: dataset,
    filterView: 'default',
    dayFilter: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
    clickedPoint: -1,
  }
};

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
import { searchFilter } from '../logic/chart';

export const SongInfoLogic = ({ clickedPoint, data, entireDataset, timePeriod }) => {
  let dataset = data;
  if (data === undefined) dataset = [];

  let point = entireDataset[clickedPoint];
  if (point === undefined) point = {};

  const visibility = (point.Artist === undefined) ? 'hidden' : '';

  let leftArrowVisibility;
  let rightArrowVisibility;

  if (timePeriod === 'monthly') {
    leftArrowVisibility = (point.monthID < dataset.length - 1) ? '' : 'disabled-arrow';
    rightArrowVisibility = (point.monthID > 0) ? '' : 'disabled-arrow';
  } else if (timePeriod === 'yearly') {
    leftArrowVisibility = (point.yearID < dataset.length - 1) ? '' : 'disabled-arrow';
    rightArrowVisibility = (point.yearID > 0) ? '' : 'disabled-arrow';
  }
  return { dataset, point, visibility, leftArrowVisibility, rightArrowVisibility };
};

export const SongInfoHandler = ({ setFilteredDataset, setClickedPoint, clickedPoint, entireDataset, setSearchType, data }) => {
  const handlePointChange = (change) => {
    // filterView is assumed to be in 'select'

    const newID = clickedPoint + change;
    // check if valid change, if out of range dont do anything
    if (newID >= 0 && newID < entireDataset.length) {
      // need to change filtereddatasetmonth 
      setFilteredDataset([entireDataset[newID]], 'select');
      setClickedPoint(newID);
    }
  }

  const handleInfoClick = (type, value) => {
    // set the datalist setting to artist
    setSearchType(type);

    // filter the dataset
    const filteredDataset = searchFilter(type, value, data);
    setFilteredDataset(filteredDataset, 'search');
  }

  return { handlePointChange, handleInfoClick };
};
import React from 'react';
import { searchFilter } from '../logic/chart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons'

export default class SongInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleInfoClick = (type, value) => {
    const { setFilteredDataset, setSearchType, data } = this.props;

    // set the datalist setting to artist
    setSearchType(type);

    // filter the dataset
    const filteredDataset = searchFilter(type, value, data);
    setFilteredDataset(filteredDataset, 'search');
  }

  handlePointChange = (change) => {
    // filterView is assumed to be in 'select'
    const { setFilteredDataset, setClickedPoint, clickedPoint, data } = this.props;

    const newId = clickedPoint + change;
    // check if valid change, if out of range dont do anything
    if (newId >= 0 && newId < data.length) {
      // need to change filtereddatasetmonth 
      setFilteredDataset([data[newId]], 'select');
      setClickedPoint(newId);
    }

  }

  render() {
    const { clickedPoint, data } = this.props;

    let dataset = data;
    if (data === undefined) dataset = [];

    let point = dataset[clickedPoint];
    if (point === undefined) point = {};

    const visibility = (point.Artist === undefined) ? 'hidden' : '';

    const leftArrowVisibility = (clickedPoint === dataset.length - 1) ? 'disabled-arrow' : '';
    const rightArrowVisibility = (clickedPoint === 0) ? 'disabled-arrow' : '';
    return (
      <div className={`song-info-grid ${visibility}`}>
        <img id="album-art"
          src="https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png" />
        <div className="info">
          <span className="artist" onClick={() => this.handleInfoClick('artist', point.Artist)}>{point.Artist}
          </span> - <span className="song" onClick={() => this.handleInfoClick('song', point.Song)}>{point.Song}</span>
        </div>
        <div className="info album" onClick={() => this.handleInfoClick('album', point.Album)}>{point.Album}</div>
        <div className="info date">{(point.ConvertedDateTime) ? point.ConvertedDateTime.toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }) : ''}</div>
        <div className="song-arrows">
          <FontAwesomeIcon icon={faLongArrowAltLeft}
            onClick={() => this.handlePointChange(1)}
            className={`${leftArrowVisibility} arrow`}
            title="Go to next point"
          />
          <FontAwesomeIcon icon={faLongArrowAltRight}
            onClick={() => this.handlePointChange(-1)}
            className={`${rightArrowVisibility} arrow`}
            style={{ marginLeft: '10px' }}
            title="Go to the previous point"
          />
        </div>
        <div id="tagList">{ }</div>
      </div>
    );
  }
}
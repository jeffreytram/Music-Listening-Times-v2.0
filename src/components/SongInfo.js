import React from 'react';
import { searchFilter } from '../logic/chart';
export default class SongInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleInfoClick = (type, value) => {
    const { setFilteredDatasetMonth, setSearchType, data } = this.props;

    // set the datalist setting to artist
    setSearchType(type);

    // filter the dataset
    const filteredDataset = searchFilter(type, value, data);
    setFilteredDatasetMonth(filteredDataset);
  }

  render() {
    const { clickedPoint } = this.props;
    const visibility = (clickedPoint.Artist === undefined) ? 'hidden' : '';
    return (
      <div className={`song-info-grid ${visibility}`}>
        <img id="album-art"
          src="https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png" />
        <div className="info">
          <span className="artist" onClick={() => this.handleInfoClick('artist', clickedPoint.Artist)}>{clickedPoint.Artist}
          </span> - <span className="song" onClick={() => this.handleInfoClick('song', clickedPoint.SongTitle)}>{clickedPoint.SongTitle}</span>
        </div>
        <div className="info album" onClick={() => this.handleInfoClick('album', clickedPoint.Album)}>{clickedPoint.Album}</div>
        <div className="info date">{clickedPoint.Day + ' ' + clickedPoint.ConvertedDateTime}</div>
        <div id="tagList">{ }</div>
      </div>
    );
  }
}
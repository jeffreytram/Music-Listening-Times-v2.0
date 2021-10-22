import React, { useState } from 'react';
import { searchFilter } from '../logic/chart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons'

export default function SongInfo(props) {
  const handleInfoClick = (type, value) => {
    const { setFilteredDataset, setSearchType, data } = props;

    // set the datalist setting to artist
    setSearchType(type);

    // filter the dataset
    const filteredDataset = searchFilter(type, value, data);
    setFilteredDataset(filteredDataset, 'search');
  };

  const handlePointChange = (change) => {
    // filterView is assumed to be in 'select'
    const { setFilteredDataset, setClickedPoint, clickedPoint, entireDataset } = props;

    const newID = clickedPoint + change;
    // check if valid change, if out of range dont do anything
    if (newID >= 0 && newID < entireDataset.length) {
      // need to change filtereddatasetmonth 
      setFilteredDataset([entireDataset[newID]], 'select');
      setClickedPoint(newID);
    }
  }

  const { clickedPoint, data, entireDataset, timePeriod } = props;

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

  const [imageSrc, setImageSrc] = useState("https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png");

  fetchImage(point.Artist, point.Album, setImageSrc);

  return (
    <div className={`song-info-grid ${visibility}`}>
      <img id="album-art" alt="placeholder"
        src={imageSrc} />
      <div className="info">
        <span className="artist" onClick={() => handleInfoClick('artist', point.Artist)}>{point.Artist}
        </span> - <span className="song" onClick={() => handleInfoClick('song', point.Song)}>{point.Song}</span>
      </div>
      <div className="info album" onClick={() => handleInfoClick('album', point.Album)}>{point.Album}</div>
      <div className="info date">{(point.ConvertedDateTime) ? point.ConvertedDateTime.toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }) : ''}</div>
      <div className="song-arrows">
        <FontAwesomeIcon icon={faLongArrowAltLeft}
          onClick={() => handlePointChange(1)}
          className={`${leftArrowVisibility} arrow`}
          title="Go to next point"
        />
        <FontAwesomeIcon icon={faLongArrowAltRight}
          onClick={() => handlePointChange(-1)}
          className={`${rightArrowVisibility} arrow`}
          style={{ marginLeft: '10px' }}
          title="Go to the previous point"
        />
      </div>
      <div id="tagList">{ }</div>
    </div>
  )
}

const fetchImage = (artist, album, setImageSrc) => {
  const LASTFM_KEY = 'INSERT KEY HERE';

  const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${LASTFM_KEY}&artist=${artist}&album=${album}&format=json`;
  // const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=${song.Artist}&api_key=${LASTFM_KEY}&format=json`;


  // album info
  fetch(apiUrl)
    .then(response => response.json())
    .then(json => {
      const imageSrc = (json.album) ? json.album.image[2]["#text"] : '';
      if (imageSrc === '') {
        // set image if album art link exists
        setImageSrc('https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png');
      }  else {
        setImageSrc(imageSrc);
      }
    });
}
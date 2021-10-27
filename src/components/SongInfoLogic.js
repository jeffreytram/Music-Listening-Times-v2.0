import { useState, useEffect } from 'react'
import { getFunctions, httpsCallable } from '@firebase/functions';
import { searchFilter } from '../logic/chart';

export const SongInfoLogic = (clickedPoint, data, entireDataset, timePeriod) => {
  let dataset = data;
  if (data === undefined) dataset = [];

  let point = entireDataset[clickedPoint];
  if (point === undefined) point = {};

  let leftArrowVisibility;
  let rightArrowVisibility;

  if (timePeriod === 'monthly') {
    leftArrowVisibility = (point.monthID < dataset.length - 1) ? '' : 'disabled-arrow';
    rightArrowVisibility = (point.monthID > 0) ? '' : 'disabled-arrow';
  } else if (timePeriod === 'yearly') {
    leftArrowVisibility = (point.yearID < dataset.length - 1) ? '' : 'disabled-arrow';
    rightArrowVisibility = (point.yearID > 0) ? '' : 'disabled-arrow';
  }
  return { dataset, point, leftArrowVisibility, rightArrowVisibility };
};

export const SongInfoHandler = (setFilteredDataset, setClickedPoint, clickedPoint, entireDataset, setSearchType, data) => {
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

export const FetchAlbumInfo = (point) => {
  const defaultImage = 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png';
  const [albumArt, setAlbumArt] = useState(defaultImage);

  useEffect(() => {
    const functions = getFunctions();
    const getAlbumInfo = httpsCallable(functions, 'getAlbumInfo');
    getAlbumInfo(point).then(result => {
      console.log(result);
      const albumInfo = JSON.parse(result.data);
      let albumLink = albumInfo.album.image[2]['#text'];
      if (albumLink === '') {
        albumLink = defaultImage;
      }
      setAlbumArt(albumLink);
      // setContrastingColors(albumLink);
    })
      .catch(error => {
        // setContrastingColors(defaultImage);
        setAlbumArt(defaultImage);
        console.log(error);
      });
  }, [point]);

  return { albumArt };
};

export const FetchArtistTags = (artist) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const functions = getFunctions();
    const getArtistTags = httpsCallable(functions, 'getArtistTags');
    getArtistTags(artist).then(result => {
      console.log(result);
      const tags = JSON.parse(result.data);

      let apiTags = tags.toptags.tag;
      let topFiveTagObjects = apiTags.slice(0, 5);

      let topFiveTagNames = topFiveTagObjects.map(obj => obj.name);

      setTags(topFiveTagNames);
    })
      .catch(error => {
        console.log(error);
        setTags([]);
      });
  }, [artist]);

  return { tags };
}
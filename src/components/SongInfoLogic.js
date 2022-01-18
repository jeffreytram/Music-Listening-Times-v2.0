import { useState, useEffect } from 'react'
import { getFunctions, httpsCallable } from '@firebase/functions';
import { setContrastingColors } from '../logic/colors';

export const useSongInfo = (clickedPoint, data, entireDataset, timePeriod) => {
  const point = entireDataset[clickedPoint];

  const id = (timePeriod === 'monthly') ? 'monthID' : 'yearID';

  const leftArrowVisibility = (point[id] < data.length - 1) ? '' : 'disabled-arrow';
  const rightArrowVisibility = (point[id] > 0) ? '' : 'disabled-arrow';

  return { point, leftArrowVisibility, rightArrowVisibility };
};

export const SongInfoHandler = (dispatchFilter, clickedPoint, entireDataset, setDatalistSetting, data) => {
  const handlePointChange = (change) => {
    // filterView is assumed to be in 'select'
    const newID = clickedPoint + change;
    // check if valid change, if out of range dont do anything
    if (newID >= 0 && newID < entireDataset.length) {
      // need to change filtereddatasetmonth 
      dispatchFilter({ type: 'select', value: entireDataset[newID] });
    }
  }

  const handleInfoClick = (type, value) => {
    // set the datalist setting to artist
    setDatalistSetting(type);
    dispatchFilter({ type: 'search', value: value, dataset: data, datalistSetting: type });
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
      const albumInfo = JSON.parse(result.data);
      let albumLink = albumInfo.album.image[2]['#text'];
      if (albumLink === '') {
        albumLink = defaultImage;
      }
      setAlbumArt(albumLink);
      setContrastingColors(albumLink);
    })
      .catch(error => {
        setContrastingColors(defaultImage);
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
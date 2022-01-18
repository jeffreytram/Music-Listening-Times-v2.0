import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons'
import { useSongInfo, SongInfoHandler, FetchAlbumInfo, FetchArtistTags } from './SongInfoLogic';

export default function SongInfo({ clickedPoint, data, entireDataset, timePeriod, dispatchFilter, setDatalistSetting }) {
  const { point, leftArrowVisibility, rightArrowVisibility } = useSongInfo(clickedPoint, data, entireDataset, timePeriod);

  const { handlePointChange, handleInfoClick } = SongInfoHandler(dispatchFilter, clickedPoint, entireDataset, setDatalistSetting, data);

  const { albumArt } = FetchAlbumInfo(point);

  const { tags } = FetchArtistTags(point.Artist);
  return (
    <div className="song-info-grid">
      <img id="album-art" alt="placeholder"
        src={albumArt} />
      <div className="info">
        <span className="artist" onClick={() => handleInfoClick('artist', point.Artist)}>{point.Artist}
        </span> - <span className="song" onClick={() => handleInfoClick('song', point.Song)}>{point.Song}</span>
      </div>
      <div className="info album" onClick={() => handleInfoClick('album', point.Album)}>{point.Album}</div>
      <div className="tagList">
        {tags.map((tag) => {
          return (<span className="tag">{tag}</span>)
        })}
      </div>
      <div className="info date">{(point.ConvertedDateTime) ? point.ConvertedDateTime.toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }) : ''}</div>
      <div className="song-arrows">
        <FontAwesomeIcon icon={faLongArrowAltLeft}
          onClick={() => handlePointChange(1)}
          className={`${leftArrowVisibility} arrow`}
          title="Go to previous point"
        />
        <FontAwesomeIcon icon={faLongArrowAltRight}
          onClick={() => handlePointChange(-1)}
          className={`${rightArrowVisibility} arrow`}
          style={{ marginLeft: '10px' }}
          title="Go to the next point"
        />
      </div>
    </div>
  );
}
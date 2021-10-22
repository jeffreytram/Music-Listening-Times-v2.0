import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons'
import { SongInfoLogic, SongInfoHandler } from './SongInfoLogic';

export default function SongInfo(props) {
  const { point, visibility, leftArrowVisibility, rightArrowVisibility } = SongInfoLogic(props);

  const { handlePointChange, handleInfoClick } = SongInfoHandler(props);
  return (
    <div className={`song-info-grid ${visibility}`}>
      <img id="album-art" alt="placeholder"
        src="https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png" />
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
  );
}
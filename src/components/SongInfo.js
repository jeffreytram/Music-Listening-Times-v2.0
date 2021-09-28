import React from 'react';

export default class SongInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  render() {
    const { clickedPoint } = this.props;
    return (
      <div id="song-info-container">
        <div id="song-info" className="hide">
          <div>
            <span className="info artist">{clickedPoint.Artist}</span> - <span className="info song">{clickedPoint.SongTitle}</span>
          </div>
          <div className="info art">
            <img id="album-art"
              src="https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png" />
          </div>
          <div className="info album">{clickedPoint.Album}</div>
          <div className="info date">{clickedPoint.Day + ' ' + clickedPoint.ConvertedDateTime}</div>
          <div id="tagList">{}</div>
        </div>
      </div>
    );
  }
}
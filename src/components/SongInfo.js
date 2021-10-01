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
      <div id="song-info-grid">
        <img id="album-art"
          src="https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png" />
        <div>
          <span className="info artist">{clickedPoint.Artist}</span> - <span className="info song">{clickedPoint.SongTitle}</span>
        </div>
        <div className="info album">{clickedPoint.Album}</div>
        <div className="info date">{clickedPoint.Day + ' ' + clickedPoint.ConvertedDateTime}</div>
        <div id="tagList">{ }</div>
      </div>
    );
  }
}
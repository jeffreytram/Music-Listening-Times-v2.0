import screenshot from '../../images/excel-screenshot.PNG';
import './import.css';

function Import(props) {
  return (
    <div className="site-container">
      <h1>Importing a CSV</h1>
      <h2>How to import your own LastFM data into the application</h2>
      <h3>Steps:</h3>
      <ol>
        <li>Go to <a href="https://benjaminbenben.com/lastfm-to-csv/"><strong>benjaminbenben.com/lastfm-to-csv/</strong></a></li>
        <li>Enter your <strong>LastFM username</strong></li>
        <li>Click <strong>Fetch track</strong> to export your data into a CSV</li>
        <li><strong>Save/Download the CSV</strong> after it is done fetching</li>
        <li><strong>Open the CSV</strong></li>
        <li><strong>Insert a new row at the very top.</strong> This will be the header row</li>
        <li>Add the headers exactly as followed in the same order and case sensitivity</li>
        <ul>
          <li><strong>Artist, Album, Song, RawDateTime</strong></li>
        </ul>
        <img className="screenshot" src={screenshot} alt="excel example" />
        <li>Ensure you've entered the headers exactly as written to limit errors with the application</li>
        <li><strong>Save the CSV</strong></li>
        <li><strong>Import the CSV</strong> into Music Listening Times</li>
      </ol>
    </div>
  )
}

export default Import;
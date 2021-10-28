import './home.css';

function Home(props) {
  return (
    <div className="home-page-container">
      <div className="content-grid">
        <div className="title-container">
          <h1 className="home-title">Music Listening Times</h1>
        </div>
        <div className="diamond-container">
          <button className="larger-diamond-shape diamond-button d1">
            <div className="diamond-text">Import CSV</div>
          </button>
          <button className="smaller-diamond-shape diamond-button d2">
            <div className="diamond-text">View Example</div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home;
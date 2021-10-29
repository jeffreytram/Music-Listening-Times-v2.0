import { Link } from "react-router-dom";
import './home.css';

function Home(props) {
  return (
    <div className="home-page-container">
      <div className="content-grid">
        <div className="title-container">
          <h1 className="home-title">Music Listening Times</h1>
          <p>explore your music listening trends</p>
        </div>
        <div className="diamond-container">
          <Link to="/import">
            <button className="larger-diamond-shape diamond-button d1">
              <div className="diamond-text">Import CSV</div>
            </button>
          </Link>
          <Link to="/visualize">
            <button className="smaller-diamond-shape diamond-button d2">
              <div className="diamond-text">View Example</div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home;
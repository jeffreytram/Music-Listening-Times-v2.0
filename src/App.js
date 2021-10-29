import Visualization from './pages/visualization/Visualization';
import Home from './pages/home/Home';
import Import from './pages/import/Import';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App(props) {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/visualize">
          <Visualization />
        </Route>
        <Route exact path="/import">
          <Import />
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import firebase from './firebase';

import * as serviceWorker from './serviceWorker';

import 'semantic-ui-css/semantic.min.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from 'react-router-dom';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

// global state
const store = createStore(() => {}, composeWithDevTools());

class Root extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.history.push('/');
      }
    });
  }

  render() {
    return (
      <Switch>
        <Route exact path='/' component={App}></Route>
        <Route path='/Login' component={Login}></Route>
        <Route path='/Register' component={Register}></Route>
      </Switch>
    );
  }
}

const RootWithAuth = withRouter(Root);

ReactDOM.render(
  // Provider component === to provide gobal state to all of component
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

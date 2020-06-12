import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

import Header from './components/Header';
import Footer from './components/Header';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Overlay from './components/Overlay';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path='/overlay/:username/:theme' component={Overlay} />
            <>
              <Header />
              <Route exact path='/' component={Landing} />
              <Route exact path='/dashboard' component={Dashboard} />
              {/* <Route exact path='/login' component={Login} />
              <Route exact path='/create-account' component={Register} />
              <Route exact path='/forgot-password' component={ForgotPassword} /> */}
              <Footer />
            </>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, actions)(App);

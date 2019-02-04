import React, { Component } from 'react';

import Layout from './components/Layout/Layout'
import HomePage from './containers/HomePage/HomePage';

class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          <HomePage />
        </Layout>
      </div>
    );
  }
}

export default App;

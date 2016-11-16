import React, { Component, PropTypes } from 'react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import Helmet from 'react-helmet'
//import defaultLayout from '../../config/layout'
//import clone from 'clone'
class AppContainer extends Component {
  static propTypes = {
    layout: PropTypes.object,
    history: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    routerKey: PropTypes.number,
    store: PropTypes.object.isRequired
  }

  shouldComponentUpdate () {
   // return false
  }

  render () {
    const { layout, history, routes, routerKey, store } = this.props
    console.log('render app');
    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Helmet {...layout} />
          <Router history={history} children={routes} key={routerKey} />
        </div>
      </Provider>
    )
  }
}

export default AppContainer

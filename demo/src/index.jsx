require('./index.html') //for the webpack build
require('./styles.css')

import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, Redirect} from 'react-router'
import App from './App'
import About from './About'
import Demo from './Demo'

import injectTapEventPlugin from 'react-tap-event-plugin'
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()


// ReactDOM.render(<Router>
//   <Route Component={App}>
//     <Route path="about" Component={About}/>
//     <Route path="demo/:name" Component={Demo}/>
//     <Redirect from='*' to='/demo/update-and-animate-transform' />
//   </Route>
// </Router>, document.querySelector('#react-mount'))
ReactDOM.render((
  <Router>
    <Route component={App}>
      <Route path="about" component={About} />
      <Route path="demo/:name" component={Demo} />
      <Redirect from='*' to='/demo/update-and-animate-transform' />
    </Route>
  </Router>
), document.querySelector('#react-mount'))

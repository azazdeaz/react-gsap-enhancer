require('./index.html') //for the webpack build
require('./styles.css')

import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, Redirect} from 'react-router'
import App from './App'
import About from './About'
import Demo from './Demo'

ReactDOM.render(<Router>
  <Route Component={App}>
    <Route path="about" Component={About}/>
    <Route path="demo/:name" Component={Demo}/>
    <Redirect from='*' to='/demo/update-and-animate-transform' />
  </Route>
</Router>, document.querySelector('#react-mount'))

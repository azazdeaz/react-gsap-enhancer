require('./index.html') //for the webpack build
require('./styles.css')

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import React from 'react'
import Router, {Route, Redirect} from 'react-router'
import App from './App'
import About from './About'
import Demo from './Demo'


var routes = (
  <Route handler={App}>
    <Route path="about" handler={About}/>
    <Route path="demo/:name" handler={Demo}/>
    <Redirect from='*' to='/demo/update-and-animate-transform' />
  </Route>
)

Router.run(routes, Router.HashLocation, (Root, state) => {
  React.render(<Root/>, document.querySelector('#react-mount'))
  if (window.onNameParamChange) {
    window.onNameParamChange(state.params.name)
  }
})

import React from 'react'
import {RouteHandler} from 'react-router'
import demoSources from './demoSources'
import map from 'lodash/collection/map'

import {AppBar, Styles,IconButton, MenuItem, LeftNav, Menu} from 'material-ui'
var theme = new Styles.ThemeManager()
theme.setTheme(theme.types.DARK)
console.log({demoSources})
var menuItems = [
  { type: MenuItem.Types.SUBHEADER, text: 'Demos' },
  ...map(demoSources, (source, name) => {
    return { route: '/demo/' + name, text: name }
  })
]

export default class App extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.func
  }

  getChildContext() {
    return {
      muiTheme: theme.getCurrentTheme()
    }
  }

  showNav = () => {
    this.refs.leftNav.toggle()
  }

  handleNavChange = (e, idx, payload) => {
    this.context.router.transitionTo(payload.route);
  }

  render () {
    return (
      <div>
        <AppBar
          title="GSAP-HoC"
          iconElementLeft={
            <IconButton
              iconClassName='fa fa-paw'
              onClick={this.showNav}/>
          }/>
        <div style={{display: 'flex'}}>
          <LeftNav ref="leftNav"
            onChange = {this.handleNavChange}
            docked = {false}
            menuItems = {menuItems} />
          <RouteHandler/>
        </div>
      </div>
    )
  }
}

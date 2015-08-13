import React from 'react'
import {RouteHandler} from 'react-router'
import demoSources from './demoSources'
import map from 'lodash/collection/map'
import findIndex from 'lodash/array/findIndex'
import startCase from 'lodash/string/startCase'

import {AppBar, Styles, IconButton, DropDownMenu, MenuItem} from 'material-ui'
var theme = new Styles.ThemeManager()
theme.setTheme(theme.types.DARK)

theme.setComponentThemes({
  appBar: {
    color: '#121212',
    // textColor: '#88ce02',
  }
})

var menuItems = [
  { type: MenuItem.Types.SUBHEADER, text: 'Demos:' },
  ...map(demoSources, (source, name) => {
    return { route: '/demo/' + name, text: startCase(name), name }
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
    this.context.router.transitionTo(payload.route)
  }

  handleClickGithub = () => {
    window.open('https://github.com/azazdeaz/react-gsap-enhancer')
  }

  render () {
    return (
      <div style={{
          display: 'flex',
          flexDirection: 'column',
          height:'100vh',
        }}>
        <AppBar
          title="Demos for react-gsap-enhancer"
          iconElementLeft={
            <IconButton
              iconClassName='fa fa-github'
              onClick={this.handleClickGithub}/>
          }>
          <DropDownMenu
            selectedIndex = {findIndex(menuItems, item => {
              var {name} = this.context.router.getCurrentParams()
              return item.name === name
            })}
            onChange = {this.handleNavChange}
            menuItems = {menuItems} />
        </AppBar>
        <div style={{display: 'flex', flex: 1}}>
          <RouteHandler/>
        </div>
      </div>
    )
  }
}

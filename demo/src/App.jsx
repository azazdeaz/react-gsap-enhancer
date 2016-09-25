import React from 'react'
import demoSources from './demoSources'
import map from 'lodash/collection/map'
import findIndex from 'lodash/array/findIndex'
import startCase from 'lodash/string/startCase'

import {AppBar, IconButton, DropDownMenu, MenuItem} from 'material-ui'

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

var menuItems = [
  // { type: MenuItem.Types.SUBHEADER, text: 'Demos:' },
  ...map(demoSources, (source, name) => {
    return { route: '/demo/' + name, text: startCase(name), name }
  })
]

class App extends React.Component {

  static contextTypes = {
    router: React.PropTypes.func
  }

  showNav = () => {
    this.refs.leftNav.toggle()
  }

  handleNavChange = (_, __, route) => {
    this.props.history.pushState(null, route)
  }

  handleClickGithub = () => {
    window.open('https://github.com/azazdeaz/react-gsap-enhancer')
  }

  render () {
    const {params} = this.props
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
          }}>
          <AppBar
            title="Demos for react-gsap-enhancer"
            iconElementLeft={
              <IconButton
                iconClassName='fa fa-github'
                onClick={this.handleClickGithub}/>
            }>
            <DropDownMenu
              value = {menuItems.find(item => {
                var {name} = params
                return item.name === name
              }).route}
              onChange={this.handleNavChange}
            >
              {menuItems.map(item => <MenuItem
                key={item.route}
                primaryText={item.text}
                value={item.route}
              />)}
            </DropDownMenu>
          </AppBar>
          <div style={{display: 'flex', flex: 1}}>
            {this.props.children}
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App

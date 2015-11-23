import React from 'react'
import demoSources from './demoSources'
import map from 'lodash/collection/map'
import findIndex from 'lodash/array/findIndex'
import startCase from 'lodash/string/startCase'

import {AppBar, IconButton, DropDownMenu, MenuItem} from 'material-ui'
import RawTheme from 'material-ui/lib/styles/raw-themes/dark-raw-theme'
import ThemeManager from 'material-ui/lib/styles/theme-manager'
import ThemeDecorator from 'material-ui/lib/styles/theme-decorator'

var menuItems = [
  { type: MenuItem.Types.SUBHEADER, text: 'Demos:' },
  ...map(demoSources, (source, name) => {
    return { route: '/demo/' + name, text: startCase(name), name }
  })
]

@ThemeDecorator(ThemeManager.getMuiTheme(RawTheme))
export default class App extends React.Component {

  static contextTypes = {
    router: React.PropTypes.func
  }

  showNav = () => {
    this.refs.leftNav.toggle()
  }

  handleNavChange = (e, idx, payload) => {
    this.props.history.pushState(null, payload.route)
  }

  handleClickGithub = () => {
    window.open('https://github.com/azazdeaz/react-gsap-enhancer')
  }

  render () {
    const {params} = this.props
    return (
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
            selectedIndex = {findIndex(menuItems, item => {
              var {name} = params
              return item.name === name
            })}
            onChange = {this.handleNavChange}
            menuItems = {menuItems} />
        </AppBar>
        <div style={{display: 'flex', flex: 1}}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

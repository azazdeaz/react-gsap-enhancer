import React from 'react'
import gsap from 'react-gsap-enhancer'
import Playground from 'component-playground'
import demoSources from './demoSources'

export default class Demo extends React.Component {
  static contextTypes = {
    router: React.PropTypes.func
  }

  componentDidMount() {
    
  }

  render() {
    return <Playground
      noRender = {false}
      es6Console = {false}
      codeText = {demoSources[this.props.params.name]}
      scope = {{React, gsap, GS_GREEN: '#88ce02'}}/>
  }
}

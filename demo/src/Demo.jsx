import React from 'react'
import GSAP from 'react-gsap-enhancer'
import Radium from 'radium'
import Playground from 'component-playground'
import demoSources from './demoSources'
import {Spring} from 'react-motion'
import customDrag from 'react-matterkit/lib/custom-drag'

function radDiff(a, b) {
  var {PI} = Math
  var diff = b - a
  diff = ((diff + PI) % PI*2) - PI
  return diff
}

export default class Demo extends React.Component {
  static contextTypes = {
    router: React.PropTypes.func
  }

  constructor(params) {
    super(params)
    this.state = {
      demoName: this.props.params.name
    }
  }

  componentDidMount() {
    window.onNameParamChange = name => {
      this.setState({demoName: name})
    }
  }
  render() {
    var {demoName} = this.state

    return <Playground
      key = {demoName}
      noRender = {false}
      es6Console = {false}
      codeText = {demoSources[demoName]}
      scope = {{
        React,
        GSAP,
        Radium,
        Spring,
        customDrag,
        radDiff,
        GS_GREEN: '#88ce02'
      }}/>
  }
}

import React from 'react'
import gsap from 'react-gsap-enhancer'
import Playground from 'component-playground'
import demoSources from './demoSources'

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
      scope = {{React, gsap, GS_GREEN: '#88ce02'}}/>
  }
}

import React from 'react'
import GreenSock from 'react-gsap-hoc'
import Playground from 'component-playground'
import demoSources from './demoSources'

export default class Demo extends React.Component {
  render() {
    return <Playground
      noRender = {false}
      es6Console = {false}
      codeText = {demoSources[this.props.params.name]}
      scope = {{React, GreenSock}}/>
  }
}

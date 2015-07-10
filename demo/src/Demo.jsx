import React from 'react'
import Playground from 'component-playground'
import demoSources from './demoSources'

export default class Demo extends React.Component {
  render() {
    return <Playground
      codeText={demoSources[this.props.params.name]}
      scope={{React: React}}/>
  }
}

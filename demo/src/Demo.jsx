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

// PI = math.pi
// TAU = 2*PI
// def smallestSignedAngleBetween(x, y):
//     a = (x - y) % TAU
//     b = (y - x) % TAU
//     return -a if a < b else b

function radDiff(x, y) {
  var PI = Math.PI
  var TAU = 2 * PI
  var a = (x - y) % TAU
  var b = (y - x) % TAU
  return a < b ? -a : b
}

// int d = Math.abs(a - b) % 360;
// int r = d > 180 ? 360 - d : d;
// int sign = (a - b >= 0 && a - b <= 180) || (a - b <=-180 && a- b>= -360) ? 1 : -1;
// r *= sign;
function radDiff(a, b) {
  var PI = Math.PI
  var TAU = 2 * PI
  var d = Math.abs(a - b) % TAU
  var r = d > PI ? TAU - d : d
  var sign = (a - b >= 0 && a - b <= 180) || (a - b <=-180 && a- b>= -360) ? 1 : -1
  return r * sign
}

class Center {
  render() {
    return <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {this.props.children}
    </div>
  }
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
        GS_GREEN: '#88ce02',
        Center
      }}/>
  }
}

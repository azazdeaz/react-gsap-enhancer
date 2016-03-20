import React from 'react'
import ReactDOM from 'react-dom'
import TransitionGroup from 'react-addons-transition-group'
import GSAP from 'react-gsap-enhancer'
import Radium from 'radium'
import Playground from '@azazdeaz/component-playground'
import demoSources from './demoSources'
import {Spring} from 'react-motion'
import customDrag from 'custom-drag'
import _ from 'lodash'

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

class Center extends React.Component {
  render() {
    const {children, style, onClick} = this.props

    return <div onClick={onClick} style={{
        ...style,
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {children}
    </div>
  }
}

class Text extends React.Component {
  render() {
    var style = {
      position: 'absolute',
      width: '100%',
      color: '#555',
      fontSize: '30px',
      fontFamily: '"Signika Negative",sans-serif',
      fontWeight: '300',
      textAlign: 'center',
      padding: '30px 0 20px',
    }
    return (
      <span style={style}>
        {this.props.children}
      </span>
    )
  }
}

export default class Demo extends React.Component {
  static contextTypes = {
    router: React.PropTypes.func
  }

  render() {
    const {name} = this.props.routeParams

    return <Playground
      key = {name}
      noRender = {false}
      es6Console = {false}
      codeText = {demoSources[name]}
      scope = {{
        React,
        ReactDOM,
        GSAP,
        Radium,
        Spring,
        customDrag,
        radDiff,
        GS_GREEN: '#88ce02',
        Center,
        Text,
        _,
        TransitionGroup,
      }}/>
  }
}

var React = require('react')
var GSAP = require('../../src/gsap-enhancer')

function animationSource(utils) {
  var target = utils.getTargetByKeys(['target'])
  console.log({target})
  return new TimelineMax({repeat: -1})
    .from(target, 1.2, {scale: 2, rotation: 182, backgroundColor: '#85144b'})
    .time(0.6)
}

var App = React.createClass({
  componentWillMount: function () {
    console.log('componentWillMount')
    this.addAnimation(animationSource)
  },

  render: function () {
    return React.createElement('div', {
      key: 'target',
      style: {
        position: 'absolute',
        width: 124,
        height: 124,
        backgroundColor: '#7FDBFF'
      }
    })
  },
})

module.exports = GSAP()(App)

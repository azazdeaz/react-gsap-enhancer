import React, {Component} from 'react'
import attachRefs from './attachRefs'
import Animation from './Animation'

export default function (createTimeline) {
  return function (EnhancedCompoent) {
    return class GSAPEnhancer extends Component {
      constructor(props) {
        super(props)
        this.itemTree = new Map()
        this.activeAnimations = []
      }

      saveInlineStyles() {
        this.walkItemTree(item => {
          item.savedStyle = item.node.getAttribute('style')
        })
      }

      saveInlineStyles() {
        this.walkItemTree(item => {
          item.node.setAttribute('style', item.savedStyle)
        })
      }

      walkItemTree(callback) {
        function walk(map) {
          map.forEach(item => {
            if (item.node) {
              callback(item)
              if (item.children) {
                walk(item.children)
              }
            }
          })
        }
        walk(this.itemTree)
      }

      componentWillUpdate() {
        this.activeAnimations.forEach(animation => animation.detach())
        this.restoreRenderedStyles()
      }

      render () {
        var props = {...this.props, timeline: this.timeline}
        return attachRefs(<EnhancedCompoent {...props}/>, this.itemTree)
      }

      componentDidUpdate() {
        this.saveRenderedStyles()
        this.activeAnimations.forEach(animation => animation.attach())
      }
    }
  }
}

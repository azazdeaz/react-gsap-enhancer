import React, {Component, Children} from 'react'

export default function (createTimeline) {
  return function (EnhancedCompoent) {
    return class GSAPEnhancer extends Component {
      constructor(props) {
        super(props)

        this.itemTree = new Map()
      }

      attachRefs(element, itemMap, idx) {
        var {key} = element
        if (key === null) {
          key = idx
        }

        var item
        if (itemMap.has(key)) {
          item = itemMap.get(key)
        }
        else {
          item = itemMap.set(key, {children: new Map()}).get(key)
        }

        if (!item.ref) {
          item.ref = (component) => {
            item.component = component
            item.node = React.findDOMNode(component)
          }
        }

        var children = Children.map(element.props.children, child => {
          return this.attachRefs(child, item.children)
        })

        element = React.cloneElement(element, {children, ref: item.ref})
      }

      render () {
        var props = {...this.props, timeline: this.timeline}
        return this.attachRefs(<EnhancedCompoent {...props}/>, this.itemTree)
      }
    }
  }
}

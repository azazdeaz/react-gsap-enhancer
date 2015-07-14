import React, {Children} from 'react'
import isArray from 'lodash/lang/isArray'

export default function attachRefs(element, itemMap, idx) {
  var {key} = element
  if (key === null) {
    key = idx
  }

  var item
  if (itemMap.has(key)) {
    item = itemMap.get(key)
  }
  else {
    item = itemMap.set(key, {
      children: new Map(),
      target: [null]
    }).get(key)
  }

  if (!item.ref) {
    item.ref = (component) => {
      console.log('item.ref', key, component)
      var node = React.findDOMNode(component)
      item.component = component
      item.target[0] = node
      item.node = node
    }
  }

  var children
  if (isArray(element.props.children)) {
    children = Children.map(element.props.children, child => {
      return cloneChild(child, item.children)
    })
  }
  else {
    //it's an only child whitout array wraper
    children = cloneChild(element.props.children)
  }

  function cloneChild(child) {
    if (React.isValidElement(child)) {
      return attachRefs(child, item.children)
    }
    else {
      return child
    }
  }

  return React.cloneElement(element, {children, ref: item.ref})
}

import React, {Children} from 'react'
import isArray from 'lodash/lang/isArray'

export default function attachRefs(element, itemMap, idx) {
  var {key, ref: previousRef} = element
  if (key === null) {
    key = idx
  }

  if (typeof previousRef === 'string') {
    throw Error('Cannot connect GSAP Enhancer to an element with an existing string ref. ' +
    'Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. ' +
    'Read more: https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute')
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
      var node = React.findDOMNode(component)
      item.component = component
      item.target[0] = node
      item.node = node

      if (typeof previousRef === 'function') {
        previousRef(component)
      }
    }
  }

  var children
  if(isArray(element.props.children)) {
    children = Children.map(element.props.children, (child, childIdx) => {
      return cloneChild(child, childIdx)
    })
  }
  else {
    children = cloneChild(element.props.children)
  }

  function cloneChild(child, childIdx) {
    if (React.isValidElement(child)) {
      return attachRefs(child, item.children, childIdx)
    }
    else {
      return child
    }
  }

  return React.cloneElement(element, {children, ref: item.ref})
}

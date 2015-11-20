import React, {Children, isValidElement} from 'react'
import ReactDOM from 'react-dom'

export default function attachRefs(element, itemMap, idx = 0) {
  var {key, ref: previousRef} = element
  if (key === null) {
    key = idx
  }

  if (typeof previousRef === 'string') {
    throw Error(`[react-gsap-enhancer] On one of the elements you have used a `
      + `string ref ("${previousRef}") but react-gsap-enhancer can only handle `
      + `callback refs. Please migrate the string refs to callback refs in the `
      + `enhanced component.
Example: change <div ref='foo'/> to <div ref={comp => this.foo = comp}/>
See also: https://github.com/azazdeaz/react-gsap-enhancer/issues/3`)
  }

  var item
  if (itemMap.has(key)) {
    item = itemMap.get(key)
  }
  else {
    item = {children: new Map()}
    itemMap.set(key, item)
  }

  if (!item.ref) {
    item.ref = (component) => {
      var node = ReactDOM.findDOMNode(component)
      item.props = element.props
      item.node = node

      if (typeof previousRef === 'function') {
        previousRef(component)
      }
    }
  }

  const originalChildren = element.props.children
  let children
  if (typeof originalChildren !== 'object') {
    children = originalChildren
  }
  else if (isValidElement(originalChildren)) {
    children = cloneChild(originalChildren)
  }
  else {
    children = Children.map(originalChildren, (child, childIdx) => {
      return cloneChild(child, childIdx)
    })
  }

  function cloneChild(child, childIdx) {
    if (React.isValidElement(child)) {
      return attachRefs(child, item.children, childIdx)
    }
    else {
      return child
    }
  }

  return React.cloneElement(element, {ref: item.ref, children})
}

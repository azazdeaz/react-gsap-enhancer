import React, {Children} from 'react'

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
    item = itemMap.set(key, {children: new Map()}).get(key)
  }

  if (!item.ref) {
    item.ref = (component) => {
      item.component = component
      item.node = React.findDOMNode(component)
    }
  }

  var children = Children.map(element.props.children, child => {
    return attachRefs(child, item.children)
  })

  return React.cloneElement(element, {children, ref: item.ref})
}

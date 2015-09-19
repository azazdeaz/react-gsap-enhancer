export function walkItemTree(itemTree, callback) {
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
  walk(itemTree)
}

export function reattachAll(itemTree, runningAnimations) {
  restoreRenderedStyles(itemTree)
  attachAll(runningAnimations)
}

export function attachAll(runningAnimations) {
  runningAnimations.forEach(animation => animation.attach())
}

export function restoreRenderedStyles(itemTree) {
  walkItemTree(itemTree, item => {
    const savedAttributeNames = Object.keys(item.savedAttributes || {})
    //restore the original attribute values
    savedAttributeNames.forEach(name => {
      item.node.setAttribute(name, item.savedAttributes[name])
    })
    //remove the attributes added after the render
    for (let i = 0; i < item.node.attributes.length; ++i) {
      const name = item.node.attributes[i].name
      if (savedAttributeNames.indexOf(name) === -1) {
        item.node.removeAttribute(name)
        --i
      }
    }
  })
}

export function saveRenderedStyles(itemTree) {
  walkItemTree(itemTree, item => {
    item.savedAttributes = {}
    for (let i = 0; i < item.node.attributes.length; ++i) {
      const attribute = item.node.attributes[i]
      const name = attribute.name
      const value = attribute.value
      item.savedAttributes[name] = value
    }
    item.node._gsTransform = null
    item.node._gsTweenID = null
  })
}

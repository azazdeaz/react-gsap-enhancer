import select from './select'

export default function getTargetByKeys(itemTree, keyPath) {
  var item = {children: itemTree}

  keyPath.forEach(key => {
    if (key === select.ROOT) {
      itemTree.forEach(_item => {
        if (_item.node) {
          item = _item
        }
      })
    }
    else {
      item = item.children.get(key)
    }
  })

  return item.node
}

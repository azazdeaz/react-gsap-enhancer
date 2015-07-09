export default class Timeline {
  constructor(createTimeline, keyTree) {
    this.keyTree = keyTree
    this.timeline = 
  }

  getDOMNodeByKeys = (keyPath) => {
    var item = {children: this.keyTree}

    keyPath.forEach(key => {
      item = item.children.get(key)
    })

    return item.node
  }
}

export default class Animation {
  constructor(createAnimation, keyTree) {
    this._createAnimation = createAnimation
    this._keyTree = keyTree
  }

  refreshTimeilne() {
    var oldTimeline = this.timeline
    this.timeline = this._createTimeline(this.getDOMNodeByKeys)

    if (oldTimeline) {
      this.timeline.time(oldTimeline.time())
    }
  }

  getDOMNodeByKeys = (keyPath) => {
    var item = {children: this.keyTree}

    keyPath.forEach(key => {
      item = item.children.get(key)
    })

    return item.node
  }
}

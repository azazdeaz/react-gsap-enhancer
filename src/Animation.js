export default class Animation {
  constructor(createGSAPAnimation, keyTree) {
    this._createAnimation = createAnimation
    this._keyTree = keyTree
    this._time = undefined
  }

  detach() {
    if (this._gsapAnimation) {
      this._time = this._gsapAnimation.time()
      this._gsapAnimation.kill()
    }
  }

  attach() {
    this._gsapAnimation = this._createGSAPAnimation(this.getDOMNodeByKeys)
    if (this._time !== undefined) {
      this._gsapAnimation.time(this._time)
    }
  }
  // 
  // refreshTimeilne() {
  //   var oldTimeline = this.timeline
  //   this.timeline = this._createTimeline(this.getDOMNodeByKeys)
  //
  //   if (oldTimeline) {
  //     this.timeline.time(oldTimeline.time())
  //   }
  // }

  getDOMNodeByKeys = (keyPath) => {
    var item = {children: this._keyTree}

    keyPath.forEach(key => {
      item = item.children.get(key)
    })

    return item.node
  }
}

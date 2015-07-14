export default class Animation {
  constructor(createGSAPAnimation, options, getTargetByKeys) {
    this._createGSAPAnimation = createGSAPAnimation
    this._getTargetByKeys = getTargetByKeys
    this._time = undefined
  }

  detach() {
    if (this._gsapAnimation) {
      this._time = this._gsapAnimation.time()
      this._gsapAnimation.pause()
    }
  }

  attach() {
    if (!this._gsapAnimation) {
      this._gsapAnimation = this._createGSAPAnimation(this._getTargetByKeys)
    }
    else {
      this._gsapAnimation
        .invalidate()
        .restart()
    }

    if (this._time !== undefined) {
      this._gsapAnimation.time(this._time)
    }
  }
}

// (() => {
//   ['play'].forEach(fnName => {
//     Animation.prototype[fnName] = function (...args) {
//       this._gsapAnimation[fnName](...args)
//     }
//   })
// })()

// Animation.prototype.play = function (...args) {
//   this._gsapAnimation.play(...args)
// }

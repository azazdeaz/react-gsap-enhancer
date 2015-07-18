export default class Animation {
  constructor(gsapAnimationFactory, options, getTargetByKeys) {
    this._gsapAnimationFactory = gsapAnimationFactory
    this._getTargetByKeys = getTargetByKeys
    this._time = undefined
  }

  replaceGSAPAnimationFactory(gsapAnimationFactory) {
    if (this._gsapAnimation) {
      this._time = this._gsapAnimation.time()
      this._gsapAnimation.kill()
      this._gsapAnimationFactory = gsapAnimationFactory
    }
  }

  detach() {
    if (this._gsapAnimation) {
      this._time = this._gsapAnimation.time()
      this._gsapAnimation.pause()
    }
  }

  attach() {
    if (!this._gsapAnimation) {
      this._gsapAnimation = this._gsapAnimationFactory(this._getTargetByKeys)
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

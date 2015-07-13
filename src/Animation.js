export default class Animation {
  constructor(createGSAPAnimation, options, getDOMNodeByKeys) {
    this._createGSAPAnimation = createGSAPAnimation
    this._getDOMNodeByKeys = getDOMNodeByKeys
    this._time = undefined
  }

  detach() {
    if (this._gsapAnimation) {
      this._time = this._gsapAnimation.time()
      this._gsapAnimation.kill()
    }
  }

  attach() {
    this._gsapAnimation = this._createGSAPAnimation(this._getDOMNodeByKeys)
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

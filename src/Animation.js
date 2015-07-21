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
      this._gsapAnimation = this._gsapAnimationFactory({
        getTargetByKeys: this._getTargetByKeys
      })
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


function bindAPI() {
  var TweenMaxMethods = ['delay', 'duration', 'endTime', 'eventCallback', 'invalidate', 'isActive', 'kill', 'pause', 'paused', 'play', 'progress', 'repeat', 'repeatDelay', 'restart', 'resume', 'reverse', 'reversed', 'seek', 'startTime', 'time', 'timeScale', 'totalDuration', 'totalProgress', 'totalTime', 'updateTo', 'yoyo']
  var TimelineMaxMethods = ['recent', 'add', 'addCallback', 'addLabel', 'addPause', 'call', 'clear', 'currentLabel', 'duration', 'endTime', 'eventCallback', 'from', 'fromTo', 'getActive', 'getChildren', 'getLabelAfter', 'getLabelBefore', 'getLabelsArray', 'getLabelTime', 'getTweensOf', 'invalidate', 'isActive', 'kill', 'pause', 'paused', 'play', 'progress', 'remove', 'removeCallback', 'removeLabel', 'render', 'repeat', 'repeatDelay', 'restart', 'resume', 'reverse', 'reversed', 'seek', 'set', 'shiftChildren', 'staggerFrom', 'staggerFromTo', 'staggerTo', 'startTime', 'time', 'timeScale', 'to', 'totalDuration', 'totalProgress', 'totalTime', 'tweenFromTo', 'tweenTo', 'useFrames', 'yoyo']

  TweenMaxMethods.concat(TimelineMaxMethods).forEach(fnName => {
    Animation.prototype[fnName] = function (...args) {
      if (typeof this._gsapAnimation[fnName] === 'function') {
        this._gsapAnimation[fnName](...args)
        return this
      }
      else {
        throw Error(`Animation source has no method: '${fnName}'`)
      }
    }
  })
}
bindAPI()

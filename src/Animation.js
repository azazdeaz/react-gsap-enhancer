import select from './select'

export default class Animation {
  constructor(animationSource, options, getTargetByKeys, reattachAll) {
    this._animationSource = animationSource
    this._getTargetByKeys = getTargetByKeys
    this._reattachAll = reattachAll
  }

  replaceAnimationSource(animationSource) {
    if (this._gsapAnimation) {
      this.detach()
      this._gsapAnimation.kill()
      this._gsapAnimation = undefined
      this._animationSource = animationSource
      this._reattachAll()
    }
    else {//it's not attached yet
      this._animationSource = animationSource
    }
  }

  attach() {
    if (this._gsapAnimation) {
      let time = this._gsapAnimation.time()
      let paused = this._gsapAnimation.paused()
      this._gsapAnimation
        .invalidate()
        .restart()
        .time(time)

      if (paused) {
        this._gsapAnimation.pause()
      }
    }
    else {
      this._gsapAnimation = this._animationSource({
        select,
        getTargetByKeys: this._getTargetByKeys
      })
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

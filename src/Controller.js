export default class Controller {
  constructor(
    animationSource,
    options,
    target,
    onNeedReattachAllAninmations,
    remove
  ) {
    this._animationSource = animationSource
    this._target = target
    this._options = options
    this._onNeedReattachAllAninmations = onNeedReattachAllAninmations
    this._remove = remove
    this._commandsWaitingForAttach = []
  }

  //Not documented. For internal usage. (animachine)
  replaceAnimationSource(animationSource) {
    if (this._gsapAnimation) {
      this._gsapAnimation.kill()
      this._gsapAnimation = undefined
      this._animationSource = animationSource
      this._onNeedReattachAllAninmations()
    }
    else {//it's not attached yet
      this._animationSource = animationSource
    }
  }

  attach() {
    if (this._gsapAnimation) {
      let time = this._gsapAnimation.time()
      let paused = this._gsapAnimation.paused()
      let reversed = this._gsapAnimation.reversed()
      this._gsapAnimation
        .invalidate()
        .restart()
        .time(time, true) //suppress events - http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/time/
        .paused(paused)
        .reversed(reversed)
    }
    else {
      this._gsapAnimation = this._animationSource({
        target: this._target,
        options: this._options,
      })

      if (__DEV__) {
        if (
          !this._gsapAnimation ||
          typeof this._gsapAnimation.play !== 'function'
        ) {
          throw Error(`[react-gsap-enhancer] The return value of the animation `
            + `source doesn't seems to be a GSAP Animation`
            + `\nCheck out this animation source: \n${this._animationSource}`
            + `\nbecause it returned this value: ${this._gsapAnimation}`
            + `\n\n`
            + `If you're using something like TweenMax.staggerTo() witch returns`
            + ` an array of GSAP Animations please use Timeline (like`
            + ` TimelineMax.staggerTo()) instead. It has the same effect`
            + ` but returns one object.`)
        }
      }
    }

    this._commandsWaitingForAttach
      .splice(0)
      .forEach(({fnName, args}) => this[fnName](...args))
  }

  kill() {
    if (this._gsapAnimation) {
      this._gsapAnimation.kill()
    }
    this._remove(this)
  }
}



const EXPOSED_METHODS = [
  'currentLabel', 'delay', 'duration', 'endTime', 'eventCallback', 'from',
  'fromTo', 'getLabelAfter', 'getLabelArray', 'getLabelBefore', 'getLabelTime',
  'invalidate', 'isActive', 'pause', 'paused', 'play', 'progress', 'restart',
  'resume', 'reverse', 'reversed', 'seek', 'startTime', 'time', 'timeScale',
  'totalDuration', 'totalProgress', 'totalTime', 'tweenFromTo', 'tweenTo'
]

const ONLY_GETTER_METHODS = [
  'delay',
  'duration',
  'startTime',
  'totalDuration',
  'totalProgress',
  'totalTime',
  'endTime'
]

function bindAPI() {
  EXPOSED_METHODS
    //remove duplications
    .filter((item, pos, arr) => arr.indexOf(item) === pos)
    .forEach(fnName => {
      Controller.prototype[fnName] = function (...args) {
        let result
        const onlyGetter = ONLY_GETTER_METHODS.indexOf(fnName) !== -1

        if (!this._gsapAnimation) {
          //if the animation doesn't attached yet, schedule the API call
          this._commandsWaitingForAttach.push({fnName, args})
        }
        else if (typeof this._gsapAnimation[fnName] === 'function') {
          if (__DEV__) {
            if (onlyGetter && args.length !== 0) {
              console.warn(
                `[react-gsap-enhancer] controller.${fnName} is only a getter `
                + `but it looks like you tried to use as a getter by calling `
                + `it with the following arguments: "${args}"`
              )
            }
          }

          result = onlyGetter
            ? this._gsapAnimation[fnName]()
            : this._gsapAnimation[fnName](...args)
        }
        else {
          throw Error(
            `[react-gsap-enhancer] Animation source has no method: '${fnName}.'`
            + `\nYou maybe tryed to use an only TweenMax method on TweenLite instance`
            + `\nCheck GSAP docs for more detailes: http://greensock.com/docs/#/HTML5/GSAP/`
          )
        }
        return result === this._gsapAnimation ? this : result
      }
    })
}
bindAPI()

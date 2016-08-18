import {isValidElement} from 'react'
import attachRefs from './attachRefs'
import Controller from './Controller'
import createTarget from './createTarget'
import {
  reattachAll,
  attachAll,
  restoreRenderedStyles,
  saveRenderedStyles
} from './utils'

export default function (animationSourceMap) {
  if (
    animationSourceMap &&
    animationSourceMap.prototype &&
    animationSourceMap.prototype.render
  ) {
    const ComposedComponent = animationSourceMap
    return enhance(undefined, ComposedComponent)
  }
  else {
    return enhance.bind(undefined, animationSourceMap)
  }
}

function enhance (animationSourceMap, ComposedComponent) {
  class GSAPEnhancer extends ComposedComponent {
    constructor(props) {
      super(props)
      this.__itemTree = new Map()
      this.__runningAnimations = new Set()
      this.__animationSourceMap = animationSourceMap
    }

    addAnimation = (animationSource, options) => {
      //if the animation is in the source map the if from there
      const sourceMap = this.__animationSourceMap
      if (sourceMap && sourceMap[animationSource]) {
        animationSource = sourceMap[animationSource]
      }

      if (__DEV__) {
        if (typeof animationSource !== 'function') {
          let error = `[react-gsap-enhancer] animationSource (the first parameter of `
            + `addAnimation(animationSource, options)) has to be a function instead of "${animationSource}"`
          if (sourceMap) {
            error += `\nYou provided a sourceMap so the animationSource also can`
             + ` be a string key of these: [${Object.keys(sourceMap)}]`
          }
          const name = Object.getPrototypeOf(Object.getPrototypeOf(this)).constructor.name
          error += `\nCheck out the addAnimation() call in ${name}`
          throw Error(error)
        }
      }

      const target = createTarget(this.__itemTree)
      const controller = new Controller(
        animationSource,
        options,
        target,
        () => reattachAll(
          this.__itemTree,
          this.__runningAnimations
        ),
        () => {
          this.__runningAnimations.delete(controller)
          //rerender the component without the animation
          this.forceUpdate()
        }
      )
      this.__runningAnimations.add(controller)
      //the animation will be attached on the next render so force the update
      this.forceUpdate()

      return controller
    }

    removeAnimation(controller) {
      if (__DEV__) {
        console.warn(
          '[react-gsap-enhancer] component.removeAnimation(controller)'
          + ' is deprecated. Use just controller.kill() instead!'
        )
      }
      controller.kill()
    }

    componentDidMount(...args) {
      saveRenderedStyles(this.__itemTree)

      if (super.componentDidMount) {
        super.componentDidMount(...args)
      }
    }

    componentWillUpdate(...args) {
      restoreRenderedStyles(this.__itemTree)

      if (super.componentWillUpdate) {
        super.componentWillUpdate(...args)
      }
    }

    render(...args) {
      const element = super.render(...args)
      if (isValidElement(element)) {
        return attachRefs(element, this.__itemTree)
      }
      else {
        //let React throwing an error for invalid element
        return element
      }
    }

    componentDidUpdate(...args) {
      saveRenderedStyles(this.__itemTree)
      attachAll(this.__runningAnimations)

      if (super.componentDidUpdate) {
        super.componentDidUpdate(...args)
      }
    }
  }


  //TODO test this
  // Class inheritance uses Object.create and because of __proto__ issues
  // with IE <10 any static properties of the superclass aren't inherited and
  // so need to be manually populated
  // See http://babeljs.io/docs/advanced/caveats/#classes-10-and-below-
  // var staticKeys = [
  //   'defaultProps',
  //   'propTypes',
  //   'contextTypes',
  //   'childContextTypes'
  // ]
  //
  // staticKeys.forEach((key) => {
  //   if (ComposedComponent.hasOwnProperty(key)) {
  //     GSAPEnhancer[key] = ComposedComponent[key]
  //   }
  // })

  //TODO test this
  // if (process.env.NODE_ENV !== 'production') {
  //   // This fixes React Hot Loader by exposing the original components top level
  //   // prototype methods on the enhanced prototype as discussed in
  //   // https://github.com/FormidableLabs/radium/issues/219
  //   Object.keys(ComposedComponent.prototype).forEach(key => {
  //     if (!GSAPEnhancer.prototype.hasOwnProperty(key)) {
  //       var descriptor = Object.getOwnPropertyDescriptor(ComposedComponent.prototype, key)
  //       Object.defineProperty(GSAPEnhancer.prototype, key, descriptor)
  //     }
  //   })
  // }

  const composedName = ComposedComponent.displayName || ComposedComponent.name || 'Component'
  const displayName = `GSAP(${composedName})`
  Object.defineProperty(GSAPEnhancer, 'displayName', { value: displayName, writable: true, configurable: true })

  return GSAPEnhancer
}

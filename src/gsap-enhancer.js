import attachRefs from './attachRefs'
import Animation from './Animation'
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

    addAnimation = (createGSAPAnimation, options) => {
      //if the animation is in the source map the if from there
      const sourceMap = this.__animationSourceMap
      if (sourceMap && sourceMap[createGSAPAnimation]) {
        createGSAPAnimation = sourceMap[createGSAPAnimation]
      }

      const target = createTarget(this.__itemTree).find()
      const animation = new Animation(
        createGSAPAnimation,
        options,
        target,
        () => reattachAll(
          this.__itemTree,
          this.__runningAnimations
        ),
      )
      this.__runningAnimations.add(animation)
      //the animation will be attached on the next render so force the update
      this.forceUpdate()

      return animation
    }

    removeAnimation(animation) {
      animation.kill()
      this.__runningAnimations.delete(animation)
      //rerender the component without the animation
      this.forceUpdate()
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
      return attachRefs(super.render(...args), this.__itemTree)
    }

    componentDidUpdate(...args) {
      saveRenderedStyles(this.__itemTree)
      attachAll(this.__runningAnimations)

      if (super.componentDidUpdate) {
        super.componentDidUpdate(...args)
      }
    }
  }


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

  if (process.env.NODE_ENV !== 'production') {
  // This fixes React Hot Loader by exposing the original components top level
  // prototype methods on the Radium enhanced prototype as discussed in #219.
    // https://github.com/FormidableLabs/radium/issues/219
    Object.keys(ComposedComponent.prototype).forEach(key => {
      if (!GSAPEnhancer.prototype.hasOwnProperty(key)) {
        var descriptor = Object.getOwnPropertyDescriptor(ComposedComponent.prototype, key)
        Object.defineProperty(GSAPEnhancer.prototype, key, descriptor)
      }
    })
  }

  return GSAPEnhancer
}

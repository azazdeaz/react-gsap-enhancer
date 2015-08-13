import attachRefs from './attachRefs'
import Animation from './Animation'
import getTargetByKeys from './getTargetByKeys'

export default function (animationSourceMap) {
  //TODO throw error if called with a component
  return function enhance (ComposedComponent) {
    class GSAPEnhancer extends ComposedComponent {
      constructor(props) {
        super(props)
        this.__itemTree = new Map()
        this.__runningAnimations = new Set()
        this.__animationSourceMap = animationSourceMap
      }

      addAnimation = (createGSAPAnimation, options) => {
        //if the animation is in the source map the if from there
        var sourceMap = this.__animationSourceMap
        if (sourceMap && sourceMap[createGSAPAnimation]) {
          createGSAPAnimation = sourceMap[createGSAPAnimation]
        }

        var animation = new Animation(
          createGSAPAnimation,
          options,
          getTargetByKeys.bind(null, this.__itemTree),
          reattachAll.bind(this),
        )
        this.__runningAnimations.add(animation)
        //the animation will ba attached on the next render so force the update
        this.forceUpdate()

        return animation
      }

      removeAnimation(animation) {
        // animation.invalidate()
        animation.kill()
        this.__runningAnimations.delete(animation)

        // //restore the original styles and rerender the remaining animations
        // //to clear the styles added by the removed animaion
        // restoreRenderedStyles.call(this)
        // this.__runningAnimations.forEach(anim => anim.render())
        this.forceUpdate()
      }

      componentDidMount() {
        saveRenderedStyles.call(this)

        if (super.componentDidMount) {
          super.componentDidMount()
        }
      }

      componentWillUpdate() {
        restoreRenderedStyles.call(this)

        if (super.componentWillUpdate) {
          super.componentWillUpdate()
        }
      }

      render() {
        return attachRefs(super.render(), this.__itemTree)
      }

      componentDidUpdate() {
        saveRenderedStyles.call(this)
        attachAll.call(this)

        if (super.componentDidUpdate) {
          super.componentDidUpdate()
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
}


//private functions
//used with fn.call(this, ...)

function reattachAll() {
  restoreRenderedStyles.call(this)
  attachAll.call(this)
}

function attachAll() {
  this.__runningAnimations.forEach(animation => animation.attach())
}

function restoreRenderedStyles() {
  walkItemTree.call(this, item => {
    item.node.setAttribute('style', item.savedStyle)
  })
}

function saveRenderedStyles() {
  walkItemTree.call(this, item => {
    item.savedStyle = item.node.getAttribute('style')
    item.node._gsTransform = null
    item.node._gsTweenID = null
  })
}

function walkItemTree(callback) {
  function walk(map) {
    map.forEach(item => {
      if (item.node) {
        callback(item)
        if (item.children) {
          walk(item.children)
        }
      }
    })
  }
  walk(this.__itemTree)
}

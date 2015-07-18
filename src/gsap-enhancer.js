import attachRefs from './attachRefs'
import Animation from './Animation'

export default function (EnhancedCompoent) {
  class GSAPEnhancer extends EnhancedCompoent {
    constructor(props) {
      super(props)
      this.__itemTree = new Map()
      this.__runningAnimations = new Set()
    }

    addAnimation = (create, options) => {
      var animation = new Animation(
        create,
        options,
        getTargetByKeys.bind(this)
      )
      this.__runningAnimations.add(animation)
      animation.attach()
      return animation
    }

    removeAnimation(animation) {
      this.__runningAnimations.delete(animation)
    }

    componentDidMount() {
      saveRenderedStyles.call(this)

      if (super.componentDidMount) {
        super.componentDidMount()
      }
    }

    componentWillUpdate() {
      this.__runningAnimations.forEach(animation => animation.detach())
      restoreRenderedStyles.call(this)

      if (super.componentWillUpdate) {
        super.componentWillUpdate()
      }
    }

    render () {
      return attachRefs(super.render(), this.__itemTree)
    }

    componentDidUpdate() {
      saveRenderedStyles.call(this)
      this.__runningAnimations.forEach(animation => animation.attach())

      if (super.componentDidUpdate) {
        super.componentDidUpdate()
      }
    }
  }


  // Class inheritance uses Object.create and because of __proto__ issues
  // with IE <10 any static properties of the superclass aren't inherited and
  // so need to be manually populated
  // See http://babeljs.io/docs/advanced/caveats/#classes-10-and-below-
  var staticKeys = [
    'defaultProps',
    'propTypes',
    'contextTypes',
    'childContextTypes'
  ]

  staticKeys.forEach((key) => {
    if (EnhancedCompoent.hasOwnProperty(key)) {
      GSAPEnhancer[key] = EnhancedCompoent[key]
    }
  })

  if (process.env.NODE_ENV !== 'production') {
    // This fixes React Hot Loader by exposing the original components top level
    // prototype methods on the Radium enhanced prototype as discussed in
    // https://github.com/FormidableLabs/radium/issues/219
    Object.keys(EnhancedCompoent.prototype).forEach(key => {
      if (!GSAPEnhancer.prototype.hasOwnProperty(key)) {
        GSAPEnhancer.prototype[key] = EnhancedCompoent.prototype[key]
      }
    })
  }

  return GSAPEnhancer
}


//private functions
//used with fn.call(this, ...)

function getTargetByKeys(keyPath) {
  var item = {children: this.__itemTree}

  keyPath.forEach(key => {
    item = item.children.get(key)
  })

  return item.node
}

function saveRenderedStyles() {
  walkItemTree.call(this, item => {
    item.savedStyle = item.node.getAttribute('style')
    item.node._gsTransform = null
    item.node._gsTweenID = null
  })
}

function restoreRenderedStyles() {
  walkItemTree.call(this, item => {
    item.node.setAttribute('style', item.savedStyle)
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

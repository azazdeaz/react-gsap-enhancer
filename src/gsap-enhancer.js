import attachRefs from './attachRefs'
import Animation from './Animation'

export default function () {
  return function (EnhancedCompoent) {
    return class GSAPEnhancer extends EnhancedCompoent {
      constructor(props) {
        super(props)
        this.__itemTree = new Map()
        this.__runningAnimations = new Set()
      }

      createAnimation = (create, options) => {
        var animation = new Animation(
          create,
          options,
          getDOMNodeByKeys.bind(this)
        )
        this.__runningAnimations.add(animation)
        animation.attach()
        return animation
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
  }
}

function getDOMNodeByKeys(keyPath) {
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

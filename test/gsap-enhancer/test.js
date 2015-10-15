var React = require('react')
var Component = React.Component
var GSAP = require('../../src/gsap-enhancer')
var chai = require('chai')
var spies = require('chai-spies')
var assert = chai.assert
chai.use(spies)
chai.should()

describe('gsap-enhancer', () => {
  it('is a function', () => {
    assert.isFunction(GSAP)
  })

  it('enhances with config call', () => {
    class BaseComponent extends Component {
      render() {}
    }
    const GSAPComponent = GSAP()(BaseComponent)
    const enhancedComponent = new GSAPComponent()
    assert.isFunction(enhancedComponent.addAnimation)
    assert.isFunction(enhancedComponent.removeAnimation)
    assert.isFunction(enhancedComponent.componentDidMount)
    assert.isFunction(enhancedComponent.componentWillUpdate)
    assert.isFunction(enhancedComponent.componentDidUpdate)
    assert.isFunction(enhancedComponent.render)
  })

  it('enhances without config call', () => {
    class BaseComponent extends Component {
      render() {}
    }
    const GSAPComponent = GSAP(BaseComponent)
    const enhancedComponent = new GSAPComponent()
    assert.isFunction(enhancedComponent.addAnimation)
    assert.isFunction(enhancedComponent.removeAnimation)
  })

  describe('adds and removes animation with', () => {
    class BaseComponent extends Component {
      render() {}
    }
    const GSAPComponent = GSAP(BaseComponent)
    const enhancedComponent = new GSAPComponent()
    const animation = enhancedComponent.addAnimation(() => {})
    it('addAnimation()', () => {
      assert.isObject(animation)
    })
    it('removeAnimation()', () => {
      enhancedComponent.removeAnimation(animation)
    })
  })

  describe('replaces strings animationSources from the animationSourceMap', () => {
    class BaseComponent extends Component {
      render() {}
    }
    const animationSource = () => {}
    const GSAPComponent = GSAP({animName: animationSource})(BaseComponent)
    const enhancedComponent = new GSAPComponent()
    const animation = enhancedComponent.addAnimation('animName')
    assert.isObject(animation)
  })

  it('throws for calling addAnimation with invalid animation source', () => {
    class BaseComponent extends Component {
      render() {}
    }
    const GSAPComponent = GSAP({animName(){}})(BaseComponent)
    const enhancedComponent = new GSAPComponent()
    assert.throws(() => enhancedComponent.addAnimation(), 'animName')
  })

  it('throws for calling removeAnimation with non Animation instance', () => {
    class BaseComponent extends Component {
      render() {}
    }
    const GSAPComponent = GSAP({animName(){}})(BaseComponent)
    const enhancedComponent = new GSAPComponent()
    assert.throws(() => enhancedComponent.removeAnimation('wrong value'), 'wrong value')
  })

  it('calls the overridden lifecycle methods of the enhanced component', () => {
    const willMount = chai.spy()
    const didMount = chai.spy()
    const willUpdate = chai.spy()
    const didUpdate = chai.spy()
    const render = chai.spy()

    class BaseComponent extends Component {
      componentWillMount(...args) {willMount(...args)}
      componentDidMount(...args) {didMount(...args)}
      componentWillUpdate(...args) {willUpdate(...args)}
      componentDidUpdate(...args) {didUpdate(...args)}
      render(...args) {
        render(...args)
        return <div/>
      }
    }

    const GSAPComponent = GSAP(BaseComponent)
    const enhancedComponent = new GSAPComponent()

    enhancedComponent.componentWillMount('foo')
    enhancedComponent.componentDidMount('bar')
    enhancedComponent.componentWillUpdate('qux')
    enhancedComponent.componentDidUpdate('baz')
    enhancedComponent.render('taz')

    willMount.should.have.been.called.once.with('foo')
    didMount.should.have.been.called.once.with('bar')
    willUpdate.should.have.been.called.once.with('qux')
    didUpdate.should.have.been.called.once.with('baz')
    render.should.have.been.called.once.with('taz')
  })
})

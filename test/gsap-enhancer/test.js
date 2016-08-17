var React = require('react')
var Component = React.Component
import GSAP from '../../src/gsap-enhancer'
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
  })

  it('throws throws the React error message for invaid render() return value', () => {
    class BaseComponent extends Component {
      render() {}
    }
    const GSAPComponent = GSAP(BaseComponent)
    assert.throws(
      () => React.renderToString(<GSAPComponent/>),
      'A valid ReactComponent must be returned.'
    )
  })

  describe('adds and removes animation with', () => {
    class BaseComponent extends Component {
      render() {}
    }
    const GSAPComponent = GSAP(BaseComponent)
    const enhancedComponent = new GSAPComponent()
    const controller = enhancedComponent.addAnimation(() => {})
    it('addAnimation()', () => {
      assert.isObject(controller)
    })
    it('controller.kill()', () => {
      controller.kill()
    })
    it('removeAnimation(controller) (!deprecated)', () => {
      enhancedComponent.removeAnimation(controller)
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

  describe('displayName', () => {
    it('sets the name correctly with ES6 Class', () => {
      class BaseComponent extends Component {
        render() {}
      }
      const enhancedComponent = GSAP()(BaseComponent)
      assert(enhancedComponent.displayName === 'GSAP(BaseComponent)')
    })

    it('sets the name correctly with static displayName ES6', () => {
      class BaseComponent extends Component {
        static get displayName() { return 'DisplayName' }
        render() {}
      }
      const enhancedComponent = GSAP()(BaseComponent)
      assert(enhancedComponent.displayName === 'GSAP(DisplayName)')
    })

    it('sets the name correctly with static property displayName ES7', () => {
      class BaseComponent extends Component {
        static displayName = 'DisplayName'
        render() {}
      }
      const enhancedComponent = GSAP()(BaseComponent)
      assert(enhancedComponent.displayName === 'GSAP(DisplayName)')
    })

    it('sets the name correctly with React.createClass and displayName', () => {
      const BaseComponent = React.createClass({
        displayName: 'DisplayName',
        render: function() {}
      })
      const enhancedComponent = GSAP()(BaseComponent)
      assert(enhancedComponent.displayName === 'GSAP(DisplayName)')
    })

    it('sets the name correctly with React.createClass', () => {
      const BaseComponent = React.createClass({
        render: function() {}
      })
      const enhancedComponent = GSAP()(BaseComponent)
      assert(enhancedComponent.displayName === 'GSAP(BaseComponent)')
    })
  })
})

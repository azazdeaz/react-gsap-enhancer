var React = require('react')
var Component = React.Component
var GSAP = require('../../src/gsap-enhancer')
var {
  walkItemTree,
  reattachAll,
  attachAll,
  restoreRenderedStyles,
  saveRenderedStyles
} = require('../../src/utils')
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

  it('calls the overridden lifecycle methods of the enhanced component', () => {
    const willMount = chai.spy()
    const didMount = chai.spy()
    const didUpdate = chai.spy()
    const render = chai.spy()

    class BaseComponent extends Component {
      componentWillMount() {willMount()}
      componentDidMount() {didMount()}
      componentDidUpdate() {didUpdate()}
      render() {
        render()
        return <div/>
      }
    }

    const GSAPComponent = GSAP(BaseComponent)
    const enhancedComponent = new GSAPComponent()

    enhancedComponent.componentWillMount()
    enhancedComponent.componentDidMount()
    enhancedComponent.componentDidUpdate()
    enhancedComponent.render()

    willMount.should.have.been.called.once()
    didMount.should.have.been.called.once()
    didUpdate.should.have.been.called.once()
    render.should.have.been.called.once()
  })
})

describe('walkItemTree', () => {
  it('works nested item tree', () => {
    const barNode = {node: {}}
    const bazNode = {node: {}}
    const fooNode = {node: {}, children: new Map([
      ['bar', barNode],
      ['baz', bazNode]
    ])}
    const itemTree = new Map([[0, fooNode]])
    const callback = chai.spy()
    walkItemTree(itemTree, callback)
    callback.should.have.been.called.with(fooNode)
    callback.should.have.been.called.with(barNode)
    callback.should.have.been.called.with(bazNode)
  })
})

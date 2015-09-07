var React = require('react')
var assert = require('chai').assert
var attachRefs = require('../../src/attachRefs')

describe('attachRefs', () => {
  it('is a function', () => {
    assert.isFunction(attachRefs)
  })

  it('throws for string refs', () => {
    assert.throws(() => attachRefs(<div ref='foo'/>, new Map()))
  })

  it('returns a React element', () => {
    const clonedElement = attachRefs(<div key='foo'/>, new Map())
    assert.isTrue(React.isValidElement(clonedElement))
  })

  it('adds the root element to the tree', () => {
    const tree = new Map()
    attachRefs(<div key='foo'/>, tree)
    assert.isTrue(tree.has('foo'))
  })

  it('keeps the original reg on rerender', () => {
    const tree = new Map()
    attachRefs(<div key='foo'/>, tree)
    const foo = tree.get('foo')
    attachRefs(<div key='foo'/>, tree)
    assert.strictEqual(foo, tree.get('foo'))
  })

  it('handles ReactText children', () => {
    const tree = new Map()
    attachRefs(<div key='foo'>
      'string child'
      <div key='baz'/>
    </div>, tree)
    assert.isTrue(tree.get('foo').children.has('baz'))
  })

  it('uses indexes as fallback if there are no keys', () => {
    const tree = new Map()
    attachRefs(<div>
      <div>
        <div/>
      </div>
      <div key='foo'/>
      <div/>
    </div>, tree)

    assert.isTrue(tree.has(0))
    const fooChildren = tree.get(0).children
    assert.isTrue(fooChildren.has(0))
    assert.isTrue(fooChildren.has('foo'))
    assert.isTrue(fooChildren.has(2))
    assert.isFalse(fooChildren.has(3))
    assert.isTrue(fooChildren.get(0).children.has(0))
  })

  it('is handling refs', () => {
    const tree = new Map()
    const component = {render() {}}
    attachRefs(<div key='foo'/>, tree)
    const reg = tree.get('foo')
    assert.isFunction(reg.ref)
    reg.ref(component)
    assert.strictEqual(reg.component, component)
  })

  it('call original refs', () => {
    const tree = new Map()
    const component = {render() {}}
    let called = false
    attachRefs(<div key='foo' ref={comp => {
      assert.strictEqual(comp, component)
      called = true
    }}/>, tree)
    const reg = tree.get('foo')
    assert.isFunction(reg.ref)
    reg.ref(component)
    assert.strictEqual(reg.component, component)
    assert.isTrue(called)
  })

  it('call original refs', () => {
    const tree = new Map()
    const component = {render() {}}
    let called = false
    attachRefs(<div key='foo' ref={comp => {
      assert.strictEqual(comp, component)
      called = true
    }}/>, tree)
    const reg = tree.get('foo')
    assert.isFunction(reg.ref)
    reg.ref(component)
    assert.strictEqual(reg.component, component)
    assert.isTrue(called)
  })
})
